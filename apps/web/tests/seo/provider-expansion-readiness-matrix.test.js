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

const matrixPath = repoPath('docs/product/PROVIDER_EXPANSION_READINESS_MATRIX.md');
const scorecardPath = repoPath('docs/product/PROVIDER_CANDIDATE_SCORECARD.md');
const notesPath = repoPath('docs/product/PROVIDER_CANDIDATE_NOTES.md');
const scopePath = repoPath('docs/product/RM25_PROVIDER_EXPANSION_SCOPE.md');

const matrix = readRepo('docs/product/PROVIDER_EXPANSION_READINESS_MATRIX.md');
const scorecard = readRepo('docs/product/PROVIDER_CANDIDATE_SCORECARD.md');
const notes = readRepo('docs/product/PROVIDER_CANDIDATE_NOTES.md');
const scope = readRepo('docs/product/RM25_PROVIDER_EXPANSION_SCOPE.md');
const readme = readRepo('README.md');
const roadmapIndex = readRepo('docs/product/ROADMAP_INDEX.md');
const milestoneRegistry = readRepo('docs/product/ROADMAP_MILESTONE_REGISTRY.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const providerExpansion = readRepo('docs/product/PROVIDER_EXPANSION_ROADMAP.md');
const packageJson = JSON.parse(readWeb('package.json'));
const rootPackageJson = JSON.parse(readRepo('package.json'));

const docs = [
  matrix,
  scorecard,
  notes,
  scope,
  readme,
  roadmapIndex,
  milestoneRegistry,
  executionPlan,
  statusMatrix,
  currentRoadmap,
  decisionLog,
  providerExpansion,
].join('\n');

const appSource = readWeb('src/App.jsx');
const runtimeSource = [readTree('apps/web/src'), readTree('supabase')].join('\n');
const packageSources = JSON.stringify({
  rootDependencies: rootPackageJson.dependencies ?? {},
  rootDevDependencies: rootPackageJson.devDependencies ?? {},
  webDependencies: packageJson.dependencies ?? {},
  webDevDependencies: packageJson.devDependencies ?? {},
});
const migrationFiles = readdirSync(fileURLToPath(repoPath('supabase/migrations')));

describe('RM-25 Provider Expansion Readiness Matrix', () => {
  it('adds the RM-25 documentation pack', () => {
    [
      matrixPath,
      scorecardPath,
      notesPath,
      scopePath,
    ].forEach((path) => {
      assert.equal(existsSync(path), true);
    });

    assert.match(matrix, /RM-25 Provider Expansion Readiness Matrix/);
    assert.match(scorecard, /Provider Candidate Scorecard/);
    assert.match(notes, /Provider Candidate Notes/);
    assert.match(scope, /RM-25 Provider Expansion Scope/);
  });

  it('declares readiness-before-runtime and the next roadmap decision', () => {
    [
      /RM-25 Provider Expansion Readiness Matrix/,
      /readiness-before-runtime/i,
      /RM-26 osu! Readiness Pack/,
      /RM-27 osu! Runtime Foundation[\s\S]{0,120}conditional/i,
      /Riot remains approval-gated|Riot remains gated/i,
      /osu![\s\S]{0,220}(recommended|reviewed|conditional-go)[\s\S]{0,220}readiness[\s\S]{0,220}(not runtime|not live runtime|no runtime)/i,
      /Steam[\s\S]{0,120}identity candidate/i,
      /Supercell \/ Clash[\s\S]{0,180}blocked until ownership verification/i,
      /Discord[\s\S]{0,180}social\/community[\s\S]{0,180}not achievement proof/i,
      /Xbox \/ PlayStation \/ Nintendo \/ Epic[\s\S]{0,180}future\/high-friction/i,
      /RM-25 does not activate runtime|RM-25 does not implement[\s\S]{0,120}provider runtime/i,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });
  });

  it('documents the scorecard, provider ranking, and official docs review status', () => {
    [
      /Official docs clarity/,
      /Account ownership verification/,
      /Public profile fields/,
      /OAuth\/API model/,
      /Token storage complexity/,
      /Revoke\/unlink model/,
      /Risk of becoming tracker\/ranking clone/,
      /Recommended Ranking/,
      /official_docs_review: run/i,
      /manual official review/i,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });
  });

  it('keeps RM-25 documented after the RM-26 handoff', () => {
    assert.match(readme, /RM-25 Provider Expansion Readiness Matrix comparing/);
    assert.match(roadmapIndex, /RM-25[\s\S]{0,180}Provider Expansion Readiness Matrix[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-26[\s\S]{0,180}osu! Readiness Pack[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-27[\s\S]{0,180}osu! Runtime Foundation[\s\S]{0,180}done/);
    assert.match(milestoneRegistry, /RM-25[\s\S]{0,220}Provider Expansion Readiness Matrix[\s\S]{0,220}done/);
    assert.match(executionPlan, /RM-25 adds Provider Expansion Readiness Matrix/);
    assert.match(statusMatrix, /Provider Expansion Readiness Matrix \| done/);
    assert.match(currentRoadmap, /Current Status After RM-29/);
    assert.match(decisionLog, /Provider Expansion Readiness Matrix recommends osu! readiness next/);
    assert.match(providerExpansion, /RM-25 Matrix Output/);
  });

  it('keeps runtime source free of provider API, OAuth, callback, env var, route, and payment activation', () => {
    assert.doesNotMatch(runtimeSource, /api\.riotgames\.com|discord\.com\/api|osu\.ppy\.sh\/api|steamcommunity\.com\/openid|api\.steampowered\.com|developer\.clashofclans\.com/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeSource, /\/auth\/riot\/callback|\/auth\/discord\/callback|\/auth\/osu\/callback|\/auth\/steam\/callback|\/auth\/clash\/callback/i);
    assert.doesNotMatch(runtimeSource, /RiotProvider\(|LeagueOfLegendsAdapter\(|DiscordProvider\(|OsuProvider\(|SteamProvider\(|SupercellProvider\(/);
    assert.doesNotMatch(runtimeSource, /riotAccessToken|riotRefreshToken|discordAccessToken|discordRefreshToken|osuAccessToken|osuRefreshToken|steamAccessToken|steamRefreshToken|clashAccessToken|clashRefreshToken|providerAccessToken|providerRefreshToken/i);
    assert.doesNotMatch(runtimeSource, /VITE_.*RIOT|VITE_.*DISCORD|VITE_.*OSU|VITE_.*STEAM|VITE_.*CLASH/i);
    assert.doesNotMatch(runtimeSource, /CLIENT_SECRET|CLIENT_ID/);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(packageSources, /Stripe|MercadoPago/i);
  });

  it('does not add RM-25 database migrations', () => {
    assert.equal(
      migrationFiles.some((file) => /rm25|provider.expansion|provider_expansion/i.test(file)),
      false
    );
  });

  it('is wired into SEO and default test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /provider-expansion-readiness-matrix\.test\.js/);
    assert.match(packageJson.scripts.test, /provider-expansion-readiness-matrix\.test\.js/);
  });
});
