import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const readmeUrl = new URL('../../../../README.md', import.meta.url);
const readme = readRepo('README.md');
const privacySource = readWeb('src/pages/PrivacyPolicyPage.jsx');
const termsSource = readWeb('src/pages/TermsOfServicePage.jsx');
const publicPolicyCopy = [readme, privacySource, termsSource].join('\n');

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
    assert.match(termsSource, /TryhardNames Gaming Passport is not endorsed by Riot Games/);
    assert.match(termsSource, /Riot-owned trademarks, game data, properties, and assets remain Riot-owned/);
    assert.match(termsSource, /Riot data is not placed behind a paywall/);
  });

  it('does not claim unavailable Riot runtime capabilities in public policy copy', () => {
    assert.doesNotMatch(publicPolicyCopy, /Riot OAuth is live\b/i);
    assert.doesNotMatch(publicPolicyCopy, /production Riot key exists\b/i);
    assert.doesNotMatch(publicPolicyCopy, /real Riot data is live\b/i);
  });
});
