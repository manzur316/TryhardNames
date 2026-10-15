import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { BASE, readRuntimeConfig, sealAttempt, openAttempt, createOsuRouter } from '../src/integrations/osu-linking/runtime.js';
import { createAuthorization, authorizeUrl, readAuthorizedProfile } from '../src/integrations/osu-linking/client.js';

const owner = { ownerId: '11111111-1111-4111-8111-111111111111', sessionId: '22222222-2222-4222-8222-222222222222',
  passportId: '33333333-3333-4333-8333-333333333333' };
const env = { OSU_LINKING_ENABLED: 'true', OSU_APP_ORIGIN: 'https://www.tryhardnames.com',
  OSU_COOKIE_KEY: 'ab'.repeat(32), OSU_CLIENT_ID: '123',
  OSU_CLIENT_SECRET: 'fake-osu-secret-for-tests', OSU_PASSPORT_API_URL: 'https://example.supabase.co',
  OSU_PASSPORT_PUBLIC_KEY: 'sb_publishable_fake',
  OSU_PASSPORT_DATABASE_URL: 'postgresql://osu_linking_writer:fake@db.example.invalid/postgres' };
const config = readRuntimeConfig(env);
const fixture = () => ({ externalAccountId: '12345', username: 'TestPlayer', mode: 'osu', pp: 123,
  globalRank: 456, countryRank: 78, accuracyPercent: 98, medals: 2,
  verifiedAt: new Date().toISOString(), access_token: 'must-not-persist' });

async function setup(t, options = {}) {
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
  app.use(BASE, createOsuRouter({ getRuntime: () => options.disabled ? null : { config, store },
    readProfile: async () => { exchanges++; if (options.failProvider) throw new Error('secret-provider-payload'); return fixture(); } }));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const call = (path, method = 'GET', headers = {}) => fetch('http://127.0.0.1:' + server.address().port + BASE + path,
    { method, redirect: 'manual', headers: { Authorization: 'Bearer owner', Origin: config.origin, 'X-Passport-Link': 'osu', ...headers } });
  async function connect() {
    const response = await call('/connect', 'POST');
    const cookie = response.headers.get('set-cookie').split(';')[0];
    const url = new URL((await response.json()).authorizationUrl);
    return { Cookie: cookie, state: url.searchParams.get('state') };
  }
  return { call, connect, transitions, exchanges: () => exchanges };
}

test('hosted linking defaults off; enabled config requires restricted writer, HTTPS origin and encryption key', () => {
  assert.equal(readRuntimeConfig({}), null);
  assert.equal(config.callbackUrl, config.origin + BASE + '/callback');
  for (const patch of [{ OSU_COOKIE_KEY: 'bad' },
    { OSU_APP_ORIGIN: 'http://www.tryhardnames.com' }, { OSU_APP_ORIGIN: 'https://evil.example' },
    { OSU_PASSPORT_DATABASE_URL: 'postgres://postgres:secret@example.com/db' },
    { OSU_PASSPORT_DATABASE_URL: env.OSU_PASSPORT_DATABASE_URL + '?sslmode=no-verify' }]) {
    assert.throws(() => readRuntimeConfig({ ...env, ...patch }), /configuration_missing/);
  }
});

test('encrypted browser attempt rejects tampering, expiry and different application origin', () => {
  const a = createAuthorization();
  const value = { ...owner, id: randomUUID(), state: a.state, expires: Date.now() + 10000 };
  const sealed = sealAttempt(value, config);
  assert.deepEqual(openAttempt(sealed, config), value);
  assert.ok(!sealed.includes(owner.ownerId));
  assert.throws(() => openAttempt('X' + sealed.slice(1), config));
  assert.throws(() => openAttempt(sealed, config, () => value.expires));
  assert.throws(() => openAttempt(sealed, { ...config, origin: 'https://other.example' }));
});

test('production authorization and exchange use the same registered callback and minimal scopes', async () => {
  assert.throws(() => readRuntimeConfig({ ...env, OSU_APP_ORIGIN: 'http://localhost:3000', OSU_LOCAL_TEST: 'true', VERCEL: '1' }), /configuration_missing/);
  const url = new URL(authorizeUrl(config, createAuthorization()));
  assert.equal(url.searchParams.get('redirect_uri'), config.callbackUrl);
  assert.equal(url.searchParams.get('scope'), 'identify public');
  const calls = [];
  await readAuthorizedProfile('code', config, async (endpoint, options) => {
    calls.push([endpoint, options]);
    if (endpoint.endsWith('/oauth/tokens/current')) return new Response(null, { status: 200 });
    return new Response(JSON.stringify(endpoint.endsWith('/token')
      ? { access_token: 'fake-access', refresh_token: 'fake-refresh', token_type: 'Bearer' }
      : { id: 12345, username: 'TestPlayer', playmode: 'osu' }));
  });
  assert.equal(calls[0][1].body.get('redirect_uri'), config.callbackUrl);
  assert.ok(calls.at(-1)[0].endsWith('/oauth/tokens/current'));
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
  assert.equal((await s.call(path)).headers.get('location'), config.origin + '/gaming-passport?osuLink=failed#gp-osu-linked');
  assert.equal(s.exchanges(), 0);
  const callback = await s.call(path, 'GET', { Cookie });
  assert.equal(callback.status, 303);
  assert.ok(callback.headers.get('location').includes('osuLink=ready'));
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

test('cancel is bound to the original session and invalidates confirmation', async (t) => {
  const s = await setup(t);
  const { Cookie, state } = await s.connect();
  await s.call('/callback?code=code&state=' + state, 'GET', { Cookie });
  assert.equal((await s.call('/cancel', 'POST', { Cookie, Authorization: 'Bearer other' })).status, 409);
  const response = await s.call('/cancel', 'POST', { Cookie });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  assert.notEqual((await s.call('/complete', 'POST', { Cookie })).status, 200);
});

test('unlink requires auth, valid ID and the same origin', async (t) => {
  const s = await setup(t);
  const path = '/accounts/' + randomUUID();
  assert.equal((await s.call(path, 'DELETE', { Authorization: '' })).status, 401);
  assert.equal((await s.call(path, 'DELETE', { Origin: 'https://other.example' })).status, 403);
  assert.equal((await s.call('/accounts/not-a-uuid', 'DELETE')).status, 400);
  assert.deepEqual(s.transitions, []);
  assert.equal((await s.call(path, 'DELETE')).status, 200);
  assert.deepEqual(s.transitions, ['unlink']);
});
