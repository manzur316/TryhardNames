import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const appSource = readWeb('src/App.jsx');
const dynamicPageSource = readWeb('src/pages/DynamicPage.jsx');
const seoTemplateSource = readWeb('src/components/SeoTemplate.jsx');
const copyButtonSource = readWeb('src/components/CopyButton.jsx');
const roadmapDoc = readRepo('docs/product/CURRENT_STATE_AND_ROADMAP.md');

describe('dynamic generator UX priority pass', () => {
  it('keeps DynamicPage flow and dynamic routing unchanged', () => {
    assert.match(appSource, /path="\/:category\/:keyword"/);
    assert.match(dynamicPageSource, /import SeoTemplate/);
    assert.match(dynamicPageSource, /return <SeoTemplate pageData=\{pageData\} \/>/);
    assert.doesNotMatch(dynamicPageSource, /HomePage|IdentityKitPage|GamingPassportPage/);
  });

  it('puts the generated names tool before long editorial content and internal links', () => {
    const toolMarker = seoTemplateSource.indexOf('Tool-first generated names surface');
    const namesGrid = seoTemplateSource.indexOf('id="names"');
    const lineupState = seoTemplateSource.indexOf('Lineup state follows the tool');
    const editorialMarker = seoTemplateSource.indexOf('Editorial SEO content remains indexable below the utility surface');
    const internalLinks = seoTemplateSource.indexOf('<InternalLinkGrid');

    assert.ok(toolMarker > -1);
    assert.ok(namesGrid > toolMarker);
    assert.ok(lineupState > namesGrid);
    assert.ok(editorialMarker > lineupState);
    assert.ok(internalLinks > editorialMarker);
  });

  it('visually orders copy-ready names before refinements inside the tool', () => {
    assert.match(seoTemplateSource, /id="names"[\s\S]*order-1 grid/);
    assert.match(seoTemplateSource, /order-3 mt-6 flex flex-col/);
    assert.match(seoTemplateSource, /order-2 mt-5 flex justify-center/);
  });

  it('renders an empty lineup state and prevents empty pack actions from looking active', () => {
    assert.match(seoTemplateSource, /Save a name to build a pack\./);
    assert.match(seoTemplateSource, /Save a name first\./);
    assert.match(seoTemplateSource, /aria-describedby="empty-lineup-message"/);
    assert.match(seoTemplateSource, /disabled[\s\S]*Copy pack/);
    assert.match(seoTemplateSource, /disabled[\s\S]*Export Discord Pack/);
    assert.match(seoTemplateSource, /hasSavedFavorites && \([\s\S]*Clear all/);
  });

  it('guards Copy Pack and Discord export when no favorites exist', () => {
    assert.match(seoTemplateSource, /const copySharePack = async \(\) => \{[\s\S]*if \(!favorites\.size\) \{[\s\S]*showLineupBlockedFeedback\(\)/);
    assert.match(seoTemplateSource, /const exportDiscordPack = async \(\) => \{[\s\S]*if \(!favorites\.size\) \{[\s\S]*showLineupBlockedFeedback\(\)/);
    assert.match(seoTemplateSource, /const buildLineupPack = \(\) => \{[\s\S]*TryhardNames lineup[\s\S]*Category: \$\{category\}\/\$\{keyword\}[\s\S]*URL: \$\{pageUrl\}[\s\S]*Favorites: \$\{fav\.length\}/);
    assert.doesNotMatch(seoTemplateSource, /body \|\| 'GhostVCT'/);
  });

  it('keeps Copy Name, Save, and reroll/refinement controls available', () => {
    assert.match(copyButtonSource, /Copy Name/);
    assert.match(seoTemplateSource, /laneUi\.saveLabel \|\| 'Save'/);
    assert.match(seoTemplateSource, /Another mix/);
    assert.match(seoTemplateSource, /Adjacent styles/);
    assert.match(seoTemplateSource, /Cleaner read/);
  });

  it('keeps Similar Reads de-emphasized relative to Copy Name and Save', () => {
    assert.match(seoTemplateSource, /const smallGhostButtonClass =[\s\S]*text-\[10px\][\s\S]*bg-transparent/);
    const cardCopy = seoTemplateSource.indexOf("source: 'card_copy_button'");
    const save = seoTemplateSource.indexOf("laneUi.saveLabel || 'Save'", cardCopy);
    const similar = seoTemplateSource.indexOf("laneUi.evolveLabel || 'Similar reads'", save);
    assert.ok(cardCopy > -1);
    assert.ok(save > cardCopy);
    assert.ok(similar > save);
    assert.match(seoTemplateSource, /Use .Similar reads. to start building recents\./);
    assert.doesNotMatch(seoTemplateSource, /Use .More like this. to start building recents\./);
  });

  it('adds reroll guardrails for noisy generated variants', () => {
    assert.match(seoTemplateSource, /function normalizeRerolledNameCandidate/);
    assert.match(seoTemplateSource, /function dedupeAdjacentTokens/);
    assert.match(seoTemplateSource, /function isNoisyRerollCandidate/);
    assert.match(seoTemplateSource, /const REROLL_STRONG_TOKENS = \[[^\]]*'VCT'/);
    assert.match(seoTemplateSource, /countStrongToken\(compact, token\) > 1/);
    assert.match(seoTemplateSource, /tokens\.length > 4/);
    assert.match(seoTemplateSource, /sanitizeRerollCandidates\(evolveContextualName/);
    assert.doesNotMatch(seoTemplateSource, /return \['GhostVCT'\]/);
    assert.doesNotMatch(seoTemplateSource, /fallback.*GhostVCT/i);
    assert.match(seoTemplateSource, /fallbackName = 'TryhardTag'|initialNames\[0\]|baseName/);
    assert.match(seoTemplateSource, /const neutral = normalizeRerolledNameCandidate\(fallbackName\);[\s\S]*return neutral \? \[neutral\] : \[\];/);
  });

  it('does not add provider auth/runtime copy', () => {
    assert.doesNotMatch(seoTemplateSource, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(seoTemplateSource, /Riot OAuth is live\b/i);
    assert.doesNotMatch(seoTemplateSource, /Discord OAuth is live\b/i);
    assert.doesNotMatch(seoTemplateSource, /production Riot key exists\b/i);
    assert.match(roadmapDoc, /No Riot OAuth button exists/);
  });
});
