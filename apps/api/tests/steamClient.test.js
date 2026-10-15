import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSteamLibrary, normalizeSteamProfile, readSteamSnapshot } from '../src/integrations/steam/client.js';

const steamId = '76561198000000000';
const apiKey = 'a'.repeat(32);
test('Steam data requests keep the API key in a header and enforce the verified identity', async () => {
  const calls = [];
  const snapshot = await readSteamSnapshot(steamId, { apiKey }, async (url, options) => {
    calls.push(url);
    assert.equal(new URL(url).origin, 'https://api.steampowered.com');
    assert.ok(!url.includes(apiKey));
    assert.equal(options.headers['x-webapi-key'], apiKey);
    assert.equal(options.redirect, 'error');
    return Response.json(url.includes('GetPlayerSummaries')
      ? { response: { players: [{ steamid: steamId, personaname: 'Player', realname: 'exclude' }] } }
      : { response: { game_count: 0 } });
  });
  assert.equal(calls.length, 2);
  assert.equal(snapshot.displayName, 'Player');
  assert.equal(snapshot.realname, undefined);
  assert.deepEqual(snapshot.library, { status: 'available', gameCount: 0, games: [] });
  assert.throws(() => normalizeSteamProfile({ steamid: 'different', personaname: 'Other' }, steamId));
});
test('private Steam libraries are unavailable, not zero, and game snapshots are bounded', () => {
  assert.deepEqual(normalizeSteamLibrary({ response: {} }), { status: 'unavailable', gameCount: null, games: [] });
  const library = normalizeSteamLibrary({ response: { game_count: 8, games: Array.from({ length: 8 }, (_, i) => ({ appid: i + 1, name: 'Game', playtime_forever: i })) } });
  assert.equal(library.gameCount, 8); assert.equal(library.games.length, 6);
  assert.equal(library.games[0].playtimeMinutes, 7);
  assert.equal(library.games[0].recentMinutes, null);
});
test('Steam API errors do not undo OpenID verification or expose provider error payloads', async () => {
  for (const status of [403, 429, 500]) {
    const snapshot = await readSteamSnapshot(steamId, { apiKey }, async () => new Response('sensitive upstream body', { status }));
    assert.equal(snapshot.steamId, steamId);
    assert.equal(snapshot.verification, 'openid');
    assert.equal(snapshot.library.status, 'unavailable');
    assert.ok(snapshot.dataError);
    assert.ok(!JSON.stringify(snapshot).includes('sensitive'));
  }
});
