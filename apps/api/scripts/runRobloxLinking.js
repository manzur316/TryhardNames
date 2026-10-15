import { readFile } from 'node:fs/promises';
import { parse } from 'dotenv';
import express from 'express';
import helmet from 'helmet';

try {
  if (process.argv.slice(2).join(' ') !== '--local-review' || process.env.NODE_ENV === 'production'
    || process.env.VERCEL || process.env.CI) throw new Error('local_only');
  let env = {};
  try { env = parse(await readFile(new URL('../.env.roblox-linking.local', import.meta.url), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const [key, value] of Object.entries(env)) if (key.startsWith('ROBLOX_')) process.env[key] = value;
  process.env.ROBLOX_LOCAL_TEST = 'true';
  process.env.ROBLOX_APP_ORIGIN = 'http://localhost:3000';
  const { default: router, BASE, readRuntimeConfig } = await import('../src/integrations/roblox/runtime.js');
  const enabled = Boolean(readRuntimeConfig());
  const app = express();
  app.use(helmet());
  app.use(BASE, router);
  const server = app.listen(3005, '127.0.0.1', () => {
    console.log('Roblox local review backend: port 3005. Linking ' + (enabled ? 'enabled for configured testers.' : 'disabled until configured.'));
  });
  server.on('error', () => { console.error('Roblox review port unavailable.'); process.exitCode = 1; });
} catch {
  console.error('Roblox review backend could not start. Check the isolated configuration; no credentials were logged.');
  process.exitCode = 1;
}
