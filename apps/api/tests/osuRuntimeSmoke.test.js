import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { getOsuRuntimeConfig, toSafeOsuRuntimeConfig } from '../src/integrations/osu/config.js';
import { buildOsuAuthorizeUrl, sanitizeOsuRuntimeResult } from '../src/integrations/osu/oauthClient.js';

const readRepo = (path) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../${path}`, import.meta.url);

const rm28Docs = [
  'docs/product/OSU_RUNTIME_SMOKE_QA.md',
  'docs/product/OSU_OWNER_LINKING_SMOKE_RUNBOOK.md',
  'docs/product/OSU_RUNTIME_SMOKE_RESULTS.md',
  'docs/product/RM28_OSU_RUNTIME_SMOKE_SCOPE.md',
].map(readRepo).join('\n');

const configuredEnv = Object.freeze({
  OSU_PROVIDER_ENABLED: 'true',
  OSU_CLIENT_ID: 'cid',
  OSU_CLIENT_SECRET: 'cs',
  OSU_REDIRECT_URI: 'http://localhost:3001/api/v1/integrations/osu/callback',
  OSU_STATE_SECRET: 'ss',
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_SERVICE_ROLE_KEY: 'sr',
});

describe('RM-28 osu! runtime smoke QA contracts', () => {
  it('adds the smoke QA, runbook, results, and RM-28 scope docs', () => {
    [
      'docs/product/OSU_RUNTIME_SMOKE_QA.md',
      'docs/product/OSU_OWNER_LINKING_SMOKE_RUNBOOK.md',
      'docs/product/OSU_RUNTIME_SMOKE_RESULTS.md',
      'docs/product/RM28_OSU_RUNTIME_SMOKE_SCOPE.md',
    ].forEach((path) => {
      assert.equal(existsSync(repoPath(path)), true);
    });

    assert.match(rm28Docs, /RM-28 osu! Runtime Smoke QA/);
    assert.match(rm28Docs, /Owner Linking Smoke Runbook/);
    assert.match(rm28Docs, /Result: `partial-pass`/);
    assert.match(rm28Docs, /blocked-human/);
  });

  it('keeps runtime disabled by default and safe status config free of secret values', () => {
    const disabled = getOsuRuntimeConfig({});
    assert.equal(disabled.enabled, false);
    assert.equal(disabled.configured, false);
    assert.equal(disabled.status, 'disabled');

    const safe = toSafeOsuRuntimeConfig(getOsuRuntimeConfig(configuredEnv));
    assert.equal(safe.configured, true);
    assert.equal(safe.tokenStrategy, 'no_refresh_token_storage');
    assert.equal(Object.hasOwn(safe, 'clientSecret'), false);
    assert.equal(Object.hasOwn(safe, 'supabaseServiceRoleKey'), false);
  });

  it('builds a link-intent authorize URL without client secret or token material', () => {
    const config = getOsuRuntimeConfig(configuredEnv);
    const authorizeUrl = buildOsuAuthorizeUrl(config, 'local-state-value');
    const url = new URL(authorizeUrl);

    assert.equal(url.origin + url.pathname, 'https://osu.ppy.sh/oauth/authorize');
    assert.equal(url.searchParams.get('redirect_uri'), configuredEnv.OSU_REDIRECT_URI);
    assert.equal(url.searchParams.get('response_type'), 'code');
    assert.equal(url.searchParams.get('scope'), 'identify public');
    assert.equal(url.searchParams.get('state'), 'local-state-value');
    assert.equal(url.searchParams.has('client_secret'), false);
    assert.equal(url.searchParams.has('access_token'), false);
    assert.equal(url.searchParams.has('refresh_token'), false);
  });

  it('documents callback, DB, token vault, unlink, and negative smoke gates without claiming full pass', () => {
    [
      /GET \/api\/v1\/integrations\/osu/,
      /POST \/api\/v1\/integrations\/osu\/link-intent/,
      /authorizeUrl/,
      /http:\/\/localhost:3001\/api\/v1\/integrations\/osu\/callback/,
      /linked_provider_accounts/,
      /verified_proofs/,
      /provider_token_vault/,
      /`?token_ciphertext`? is null/,
      /publicServingAllowed/,
      /callback replay with same state fails/,
      /unlink with another owner is not allowed/,
      /revoked proof does not appear in public projection/,
    ].forEach((pattern) => assert.match(rm28Docs, pattern));

    assert.doesNotMatch(rm28Docs, /Result: `full-pass`/);
  });

  it('does not print token-like or secret-like values in RM-28 docs', () => {
    [
      /sb_secret_[A-Za-z0-9_-]+/,
      /OSU_CLIENT_SECRET=\S+/,
      /SUPABASE_SERVICE_ROLE_KEY=\S+/,
      /access_token["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /refresh_token["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /client_secret["']?\s*[:=]\s*["'][^"'<\s]+/i,
      /code=[A-Za-z0-9_-]{8,}/i,
    ].forEach((pattern) => assert.doesNotMatch(rm28Docs, pattern));
  });

  it('keeps callback payload sanitization aligned with RM-28 non-leak expectations', () => {
    const safe = sanitizeOsuRuntimeResult({
      code: 'oauth-code',
      clientSecret: '<cs>',
      token: {
        accessToken: '<at>',
        refreshToken: '<rt>',
      },
      access_token: '<at>',
      refresh_token: '<rt>',
      linkedProviderAccount: {
        provider: 'osu',
        status: 'verified',
        visibility: 'private',
      },
      proof: {
        type: 'profile_linked',
        visibility: 'private',
      },
    });
    const json = JSON.stringify(safe);

    assert.equal(json.includes('oauth-code'), false);
    assert.equal(json.includes('<cs>'), false);
    assert.equal(json.includes('<at>'), false);
    assert.equal(json.includes('<rt>'), false);
    assert.match(json, /profile_linked/);
    assert.match(json, /private/);
  });
});
