import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const readTree = (root, extensions = ['.js', '.jsx', '.ts', '.tsx']) => {
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
  'docs/product/OSU_PUBLIC_PROFILE_TRUST_SAFETY_QA.md',
  'docs/product/RM34_OSU_PUBLIC_PROFILE_TRUST_SAFETY_SCOPE.md',
  'docs/product/OSU_PUBLIC_PROFILE_ROLLBACK_PLAN.md',
  'docs/product/OSU_PUBLIC_PROJECTION_GATE.md',
  'docs/product/OSU_PUBLIC_PROJECTION_SMOKE_QA.md',
  'docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md',
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
const publicProjectionSource = readWeb('src/gaming-passport/domain/publicProjection.js');
const publicRepositorySource = readWeb('src/gaming-passport/data/publicPassportRepository.js');
const publicLinkedProvidersSource = readWeb('src/gaming-passport/components/PublicLinkedProviders.jsx');
const publicProofCardSource = readWeb('src/gaming-passport/components/PublicProofCard.jsx');
const publicPageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const appSource = readWeb('src/App.jsx');
const publicProfileSource = [
  publicRepositorySource,
  publicLinkedProvidersSource,
  publicProofCardSource,
  publicPageSource,
].join('\n');
const webSource = readTree('apps/web/src');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-34 osu! Public Profile Trust-Safety QA', () => {
  it('adds RM-34 trust-safety docs, rollback, and RM-35 handoff', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_PUBLIC_PROFILE_TRUST_SAFETY_QA.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM34_OSU_PUBLIC_PROFILE_TRUST_SAFETY_SCOPE.md')), true);
    assert.equal(existsSync(repoPath('docs/product/OSU_PUBLIC_PROFILE_ROLLBACK_PLAN.md')), true);
    assert.match(docs, /RM-34 osu! Public Profile Trust-Safety QA/);
    assert.match(docs, /No official osu! endorsement/i);
    assert.match(docs, /TryhardNames verified account ownership through osu! OAuth/);
    assert.match(docs, /No rank, PP, score, match-history, beatmap, best-play, or live tracker/i);
    assert.match(docs, /production remains blocked/i);
    assert.match(docs, /rollback/i);
    assert.match(docs, /RM-35 osu! Production Readiness \/ Staging Go-No-Go/);
    assert.match(roadmapDocs, /RM-34 osu! Public Profile Trust-Safety QA/);
    assert.match(roadmapDocs, /RM-35 osu! Production Readiness \/ Staging Go-No-Go/);
  });

  it('renders the osu! public DTO through neutral copy and text-only values', () => {
    assert.match(publicLinkedProvidersSource, /provider\.providerId === 'osu'/);
    assert.match(publicLinkedProvidersSource, /TryhardNames verified account ownership through osu! OAuth/);
    assert.match(publicProofCardSource, /Linked osu! account/);
    assert.match(publicProofCardSource, /Profile linked/);
    assert.match(publicPageSource, /getPublicProofKey/);
    assert.match(publicPageSource, /proof\.source === 'osu'/);
    assert.doesNotMatch(publicProfileSource, /dangerouslySetInnerHTML/);
    assert.doesNotMatch(publicProfileSource, /JSON\.stringify/);
    assert.doesNotMatch(publicProfileSource, /verified by osu|official osu|endorsed by osu|endorsement/i);
  });

  it('keeps osu! public output constrained to the RM-31/RM-33 allowlist', () => {
    assert.match(publicRepositorySource, /OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS/);
    assert.match(publicRepositorySource, /OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS/);
    assert.match(publicProjectionSource, /providerId: 'osu'/);
    assert.match(publicProjectionSource, /displayName: 'osu!'/);
    assert.match(publicProjectionSource, /externalUsername/);
    assert.match(publicProjectionSource, /profileUrl/);
    assert.match(publicProjectionSource, /verifiedAt/);
    assert.match(publicProjectionSource, /type: 'profile_linked'/);
    assert.match(publicProjectionSource, /label: 'Linked osu! account'/);
    assert.match(publicProjectionSource, /source: 'osu'/);
    assert.match(publicProjectionSource, /observedAt/);
    assert.match(publicProjectionSource, /visibility: 'public'/);

    for (const blocked of ['externalAccountId', 'ownerId', 'linkedProviderAccountId', 'rawPayload', 'rawApiPayload', 'rawOAuthPayload']) {
      assert.match(publicRepositorySource, new RegExp(blocked));
      assert.doesNotMatch(publicLinkedProvidersSource, new RegExp(blocked));
      assert.doesNotMatch(publicProofCardSource, new RegExp(blocked));
    }
  });

  it('enforces a safe osu! profile URL contract before public links render', () => {
    assert.match(publicRepositorySource, /function cleanOsuProfileUrl/);
    assert.match(publicRepositorySource, /new URL\(rawUrl\)/);
    assert.match(publicRepositorySource, /OSU_PROFILE_HOST_PARTS\.join\('\.'\)/);
    assert.match(publicRepositorySource, /url\.protocol === 'https:'/);
    assert.match(publicRepositorySource, /url\.hostname === expectedHost/);
    assert.match(publicRepositorySource, /url\.pathname/);
    assert.match(publicRepositorySource, /!url\.search/);
    assert.match(publicRepositorySource, /!url\.hash/);
    assert.match(publicLinkedProvidersSource, /href=\{provider\.profileUrl\}/);
    assert.match(publicLinkedProvidersSource, /rel="noopener noreferrer"/);
    assert.doesNotMatch(publicRepositorySource, /osu\.ppy\.sh/);
  });

  it('keeps forbidden public/browser surfaces out of the RM-34 public profile path', () => {
    assert.doesNotMatch(publicProfileSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/i);
    assert.doesNotMatch(publicProfileSource, /token_ciphertext|provider_token|external_account_id|linked_provider_account_id|owner_id|passport_id|proof_id/i);
    assert.doesNotMatch(publicProfileSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
    assert.doesNotMatch(appSource, /path=["'][^"']*osu/i);
  });

  it('wires RM-34 into web test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-public-profile-trust-safety\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-public-profile-trust-safety\.test\.js/);
  });
});
