import { createRequire } from 'node:module';
import { parentPort, workerData } from 'node:worker_threads';
import openid from 'openid';
import { steamReturnTo, validateSteamAssertion } from './client.js';

const requireOpenId = createRequire(import.meta.resolve('openid'));
const axios = requireOpenId('axios').default;
axios.interceptors.request.use((config) => {
  const url = new URL(config.url);
  if (url.origin !== 'https://steamcommunity.com' || url.username || url.password
    || !/^\/openid\/(?:login|id\/7656119\d{10})$/.test(url.pathname)) throw new Error('invalid_endpoint');
  return { ...config, timeout: 10000, maxRedirects: 0, maxContentLength: 128 * 1024,
    maxBodyLength: 16 * 1024, proxy: false };
});

try {
  const url = new URL(workerData.url);
  const steamId = validateSteamAssertion(url, workerData.state, workerData.callbackUrl);
  const rp = new openid.RelyingParty(steamReturnTo(workerData.state, workerData.callbackUrl),
    new URL(workerData.callbackUrl).origin + '/', true, true, []);
  rp.verifyAssertion(url.href, (error, result) => {
    parentPort.postMessage({ steamId: !error && result?.authenticated
      && result.claimedIdentifier === url.searchParams.get('openid.claimed_id') ? steamId : null });
  });
} catch {
  parentPort.postMessage({ steamId: null });
}
