import test from 'node:test';
import assert from 'node:assert/strict';
import { cronAuthorized, refreshBatch, dailyRefreshHandler } from '../src/integrations/dailyRefresh.js';
import { normalizeAchievements, safeAchievementDetails, achievementIcon, readDailySteamSnapshot } from '../src/integrations/steam/achievements.js';
import { createDailyOsuReader } from '../src/integrations/osu-linking/daily.js';

test('cron rejects missing, malformed and incorrect secrets', () => {
  assert.equal(cronAuthorized(undefined, undefined), false);
  assert.equal(cronAuthorized('Bearer undefined', undefined), false);
  assert.equal(cronAuthorized('Bearer bad', 'x'.repeat(32)), false);
  assert.equal(cronAuthorized('Bearer ' + 'x'.repeat(32), 'x'.repeat(32)), true);
});
test('achievement progress joins API names and exposes at most three unlocked icons', () => {
  const defs = Array.from({ length: 5 }, (_, i) => ({ name: 'a' + i, displayName: 'Achievement ' + i, icon: 'https://evil.example/image' }));
  const result = normalizeAchievements({ playerstats: { success: true, achievements: defs.map((a, i) => ({ apiname: a.name, achieved: i < 4 ? 1 : 0, unlocktime: i })) } },
    { game: { availableGameStats: { achievements: defs } } });
  assert.equal(result.total, 5); assert.equal(result.unlocked, 4); assert.equal(result.recent.length, 3);
  assert.equal(result.recent[0].name, 'Achievement 3'); assert.equal(result.recent[0].iconUrl, null);
  assert.equal(normalizeAchievements({}, {}).status, 'unavailable');
  assert.equal(achievementIcon('https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/730/abcdef.jpg'),
    'https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/730/abcdef.jpg');
  assert.equal(achievementIcon('http://cdn.fastly.steamstatic.com/image'), null);
});
test('stored malformed details cannot produce fake progress or unsafe images', () => {
  assert.equal(safeAchievementDetails([{ appId: 1, status: 'available', total: 2, unlocked: 3 }], [{ appId: 1 }])[0].status, 'pending');
  assert.equal(safeAchievementDetails([], [{ appId: 1 }])[0].total, null);
});
test('batch only queries claimed accounts and persists errors without throwing secrets', async () => {
  let claims = 0; const finished = [];
  const result = await refreshBatch({ provider: 'steam', store: {
    claim: async () => ++claims <= 2 ? { id: claims } : null,
    finish: async (account, data) => { finished.push([account.id, data]); return data !== null; },
  }, read: async (account) => { if (account.id === 2) throw new Error('secret'); return { snapshot: {} }; } });
  assert.equal(result.updated, 1); assert.equal(result.unavailable, 1); assert.deepEqual(finished[1], [2, null]);
  assert.equal(JSON.stringify(result).includes('secret'), false);
});
test('batch stops immediately on upstream quota errors', async () => {
  let claims = 0;
  const result = await refreshBatch({ provider: 'steam', store: { claim: async () => ({ id: ++claims }), finish: async () => false },
    read: async () => { throw Object.assign(new Error('rate_limited'), { code: 'rate_limited' }); } });
  assert.equal(claims, 1); assert.equal(result.rateLimited, true);
});
test('unauthenticated cron cannot touch providers or DB', async () => {
  let code, body;
  const res = { set() {}, status(value) { code = value; return this; }, json(value) { body = value; } };
  await dailyRefreshHandler({ env: { CRON_SECRET: 'x'.repeat(32) }, run: () => { throw new Error('must not run'); } })({ headers: {}, params: { provider: 'steam' } }, res);
  assert.equal(code, 401); assert.equal(body.error, 'unauthorized');
});
test('Steam daily refresh retains verification timestamp and respects private library', async () => {
  let calls = 0;
  const result = await readDailySteamSnapshot({ externalId: '76561198000000000', verifiedAt: '2026-01-01T00:00:00Z' }, { apiKey: 'test' }, async () => {
    calls++;
    return Response.json(calls === 1 ? { response: { players: [{ steamid: '76561198000000000', personaname: 'Player' }] } } : { response: {} });
  });
  assert.equal(calls, 2); assert.equal(result.snapshot.verifiedAt, '2026-01-01T00:00:00.000Z');
  assert.equal(result.snapshot.library.status, 'unavailable'); assert.deepEqual(result.achievements, []);
});
test('osu daily lookup uses immutable ID/mode and does not impersonate OAuth owner', async () => {
  const calls = [];
  const read = createDailyOsuReader({ clientId: '1', clientSecret: 'test' }, async (url, options) => {
    calls.push([url, options]);
    return Response.json(calls.length === 1 ? { access_token: 'public-token' } : { id: 123, username: 'Player', playmode: 'mania', statistics: { pp: 1 } });
  });
  const result = await read({ externalId: '123', mode: 'osu', verifiedAt: '2026-01-01' });
  assert.equal(calls[0][1].body.get('scope'), 'public'); assert.match(calls[1][0], /users\/123\/osu\?key=id$/);
  assert.equal(result.snapshot.mode, 'osu'); assert.equal(result.snapshot.verifiedAt, '2026-01-01');
});
