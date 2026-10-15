import { createHash, randomBytes } from 'node:crypto';

const OAUTH = 'https://apis.roblox.com/oauth/v1';
const MAX_BYTES = 256 * 1024;
export const MESSAGES = Object.freeze({
  configuration_missing: 'Complete the private Roblox application configuration locally.',
  authorization_failed: 'Roblox authorization was cancelled or rejected. Try again.',
  invalid_callback: 'This authorization expired or does not match this browser. Start again.',
  exchange_failed: 'Roblox could not exchange the authorization. Check the app settings and callback URL.',
  profile_failed: 'The authorized Roblox profile could not be read.',
  revoke_failed: 'Access revocation could not be confirmed. Remove this app in Roblox account settings.',
  request_failed: 'The private Roblox test failed or timed out. No credentials were logged.',
  rate_limited: 'Wait one minute before starting another authorization.',
});

export class RobloxProbeError extends Error {
  constructor(code) {
    super(MESSAGES[code] || MESSAGES.request_failed);
    this.code = Object.hasOwn(MESSAGES, code) ? code : 'request_failed';
  }
}

export function readProbeConfig(env = {}) {
  const clientId = env.ROBLOX_CLIENT_ID?.trim();
  const clientSecret = env.ROBLOX_CLIENT_SECRET?.trim();
  if (!/^\d{1,40}$/.test(clientId || '') || !/^[\x21-\x7e]{16,512}$/.test(clientSecret || '')) {
    throw new RobloxProbeError('configuration_missing');
  }
  return { clientId, clientSecret };
}

export function createAuthorization() {
  const verifier = randomBytes(32).toString('base64url');
  return { state: randomBytes(32).toString('base64url'), verifier,
    challenge: createHash('sha256').update(verifier).digest('base64url') };
}

export function authorizeUrl(config, authorization) {
  const url = new URL(`${OAUTH}/authorize`);
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callbackUrl,
    response_type: 'code', scope: 'openid profile', state: authorization.state,
    code_challenge: authorization.challenge, code_challenge_method: 'S256' }).toString();
  return url.toString();
}

async function request(url, options, errorCode, fetchImpl, noContent = false) {
  let response;
  try {
    response = await fetchImpl(url, { ...options, redirect: 'manual', cache: 'no-store',
      signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new RobloxProbeError(errorCode);
    if (noContent) return null;
    if (!response.body) throw new RobloxProbeError(errorCode);
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) throw new RobloxProbeError(errorCode);
        chunks.push(Buffer.from(value));
      }
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  } catch {
    throw new RobloxProbeError(errorCode);
  } finally {
    if (response?.body && !response.body.locked) await response.body.cancel().catch(() => {});
  }
}

export function normalizeOwnProfile(data, now = Date.now) {
  if (!data || typeof data.sub !== 'string' || !/^[1-9]\d{0,39}$/.test(data.sub)
    || typeof data.preferred_username !== 'string' || !data.preferred_username.trim()
    || data.preferred_username.length > 64) throw new RobloxProbeError('profile_failed');
  let avatarUrl = null;
  try {
    const url = new URL(data.picture);
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port
      && (url.hostname === 'rbxcdn.com' || url.hostname.endsWith('.rbxcdn.com'))
      && url.href.length <= 2048) avatarUrl = url.href;
  } catch { /* Missing or moderated avatars are permitted. */ }
  const createdAt = Number.isSafeInteger(data.created_at) && data.created_at > 0
    && data.created_at * 1000 <= now() ? new Date(data.created_at * 1000).toISOString() : null;
  return { provider: 'roblox', accountId: data.sub, username: data.preferred_username.trim(),
    displayName: typeof data.name === 'string' && data.name.trim() && data.name.length <= 64
      ? data.name.trim() : data.preferred_username.trim(),
    avatarUrl, profileUrl: `https://www.roblox.com/users/${data.sub}/profile`, createdAt,
    verifiedAt: new Date(now()).toISOString(), verification: 'oauth', visibility: 'private',
    persisted: false, authorizationRevoked: true };
}

const validToken = (value) => typeof value === 'string' && /^[\x21-\x7e]{1,16384}$/.test(value);

export async function readAuthorizedProfile(code, verifier, config, fetchImpl = fetch, now = Date.now) {
  let refreshToken = '';
  try {
    const exchanged = await request(`${OAUTH}/token`, {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret,
        code, code_verifier: verifier, grant_type: 'authorization_code', redirect_uri: config.callbackUrl }),
    }, 'exchange_failed', fetchImpl);
    if (validToken(exchanged?.refresh_token)) refreshToken = exchanged.refresh_token;
    if (!refreshToken) throw new RobloxProbeError('revoke_failed');
    if (!validToken(exchanged?.access_token) || typeof exchanged.token_type !== 'string'
      || exchanged.token_type.toLowerCase() !== 'bearer') throw new RobloxProbeError('exchange_failed');
    const accessToken = exchanged.access_token;
    // Only authenticated userinfo establishes identity; never trust decoded ID tokens or user-supplied IDs.
    delete exchanged.id_token;
    delete exchanged.access_token;
    delete exchanged.refresh_token;
    const profile = await request(`${OAUTH}/userinfo`, {
      method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    }, 'profile_failed', fetchImpl);
    return normalizeOwnProfile(profile, now);
  } finally {
    if (refreshToken) {
      await request(`${OAUTH}/token/revoke`, {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, token: refreshToken }),
      }, 'revoke_failed', fetchImpl, true);
    }
  }
}
