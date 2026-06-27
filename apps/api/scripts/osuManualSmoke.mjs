/* global URL, console, fetch, process */
import crypto from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const REPO_ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const API_ENV_PATH = fileURLToPath(new URL('../.env', import.meta.url));
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const CONTEXT_DIR = join(tmpdir(), 'tryhardnames-rm29-osu-smoke');
const CONTEXT_PATH = join(CONTEXT_DIR, 'context.json');
const AUTHORIZE_SHORTCUT_PATH = join(CONTEXT_DIR, 'authorize.url');
const SENSITIVE_KEYS = new Set([
  'access_token',
  'refresh_token',
  'client_secret',
  'code',
  'token',
  'rawPayload',
  'raw_payload',
  'OSU_CLIENT_SECRET',
  'SUPABASE_SERVICE_ROLE_KEY',
]);

loadEnv({ path: API_ENV_PATH });

const command = process.argv[2] || 'help';

try {
  if (command === 'prepare') {
    await prepare();
  } else if (command === 'complete') {
    await complete();
  } else if (command === 'verify') {
    await verifyOnly();
  } else if (command === 'cleanup') {
    cleanupContext();
    safeLog('RM29_CONTEXT_CLEARED=true');
  } else {
    printHelp();
  }
} catch (error) {
  safeLog(`RM29_SMOKE_ERROR=${safeErrorMessage(error)}`);
  process.exitCode = 1;
}

