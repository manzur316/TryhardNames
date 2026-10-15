import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { BASE, readRuntimeConfig, sealAttempt, openAttempt, createRobloxRouter } from '../src/integrations/roblox/runtime.js';
import { createAuthorization, authorizeUrl, readAuthorizedProfile } from '../src/integrations/roblox/client.js';

const owner = { ownerId: '11111111-1111-4111-8111-111111111111', sessionId: '22222222-2222-4222-8222-222222222222',
  passportId: '33333333-3333-4333-8333-333333333333' };
const env = { ROBLOX_LINKING_ENABLED: 'true', ROBLOX_APP_ORIGIN: 'https://www.tryhardnames.com',
  ROBLOX_TESTER_IDS: owner.ownerId, ROBLOX_COOKIE_KEY: 'ab'.repeat(32), ROBLOX_CLIENT_ID: '123',
  ROBLOX_CLIENT_SECRET: 'fake-roblox-secret-for-tests', ROBLOX_PASSPORT_API_URL: 'https://example.supabase.co',
  ROBLOX_PASSPORT_PUBLIC_KEY: 'sb_publishable_fake',
  ROBLOX_PASSPORT_DATABASE_URL: 'postgresql://roblox_passport_writer:fake@db.example.invalid/postgres' };
const config = readRuntimeConfig(env);
const fixture = () => ({ accountId: '12345', username: 'TestPlayer', displayName: 'Test Player', avatarUrl: null,
  createdAt: null, verifiedAt: new Date().toISOString(), access_token: 'must-not-persist' });

async function setup(t, options = {}) {
  const runtimeConfig = options.config || config;
  const transitions = [];
  let phase = '';
  let snapshot;
  let exchanges = 0;
  const store = {
    authenticate: async (req) => {
      if (req.headers.authorization === 'Bearer other') return { ...owner, sessionId: randomUUID() };
      if (req.headers.authorization !== 'Bearer owner') throw Object.assign(new Error(), { code: 'sign_in_required', status: 401 });
      return owner;
    },
    status: async () => phase === 'complete' ? [snapshot] : [],
    transition: async (action, _owner, _attempt, profile) => {
      transitions.push(action);
      if (action === 'claim' && phase !== 'start') throw new Error('replay');
      if (action === 'ready') snapshot = profile;
      if (action === 'complete' && phase !== 'ready' && phase !== 'complete') throw new Error('not-ready');
      phase = action;
      return randomUUID();
    },
  };
  const app = express();
  app.use(BASE, createRobloxRouter({ getRuntime: () => options.disabled ? null : { config: runtimeConfig, store },
    readProfile: async () => { exchanges++; if (options.failProvider) throw new Error('secret-provider-payload'); return fixture(); } }));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const call = (path, method = 'GET', headers = {}) => fetch('http://127.0.0.1:' + server.address().port + BASE + path,
    { method, redirect: 'manual', headers: { Authorization: 'Bearer owner', Origin: config.origin, 'X-Passport-Link': 'roblox', ...headers } });
  async function connect() {
    const response = await call('/connect', 'POST');
    const cookie = response.headers.get('set-cookie').split(';')[0];
    const url = new URL((await response.json()).authorizationUrl);
    return { Cookie: cookie, state: url.searchParams.get('state') };
  }
  return { call, connect, transitions, exchanges: () => exchanges };
}

test('hosted linking defaults off; enabled config requires restricted writer, HTTPS origin, testers and encryption key', () => {
  assert.equal(readRuntimeConfig({}), null);
  assert.equal(config.callbackUrl, config.origin + BASE + '/callback');
  for (const patch of [{ ROBLOX_COOKIE_KEY: 'bad' }, { ROBLOX_TESTER_IDS: '' },
    { ROBLOX_APP_ORIGIN: 'http://www.tryhardnames.com' }, { ROBLOX_APP_ORIGIN: 'https://evil.example' },
    { ROBLOX_PASSPORT_DATABASE_URL: 'postgres://postgres:secret@example.com/db' },
    { ROBLOX_PASSPORT_DATABASE_URL: env.ROBLOX_PASSPORT_DATABASE_URL + '?sslmode=no-verify' }]) {
    assert.throws(() => readRuntimeConfig({ ...env, ...patch }), /configuration_missing/);
  }
});

test('encrypted browser attempt rejects tampering, expiry and different application origin', () => {
  const a = createAuthorization();
  const value = { ...owner, id: randomUUID(), state: a.state, verifier: a.verifier, expires: Date.now() + 10000 };
  const sealed = sealAttempt(value, config);
  assert.deepEqual(openAttempt(sealed, config), value);
  assert.ok(!sealed.includes(owner.ownerId));
  assert.throws(() => openAttempt('X' + sealed.slice(1), config));
  assert.throws(() => openAttempt(sealed, config, () => value.expires));
  assert.throws(() => openAttempt(sealed, { ...config, origin: 'https://other.example' }));
});

