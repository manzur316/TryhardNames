const integer = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
// eslint-disable-next-line no-control-regex -- Remove control characters before storing display text.
const clean = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : '';
function image(value, hosts) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port && url.href.length <= 512
      && hosts.includes(url.hostname)) return url.href;
  } catch { /* Optional provider artwork. */ }
  return null;
}
// Persist normalized display facts only, never OpenID assertions, tokens or arbitrary provider payloads.
export function persistentSteamSnapshot(profile) {
  if (!profile || !/^7656119\d{10}$/.test(profile.steamId || '') || !clean(profile.displayName, 64)
    || !Number.isFinite(Date.parse(profile.verifiedAt))) throw new Error('invalid_snapshot');
  const library = profile.library;
  const available = library?.status === 'available' && integer(library.gameCount) !== null;
  const games = available && Array.isArray(library.games) ? library.games.slice(0, 6).map((game) => {
    const appId = integer(game.appId);
    if (!appId) throw new Error('invalid_snapshot');
    return { appId, name: clean(game.name, 100) || 'App ' + appId,
      playtimeMinutes: integer(game.playtimeMinutes), recentMinutes: integer(game.recentMinutes),
      iconUrl: image(game.iconUrl, ['cdn.cloudflare.steamstatic.com']) };
  }) : [];
  return { steamId: profile.steamId, displayName: clean(profile.displayName, 64),
    avatarUrl: image(profile.avatarUrl, ['avatars.steamstatic.com', 'avatars.fastly.steamstatic.com',
      'avatars.akamai.steamstatic.com', 'steamcdn-a.akamaihd.net']),
    createdAt: profile.createdAt && Number.isFinite(Date.parse(profile.createdAt))
      && Date.parse(profile.createdAt) <= Date.now() ? new Date(profile.createdAt).toISOString() : null,
    verifiedAt: new Date(profile.verifiedAt).toISOString(),
    library: { status: available ? 'available' : 'unavailable', gameCount: available ? library.gameCount : null, games },
    dataError: ['unauthorized', 'rate_limited', 'invalid_response', 'request_failed'].includes(profile.dataError)
      ? profile.dataError : null };
}
