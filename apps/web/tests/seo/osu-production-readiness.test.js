import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx', '.md']) => {
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

const readinessDocs = [
  'docs/product/OSU_PRODUCTION_READINESS_GO_NO_GO.md',
  'docs/product/OSU_STAGING_SMOKE_RUNBOOK.md',
  'docs/product/OSU_ENVIRONMENT_CHECKLIST.md',
  'docs/product/RM35_OSU_PRODUCTION_READINESS_SCOPE.md',
  'docs/product/OSU_PUBLIC_PROFILE_TRUST_SAFETY_QA.md',
  'docs/product/OSU_PUBLIC_PROFILE_ROLLBACK_PLAN.md',
].map(readRepo).join('\n');
const roadmapDocs = [
  'README.md',
  'docs/product/ROADMAP_INDEX.md',
  'docs/product/ROADMAP_MILESTONE_REGISTRY.md',
  'docs/product/ROADMAP_STATUS_MATRIX.md',
  'docs/product/CURRENT_STATE_AND_ROADMAP.md',
  'docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md',
  'docs/product/DECISION_LOG.md',
].map(readRepo).join('\n');
const webSource = readTree('apps/web/src', ['.js', '.jsx', '.ts', '.tsx']);
const appSource = readWeb('src/App.jsx');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-35 osu! Production Readiness / Staging Go-No-Go', () => {
  it('adds the RM-35 readiness docs and declares staging/prod decisions', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_PRODUCTION_READINESS_GO_NO_GO.md')), true);
    assert.equal(existsSync(repoPath('docs/product/OSU_STAGING_SMOKE_RUNBOOK.md')), true);
    assert.equal(existsSync(repoPath('docs/product/OSU_ENVIRONMENT_CHECKLIST.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM35_OSU_PRODUCTION_READINESS_SCOPE.md')), true);
    assert.match(readinessDocs, /RM-35 osu! Production Readiness \/ Staging Go-No-Go/);
    assert.match(readinessDocs, /Staging decision: conditional-go/);
    assert.match(readinessDocs, /Production decision: no-go/);
    assert.match(readinessDocs, /No production launch/i);
    assert.match(readinessDocs, /No secret changes/i);
    assert.match(readinessDocs, /No remote Supabase changes/i);
    assert.match(readinessDocs, /No Vercel changes/i);
    assert.match(readinessDocs, /RM-36 osu! Staging Configuration \/ Manual Smoke/);
  });

  it('documents env and callback readiness without secret-like examples', () => {
    for (const variable of [
      'OSU_PROVIDER_ENABLED',
      'OSU_CLIENT_ID',
      'OSU_CLIENT_SECRET',
      'OSU_REDIRECT_URI',
      'OSU_STATE_SECRET',
      'OSU_AUTHORIZATION_URL',
      'OSU_TOKEN_ENDPOINT',
      'OSU_API_BASE_URL',
      'OSU_SCOPES',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]) {
      assert.match(readinessDocs, new RegExp(variable));
    }

    assert.match(readinessDocs, /http:\/\/localhost:3001\/api\/v1\/integrations\/osu\/callback/);
    assert.match(readinessDocs, /https:\/\/staging\.tryhardnames\.com\/api\/v1\/integrations\/osu\/callback/);
    assert.match(readinessDocs, /https:\/\/tryhardnames\.com\/api\/v1\/integrations\/osu\/callback/);
    assert.match(readinessDocs, /no localhost callback in production/i);
    assert.match(readinessDocs, /exactly in osu!/i);
    assert.doesNotMatch(readinessDocs, /OSU_CLIENT_SECRET\s*=|SUPABASE_SERVICE_ROLE_KEY\s*=|access_token\s*=|refresh_token\s*=|client_secret\s*=|code=[A-Za-z0-9_-]{8,}|state=[A-Za-z0-9_-]{16,}/i);
  });

  it('documents the staging smoke, monitoring, rollback, and trust-safety guards', () => {
    assert.match(readinessDocs, /sign in with Google Parent Auth/i);
    assert.match(readinessDocs, /connect osu!/i);
    assert.match(readinessDocs, /owner status shows osu! connected, verified, and private/i);
    assert.match(readinessDocs, /public `\/id\/:slug` shows only allowlisted osu! fields/i);
    assert.match(readinessDocs, /unlink\/revoke removes public serving/i);
    assert.match(readinessDocs, /token vault stores no access token or refresh token/i);
    assert.match(readinessDocs, /callback replay fails/i);
    assert.match(readinessDocs, /proof visibility mutation by another owner fails/i);
    assert.match(readinessDocs, /Disable osu! runtime/i);
    assert.match(readinessDocs, /disable the osu! public projection allowlist/i);
    assert.match(readinessDocs, /monitoring/i);
    assert.match(readinessDocs, /No official osu! endorsement claim/i);
    assert.match(readinessDocs, /No rank, PP, score, match-history/i);
    assert.match(readinessDocs, /No `\/cosmetics`/i);
    assert.match(readinessDocs, /No store, checkout, billing, or payments/i);
  });

  it('updates roadmap docs with RM-35 as this PR and RM-36 next', () => {
    assert.match(roadmapDocs, /RM-35 osu! Production Readiness \/ Staging Go-No-Go/);
    assert.match(roadmapDocs, /Staging decision: conditional-go|staging is `conditional-go`/i);
    assert.match(roadmapDocs, /Production decision: no-go|production is `no-go`/i);
    assert.match(roadmapDocs, /RM-36 osu! Staging Configuration \/ Manual Smoke/);
    assert.match(roadmapDocs, /OSU_PRODUCTION_READINESS_GO_NO_GO\.md/);
    assert.match(roadmapDocs, /OSU_STAGING_SMOKE_RUNBOOK\.md/);
    assert.match(roadmapDocs, /OSU_ENVIRONMENT_CHECKLIST\.md/);
  });

  it('keeps forbidden browser and public route surfaces out of RM-35 source', () => {
    assert.doesNotMatch(webSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/i);
    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
    assert.doesNotMatch(appSource, /path=["'][^"']*osu/i);
  });

  it('wires RM-35 source guard into SEO tests', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-production-readiness\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-production-readiness\.test\.js/);
  });
});
