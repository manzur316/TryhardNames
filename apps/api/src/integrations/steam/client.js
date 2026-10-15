import { CALLBACK_URL, OPENID_NS, STEAM_ENDPOINT } from './constants.js';

export const MESSAGES = Object.freeze({
  configuration_missing: 'Add STEAM_WEB_API_KEY to the private Steam configuration file.',
  invalid_callback: 'Steam sign-in could not be verified. Start a new sign-in.',
  cancelled: 'Steam sign-in was cancelled.',
  request_failed: 'Steam is unavailable. Try again later.',
  unauthorized: 'Steam rejected the API key. Identity verification is separate from API access.',
  rate_limited: 'Too many requests. Wait before trying again.',
  invalid_response: 'Steam returned an unexpected response.',
});
export class SteamProbeError extends Error {
  constructor(code, retryAfterSeconds = null) {
    super(MESSAGES[code] || MESSAGES.request_failed);
    this.code = Object.hasOwn(MESSAGES, code) ? code : 'request_failed';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
export function readSteamConfig(env) {
  const apiKey = env.STEAM_WEB_API_KEY?.trim();
  if (!/^[a-fA-F0-9]{32}$/.test(apiKey || '')) throw new SteamProbeError('configuration_missing');
  return { apiKey };
}
export function steamReturnTo(state, callbackUrl = CALLBACK_URL) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(state)) throw new SteamProbeError('invalid_callback');
  return `${callbackUrl}?state=${state}`;
}
export function steamAuthorizeUrl(state, callbackUrl = CALLBACK_URL) {
  const url = new URL(STEAM_ENDPOINT);
  url.search = new URLSearchParams({
    'openid.ns': OPENID_NS, 'openid.mode': 'checkid_setup',
    'openid.return_to': steamReturnTo(state, callbackUrl), 'openid.realm': `${new URL(callbackUrl).origin}/`,
    'openid.identity': `${OPENID_NS}/identifier_select`,
    'openid.claimed_id': `${OPENID_NS}/identifier_select`,
  });
  return url.href;
}
export function validateSteamAssertion(url, state, callbackUrl = CALLBACK_URL) {
  if (url.origin + url.pathname !== callbackUrl || url.searchParams.get('state') !== state) {
    throw new SteamProbeError('invalid_callback');
  }
  const fields = url.searchParams;
  for (const key of fields.keys()) {
    if (fields.getAll(key).length !== 1 || (!key.startsWith('openid.') && key !== 'state')) {
      throw new SteamProbeError('invalid_callback');
    }
  }
  if (fields.get('openid.mode') === 'cancel') throw new SteamProbeError('cancelled');
  const claimed = fields.get('openid.claimed_id');
  const match = /^https:\/\/steamcommunity\.com\/openid\/id\/(7656119\d{10})$/.exec(claimed || '');
  const signed = new Set((fields.get('openid.signed') || '').split(','));
  if (!match || fields.get('openid.identity') !== claimed
    || fields.get('openid.ns') !== OPENID_NS || fields.get('openid.mode') !== 'id_res'
    || fields.get('openid.op_endpoint') !== STEAM_ENDPOINT
    || fields.get('openid.return_to') !== steamReturnTo(state, callbackUrl)
    || !['op_endpoint', 'claimed_id', 'identity', 'return_to', 'response_nonce', 'assoc_handle']
      .every((key) => signed.has(key) && fields.get(`openid.${key}`))
    || !fields.get('openid.sig')) throw new SteamProbeError('invalid_callback');
  return match[1];
}

