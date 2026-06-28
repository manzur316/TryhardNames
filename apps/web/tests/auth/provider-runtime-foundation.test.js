import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const migrationSource = readRepo('supabase/migrations/20260625220000_provider_runtime_foundation.sql');
const domainSource = readWeb('src/gaming-passport/domain/providerRuntime.js');
const domainIndexSource = readWeb('src/gaming-passport/domain/index.js');
const repositorySource = readWeb('src/gaming-passport/data/providerRuntimeRepository.js');
const panelSource = readWeb('src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx');
const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const publicPageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const publicRepositorySource = readWeb('src/gaming-passport/data/publicPassportRepository.js');
const packageJson = JSON.parse(readWeb('package.json'));
const providerDoc = readRepo('docs/product/PROVIDER_RUNTIME_FOUNDATION.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');

const privateProviderSource = [
  repositorySource,
  panelSource,
  accountPageSource,
].join('\n');

describe('Provider Runtime Foundation', () => {
  it('adds provider runtime foundation files and exports domain contracts', () => {
    assert.equal(existsSync(new URL('../../src/gaming-passport/domain/providerRuntime.js', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/data/providerRuntimeRepository.js', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../../../docs/product/PROVIDER_RUNTIME_FOUNDATION.md', import.meta.url)), true);
    assert.match(domainIndexSource, /providerRuntime/);
    assert.match(domainSource, /createProviderConnectionIntent/);
    assert.match(domainSource, /validateProviderCallbackState/);
    assert.match(domainSource, /buildProviderRuntimeAuditEvent/);
    assert.match(domainSource, /buildProviderSyncJob/);
    assert.match(domainSource, /assertNoProviderRuntimeActivation/);
    assert.match(domainSource, /PROVIDER_RUNTIME_NOT_LIVE/);
  });

  it('adds local schema, RLS, and no client-readable token vault', () => {
    for (const tableName of [
      'provider_connection_intents',
      'provider_callback_states',
      'provider_token_vault',
      'provider_sync_jobs',
      'provider_audit_events',
    ]) {
      assert.match(migrationSource, new RegExp(`create table public\\.${tableName}`));
      assert.match(migrationSource, new RegExp(`alter table public\\.${tableName} enable row level security`));
    }

    assert.match(migrationSource, /provider_token_vault_no_ciphertext_in_pr16/);
    assert.match(migrationSource, /token_ciphertext is null/);
    assert.match(migrationSource, /revoke all on table[\s\S]*public\.provider_token_vault[\s\S]*from authenticated/);
    assert.doesNotMatch(migrationSource, /grant select[\s\S]*provider_token_vault[\s\S]*to authenticated/i);
    assert.doesNotMatch(migrationSource, /grant insert[\s\S]*provider_token_vault[\s\S]*to authenticated/i);
    assert.match(migrationSource, /provider_audit_events_insert_own/);
    assert.doesNotMatch(migrationSource, /provider_audit_events_update_own/);
  });

  it('keeps repository scaffolding owner scoped and avoids sensitive selects', () => {
    assert.match(repositorySource, /export async function createProviderConnectionIntent/);
    assert.match(repositorySource, /export async function requestProviderUnlink/);
    assert.match(repositorySource, /export async function requestProviderRevoke/);
    assert.match(repositorySource, /export async function createProviderSyncJob/);
    assert.match(repositorySource, /\.eq\('owner_id', ownerId\)/);
    assert.match(repositorySource, /\.eq\('passport_id', passportId\)/);
    assert.match(repositorySource, /PROVIDER_RUNTIME_NOT_LIVE/);
    assert.doesNotMatch(repositorySource, /token_ciphertext|provider_token|refresh_token|client_secret/i);
    assert.doesNotMatch(repositorySource, /api\.riotgames\.com|discord\.com\/api|oauth\/authorize|authorize\?/i);
  });

  it('renders an account panel that keeps provider-neutral contracts server-gated after RM-30', () => {
    assert.match(accountPageSource, /ProviderRuntimeFoundationPanel/);
    assert.match(panelSource, /Provider Runtime Foundation/);
    assert.match(panelSource, /Provider runtime stays server-gated/);
    assert.match(panelSource, /Server-gated/);
    assert.match(panelSource, /osu! owner linking is handled by the private card above/);
    assert.match(panelSource, /Riot requires approval|Requires Riot approval/);
    assert.match(panelSource, /No account connection button or redirect is exposed/);
    assert.match(panelSource, /never run provider token exchange in the browser/);
    assert.doesNotMatch(panelSource, /Connect Riot|Connect Discord|Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(panelSource, /href=.*riot|href=.*discord|onClick=.*provider/i);
  });

  it('does not add live provider activation, provider APIs, or token usage', () => {
    assert.doesNotMatch(privateProviderSource, /Continue with Riot|Continue with Discord/i);
    assert.doesNotMatch(privateProviderSource, /api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(privateProviderSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(privateProviderSource, /clientSecret|refreshToken|providerToken|provider_token/);
    assert.doesNotMatch(privateProviderSource, /Riot API calls are active|Discord API calls are active/i);
  });

  it('keeps public profile serving allowlisted and free of provider internals', () => {
    assert.match(publicRepositorySource, /FORBIDDEN_PUBLIC_KEYS/);
    assert.match(publicRepositorySource, /externalAccountId/);
    assert.doesNotMatch(publicPageSource, /token_ciphertext|provider_token|providerToken|refreshToken|clientSecret/);
    assert.doesNotMatch(publicPageSource, /externalAccountId|external_account_id|metadata_private|rawPayload/);
    assert.match(publicPageSource, /PublicGamingPassportPage/);
  });

  it('updates docs and test wiring for PR16 without claiming providers are live', () => {
    assert.match(providerDoc, /Provider Runtime Foundation/);
    assert.match(providerDoc, /No provider is live/);
    assert.match(providerDoc, /No Discord account linking is live/);
    assert.match(providerDoc, /No Riot account linking is live/);
    assert.match(providerDoc, /Riot remains gated by approval/);
    assert.match(currentRoadmap, /PR16/);
    assert.match(statusMatrix, /Provider Runtime Foundation \| partial-runtime/);
    assert.match(decisionLog, /Provider Runtime Foundation is provider-neutral and not a provider launch/);
    assert.doesNotMatch(providerDoc, /^Riot account linking is live/im);
    assert.doesNotMatch(providerDoc, /^Discord account linking is live/im);
    assert.match(packageJson.scripts['test:auth'], /provider-runtime-foundation\.test\.js/);
  });
});
