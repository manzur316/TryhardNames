import { Worker } from 'node:worker_threads';
import { SteamProbeError, validateSteamAssertion } from './client.js';
import { CALLBACK_URL } from './constants.js';

let activeWorkers = 0;
const spawn = (data) => new Worker(new URL('./openidWorker.js', import.meta.url), {
  workerData: data, env: {}, execArgv: [], stdout: true, stderr: true,
  resourceLimits: { maxOldGenerationSizeMb: 64, stackSizeMb: 4 },
});

// Each verification gets a separate module cache and bounded HTTP transport. The
// OpenID library must never install its axios interceptor in the shared API process.
export async function verifySteamIdentity(url, state, callbackUrl = CALLBACK_URL, { workerFactory = spawn, timeoutMs = 25000 } = {}) {
  if (url.href.length > 8192) throw new SteamProbeError('invalid_callback');
  const expected = validateSteamAssertion(url, state, callbackUrl);
  if (activeWorkers >= 4) throw new SteamProbeError('rate_limited');
  activeWorkers++;
  let worker;
  try {
    return await new Promise((resolve, reject) => {
      let finished = false;
      let timer;
      const finish = (id) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (id === expected) resolve(id);
        else reject(new SteamProbeError('invalid_callback'));
      };
      worker = workerFactory({ url: url.href, state, callbackUrl });
      worker.stdout?.resume();
      worker.stderr?.resume();
      timer = setTimeout(() => finish(null), timeoutMs);
      worker.once('message', (result) => finish(result?.steamId));
      worker.once('error', () => finish(null));
      worker.once('exit', () => finish(null));
    });
  } catch {
    throw new SteamProbeError('invalid_callback');
  } finally {
    if (worker) await worker.terminate().catch(() => {});
    activeWorkers--;
  }
}
