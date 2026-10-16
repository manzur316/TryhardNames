import { readSteamSnapshot, steamApi } from './client.js';
import { persistentSteamSnapshot } from './snapshot.js';

const text = (value, max) => typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, max) : '';
export function achievementIcon(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port && url.href.length <= 256
      && ['cdn.cloudflare.steamstatic.com', 'cdn.akamai.steamstatic.com', 'cdn.fastly.steamstatic.com',
        'steamcdn-a.akamaihd.net', 'steamcommunity-a.akamaihd.net', 'shared.akamai.steamstatic.com',
        'shared.fastly.steamstatic.com'].includes(url.hostname)
      && /^\/steamcommunity\/public\/images\/apps\/\d+\/[a-f0-9]+\.(jpg|png)$/.test(url.pathname)) return url.href;
  } catch { /* Provider images are optional. */ }
  return null;
}
export function normalizeAchievements(player, schema) {
  const stats = player?.playerstats;
  const definitions = schema?.game?.availableGameStats?.achievements;
  if (stats?.success !== true || !Array.isArray(stats.achievements) || !Array.isArray(definitions)) {
    return { status: 'unavailable', unlocked: null, total: null, recent: [] };
  }
  const byName = new Map(definitions.filter((a) => typeof a.name === 'string').map((a) => [a.name, a]));
  const unique = new Map(stats.achievements.filter((a) => byName.has(a.apiname)).map((a) => [a.apiname, a]));
  // An incomplete response is not a valid completion percentage.
  if (unique.size !== byName.size) return { status: 'unavailable', unlocked: null, total: null, recent: [] };
  const unlocked = [...unique.values()].filter((a) => a.achieved === 1);
  return { status: 'available', unlocked: unlocked.length, total: byName.size,
    recent: unlocked.sort((a, b) => (b.unlocktime || 0) - (a.unlocktime || 0)).slice(0, 3).map((a) => {
      const definition = byName.get(a.apiname);
      return { name: text(definition.displayName, 64) || text(a.apiname, 64), iconUrl: achievementIcon(definition.icon) };
    }) };
}
export function safeAchievementDetails(input, games) {
  return games.map((game) => {
    const item = Array.isArray(input) ? input.find((a) => a?.appId === game.appId) : null;
    if (item?.status !== 'available' || !Number.isSafeInteger(item.total) || item.total < 0 || item.total > 100000
      || !Number.isSafeInteger(item.unlocked) || item.unlocked < 0 || item.unlocked > item.total) {
      return { appId: game.appId, status: item?.status === 'unavailable' ? 'unavailable' : 'pending', unlocked: null, total: null, recent: [] };
    }
    return { appId: game.appId, status: 'available', total: item.total, unlocked: item.unlocked,
      recent: (Array.isArray(item.recent) ? item.recent : []).slice(0, 3)
        .map((a) => ({ name: text(a.name, 64), iconUrl: achievementIcon(a.iconUrl) })) };
  });
}
export async function readDailySteamSnapshot(account, config, fetchImpl = fetch, schemaCache = new Map()) {
  const profile = await readSteamSnapshot(account.externalId, config, fetchImpl);
  if (profile.dataError) throw new Error(profile.dataError);
  const snapshot = persistentSteamSnapshot({ ...profile, verifiedAt: account.verifiedAt });
  const achievements = [];
  for (const game of snapshot.library.games) {
    let details = { status: 'unavailable', unlocked: null, total: null, recent: [] };
    try {
      // A schema is shared across accounts in this run; personal progress is never shared.
      let schema = schemaCache.get(game.appId);
      if (!schema) {
        schema = await steamApi('ISteamUserStats/GetSchemaForGame/v2/', { appid: game.appId, l: 'english' }, config.apiKey, fetchImpl);
        schemaCache.set(game.appId, schema);
      }
      const player = await steamApi('ISteamUserStats/GetPlayerAchievements/v1/',
        { steamid: account.externalId, appid: game.appId, l: 'english' }, config.apiKey, fetchImpl);
      details = normalizeAchievements(player, schema);
    } catch (error) {
      // Stop on quota errors; do not turn a provider outage into fabricated zero progress.
      if (error.code === 'rate_limited') throw error;
    }
    achievements.push({ appId: game.appId, ...details });
  }
  return { snapshot, achievements };
}
