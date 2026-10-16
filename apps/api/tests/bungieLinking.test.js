import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { BASE, readRuntimeConfig, sealAttempt, openAttempt, createBungieRouter } from '../src/integrations/bungie/runtime.js';
import { createAuthorization, authorizeUrl, readAuthorizedProfile } from '../src/integrations/bungie/client.js';

const owner = { ownerId: '11111111-1111-4111-8111-111111111111', sessionId: '22222222-2222-4222-8222-222222222222',
  passportId: '33333333-3333-4333-8333-333333333333' };
const env = { BUNGIE_LINKING_ENABLED: 'true', BUNGIE_APP_ORIGIN: 'https://www.tryhardnames.com',
  BUNGIE_TESTER_IDS: owner.ownerId, BUNGIE_COOKIE_KEY: 'ab'.repeat(32), BUNGIE_CLIENT_ID: '123',
  BUNGIE_API_KEY: 'fake-api-key', BUNGIE_CLIENT_SECRET: 'fake-bungie-secret-for-tests', BUNGIE_PASSPORT_API_URL: 'https://example.supabase.co',
  BUNGIE_PASSPORT_PUBLIC_KEY: 'sb_publishable_fake',
  BUNGIE_PASSPORT_DATABASE_URL: 'postgresql://bungie_passport_writer:fake@db.example.invalid/postgres' };
const config = readRuntimeConfig(env);
const fixture = () => ({ accountId: '12345', bungieName: 'TestPlayer#1234', displayName: 'Test Player', avatarUrl: null,
  destinyMemberships: [], verifiedAt: new Date().toISOString(), access_token: 'must-not-persist' });

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
  app.use(BASE, createBungieRouter({ getRuntime: () => options.disabled ? null : { config: runtimeConfig, store },
    readProfile: async () => { exchanges++; if (options.failProvider) throw new Error('secret-provider-payload'); return fixture(); } }));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const call = (path, method = 'GET', headers = {}) => fetch('http://127.0.0.1:' + server.address().port + BASE + path,
    { method, redirect: 'manual', headers: { Authorization: 'Bearer owner', Origin: config.origin, 'X-Passport-Link': 'bungie', ...headers } });
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
  for (const patch of [{ BUNGIE_COOKIE_KEY: 'bad' }, { BUNGIE_TESTER_IDS: '' },
    { BUNGIE_APP_ORIGIN: 'http://www.tryhardnames.com' }, { BUNGIE_APP_ORIGIN: 'https://evil.example' },
    { BUNGIE_PASSPORT_DATABASE_URL: 'postgres://postgres:secret@example.com/db' },
    { BUNGIE_PASSPORT_DATABASE_URL: env.BUNGIE_PASSPORT_DATABASE_URL + '?sslmode=no-verify' }]) {
    assert.throws(() => readRuntimeConfig({ ...env, ...patch }), /configuration_missing/);
  }
});

test('encrypted browser attempt rejects tampering, expiry and different application origin', () => {
  const a = createAuthorization();
  const value = { ...owner, id: randomUUID(), state: a.state, expires: Date.now() + 10000 };
  const sealed = sealAttempt(value, config);
  assert.deepEqual(openAttempt(sealed, config), value);
  assert.ok(!sealed.includes(owner.ownerId));
  assert.throws(() => openAttempt((sealed[0] === 'X' ? 'Y' : 'X') + sealed.slice(1), config));
  assert.throws(() => openAttempt(sealed, config, () => value.expires));
  assert.throws(() => openAttempt(sealed, { ...config, origin: 'https://other.example' }));
});

test('public Bungie allows a non-tester through the complete flow, without bypassing auth', async (t) => {
  assert.throws(() => readRuntimeConfig({ ...env, BUNGIE_APP_ORIGIN: 'http://localhost:3000', BUNGIE_LOCAL_TEST: 'true', VERCEL: '1' }), /configuration_missing/);
  const publicConfig = readRuntimeConfig({ ...env, BUNGIE_LINKING_ACCESS: 'public', BUNGIE_TESTER_IDS: '' });
  assert.equal(publicConfig.testers.size, 0);
  assert.throws(() => readRuntimeConfig({ ...env, BUNGIE_LINKING_ACCESS: 'typo' }));
  const s = await setup(t, { config: publicConfig });
  assert.equal((await s.call('/connect', 'POST', { Authorization: '' })).status, 401);
  const { Cookie, state } = await s.connect();
  assert.match((await s.call('/callback?code=code&state=' + state, 'GET', { Cookie })).headers.get('location'), /bungieLink=ready/);
  assert.equal((await s.call('/complete', 'POST', { Cookie })).status, 200);
  assert.deepEqual(s.transitions, ['start','claim','ready','complete']);
});

test('tester mode still rejects a valid owner outside its allowlist', async (t) => {
  const s = await setup(t, { config: { ...config, testers: new Set() } });
  assert.equal((await s.call('/connect', 'POST')).status, 403);
  assert.equal((await s.call('/status')).status, 403);
  assert.deepEqual(s.transitions, []);
});

