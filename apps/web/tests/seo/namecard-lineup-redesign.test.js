import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const seoTemplateSource = readWeb('src/components/SeoTemplate.jsx');
const copyButtonSource = readWeb('src/components/CopyButton.jsx');
const favoriteStarSource = readWeb('src/components/FavoriteStarButton.jsx');
const cssSource = readWeb('src/index.css');
const dynamicPageSource = readWeb('src/pages/DynamicPage.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const auditDoc = readRepo('docs/product/TOOL_CONTAINER_VISUAL_AUDIT.md');

describe('name card visual hierarchy and favorite-first saved names', () => {
  it('clamps name card titles visually while preserving the complete name', () => {
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*-webkit-line-clamp:\s*2/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*word-break:\s*normal/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*overflow-wrap:\s*normal/);
    assert.match(cssSource, /\.th-name-card-title\s*\{[\s\S]*hyphens:\s*none/);
    assert.match(seoTemplateSource, /className=\{`th-name-card-title/);
    assert.match(seoTemplateSource, /title=\{s\}/);
  });

  it('keeps Copy Name primary and makes favorite star and Similar Reads less dominant', () => {
    assert.match(copyButtonSource, /variant = 'default'/);
    assert.match(copyButtonSource, /variant === 'card'/);
    assert.match(copyButtonSource, /variant === 'drawer'/);
    assert.match(copyButtonSource, /Copy Name/);
    assert.match(seoTemplateSource, /source: 'card_copy_button'[\s\S]*variant="card"/);
    assert.match(seoTemplateSource, /onCopied=\{pushRecentName\}/);
    assert.match(seoTemplateSource, /<FavoriteStarButton[\s\S]*source="dynamic_name_card"/);
    assert.match(favoriteStarSource, /readUnifiedFavoriteNames/);
    assert.match(favoriteStarSource, /writeUnifiedFavoriteNames/);
    assert.match(favoriteStarSource, /aria-label=\{saved \? `Unfavorite/);
    assert.match(cssSource, /\.th-name-card-tertiary/);
    assert.match(seoTemplateSource, /const smallGhostButtonClass = 'th-name-card-tertiary'/);
    assert.match(seoTemplateSource, /laneUi\.evolveLabel \|\| 'Similar reads'/);
  });

  it('keeps Similar Reads inline and removes the legacy lineup drawer', () => {
    assert.match(seoTemplateSource, /activeEvolution && \(/);
    assert.match(seoTemplateSource, /aria-label="Similar reads"/);
    assert.match(seoTemplateSource, /source="similar_reads_variant"/);
    assert.doesNotMatch(seoTemplateSource, /drawerOpen/);
    assert.doesNotMatch(seoTemplateSource, /th-lineup-drawer-scroll/);
    assert.doesNotMatch(cssSource, /\.th-lineup-drawer-scroll/);
    assert.doesNotMatch(seoTemplateSource, /Copy pack|Export Discord Pack|Recent picks|Lineup/);
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
