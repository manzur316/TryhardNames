import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const seoTemplateSource = readWeb('src/components/SeoTemplate.jsx');
const copyButtonSource = readWeb('src/components/CopyButton.jsx');
const cssSource = readWeb('src/index.css');
const dynamicPageSource = readWeb('src/pages/DynamicPage.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const auditDoc = readRepo('docs/product/TOOL_CONTAINER_VISUAL_AUDIT.md');

describe('name card and lineup visual redesign', () => {
  it('clamps name card titles visually while preserving the complete name', () => {
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*-webkit-line-clamp:\s*2/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*word-break:\s*normal/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*overflow-wrap:\s*normal/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*hyphens:\s*none/);
    assert.match(seoTemplateSource, /className=\{`th-name-card-title/);
    assert.match(seoTemplateSource, /title=\{s\}/);
  });

  it('keeps Copy Name primary and makes Save and Similar Reads less dominant', () => {
    assert.match(copyButtonSource, /variant = 'default'/);
    assert.match(copyButtonSource, /variant === 'card'/);
    assert.match(copyButtonSource, /variant === 'drawer'/);
    assert.match(copyButtonSource, /Copy Name/);
    assert.match(seoTemplateSource, /source: 'card_copy_button'[\s\S]*variant="card"/);
    assert.match(seoTemplateSource, /onCopied=\{pushRecentName\}/);
    assert.match(seoTemplateSource, /laneUi\.saveLabel \|\| 'Save'/);
    assert.match(cssSource, /\.th-name-card-tertiary/);
    assert.match(seoTemplateSource, /const smallGhostButtonClass = 'th-name-card-tertiary'/);
    assert.match(seoTemplateSource, /laneUi\.evolveLabel \|\| 'Similar reads'/);
  });

  it('bounds the lineup shelf and uses internal drawer scrolling', () => {
    assert.match(seoTemplateSource, /drawerOpen \|\| activeEvolution \? 'max-h-\[60vh\] md:max-h-\[55vh\]'/);
    assert.match(seoTemplateSource, /'max-h-\[18vh\] md:max-h-\[14vh\]'/);
    assert.match(seoTemplateSource, /drawerOpen \? 'max-h-\[calc\(60vh-52px\)\] md:max-h-\[calc\(55vh-52px\)\] opacity-100'/);
    assert.match(seoTemplateSource, /th-lineup-drawer-scroll[\s\S]*overflow-y-auto/);
    assert.match(cssSource, /\.th-lineup-drawer-scroll/);
  });

  it('keeps lineup empty and saved states guarded', () => {
    assert.match(seoTemplateSource, /Save a name to build a pack\./);
    assert.match(seoTemplateSource, /hasSavedFavorites && \([\s\S]*Clear all/);
    assert.match(seoTemplateSource, /if \(!favorites\.size\) \{[\s\S]*showLineupBlockedFeedback\(\)/);
    assert.match(seoTemplateSource, /disabled[\s\S]*Copy pack/);
    assert.match(seoTemplateSource, /disabled[\s\S]*Export Discord Pack/);
  });

  it('does not change DynamicPage routing or provider runtime surfaces', () => {
    assert.match(dynamicPageSource, /return <SeoTemplate pageData=\{pageData\} \/>/);
    assert.doesNotMatch(dynamicPageSource, /HomePage|IdentityKitPage|GamingPassportPage/);
    assert.doesNotMatch(`${seoTemplateSource}\n${copyButtonSource}`, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(`${seoTemplateSource}\n${copyButtonSource}`, /Riot OAuth is live|Discord OAuth is live|production Riot key/i);
    assert.doesNotMatch(`${seoTemplateSource}\n${copyButtonSource}`, /Supabase|Vercel|Google Cloud|RLS|migration/i);
  });

  it('is wired into the SEO regression suite and documented as the PR10.7 follow-up', () => {
    assert.match(packageJson.scripts['test:seo'], /namecard-lineup-redesign\.test\.js/);
    assert.match(packageJson.scripts.test, /namecard-lineup-redesign\.test\.js/);
    assert.match(auditDoc, /PR10\.7 Redesign Follow-up/);
  });
});
