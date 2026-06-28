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
  'docs/product/OSU_OWNER_PROOF_VISIBILITY_CONTROLS.md',
  'docs/product/RM32_OSU_OWNER_PROOF_VISIBILITY_SCOPE.md',
  'docs/product/OSU_PRIVATE_PROOF_PUBLISH_POLICY.md',
  'docs/product/OSU_PUBLIC_PROJECTION_GATE.md',
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
const osuCardSource = readWeb('src/gaming-passport/components/OsuProviderLinkingCard.jsx');
const osuRepositorySource = readWeb('src/gaming-passport/data/osuRuntimeRepository.js');
const osuOwnerVisibilitySource = `${osuCardSource}\n${osuRepositorySource}`;
const policySource = readWeb('src/gaming-passport/domain/osuPublicProjectionPolicy.js');
const apiRouteSource = readRepo('apps/api/src/integrations/osu/routes.js');
const apiStoreSource = readRepo('apps/api/src/integrations/osu/runtimeStore.js');
const migrationSource = readRepo('supabase/migrations/20260628120000_osu_public_projection_gate.sql');
const appSource = readWeb('src/App.jsx');
const webSource = readTree('apps/web/src');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-32 osu! Owner Proof Visibility Controls', () => {
  it('adds RM-32 docs and declares RM-33 public projection smoke next', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_OWNER_PROOF_VISIBILITY_CONTROLS.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM32_OSU_OWNER_PROOF_VISIBILITY_SCOPE.md')), true);
    assert.match(docs, /RM-32 osu! Owner Proof Visibility Controls/);
    assert.match(docs, /owner-only/i);
    assert.match(docs, /public projection remains gated/i);
    assert.match(docs, /RM-33 osu! Public Projection Smoke \/ Projection QA/);
    assert.match(roadmapDocs, /RM-32 osu! Owner Proof Visibility Controls/);
    assert.match(roadmapDocs, /RM-33 osu! Public Projection Smoke \/ Projection QA/);
  });

  it('uses an owner-authenticated backend route for proof visibility writes', () => {
    assert.match(apiRouteSource, /r\.post\('\/proof-visibility'/);
    assert.match(apiRouteSource, /requireOwnerSession\(req, supabase\)/);
    assert.match(apiRouteSource, /setOsuProfileProofVisibility/);
    assert.match(apiStoreSource, /setOsuProfileProofVisibility/);
    assert.match(apiStoreSource, /passport_not_publication_ready/);
    assert.match(apiStoreSource, /non_osu_provider_rejected/);
    assert.match(apiStoreSource, /profile_linked_proof_not_current/);
    assert.match(apiStoreSource, /public_projection_allowlist_disabled/);
  });

  it('extends the private Account UI with explicit public/private proof controls', () => {
    assert.match(osuRepositorySource, /export async function setOsuProofVisibility/);
    assert.match(osuRepositorySource, /\/proof-visibility/);
    assert.match(osuCardSource, /Proof visibility/);
    assert.match(osuCardSource, /Make Public/);
    assert.match(osuCardSource, /Confirm Public/);
    assert.match(osuCardSource, /Make Private/);
    assert.match(osuCardSource, /Private: only you can see this proof/);
    assert.match(osuCardSource, /Passport is published, publication consent is active/);
    assert.match(osuCardSource, /automatic public projection/i);
  });

  it('keeps public projection gated after owner controls are present', () => {
    assert.match(policySource, /ownerVisibilityControlsEnabled = true/);
    assert.match(policySource, /publicProjectionAllowlistEnabled = false/);
    assert.match(policySource, /OSU_PUBLIC_PROJECTION_NEXT_RM = 'RM-33 osu! Public Projection Smoke \/ Projection QA'/);
    assert.match(policySource, /OSU_PUBLIC_PROJECTION_BLOCK_REASON = 'public_projection_allowlist_disabled'/);
    assert.match(policySource, /OSU_OWNER_VISIBILITY_CONTROLS_BLOCK_REASON = 'owner_visibility_controls_missing'/);
    assert.match(migrationSource, /provider\.provider <> 'osu'/);
    assert.match(migrationSource, /proof\.provider <> 'osu'/);
  });

  it('does not add browser secrets, direct osu! calls, public routes, commerce, or tracker features', () => {
    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
    assert.doesNotMatch(webSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/);
    assert.doesNotMatch(osuOwnerVisibilitySource, /external_account_id|owner_id|rawPayload|metadata_safe|token_ciphertext|provider_token/i);
    assert.doesNotMatch(osuCardSource, /console\.(log|warn|error)|localStorage|sessionStorage/);
    assert.doesNotMatch(osuRepositorySource, /console\.(log|warn|error)|localStorage|sessionStorage/);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
  });

  it('wires RM-32 into web test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-owner-proof-visibility\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-owner-proof-visibility\.test\.js/);
  });
});
