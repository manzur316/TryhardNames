import { getSupabaseRuntime } from '../../lib/supabase/client.js';

export const OSU_LINK_BASE = '/api/v1/integrations/osu';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function requestOsuLink(action, ownerId, accountId) {
  const routes = { connect: ['POST', '/connect'], complete: ['POST', '/complete'], cancel: ['POST', '/cancel'],
    unlink: ['DELETE', '/accounts/' + accountId] };
  if (!routes[action] || (action === 'unlink' && !UUID.test(accountId || ''))) throw new Error('invalid_request');
  const { client } = await getSupabaseRuntime();
  if (!client) throw new Error('sign_in_required');
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token || data.session.user.id !== ownerId) throw new Error('sign_in_required');
  const [method, path] = routes[action];
  const response = await fetch(OSU_LINK_BASE + path, { method, credentials: 'same-origin', cache: 'no-store',
    headers: { Authorization: 'Bearer ' + data.session.access_token, 'X-Passport-Link': 'osu' },
    signal: AbortSignal.timeout(20_000) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'request_failed');
  return result;
}

export function osuAuthorizationUrl(value) {
  const url = new URL(value);
  if (url.origin !== 'https://osu.ppy.sh' || url.pathname !== '/oauth/authorize' || url.username || url.password) {
    throw new Error('invalid_redirect');
  }
  return url.href;
}

