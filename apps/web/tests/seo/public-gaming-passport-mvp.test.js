import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const appSource = readWeb('src/App.jsx');
const routeCatalogSource = readWeb('src/core/routing/routeCatalog.js');
const routeGuardSource = readWeb('src/core/guards/RouteGuard.jsx');
const routeValidatorSource = readWeb('src/core/utils/routeValidator.js');
const pageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const safetyNoticeSource = readWeb('src/gaming-passport/components/PublicPassportSafetyNotice.jsx');
const repositorySource = readWeb('src/gaming-passport/data/publicPassportRepository.js');
const constantsSource = readWeb('src/gaming-passport/domain/constants.js');
const projectionSource = readWeb('src/gaming-passport/domain/publicProjection.js');
const migrationSource = readRepo('supabase/migrations/20260625210000_public_gaming_passport_projection.sql');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const publicDoc = readRepo('docs/product/PUBLIC_GAMING_PASSPORT_MVP.md');
const packageJson = JSON.parse(readWeb('package.json'));

const publicServingSource = [
  pageSource,
  safetyNoticeSource,
  migrationSource,
].join('\n');

describe('Public Gaming Passport MVP', () => {
  it('adds /id/:slug before dynamic generator routing', () => {
    assert.match(appSource, /path="\/id\/:slug"/);
    assert.ok(
      appSource.indexOf('path="/id/:slug"') < appSource.indexOf('path="/:category/:keyword"'),
      '/id/:slug must be declared before /:category/:keyword'
    );
    assert.equal(existsSync(new URL('../../src/pages/PublicGamingPassportPage.jsx', import.meta.url)), true);
    assert.match(routeCatalogSource, /isAppRegisteredDynamicRoute/);
    assert.match(routeCatalogSource, /\^\\\/id\\\/\[a-z0-9\]/);
    assert.match(routeGuardSource, /isAppRegisteredDynamicRoute\(path\)/);
    assert.match(routeValidatorSource, /isAppRegisteredDynamicRoute\(sanitized\)/);
  });

  it('uses a public RPC and does not read raw Passport tables from the public route', () => {
    assert.match(repositorySource, /get_public_gaming_passport_projection/);
    assert.match(repositorySource, /client\.rpc\('get_public_gaming_passport_projection'/);
    assert.doesNotMatch(repositorySource, /\.from\('gaming_passports'\)/);
    assert.doesNotMatch(repositorySource, /\.select\('\*'\)/);
    assert.match(migrationSource, /create or replace function public\.get_public_gaming_passport_projection/);
    assert.match(migrationSource, /returns jsonb/);
    assert.match(migrationSource, /security definer/i);
    assert.match(migrationSource, /grant execute on function public\.get_public_gaming_passport_projection\(text\) to anon/);
  });

  it('keeps the projection allowlisted and blocks private field leakage', () => {
    assert.match(constantsSource, /PUBLIC_PASSPORT_ALLOWED_KEYS/);
    assert.match(projectionSource, /buildPublicPassportProjection/);
    assert.match(repositorySource, /PUBLIC_PASSPORT_ALLOWED_KEYS/);
    assert.match(repositorySource, /PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS/);
    assert.match(repositorySource, /PUBLIC_PROOF_ALLOWED_KEYS/);
    assert.match(repositorySource, /FORBIDDEN_PUBLIC_KEYS/);

    for (const forbidden of [
      'owner_id',
      'ownerId',
      'email',
      'publicationConsent',
      'bioShort',
      'featuredSavedNames',
      'metadata_private',
      'rawPayload',
      'accessToken',
      'refreshToken',
      'providerToken',
      'clientSecret',
      'externalAccountId',
    ]) {
      assert.match(repositorySource, new RegExp(forbidden));
    }

    assert.doesNotMatch(pageSource, /owner_id|ownerId|email|rawPayload|accessToken|refreshToken|providerToken|clientSecret|externalAccountId/);
    assert.doesNotMatch(migrationSource, /owner_id',|externalAccountId|rawPayload|metadata_private|clientSecret/);
  });

  it('renders safe public, unavailable, and SEO states without edit controls', () => {
    assert.match(pageSource, /Gaming Passport unavailable/);
    assert.match(pageSource, /Private draft state is never exposed here/);
    assert.match(pageSource, /View a public TryhardNames Gaming Passport/);
    assert.match(pageSource, /noIndex/);
    assert.match(pageSource, /skipCanonical/);
    assert.doesNotMatch(pageSource, /Edit draft|Save private draft|Run publish command|Unpublish/);
  });

  it('does not add provider runtime, OAuth, token storage, or tracker behavior', () => {
    assert.doesNotMatch(publicServingSource, /Continue with Riot|Continue with Discord|Riot OAuth|Discord OAuth/i);
    assert.doesNotMatch(publicServingSource, /provider_token|providerToken|refreshToken|clientSecret|accessToken/i);
    assert.doesNotMatch(publicServingSource, /Riot API calls|riot api call/i);
    assert.match(safetyNoticeSource, /not a tracker, OP\.GG clone, match-history dump, custom MMR\/ELO product, live-game advice tool/);
  });

  it('updates roadmap docs for PR15 and keeps provider activation pending', () => {
    assert.match(currentRoadmap, /Current Status After PR17/);
    assert.match(currentRoadmap, /Public Gaming Passport MVP/);
    assert.match(executionPlan, /PR15 Public Gaming Passport MVP `\/id\/:slug`[\s\S]*Implemented by PR15/);
    assert.match(statusMatrix, /Public Profile `\/id\/:slug` \| done/);
    assert.match(decisionLog, /Public Gaming Passport MVP serves only allowlisted projection data/);
    assert.match(publicDoc, /Provider activation remains pending/);
    assert.match(publicDoc, /PR16 adds provider-neutral foundation/);
    assert.match(publicDoc, /Riot OAuth/);
    assert.match(packageJson.scripts.test, /public-gaming-passport-mvp\.test\.js/);
    assert.match(packageJson.scripts['test:seo'], /public-gaming-passport-mvp\.test\.js/);
  });
});
