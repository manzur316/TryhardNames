import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx', '.sql']) => {
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

const launchReadinessPath = repoPath('docs/product/LAUNCH_READINESS.md');
const smokePath = repoPath('docs/product/PRODUCTION_SMOKE_CHECKLIST.md');
const observabilityPath = repoPath('docs/product/OBSERVABILITY_AND_MONITORING.md');
const rollbackPath = repoPath('docs/product/ROLLBACK_PLAN.md');
const goNoGoPath = repoPath('docs/product/LAUNCH_GO_NO_GO_MATRIX.md');
const policyReviewPath = repoPath('docs/product/POLICY_FINAL_REVIEW.md');
const scopePath = repoPath('docs/product/RM24_LAUNCH_READINESS_SCOPE.md');

const launchReadiness = readRepo('docs/product/LAUNCH_READINESS.md');
const productionSmoke = readRepo('docs/product/PRODUCTION_SMOKE_CHECKLIST.md');
const observability = readRepo('docs/product/OBSERVABILITY_AND_MONITORING.md');
const rollback = readRepo('docs/product/ROLLBACK_PLAN.md');
const goNoGo = readRepo('docs/product/LAUNCH_GO_NO_GO_MATRIX.md');
const policyReview = readRepo('docs/product/POLICY_FINAL_REVIEW.md');
const scope = readRepo('docs/product/RM24_LAUNCH_READINESS_SCOPE.md');
const roadmapIndex = readRepo('docs/product/ROADMAP_INDEX.md');
const milestoneRegistry = readRepo('docs/product/ROADMAP_MILESTONE_REGISTRY.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const readme = readRepo('README.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const packageJson = JSON.parse(readWeb('package.json'));

const launchDocs = [
  launchReadiness,
  productionSmoke,
  observability,
  rollback,
  goNoGo,
  policyReview,
  scope,
  roadmapIndex,
  milestoneRegistry,
  statusMatrix,
  decisionLog,
  readme,
  currentRoadmap,
  executionPlan,
].join('\n');

const appSource = readWeb('src/App.jsx');
const runtimeSource = [readTree('apps/web/src'), readTree('supabase')].join('\n');
const migrationFiles = readdirSync(fileURLToPath(repoPath('supabase/migrations')));

describe('RM-24 Launch Readiness', () => {
  it('adds the launch readiness documentation pack', () => {
    [
      launchReadinessPath,
      smokePath,
      observabilityPath,
      rollbackPath,
      goNoGoPath,
      policyReviewPath,
      scopePath,
    ].forEach((path) => {
      assert.equal(existsSync(path), true);
    });

    assert.match(launchReadiness, /RM-24 Launch Readiness/);
    assert.match(launchReadiness, /Launch readiness does not execute deploy/);
    assert.match(productionSmoke, /Production Smoke Checklist/);
    assert.match(observability, /Observability And Monitoring/);
    assert.match(rollback, /Rollback Plan/);
    assert.match(goNoGo, /Launch Go\/No-Go Matrix/);
    assert.match(policyReview, /Policy Final Review/);
  });

  it('documents launch boundaries and next roadmap block', () => {
    [
      /RM-24 Launch Readiness/,
      /RM-25 Provider Expansion Readiness Matrix is next/,
      /Production smoke checklist/i,
      /Observability checklist/i,
      /Rollback plan/i,
      /go\/no-go matrix/i,
      /Policy final review/i,
      /Riot runtime remains gated/i,
      /Provider runtime remains inactive/i,
      /osu![\s\S]*future readiness candidate/i,
      /Steam[\s\S]*future readiness candidate/i,
      /Supercell \/ Clash[\s\S]*future readiness candidate/i,
      /Discord[\s\S]*future readiness candidate/i,
      /\/cosmetics[\s\S]*future/i,
      /store[\s\S]*payments[\s\S]*out of scope/i,
      /allowlisted public projection|public projection remains allowlisted/i,
      /cosmetics remain visual-only/i,
      /Reports remain private|no public report list/i,
    ].forEach((pattern) => {
      assert.match(launchDocs, pattern);
    });
  });

  it('keeps RM-24 documented after later roadmap handoffs', () => {
    assert.match(roadmapIndex, /RM-24[\s\S]{0,120}Launch Readiness[\s\S]{0,120}done/);
    assert.match(roadmapIndex, /RM-25[\s\S]{0,180}Provider Expansion Readiness Matrix[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-26[\s\S]{0,180}osu! Readiness Pack[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-27[\s\S]{0,180}osu! Runtime Foundation[\s\S]{0,180}done/);
    assert.match(milestoneRegistry, /RM-24[\s\S]{0,160}Launch Readiness[\s\S]{0,160}done/);
    assert.match(statusMatrix, /Launch readiness \| done[\s\S]*RM-25/);
    assert.match(decisionLog, /Launch Readiness is evidence and governance, not launch execution/);
    assert.match(readme, /RM-24 Launch Readiness Pack/);
    assert.match(currentRoadmap, /Current Status After RM-28/);
    assert.match(executionPlan, /Implemented by RM-24/);
  });

  it('keeps runtime free of provider activation, OAuth, cosmetics route, store, and payments', () => {
    assert.doesNotMatch(runtimeSource, /api\.riotgames\.com|discord\.com\/api|osu\.ppy\.sh\/api/i);
    assert.doesNotMatch(runtimeSource, /steamcommunity\.com\/openid|api\.steampowered\.com|developer\.clashofclans\.com/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeSource, /VITE_.*RIOT|VITE_.*DISCORD|VITE_.*OSU|VITE_.*STEAM|VITE_.*CLASH/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(packageJson.dependencies ? JSON.stringify(packageJson.dependencies) : '', /Stripe|MercadoPago/i);
    assert.doesNotMatch(packageJson.devDependencies ? JSON.stringify(packageJson.devDependencies) : '', /Stripe|MercadoPago/i);
  });

  it('does not add RM-24 database migrations', () => {
    assert.equal(
      migrationFiles.some((file) => /rm24|launch|readiness/i.test(file)),
      false
    );
  });

  it('is wired into SEO and default test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /launch-readiness\.test\.js/);
    assert.match(packageJson.scripts.test, /launch-readiness\.test\.js/);
  });
});
