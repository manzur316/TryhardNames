import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapPublicSteamActivity } from '../../src/gaming-passport/data/publicSteamActivity.js';
import { mapPublicPassportV2, publicGameHighlights } from '../../src/gaming-passport/data/publicPassportV2.js';
import { managePassportPublication } from '../../src/gaming-passport/data/passportPublication.js';

const activity = () => ({ library: { status: 'available', gameCount: 1, games: [
  { appId: 480, name: 'Spacewar', playtimeMinutes: 120, recentMinutes: null, iconUrl: null },
] }, achievements: [{ appId: 480, status: 'available', unlocked: 3, total: 49,
  recent: [{ name: 'Winner', iconUrl: 'https://shared.fastly.steamstatic.com/steamcommunity/public/images/apps/480/abcdef.jpg' }] }] });
const projection = (stats = null) => ({ schemaVersion: 2, slug: 'steam-player', alias: 'Player', bio: '', avatarUrl: '', scene: {},
  games: [{ provider: 'steam', username: 'Player', displayName: 'Player', verifiedAt: '2026-10-16T00:00:00Z',
    updatedAt: '2026-10-16T00:00:00Z', stale: false, stats }] });

test('public Steam identity and optional bounded activity map independently', () => {
  const identity = mapPublicPassportV2(projection());
  assert.equal(identity.games[0].stats, null);
  assert.equal(publicGameHighlights(identity.games)[0].game, 'Steam');
  assert.deepEqual(mapPublicPassportV2(projection(activity())).games[0].stats, activity());
});

test('public Steam rejects private fields, duplicate games, bad metrics and tracking icons', () => {
  const edits = [
    v => { v.steamId = '76561198000000001'; },
    v => { v.library.games[0].ownerId = 'private'; },
    v => { v.library.games.push(v.library.games[0]); v.achievements.push(v.achievements[0]); },
    v => { v.library.games[0].playtimeMinutes = -1; },
    v => { v.library.games[0].recentMinutes = Number.MAX_SAFE_INTEGER + 1; },
    v => { v.library.gameCount = '1'; },
    v => { v.achievements[0].unlocked = 50; },
    v => { v.achievements[0].appId = 999; },
    v => { v.achievements[0].recent[0].iconUrl = 'https://evil.test/tracking.png'; },
    v => { v.achievements[0].recent[0].accountId = 'private'; },
    v => { v.achievements[0].recent = Array(4).fill(v.achievements[0].recent[0]); },
    v => { v.library.status = 'unavailable'; },
    v => { v.library.games = Array(7).fill(v.library.games[0]); },
  ];
  for (const edit of edits) { const value = activity(); edit(value); assert.equal(mapPublicSteamActivity(value), null); }
});

test('unavailable and pending Steam data preserve null counts rather than inventing zero', () => {
  assert.deepEqual(mapPublicSteamActivity({ library: { status: 'unavailable', gameCount: null, games: [] }, achievements: [] }),
    { library: { status: 'unavailable', gameCount: null, games: [] }, achievements: [] });
  for (const status of ['unavailable', 'pending']) {
    const value = activity();
    value.achievements[0] = { appId: 480, status, unlocked: null, total: null, recent: [] };
    assert.equal(mapPublicSteamActivity(value).achievements[0].total, null);
    value.achievements[0].total = 0;
    assert.equal(mapPublicSteamActivity(value), null);
  }
});

test('Steam publication transport sends activity only when selected and explicitly enabled', async () => {
  let sent;
  const client = { rpc: async (_, args) => { sent = args; return { data: { passport: { id: 'passport', owner_id: 'owner', scene_config: {} }, accounts: [] } }; } };
  const session = { user: { id: 'owner' } };
  for (const showStats of [false, true]) {
    await managePassportPublication(client, session, 'passport', { action: 'publish', slug: 'steam-player', consent: true,
      accounts: [{ id: 'steam', provider: 'steam', selected: true, showStats }, { id: 'hidden', provider: 'steam', selected: false, showStats: true }] });
    assert.deepEqual(sent.p_accounts, [{ accountId: 'steam', showStats }]);
  }
});
