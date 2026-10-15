import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { workerData } from 'node:worker_threads';
const requireOpenId = createRequire(import.meta.resolve('openid'));
const axios = requireOpenId('axios').default;
// Transport fixture only. Run the actual pinned OpenID engine and production worker.
axios.defaults.adapter = async (config) => {
  assert.equal(config.maxRedirects, 0);
  assert.equal(config.timeout, 10000);
  assert.equal(config.proxy, false);
  const endpoint = 'https://steamcommunity.com/openid/login';
  if (config.method === 'post') {
    assert.equal(config.url, endpoint);
    assert.equal(new URLSearchParams(config.data).get('openid.mode'), 'check_authentication');
    return { status: 200, headers: {}, data: 'ns:http://specs.openid.net/auth/2.0\nis_valid:' + (workerData.accept ? 'true' : 'false') + '\n' };
  }
  return { status: 200, headers: { 'content-type': 'text/html' },
    data: '<html><head><link rel="openid2.provider" href="' + endpoint + '" /></head></html>' };
};
await import('../../src/integrations/steam/openidWorker.js');
