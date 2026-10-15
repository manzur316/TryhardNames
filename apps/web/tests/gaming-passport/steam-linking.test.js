import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isSteamLinkingEnabled, steamAuthorizationUrl, steamHighlight, requestSteamLink } from '../../src/gaming-passport/data/steamLinking.js';
import { getSupabaseRuntime, resetSupabaseRuntimeForTests } from '../../src/lib/supabase/client.js';
test('persistent Steam UI accepts the production origin and local DEV, never arbitrary hosts', () => {
  assert.equal(isSteamLinkingEnabled(true, new URL('http://localhost:3000/gaming-passport')), true);
  assert.equal(isSteamLinkingEnabled(false, new URL('https://www.tryhardnames.com/')), true);
  for (const url of ['http://localhost:3000/?steamProbe=1','http://localhost:3001/','https://evil.example/','http://localhost.evil.test:3000/']) {
    assert.equal(isSteamLinkingEnabled(true, new URL(url)), false);
  }
  assert.equal(isSteamLinkingEnabled(false, new URL('http://localhost:3000/')), false);
});
test('persisted Steam highlight cannot be produced from temporary, lookup or invalid identities', () => {
  const account = { provider: 'steam', persisted: true, verification: 'openid', visibility: 'private',
    steamId: '76561198000000000', displayName: 'Player', verifiedAt: new Date().toISOString() };
  assert.equal(steamHighlight(account).target, '#gp-steam-linked');
  assert.equal(steamHighlight(account).pp, null);
  assert.equal(steamHighlight(account).globalRank, null);
  assert.equal(steamHighlight({ ...account, verifiedAt: '2020-01-01' }).stale, true);
  for (const patch of [{ persisted: false }, { verification: 'lookup' }, { visibility: 'public' },
    { steamId: '123' }, { verifiedAt: 'bad' }]) assert.equal(steamHighlight({ ...account, ...patch }), null);
});
test('only official Steam sign-in URLs can navigate the browser', () => {
  assert.equal(steamAuthorizationUrl('https://steamcommunity.com/openid/login?a=1'), 'https://steamcommunity.com/openid/login?a=1');
  for (const value of ['https://evil.example/openid/login','http://steamcommunity.com/openid/login',
    'https://steamcommunity.com/other','https://foo@steamcommunity.com/openid/login']) assert.throws(() => steamAuthorizationUrl(value));
});
test('persistent requests bind to current parent session and same-origin CSRF protected routes', async (t) => {
  resetSupabaseRuntimeForTests();
  t.after(resetSupabaseRuntimeForTests);
  await getSupabaseRuntime({ config: { isConfigured: true, url: 'https://example.supabase.co', publishableKey: 'sb_publishable_fake' },
    factory: () => ({ auth: { getSession: async () => ({ data: { session: { access_token: 'fake-token', user: { id: 'owner' } } } }) } }) });
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  let requests = 0;
  globalThis.fetch = async (url, options) => {
    requests++;
    assert.equal(url, '/api/v1/integrations/steam/complete');
    assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'same-origin');
    assert.equal(options.headers.Authorization, 'Bearer fake-token');
    assert.equal(options.headers['X-Passport-Link'], 'steam');
    return Response.json({ linked: true });
  };
  await assert.rejects(() => requestSteamLink('complete','another-owner'), /sign_in_required/);
  await assert.rejects(() => requestSteamLink('unlink','owner','../../anything'), /invalid_request/);
  assert.equal(requests, 0);
  assert.deepEqual(await requestSteamLink('complete','owner'), { linked: true });
});
test('saved Steam requires explicit confirmation and remains out of public profile surfaces', () => {
  const read = (file) => readFileSync(new URL('../../src/gaming-passport/components/' + file, import.meta.url), 'utf8');
  const component = read('PersistentSteamConnections.jsx');
  assert.match(component, /Confirm Steam link/);
  assert.match(component, /Confirm Steam unlink/);
  assert.match(component, /onBeforeConnect/);
  assert.match(component, /Saved privately to your Passport/);
  assert.doesNotMatch(component, /localStorage|sessionStorage|STEAM_WEB_API_KEY|publication_consent|updatePassport/);
  assert.match(read('PassportWorkspace.jsx'), /import PersistentSteamConnections/);
  assert.match(read('PassportWorkspace.jsx'), /\.\.\.linkedSteamHighlights/);
  assert.doesNotMatch(read('PublicPassportCard.jsx'), /PersistentSteamConnections/);
});
