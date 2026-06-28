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
  'docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md',
  'docs/product/OSU_PUBLIC_PROJECTION_GATE.md',
  'docs/product/RM31_OSU_PUBLIC_PROJECTION_GATE_SCOPE.md',
  'docs/product/OSU_PUBLIC_PROJECTION_SMOKE_QA.md',
  'docs/product/RM33_OSU_PUBLIC_PROJECTION_SMOKE_SCOPE.md',
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
const policySource = readWeb('src/gaming-passport/domain/osuPublicProjectionPolicy.js');
const publicationPolicySource = readWeb('src/gaming-passport/domain/publicationPolicy.js');
const publicProjectionSource = readWeb('src/gaming-passport/domain/publicProjection.js');
const repositorySource = readWeb('src/gaming-passport/data/publicPassportRepository.js');
const appSource = readWeb('src/App.jsx');
const webSource = readTree('apps/web/src');
const migrationSource = readRepo('supabase/migrations/20260628120000_osu_public_projection_gate.sql');
const smokeMigrationSource = readRepo('supabase/migrations/20260628180000_osu_public_projection_smoke.sql');
const databaseTestSource = readRepo('supabase/tests/database/gaming_passport_schema_test.sql');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-31 osu! Private Proof Publish Policy / Public Projection Gate', () => {
  it('adds the RM-31 policy docs and declares RM-32 owner visibility controls next', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md')), true);
    assert.equal(existsSync(repoPath('docs/product/OSU_PUBLIC_PROJECTION_GATE.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM31_OSU_PUBLIC_PROJECTION_GATE_SCOPE.md')), true);
    assert.match(docs, /RM-31 osu! Private Proof Publish Policy \/ Public Projection Gate/);
    assert.match(docs, /owner_visibility_controls_missing/);
    assert.match(docs, /safe local projection gate/i);
    assert.match(docs, /RM-32 osu! Owner Proof Visibility Controls/);
    assert.match(docs, /RM-33 osu! Public Projection Smoke \/ Projection QA/);
    assert.match(docs, /RM-34 osu! Public Profile Trust-Safety QA/);
    assert.match(roadmapDocs, /RM-31 osu! Private Proof Publish Policy \/ Public Projection Gate/);
    assert.match(roadmapDocs, /RM-32 osu! Owner Proof Visibility Controls/);
    assert.match(roadmapDocs, /RM-33 osu! Public Projection Smoke \/ Projection QA/);
    assert.match(roadmapDocs, /RM-34 osu! Public Profile Trust-Safety QA/);
  });

  it('implements an explicit osu! projection policy gate with RM-32 controls and a disabled default allowlist', () => {
    assert.match(policySource, /OSU_PROFILE_LINKED_SOURCE_KEY = 'osu:profile_linked'/);
    assert.match(policySource, /owner_visibility_controls_missing/);
    assert.match(policySource, /OSU_PUBLIC_PROJECTION_BLOCK_REASON = 'public_projection_allowlist_disabled'/);
    assert.match(policySource, /ownerVisibilityControlsEnabled = true/);
    assert.match(policySource, /publicProjectionAllowlistEnabled = false/);
    assert.match(policySource, /providerId/);
    assert.match(policySource, /externalUsername/);
    assert.match(policySource, /profileUrl/);
    assert.match(policySource, /observedAt/);
    assert.match(publicationPolicySource, /getOsuPublicProjectionDecision/);
    assert.match(publicationPolicySource, /findOsuProfileLinkedProofForAccount/);
    assert.match(publicProjectionSource, /osuPublicProjectionAllowlistEnabled = false/);
    assert.match(publicProjectionSource, /projectOsuLinkedProvider/);
    assert.match(publicProjectionSource, /projectOsuProfileLinkedProof/);
  });

  it('preserves the RM-31 closed RPC migration and adds the RM-33 allowlisted smoke migration', () => {
    assert.match(migrationSource, /RM-31 keeps osu! private/);
    assert.match(migrationSource, /provider\.provider <> 'osu'/);
    assert.match(migrationSource, /proof\.provider <> 'osu'/);
    assert.match(smokeMigrationSource, /RM-33 enables the local osu! public projection smoke path/);
    assert.match(smokeMigrationSource, /'providerId', 'osu'/);
    assert.match(smokeMigrationSource, /'type', 'profile_linked'/);
    assert.match(smokeMigrationSource, /proof\.source_key = 'osu:profile_linked'/);
    assert.match(databaseTestSource, /RM-33 public projection includes osu linked provider only through the allowlist DTO/);
    assert.match(databaseTestSource, /RM-33 public projection includes osu profile-linked proof only through the allowlist DTO/);
    assert.match(databaseTestSource, /OsuPublicOwner/);
    assert.match(databaseTestSource, /OsuInternalPublicProjection/);
  });

  it('documents the public allowlist and blocked fields without launching production', () => {
    for (const allowed of ['providerId', 'displayName', 'externalUsername', 'profileUrl', 'verifiedAt', 'type', 'label', 'source', 'observedAt', 'visibility']) {
      assert.match(docs, new RegExp(allowed));
    }

    for (const blocked of [
      /external account id/i,
      /owner id/i,
      /linked provider account id/i,
      /raw API response/i,
      /raw OAuth response/i,
      /access token/i,
      /refresh token/i,
      /email/i,
      /rank, PP, or best plays/i,
      /match history/i,
      /beatmap history/i,
      /live status/i,
    ]) {
      assert.match(docs, blocked);
    }

    assert.match(docs, /No automatic public osu! proof/i);
    assert.match(docs, /No production launch/i);
    assert.match(docs, /No Parent Auth via osu!/i);
    assert.match(docs, /No refresh-token storage/i);
  });

  it('keeps forbidden browser and product surfaces out of RM-31 source', () => {
    const rm31ProjectionSource = `${policySource}\n${publicationPolicySource}\n${publicProjectionSource}\n${repositorySource}`;

    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
    assert.doesNotMatch(rm31ProjectionSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
  });

  it('wires the RM-31 source guard into SEO tests', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-public-projection-gate\.test\.js/);
    assert.match(packageJson.scripts['test:seo'], /osu-public-projection-smoke\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-public-projection-gate\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-public-projection-smoke\.test\.js/);
  });
});
