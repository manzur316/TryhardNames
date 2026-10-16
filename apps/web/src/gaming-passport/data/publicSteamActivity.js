const exact = (value, fields) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === fields.length && fields.every((key) => Object.hasOwn(value, key));
const integer = (value, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= 0 && value <= max;
const optionalNumber = (value, max) => value === null || integer(value, max);
const name = (value, max) => typeof value === 'string' && value.length <= max;
const image = (value) => value === null || (typeof value === 'string' && value.length <= 256
  && /^https:\/\/(?:cdn\.(?:cloudflare|akamai|fastly)\.steamstatic\.com|steamcdn-a\.akamaihd\.net|steamcommunity-a\.akamaihd\.net|shared\.(?:akamai|fastly)\.steamstatic\.com)\/steamcommunity\/public\/images\/apps\/[0-9]+\/[a-f0-9]+\.(?:jpg|png)$/.test(value));

// Fail closed on extra fields: public activity must never become a raw snapshot.
export function mapPublicSteamActivity(value) {
  if (!exact(value, ['library', 'achievements']) || !exact(value.library, ['status', 'gameCount', 'games'])) return null;
  const { library, achievements } = value;
  if (!['available', 'unavailable'].includes(library.status) || !optionalNumber(library.gameCount, 999999999)
    || !Array.isArray(library.games) || library.games.length > 6 || !Array.isArray(achievements)
    || achievements.length !== library.games.length) return null;
  if (library.status === 'unavailable' && (library.games.length || library.gameCount !== null)) return null;
  const ids = new Set();
  for (const game of library.games) {
    if (!exact(game, ['appId', 'name', 'playtimeMinutes', 'recentMinutes', 'iconUrl'])
      || !integer(game.appId, 9999999999) || !game.appId || ids.has(game.appId) || !name(game.name, 100)
      || !optionalNumber(game.playtimeMinutes, 999999999999999) || !optionalNumber(game.recentMinutes, 999999999999999)
      || !image(game.iconUrl)) return null;
    ids.add(game.appId);
  }
  const details = new Set();
  for (const item of achievements) {
    if (!exact(item, ['appId', 'status', 'unlocked', 'total', 'recent']) || !ids.has(item.appId) || details.has(item.appId)
      || !['available', 'unavailable', 'pending'].includes(item.status) || !Array.isArray(item.recent) || item.recent.length > 3) return null;
    if (item.status === 'available') {
      if (!integer(item.unlocked, 100000) || !integer(item.total, 100000) || item.unlocked > item.total) return null;
    } else if (item.unlocked !== null || item.total !== null || item.recent.length) return null;
    if (item.recent.some((icon) => !exact(icon, ['name', 'iconUrl']) || !name(icon.name, 64) || !image(icon.iconUrl))) return null;
    details.add(item.appId);
  }
  return { library: { ...library, games: library.games.map((game) => ({ ...game })) },
    achievements: achievements.map((item) => ({ ...item, recent: item.recent.map((icon) => ({ ...icon })) })) };
}
