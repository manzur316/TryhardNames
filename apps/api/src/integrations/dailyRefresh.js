import { timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { rootCertificates } from 'node:tls';
import pg from 'pg';
import { readRuntimeConfig as steamConfig } from './steam/runtime.js';
import { readRuntimeConfig as osuConfig } from './osu-linking/runtime.js';
import { readDailySteamSnapshot } from './steam/achievements.js';
import { createDailyOsuReader } from './osu-linking/daily.js';

export function cronAuthorized(header, secret) {
  if (typeof secret !== 'string' || secret.length < 32 || typeof header !== 'string') return false;
  const expected = Buffer.from('Bearer ' + secret); const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
export async function refreshBatch({ provider, store, read, now = Date.now, budgetMs = 260000 }) {
  const started = now(); const result = { provider, claimed: 0, updated: 0, unavailable: 0, budgetExhausted: false };
  // A Steam account takes at most 14 bounded API calls. Leave enough time to finish its claim.
  const reserve = provider === 'steam' ? 150000 : 25000;
  while (result.claimed < 100 && now() - started < budgetMs - reserve) {
    const account = await store.claim();
    if (!account) return result;
    result.claimed++;
    try {
      const data = await read(account);
      if (await store.finish(account, data)) result.updated++;
      else result.unavailable++;
    } catch (error) {
      await store.finish(account, null);
      result.unavailable++;
      if (error.code === 'rate_limited' || error.message === 'rate_limited') return { ...result, rateLimited: true };
    }
    // osu! asks clients to avoid bursts. This is rate pacing, not a persistent scheduler.
    if (provider === 'osu') await new Promise((resolve) => setTimeout(resolve, 1100));
  }
  return { ...result, budgetExhausted: true };
}
export async function runDailyRefresh(provider, env = process.env) {
  const config = provider === 'steam' ? steamConfig(env) : provider === 'osu' ? osuConfig(env) : null;
  if (!config) throw new Error('provider_disabled');
  const pool = new pg.Pool({ connectionString: config.connectionString, max: 1,
    ssl: { rejectUnauthorized: true, ca: [...rootCertificates,
      readFileSync(new URL('./roblox/supabase-root-2021.crt', import.meta.url), 'utf8')] },
    connectionTimeoutMillis: 10000, statement_timeout: 10000, application_name: 'passport-daily-' + provider });
  pool.on('error', () => {});
  const store = {
    async claim() {
      try { return (await pool.query('select private.claim_passport_refresh($1) as account', [provider])).rows[0].account; }
      catch (error) { error.refreshStage = 'claim'; throw error; }
    },
    async finish(account, data) {
      return (await pool.query('select private.finish_passport_refresh($1,$2::uuid,$3::uuid,$4::jsonb) as updated',
        [provider, account.id, account.claimId, data === null ? null : JSON.stringify(data)])).rows[0].updated;
    },
  };
  const schemas = new Map();
  const read = provider === 'steam' ? (account) => readDailySteamSnapshot(account, config, fetch, schemas) : createDailyOsuReader(config);
  try { return await refreshBatch({ provider, store, read }); }
  finally { await pool.end(); }
}
export function dailyRefreshHandler({ env = process.env, run = runDailyRefresh } = {}) {
  return async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (!cronAuthorized(req.headers.authorization, env.CRON_SECRET)) return res.status(401).json({ error: 'unauthorized' });
    if (env.PASSPORT_DAILY_REFRESH_ENABLED !== 'true') return res.status(503).json({ error: 'disabled' });
    if (!['steam', 'osu'].includes(req.params.provider)) return res.status(404).json({ error: 'unknown_provider' });
    try {
      const result = await run(req.params.provider, env);
      return res.status(result.budgetExhausted || result.rateLimited || result.unavailable ? 503 : 200).json(result);
    } catch (error) {
      const stage = error.refreshStage === 'claim' ? 'claim' : 'initialization';
      const code = /^[0-9A-Z_]{3,64}$/.test(error.code || '') ? error.code
        : ['configuration_missing', 'provider_disabled', 'ETIMEDOUT', 'ECONNREFUSED'].includes(error.code || error.message)
          ? (error.code || error.message) : 'request_failed';
      const kind = ['Error', 'TypeError', 'AggregateError'].includes(error.name) ? error.name : 'Error';
      console.error('passport_daily_refresh_failed', { provider: req.params.provider, stage, code, kind });
      return res.status(503).json({ error: 'refresh_unavailable', stage, code, kind });
    }
  };
}