const integer = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
// eslint-disable-next-line no-control-regex -- Remove control characters from provider display text.
const safeText = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max) : '';
export function normalizeSteamProfile(player, steamId, now = Date.now) {
  if (!player || player.steamid !== steamId || !safeText(player.personaname, 64)) throw new SteamProbeError('invalid_response');
  let avatarUrl = null;
  try {
    const url = new URL(player.avatarfull);
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port
      && ['avatars.steamstatic.com', 'avatars.fastly.steamstatic.com', 'avatars.akamai.steamstatic.com',
        'steamcdn-a.akamaihd.net'].includes(url.hostname)) avatarUrl = url.href;
  } catch { /* Optional image; never allow arbitrary provider-supplied URLs. */ }
  const created = integer(player.timecreated);
  return { steamId, displayName: safeText(player.personaname, 64), avatarUrl,
    profileUrl: `https://steamcommunity.com/profiles/${steamId}/`,
    createdAt: created !== null && created > 0 && created * 1000 <= now() ? new Date(created * 1000).toISOString() : null,
    profileVisibility: player.communityvisibilitystate === 3 ? 'public' : 'private',
  };
}
export function normalizeSteamLibrary(data) {
  const response = data?.response;
  if (!response || typeof response !== 'object' || Array.isArray(response)) throw new SteamProbeError('invalid_response');
  if (!Object.hasOwn(response, 'game_count')) return { status: 'unavailable', gameCount: null, games: [] };
  const count = integer(response.game_count);
  if (count === null || (count > 0 && !Array.isArray(response.games))) throw new SteamProbeError('invalid_response');
  const games = (response.games || []).map((game) => {
    const appId = integer(game.appid);
    if (!appId) throw new SteamProbeError('invalid_response');
    return { appId, name: safeText(game.name, 100) || `App ${appId}`,
      playtimeMinutes: integer(game.playtime_forever),
      recentMinutes: integer(game.playtime_2weeks),
      iconUrl: /^[a-f0-9]{40}$/.test(game.img_icon_url || '')
        ? `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appId}/${game.img_icon_url}.jpg` : null,
    };
  }).sort((a, b) => (b.playtimeMinutes ?? -1) - (a.playtimeMinutes ?? -1)).slice(0, 6);
  return { status: 'available', gameCount: count, games };
}

async function steamApi(path, params, apiKey, fetchImpl) {
  const url = new URL(`https://api.steampowered.com/${path}`);
  url.search = new URLSearchParams(params);
  // Steam supports the key header; keep the secret out of URLs, redirects and browser responses.
  try {
    const response = await fetchImpl(url.href, { headers: { 'x-webapi-key': apiKey, Accept: 'application/json' },
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (response.status === 401 || response.status === 403) throw new SteamProbeError('unauthorized');
    if (response.status === 429) {
      const seconds = Number(response.headers.get('retry-after'));
      throw new SteamProbeError('rate_limited', Number.isSafeInteger(seconds) && seconds > 0 ? Math.max(60, seconds) : 60);
    }
    if (!response.ok) throw new SteamProbeError('request_failed');
    const reader = response.body?.getReader();
    if (!reader) throw new SteamProbeError('invalid_response');
    const chunks = []; let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 2 * 1024 * 1024) throw new SteamProbeError('invalid_response');
        chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    throw error instanceof SteamProbeError ? error : new SteamProbeError('request_failed');
  }
}

export async function readSteamSnapshot(steamId, config, fetchImpl = fetch, now = Date.now) {
  if (!/^7656119\d{10}$/.test(steamId)) throw new SteamProbeError('invalid_response');
  const snapshot = { provider: 'steam', verification: 'openid', visibility: 'private', persisted: false,
    verifiedAt: new Date(now()).toISOString(), steamId, displayName: 'Steam player', avatarUrl: null,
    profileUrl: `https://steamcommunity.com/profiles/${steamId}/`, createdAt: null, profileVisibility: 'unknown',
    library: { status: 'unavailable', gameCount: null, games: [] }, dataError: null, retryAfterSeconds: null };
  try {
    const data = await steamApi('ISteamUser/GetPlayerSummaries/v0002/', { steamids: steamId }, config.apiKey, fetchImpl);
    const players = data?.response?.players;
    if (!Array.isArray(players) || players.length !== 1) throw new SteamProbeError('invalid_response');
    Object.assign(snapshot, normalizeSteamProfile(players[0], steamId, now));
    const library = await steamApi('IPlayerService/GetOwnedGames/v0001/', {
      input_json: JSON.stringify({ steamid: steamId, include_appinfo: true, include_played_free_games: true }),
    }, config.apiKey, fetchImpl);
    snapshot.library = normalizeSteamLibrary(library);
  } catch (error) {
    snapshot.dataError = error instanceof SteamProbeError ? error.code : 'request_failed';
    snapshot.retryAfterSeconds = error.retryAfterSeconds || null;
  }
  return snapshot;
}
