import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const seoTemplateSource = readWeb('src/components/SeoTemplate.jsx');
const namesGridSource = readWeb('src/core/components/NamesGrid.jsx');
const trendingNamesSource = readWeb('src/core/components/TrendingNames.jsx');
const favoriteStarSource = readWeb('src/components/FavoriteStarButton.jsx');
const appSource = readWeb('src/App.jsx');
const packageJson = JSON.parse(readWeb('package.json'));
const accountDocSource = readRepo('docs/product/ACCOUNT_DASHBOARD_V2_AND_SAVED_NAMES.md');

describe('Account Dashboard V2 and favorite-first saved names', () => {
  it('keeps /account protected and renders the V2 dashboard sections', () => {
    assert.match(accountPageSource, /<Navigate to="\/sign-in\?returnTo=%2Faccount" replace \/>/);
    assert.match(accountPageSource, /Your TryhardNames account/);
    assert.match(accountPageSource, /Account Dashboard V2/);
    assert.match(accountPageSource, /Saved Names/);
    assert.match(accountPageSource, /Gaming Passport Draft/);
    assert.match(accountPageSource, /Account Hunting Guide/);
    assert.match(accountPageSource, /Future Connections/);
  });

  it('sources saved names from the unified favorite model', () => {
    assert.match(accountPageSource, /FavoritesContext/);
    assert.match(accountPageSource, /favoritesContext\?\.favorites/);
    assert.match(accountPageSource, /favoritesContext\?\.removeFavorite/);
    assert.match(accountPageSource, /Star names while browsing to keep them here\./);
    assert.match(favoriteStarSource, /FavoritesContext/);
    assert.match(favoriteStarSource, /tryhardnames:favorites:v1|writeUnifiedFavoriteNames/);
  });

  it('keeps Gaming Passport private and planned-provider copy accurate', () => {
    assert.match(accountPageSource, /private draft by default/i);
    assert.match(accountPageSource, /Nothing publishes automatically/i);
    assert.match(accountPageSource, /Google Auth is Parent Auth/);
    assert.match(accountPageSource, /Riot and Discord are future linked providers, not live account integrations/);
    assert.match(accountPageSource, /No Riot OAuth or Discord OAuth button is exposed/);
    assert.doesNotMatch(accountPageSource, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(accountPageSource, /Riot OAuth is live|Discord OAuth is live/i);
  });

  it('keeps public generator copy actions and switches save UI to favorites', () => {
    assert.match(seoTemplateSource, /CopyButton[\s\S]*source: 'card_copy_button'/);
    assert.match(seoTemplateSource, /<FavoriteStarButton[\s\S]*source="dynamic_name_card"/);
    assert.match(namesGridSource, /<CopyButton[\s\S]*variant="card"/);
    assert.match(namesGridSource, /<FavoriteStarButton[\s\S]*source="feature_name_card"/);
    assert.match(trendingNamesSource, /<FavoriteStarButton[\s\S]*source="feature_trending_card"/);
  });

  it('removes the old lineup and pack UX from affected public tool surfaces', () => {
    assert.doesNotMatch(seoTemplateSource, /Lineup/);
    assert.doesNotMatch(seoTemplateSource, /Copy pack/);
    assert.doesNotMatch(seoTemplateSource, /Export Discord Pack/);
    assert.doesNotMatch(seoTemplateSource, /Recent picks/);
    assert.doesNotMatch(seoTemplateSource, /Save a name to build a pack\./);
  });

  it('keeps routes and provider runtime untouched by the dashboard test contract', () => {
    assert.match(appSource, /path="\/account"/);
    assert.match(appSource, /path="\/gaming-passport"/);
    assert.match(appSource, /path="\/gamer-names\/pro"/);
    assert.match(appSource, /path="\/roblox-names\/cool"/);
    assert.doesNotMatch(`${seoTemplateSource}\n${namesGridSource}\n${trendingNamesSource}`, /Supabase|Vercel|Google Cloud|RLS|migration|secret/i);
    assert.match(packageJson.scripts['test:auth'], /account-dashboard-v2\.test\.js/);
  });

  it('documents the PR11 saved names decision', () => {
    assert.match(accountDocSource, /# Account Dashboard V2 and Saved Names/);
    assert.match(accountDocSource, /favorite-first saved names model/i);
    assert.match(accountDocSource, /legacy save\/lineup UX/i);
  });
});
