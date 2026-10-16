import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { once } from 'node:events';
import { randomUUID, randomBytes } from 'node:crypto';
import { BASE, readRuntimeConfig, sealAttempt, openAttempt, createSteamRouter, createStore } from '../src/integrations/steam/runtime.js';
import { persistentSteamSnapshot } from '../src/integrations/steam/snapshot.js';
import { steamReturnTo } from '../src/integrations/steam/client.js';

const owner = { ownerId: '11111111-1111-4111-8111-111111111111', sessionId: '22222222-2222-4222-8222-222222222222',
  passportId: '33333333-3333-4333-8333-333333333333' };
const env = { STEAM_LINKING_ENABLED: 'true', STEAM_LOCAL_TEST: 'true', STEAM_APP_ORIGIN: 'http://localhost:3000',
  STEAM_TESTER_IDS: owner.ownerId, STEAM_COOKIE_KEY: 'ab'.repeat(32), STEAM_WEB_API_KEY: '12'.repeat(16),
  STEAM_PASSPORT_API_URL: 'http://127.0.0.1:58521', STEAM_PASSPORT_PUBLIC_KEY: 'sb_publishable_fake',
  STEAM_PASSPORT_DATABASE_URL: 'postgresql://steam_passport_writer:fake@127.0.0.1:58522/postgres' };
const config = readRuntimeConfig(env);
const steamId = '76561198000000000';
const fixture = () => ({ steamId, displayName: 'Steam Player', avatarUrl: null, createdAt: null,
  verifiedAt: new Date().toISOString(), library: { status: 'available', gameCount: 1,
    games: [{ appId: 730, name: 'Counter-Strike 2', playtimeMinutes: 120, recentMinutes: null, iconUrl: null }] },
  dataError: null, access_token: 'must-not-persist', realname: 'must-not-persist' });
function callback(state) {
  const url = new URL(steamReturnTo(state, config.callbackUrl));
  for (const [key, value] of Object.entries({ ns: 'http://specs.openid.net/auth/2.0', mode: 'id_res',
    op_endpoint: 'https://steamcommunity.com/openid/login', claimed_id: 'https://steamcommunity.com/openid/id/' + steamId,
    identity: 'https://steamcommunity.com/openid/id/' + steamId, return_to: url.href,
    response_nonce: new Date().toISOString() + 'nonce', assoc_handle: 'handle', sig: 'test-signature',
    signed: 'op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle' })) url.searchParams.set('openid.' + key, value);
  return '/callback' + url.search;
}
async function setup(t, options = {}) {
  const runtimeConfig = options.config || config;
  const transitions = [];
  let phase = ''; let snapshot; let verifies = 0; let reads = 0;
  const store = {
    authenticate: async (req) => {
      if (req.headers.authorization === 'Bearer other') return { ...owner, sessionId: randomUUID() };
      if (req.headers.authorization === 'Bearer outsider') return { ...owner, ownerId: randomUUID() };
      if (req.headers.authorization !== 'Bearer owner') throw Object.assign(new Error(), { code: 'sign_in_required', status: 401 });
      return owner;
    },
    status: async () => phase === 'complete' ? [snapshot] : [],
    transition: async (action, _owner, _attempt, profile) => {
      if (action === 'claim' && phase !== 'start') throw new Error('replay');
      if (action === 'complete' && !['ready','complete'].includes(phase)) throw new Error('not-ready');
      transitions.push(action);
      if (action === 'ready') snapshot = profile;
      phase = action;
      return randomUUID();
    },
  };
  const app = express();
  app.use(BASE, createSteamRouter({ getRuntime: () => options.disabled ? null : { config: runtimeConfig, store },
    verifyIdentity: async () => { verifies++; if (options.failProvider) throw new Error('secret-provider-payload'); return steamId; },
    readProfile: async () => { reads++; return fixture(); } }));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const call = (path, method = 'GET', headers = {}) => fetch('http://127.0.0.1:' + server.address().port + BASE + path,
    { method, redirect: 'manual', headers: { Authorization: 'Bearer owner', Origin: runtimeConfig.origin, 'X-Passport-Link': 'steam', ...headers } });
  async function connect() {
    const response = await call('/connect', 'POST');
    assert.equal(response.status, 200);
    const Cookie = response.headers.get('set-cookie').split(';')[0];
    const url = new URL((await response.json()).authorizationUrl);
    const state = new URL(url.searchParams.get('openid.return_to')).searchParams.get('state');
    assert.equal(url.origin, 'https://steamcommunity.com');
    return { Cookie, state };
  }
  return { call, connect, transitions, verifies: () => verifies, reads: () => reads };
}
test('Steam defaults off and refuses unsafe hosted configuration', () => {
  assert.equal(readRuntimeConfig({}), null);
  for (const patch of [{ NODE_ENV: 'production' }, { VERCEL: '1' }, { STEAM_LOCAL_TEST: '' },
    { STEAM_COOKIE_KEY: 'bad' }, { STEAM_TESTER_IDS: '' }, { STEAM_APP_ORIGIN: 'https://www.tryhardnames.com' },
    { STEAM_PASSPORT_DATABASE_URL: 'postgres://postgres:secret@localhost/db' },
    { STEAM_PASSPORT_DATABASE_URL: env.STEAM_PASSPORT_DATABASE_URL + '?sslmode=no-verify' },
    { STEAM_PASSPORT_PUBLIC_KEY: 'service-role' }]) assert.throws(() => readRuntimeConfig({ ...env, ...patch }), /configuration_missing/);
});

