import { spawnSync } from 'node:child_process';

const status = readSupabaseStatusEnv();

if (!status) {
  process.stderr.write('Unable to read local Supabase status. Is Supabase running?\n');
  process.exit(1);
}

const envValues = parseEnv(status);
const apiUrl = envValues.API_URL;
const anonKey = envValues.ANON_KEY;

if (!apiUrl || !anonKey) {
  process.stderr.write('Local Supabase status did not include API_URL and ANON_KEY.\n');
  process.exit(1);
}

const testEnv = {
  ...process.env,
  VITE_SUPABASE_URL: apiUrl,
  VITE_SUPABASE_PUBLISHABLE_KEY: anonKey,
  VITE_AUTH_GOOGLE_ENABLED: 'false',
};
const result = runNpmLocalAuthTest(testEnv);

process.exit(result.status ?? 1);

function parseEnv(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      const index = line.indexOf('=');
      if (index === -1) return acc;
      const key = line.slice(0, index);
      const value = line.slice(index + 1).replace(/^['"]|['"]$/g, '');
      acc[key] = value;
      return acc;
    }, {});
}

function readSupabaseStatusEnv() {
  const direct = runStatusCommand('supabase status -o env');

  if (direct.status === 0) {
    return direct.stdout;
  }

  const fallback = runStatusCommand('npx supabase@2.84.2 status -o env');

  return fallback.status === 0 ? fallback.stdout : null;
}

function runStatusCommand(command) {
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', command], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  const [bin, ...args] = command.split(' ');
  return spawnSync(bin, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function runNpmLocalAuthTest(env) {
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm run test:auth:local --prefix apps/web'], {
      stdio: 'inherit',
      env,
    });
  }

  return spawnSync('npm', ['run', 'test:auth:local', '--prefix', 'apps/web'], {
    stdio: 'inherit',
    env,
  });
}
