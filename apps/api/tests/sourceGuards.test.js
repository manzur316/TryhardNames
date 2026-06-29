import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const repoPath = (path) => new URL(`../../../${path}`, import.meta.url);
const readRepo = (path) => readFileSync(repoPath(path), 'utf8');

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx']) => {
  const start = fileURLToPath(repoPath(root));
  if (!existsSync(start)) return '';

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (['node_modules', 'dist', 'build', '.git', 'coverage'].includes(entry)) continue;

      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (extensions.some((extension) => fullPath.endsWith(extension))) {
        files.push(readFileSync(fullPath, 'utf8'));
      }
    }
  };

  walk(start);
  return files.join('\n');
};

const apiPackageJson = JSON.parse(readRepo('apps/api/package.json'));
const appSource = readRepo('apps/web/src/App.jsx');
const webSource = readTree('apps/web/src');
const apiOsuConfig = readRepo('apps/api/src/integrations/osu/config.js');
const apiRiotSource = readTree('apps/api/src/integrations/riot');
const publicRuntimeSource = `${webSource}\n${apiRiotSource}`;

describe('RM-40 Source Guards / Environment Safety Tests', () => {
  it('keeps server secrets and provider tokens out of browser source', () => {
    const forbiddenBrowserPatterns = [
      /SUPABASE_SERVICE_ROLE_KEY/i,
      /OSU_CLIENT_SECRET/i,
      /RIOT_CLIENT_SECRET/i,
      /GOOGLE_CLIENT_SECRET/i,
      /client_secret/i,
      /access_token/i,
      /refresh_token/i,
      /service_role/i,
    ];

    for (const pattern of forbiddenBrowserPatterns) {
      assert.doesNotMatch(webSource, pattern);
    }
  });

  it('keeps osu! runtime limited to the approved minimal scopes', () => {
    assert.match(apiOsuConfig, /const DEFAULT_SCOPES = Object\.freeze\(\['identify', 'public'\]\)/);
    assert.match(apiOsuConfig, /const ALLOWED_SCOPES = new Set\(DEFAULT_SCOPES\)/);
    assert.doesNotMatch(apiOsuConfig, /friends\.read|forum\.write|chat\.read|delegate|identify\.email/i);
  });

  it('keeps Riot runtime blocked as a stub until explicit approval', () => {
    assert.match(apiRiotSource, /createNotImplementedRouter\('riot'\)/);
    assert.doesNotMatch(apiRiotSource, /RIOT_(CLIENT|API|TOKEN|SECRET|KEY|PROVIDER)/i);
    assert.doesNotMatch(apiRiotSource, /fetch\(|axios|undici|oauth|access_token|refresh_token/i);
  });

  it('keeps forbidden public surfaces and endorsement claims out of runtime source', () => {
    assert.doesNotMatch(appSource, /path=["']\/(cosmetics|store|checkout|billing)["']/i);
    assert.doesNotMatch(publicRuntimeSource, /officially endorsed|official partner|endorsed by (riot|osu!?)|affiliated with (riot|osu!?)/i);
    assert.doesNotMatch(publicRuntimeSource, /matchHistory|liveTracker|\bmmr\b|\belo\b|op\.gg|performancePoints|rankedScore|bestPlays|beatmap/i);
  });

  it('wires RM-40 source guards into API tests', () => {
    assert.match(apiPackageJson.scripts.test, /sourceGuards\.test\.js/);
  });
});
