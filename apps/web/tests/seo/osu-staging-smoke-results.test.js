import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');
const repoPath = (path) => new URL(`../../../../${path}`, import.meta.url);

const resultsDoc = readRepo('docs/product/OSU_STAGING_SMOKE_RESULTS.md');
const roadmapDocs = [
  'README.md',
  'docs/product/ROADMAP_INDEX.md',
  'docs/product/ROADMAP_MILESTONE_REGISTRY.md',
  'docs/product/ROADMAP_STATUS_MATRIX.md',
  'docs/product/CURRENT_STATE_AND_ROADMAP.md',
  'docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md',
  'docs/product/DECISION_LOG.md',
].map(readRepo).join('\n');
const packageJson = JSON.parse(readRepo('apps/web/package.json'));

describe('RM-36 osu! staging smoke results', () => {
  it('records RM-36 full-pass practical staging smoke evidence', () => {
    assert.equal(existsSync(repoPath('docs/product/OSU_STAGING_SMOKE_RESULTS.md')), true);
    assert.match(resultsDoc, /RM-36 osu! Staging Configuration \/ Manual Smoke Results/);
    assert.match(resultsDoc, /Result classification: full-pass practical staging smoke/);
    assert.match(resultsDoc, /Google Auth staging/);
    assert.match(resultsDoc, /Connect osu!/);
    assert.match(resultsDoc, /callback completed successfully/i);
    assert.match(resultsDoc, /Make Public/);
    assert.match(resultsDoc, /Publish \+ consent/);
    assert.match(resultsDoc, /Disconnect/);
    assert.match(resultsDoc, /public projection no longer served osu! provider\/proof/i);
  });

  it('keeps production no-go and defines the next hardening milestone', () => {
    assert.match(resultsDoc, /Production remains no-go/);
    assert.match(resultsDoc, /RM-37 Vercel Runtime Hardening \/ Trust Proxy/);
    assert.match(resultsDoc, /No production launch/);
    assert.match(resultsDoc, /No production Supabase/);
    assert.match(resultsDoc, /No production Vercel/);
  });

  it('does not document runtime-sensitive values', () => {
    assert.doesNotMatch(resultsDoc, /OSU_CLIENT_SECRET\s*=|SUPABASE_SERVICE_ROLE_KEY\s*=|access_token\s*=|refresh_token\s*=|client_secret\s*=|code=[A-Za-z0-9_-]{8,}|state=[A-Za-z0-9_-]{16,}/i);
    assert.doesNotMatch(resultsDoc, /official osu! endorsement/i);
    assert.doesNotMatch(resultsDoc, /rank, PP, score, match-history, beatmap, best-play, or live tracker surface added/i);
  });

  it('updates roadmap docs with RM-36 as this PR and RM-37 next', () => {
    assert.match(roadmapDocs, /RM-36 osu! Staging Configuration \/ Manual Smoke/);
    assert.match(roadmapDocs, /RM-37 Vercel Runtime Hardening \/ Trust Proxy/);
    assert.match(roadmapDocs, /OSU_STAGING_SMOKE_RESULTS\.md/);
  });

  it('wires the RM-36 test into web test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /osu-staging-smoke-results\.test\.js/);
    assert.match(packageJson.scripts.test, /osu-staging-smoke-results\.test\.js/);
  });
});
