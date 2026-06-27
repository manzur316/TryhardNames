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

const docFiles = [
  'docs/product/OSU_READINESS_PACK.md',
  'docs/product/OSU_PROVIDER_CONTRACT_REVIEW.md',
  'docs/product/OSU_OAUTH_API_REVIEW.md',
  'docs/product/OSU_PUBLIC_PROOF_MODEL.md',
  'docs/product/OSU_TRUST_SAFETY_PRIVACY_REVIEW.md',
  'docs/product/OSU_BRANDING_MONETIZATION_REVIEW.md',
  'docs/product/RM26_OSU_READINESS_SCOPE.md',
];

const docs = [
  ...docFiles.map(readRepo),
  readRepo('README.md'),
  readRepo('docs/product/ROADMAP_INDEX.md'),
  readRepo('docs/product/ROADMAP_MILESTONE_REGISTRY.md'),
  readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md'),
  readRepo('docs/product/ROADMAP_STATUS_MATRIX.md'),
  readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md'),
  readRepo('docs/product/DECISION_LOG.md'),
  readRepo('docs/product/PROVIDER_EXPANSION_ROADMAP.md'),
  readRepo('docs/product/PROVIDER_EXPANSION_READINESS_MATRIX.md'),
  readRepo('docs/product/PROVIDER_CANDIDATE_NOTES.md'),
].join('\n');

const readme = readRepo('README.md');
const roadmapIndex = readRepo('docs/product/ROADMAP_INDEX.md');
const milestoneRegistry = readRepo('docs/product/ROADMAP_MILESTONE_REGISTRY.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const providerExpansion = readRepo('docs/product/PROVIDER_EXPANSION_ROADMAP.md');
const osuReadiness = readRepo('docs/product/OSU_READINESS_PACK.md');
const osuOAuth = readRepo('docs/product/OSU_OAUTH_API_REVIEW.md');
const osuProof = readRepo('docs/product/OSU_PUBLIC_PROOF_MODEL.md');
const packageJson = JSON.parse(readWeb('package.json'));
const rootPackageJson = JSON.parse(readRepo('package.json'));

const appSource = readWeb('src/App.jsx');
const runtimeSource = [readTree('apps/web/src'), readTree('supabase')].join('\n');
const packageSources = JSON.stringify({
  rootDependencies: rootPackageJson.dependencies ?? {},
  rootDevDependencies: rootPackageJson.devDependencies ?? {},
  webDependencies: packageJson.dependencies ?? {},
  webDevDependencies: packageJson.devDependencies ?? {},
});
const migrationFiles = readdirSync(fileURLToPath(repoPath('supabase/migrations')));

describe('RM-26 osu! Readiness Pack', () => {
  it('adds the RM-26 documentation pack', () => {
    docFiles.forEach((file) => {
      assert.equal(existsSync(repoPath(file)), true);
    });

    assert.match(osuReadiness, /RM-26 osu! Readiness Pack/);
    assert.match(readRepo('docs/product/OSU_PROVIDER_CONTRACT_REVIEW.md'), /provider id conceptual[\s\S]{0,40}`osu`/);
    assert.match(osuOAuth, /RM-26 osu! OAuth\/API Review/);
    assert.match(osuProof, /RM-26 osu! Public Proof Model/);
  });

  it('declares readiness-before-runtime and strict RM-26 non-goals', () => {
    [
      /RM-26 osu! Readiness Pack/,
      /readiness-before-runtime/i,
      /no osu! runtime/i,
      /no OAuth implementation/i,
      /no callback route/i,
      /no token storage implementation/i,
      /no env vars\/secrets/i,
      /public projection remains allowlisted/i,
      /proof model is conceptual/i,
      /no tracker\/ranking clone/i,
      /no match-history dump/i,
      /no live-game advice/i,
      /no hidden-player inference/i,
      /no store\/payment/i,
      /no `?\/cosmetics`?/i,
      /RM-27 status: (go|conditional-go|no-go|implemented as conditional foundation)/i,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });
  });

  it('documents official osu! docs review, ownership, OAuth, proof, and conditional RM-27 decision', () => {
    [
      /official_docs_review: run/i,
      /https:\/\/osu\.ppy\.sh\/docs\//,
      /Authorization Code[\s\S]{0,160}ownership/i,
      /Client Credentials[\s\S]{0,120}not acceptable[\s\S]{0,120}ownership/i,
      /`identify public`/,
      /\/me\/\{mode\?\}/,
      /profile_linked/,
      /Revoke current token|revoke current token/i,
      /stale[\s\S]{0,80}revoked/i,
      /rate limit[\s\S]{0,120}backoff/i,
      /not official osu! endorsement/i,
      /RM-27 status: (conditional-go|implemented as conditional foundation)/i,
    ].forEach((pattern) => {
      assert.match(docs, pattern);
    });
  });

  it('keeps RM-26 documented after the RM-27 runtime foundation handoff', () => {
    assert.match(readme, /RM-26 osu! Readiness Pack/);
    assert.match(roadmapIndex, /RM-25[\s\S]{0,180}Provider Expansion Readiness Matrix[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-26[\s\S]{0,180}osu! Readiness Pack[\s\S]{0,180}done/);
    assert.match(roadmapIndex, /RM-27[\s\S]{0,180}osu! Runtime Foundation[\s\S]{0,180}done/);
    assert.match(milestoneRegistry, /RM-26[\s\S]{0,220}osu! Readiness Pack[\s\S]{0,220}done/);
    assert.match(executionPlan, /RM-26 adds osu! Readiness Pack/);
    assert.match(statusMatrix, /osu! Readiness Pack \| done/);
    assert.match(currentRoadmap, /Current Status After RM-28/);
    assert.match(decisionLog, /osu! readiness exits `conditional-go` for RM-27/);
    assert.match(providerExpansion, /RM-26 osu! Readiness Output/);
  });

  it('keeps runtime source free of osu! API, OAuth, callback, env var, token, migration, and payment activation', () => {
    assert.doesNotMatch(runtimeSource, /osu\.ppy\.sh\/api/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeSource, /\/auth\/osu\/callback/i);
    assert.doesNotMatch(runtimeSource, /OsuProvider\(|class OsuProvider|function OsuProvider/);
    assert.doesNotMatch(runtimeSource, /osuAccessToken|osuRefreshToken|providerAccessToken|providerRefreshToken/i);
    assert.doesNotMatch(runtimeSource, /VITE_.*OSU|OSU_CLIENT_ID|OSU_CLIENT_SECRET/i);
    assert.doesNotMatch(runtimeSource, /osu_token|osu_provider|provider_token_vault.*osu/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
    assert.doesNotMatch(packageSources, /Stripe|MercadoPago/i);
  });

  it('does not add RM-26 database migrations or commercial routes', () => {
    assert.equal(
      migrationFiles.some((file) => /rm26/i.test(file)),
      false
    );

    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
  });

  it('is wired into SEO and default test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-readiness-pack\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-readiness-pack\.test\.js/);
  });
});