test('public Roblox allows a non-tester through the complete flow, without bypassing auth', async (t) => {
  assert.throws(() => readRuntimeConfig({ ...env, ROBLOX_APP_ORIGIN: 'http://localhost:3000', ROBLOX_LOCAL_TEST: 'true', VERCEL: '1' }), /configuration_missing/);
  const publicConfig = readRuntimeConfig({ ...env, ROBLOX_LINKING_ACCESS: 'public', ROBLOX_TESTER_IDS: '' });
  assert.equal(publicConfig.testers.size, 0);
  assert.throws(() => readRuntimeConfig({ ...env, ROBLOX_LINKING_ACCESS: 'typo' }));
  const s = await setup(t, { config: publicConfig });
  assert.equal((await s.call('/connect', 'POST', { Authorization: '' })).status, 401);
  const { Cookie, state } = await s.connect();
  assert.match((await s.call('/callback?code=code&state=' + state, 'GET', { Cookie })).headers.get('location'), /robloxLink=ready/);
  assert.equal((await s.call('/complete', 'POST', { Cookie })).status, 200);
  assert.deepEqual(s.transitions, ['start','claim','ready','complete']);
});

test('tester mode still rejects a valid owner outside its allowlist', async (t) => {
  const s = await setup(t, { config: { ...config, testers: new Set() } });
  assert.equal((await s.call('/connect', 'POST')).status, 403);
  assert.equal((await s.call('/status')).status, 403);
  assert.deepEqual(s.transitions, []);
});

test('production authorization and exchange use the same registered callback, PKCE and minimal scopes', async () => {
  const url = new URL(authorizeUrl(config, createAuthorization()));
  assert.equal(url.searchParams.get('redirect_uri'), config.callbackUrl);
  assert.equal(url.searchParams.get('scope'), 'openid profile');
  const calls = [];
  await readAuthorizedProfile('code', 'verifier', config, async (endpoint, options) => {
    calls.push([endpoint, options]);
    if (endpoint.endsWith('/token/revoke')) return new Response(null, { status: 200 });
    return new Response(JSON.stringify(endpoint.endsWith('/token')
      ? { access_token: 'fake-access', refresh_token: 'fake-refresh', token_type: 'Bearer' }
      : { sub: '12345', preferred_username: 'TestPlayer' }));
  });
  assert.equal(calls[0][1].body.get('redirect_uri'), config.callbackUrl);
  assert.ok(calls.at(-1)[0].endsWith('/token/revoke'));
});

test('persistent flow requires parent auth, exact origin and CSRF marker', async (t) => {
  const s = await setup(t);
  assert.equal((await s.call('/connect', 'POST', { Authorization: '' })).status, 401);
  assert.equal((await s.call('/connect', 'POST', { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await s.call('/connect', 'POST', { 'X-Passport-Link': '' })).status, 403);
  assert.deepEqual(s.transitions, []);
});

test('callback is browser-bound, claimed once; complete checks the original parent session and stores only allowed fields', async (t) => {
  const s = await setup(t);
  const { Cookie, state } = await s.connect();
  const path = '/callback?code=secret-code&state=' + state;
  assert.equal((await s.call(path)).headers.get('location'), config.origin + '/gaming-passport?robloxLink=failed#gp-roblox-linked');
  assert.equal(s.exchanges(), 0);
  const callback = await s.call(path, 'GET', { Cookie });
  assert.equal(callback.status, 303);
  assert.ok(callback.headers.get('location').includes('robloxLink=ready'));
  assert.ok(!callback.headers.get('location').includes('secret-code'));
  await s.call(path, 'GET', { Cookie });
  assert.equal(s.exchanges(), 1);
  assert.equal((await s.call('/complete', 'POST', { Cookie, Authorization: 'Bearer other' })).status, 409);
  const complete = await s.call('/complete', 'POST', { Cookie });
  assert.equal(complete.status, 200);
  assert.match(complete.headers.get('set-cookie'), /Max-Age=0/);
  const accounts = await (await s.call('/status')).json();
  assert.equal(accounts.accounts[0].username, 'TestPlayer');
  assert.ok(!JSON.stringify(accounts).includes('must-not-persist'));
});

test('provider failure cancels attempt and never exposes raw errors', async (t) => {
  const s = await setup(t, { failProvider: true });
  const { Cookie, state } = await s.connect();
  const response = await s.call('/callback?code=code&state=' + state, 'GET', { Cookie });
  assert.deepEqual(s.transitions, ['start', 'claim', 'cancel']);
  assert.ok(!JSON.stringify([...response.headers]).includes('secret-provider'));
});

test('disabled integration has no connect flow; secure cookies and private response headers', async (t) => {
  const disabled = await setup(t, { disabled: true });
  assert.deepEqual(await (await disabled.call('/availability')).json(), { enabled: false });
  assert.equal((await disabled.call('/connect', 'POST')).status, 404);
  const enabled = await setup(t);
  const response = await enabled.call('/connect', 'POST');
  for (const item of ['Secure', 'HttpOnly', 'SameSite=Lax']) assert.ok(response.headers.get('set-cookie').includes(item));
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
});