async function prepare() {
  ensureLocalOnly();
  ensureRequiredEnv();
  mkdirSync(CONTEXT_DIR, { recursive: true });

  const status = await requestJson(`${API_BASE_URL}/api/v1/integrations/osu`);
  assertStatus(status.response.status === 200, 'status endpoint did not return HTTP 200');
  assertStatus(status.body?.runtime?.status === 'configured', 'osu runtime is not configured');
  assertStatus(status.body?.runtime?.tokenStrategy === 'no_refresh_token_storage', 'unexpected token strategy');
  assertNoSensitiveKeys(status.body, 'status response');

  const admin = createAdminClient();
  const owner = await createLocalOwner(admin, 'owner');
  const otherOwner = await createLocalOwner(admin, 'other-owner');
  const passport = await createLocalPassport(admin, owner.userId, 'RM-29 Smoke Passport');
  const otherPassport = await createLocalPassport(admin, otherOwner.userId, 'RM-29 Other Owner Passport');
  const slug = `rm29-osu-${Date.now().toString(36)}`;
  await preparePublicationCommands(owner.accessToken, passport.id, slug);

  const linkIntent = await requestJson(`${API_BASE_URL}/api/v1/integrations/osu/link-intent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${owner.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ passportId: passport.id }),
  });
  assertStatus(linkIntent.response.status === 201, 'link-intent did not return HTTP 201');
  assertStatus(linkIntent.body?.status === 'link_intent_created', 'link-intent response status mismatch');
  assertStatus(typeof linkIntent.body?.authorizeUrl === 'string', 'link-intent did not return authorizeUrl');
  assertStatus(linkIntent.body?.tokenStrategy === 'no_refresh_token_storage', 'link-intent token strategy mismatch');
  assertStatus((linkIntent.body?.scopes || []).join(' ') === 'identify public', 'link-intent scopes mismatch');
  assertNoSensitiveKeys(linkIntent.body, 'link-intent response');

  const authorizeUrl = new URL(linkIntent.body.authorizeUrl);
  const state = authorizeUrl.searchParams.get('state') || '';
  assertStatus(state.length >= 32, 'authorizeUrl state missing or invalid');

  const context = {
    createdAt: new Date().toISOString(),
    apiBaseUrl: API_BASE_URL,
    ownerId: owner.userId,
    ownerAccessToken: owner.accessToken,
    passportId: passport.id,
    otherOwnerId: otherOwner.userId,
    otherOwnerAccessToken: otherOwner.accessToken,
    otherPassportId: otherPassport.id,
    publicSlug: slug,
    oauthState: state,
  };
  writeFileSync(CONTEXT_PATH, JSON.stringify(context, null, 2));
  writeFileSync(AUTHORIZE_SHORTCUT_PATH, `[InternetShortcut]\nURL=${linkIntent.body.authorizeUrl}\n`);

  const opened = openAuthorizeShortcut();

  safeLog('RM29_PREPARE=pass');
  safeLog('STATUS_HTTP=200');
  safeLog('RUNTIME_STATUS=configured');
  safeLog('TOKEN_STRATEGY=no_refresh_token_storage');
  safeLog('OWNER_PREPARED=true');
  safeLog('PASSPORT_PREPARED=true');
  safeLog('OTHER_OWNER_PREPARED=true');
  safeLog('LINK_INTENT_STATUS=201');
  safeLog('AUTHORIZE_URL_READY=true');
  safeLog(`AUTHORIZE_URL_OPENED=${opened}`);
  safeLog('AUTHORIZE_URL_REDACTED=true');
  safeLog('NEXT=authorize osu in the opened browser tab, then run complete');
}

async function verifyOnly() {
  ensureLocalOnly();
  const context = readContext();
  const admin = createAdminClient();
  const linkedAccount = await getLinkedAccount(admin, context, 'verified');
  const proof = await getProof(admin, context, linkedAccount.id, 'current');
  const vault = await verifyTokenVault(admin, context, linkedAccount.id);
  const projection = await publishAndVerifyPrivateProjection(context, admin, linkedAccount, proof);
  await verifyReplayAndAlteredState(context);

  safeLog('RM29_VERIFY=pass');
  safeLog(`LINKED_PROVIDER_ACCOUNT_STATUS=${linkedAccount.status}`);
  safeLog(`LINKED_PROVIDER_ACCOUNT_VISIBILITY=${linkedAccount.visibility}`);
  safeLog(`VERIFIED_PROOF_STATUS=${proof.status}`);
  safeLog(`VERIFIED_PROOF_VISIBILITY=${proof.visibility}`);
  safeLog(`TOKEN_VAULT_ROWS=${vault.rows}`);
  safeLog(`PUBLIC_PROJECTION_BEFORE_UNLINK=${projection.exists}`);
  safeLog('NEGATIVE_REPLAY_AND_ALTERED_STATE=pass');
}

async function complete() {
  ensureLocalOnly();
  const context = readContext();
  const admin = createAdminClient();

  const linkedAccount = await getLinkedAccount(admin, context, 'verified');
  const proof = await getProof(admin, context, linkedAccount.id, 'current');
  const vaultBefore = await verifyTokenVault(admin, context, linkedAccount.id);
  const projectionBefore = await publishAndVerifyPrivateProjection(context, admin, linkedAccount, proof);
  const negatives = await verifyNegativeCases(context, linkedAccount.id);
  const unlink = await unlinkAndVerify(context, admin, linkedAccount.id);
  const projectionAfter = await verifyRevokedProjection(admin, context);

  cleanupContext();

  safeLog('RM29_COMPLETE=pass');
  safeLog('CALLBACK_REAL=pass');
  safeLog(`LINKED_PROVIDER_ACCOUNT_STATUS=${linkedAccount.status}`);
  safeLog(`LINKED_PROVIDER_ACCOUNT_VISIBILITY=${linkedAccount.visibility}`);
  safeLog(`VERIFIED_PROOF_STATUS=${proof.status}`);
  safeLog(`VERIFIED_PROOF_VISIBILITY=${proof.visibility}`);
  safeLog(`TOKEN_VAULT_ROWS_BEFORE_UNLINK=${vaultBefore.rows}`);
  safeLog(`PUBLIC_PROJECTION_BEFORE_UNLINK=${projectionBefore.exists}`);
  safeLog(`UNLINK_STATUS=${unlink.status}`);
  safeLog(`UNLINK_IDEMPOTENT_SECOND_CALL=${unlink.secondIdempotent}`);
  safeLog(`REVOKED_ACCOUNT_STATUS=${unlink.account.status}`);
  safeLog(`REVOKED_ACCOUNT_VISIBILITY=${unlink.account.visibility}`);
  safeLog(`REVOKED_PROOF_STATUS=${unlink.proof.status}`);
  safeLog(`REVOKED_PROOF_VISIBILITY=${unlink.proof.visibility}`);
  safeLog(`PUBLIC_PROJECTION_AFTER_UNLINK=${projectionAfter.exists}`);
  safeLog(`NEGATIVE_CALLBACK_REPLAY_STATUS=${negatives.replayStatus}`);
  safeLog(`NEGATIVE_ALTERED_STATE_STATUS=${negatives.alteredStatus}`);
  safeLog(`NEGATIVE_OTHER_OWNER_UNLINK_STATUS=${negatives.otherOwnerUnlinkStatus}`);
  safeLog(`NEGATIVE_MISSING_AUTH_STATUS=${negatives.missingAuthStatus}`);
  safeLog('CONTEXT_CLEARED=true');
}

async function createLocalOwner(admin, label) {
  const suffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const email = `rm29-${label}-${suffix}@tryhardnames.local`;
  const password = crypto.randomBytes(24).toString('base64url');
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (created.error || !created.data?.user?.id) throw created.error || new Error('owner_create_failed');

  const authClient = createAuthClient();
  const signedIn = await authClient.auth.signInWithPassword({ email, password });
  if (signedIn.error || !signedIn.data?.session?.access_token) {
    throw signedIn.error || new Error('owner_sign_in_failed');
  }

  return {
    userId: created.data.user.id,
    accessToken: signedIn.data.session.access_token,
  };
}

async function createLocalPassport(admin, ownerId, alias) {
  const { data, error } = await admin
    .from('gaming_passports')
    .insert({
      owner_id: ownerId,
      status: 'draft_private',
      alias,
    })
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data?.id) throw new Error('passport_create_failed');
  return data;
}

async function preparePublicationCommands(ownerAccessToken, passportId, slug) {
  const ownerClient = createOwnerClient(ownerAccessToken);
  await rpcSingle(ownerClient, 'set_gaming_passport_publication_consent', {
    target_passport_id: passportId,
    next_consent: true,
  });
  await rpcSingle(ownerClient, 'claim_gaming_passport_slug', {
    target_passport_id: passportId,
    raw_slug: slug,
  });
}

async function publishAndVerifyPrivateProjection(context, admin, linkedAccount, proof) {
  const passport = await getPassport(admin, context.passportId);
  if (passport.status !== 'published') {
    const ownerClient = createOwnerClient(context.ownerAccessToken);
    await rpcSingle(ownerClient, 'publish_gaming_passport', {
      target_passport_id: context.passportId,
    });
  }

  const projection = await getPublicProjection(admin, context.publicSlug);
  assertStatus(Boolean(projection), 'public projection should exist after publish command');
  assertProjectionDoesNotLeak(projection, linkedAccount, proof);
  return { exists: true };
}

async function unlinkAndVerify(context, admin, linkedProviderAccountId) {
  const first = await unlinkRequest(context.ownerAccessToken, context.passportId, linkedProviderAccountId);
  assertStatus(first.response.status === 200, 'owner unlink did not return HTTP 200');
  assertStatus(first.body?.status === 'unlinked', 'owner unlink status mismatch');
  assertStatus(first.body?.result?.status === 'revoked', 'owner unlink result status mismatch');
  assertStatus(first.body?.result?.publicServingAllowed === false, 'unlink should block public serving');

  const second = await unlinkRequest(context.ownerAccessToken, context.passportId, linkedProviderAccountId);
  assertStatus(second.response.status === 200, 'idempotent unlink did not return HTTP 200');
  assertStatus(second.body?.result?.status === 'revoked', 'idempotent unlink result status mismatch');
  assertStatus(second.body?.result?.idempotent === true, 'second unlink was not idempotent');

  const account = await getLinkedAccount(admin, context, 'revoked');
  const proof = await getProof(admin, context, linkedProviderAccountId, 'revoked');
  await verifyTokenVault(admin, context, linkedProviderAccountId);

  return {
    status: first.body.result.status,
    secondIdempotent: second.body.result.idempotent,
    account,
    proof,
  };
}

function buildCallbackNegativeUrl(oauthState) {
  const url = new URL('/api/v1/integrations/osu/callback', API_BASE_URL);
  url.searchParams.set('code', 'placeholder');
  url.searchParams.set('state', oauthState);
  return url.toString();
}

async function verifyNegativeCases(context, linkedProviderAccountId) {
  const replay = await requestJson(buildCallbackNegativeUrl(context.oauthState));
  assertStatus(replay.response.status === 400, 'callback replay did not fail with HTTP 400');

  const altered = await requestJson(buildCallbackNegativeUrl('x'.repeat(32)));
  assertStatus(altered.response.status === 400, 'altered state did not fail with HTTP 400');

  const otherOwnerUnlink = await unlinkRequest(context.otherOwnerAccessToken, context.otherPassportId, linkedProviderAccountId);
  assertStatus([403, 404].includes(otherOwnerUnlink.response.status), 'other-owner unlink was not blocked');

  const missingAuth = await requestJson(`${API_BASE_URL}/api/v1/integrations/osu/link-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passportId: context.passportId }),
  });
  assertStatus(missingAuth.response.status === 401, 'missing auth did not fail with HTTP 401');

  return {
    replayStatus: replay.response.status,
    alteredStatus: altered.response.status,
    otherOwnerUnlinkStatus: otherOwnerUnlink.response.status,
    missingAuthStatus: missingAuth.response.status,
  };
}

