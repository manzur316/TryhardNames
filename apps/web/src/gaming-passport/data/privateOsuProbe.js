const ORIGIN = 'http://localhost:3002';
const ROOT = `${ORIGIN}/private/osu`;
export const PRIVATE_OSU_CONNECT_URL = `${ROOT}/authorize`;

export function isPrivateOsuProbeEnabled(dev, location) {
  return dev === true && location?.origin === 'http://localhost:3000'
    && new URLSearchParams(location.search).get('osuProbe') === '1';
}

export async function requestPrivateOsuProbe(action = 'status', fetchImpl = fetch) {
  const methods = { status: 'GET', connect: 'POST', connection: 'DELETE' };
  if (!Object.hasOwn(methods, action)) throw new Error('Invalid private test action.');
  const response = await fetchImpl(`${ROOT}/${action}`, {
    method: methods[action], credentials: 'include', cache: 'no-store',
    headers: { 'X-Osu-Probe': '1' }, signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error('The local osu! test is unavailable. Wait a minute and try again.');
  return response.json();
}