test('Bungie exchange binds the token membership ID and does not request dynamic scopes or persist grants', async () => {
  const url = new URL(authorizeUrl(config, createAuthorization()));
  assert.equal(url.origin, 'https://www.bungie.net');
  assert.equal(url.searchParams.get('redirect_uri'), config.callbackUrl);
  assert.equal(url.searchParams.has('scope'), false);
  const calls = [];
  const fetcher = async (endpoint, options) => {
    calls.push([endpoint, options]);
    assert.equal(options.redirect, 'error');
    return Response.json(endpoint.endsWith('/token/')
      ? { access_token: 'fake-access', refresh_token: 'fake-refresh', token_type: 'Bearer', membership_id: '12345', expires_in: 3600 }
      : { ErrorCode: 1, Response: { bungieNetUser: { membershipId: '12345', displayName: 'Player' }, destinyMemberships: [] } });
  };
  const result = await readAuthorizedProfile('code', config, fetcher);
  assert.equal(calls[0][1].body.get('redirect_uri'), config.callbackUrl);
  assert.equal(calls[1][1].headers['X-API-Key'], 'fake-api-key');
  assert.equal(calls[1][1].headers.Authorization, 'Bearer fake-access');
  assert.equal(result.accountId, '12345');
  assert.ok(!JSON.stringify(result).includes('fake-'));
  await assert.rejects(readAuthorizedProfile('code', config, async (endpoint) => Response.json(endpoint.endsWith('/token/')
    ? { access_token: 'fake-access', token_type: 'Bearer', membership_id: '12345', expires_in: 3600 }
    : { ErrorCode: 1, Response: { bungieNetUser: { membershipId: '999', displayName: 'Wrong' } } })), /authenticated Bungie identity/);
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
  assert.equal((await s.call(path)).headers.get('location'), config.origin + '/gaming-passport?bungieLink=failed#gp-bungie-linked');
  assert.equal(s.exchanges(), 0);
  const callback = await s.call(path, 'GET', { Cookie });
  assert.equal(callback.status, 303);
  assert.ok(callback.headers.get('location').includes('bungieLink=ready'));
  assert.ok(!callback.headers.get('location').includes('secret-code'));
  await s.call(path, 'GET', { Cookie });
  assert.equal(s.exchanges(), 1);
  assert.equal((await s.call('/complete', 'POST', { Cookie, Authorization: 'Bearer other' })).status, 409);
  const complete = await s.call('/complete', 'POST', { Cookie });
  assert.equal(complete.status, 200);
  assert.match(complete.headers.get('set-cookie'), /Max-Age=0/);
  const accounts = await (await s.call('/status')).json();
  assert.equal(accounts.accounts[0].bungieName, 'TestPlayer#1234');
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

test('Bungie malformed and duplicate callbacks never exchange a code', async (t) => {
  const s = await setup(t); const { Cookie, state } = await s.connect();
  for (const query of ['code=code&state=bad', 'code=code&state='+state+'&state='+state,
    'error=denied&state='+state]) {
    const r = await s.call('/callback?'+query, 'GET', { Cookie });
    assert.match(r.headers.get('location'), /bungieLink=failed/);
  }
  assert.equal(s.exchanges(),0);
});

test('snapshot strips grants and validates avatars, membership identities and timestamps', async () => {
  const { persistentBungieSnapshot } = await import('../src/integrations/bungie/snapshot.js');
  const profile = { ...fixture(), destinyMemberships: [{ accountId: '123456', platform: 3, displayName: 'Guardian', crossSaveOverride: 3 }] };
  const safe = persistentBungieSnapshot(profile);
  assert.equal(safe.destinyMemberships[0].platform, 3);
  assert.equal(safe.access_token, undefined);
  for (const patch of [{ accountId: 12345 }, { avatarUrl: 'https://evil.example/image.png' },
    { verifiedAt: 'not-a-date' }, { destinyMemberships: [null] },
    { destinyMemberships: [profile.destinyMemberships[0],profile.destinyMemberships[0]] },
    { destinyMemberships: [{ ...profile.destinyMemberships[0], platform: -1 }] }]) {
    assert.throws(() => persistentBungieSnapshot({ ...profile, ...patch }));
  }
  assert.equal(persistentBungieSnapshot({ ...profile, destinyMemberships: [] }).destinyMemberships.length, 0);
});

test('store uses a restricted parameterized transition and suppresses database details', async () => {
  const { createStore } = await import('../src/integrations/bungie/runtime.js');
  const calls = [];
  const store = createStore({ query: async (...args) => { calls.push(args); return { rows: [{ id: owner.passportId }] }; } });
  await store.transition('start',owner,{id:randomUUID(),state:'state'});
  assert.match(calls[0][0], /private.bungie_link_transition\(\$1,\$2::uuid/);
  assert.equal(calls[0][1][0], 'start');
  assert.equal(calls[0][1][5].length, 64);
  assert.ok(!calls[0][0].includes(owner.ownerId));
  const failed = createStore({ query: async () => { throw new Error('secret-connection-details'); } });
  await assert.rejects(failed.transition('start',owner,null), /storage_unavailable/);
});
