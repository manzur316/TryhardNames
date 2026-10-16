import { normalizePersistenceProfile } from './client.js';

async function json(url, options, fetchImpl) {
  const response = await fetchImpl(url, { ...options, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(response.status === 429 ? 'rate_limited' : 'request_failed');
  const reader = response.body.getReader();
  let length = 0; const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.length; if (length > 1048576) throw new Error('invalid_response');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { await reader.cancel().catch(() => {}); }
}
export function createDailyOsuReader(config, fetchImpl = fetch) {
  let token;
  return async (account) => {
    if (!/^[1-9]\d{0,15}$/.test(account.externalId) || !['osu', 'mania', 'taiko', 'fruits'].includes(account.mode)) throw new Error('invalid_account');
    if (!token) {
      const data = await json('https://osu.ppy.sh/oauth/token', { method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, grant_type: 'client_credentials', scope: 'public' }) }, fetchImpl);
      if (typeof data.access_token !== 'string' || !/^[\x21-\x7e]{1,8192}$/.test(data.access_token)) throw new Error('invalid_token');
      token = data.access_token;
    }
    const raw = await json(`https://osu.ppy.sh/api/v2/users/${account.externalId}/${account.mode}?key=id`,
      { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } }, fetchImpl);
    if (String(raw.id) !== account.externalId) throw new Error('identity_mismatch');
    const snapshot = normalizePersistenceProfile({ ...raw, playmode: account.mode });
    // Public data refresh does not establish or renew ownership verification.
    snapshot.verifiedAt = account.verifiedAt;
    return { snapshot };
  };
}
