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
  'docs/product/OSU_PUBLIC_PROJECTION_SMOKE_QA.md',
  'docs/product/RM33_OSU_PUBLIC_PROJECTION_SMOKE_SCOPE.md',
  'docs/product/OSU_PUBLIC_PROJECTION_GATE.md',
  'docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md',
  'docs/product/OSU_OWNER_PROOF_VISIBILITY_CONTROLS.md',
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
const smokeMigrationSource = readRepo('supabase/migrations/20260628180000_osu_public_projection_smoke.sql');
const databaseTestSource = readRepo('supabase/tests/database/gaming_passport_schema_test.sql');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-33 osu! Public Projection Smoke / Projection QA', () => {
  it('adds RM-33 smoke docs and declares RM-34 trust-safety QA next', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_PUBLIC_PROJECTION_SMOKE_QA.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM33_OSU_PUBLIC_PROJECTION_SMOKE_SCOPE.md')), true);
    assert.match(docs, /RM-33 validates the full public projection pipeline/);
    assert.match(docs, /Decision: Option B, enable the safe local projection gate/);
    assert.match(docs, /Public preference alone does not bypass the allowlist/);
    assert.match(docs, /RM-34 osu! Public Profile Trust-Safety QA/);
    assert.match(roadmapDocs, /RM-33 osu! Public Projection Smoke \/ Projection QA/);
    assert.match(roadmapDocs, /RM-34 osu! Public Profile Trust-Safety QA/);
  });

  it('keeps the domain default blocked while allowing explicit projection-pipeline smoke', () => {
    assert.match(policySource, /publicProjectionAllowlistEnabled = false/);
    assert.match(policySource, /RM-34 osu! Public Profile Trust-Safety QA/);
    assert.match(publicationPolicySource, /osuPublicProjectionAllowlistEnabled/);
    assert.match(publicationPolicySource, /publicProjectionAllowlistEnabled/);
    assert.match(publicProjectionSource, /osuPublicProjectionAllowlistEnabled = false/);
    assert.match(publicProjectionSource, /getPublicLinkedProviderAccounts\(\s*linkedProviderAccounts,\s*publicProjectionOptions/s);
    assert.match(publicProjectionSource, /getFeaturedVerifiedProofs\(\{[\s\S]*publicProjectionOptions/);
  });

  it('adds a local RPC smoke migration that emits only allowlisted osu fields', () => {
    assert.match(smokeMigrationSource, /provider\.provider <> 'osu'/);
    assert.match(smokeMigrationSource, /proof\.provider <> 'osu'/);
    assert.match(smokeMigrationSource, /'providerId', 'osu'/);
    assert.match(smokeMigrationSource, /'displayName', 'osu!'/);
    assert.match(smokeMigrationSource, /'externalUsername', provider\.display_name/);
    assert.match(smokeMigrationSource, /'type', 'profile_linked'/);
    assert.match(smokeMigrationSource, /'label', 'Linked osu! account'/);
    assert.doesNotMatch(smokeMigrationSource, /'external_account_id'|'externalAccountId'/i);
    assert.doesNotMatch(smokeMigrationSource, /'owner_id'|'ownerId'/i);
    assert.doesNotMatch(smokeMigrationSource, /'metadata_safe'|'metadataSafe'/i);
  });

  it('documents and tests blocked field non-leakage for DB projection', () => {
    for (const allowed of ['providerId', 'externalUsername', 'profileUrl', 'verifiedAt', 'type', 'label', 'observedAt']) {
      assert.match(docs, new RegExp(allowed));
      assert.match(databaseTestSource, new RegExp(allowed));
    }

    for (const blocked of [
      /raw external account id/i,
      /linked provider account id/i,
      /proof id/i,
      /raw API payload/i,
      /raw OAuth payload/i,
      /rank/i,
      /PP/i,
      /match history/i,
      /beatmap history/i,
      /live status/i,
    ]) {
      assert.match(docs, blocked);
    }

    assert.match(databaseTestSource, /must-not-leak/);
    assert.match(databaseTestSource, /RM-33 public projection allows safe osu labels but omits internal id and malicious metadata/);
  });

  it('keeps forbidden browser and product surfaces out of RM-33 source', () => {
    const rm33ProjectionSource = `${policySource}\n${publicationPolicySource}\n${publicProjectionSource}\n${repositorySource}`;

    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
    assert.doesNotMatch(rm33ProjectionSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
  });

  it('wires RM-33 source guard into SEO tests', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-public-projection-smoke\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-public-projection-smoke\.test\.js/);
  });
});
