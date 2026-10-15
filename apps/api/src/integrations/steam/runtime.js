import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import { readFileSync } from 'node:fs';
import { rootCertificates } from 'node:tls';
import { authenticateOwner } from '../passport-owner.js';
import { readLinkingAccess, canLink } from '../linking-access.js';
import { readSteamConfig, steamAuthorizeUrl, readSteamSnapshot, validateSteamAssertion } from './client.js';
import { verifySteamIdentity } from './openid.js';
import { persistentSteamSnapshot } from './snapshot.js';

export const BASE = '/api/v1/integrations/steam';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TTL = 600_000;
const hash = (value) => createHash('sha256').update(value).digest('hex');
const fail = (code, status = 400) => Object.assign(new Error(code), { code, status });

export function readRuntimeConfig(env = process.env) {
  if (env.STEAM_LINKING_ENABLED !== 'true') return null;
  try {
    const origin = new URL(env.STEAM_APP_ORIGIN);
    const local = env.NODE_ENV !== 'production' && !env.VERCEL && env.STEAM_LOCAL_TEST === 'true'
      && origin.origin === 'http://localhost:3000';
    if (origin.href !== origin.origin + '/' || (!local && origin.origin !== 'https://www.tryhardnames.com')) throw new Error();
    const access = readLinkingAccess(env, 'STEAM');
    const key = env.STEAM_COOKIE_KEY || '';
    if (!/^[a-fA-F0-9]{64}$/.test(key)) throw new Error();
    const database = new URL(env.STEAM_PASSPORT_DATABASE_URL);
    if (!['postgres:', 'postgresql:'].includes(database.protocol)
      || !/^steam_passport_writer(?:\.[a-z0-9]+)?$/.test(decodeURIComponent(database.username))
      || !database.password || database.search || database.hash) throw new Error();
    const api = new URL(env.STEAM_PASSPORT_API_URL);
    if (api.href !== api.origin + '/' || api.username || api.password
      || !(api.protocol === 'https:' && /^[a-z0-9]+\.supabase\.co$/.test(api.hostname))
        && !(local && ['http://127.0.0.1:54321', 'http://127.0.0.1:58421', 'http://127.0.0.1:58521'].includes(api.origin))) throw new Error();
    const publicKey = env.STEAM_PASSPORT_PUBLIC_KEY || '';
    if (!publicKey.startsWith('sb_publishable_')) {
      const claims = JSON.parse(Buffer.from(publicKey.split('.')[1], 'base64url').toString());
      if (claims.role !== 'anon') throw new Error();
    }
    return { ...readSteamConfig(env), ...access, origin: origin.origin, local,
      cookieKey: Buffer.from(key, 'hex'), callbackUrl: origin.origin + BASE + '/callback',
      apiUrl: api.origin, publicKey, connectionString: database.href };
  } catch { throw fail('configuration_missing', 503); }
}

export function sealAttempt(value, config) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', config.cookieKey, iv);
  cipher.setAAD(Buffer.from(config.origin));
  const body = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

