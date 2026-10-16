import { randomBytes } from 'node:crypto';
import { persistentBungieSnapshot } from './snapshot.js';

export const MESSAGES = Object.freeze({
  configuration_missing: 'Bungie configuration is unavailable.',
  invalid_callback: 'This authorization expired or belongs to another browser. Start again.',
  authorization_failed: 'Bungie authorization was cancelled or rejected.',
  exchange_failed: 'Bungie could not exchange the code. Check the client credentials and callback.',
  profile_failed: 'The authenticated Bungie identity could not be verified.',
  rate_limited: 'Wait one minute before starting another authorization.',
  request_failed: 'The request failed or timed out. No credentials were logged.',
});
export class BungieError extends Error {
  constructor(code) {
    super(MESSAGES[code] || MESSAGES.request_failed);
    this.code = Object.hasOwn(MESSAGES, code) ? code : 'request_failed';
  }
}
const opaque = (value, max = 512) => typeof value === 'string'
  && value.length > 0 && value.length <= max && /^[\x21-\x7e]+$/.test(value);
const id = (value) => typeof value === 'string' && /^[1-9]\d{0,19}$/.test(value);
const label = (value) => typeof value === 'string' && value.trim().length > 0
  && value.length <= 128 && [...value].every((char) => char.codePointAt(0) >= 32
    && char.codePointAt(0) !== 127) ? value.trim() : null;

export function readBungieConfig(env = {}, callbackUrl) {
  const apiKey = env.BUNGIE_API_KEY?.trim();
  const clientId = env.BUNGIE_CLIENT_ID?.trim();
  const clientSecret = env.BUNGIE_CLIENT_SECRET?.trim();
  if (!opaque(apiKey) || !id(clientId) || !opaque(clientSecret)
    || !['https://www.tryhardnames.com/api/v1/integrations/bungie/callback', 'https://localhost:3015/api/v1/integrations/bungie/callback'].includes(callbackUrl)) throw new BungieError('configuration_missing');
  return { apiKey, clientId, clientSecret, callbackUrl };
}
export const createAuthorization = () => ({ state: randomBytes(32).toString('base64url') });

export function authorizeUrl(config, authorization) {
  const url = new URL('https://www.bungie.net/en/OAuth/Authorize');
  // Bungie configures scopes in its portal and rejects the OAuth scope parameter.
  url.search = new URLSearchParams({ response_type: 'code', client_id: config.clientId,
    redirect_uri: config.callbackUrl, state: authorization.state }).toString();
  return url.href;
}

async function request(url, options, code, fetchImpl) {
  let response;
  try {
    response = await fetchImpl(url, { ...options, redirect: 'error', cache: 'no-store',
      signal: AbortSignal.timeout(10_000) });
    if (!response.ok || !response.body) throw new Error();
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      let chunk = await reader.read();
      while (!chunk.done) {
        const { value } = chunk;
        size += value.byteLength;
        if (size > 256 * 1024) throw new Error();
        chunks.push(Buffer.from(value));
        chunk = await reader.read();
      }
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  } catch {
    throw new BungieError(code);
  } finally {
    if (response?.body && !response.body.locked) await response.body.cancel().catch(() => {});
  }
}

export function normalizeOwnProfile(data, expectedId, now = Date.now) {
  const user = data?.bungieNetUser;
  if (!id(expectedId) || !id(user?.membershipId) || user.membershipId !== expectedId
    || user.isDeleted === true) throw new BungieError('profile_failed');
  const displayName = label(user.cachedBungieGlobalDisplayName) || label(user.displayName);
  if (!displayName) throw new BungieError('profile_failed');
  const nameCode = user.cachedBungieGlobalDisplayNameCode;
  const bungieName = label(user.cachedBungieGlobalDisplayName) && Number.isInteger(nameCode)
    && nameCode >= 0 && nameCode <= 9999 ? `${displayName}#${String(nameCode).padStart(4, '0')}` : displayName;
  let avatarUrl = null;
  if (typeof user.profilePicturePath === 'string' && /^\/img\/[A-Za-z0-9_./-]+$/.test(user.profilePicturePath)
    && user.profilePicturePath.length <= 1024) {
    const url = new URL(user.profilePicturePath, 'https://www.bungie.net');
    if (url.pathname.startsWith('/img/')) avatarUrl = url.href;
  }
  const memberships = Array.isArray(data.destinyMemberships) ? data.destinyMemberships : [];
  const destinyMemberships = memberships.filter((item) => id(item?.membershipId)
    && Number.isInteger(item.membershipType) && item.membershipType > 0 && item.membershipType < 256)
    .slice(0, 12).map((item) => ({ accountId: item.membershipId, platform: item.membershipType,
      displayName: label(item.displayName), crossSaveOverride: Number.isInteger(item.crossSaveOverride)
        ? item.crossSaveOverride : 0 }));
  return { provider: 'bungie', accountId: user.membershipId, displayName, bungieName, avatarUrl,
    profileUrl: `https://www.bungie.net/en/Profile/254/${user.membershipId}`,
    destinyMemberships, verifiedAt: new Date(now()).toISOString(), verification: 'oauth',
    visibility: 'private', persisted: false, tokensStored: false, authorizationRevoked: false };
}

export async function readAuthorizedProfile(code, config, fetchImpl = fetch, now = Date.now) {
  if (!opaque(code, 4096)) throw new BungieError('invalid_callback');
  const exchanged = await request('https://www.bungie.net/platform/app/oauth/token/', {
    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, client_id: config.clientId,
      client_secret: config.clientSecret, redirect_uri: config.callbackUrl }),
  }, 'exchange_failed', fetchImpl);
  try {
    if (!opaque(exchanged?.access_token, 16384) || typeof exchanged.token_type !== 'string'
      || exchanged.token_type.toLowerCase() !== 'bearer'
      || !id(exchanged.membership_id) || !Number.isFinite(exchanged.expires_in) || exchanged.expires_in <= 0) {
      throw new BungieError('exchange_failed');
    }
    const response = await request('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
      method: 'GET', headers: { Accept: 'application/json', 'X-API-Key': config.apiKey,
        Authorization: `Bearer ${exchanged.access_token}` },
    }, 'profile_failed', fetchImpl);
    if (response?.ErrorCode !== 1) throw new BungieError('profile_failed');
    return persistentBungieSnapshot(normalizeOwnProfile(response.Response, exchanged.membership_id, now));
  } finally {
    // Discard grants after this read-only proof. This is not remote revocation.
    if (exchanged && typeof exchanged === 'object') {
      delete exchanged.access_token;
      delete exchanged.refresh_token;
    }
  }
}
