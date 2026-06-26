import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const trustDoc = readRepo('docs/product/TRUST_SAFETY_PRIVACY_CONTROLS.md');
const pr22Scope = readRepo('docs/product/PR22_TRUST_SAFETY_PRIVACY_SCOPE.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const cosmeticsDoc = readRepo('docs/product/PASSPORT_COSMETICS_FOUNDATION.md');
const riotAudit = readRepo('docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md');
const appSource = readWeb('src/App.jsx');
const publicPageSource = readWeb('src/pages/PublicGamingPassportPage.jsx');
const packageJson = JSON.parse(readWeb('package.json'));

const runtimeSource = [
  appSource,
  publicPageSource,
  readWeb('src/gaming-passport/components/PublicProfileReportDialog.jsx'),
].join('\n');

const docs = [
  trustDoc,
  pr22Scope,
  currentRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
  cosmeticsDoc,
  riotAudit,
].join('\n');

describe('Trust / Safety / Privacy Controls docs and guards', () => {
  it('adds the PR22 trust, safety, and privacy controls document', () => {
    assert.equal(existsSync(new URL('../../../../docs/product/TRUST_SAFETY_PRIVACY_CONTROLS.md', import.meta.url)), true);
    assert.match(trustDoc, /Trust \/ Safety \/ Privacy Controls/);
    assert.match(trustDoc, /Public Profile Reporting/i);
    assert.match(trustDoc, /Takedown and Suspension/i);
    assert.match(trustDoc, /Privacy Requests/i);
    assert.match(trustDoc, /Moderation Runbook/i);
  });

  it('documents cosmetic abuse, blocked terms, impersonation, and future distribution controls', () => {
    assert.match(trustDoc, /Cosmetic Abuse Policy/i);
    assert.match(trustDoc, /Blocked and Reserved Visual Identity Terms/i);
    assert.match(trustDoc, /Impersonation Rules/i);
    assert.match(trustDoc, /Future `\/cosmetics` Safety Requirements/i);
    assert.match(trustDoc, /Future Pets\/Companions\/3D Safety Requirements/i);
    assert.match(cosmeticsDoc, /PR22/);
  });

  it('updates roadmap docs without launching providers, store, payments, or cosmetics route', () => {
    assert.match(currentRoadmap, /PR22/);
    assert.match(executionPlan, /Trust \/ Safety \/ Privacy Controls/);
    assert.match(statusMatrix, /Trust \/ Safety \/ Privacy Controls/);
    assert.match(decisionLog, /Public identity requires report, takedown, and privacy controls/);
    assert.doesNotMatch(appSource, /path=["']\/cosmetics["']/);
    assert.doesNotMatch(appSource, /path=["']\/store["']|path=["']\/checkout["']|path=["']\/billing["']/);
  });

  it('keeps product and Riot/provider boundaries explicit', () => {
    assert.match(docs, /Riot runtime remains blocked|Riot remains gated/i);
    assert.match(docs, /no OP\.GG|OP\.GG clone/i);
    assert.match(docs, /no tracker|tracker/i);
    assert.match(docs, /No fake proofs|fake proof/i);
    assert.match(docs, /No fake ranks|fake rank/i);
    assert.match(riotAudit, /PR22/);
  });

  it('keeps runtime free of OAuth, provider APIs, payments, public report admin, and notification services', () => {
    assert.doesNotMatch(runtimeSource, /Continue with Riot|Continue with Discord|api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?|clientSecret|provider_token|providerToken|refreshToken/i);
    assert.doesNotMatch(runtimeSource, /Stripe|MercadoPago|checkout|purchase|subscription|webhook|priceId|price_id/i);
    assert.doesNotMatch(runtimeSource, /reports\/admin|moderation-dashboard|admin report|report list|email notification|sendgrid|resend|postmark/i);
  });

  it('is wired into SEO and default test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /trust-safety-privacy-controls\.test\.js/);
    assert.match(packageJson.scripts.test, /trust-safety-privacy-controls\.test\.js/);
  });
});
