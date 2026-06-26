import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const cosmeticsDocPath = new URL('../../../../docs/product/PASSPORT_COSMETICS_FOUNDATION.md', import.meta.url);
const cosmeticsDoc = readRepo('docs/product/PASSPORT_COSMETICS_FOUNDATION.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const masterRoadmap = readRepo('docs/product/MASTER_PRODUCT_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const riotAudit = readRepo('docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md');
const appSource = readWeb('src/App.jsx');
const publicRepositorySource = readWeb('src/gaming-passport/data/publicPassportRepository.js');
const publicProjectionSource = readWeb('src/gaming-passport/domain/publicProjection.js');
const publicPageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const publicCardSource = readWeb('src/gaming-passport/components/PublicPassportCard.jsx');
const migrationSource = readRepo('supabase/migrations/20260626090000_public_cosmetic_scene_projection.sql');
const packageJson = JSON.parse(readWeb('package.json'));

const planningDocs = [
  cosmeticsDoc,
  currentRoadmap,
  masterRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
  riotAudit,
].join('\n');

const publicRenderSource = [
  publicProjectionSource,
  publicPageSource,
  publicCardSource,
].join('\n');

const runtimeRouteAndPaymentSource = [
  appSource,
  readWeb('src/gaming-passport/components/PassportCosmeticsPanel.jsx'),
  readWeb('src/gaming-passport/components/CosmeticPicker.jsx'),
  readWeb('src/gaming-passport/components/CosmeticLoadoutPreview.jsx'),
  readWeb('src/gaming-passport/cosmetics/cosmeticCatalog.js'),
  readWeb('src/gaming-passport/cosmetics/cosmeticLoadout.js'),
  readWeb('src/gaming-passport/cosmetics/cosmeticPolicy.js'),
].join('\n');

describe('Passport Cosmetics Foundation docs and guards', () => {
  it('adds the PR21 product doc and roadmap status', () => {
    assert.equal(existsSync(cosmeticsDocPath), true);
    assert.match(cosmeticsDoc, /Passport Cosmetics Foundation/);
    assert.match(cosmeticsDoc, /freemium (?:\/|and) earned-first/i);
    assert.match(cosmeticsDoc, /Obsidian Pulse/);
    assert.match(cosmeticsDoc, /free foundation preview/i);
    assert.match(currentRoadmap, /Current Status After PR22/);
    assert.match(currentRoadmap, /Passport Cosmetics Foundation/);
    assert.match(masterRoadmap, /Current State After PR21/);
    assert.match(executionPlan, /PR21/);
    assert.match(statusMatrix, /Passport Cosmetics Foundation \| done/);
    assert.match(decisionLog, /Passport Cosmetics are freemium\s*\/\s*earned-first and visual-only/);
  });

  it('documents future cosmetics route and companions without implementing runtime routes/assets', () => {
    assert.match(cosmeticsDoc, /Future `\/cosmetics`/i);
    assert.match(cosmeticsDoc, /Mascots, pets, companions, and 3D/i);
    assert.match(cosmeticsDoc, /not implemented in PR21|does not implement it/i);
    assert.doesNotMatch(appSource, /path="\/cosmetics"/);
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /three|webgl|rive|lottie/i);
  });

  it('keeps store, checkout, payments, and inventory purchases out of runtime scope', () => {
    assert.match(cosmeticsDoc, /No store|not a store/i);
    assert.match(cosmeticsDoc, /No payments|not a payment system|No payment/i);
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /Stripe|MercadoPago|checkout|payment|purchase|subscription|webhook|priceId|price_id/i);
    assert.doesNotMatch(appSource, /\/store|\/checkout|\/pricing|\/billing/);
  });

  it('keeps Riot, Discord, OAuth, and provider runtime activation out of PR21 runtime', () => {
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /Continue with Riot|Continue with Discord|Connect Riot|Connect Discord/i);
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeRouteAndPaymentSource, /clientSecret|accessToken|refreshToken|provider_token|providerToken/i);
    assert.match(riotAudit, /No Riot assets/i);
  });

  it('keeps public projection allowlisted to safe scene cosmetic fields', () => {
    assert.match(publicProjectionSource, /sanitizeCosmeticLoadout/);
    assert.match(publicRepositorySource, /sanitizeCosmeticLoadout/);
    assert.match(publicRepositorySource, /priceId/);
    assert.match(migrationSource, /allowed_theme_ids/);
    assert.match(migrationSource, /theme\.obsidian-pulse/);
    assert.match(migrationSource, /equippedCosmeticIds/);
    assert.doesNotMatch(migrationSource, /unknown\.cosmetic|badge\.founder-reserved|badge\.legacy-reserved/i);
    assert.doesNotMatch(publicRenderSource, /purchaseHistory|inventory|price_id|token_ciphertext|metadata_private|owner_id|email/i);
    assert.doesNotMatch(migrationSource, /featuredSavedNames|purchaseHistory|priceId|owner_email/i);
  });

  it('keeps fake proof, fake rank, tracker, MMR, and Riot data boundaries explicit', () => {
    [
      /No fake proofs/i,
      /fake rank/i,
      /No proof boosts/i,
      /No Riot assets/i,
      /OP\.GG clone/i,
      /tracker/i,
      /MMR\/ELO/i,
      /match-history/i,
      /live-game advice/i,
      /hidden-player de-anonymization/i,
      /No Riot data behind a paywall/i,
    ].forEach((pattern) => assert.match(planningDocs, pattern));
  });

  it('is wired into SEO and default test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /passport-cosmetics-foundation\.test\.js/);
    assert.match(packageJson.scripts.test, /passport-cosmetics-foundation\.test\.js/);
  });
});
