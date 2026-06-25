import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const masterRoadmap = readRepo('docs/product/MASTER_PRODUCT_ROADMAP.md');
const statusMatrix = readRepo('docs/product/ROADMAP_STATUS_MATRIX.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const decisionLog = readRepo('docs/product/DECISION_LOG.md');
const packageJson = JSON.parse(readWeb('package.json'));

const combinedDocs = [
  currentRoadmap,
  masterRoadmap,
  statusMatrix,
  executionPlan,
  decisionLog,
].join('\n');

describe('roadmap reconciliation after PR10.8 and PR11.1', () => {
  it('moves current roadmap beyond the stale PR9 state', () => {
    assert.doesNotMatch(currentRoadmap, /reflects `main` after PR9/i);
    assert.doesNotMatch(currentRoadmap, /Current State After PR9/i);
    assert.match(currentRoadmap, /Current Status After PR15/);
    assert.match(currentRoadmap, /PR11\.1/);
    assert.match(currentRoadmap, /PR12/);
    assert.match(currentRoadmap, /PR13/);
    assert.match(currentRoadmap, /PR14/);
    assert.match(currentRoadmap, /PR15/);
    assert.match(currentRoadmap, /fix\(generator\): align feature generator cards/);
    assert.match(currentRoadmap, /feat\(account\): add dashboard v2 and unify saved names/);
  });

  it('distinguishes publish contracts from runtime commands and public serving', () => {
    assert.match(masterRoadmap, /Publish Policy contract/i);
    assert.match(masterRoadmap, /Publish Runtime Commands are implemented/i);
    assert.match(masterRoadmap, /Public Projection contract/i);
    assert.match(masterRoadmap, /Public Profile `\/id\/:slug` is implemented as an MVP allowlisted projection surface/i);
    assert.match(combinedDocs, /Publish Policy and Public Projection already exist as contracts/i);
  });

  it('adds the roadmap status matrix with required areas', () => {
    [
      'Publish Policy',
      'Public Projection',
      'Publish Runtime Commands',
      'Public Profile `/id/:slug`',
      'Provider Runtime Foundation',
      'Saved Names Persistence',
      'Account Dashboard V2',
    ].forEach((label) => {
      assert.match(statusMatrix, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    });
  });

  it('adds the corrected execution plan from PR11.0 to PR23', () => {
    [
      'PR11.0',
      'PR12',
      'PR13',
      'PR14',
      'PR15',
      'PR16',
      'PR17',
      'PR18',
      'PR19',
      'PR20',
      'PR21',
      'PR22',
      'PR23',
    ].forEach((label) => {
      assert.match(executionPlan, new RegExp(label.replace('.', '\\.')));
    });
  });

  it('records the favorite-first saved-name decision and account dashboard status', () => {
    assert.match(decisionLog, /Favorite\/star is the canonical saved-name UX/i);
    assert.match(decisionLog, /Account Dashboard V2 is implemented by PR11\.1/i);
    assert.match(combinedDocs, /favorite\/star is the canonical saved-name UX/i);
  });

  it('does not claim provider OAuth is live and describes public profiles as allowlisted MVP', () => {
    assert.doesNotMatch(combinedDocs, /Riot OAuth is live/i);
    assert.doesNotMatch(combinedDocs, /Discord OAuth is live/i);
    assert.doesNotMatch(combinedDocs, /\/id\/:slug[^.\n]*(exposes private|exposes owner|exposes tokens)/i);
    assert.match(combinedDocs, /\/id\/:slug[^.\n]*(MVP|allowlisted|projection)/i);
  });

  it('keeps Riot runtime gated by approval', () => {
    assert.match(combinedDocs, /Riot runtime remains gated by Riot approval/i);
    assert.doesNotMatch(combinedDocs, /Riot runtime can start before approval/i);
    assert.doesNotMatch(combinedDocs, /recommend[s]? starting Riot runtime before approval/i);
  });

  it('states saved-name persistence and next work clearly', () => {
    assert.match(combinedDocs, /Saved Names Supabase persistence is implemented/i);
    assert.match(combinedDocs, /Account Dashboard V2 is implemented/i);
    assert.match(combinedDocs, /Private Gaming Passport Editor V2 is implemented/i);
    assert.match(combinedDocs, /Publish Runtime Commands[\s\S]*(implemented|done)/i);
    assert.match(combinedDocs, /Public Profile `\/id\/:slug`[\s\S]*(implemented|done|MVP)/i);
    assert.match(combinedDocs, /PR10\.x visual\/tooling line is closed/i);
  });

  it('is wired into the project test scripts', () => {
    assert.match(packageJson.scripts['test:seo'], /roadmap-reconciliation\.test\.js/);
    assert.match(packageJson.scripts.test, /roadmap-reconciliation\.test\.js/);
  });
});
