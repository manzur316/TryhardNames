const ROOT = 'http://localhost:3004/private/roblox';
export const PRIVATE_ROBLOX_CONNECT_URL = `${ROOT}/authorize`;

export function buildPrivateRobloxHighlight(state) {
  const profile = state?.profile;
  if (state?.status !== 'verified' || profile?.verification !== 'oauth'
    || profile.visibility !== 'private' || profile.persisted !== false || profile.authorizationRevoked !== true
    || typeof profile.username !== 'string' || !profile.username.trim()) return null;
  return { game: 'Roblox', username: profile.username.slice(0, 64), mode: '', pp: null, globalRank: null, stale: false };
}

export function isPrivateRobloxProbeEnabled(dev, location) {
  return dev === true && location?.origin === 'http://localhost:3000'
    && new URLSearchParams(location.search).get('robloxProbe') === '1';
}

export async function requestPrivateRobloxProbe(action = 'status', fetchImpl = fetch) {
  const methods = { status: 'GET', connect: 'POST', connection: 'DELETE' };
  if (!Object.hasOwn(methods, action)) throw new Error('Invalid private test action.');
  const response = await fetchImpl(`${ROOT}/${action}`, {
    method: methods[action], credentials: 'include', cache: 'no-store',
    headers: { 'X-Roblox-Probe': '1' }, signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error('The local Roblox test is unavailable. Wait one minute and try again.');
  return response.json();
}
