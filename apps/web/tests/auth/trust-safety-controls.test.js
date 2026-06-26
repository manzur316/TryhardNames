import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const publicPageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const reportDialogSource = readWeb('src/gaming-passport/components/PublicProfileReportDialog.jsx');
const trustSafetyRepositorySource = readWeb('src/gaming-passport/data/trustSafetyRepository.js');
const reportPolicySource = readWeb('src/gaming-passport/trust-safety/reportPolicy.js');
const migrationSource = readRepo('supabase/migrations/20260626100000_public_profile_reports.sql');
const packageJson = JSON.parse(readWeb('package.json'));

const runtimeSource = [
  publicPageSource,
  reportDialogSource,
  trustSafetyRepositorySource,
  reportPolicySource,
].join('\n');

describe('Trust / Safety / Privacy Controls public profile integration', () => {
  it('adds a report dialog and wires it only into valid public profile rendering', () => {
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PublicProfileReportDialog.jsx', import.meta.url)), true);
    assert.match(publicPageSource, /PublicProfileReportDialog/);
    assert.match(publicPageSource, /state\.status === 'ready'/);
    assert.match(reportDialogSource, /Report profile/);
    assert.match(reportDialogSource, /Public profile report/);
    assert.doesNotMatch(reportDialogSource, /report list|admin dashboard|moderation dashboard/i);
  });

  it('collects only category and details with sensitive-data warnings', () => {
    assert.match(reportDialogSource, /Category/);
    assert.match(reportDialogSource, /Details/);
    assert.match(reportDialogSource, /Do not include passwords, payment info, private contact details, tokens, or external account IDs/);
    assert.doesNotMatch(reportDialogSource, /email|phone|contact email|reporter email/i);
    assert.doesNotMatch(reportDialogSource, /userAgent|fingerprint|ip_address|ipAddress/i);
  });

  it('submits through a safe RPC wrapper without throwing report internals into UI', () => {
    assert.match(trustSafetyRepositorySource, /submit_public_profile_report/);
    assert.match(trustSafetyRepositorySource, /validatePublicProfileReportInput/);
    assert.match(trustSafetyRepositorySource, /return \{ ok: false, error: 'report_failed' \}/);
    assert.doesNotMatch(trustSafetyRepositorySource, /from\('public_profile_reports'\)|select\('\*'\)/);
  });

  it('creates the local report table and RPC without public report reads', () => {
    assert.match(migrationSource, /create table public\.public_profile_reports/);
    assert.match(migrationSource, /alter table public\.public_profile_reports enable row level security/);
    assert.match(migrationSource, /create or replace function public\.submit_public_profile_report/);
    assert.match(migrationSource, /grant execute on function public\.submit_public_profile_report\(text, text, text\) to anon/);
    assert.match(migrationSource, /grant execute on function public\.submit_public_profile_report\(text, text, text\) to authenticated/);
    assert.match(migrationSource, /revoke all on table public\.public_profile_reports from anon/);
    assert.match(migrationSource, /revoke all on table public\.public_profile_reports from authenticated/);
    assert.doesNotMatch(migrationSource, /reporter_email|email|user_agent|ip_address|payment|provider_token|external_account_id/);
  });

  it('keeps store, providers, report admin, and notification services out of runtime', () => {
    assert.doesNotMatch(runtimeSource, /Continue with Riot|Continue with Discord|Connect Riot|Connect Discord/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?|api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(runtimeSource, /clientSecret|providerToken|provider_token|refreshToken/);
    assert.doesNotMatch(runtimeSource, /Stripe|MercadoPago|checkout|purchase|subscription|webhook|priceId|price_id/i);
    assert.doesNotMatch(runtimeSource, /reports\/admin|moderation-dashboard|sendgrid|resend|postmark/i);
  });

  it('is wired into the auth test script', () => {
    assert.match(packageJson.scripts['test:auth'], /trust-safety-controls\.test\.js/);
  });
});
