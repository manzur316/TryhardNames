import { randomBytes } from 'node:crypto';
import { buildOsuAuthorizeUrl } from '../osu/oauthClient.js';

const API = 'https://osu.ppy.sh/api/v2';
const MAX_BYTES = 1024 * 1024;
const MODES = new Set(['osu', 'mania', 'taiko', 'fruits']);
export const MESSAGES = Object.freeze({
  configuration_missing: 'Complete the private osu! application configuration locally.',
  authorization_failed: 'osu! authorization was cancelled or rejected. Try connecting again.',
  invalid_callback: 'The authorization expired or did not match this browser. Connect again.',
  exchange_failed: 'osu! could not exchange the authorization. Check the local application settings.',
  profile_failed: 'The authorized osu! profile could not be read.',
  restricted_profile: 'This osu! account is restricted and cannot be used in this test.',
  revoke_failed: 'The test could not confirm access revocation. Revoke the application in osu! account settings.',
  request_failed: 'The private test failed or timed out. No credentials were logged.',
  rate_limited: 'Wait before starting another authorization.',
});

export class OsuProbeError extends Error {
  constructor(code) {
    super(MESSAGES[code] || MESSAGES.request_failed);
    this.code = Object.hasOwn(MESSAGES, code) ? code : 'request_failed';
  }
}

export function readProbeConfig(env = {}) {
  const clientId = env.OSU_CLIENT_ID?.trim();
  const clientSecret = env.OSU_CLIENT_SECRET?.trim();
  if (!/^\d{1,20}$/.test(clientId || '') || !/^[\x21-\x7e]{16,512}$/.test(clientSecret || '')) {
    throw new OsuProbeError('configuration_missing');
  }
  return { clientId, clientSecret };
}

export function createAuthorization() { return { state: randomBytes(32).toString('base64url') }; }

export function authorizeUrl(config, authorization) {
  return buildOsuAuthorizeUrl({ ...config, authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
    redirectUri: config.callbackUrl, scopes: ['identify', 'public'] }, authorization.state);
}

async function request(url, options, errorCode, fetchImpl, noContent = false) {
  let response;
  try {
    response = await fetchImpl(url, { ...options, redirect: 'manual', cache: 'no-store',
      signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new OsuProbeError(errorCode);
    if (noContent) return null;
    if (!response.body) throw new OsuProbeError(errorCode);
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) throw new OsuProbeError(errorCode);
        chunks.push(Buffer.from(value));
      }
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  } catch {
    throw new OsuProbeError(errorCode);
  } finally {
    if (response?.body && !response.body.locked) await response.body.cancel().catch(() => {});
  }
}

const numberOrNull = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
const rankOrNull = (value) => Number.isSafeInteger(value) && value > 0 ? value : null;

export function normalizeOwnProfile(data, now = Date.now) {
  if (!data || !Number.isSafeInteger(data.id) || data.id < 1 || typeof data.username !== 'string'
    || !data.username.trim() || data.username.length > 64 || !MODES.has(data.playmode)) {
    throw new OsuProbeError('profile_failed');
  }
  if (data.is_restricted === true) throw new OsuProbeError('restricted_profile');
  const statistics = data.statistics || {};
  const accuracy = numberOrNull(statistics.accuracy);
  const legacyAccuracy = numberOrNull(statistics.hit_accuracy);
  // Missing or unranked values stay null; they must not become fabricated ranks.
  return {
    provider: 'osu', username: data.username.trim(), mode: data.playmode,
    avatarUrl: `https://a.ppy.sh/${data.id}`,
    pp: numberOrNull(statistics.pp),
    globalRank: rankOrNull(statistics.global_rank),
    countryRank: rankOrNull(statistics.country_rank),
    accuracyPercent: accuracy !== null && accuracy <= 1 ? accuracy * 100
      : legacyAccuracy !== null && legacyAccuracy <= 100 ? legacyAccuracy : null,
    medals: Array.isArray(data.user_achievements)
      ? new Set(data.user_achievements.filter((item) => Number.isSafeInteger(item?.achievement_id)
        && item.achievement_id > 0 && Number.isFinite(Date.parse(item.achieved_at)))
        .map((item) => item.achievement_id)).size : null,
    verifiedAt: new Date(now()).toISOString(),
    verification: 'oauth', visibility: 'private', persisted: false,
  };
}

export async function readAuthorizedProfile(code, config, fetchImpl = fetch, now = Date.now, normalize = normalizePersistenceProfile) {
  let accessToken = '';
  try {
    const exchanged = await request('https://osu.ppy.sh/oauth/token', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret,
        code, grant_type: 'authorization_code', redirect_uri: config.callbackUrl }),
    }, 'exchange_failed', fetchImpl);
    if (typeof exchanged?.access_token !== 'string' || !/^[\x21-\x7e]{1,8192}$/.test(exchanged.access_token)) {
      throw new OsuProbeError('exchange_failed');
    }
    accessToken = exchanged.access_token;
    // Do not retain the response or its refresh token beyond this exchange.
    delete exchanged.refresh_token;
    delete exchanged.access_token;
    const profile = await request(`${API}/me`, {
      method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    }, 'profile_failed', fetchImpl);
    return normalize(profile, now);
  } finally {
    if (accessToken) {
      await request(`${API}/oauth/tokens/current`, {
        method: 'DELETE', headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
      }, 'revoke_failed', fetchImpl, true);
    }
  }
}
export function normalizePersistenceProfile(raw, now = Date.now) {
  const safe = normalizeOwnProfile(raw, now);
  return { externalAccountId: String(raw.id), username: safe.username, mode: safe.mode,
    pp: safe.pp, globalRank: safe.globalRank, countryRank: safe.countryRank,
    accuracyPercent: safe.accuracyPercent, medals: safe.medals, verifiedAt: safe.verifiedAt };
}

