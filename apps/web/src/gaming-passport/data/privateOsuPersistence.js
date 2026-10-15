const ROOT = 'http://localhost:3002/private/osu';
export const OSU_PRIVATE_AUTHORIZE_URL = `${ROOT}/authorize`;
export function isPrivateOsuPersistenceEnabled(isDevelopment, location) {
  return isDevelopment === true && location?.origin === 'http://localhost:3000'
    && new URLSearchParams(location.search).get('osuProbe') !== '1';
}
const MESSAGES = {
  sign_in_required: 'Sign in to TryhardNames again before linking osu!.',
  passport_required: 'Create your private Passport before linking osu!.',
  private_passport_required: 'This test requires an unpublished private Passport.',
  account_already_linked: 'This osu! account is already linked to another Passport.',
  authorization_required: 'Start a new osu! authorization from this account.',
  rate_limited: 'Wait one minute before starting another authorization.',
  storage_unavailable: 'Could not save the connection. Try again without closing this page.',
  unlink_failed: 'Could not unlink the account. Your stored connection has not been confirmed as removed.',
};
export async function requestOsuPersistence(action, session, accountId, fetchImpl = fetch) {
  const methods = { status: 'GET', connect: 'POST', complete: 'POST', connection: 'DELETE' };
  if (!Object.hasOwn(methods, action)) throw new Error('Invalid connection action.');
  if (!session?.access_token) throw new Error(MESSAGES.sign_in_required);
  const url = new URL(`${ROOT}/${action}`);
  if (action === 'connection') {
    if (!/^[0-9a-f-]{36}$/i.test(accountId || '')) throw new Error('Select an account to unlink.');
    url.searchParams.set('accountId', accountId);
  }
  let response;
  try {
    response = await fetchImpl(url.toString(), {
      method: methods[action], credentials: 'include', cache: 'no-store',
      headers: { 'X-Osu-Probe': '1', Authorization: `Bearer ${session.access_token}` },
      signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new Error('Private connection service unavailable.'); }
  let body;
  try { body = await response.json(); } catch { throw new Error('Private connection service unavailable.'); }
  if (!response.ok) throw new Error(MESSAGES[body?.error] || 'Private connection service unavailable.');
  if (action === 'status' && body.persisted !== true) throw new Error('The temporary probe is running. Start the private persistence service.');
  return body;
}
