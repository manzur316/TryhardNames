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

const governancePath = repoPath('docs/product/ROADMAP_GOVERNANCE.md');
const indexPath = repoPath('docs/product/ROADMAP_INDEX.md');
const expansionPath = repoPath('docs/product/PROVIDER_EXPANSION_ROADMAP.md');
const registryPath = repoPath('docs/product/ROADMAP_MILESTONE_REGISTRY.md');

const governance = readRepo('docs/product/ROADMAP_GOVERNANCE.md');
const roadmapIndex = readRepo('docs/product/ROADMAP_INDEX.md');
const providerExpansion = readRepo('docs/product/PROVIDER_EXPANSION_ROADMAP.md');
const milestoneRegistry = readRepo('docs/product/ROADMAP_MILESTONE_REGISTRY.md');
const readme = readRepo('README.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const packageJson = JSON.parse(readWeb('package.json'));

const docs = [
  governance,
  roadmapIndex,
  providerExpansion,
  milestoneRegistry,
  readme,
  currentRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
].join('\n');

const appSource = readWeb('src/App.jsx');
const appRuntimeSource = readTree('apps/web/src');
const databaseSource = readTree('supabase');
const runtimeSource = [appRuntimeSource, databaseSource].join('\n');

describe('Roadmap Governance and Provider Expansion Plan', () => {
  it('adds RM-23 roadmap governance docs', () => {
    assert.equal(existsSync(governancePath), true);
    assert.equal(existsSync(indexPath), true);
    assert.equal(existsSync(expansionPath), true);
    assert.equal(existsSync(registryPath), true);

    assert.match(governance, /Roadmap Governance/);
    assert.match(governance, /GitHub\/main\/docs are the source of truth/);
    assert.match(governance, /chat is not a source of truth/i);
    assert.match(governance, /GH PR #N/);
    assert.match(governance, /RM-XX/);
    assert.match(governance, /They are not the same identifier/);
  });

  it('documents the RM-23 to RM-27 milestone organization', () => {
    [
      /RM-23[\s\S]{0,100}Roadmap Governance \+ Provider Expansion Plan/,
      /RM-24[\s\S]{0,100}Launch Readiness/,
      /RM-25[\s\S]{0,100}Provider Expansion Readiness Matrix/,
      /RM-26[\s\S]{0,100}osu! Readiness Pack/,
      /RM-27[\s\S]{0,100}osu! Runtime Foundation/,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });

    assert.match(docs, /RM-27[\s\S]*conditional/i);
    assert.match(docs, /legacy product label "PR23 Launch Readiness" is deprecated/i);
  });

  it('records real GitHub PR to RM examples and source-of-truth rules', () => {
    [
      /GH PR #23[\s\S]*RM-14 Publish Runtime Commands/,
      /GH PR #24[\s\S]*RM-15 Public Gaming Passport MVP/,
      /GH PR #25[\s\S]*RM-16 Provider Runtime Foundation/,
      /GH PR #27[\s\S]*RM-18 Riot Readiness Pack/,
      /GH PR #28[\s\S]*RM-21 Passport Cosmetics Foundation/,
      /GH PR #29[\s\S]*RM-22 Trust \/ Safety \/ Privacy Controls/,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });

    assert.match(docs, /Every future PR body should include/);
    assert.match(docs, /Implements: RM-XX/);
    assert.match(docs, /Source of truth: GitHub\/main\/docs\/product\/merged PRs\/CI/);
  });

  it('defines provider expansion as readiness-before-runtime', () => {
    assert.match(providerExpansion, /Provider expansion is readiness-first/);
    assert.match(providerExpansion, /No provider runtime without a provider readiness pack first/);
    assert.match(providerExpansion, /Riot runtime remains gated by explicit approval/i);
    assert.match(providerExpansion, /osu! is the recommended first provider readiness candidate/);
    assert.match(providerExpansion, /RM-26 is readiness only/);
    assert.match(providerExpansion, /Steam is an identity provider candidate/);
    assert.match(providerExpansion, /Supercell \/ Clash is blocked until ownership verification strategy is documented/);
    assert.match(providerExpansion, /Discord is a social\/community provider candidate/);
    assert.match(providerExpansion, /not an achievement proof/);
  });

  it('keeps runtime source free of provider activation, cosmetics route, and payment/store activation', () => {
    assert.doesNotMatch(runtimeSource, /api\.riotgames\.com|discord\.com\/api|osu\.ppy\.sh\/api/i);
    assert.doesNotMatch(runtimeSource, /steamcommunity\.com\/openid|api\.steampowered\.com|developer\.clashofclans\.com/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(packageJson.dependencies ? JSON.stringify(packageJson.dependencies) : '', /Stripe|MercadoPago/i);
    assert.doesNotMatch(packageJson.devDependencies ? JSON.stringify(packageJson.devDependencies) : '', /Stripe|MercadoPago/i);
    assert.doesNotMatch(runtimeSource, /VITE_.*RIOT|VITE_.*DISCORD|VITE_.*OSU|VITE_.*STEAM|VITE_.*CLASH/i);
    assert.doesNotMatch(runtimeSource, /CLIENT_SECRET|CLIENT_ID/);
  });

  it('updates roadmap docs and test wiring', () => {
    assert.match(readme, /RM-23 Roadmap Governance \+ Provider Expansion Plan/);
    assert.match(currentRoadmap, /Roadmap Governance Convention/);
    assert.match(executionPlan, /RM-24 Launch Readiness/);
    assert.match(statusMatrix, /Provider Expansion Readiness Matrix/);
    assert.match(decisionLog, /Roadmap milestones use RM-XX/);

    assert.match(packageJson.scripts['test:seo'], /roadmap-governance\.test\.js/);
    assert.match(packageJson.scripts.test, /roadmap-governance\.test\.js/);
  });
});
