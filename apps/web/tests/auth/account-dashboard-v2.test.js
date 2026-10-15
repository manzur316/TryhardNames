import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { getAccountPassportSummary } from '../../src/gaming-passport/data/accountSummary.js';
import { isPrivateOsuPersistenceEnabled } from '../../src/gaming-passport/data/privateOsuPersistence.js';

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
  it('keeps /account protected with one entry to the Passport workspace', () => {
    assert.match(accountPageSource, /<Navigate to="\/sign-in\?returnTo=%2Faccount" replace \/>/);
    assert.match(accountPageSource, /Your account/);
    assert.match(accountPageSource, /Private account/);
    assert.match(accountPageSource, /Sign-in & session/);
    assert.match(accountPageSource, /to="\/gaming-passport"/);
    assert.match(accountPageSource, /Open Gaming Passport/);
    assert.match(accountPageSource, /Saved Names/);
    assert.doesNotMatch(accountPageSource, /Account Hunting Guide|Future Connections|QuickActions|PrivatePassportEditor|PassportPublishControls|ProviderRuntimeFoundationPanel|OsuProviderLinkingCard/);
  });

  it('sources saved names from the unified favorite model', () => {
    assert.match(accountPageSource, /FavoritesContext/);
    assert.match(accountPageSource, /favoritesContext\?\.favorites/);
    assert.match(accountPageSource, /favoritesContext\?\.removeFavorite/);
    assert.match(accountPageSource, /No saved names yet\./);
    assert.match(accountPageSource, /Saved locally on this device/);
    assert.match(favoriteStarSource, /FavoritesContext/);
    assert.match(favoriteStarSource, /tryhardnames:favorites:v1|writeUnifiedFavoriteNames/);
  });

  it('creates only a private draft without deriving an alias from Parent Auth', () => {
    assert.match(accountPageSource, /getOrCreatePrivateDraft\(client, sessionRef\.current\)/);
    assert.doesNotMatch(accountPageSource, /\.rpc\(|publication_consent|claimPassportSlug|publishPassport|email\.split|user_metadata/);
    assert.doesNotMatch(accountPageSource, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(accountPageSource, /Riot OAuth is live|Discord OAuth is live/i);
  });

  it('keys account state to the owner, not token refresh, and retains failed sign-out feedback', () => {
    assert.match(accountPageSource, /AccountWorkspace key=\{auth\.user\.id\}/);
    assert.match(accountPageSource, /\[ownerId, auth\.isConfigured, retry\]/);
    assert.match(accountPageSource, /if \(!result\?\.ok && mounted\.current\)/);
    assert.match(accountPageSource, /Your session is still active/);
    assert.doesNotMatch(accountPageSource, /setUser\(|setSession\(|console\.(log|error|warn)/);
    assert.match(accountPageSource, /noIndex skipCanonical/);
  });

  it('summarizes the actual Passport without transferring Parent Auth or private metadata', () => {
    assert.equal(getAccountPassportSummary(null), null);
    const summary = getAccountPassportSummary({ alias: '  Player  ', status: 'draft_private', updatedAt: '2026-10-14T12:00:00Z', ownerId: 'private', email: 'test@example.test', metadata: { hidden: true } });
    assert.deepEqual(summary, { alias: 'Player', status: 'Private draft / Not published', updatedAt: '2026-10-14T12:00:00Z' });
  });

  it('does not label published, suspended, or unknown states as private drafts', () => {
    for (const [status, label] of [['published', 'Published'], ['unpublished', 'Unpublished'], ['suspended', 'Suspended'], ['unknown', 'Status unavailable'], ['toString', 'Status unavailable']]) {
      assert.equal(getAccountPassportSummary({ status }).status, label);
    }
    assert.deepEqual(getAccountPassportSummary({ alias: 123, updatedAt: 'invalid' }), { alias: 'Your Gaming Passport', status: 'Status unavailable', updatedAt: null });
  });

  it('shows persistent osu! on the normal local workspace, never production or remote origins', () => {
    const local = { origin: 'http://localhost:3000', search: '' };
    assert.equal(isPrivateOsuPersistenceEnabled(true, local), true);
    assert.equal(isPrivateOsuPersistenceEnabled(true, { ...local, search: '?osuPersist=1' }), true);
    assert.equal(isPrivateOsuPersistenceEnabled(true, { ...local, search: '?osuProbe=1' }), false);
    assert.equal(isPrivateOsuPersistenceEnabled(false, local), false);
    assert.equal(isPrivateOsuPersistenceEnabled(true, { ...local, origin: 'https://example.test' }), false);
    assert.equal(isPrivateOsuPersistenceEnabled(true, { ...local, origin: 'http://127.0.0.1:3000' }), false);
    assert.equal(isPrivateOsuPersistenceEnabled(true, null), false);
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
