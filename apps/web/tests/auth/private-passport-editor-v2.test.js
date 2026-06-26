import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const editorSource = readWeb('src/gaming-passport/components/PrivatePassportEditor.jsx');
const previewSource = readWeb('src/gaming-passport/components/PrivatePassportPreview.jsx');
const checklistSource = readWeb('src/gaming-passport/components/PassportCompletionChecklist.jsx');
const pickerSource = readWeb('src/gaming-passport/components/SavedNameHighlightsPicker.jsx');
const repositorySource = readWeb('src/gaming-passport/data/passportRepository.js');
const appSource = readWeb('src/App.jsx');
const currentRoadmap = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');
const executionPlan = readRepo('docs/product/PRODUCT_EXECUTION_PLAN_AFTER_PR10.md');
const packageJson = JSON.parse(readWeb('package.json'));

const combinedEditorSource = [
  accountPageSource,
  editorSource,
  previewSource,
  checklistSource,
  pickerSource,
  repositorySource,
].join('\n');

describe('Private Gaming Passport Editor V2', () => {
  it('extracts the private editor into focused Gaming Passport components', () => {
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PrivatePassportEditor.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PrivatePassportPreview.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PassportCompletionChecklist.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/SavedNameHighlightsPicker.jsx', import.meta.url)), true);
    assert.match(accountPageSource, /PrivatePassportEditor/);
    assert.match(editorSource, /Private editor V2/);
    assert.match(previewSource, /Private preview/);
    assert.match(checklistSource, /Private completion checklist/);
    assert.match(pickerSource, /Private Saved Names highlights/);
  });

  it('keeps the editor private with clear validation and save states', () => {
    assert.match(editorSource, /Loading draft/);
    assert.match(editorSource, /Unsaved changes/);
    assert.match(editorSource, /Saving/);
    assert.match(editorSource, /Saved/);
    assert.match(editorSource, /Validation blocked/);
    assert.match(editorSource, /Fix validation issues before saving this private draft/);
    assert.match(editorSource, /Save private draft/);
    assert.match(previewSource, /Not published/);
    assert.match(previewSource, /does not publish automatically/);
  });

  it('stores optional Saved Names highlights only inside safe scene_config', () => {
    assert.match(repositorySource, /featuredSavedNames/);
    assert.match(repositorySource, /MAX_FEATURED_SAVED_NAMES = 5/);
    assert.match(repositorySource, /export function sanitizeFeaturedSavedNames/);
    assert.match(pickerSource, /scene_config\.featuredSavedNames/);
    assert.match(pickerSource, /does not publish, verify, or mutate Saved Names/);
    assert.doesNotMatch(pickerSource, /upsertSavedName|deleteSavedName|from\('saved_names'\)/);
  });

  it('keeps completion guidance private and publish locked for later', () => {
    assert.match(checklistSource, /Alias added/);
    assert.match(checklistSource, /Short bio added/);
    assert.match(checklistSource, /Visual style selected/);
    assert.match(checklistSource, /Saved Names highlights selected/);
    assert.match(checklistSource, /Draft saved/);
    assert.match(checklistSource, /Public profile requires publish policy/);
  });

  it('does not add provider runtime surfaces', () => {
    assert.match(appSource, /path="\/id\/:slug"/);
    assert.doesNotMatch(combinedEditorSource, /Riot OAuth is live|Discord OAuth is live|Continue with Riot|Continue with Discord/i);
    assert.doesNotMatch(combinedEditorSource, /provider_token|providerToken|accessToken|refreshToken|clientSecret|rawPayload/i);
  });

  it('updates roadmap docs and is wired into auth tests', () => {
    assert.match(currentRoadmap, /Current Status After PR17/);
    assert.match(currentRoadmap, /Private Gaming Passport Editor V2 exists/);
    assert.match(executionPlan, /PR13 Private Gaming Passport Editor V2[\s\S]*Implemented by PR13/);
    assert.match(executionPlan, /PR14 Publish Runtime Commands[\s\S]*Implemented by PR14/);
    assert.match(executionPlan, /PR15 Public Gaming Passport MVP `\/id\/:slug`[\s\S]*Implemented by PR15/);
    assert.match(executionPlan, /PR16 Provider Runtime Foundation[\s\S]*Implemented by PR16/);
    assert.match(packageJson.scripts['test:auth'], /private-passport-editor-v2\.test\.js/);
  });
});
