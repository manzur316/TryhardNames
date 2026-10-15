import { getSupabaseRuntime } from '../../lib/supabase/client.js';

export const ROBLOX_LINK_BASE = '/api/v1/integrations/roblox';
const UUID = /^[0-9a-f-]{36}$/i;
export async function requestRobloxLink(action, ownerId, accountId) {
  const routes = { status: ['GET', '/status'], connect: ['POST', '/connect'], complete: ['POST', '/complete'],
    unlink: ['DELETE', '/accounts/' + accountId] };
  if (!routes[action] || (action === 'unlink' && !UUID.test(accountId || ''))) throw new Error('invalid_request');
  const { client } = await getSupabaseRuntime();
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token || data.session.user.id !== ownerId) throw new Error('sign_in_required');
  const [method, path] = routes[action];
  const response = await fetch(ROBLOX_LINK_BASE + path, { method, credentials: 'same-origin', cache: 'no-store',
    headers: { Authorization: 'Bearer ' + data.session.access_token, 'X-Passport-Link': 'roblox' },
    signal: AbortSignal.timeout(20_000) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'request_failed');
  return result;
}

export function robloxHighlight(account) {
  return { game: 'Roblox', username: account.username, mode: '', pp: null, globalRank: null, stale: false };
}
export function robloxAuthorizationUrl(value) {
  const url = new URL(value);
  if (url.origin !== 'https://apis.roblox.com' || url.pathname !== '/oauth/v1/authorize' || url.username || url.password) {
    throw new Error('invalid_redirect');
  }
  return url.href;
}