test('hosted Steam is explicit, canonical HTTPS and public access remains authenticated', async (t) => {
  const hosted = { ...env, NODE_ENV: 'production', VERCEL: '1', STEAM_LOCAL_TEST: '',
    STEAM_APP_ORIGIN: 'https://www.tryhardnames.com', STEAM_LINKING_ACCESS: 'public', STEAM_TESTER_IDS: '',
    STEAM_PASSPORT_API_URL: 'https://example.supabase.co',
    STEAM_PASSPORT_DATABASE_URL: 'postgresql://steam_passport_writer:fake@db.example.invalid/postgres' };
  const publicConfig = readRuntimeConfig(hosted);
  assert.equal(publicConfig.local, false);
  assert.equal(publicConfig.callbackUrl, 'https://www.tryhardnames.com' + BASE + '/callback');
  assert.throws(() => readRuntimeConfig({ ...hosted, STEAM_LINKING_ACCESS: 'typo' }));
  assert.throws(() => readRuntimeConfig({ ...hosted, STEAM_PASSPORT_API_URL: 'http://127.0.0.1:58521' }));
  const s = await setup(t, { config: publicConfig });
  assert.equal((await s.call('/connect', 'POST', { Authorization: '' })).status, 401);
  const response = await s.call('/connect', 'POST', { Authorization: 'Bearer outsider' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /__Secure-thn_steam_link=.*; Secure/);
  const url = new URL((await response.json()).authorizationUrl);
  assert.equal(url.searchParams.get('openid.realm'), publicConfig.origin + '/');
  assert.ok(url.searchParams.get('openid.return_to').startsWith(publicConfig.callbackUrl + '?state='));
});
test('attempt cookie binds original owner, session and expiry, authenticated and encrypted', () => {
  const value = { ...owner, id: randomUUID(), state: randomBytes(32).toString('base64url'), expires: Date.now() + 10000 };
  const sealed = sealAttempt(value, config);
  assert.deepEqual(openAttempt(sealed, config), value);
  assert.ok(!sealed.includes(owner.ownerId));
  assert.throws(() => openAttempt((sealed[0] === 'X' ? 'Y' : 'X') + sealed.slice(1), config));
  assert.throws(() => openAttempt(sealed, config, () => value.expires));
  assert.throws(() => openAttempt(sealed, { ...config, origin: 'https://other.example' }));
});
test('normalized persistence omits arbitrary payload and never turns missing playtime into zero', () => {
  const value = persistentSteamSnapshot(fixture());
  assert.ok(!JSON.stringify(value).includes('must-not-persist'));
  assert.equal(value.library.games[0].recentMinutes, null);
  assert.equal(persistentSteamSnapshot({ ...fixture(), library: null }).library.status, 'unavailable');
  assert.equal(persistentSteamSnapshot({ ...fixture(), avatarUrl: 'https://evil.example/avatar' }).avatarUrl, null);
  assert.throws(() => persistentSteamSnapshot({ ...fixture(), steamId: '123' }));
});
test('connect requires parent auth, allowlisted tester, exact origin and CSRF marker', async (t) => {
  const s = await setup(t);
  for (const [headers, status] of [[{ Authorization: '' }, 401], [{ Authorization: 'Bearer outsider' }, 403],
    [{ Origin: 'https://evil.example' }, 403], [{ 'X-Passport-Link': '' }, 403]]) {
    assert.equal((await s.call('/connect', 'POST', headers)).status, status);
  }
  assert.deepEqual(s.transitions, []);
});
test('callback consumes state once, verifies before lookup, then requires original authenticated session to save', async (t) => {
  const s = await setup(t); const { Cookie, state } = await s.connect();
  const path = callback(state);
  await s.call(path);
  assert.equal(s.verifies(), 0);
  const response = await s.call(path, 'GET', { Cookie });
  assert.equal(response.status, 303);
  assert.match(response.headers.get('location'), /steamLink=ready/);
  assert.ok(!response.headers.get('location').includes(state));
  assert.deepEqual(s.transitions, ['start', 'claim', 'ready']);
  await s.call(path, 'GET', { Cookie });
  assert.equal(s.verifies(), 1); assert.equal(s.reads(), 1);
  assert.equal((await s.call('/complete', 'POST', { Cookie, Authorization: 'Bearer other' })).status, 409);
  const complete = await s.call('/complete', 'POST', { Cookie });
  assert.equal(complete.status, 200);
  assert.match(complete.headers.get('set-cookie'), /Max-Age=0/);
  const accounts = await (await s.call('/status')).json();
  assert.equal(accounts.accounts[0].steamId, steamId);
  assert.ok(!JSON.stringify(accounts).includes('must-not-persist'));
  assert.equal((await s.call('/accounts/' + randomUUID(), 'DELETE')).status, 200);
});
test('duplicate state, cancelled and forged callbacks never reach identity verifier or data API', async (t) => {
  for (const kind of ['duplicate','cancel','forged']) {
    const s = await setup(t); const { Cookie, state } = await s.connect();
    const path = kind === 'duplicate' ? callback(state) + '&state=' + state
      : kind === 'cancel' ? '/callback?state=' + state + '&openid.mode=cancel'
        : callback(state).replace('test-signature', '');
    const response = await s.call(path, 'GET', { Cookie });
    assert.match(response.headers.get('location'), /steamLink=failed/);
    assert.equal(s.verifies(), 0); assert.equal(s.reads(), 0);
  }
});
test('signature failure cancels attempt, never reads profile or exposes raw errors', async (t) => {
  const s = await setup(t, { failProvider: true }); const { Cookie, state } = await s.connect();
  const response = await s.call(callback(state), 'GET', { Cookie });
  assert.deepEqual(s.transitions, ['start','claim','cancel']);
  assert.equal(s.reads(), 0);
  assert.ok(!JSON.stringify([...response.headers]).includes('secret-provider'));
});
test('disabled runtime and response/cookie privacy controls', async (t) => {
  const disabled = await setup(t, { disabled: true });
  assert.deepEqual(await (await disabled.call('/availability')).json(), { enabled: false });
  assert.equal((await disabled.call('/connect', 'POST')).status, 404);
  const s = await setup(t); const response = await s.call('/connect', 'POST');
  for (const item of ['HttpOnly','SameSite=Lax','Path=' + BASE]) assert.ok(response.headers.get('set-cookie').includes(item));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('database store uses parameterized transitions and sanitized failures', async () => {
  let query;
  const store = createStore({ query: async (...args) => { query = args; return { rows: [{ id: owner.passportId }] }; } });
  await store.transition('start', owner, { id: randomUUID(), state: 'a'.repeat(43) });
  assert.equal(query[1][1], owner.ownerId); assert.equal(query[1][5].length, 64);
  assert.ok(!query[0].includes(owner.ownerId));
  const failed = createStore({ query: async () => { throw new Error('database-password'); } });
  await assert.rejects(() => failed.transition('start', owner), /storage_unavailable/);
});
