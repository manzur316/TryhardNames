import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const readmeUrl = new URL('../../../../README.md', import.meta.url);
const masterRoadmapUrl = new URL('../../../../docs/product/MASTER_PRODUCT_ROADMAP.md', import.meta.url);
const themeContractUrl = new URL('../../../../docs/product/UI_THEME_SURFACE_CONTRACT.md', import.meta.url);
const themeAuditUrl = new URL('../../../../docs/product/THEME_AUDIT.md', import.meta.url);
const readme = readRepo('README.md');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const masterRoadmap = readRepo('docs/product/MASTER_PRODUCT_ROADMAP.md');
const themeContract = readRepo('docs/product/UI_THEME_SURFACE_CONTRACT.md');
const themeAudit = readRepo('docs/product/THEME_AUDIT.md');
const privacySource = readWeb('src/pages/PrivacyPolicyPage.jsx');
const termsSource = readWeb('src/pages/TermsOfServicePage.jsx');
const publicPolicyCopy = [readme, privacySource, termsSource].join('\n');
const planningDocs = [readme, currentRoadmap, masterRoadmap, themeContract, themeAudit].join('\n');

describe('README and public policy copy', () => {
  it('keeps the root README present and clear about Riot review status', () => {
    assert.equal(existsSync(readmeUrl), true);
    assert.match(readme, /Riot integration is pending Riot approval/);
    assert.match(readme, /Riot OAuth \/ Riot Sign On is not live/);
    assert.match(readme, /No Riot data is live/);
    assert.match(readme, /The repo has no production Riot key/);
  });

  it('documents Gaming Passport privacy boundaries', () => {
    assert.match(privacySource, /Gaming Passport starts as a private draft/);
    assert.match(privacySource, /Google is Parent Auth only/);
    assert.match(privacySource, /Riot data is not currently collected in production/);
    assert.match(privacySource, /Provider tokens will stay server-side when implemented/);
  });

  it('documents Gaming Passport terms and Riot ownership boundaries', () => {
    assert.match(termsSource, /Riot integration is pending Riot approval/);
    assert.match(termsSource, /Riot Games does not sponsor, approve, or operate TryhardNames Gaming Passport/);
    assert.match(termsSource, /Riot-owned trademarks, game data, properties, and assets remain Riot-owned/);
    assert.match(termsSource, /Riot data is not placed behind a paywall/);
  });

  it('does not claim unavailable Riot runtime capabilities in public policy copy', () => {
    assert.doesNotMatch(publicPolicyCopy, /Riot OAuth is live\b/i);
    assert.doesNotMatch(publicPolicyCopy, /production Riot key exists\b/i);
    assert.doesNotMatch(publicPolicyCopy, /real Riot data is live\b/i);
  });

  it('links and keeps master planning documents present', () => {
    assert.match(readme, /docs\/product\/MASTER_PRODUCT_ROADMAP\.md/);
    assert.match(readme, /docs\/product\/UI_THEME_SURFACE_CONTRACT\.md/);
    assert.match(readme, /docs\/product\/THEME_AUDIT\.md/);
    assert.match(readme, /docs\/product\/ROADMAP_STATUS_MATRIX\.md/);
    assert.match(readme, /docs\/product\/PRODUCT_EXECUTION_PLAN_AFTER_PR10\.md/);
    assert.match(readme, /docs\/product\/DECISION_LOG\.md/);
    assert.equal(existsSync(masterRoadmapUrl), true);
    assert.equal(existsSync(themeContractUrl), true);
    assert.equal(existsSync(themeAuditUrl), true);
  });

  it('documents theme gates and current theme audit findings', () => {
    assert.match(themeContract, /\| `\/account` \| Must be theme-aware\. \|/);
    assert.match(themeAudit, /### `\/account`[\s\S]*Severity before PR10\.1: High\./);
    assert.match(themeAudit, /### `\/gaming-passport`[\s\S]*Status: THEME_AWARE after this PR\./);
    assert.match(themeContract, /\| `\/gaming-passport` \| Theme-aware after PR10\.2/);
  });

  it('keeps roadmap dependency gates explicit', () => {
    assert.match(masterRoadmap, /Provider-neutral runtime foundation[\s\S]*Discord or Riot OAuth/);
    assert.match(masterRoadmap, /Riot approval[\s\S]*Riot runtime/);
    assert.match(currentRoadmap, /Current Status After PR22/);
    assert.match(currentRoadmap, /Corrected Roadmap Order/);
  });

  it('does not claim unavailable Riot runtime work is complete', () => {
    assert.doesNotMatch(planningDocs, /Riot OAuth is live\b/i);
    assert.doesNotMatch(planningDocs, /real Riot data is live\b/i);
    assert.doesNotMatch(
      planningDocs,
      /(?:we have|there is|tryhardnames has|the repo has)\s+(?:a\s+)?production Riot key/i
    );
  });
});
