import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx', '.sql', '.md', '.example']) => {
  const start = fileURLToPath(repoPath(root));
  if (!existsSync(start)) return '';

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (['node_modules', 'dist', 'build', '.git'].includes(entry)) continue;
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (extensions.some((extension) => fullPath.endsWith(extension))) {
        files.push(readFileSync(fullPath, 'utf8'));
      }
    }
  };

  walk(start);
  return files.join('\n');
};

const rm28DocPaths = [
  'docs/product/OSU_RUNTIME_SMOKE_QA.md',
  'docs/product/OSU_OWNER_LINKING_SMOKE_RUNBOOK.md',
  'docs/product/OSU_RUNTIME_SMOKE_RESULTS.md',
  'docs/product/RM28_OSU_RUNTIME_SMOKE_SCOPE.md',
  'docs/product/RM29_OSU_SMOKE_BLOCKER_FIXES_SCOPE.md',
];
const rm28Docs = rm28DocPaths.map(readRepo).join('\n');
const roadmapDocs = [
  'README.md',
  'docs/product/ROADMAP_INDEX.md',
  'docs/product/ROADMAP_MILESTONE_REGISTRY.md',
  'docs/product/ROADMAP_STATUS_MATRIX.md',
  'docs/product/CURRENT_STATE_AND_ROADMAP.md',
  'docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md',
  'docs/product/DECISION_LOG.md',
].map(readRepo).join('\n');
const apiOsuSource = readTree('apps/api/src/integrations/osu');
const apiManualSmokeScript = readRepo('apps/api/scripts/osuManualSmoke.mjs');
const webSource = readTree('apps/web/src', ['.js', '.jsx', '.ts', '.tsx']);
const supabaseSource = readTree('supabase/migrations', ['.sql']);
const appSource = readWeb('src/App.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const apiPackageJson = JSON.parse(readRepo('apps/api/package.json'));
const rootPackageJson = JSON.parse(readRepo('package.json'));

describe('RM-28/RM-29 osu! Runtime Smoke / Owner Linking QA', () => {
  it('adds smoke QA docs, preserves RM-28 partial-pass, and records RM-29 full-pass', () => {
    rm28DocPaths.forEach((path) => {
      assert.equal(existsSync(repoPath(path)), true);
    });

    assert.match(rm28Docs, /RM-28 osu! Runtime Smoke QA/);
    assert.match(rm28Docs, /OSU_OWNER_LINKING_SMOKE_RUNBOOK/);
    assert.match(rm28Docs, /Result: `partial-pass`/);
    assert.match(rm28Docs, /blocked-human/);
    assert.match(rm28Docs, /human owner opens the generated `authorizeUrl`/);
    assert.match(rm28Docs, /RM-29 result: `full-pass`/);
    assert.match(rm28Docs, /CALLBACK_REAL=pass/);
    assert.match(rm28Docs, /RM-30 osu! Owner Linking UI Hardening \/ Private Account UX/);
    assert.doesNotMatch(rm28Docs, /Result: `full-pass`/);
  });

  it('documents exact smoke coverage for status, link-intent, callback, DB, token vault, unlink, and negative cases', () => {
    [
      /GET \/api\/v1\/integrations\/osu/,
      /POST \/api\/v1\/integrations\/osu\/link-intent/,
      /authorizeUrl/,
      /tokenStrategy`? is `no_refresh_token_storage|no_refresh_token_storage/,
      /http:\/\/localhost:3001\/api\/v1\/integrations\/osu\/callback/,
      /linked_provider_accounts/,
      /provider = 'osu'/,
      /verified_proofs/,
      /source_key = 'osu:profile_linked'/,
      /provider_token_vault/,
      /token_ciphertext/,
      /\/api\/v1\/integrations\/osu\/unlink/,
      /callback replay with same state fails/,
      /unlink with another owner is not allowed/,
      /revoked proof does not appear in public projection/,
    ].forEach((pattern) => assert.match(rm28Docs, pattern));
  });

  it('keeps secrets and tokens out of committed smoke docs', () => {
    [
      /sb_secret_[A-Za-z0-9_-]+/,
      /OSU_CLIENT_SECRET=\S+/,
      /SUPABASE_SERVICE_ROLE_KEY=\S+/,
      /access_token["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /refresh_token["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /client_secret["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /code=[A-Za-z0-9_-]{8,}/i,
      /state=[A-Za-z0-9_-]{16,}/i,
    ].forEach((pattern) => assert.doesNotMatch(rm28Docs, pattern));
  });

  it('keeps RM-27 runtime disabled by default and no-public-proof-by-default boundaries intact', () => {
    assert.match(apiOsuSource, /OSU_PROVIDER_ENABLED === 'true'/);
    assert.match(apiOsuSource, /tokenStrategy: 'no_refresh_token_storage'/);
    assert.match(apiOsuSource, /visibility: 'private'/);
    assert.match(apiOsuSource, /source_key: PROFILE_LINKED_SOURCE_KEY/);
    assert.match(supabaseSource, /provider_token_vault_no_ciphertext_in_pr16/);
    assert.doesNotMatch(supabaseSource, /drop constraint provider_token_vault_no_ciphertext_in_pr16/i);
    assert.doesNotMatch(webSource, /access_token|refresh_token/i);
    assert.doesNotMatch(webSource, /import\.meta\.env\.(OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY)|process\.env\.(OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY)/i);
  });

  it('documents RM-29 full-pass callback, DB, token vault, unlink, projection, and negative evidence', () => {
    [
      /RM29_COMPLETE=pass/,
      /LINKED_PROVIDER_ACCOUNT_STATUS=verified/,
      /LINKED_PROVIDER_ACCOUNT_VISIBILITY=private/,
      /VERIFIED_PROOF_STATUS=current/,
      /VERIFIED_PROOF_VISIBILITY=private/,
      /TOKEN_VAULT_ROWS_BEFORE_UNLINK=0/,
      /PUBLIC_PROJECTION_BEFORE_UNLINK=true/,
      /UNLINK_STATUS=revoked/,
      /UNLINK_IDEMPOTENT_SECOND_CALL=true/,
      /REVOKED_ACCOUNT_STATUS=revoked/,
      /REVOKED_PROOF_STATUS=revoked/,
      /PUBLIC_PROJECTION_AFTER_UNLINK=false/,
      /NEGATIVE_CALLBACK_REPLAY_STATUS=400/,
      /NEGATIVE_ALTERED_STATE_STATUS=400/,
      /NEGATIVE_OTHER_OWNER_UNLINK_STATUS=404/,
      /NEGATIVE_MISSING_AUTH_STATUS=401/,
    ].forEach((pattern) => assert.match(rm28Docs, pattern));
  });

  it('adds a safe assisted local smoke script without logging OAuth or token material', () => {
    assert.match(apiManualSmokeScript, /prepare/);
    assert.match(apiManualSmokeScript, /complete/);
    assert.match(apiManualSmokeScript, /AUTHORIZE_URL_REDACTED=true/);
    assert.match(apiManualSmokeScript, /CONTEXT_CLEARED=true/);
    assert.match(apiManualSmokeScript, /no_refresh_token_storage/);
    assert.doesNotMatch(apiManualSmokeScript, /safeLog\([^)]*authorizeUrl/i);
    assert.doesNotMatch(apiManualSmokeScript, /safeLog\([^)]*ownerAccessToken/i);
    assert.doesNotMatch(apiManualSmokeScript, /safeLog\([^)]*oauthState/i);
  });

  it('keeps forbidden RM-28 product surfaces out of source and docs', () => {
    const sourceOnly = `${apiOsuSource}\n${webSource}`;

    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(sourceOnly, /stripe|mercadopago|checkout session|payment intent/i);
    assert.doesNotMatch(JSON.stringify({
      root: rootPackageJson.dependencies ?? {},
      web: packageJson.dependencies ?? {},
      api: apiPackageJson.dependencies ?? {},
    }), /stripe|mercadopago/i);
    assert.doesNotMatch(apiOsuSource, /matchHistory|liveTracker|scoreSync|bestPlays|performancePoints|rankedScore/i);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker/i);
  });

  it('updates roadmap docs for RM-29 full-pass smoke and defines RM-30 owner UX follow-up', () => {
    assert.match(roadmapDocs, /RM-27 osu! Runtime Foundation[^|\\n]*done|RM-27 osu! Runtime Foundation[\s\S]{0,180}done/);
    assert.match(roadmapDocs, /RM-28 osu! Runtime Smoke \/ Owner Linking QA/);
    assert.match(roadmapDocs, /partial-pass|blocked-human|blocked at human authorization/i);
    assert.match(roadmapDocs, /RM-29 osu! Smoke Blocker Fixes/);
    assert.match(roadmapDocs, /full-pass|full local smoke completion/i);
    assert.match(roadmapDocs, /RM-30 osu! Owner Linking UI Hardening \/ Private Account UX/);
  });

  it('wires RM-28 smoke tests into API and web test scripts', () => {
    assert.match(apiPackageJson.scripts.test, /osuRuntimeSmoke\.test\.js/);
    assert.match(packageJson.scripts['test:seo'], /osu-runtime-smoke\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-runtime-smoke\.test\.js/);
  });
});