export function openAttempt(value, config, now = Date.now) {
  try {
    if (typeof value !== 'string' || value.length > 2500 || !/^[\w-]+$/.test(value)) throw new Error();
    const bytes = Buffer.from(value, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', config.cookieKey, bytes.subarray(0, 12));
    decipher.setAAD(Buffer.from(config.origin));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const data = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
    if (!['id', 'ownerId', 'sessionId', 'passportId'].every((key) => UUID.test(data[key] || ''))
      || !/^[\w-]{43}$/.test(data.state)
      || !Number.isFinite(data.expires) || data.expires <= now() || data.expires > now() + TTL) throw new Error();
    return data;
  } catch { throw fail('invalid_attempt', 400); }
}

function cookieName(config) { return config.local ? 'thn_steam_link' : '__Secure-thn_steam_link'; }
function setCookie(res, config, value) {
  res.setHeader('Set-Cookie', cookieName(config) + '=' + value + '; Path=' + BASE
    + '; HttpOnly; SameSite=Lax; Max-Age=' + (value ? '600' : '0') + (config.local ? '' : '; Secure'));
}
function readCookie(req, config) {
  const values = (req.headers.cookie || '').split(';').map((s) => s.trim()).filter((s) => s.startsWith(cookieName(config) + '='));
  if (values.length !== 1) throw fail('invalid_attempt');
  return openAttempt(values[0].slice(cookieName(config).length + 1), config);
}

export function createStore(pool, clientFactory) {
  return {
    authenticate: (req) => authenticateOwner(req.headers.authorization, clientFactory),
    async transition(action, owner, attempt, profile = null, account = null) {
      try {
        const result = await pool.query('select private.steam_link_transition($1,$2::uuid,$3::uuid,$4::uuid,$5::uuid,$6,$7::jsonb,$8::uuid) as id',
          [action, owner.ownerId, owner.sessionId, owner.passportId, attempt?.id || null,
            attempt ? hash(attempt.state) : null, profile ? JSON.stringify(profile) : null, account]);
        return result.rows[0].id;
      } catch (error) {
        if (error.code === '23505') throw fail('account_already_linked', 409);
        if (error.code === '42501') throw fail('invalid_attempt', 409);
        if (error.code === 'P0001' && error.message === 'rate_limited') throw fail('rate_limited', 429);
        throw fail('storage_unavailable', 503);
      }
    },
    async status(owner) {
      const { data, error } = await owner.client.from('linked_provider_accounts')
        .select('id,external_account_id,metadata_safe,verified_at,status,visibility')
        .eq('owner_id', owner.ownerId).eq('passport_id', owner.passportId).eq('provider', 'steam')
        .eq('status', 'verified').eq('visibility', 'private');
      if (error) throw fail('storage_unavailable', 503);
      return (data || []).map((row) => {
        const snapshot = row.metadata_safe?.snapshot;
        if (!snapshot || !/^7656119\d{10}$/.test(row.external_account_id)) return null;
        try {
          const safe = persistentSteamSnapshot({ ...snapshot, steamId: row.external_account_id, verifiedAt: row.verified_at });
          return { ...safe, id: row.id, provider: 'steam', verification: 'openid', visibility: 'private', persisted: true,
            profileUrl: 'https://steamcommunity.com/profiles/' + row.external_account_id + '/' };
        } catch { return null; }
      }).filter(Boolean);
    },
  };
}

export function createSteamRouter({ getRuntime, readProfile = readSteamSnapshot, verifyIdentity = verifySteamIdentity } = {}) {
  const router = Router();
  router.use((_req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' });
    next();
  });
  router.get('/availability', (_req, res) => {
    try { res.json({ enabled: Boolean(getRuntime()) }); } catch { res.json({ enabled: false }); }
  });
  const run = (handler) => async (req, res) => {
    try {
      const runtime = getRuntime();
      if (!runtime) throw fail('disabled', 404);
      const { config, store } = runtime;
      if (req.method !== 'GET' && (req.headers.origin !== config.origin || req.headers['x-passport-link'] !== 'steam')) {
        throw fail('invalid_origin', 403);
      }
      await handler(req, res, config, store);
    } catch (error) {
      const allowed = ['disabled', 'configuration_missing', 'sign_in_required', 'passport_required', 'private_passport_required',
        'invalid_origin', 'tester_required', 'invalid_attempt', 'account_already_linked', 'rate_limited', 'storage_unavailable'];
      res.status(allowed.includes(error.code) ? error.status || 400 : 503)
        .json({ error: allowed.includes(error.code) ? error.code : 'request_failed' });
    }
  };
  async function ownerFor(req, config, store) {
    const owner = await store.authenticate(req);
    if (!canLink(config, owner.ownerId)) throw fail('tester_required', 403);
    return owner;
  }
  router.get('/status', run(async (req, res, config, store) => {
    const owner = await ownerFor(req, config, store);
    res.json({ accounts: await store.status(owner) });
  }));
  router.post('/connect', run(async (req, res, config, store) => {
    const owner = await ownerFor(req, config, store);
    const attempt = { id: randomUUID(), ownerId: owner.ownerId, sessionId: owner.sessionId, passportId: owner.passportId,
      state: randomBytes(32).toString('base64url'), expires: Date.now() + TTL };
    await store.transition('start', owner, attempt);
    setCookie(res, config, sealAttempt(attempt, config));
    res.json({ authorizationUrl: steamAuthorizeUrl(attempt.state, config.callbackUrl) });
  }));
  router.get('/callback', run(async (req, res, config, store) => {
    let attempt;
    let claimed = false;
    try {
      attempt = readCookie(req, config);
      if (req.originalUrl.length > 8192) throw fail('invalid_attempt');
      const callback = new URL(req.originalUrl, config.origin);
      const state = callback.searchParams.get('state');
      if (!/^[\w-]{43}$/.test(state || '') || callback.searchParams.getAll('state').length !== 1
        || !timingSafeEqual(Buffer.from(state), Buffer.from(attempt.state))
        || !canLink(config, attempt.ownerId)) throw fail('invalid_attempt');
      await store.transition('claim', attempt, attempt);
      claimed = true;
      const expected = validateSteamAssertion(callback, attempt.state, config.callbackUrl);
      const steamId = await verifyIdentity(callback, attempt.state, config.callbackUrl);
      if (steamId !== expected) throw fail('invalid_attempt');
      const profile = persistentSteamSnapshot(await readProfile(steamId, config));
      if (profile.steamId !== steamId) throw fail('invalid_attempt');
      await store.transition('ready', attempt, attempt, profile);
      res.redirect(303, config.origin + '/gaming-passport?steamLink=ready#gp-steam-linked');
    } catch {
      if (claimed) await store.transition('cancel', attempt, attempt).catch(() => {});
      // Do not clear a valid browser attempt on an unsolicited or replayed callback.
      res.redirect(303, config.origin + '/gaming-passport?steamLink=failed#gp-steam-linked');
    }
  }));
  router.post('/complete', run(async (req, res, config, store) => {
    const owner = await ownerFor(req, config, store);
    const attempt = readCookie(req, config);
    if (['ownerId', 'sessionId', 'passportId'].some((key) => owner[key] !== attempt[key])) throw fail('invalid_attempt', 409);
    await store.transition('complete', owner, attempt);
    setCookie(res, config, '');
    res.json({ linked: true });
  }));
  router.delete('/accounts/:accountId', run(async (req, res, config, store) => {
    const owner = await ownerFor(req, config, store);
    if (!UUID.test(req.params.accountId)) throw fail('invalid_attempt');
    await store.transition('unlink', owner, null, null, req.params.accountId);
    setCookie(res, config, '');
    res.json({ unlinked: true });
  }));
  return router;
}

let runtime;
function getRuntime() {
  if (runtime) return runtime;
  const config = readRuntimeConfig();
  if (!config) return null;
  const databaseLocal = config.local && ['localhost', '127.0.0.1'].includes(new URL(config.connectionString).hostname);
  const pool = new pg.Pool({ connectionString: config.connectionString, max: 2,
    ssl: databaseLocal ? false : { rejectUnauthorized: true,
      ca: [...rootCertificates, readFileSync(new URL('../roblox/supabase-root-2021.crt', import.meta.url), 'utf8')] },
    connectionTimeoutMillis: 10_000, statement_timeout: 10_000,
    application_name: 'tryhardnames-steam-linking', idleTimeoutMillis: 20_000 });
  pool.on('error', () => { /* Requests return sanitized storage errors; never log connection credentials. */ });
  const clientFactory = (token) => createClient(config.apiUrl, config.publicKey, {
    global: { headers: { Authorization: 'Bearer ' + token } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  runtime = { config, store: createStore(pool, clientFactory) };
  return runtime;
}
export default createSteamRouter({ getRuntime });
