import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const appSource = readWeb('src/App.jsx');
const osuCardSource = readWeb('src/gaming-passport/components/OsuProviderLinkingCard.jsx');
const osuRepositorySource = readWeb('src/gaming-passport/data/osuRuntimeRepository.js');
const providerPanelSource = readWeb('src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx');
const osuPrivateUiSource = `${osuCardSource}\n${osuRepositorySource}`;
const webSource = readTree('apps/web/src');
const uiHardeningDoc = readRepo('docs/product/OSU_OWNER_LINKING_UI_HARDENING.md');
const rm30ScopeDoc = readRepo('docs/product/RM30_OSU_OWNER_LINKING_UI_SCOPE.md');
const roadmapDocs = [
  'README.md',
  'docs/product/ROADMAP_INDEX.md',
  'docs/product/ROADMAP_MILESTONE_REGISTRY.md',
  'docs/product/ROADMAP_STATUS_MATRIX.md',
  'docs/product/CURRENT_STATE_AND_ROADMAP.md',
  'docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md',
  'docs/product/DECISION_LOG.md',
].map(readRepo).join('\n');
const packageJson = JSON.parse(readWeb('package.json'));

describe('RM-30 osu! Owner Linking UI Hardening', () => {
  it('adds owner-only account UI docs and wires the private card into /account', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_OWNER_LINKING_UI_HARDENING.md')), true);
    assert.equal(existsSync(repoPath('docs/product/RM30_OSU_OWNER_LINKING_UI_SCOPE.md')), true);
    assert.match(accountPageSource, /OsuProviderLinkingCard/);
    assert.match(accountPageSource, /passport=\{passport\}/);
    assert.match(accountPageSource, /session=\{auth\.session\}/);
    assert.match(osuCardSource, /Private owner connection/);
    assert.match(osuCardSource, /Connect osu!/);
    assert.match(osuCardSource, /Disconnect osu!/);
  });

  it('keeps osu! as a linked provider, not Parent Auth or public provider UI', () => {
    assert.match(osuCardSource, /linked provider, not Parent Auth/);
    assert.match(osuCardSource, /keeps the proof private by default/);
    assert.match(osuCardSource, /stores no refresh tokens/);
    assert.match(osuCardSource, /not represent official endorsement by osu!/);
    assert.match(providerPanelSource, /Google remains Parent Auth only/);
    assert.match(providerPanelSource, /osu!, Discord, and Riot are not login methods/);
    assert.doesNotMatch(appSource, /path=["']\/osu|path=["']\/providers|path=["']\/integrations/);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
  });

  it('uses only TryhardNames backend osu! endpoints for status, link-intent, and unlink', () => {
    assert.match(osuRepositorySource, /export async function getOsuRuntimeStatus/);
    assert.match(osuRepositorySource, /export async function createOsuLinkIntent/);
    assert.match(osuRepositorySource, /export async function unlinkOsuProvider/);
    assert.match(osuRepositorySource, /\/api\/v1\/integrations\/osu/);
    assert.match(osuRepositorySource, /\/status/);
    assert.match(osuRepositorySource, /\/link-intent/);
    assert.match(osuRepositorySource, /\/unlink/);
    assert.match(osuRepositorySource, /Authorization: `Bearer \$\{options\.accessToken\}`/);
    assert.match(osuCardSource, /window\.location\.assign\(authorizeUrl\)/);
    assert.doesNotMatch(webSource, /osu\.ppy\.sh/);
  });

  it('keeps disabled and revoke-safe UI states explicit', () => {
    assert.match(osuCardSource, /Not configured/);
    assert.match(osuCardSource, /Ready/);
    assert.match(osuCardSource, /Connected private/);
    assert.match(osuCardSource, /Disconnected/);
    assert.match(osuCardSource, /Needs attention/);
    assert.match(osuCardSource, /disabled=\{!canConnect \|\| isConnecting\}/);
    assert.match(osuCardSource, /disabled=\{!canDisconnect \|\| isUnlinking\}/);
    assert.match(osuCardSource, /The linked provider account and profile proof stay private, move to revoked, and stop serving publicly/);
    assert.match(osuCardSource, /public serving is blocked/);
  });

  it('does not expose browser secrets, provider tokens, raw metadata, or internal provider identifiers', () => {
    assert.doesNotMatch(webSource, /OSU_CLIENT_SECRET|SUPABASE_SERVICE_ROLE_KEY|access_token|refresh_token|client_secret/);
    assert.doesNotMatch(osuPrivateUiSource, /external_account_id|externalAccountId|owner_id|ownerId|rawPayload|metadata_safe|metadataSafe|token_ciphertext|provider_token/i);
    assert.doesNotMatch(osuCardSource, /console\.(log|warn|error)|localStorage|sessionStorage/);
    assert.doesNotMatch(osuRepositorySource, /console\.(log|warn|error)|localStorage|sessionStorage/);
  });

  it('keeps forbidden product surfaces out of RM-30 source', () => {
    assert.doesNotMatch(webSource, /store\/checkout|checkout session|payment intent|billing portal|stripe|mercadopago/i);
    assert.doesNotMatch(webSource, /osuRank|osuRanking|rankedScore|performancePoints|osuPp|ppScore|matchHistory|liveTracker|bestPlays|beatmap/i);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics|path=["']\/store|path=["']\/checkout|path=["']\/billing/);
  });

  it('documents RM-30 scope, result, and RM-31 next policy gate', () => {
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /RM-30/);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /owner-only private UX/i);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /No production launch/i);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /No public osu! proof/i);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /No Parent Auth via osu!/i);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /No refresh-token storage/i);
    assert.match(`${uiHardeningDoc}\n${rm30ScopeDoc}`, /RM-31 osu! Private Proof Publish Policy \/ Public Projection Gate/);
    assert.match(roadmapDocs, /RM-30 osu! Owner Linking UI Hardening \/ Private Account UX/);
    assert.match(roadmapDocs, /RM-31 osu! Private Proof Publish Policy \/ Public Projection Gate/);
  });

  it('wires the RM-30 source guard into SEO tests', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-owner-linking-ui\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-owner-linking-ui\.test\.js/);
  });
});
