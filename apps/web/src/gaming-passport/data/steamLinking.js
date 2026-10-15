import { getSupabaseRuntime } from '../../lib/supabase/client.js';

export const STEAM_LINK_BASE = '/api/v1/integrations/steam';
export function isSteamLinkingEnabled(dev, location) {
  return location?.origin === 'https://www.tryhardnames.com'
    || (dev === true && location?.origin === 'http://localhost:3000'
      && new URLSearchParams(location.search).get('steamProbe') !== '1');
}

export function steamPlaytime(minutes) {
  return Number.isSafeInteger(minutes) && minutes >= 0
    ? `${(minutes / 60).toLocaleString('en', { maximumFractionDigits: 1 })} h` : 'Unavailable';
}
export async function requestSteamLink(action, ownerId, accountId) {
  const routes = { status: ['GET', '/status'], connect: ['POST', '/connect'], complete: ['POST', '/complete'],
    unlink: ['DELETE', '/accounts/' + accountId] };
  if (!routes[action] || (action === 'unlink' && !/^[0-9a-f-]{36}$/i.test(accountId || ''))) throw new Error('invalid_request');
  const { client } = await getSupabaseRuntime();
  if (!client) throw new Error('sign_in_required');
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token || data.session.user.id !== ownerId) throw new Error('sign_in_required');
  const [method, path] = routes[action];
  const response = await fetch(STEAM_LINK_BASE + path, { method, credentials: 'same-origin', cache: 'no-store',
    headers: { Authorization: 'Bearer ' + data.session.access_token, 'X-Passport-Link': 'steam' },
    signal: AbortSignal.timeout(20_000) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'request_failed');
  return result;
}
export function steamAuthorizationUrl(value) {
  const url = new URL(value);
  if (url.origin !== 'https://steamcommunity.com' || url.pathname !== '/openid/login' || url.username || url.password) {
    throw new Error('invalid_redirect');
  }
  return url.href;
}
export function steamHighlight(account) {
  if (account?.provider !== 'steam' || account.persisted !== true || account.verification !== 'openid'
    || account.visibility !== 'private' || !/^7656119\d{10}$/.test(account.steamId || '')
    || typeof account.displayName !== 'string' || !account.displayName.trim()
    || !Number.isFinite(Date.parse(account.verifiedAt))) return null;
  return { game: 'Steam', username: account.displayName, mode: '', pp: null, globalRank: null,
    stale: Date.now() - Date.parse(account.verifiedAt) > 86400000, target: '#gp-steam-linked' };
}
