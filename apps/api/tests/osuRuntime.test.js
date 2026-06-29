import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getOsuRuntimeConfig,
  OSU_PRODUCTION_RUNTIME_GATES,
  toSafeOsuRuntimeConfig,
} from '../src/integrations/osu/config.js';
import { buildOsuAuthorizeUrl, exchangeOsuCode, fetchOsuOwnProfile, revokeOsuCurrentToken, sanitizeOsuRuntimeResult } from '../src/integrations/osu/oauthClient.js';
import { createOsuState, hashOsuState, validateOsuStateRecord } from '../src/integrations/osu/oauthState.js';

const configuredEnv = Object.freeze({
  OSU_PROVIDER_ENABLED: 'true',
  OSU_CLIENT_ID: 'server-client-id',
  OSU_CLIENT_SECRET: 'server-client-secret',
  OSU_REDIRECT_URI: 'https://tryhardnames.test/api/v1/integrations/osu/callback',
  OSU_STATE_SECRET: 'state-secret-at-least-long-enough',
  SUPABASE_URL: 'https://project.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'server-service-role-key',
});

const acceptedProductionGates = Object.freeze(
  Object.fromEntries(OSU_PRODUCTION_RUNTIME_GATES.map((gateName) => [gateName, 'true'])),
);

describe('RM-27 osu! runtime foundation API contracts', () => {
  it('keeps osu! disabled by default and reports only safe config', () => {
    const disabled = getOsuRuntimeConfig({});

    assert.equal(disabled.enabled, false);
    assert.equal(disabled.configured, false);
    assert.equal(disabled.status, 'disabled');

    const safe = toSafeOsuRuntimeConfig(getOsuRuntimeConfig(configuredEnv));
    assert.equal(safe.enabled, true);
    assert.equal(safe.configured, true);
    assert.equal(safe.hasClientSecret, true);
    assert.equal(Object.hasOwn(safe, 'clientSecret'), false);
    assert.equal(Object.hasOwn(safe, 'stateSecret'), false);
    assert.equal(Object.hasOwn(safe, 'supabaseServiceRoleKey'), false);
    assert.equal(Object.hasOwn(safe, 'accessToken'), false);
    assert.equal(Object.hasOwn(safe, 'refreshToken'), false);
    assert.equal(Object.hasOwn(safe, 'code'), false);
    assert.equal(Object.hasOwn(safe, 'state'), false);

    const safeJson = JSON.stringify(safe);
    assert.equal(safeJson.includes('server-client-secret'), false);
    assert.equal(safeJson.includes('server-service-role-key'), false);
    assert.equal(safeJson.includes('state-secret-at-least-long-enough'), false);
  });

  it('rejects non-minimal scopes before runtime can be configured', () => {
    const config = getOsuRuntimeConfig({
      ...configuredEnv,
      OSU_SCOPES: 'identify friends.read',
    });

    assert.equal(config.configured, false);
    assert.deepEqual(config.invalidScopes, ['friends.read']);
    assert.ok(config.missing.includes('OSU_SCOPES'));
  });

  it('blocks production osu! runtime unless every production hardening gate is accepted', () => {
    const config = getOsuRuntimeConfig({
      ...configuredEnv,
      NODE_ENV: 'production',
    });

    assert.equal(config.enabled, true);
    assert.equal(config.configured, false);
    assert.equal(config.status, 'production_gate_blocked');
    assert.equal(config.productionRuntimeGate.required, true);
    assert.equal(config.productionRuntimeGate.satisfied, false);
    assert.deepEqual(config.productionRuntimeGate.missing, OSU_PRODUCTION_RUNTIME_GATES);
    for (const gateName of OSU_PRODUCTION_RUNTIME_GATES) {
      assert.ok(config.missing.includes(gateName));
    }
  });

  it('requires every production hardening gate before configured=true in production', () => {
    const config = getOsuRuntimeConfig({
      ...configuredEnv,
      NODE_ENV: 'production',
      ...acceptedProductionGates,
    });

    assert.equal(config.configured, true);
    assert.equal(config.status, 'configured');
    assert.equal(config.productionRuntimeGate.required, true);
    assert.equal(config.productionRuntimeGate.satisfied, true);
    assert.deepEqual(config.productionRuntimeGate.missing, []);
  });

  it('keeps production osu! runtime blocked when one production hardening gate is missing', () => {
    const gateEnv = { ...acceptedProductionGates };
    delete gateEnv.OSU_PRODUCTION_MONITORING_REVIEWED;

    const config = getOsuRuntimeConfig({
      ...configuredEnv,
      VERCEL_ENV: 'production',
      ...gateEnv,
    });

    assert.equal(config.configured, false);
    assert.equal(config.status, 'production_gate_blocked');
    assert.deepEqual(config.productionRuntimeGate.missing, ['OSU_PRODUCTION_MONITORING_REVIEWED']);
    assert.ok(config.missing.includes('OSU_PRODUCTION_MONITORING_REVIEWED'));
  });

  it('does not require production hardening gates outside production', () => {
    const staging = getOsuRuntimeConfig({
      ...configuredEnv,
      VERCEL_ENV: 'preview',
    });
    const development = getOsuRuntimeConfig({
      ...configuredEnv,
      NODE_ENV: 'development',
    });

    assert.equal(staging.configured, true);
    assert.equal(staging.productionRuntimeGate.required, false);
    assert.equal(development.configured, true);
    assert.equal(development.productionRuntimeGate.required, false);
  });

  it('creates CSRF state with TTL, hashes it, and rejects missing, expired, reused, and mismatched state', () => {
    const now = Date.parse('2026-06-27T03:00:00.000Z');
    const state = createOsuState({
      now: () => now,
      randomBytes: () => Buffer.from('12345678901234567890123456789012'),
    });
    const stateHash = hashOsuState(state.state, configuredEnv.OSU_STATE_SECRET);
    const record = {
      status: 'pending',
      state_hash: stateHash,
      expires_at: '2026-06-27T03:10:00.000Z',
      consumed_at: null,
    };

    assert.equal(validateOsuStateRecord(record, state.state, configuredEnv.OSU_STATE_SECRET, {
      now: '2026-06-27T03:05:00.000Z',
    }).ok, true);
    assert.equal(validateOsuStateRecord(record, '', configuredEnv.OSU_STATE_SECRET).error, 'missing_state');
    assert.equal(validateOsuStateRecord({ ...record, consumed_at: '2026-06-27T03:05:00.000Z' }, state.state, configuredEnv.OSU_STATE_SECRET).error, 'state_reused');
    assert.equal(validateOsuStateRecord({ ...record, status: 'consumed' }, state.state, configuredEnv.OSU_STATE_SECRET).error, 'state_reused');
    assert.equal(validateOsuStateRecord(record, `${state.state}x`, configuredEnv.OSU_STATE_SECRET).error, 'state_mismatch');
    assert.equal(validateOsuStateRecord(record, state.state, configuredEnv.OSU_STATE_SECRET, {
      now: '2026-06-27T03:11:00.000Z',
    }).error, 'state_expired');
  });

  it('builds authorize URL with state while keeping token exchange server-side', () => {
    const config = getOsuRuntimeConfig(configuredEnv);
    const url = new URL(buildOsuAuthorizeUrl(config, 'state-value'));

    assert.equal(url.origin + url.pathname, 'https://osu.ppy.sh/oauth/authorize');
    assert.equal(url.searchParams.get('client_id'), 'server-client-id');
    assert.equal(url.searchParams.get('response_type'), 'code');
    assert.equal(url.searchParams.get('scope'), 'identify public');
    assert.equal(url.searchParams.get('state'), 'state-value');
    assert.equal(url.searchParams.has('client_secret'), false);
  });

  it('exchanges code, normalizes /me, revokes current token, and sanitizes response payloads', async () => {
    const config = getOsuRuntimeConfig(configuredEnv);
    const calls = [];
    const fetchImpl = async (url, options) => {
      calls.push({ url, options });
      if (String(url).endsWith('/oauth/token')) {
        return jsonResponse(200, {
          access_token: 'secret-access',
          refresh_token: 'secret-refresh',
          token_type: 'Bearer',
          expires_in: 86400,
        });
      }
      if (String(url).endsWith('/me')) {
        return jsonResponse(200, {
          id: 12345,
          username: 'osuPlayer',
          raw_private_field: 'ignored',
        });
      }
      if (String(url).endsWith('/oauth/tokens/current')) {
        return jsonResponse(204, {});
      }
      return jsonResponse(404, {});
    };

    const exchanged = await exchangeOsuCode('server-code', config, fetchImpl);
    assert.equal(exchanged.ok, true);
    assert.equal(exchanged.safeTokenSummary.hasAccessToken, true);
    assert.equal(exchanged.safeTokenSummary.hasRefreshToken, true);

    const profile = await fetchOsuOwnProfile(exchanged.token.accessToken, config, fetchImpl);
    assert.equal(profile.ok, true);
    assert.deepEqual(profile.identity, {
      externalAccountId: '12345',
      displayName: 'osuPlayer',
      username: 'osuPlayer',
      profileUrl: 'https://osu.ppy.sh/users/12345',
    });

    const revoked = await revokeOsuCurrentToken(exchanged.token.accessToken, config, fetchImpl);
    assert.equal(revoked.ok, true);
    assert.equal(calls[0].options.body.get('client_secret'), 'server-client-secret');
    assert.equal(calls[2].options.method, 'DELETE');

    const safe = sanitizeOsuRuntimeResult({
      code: 'server-code',
      token: exchanged.token,
      accessToken: 'secret-access',
      refreshToken: 'secret-refresh',
      linkedProviderAccount: { provider: 'osu', displayName: 'osuPlayer' },
    });
    const json = JSON.stringify(safe);
    assert.equal(json.includes('secret-access'), false);
    assert.equal(json.includes('secret-refresh'), false);
    assert.equal(json.includes('server-code'), false);
    assert.equal(json.includes('osuPlayer'), true);
  });
});

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(body);
    },
  };
}