async function verifyReplayAndAlteredState(context) {
  const replay = await requestJson(buildCallbackNegativeUrl(context.oauthState));
  assertStatus(replay.response.status === 400, 'callback replay did not fail with HTTP 400');
  const altered = await requestJson(buildCallbackNegativeUrl('x'.repeat(32)));
  assertStatus(altered.response.status === 400, 'altered state did not fail with HTTP 400');
}

async function unlinkRequest(accessToken, passportId, linkedProviderAccountId) {
  return requestJson(`${API_BASE_URL}/api/v1/integrations/osu/unlink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ passportId, linkedProviderAccountId }),
  });
}

async function getLinkedAccount(admin, context, expectedStatus) {
  const { data, error } = await admin
    .from('linked_provider_accounts')
    .select('id, provider, external_account_id, status, visibility, metadata_safe, verified_at, revoked_at')
    .eq('owner_id', context.ownerId)
    .eq('passport_id', context.passportId)
    .eq('provider', 'osu')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  assertStatus(Boolean(data?.id), `linked_provider_accounts ${expectedStatus} row missing`);
  assertStatus(data.provider === 'osu', 'linked_provider_accounts provider mismatch');
  assertStatus(data.status === expectedStatus, `linked_provider_accounts expected status ${expectedStatus}`);
  assertStatus(data.visibility === 'private', 'linked_provider_accounts visibility must stay private');
  assertStatus(Boolean(data.external_account_id), 'linked_provider_accounts external account id missing internally');
  return data;
}

async function getProof(admin, context, linkedProviderAccountId, expectedStatus) {
  const { data, error } = await admin
    .from('verified_proofs')
    .select('id, provider, linked_provider_account_id, source_key, status, visibility, metadata_safe, verified_at, revoked_at')
    .eq('owner_id', context.ownerId)
    .eq('passport_id', context.passportId)
    .eq('linked_provider_account_id', linkedProviderAccountId)
    .eq('provider', 'osu')
    .eq('source_key', 'osu:profile_linked')
    .maybeSingle();
  if (error) throw error;
  assertStatus(Boolean(data?.id), `verified_proofs ${expectedStatus} row missing`);
  assertStatus(data.status === expectedStatus, `verified_proofs expected status ${expectedStatus}`);
  assertStatus(data.visibility === 'private', 'verified_proofs visibility must stay private');
  return data;
}

async function verifyTokenVault(admin, context, linkedProviderAccountId) {
  const { data, error } = await admin
    .from('provider_token_vault')
    .select('id, provider, token_status, token_ciphertext, revoked_at')
    .eq('owner_id', context.ownerId)
    .eq('passport_id', context.passportId)
    .eq('provider', 'osu')
    .eq('linked_provider_account_id', linkedProviderAccountId);
  if (error) throw error;
  const rows = Array.isArray(data) ? data : [];
  for (const row of rows) {
    assertStatus(row.token_ciphertext === null, 'provider_token_vault token_ciphertext must stay null');
    assertStatus(!JSON.stringify(row).toLowerCase().includes('access_token'), 'provider_token_vault leaked access token field');
    assertStatus(!JSON.stringify(row).toLowerCase().includes('refresh_token'), 'provider_token_vault leaked refresh token field');
  }
  return { rows: rows.length };
}

async function verifyRevokedProjection(admin, context) {
  const projection = await getPublicProjection(admin, context.publicSlug);
  assertStatus(projection === null, 'public projection should be null after unlink removes verified provider');
  return { exists: false };
}

async function getPassport(admin, passportId) {
  const { data, error } = await admin
    .from('gaming_passports')
    .select('id, status, slug, publication_consent')
    .eq('id', passportId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.id) throw new Error('passport_not_found');
  return data;
}

async function getPublicProjection(admin, slug) {
  const { data, error } = await admin.rpc('get_public_gaming_passport_projection', {
    public_slug: slug,
  });
  if (error) throw error;
  return data;
}

function assertProjectionDoesNotLeak(projection, linkedAccount, proof) {
  const projectionText = JSON.stringify(projection);
  assertStatus(Array.isArray(projection.linkedProviders), 'public projection linkedProviders missing');
  assertStatus(Array.isArray(projection.featuredProofs), 'public projection featuredProofs missing');
  assertStatus(projection.linkedProviders.length === 0, 'private osu linked provider appeared publicly');
  assertStatus(projection.featuredProofs.length === 0, 'private osu proof appeared publicly');
  [
    linkedAccount.id,
    linkedAccount.external_account_id,
    proof.id,
    'metadata_safe',
    'metadataSafe',
    'rawPayload',
    'token',
    'token_status',
    'externalAccountId',
    'external_account_id',
  ].forEach((forbidden) => {
    assertStatus(!projectionText.includes(forbidden), `public projection leaked ${forbidden}`);
  });
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  assertNoSensitiveKeys(body, 'http response');
  return { response, body };
}

async function rpcSingle(client, functionName, params) {
  const { data, error } = await client.rpc(functionName, params);
  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

function createAdminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function createAuthClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function createOwnerClient(accessToken) {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function readContext() {
  if (!existsSync(CONTEXT_PATH)) {
    throw new Error('rm29_context_missing_run_prepare_first');
  }
  const context = JSON.parse(readFileSync(CONTEXT_PATH, 'utf8'));
  for (const key of ['ownerId', 'ownerAccessToken', 'passportId', 'otherOwnerAccessToken', 'otherPassportId', 'publicSlug', 'oauthState']) {
    if (!context[key]) throw new Error(`rm29_context_missing_${key}`);
  }
  return context;
}

function cleanupContext() {
  rmSync(CONTEXT_PATH, { force: true });
  rmSync(AUTHORIZE_SHORTCUT_PATH, { force: true });
}

function openAuthorizeShortcut() {
  if (process.argv.includes('--no-open')) return false;
  try {
    const child = spawn('powershell.exe', ['-NoProfile', '-Command', 'Invoke-Item -LiteralPath $env:RM29_AUTHORIZE_SHORTCUT'], {
      env: {
        ...process.env,
        RM29_AUTHORIZE_SHORTCUT: AUTHORIZE_SHORTCUT_PATH,
      },
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}

function ensureRequiredEnv() {
  const required = [
    'OSU_PROVIDER_ENABLED',
    'OSU_CLIENT_ID',
    'OSU_CLIENT_SECRET',
    'OSU_REDIRECT_URI',
    'OSU_STATE_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) throw new Error(`missing_env_${missing.join('_')}`);
  assertStatus(process.env.OSU_PROVIDER_ENABLED === 'true', 'OSU_PROVIDER_ENABLED must be true for local smoke');
  assertStatus(process.env.SUPABASE_URL === 'http://127.0.0.1:54321', 'SUPABASE_URL must point to local Supabase');
  assertStatus(process.env.OSU_REDIRECT_URI === `${API_BASE_URL}/api/v1/integrations/osu/callback`, 'OSU_REDIRECT_URI must match local callback');
}

function ensureLocalOnly() {
  assertStatus(API_BASE_URL === 'http://localhost:3001', 'API_BASE_URL must stay local');
  assertStatus(resolve(process.cwd()).toLowerCase().startsWith(REPO_ROOT.toLowerCase()), 'script must run inside the RM-29 worktree');
}

function assertNoSensitiveKeys(value, label) {
  const visit = (input) => {
    if (!input || typeof input !== 'object') return;
    for (const [key, child] of Object.entries(input)) {
      if (SENSITIVE_KEYS.has(key)) throw new Error(`sensitive_key_in_${label}`);
      visit(child);
    }
  };
  visit(value);
}

function assertStatus(condition, message) {
  if (!condition) throw new Error(message);
}

function safeErrorMessage(error) {
  return String(error?.message || error || 'unknown_error').replace(/[A-Za-z0-9_-]{24,}/g, '<redacted>');
}

function safeLog(message) {
  console.log(message);
}

function printHelp() {
  safeLog('Usage: node apps/api/scripts/osuManualSmoke.mjs prepare|verify|complete|cleanup [--no-open]');
}
