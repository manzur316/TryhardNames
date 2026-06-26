import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const firstProviderDecisionPath = new URL('../../../../docs/product/FIRST_PROVIDER_DECISION_READINESS.md', import.meta.url);
const providerReadinessPath = new URL('../../../../docs/product/PROVIDER_READINESS_CHECKLIST.md', import.meta.url);
const pr18ScopePath = new URL('../../../../docs/product/PR18_RIOT_READINESS_SCOPE.md', import.meta.url);

const firstProviderDecision = readRepo('docs/product/FIRST_PROVIDER_DECISION_READINESS.md');
const providerReadiness = readRepo('docs/product/PROVIDER_READINESS_CHECKLIST.md');
const pr18Scope = readRepo('docs/product/PR18_RIOT_READINESS_SCOPE.md');
const readme = readRepo('README.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const providerFoundationDoc = readRepo('docs/product/PROVIDER_RUNTIME_FOUNDATION.md');
const riotAudit = readRepo('docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md');
const packageJson = JSON.parse(readWeb('package.json'));

const runtimeSurfaceSource = [
  readWeb('src/pages/AccountPage.jsx'),
  readWeb('src/pages/GamingPassportPage.jsx'),
  readWeb('src/pages/PublicGamingPassportPage.jsx'),
  readWeb('src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx'),
  readWeb('src/gaming-passport/data/providerRuntimeRepository.js'),
].join('\n');

const planningDocs = [
  firstProviderDecision,
  providerReadiness,
  pr18Scope,
  readme,
  currentRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
  providerFoundationDoc,
  riotAudit,
].join('\n');

const launchClaimDocs = [
  readme,
  currentRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
  providerFoundationDoc,
  pr18Scope,
].join('\n');

describe('First Provider Decision and Readiness Pack', () => {
  it('adds the PR17 decision, readiness checklist, and PR18 Riot Readiness scope', () => {
    assert.equal(existsSync(firstProviderDecisionPath), true);
    assert.equal(existsSync(providerReadinessPath), true);
    assert.equal(existsSync(pr18ScopePath), true);

    assert.match(firstProviderDecision, /First Provider Decision And Readiness Pack/);
    assert.match(firstProviderDecision, /PR18 = Riot Readiness/);
    assert.match(firstProviderDecision, /Riot Runtime: blocked/);
    assert.match(firstProviderDecision, /No OAuth launch/);
    assert.match(providerReadiness, /Provider Readiness Checklist/);
    assert.match(pr18Scope, /PR18 is not Riot runtime/);
  });

  it('documents the approval-based decision without inventing Riot approval', () => {
    assert.match(firstProviderDecision, /does not contain explicit evidence that Riot has approved/i);
    assert.match(firstProviderDecision, /Riot approval is not evidenced/i);
    assert.match(firstProviderDecision, /Discord Pilot remains a possible future path/i);
    assert.match(riotAudit, /PR18 = Riot Readiness/);
    assert.match(riotAudit, /Riot Runtime: blocked/);

    assert.doesNotMatch(planningDocs, /Riot Runtime: approved/i);
    assert.doesNotMatch(planningDocs, /Riot Runtime: approved/i);
    assert.doesNotMatch(planningDocs, /approved production Riot key exists/i);
    assert.doesNotMatch(launchClaimDocs, /Riot OAuth is live/i);
    assert.doesNotMatch(launchClaimDocs, /Discord OAuth is live/i);
  });

  it('updates roadmap docs for PR17 and selects PR18 Riot Readiness', () => {
    assert.match(readme, /First Provider Decision \+ Readiness Pack selecting PR18 as Riot Readiness/);
    assert.match(currentRoadmap, /Current Status After PR21/);
    assert.match(currentRoadmap, /Riot Readiness Pack exists/);
    assert.match(executionPlan, /PR17 adds the First Provider Decision \+ Readiness Pack/);
    assert.match(executionPlan, /PR18 Riot Readiness Pack/);
    assert.match(statusMatrix, /Riot readiness \| done/);
    assert.match(decisionLog, /PR18 is Riot Readiness, not Riot Runtime/);
  });

  it('keeps provider identity boundaries and product guardrails explicit', () => {
    assert.match(planningDocs, /Riot remains gated by approval/);
    assert.match(planningDocs, /Google remains Parent Auth/);
    assert.match(planningDocs, /Discord\/Riot are future linked providers/);

    [
      /No OP\.GG clone/i,
      /No tracker/i,
      /No match-history dump/i,
      /No custom MMR\/ELO/i,
      /No live-game advice/i,
      /No hidden-player de-anonymization/i,
      /No ranking alternative/i,
    ].forEach((pattern) => {
      assert.match(planningDocs, pattern);
    });
  });

  it('does not add live OAuth, provider APIs, or provider token handling to runtime surfaces', () => {
    assert.doesNotMatch(runtimeSurfaceSource, /Continue with Riot|Continue with Discord/i);
    assert.doesNotMatch(runtimeSurfaceSource, /Riot OAuth is live|Discord OAuth is live/i);
    assert.doesNotMatch(runtimeSurfaceSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeSurfaceSource, /api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(runtimeSurfaceSource, /clientSecret|providerToken|provider_token|refreshToken/i);
  });

  it('documents PR18 forbidden runtime work and keeps test wiring current', () => {
    assert.match(pr18Scope, /Riot OAuth button/);
    assert.match(pr18Scope, /Riot API calls/);
    assert.match(pr18Scope, /Env vars/);
    assert.match(pr18Scope, /Linked provider runtime activation/);
    assert.match(packageJson.scripts['test:seo'], /first-provider-decision-readiness\.test\.js/);
    assert.match(packageJson.scripts.test, /first-provider-decision-readiness\.test\.js/);
  });
});
