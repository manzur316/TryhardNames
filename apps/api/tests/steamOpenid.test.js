import test from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { verifySteamIdentity } from '../src/integrations/steam/openid.js';
import { CALLBACK_URL, OPENID_NS, STEAM_ENDPOINT } from '../src/integrations/steam/constants.js';

const steamId = '76561198000000000';
function assertion() {
  const state = randomBytes(32).toString('base64url');
  const url = new URL(CALLBACK_URL + '?state=' + state);
  const fields = { ns: OPENID_NS, mode: 'id_res', op_endpoint: STEAM_ENDPOINT,
    claimed_id: 'https://steamcommunity.com/openid/id/' + steamId,
    identity: 'https://steamcommunity.com/openid/id/' + steamId, return_to: url.href,
    response_nonce: new Date().toISOString() + randomBytes(12).toString('hex'), assoc_handle: 'fixture',
    signed: 'op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle', sig: 'fixture' };
  for (const [key, value] of Object.entries(fields)) url.searchParams.set('openid.' + key, value);
  return { url, state };
}
const fixtureWorker = (accept) => (data) => new Worker(new URL('./fixtures/steamOpenidWorker.js', import.meta.url), {
  workerData: { ...data, accept }, env: {}, execArgv: [], stdout: true, stderr: true,
});

test('real OpenID engine accepts only the provider-validated signature in an isolated worker', async () => {
  const requireOpenId = createRequire(import.meta.resolve('openid'));
  const axios = requireOpenId('axios').default;
  const before = axios.interceptors.request.handlers.length;
  const a = assertion();
  assert.equal(await verifySteamIdentity(a.url, a.state, CALLBACK_URL, { workerFactory: fixtureWorker(true) }), steamId);
  const b = assertion();
  await assert.rejects(verifySteamIdentity(b.url, b.state, CALLBACK_URL, { workerFactory: fixtureWorker(false) }), { code: 'invalid_callback' });
  assert.equal(axios.interceptors.request.handlers.length, before);
});

test('expired nonce and foreign identity are rejected without successful provider validation', async () => {
  const a = assertion();
  a.url.searchParams.set('openid.response_nonce', '2000-01-01T00:00:00Zold');
  await assert.rejects(verifySteamIdentity(a.url, a.state), { code: 'invalid_callback' });
  const b = assertion(); b.url.searchParams.set('openid.claimed_id', 'https://evil.example/id');
  await assert.rejects(verifySteamIdentity(b.url, b.state), { code: 'invalid_callback' });
});

test('worker timeout and errors fail closed and terminate resources', async () => {
  let stopped = 0;
  const workerFactory = () => {
    const worker = new EventEmitter(); worker.terminate = async () => { stopped++; };
    return worker;
  };
  const a = assertion();
  await assert.rejects(verifySteamIdentity(a.url, a.state, CALLBACK_URL, { workerFactory, timeoutMs: 10 }), { code: 'invalid_callback' });
  assert.equal(stopped, 1);
  const b = assertion();
  await assert.rejects(verifySteamIdentity(b.url, b.state, CALLBACK_URL, {
    workerFactory: () => { throw new Error('private-host-details'); },
  }), { code: 'invalid_callback' });
});
