import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const appSource = readWeb('src/App.jsx');
const gamerLayoutSource = readWeb('src/features/gamerNames/components/GamerNamesLayout.jsx');
const robloxLayoutSource = readWeb('src/features/robloxNames/components/RobloxNamesLayout.jsx');
const namesGridSource = readWeb('src/core/components/NamesGrid.jsx');
const trendingNamesSource = readWeb('src/core/components/TrendingNames.jsx');
const copyButtonSource = readWeb('src/core/components/CopyButton.jsx');
const widgetSource = readWeb('src/features/nameGenerators/components/NameGeneratorWidget.jsx');
const cssSource = readWeb('src/index.css');
const packageJson = JSON.parse(readWeb('package.json'));
const docSource = readRepo('docs/product/FEATURE_GENERATOR_CARD_VISUAL_ALIGNMENT.md');

describe('feature generator card visual alignment', () => {
  it('scopes GamerNames and RobloxNames layouts to the feature generator shell', () => {
    assert.match(gamerLayoutSource, /th-feature-generator-shell/);
    assert.match(robloxLayoutSource, /th-feature-generator-shell/);
    assert.match(cssSource, /\.th-feature-generator-shell article > section/);
  });

  it('uses clamped title treatment and preserves full generated values', () => {
    assert.match(cssSource, /\.th-feature-name-card/);
    assert.match(cssSource, /\.th-feature-name-title/);
    assert.match(cssSource, /\.th-feature-card-actions/);
    assert.match(namesGridSource, /className="th-name-card-title th-feature-name-title"/);
    assert.match(trendingNamesSource, /className="th-name-card-title th-feature-name-title"/);
    assert.match(namesGridSource, /title=\{name\}/);
    assert.match(trendingNamesSource, /title=\{name\}/);
    assert.match(namesGridSource, /id=\{gridId\}/);
    assert.match(widgetSource, /gridId="names"/);
  });

  it('keeps Copy Name present and uses compact card copy actions', () => {
    assert.match(copyButtonSource, /variant === 'card'/);
    assert.match(copyButtonSource, /Copy Name/);
    assert.match(namesGridSource, /<CopyButton[\s\S]*variant="card"/);
    assert.match(trendingNamesSource, /<CopyButton[\s\S]*variant="card"/);
    assert.match(widgetSource, /<NamesGrid/);
  });

  it('keeps feature generator routes wired without route changes', () => {
    assert.match(appSource, /path="\/gamer-names\/cool"/);
    assert.match(appSource, /path="\/gamer-names\/pro"/);
    assert.match(appSource, /path="\/roblox-names\/cool"/);
    assert.match(appSource, /path="\/roblox-names\/tryhard"/);
    assert.doesNotMatch(appSource, /SeoTemplate pageData=\{pageData\}[\s\S]*gamer-names/);
  });

  it('does not introduce provider auth or service runtime copy', () => {
    const combined = [
      gamerLayoutSource,
      robloxLayoutSource,
      namesGridSource,
      trendingNamesSource,
      copyButtonSource,
      widgetSource,
    ].join('\n');
    assert.doesNotMatch(combined, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(combined, /Riot OAuth is live|Discord OAuth is live|production Riot key/i);
    assert.doesNotMatch(combined, /Supabase|Vercel|Google Cloud|RLS|migration|secret/i);
  });

  it('is documented and included in SEO tests', () => {
    assert.match(docSource, /# Feature Generator Card Visual Alignment/);
    assert.match(docSource, /PR10\.8/);
    assert.match(docSource, /Worst status \| PASS/);
    assert.match(packageJson.scripts['test:seo'], /feature-generator-card-alignment\.test\.js/);
    assert.match(packageJson.scripts.test, /feature-generator-card-alignment\.test\.js/);
  });
});
