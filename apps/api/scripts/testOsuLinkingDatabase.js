import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

// No published ports, no network and ephemeral storage. Never accepts a database URL.
const container = 'thn-osu-test-' + randomUUID();
const publication = process.argv.includes('--publication');
const run = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
try {
  run('run', '--detach', '--rm', '--network', 'none', '--name', container,
    '--tmpfs', '/var/lib/postgresql/data', '--env', 'POSTGRES_HOST_AUTH_METHOD=trust', 'postgres:15-alpine');
  for (let attempt = 0; ; attempt++) {
    try { run('exec', container, 'pg_isready', '-U', 'postgres'); break; }
    catch { if (attempt >= 30) throw new Error('database_not_ready'); await new Promise((r) => setTimeout(r, 500)); }
  }
  const root = new URL('../../../supabase/', import.meta.url);
  const bootstrap = `
    create role anon; create role authenticated; create schema auth; create schema extensions;
    grant usage on schema public, auth, extensions to public;
    create table auth.users(id uuid primary key);
    create table auth.sessions(id uuid primary key, user_id uuid references auth.users, not_after timestamptz);
    create function auth.uid() returns uuid language sql as
      'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
    create function auth.jwt() returns jsonb language sql as
      'select nullif(current_setting(''request.jwt.claims'', true), '''')::jsonb';
  `;
  const migrations = ['20260623190000_gaming_passport_core.sql', '20261014204209_osu_private_persistence.sql',
    '20261014213058_passport_internal_helper_paths.sql', '20261015024632_roblox_private_linking_runtime.sql', '20261015061942_osu_production_linking.sql',
    ...(publication ? ['20261015173323_passport_publication_launch.sql', '20261015192140_steam_private_linking.sql',
      '20261015195918_steam_link_attempts_owner_index.sql', '20261015203753_steam_linking_passport_states.sql',
      '20261016022904_passport_daily_refresh.sql', '20261016041410_bungie_private_linking.sql',
      '20261016063932_bungie_public_identity.sql', '20261016071741_steam_public_activity.sql'] : [])]
    .map((name) => readFileSync(new URL('migrations/' + name, root), 'utf8')).join('\n');
  const tests = readFileSync(new URL('tests/database/' + (publication ? 'passport_publication_test.sql' : 'osu_production_linking_test.sql'), root), 'utf8')
    + (publication ? '\n' + ['bungie_public_identity_test.sql', 'steam_public_activity_test.sql']
      .map((name) => readFileSync(new URL('tests/database/' + name, root), 'utf8')).join('\n') : '');
  const result = execFileSync('docker', ['exec', '-i', container, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-At'],
    { input: bootstrap + migrations + tests, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  const count = (result.match(/^ok:/gm) || []).length;
  if (count < (publication ? 90 : 20)) throw new Error('missing_assertions');
  console.log((publication ? 'Publication' : 'Osu') + ' database: ' + count + ' assertions passed in isolated PostgreSQL; no remote database accessed.');
} catch (error) {
  if (error.stdout) console.error(error.stdout.toString().split('\n').slice(-12).join('\n'));
  console.error(error.stderr?.toString() || error.message);
  process.exitCode = 1;
} finally {
  try { run('stop', container); } catch { /* Already removed on failed startup. */ }
}
