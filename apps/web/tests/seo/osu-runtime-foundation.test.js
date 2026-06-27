import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx', '.sql', '.md', '.example']) => {
  const start = fileURLToPath(repoPath(root));
  if (!existsSync(start)) return '';

  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (['node_modules', 'dist', 'build', '.git'].includes(entry)) continue;
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

const docs = [
  'docs/product/OSU_RUNTIME_FOUNDATION.md',
  'docs/product/OSU_RUNTIME_SECURITY_REVIEW.md',
  'docs/product/OSU_TOKEN_REVOKE_UNLINK_PLAN.md',
  'docs/product/OSU_RUNTIME_PUBLIC_PROJECTION_REVIEW.md',
  'docs/product/RM27_OSU_RUNTIME_SCOPE.md',
  'README.md',
  'docs/product/ROADMAP_INDEX.md',
  'docs/product/ROADMAP_MILESTONE_REGISTRY.md',
  'docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md',
  'docs/product/ROADMAP_STATUS_MATRIX.md',
  'docs/product/CURRENT_STATE_AND_ROADMAP.md',
  'docs/product/DECISION_LOG.md',
  'docs/product/OSU_READINESS_PACK.md',
  'docs/product/PROVIDER_EXPANSION_ROADMAP.md',
].map(readRepo).join('\n');

const apiSource = readTree('apps/api/src/integrations/osu');
const apiEnvExample = readRepo('apps/api/.env.example');
const webSource = readTree('apps/web/src', ['.js', '.jsx', '.ts', '.tsx']);
const supabaseSource = readTree('supabase/migrations', ['.sql']);
const rm27Migration = readRepo('supabase/migrations/20260627090000_osu_runtime_foundation.sql');
const appSource = readWeb('src/App.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const apiPackageJson = JSON.parse(readRepo('apps/api/package.json'));
const migrationFiles = readdirSync(fileURLToPath(repoPath('supabase/migrations')));

describe('RM-27 osu! Runtime Foundation', () => {
  it('adds the RM-27 runtime documentation pack', () => {
    [
      'docs/product/OSU_RUNTIME_FOUNDATION.md',
      'docs/product/OSU_RUNTIME_SECURITY_REVIEW.md',
      'docs/product/OSU_TOKEN_REVOKE_UNLINK_PLAN.md',
      'docs/product/OSU_RUNTIME_PUBLIC_PROJECTION_REVIEW.md',
      'docs/product/RM27_OSU_RUNTIME_SCOPE.md',
    ].forEach((path) => {
      assert.equal(existsSync(repoPath(path)), true);
    });

    assert.match(docs, /RM-27 osu! Runtime Foundation/);
    assert.match(docs, /RM-27 Server Boundary Audit/);
    assert.match(docs, /conditional foundation/i);
    assert.match(docs, /RM-28 osu! Runtime Smoke \/ Owner Linking QA/);
  });

  it('documents server-side runtime gates and no-refresh-token strategy', () => {
    [
      /OSU_PROVIDER_ENABLED=false/,
      /OSU_CLIENT_ID/,
      /OSU_CLIENT_SECRET/,
      /OSU_REDIRECT_URI/,
      /OSU_STATE_SECRET/,
      /SUPABASE_SERVICE_ROLE_KEY/,
      /server-side token exchange/i,
      /no_refresh_token_storage/,
      /immediate token revoke/i,
      /public projection remains allowlisted/i,
      /Revoked proof never public/i,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });
  });

  it('implements osu! in server-side API only and keeps browser source free of secrets/tokens', () => {
    assert.match(apiSource, /getOsuRuntimeConfig/);
    assert.match(apiSource, /OSU_PROVIDER_ENABLED/);
    assert.match(apiSource, /exchangeOsuCode/);
    assert.match(apiSource, /fetchOsuOwnProfile/);
    assert.match(apiSource, /revokeOsuCurrentToken/);
    assert.match(apiSource, /hashOsuState/);
    assert.match(apiSource, /validateOsuStateRecord/);
    assert.match(apiSource, /no_refresh_token_storage/);

    assert.doesNotMatch(webSource, /OSU_CLIENT_SECRET|osuAccessToken|osuRefreshToken|providerAccessToken|providerRefreshToken/i);
    assert.doesNotMatch(webSource, /import\.meta\.env\.SUPABASE_SERVICE_ROLE_KEY|process\.env\.SUPABASE_SERVICE_ROLE_KEY/i);
    assert.doesNotMatch(webSource, /access_token|refresh_token|token_ciphertext/i);
    assert.doesNotMatch(webSource, /osu\.ppy\.sh\/oauth|osu\.ppy\.sh\/api/i);
    assert.doesNotMatch(webSource, /\/api\/v1\/integrations\/osu\/callback|\/auth\/osu\/callback/i);
  });

  it('adds a minimal migration without opening token ciphertext storage', () => {
    assert.equal(
      migrationFiles.some((file) => /20260627090000_osu_runtime_foundation\.sql/.test(file)),
      true
    );
    assert.match(supabaseSource, /provider in \('discord', 'osu', 'riot'\)/);
    assert.match(supabaseSource, /requested_scopes <@ array\['identify', 'public'\]::text\[\]/);
    assert.match(supabaseSource, /provider_token_vault_no_ciphertext_in_pr16/);
    assert.doesNotMatch(supabaseSource, /drop constraint provider_token_vault_no_ciphertext_in_pr16/i);
    assert.doesNotMatch(rm27Migration, /grant\s+.*provider_token_vault.*to\s+(authenticated|anon)/i);
  });

  it('keeps public proof and monetization boundaries closed', () => {
    assert.match(docs, /profile_linked/);
    assert.match(docs, /visibility: `private`|visibility = 'private'|visibility is `private`/);
    assert.match(docs, /no rank/i);
    assert.match(docs, /no provider data behind paywall/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(`${webSource}\n${apiEnvExample}`, /VITE_.*OSU/i);
    assert.doesNotMatch(JSON.stringify(packageJson.dependencies ?? {}), /Stripe|MercadoPago/i);
  });

  it('is wired into API and web tests', () => {
    assert.match(apiPackageJson.scripts.test, /osuRuntime\.test\.js/);
    assert.match(packageJson.scripts['test:seo'], /osu-runtime-foundation\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-runtime-foundation\.test\.js/);
  });
});
