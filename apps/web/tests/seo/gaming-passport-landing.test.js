import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const pageSource = read('src/pages/GamingPassportPage.jsx');
const appSource = read('src/App.jsx');
const navigationSource = read('src/core/components/Navigation.jsx');
const routeCatalogSource = read('src/core/routing/routeCatalog.js');
const signInSource = read('src/pages/auth/SignInPage.jsx');

describe('Gaming Passport Riot review landing', () => {
  it('registers /gaming-passport as a public app route', () => {
    assert.match(appSource, /path="\/gaming-passport"/);
    assert.match(routeCatalogSource, /'\/gaming-passport'/);
  });

  it('exposes Gaming Passport in primary navigation', () => {
    assert.match(navigationSource, /to="\/gaming-passport"/);
    assert.match(navigationSource, /Gaming Passport/);
  });

  it('contains Riot review copy without claiming live Riot OAuth or rankings', () => {
    assert.match(pageSource, /Pending Riot approval/);
    assert.match(pageSource, /Riot Sign On/);
    assert.match(pageSource, /No custom MMR/);
    assert.match(pageSource, /No ELO calculator/);
    assert.match(pageSource, /No alternative ranking system/);
    assert.match(pageSource, /No hidden player data/);
    assert.match(pageSource, /does\s+not claim Riot OAuth\s+is live today/);
    assert.match(pageSource, /does not claim a\s+production Riot key/);
  });

  it('keeps Parent Auth and future linked providers separate', () => {
    assert.match(pageSource, /Parent Auth/);
    assert.match(pageSource, /Riot and Discord will be linked accounts after sign-in/);
    assert.match(pageSource, /LeagueOfLegendsAdapter/);
  });

  it('renders the Riot legal notice visibly in page source', () => {
    assert.match(pageSource, /Riot Games notice/);
    assert.match(pageSource, /TryhardNames Gaming Passport is not endorsed by Riot Games/);
  });

  it('keeps Google Parent Auth free of gaming provider login copy', () => {
    assert.match(signInSource, /Continue with Google/);
    assert.doesNotMatch(signInSource, /Continue with Riot/);
    assert.doesNotMatch(signInSource, /Continue with Discord/);
  });
});
