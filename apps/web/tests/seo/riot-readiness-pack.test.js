import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const riotReadinessPath = new URL('../../../../docs/product/RIOT_READINESS_PACK.md', import.meta.url);
const riotRsoDesignPath = new URL('../../../../docs/product/RIOT_RSO_CALLBACK_DESIGN.md', import.meta.url);
const riotAdapterReviewPath = new URL('../../../../docs/product/RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md', import.meta.url);

const riotReadiness = readRepo('docs/product/RIOT_READINESS_PACK.md');
const riotRsoDesign = readRepo('docs/product/RIOT_RSO_CALLBACK_DESIGN.md');
const riotAdapterReview = readRepo('docs/product/RIOT_PROVIDER_ADAPTER_CONTRACT_REVIEW.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const masterRoadmap = readRepo('docs/product/MASTER_PRODUCT_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const firstProviderDecision = readRepo('docs/product/FIRST_PROVIDER_DECISION_READINESS.md');
const pr18Scope = readRepo('docs/product/PR18_RIOT_READINESS_SCOPE.md');
const providerReadiness = readRepo('docs/product/PROVIDER_READINESS_CHECKLIST.md');
const riotAudit = readRepo('docs/product/RIOT_POLICY_COMPLIANCE_AUDIT.md');
const packageJson = JSON.parse(readWeb('package.json'));

const runtimeSource = [
  readWeb('src/App.jsx'),
  readWeb('src/pages/AccountPage.jsx'),
  readWeb('src/pages/GamingPassportPage.jsx'),
  readWeb('src/pages/PublicGamingPassportPage.jsx'),
  readWeb('src/gaming-passport/components/ProviderRuntimeFoundationPanel.jsx'),
  readWeb('src/gaming-passport/data/providerRuntimeRepository.js'),
].join('\n');

const publicProjectionSource = readWeb('src/gaming-passport/data/publicPassportRepository.js');

const publicUiAndDomainSource = [
  readWeb('src/pages/PublicGamingPassportPage.jsx'),
  readWeb('src/gaming-passport/domain/publicProjection.js'),
].join('\n');

const planningDocs = [
  riotReadiness,
  riotRsoDesign,
  riotAdapterReview,
  currentRoadmap,
  masterRoadmap,
  executionPlan,
  statusMatrix,
  decisionLog,
  firstProviderDecision,
  pr18Scope,
  providerReadiness,
  riotAudit,
].join('\n');

describe('Riot Readiness Pack', () => {
  it('adds PR18 Riot readiness artifacts', () => {
    assert.equal(existsSync(riotReadinessPath), true);
    assert.equal(existsSync(riotRsoDesignPath), true);
    assert.equal(existsSync(riotAdapterReviewPath), true);

    assert.match(riotReadiness, /Riot Readiness Pack/);
    assert.match(riotReadiness, /Riot Runtime: blocked/);
    assert.match(riotReadiness, /PR18 is not Riot runtime/);
    assert.match(riotRsoDesign, /Riot RSO Callback Design/);
    assert.match(riotRsoDesign, /No callback route is implemented in PR18/);
    assert.match(riotAdapterReview, /Riot Provider Adapter Contract Review/);
    assert.match(riotAdapterReview, /No RiotProvider runtime is implemented in PR18/);
  });

  it('documents approval gates, manual portal checklist, and PR19 preconditions', () => {
    assert.match(riotReadiness, /Approval Checklist/);
    assert.match(riotReadiness, /Manual Riot Portal Checklist/);
    assert.match(riotReadiness, /PR19 Preconditions/);
    assert.match(riotReadiness, /PR19 is the earliest possible Riot runtime PR, and only if explicit approval exists/);
    assert.match(riotReadiness, /No OAuth launch/i);
    assert.match(riotReadiness, /No Riot API calls/i);
    assert.match(riotReadiness, /No secrets\/env vars/i);
  });

  it('keeps Riot readiness design-only and runtime blocked in roadmap docs', () => {
    assert.match(currentRoadmap, /Current Status After PR21/);
    assert.match(currentRoadmap, /Riot Runtime remains blocked until explicit approval exists/);
    assert.match(masterRoadmap, /Riot Readiness Pack is implemented as docs\/tests-only readiness work/);
    assert.match(executionPlan, /PR18 adds the Riot Readiness Pack/);
    assert.match(statusMatrix, /Riot readiness \| done/);
    assert.match(decisionLog, /Riot Readiness Pack is design\/readiness only/);
    assert.match(firstProviderDecision, /PR18 Readiness Output/);
    assert.match(pr18Scope, /PR18 is now implemented as readiness-only docs\/tests work/);
    assert.match(providerReadiness, /PR18 Riot Readiness Application/);
    assert.match(riotAudit, /PR18 Riot Readiness Update/);
  });

  it('keeps source free of live Riot or Discord OAuth/API activation', () => {
    assert.doesNotMatch(runtimeSource, /Continue with Riot|Continue with Discord/i);
    assert.doesNotMatch(runtimeSource, /Riot OAuth is live|Discord OAuth is live/i);
    assert.doesNotMatch(runtimeSource, /api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(runtimeSource, /oauth\/authorize|authorize\?/i);
    assert.doesNotMatch(runtimeSource, /\/auth\/riot\/callback|riot\/callback/i);
    assert.doesNotMatch(runtimeSource, /path=.*riot/i);
    assert.doesNotMatch(runtimeSource, /RiotProvider\(|LeagueOfLegendsAdapter\(/);
    assert.doesNotMatch(runtimeSource, /clientSecret|accessToken|providerToken|provider_token|refreshToken/i);
  });

  it('does not expand public projection with Riot-private fields', () => {
    assert.match(publicProjectionSource, /FORBIDDEN_PUBLIC_KEYS/);
    assert.doesNotMatch(publicUiAndDomainSource, /token_ciphertext|metadata_private|external_account_id|externalAccountId/i);
    assert.doesNotMatch(publicUiAndDomainSource, /RiotProvider\(|LeagueOfLegendsAdapter\(/);
    assert.match(riotReadiness, /Public Projection Review Criteria/);
    assert.match(riotReadiness, /Public projection may only expand in a later PR/);
  });

  it('keeps product and Riot compliance guardrails explicit', () => {
    [
      /OP\.GG clone/i,
      /tracker/i,
      /match-history dump/i,
      /custom MMR\/ELO/i,
      /ranking alternative/i,
      /live-game advice/i,
      /hidden-player de-anonymization/i,
      /No Riot data behind a paywall/i,
    ].forEach((pattern) => {
      assert.match(planningDocs, pattern);
    });
  });

  it('wires the PR18 guard test into SEO and default tests', () => {
    assert.match(packageJson.scripts['test:seo'], /riot-readiness-pack\.test\.js/);
    assert.match(packageJson.scripts.test, /riot-readiness-pack\.test\.js/);
  });
});
