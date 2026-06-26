import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const migrationSource = readRepo('supabase/migrations/20260625200000_publish_runtime_commands.sql');
const repositorySource = readWeb('src/gaming-passport/data/passportPublishRepository.js');
const domainSource = readWeb('src/gaming-passport/domain/publishCommands.js');
const controlsSource = readWeb('src/gaming-passport/components/PassportPublishControls.jsx');
const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const appSource = readWeb('src/App.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');

const combinedRuntimeSource = [
  repositorySource,
  domainSource,
  controlsSource,
  accountPageSource,
  appSource,
].join('\n');

describe('Publish Runtime Commands', () => {
  it('adds owner-controlled SQL command functions without direct public serving', () => {
    assert.equal(existsSync(new URL('../../../../supabase/migrations/20260625200000_publish_runtime_commands.sql', import.meta.url)), true);
    assert.match(migrationSource, /create or replace function public\.set_gaming_passport_publication_consent/);
    assert.match(migrationSource, /create or replace function public\.claim_gaming_passport_slug/);
    assert.match(migrationSource, /create or replace function public\.publish_gaming_passport/);
    assert.match(migrationSource, /create or replace function public\.unpublish_gaming_passport/);
    assert.match(migrationSource, /security definer/i);
    assert.match(migrationSource, /auth\.uid\(\)/);
    assert.match(migrationSource, /where id = target_passport_id[\s\S]*and owner_id = caller_id/);
    assert.match(migrationSource, /grant execute on function public\.publish_gaming_passport\(uuid\) to authenticated/);
    assert.match(migrationSource, /revoke all on function public\.publish_gaming_passport\(uuid\) from anon/);
  });

  it('keeps publication policy gates enforced by domain code', () => {
    assert.match(domainSource, /buildPublishReadiness/);
    assert.match(domainSource, /canClaimSlug/);
    assert.match(domainSource, /canPublishPassport/);
    assert.match(domainSource, /canUnpublishPassport/);
    assert.match(domainSource, /verified_linked_provider/);
    assert.match(domainSource, /not_suspended/);
    assert.match(domainSource, /published_slug_locked/);
    assert.match(domainSource, /getPublishability/);
  });

  it('uses repository RPC commands and owner-scoped reads', () => {
    assert.match(repositorySource, /export async function setPassportPublicationConsent/);
    assert.match(repositorySource, /export async function claimPassportSlug/);
    assert.match(repositorySource, /export async function publishPassport/);
    assert.match(repositorySource, /export async function unpublishPassport/);
    assert.match(repositorySource, /\.eq\('id', passportId\)/);
    assert.match(repositorySource, /\.eq\('owner_id', ownerId\)/);
    assert.match(repositorySource, /'set_gaming_passport_publication_consent'/);
    assert.match(repositorySource, /'claim_gaming_passport_slug'/);
    assert.match(repositorySource, /'publish_gaming_passport'/);
    assert.match(repositorySource, /client\.rpc\(functionName, params\)/);
    assert.doesNotMatch(repositorySource, /\.update\(\{[\s\S]*status/);
    assert.doesNotMatch(repositorySource, /\.update\(\{[\s\S]*publication_consent/);
  });

  it('renders private account controls with accurate product copy', () => {
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PassportPublishControls.jsx', import.meta.url)), true);
    assert.match(accountPageSource, /PassportPublishControls/);
    assert.match(controlsSource, /Private publish controls/);
    assert.match(controlsSource, /Public <code>\/id\/:slug<\/code> serving exists/);
    assert.match(controlsSource, /publish policy requirements are satisfied/);
    assert.match(controlsSource, /Provider verification is required before public serving/);
    assert.match(controlsSource, /No Riot or Discord connection is live/);
    assert.match(controlsSource, /Run publish command/);
    assert.match(controlsSource, /Unpublish/);
  });

  it('keeps provider runtime and token storage out of PR14 command code', () => {
    assert.match(appSource, /path="\/id\/:slug"/);
    assert.doesNotMatch(combinedRuntimeSource, /Continue with Riot|Continue with Discord|provider_token|providerToken|refreshToken|clientSecret/i);
    assert.doesNotMatch(combinedRuntimeSource, /Riot OAuth|Discord OAuth/i);
    assert.doesNotMatch(combinedRuntimeSource, /rawPayload|accessToken/i);
  });

  it('updates roadmap docs and auth test wiring', () => {
    assert.match(currentRoadmap, /Current Status After PR22/);
    assert.match(currentRoadmap, /Publish Runtime Commands exist/);
    assert.match(currentRoadmap, /Public Gaming Passport MVP `\/id\/:slug` exists/);
    assert.match(executionPlan, /PR14 Publish Runtime Commands[\s\S]*Implemented by PR14/);
    assert.match(executionPlan, /PR15 Public Gaming Passport MVP `\/id\/:slug`[\s\S]*Implemented by PR15/);
    assert.match(executionPlan, /PR16 Provider Runtime Foundation[\s\S]*Implemented by PR16/);
    assert.match(packageJson.scripts['test:auth'], /publish-runtime-commands\.test\.js/);
  });
});
