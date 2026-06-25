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
    assert.match(pageSource, /No OP\.GG alternative/);
    assert.match(pageSource, /No in-game recommendations/);
    assert.match(pageSource, /No alternative ranking system/);
    assert.match(pageSource, /No hidden player data/);
    assert.match(pageSource, /does\s+not claim Riot account linking\s+is live today/);
    assert.match(pageSource, /does not claim a\s+production Riot key/);
    assert.doesNotMatch(pageSource, /Riot OAuth is live in production/i);
    assert.doesNotMatch(pageSource, /Riot OAuth is now live/i);
    assert.doesNotMatch(pageSource, /production Riot key exists\b/i);
    assert.doesNotMatch(pageSource, /real Riot data is live\b/i);
  });

  it('uses a theme-aware page surface instead of a dark-only root', () => {
    assert.doesNotMatch(pageSource, /min-h-screen bg-slate-950 text-slate-100/);
    assert.match(pageSource, /bg-slate-50/);
    assert.match(pageSource, /dark:bg-slate-950/);
    assert.match(pageSource, /text-slate-950 dark:text-white/);
    assert.match(pageSource, /border-slate-200\/80 bg-white\/80/);
    assert.match(pageSource, /dark:border-white\/10 dark:bg-white\/\[0\.035\]/);
    assert.match(pageSource, /border-slate-300[\s\S]*bg-white[\s\S]*text-slate-700/);
    assert.match(pageSource, /dark:border-white\/15 dark:bg-white\/\[0\.04\] dark:text-slate-100/);
  });

  it('keeps light-mode accent icons legible with pastel chips', () => {
    assert.match(pageSource, /bg-cyan-50/);
    assert.match(pageSource, /dark:bg-cyan-300\/10/);
    assert.match(pageSource, /bg-emerald-50/);
    assert.match(pageSource, /dark:bg-emerald-300\/10/);
    assert.match(pageSource, /bg-violet-50/);
    assert.match(pageSource, /dark:bg-violet-300\/10/);
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

  it('does not import Riot-owned visual assets or logos', () => {
    assert.doesNotMatch(pageSource, /RiotLogo|riot-logo|riotLogo/);
    assert.doesNotMatch(pageSource, /riot[^'"]*\.(png|svg|webp|jpg|jpeg)/i);
  });

  it('keeps Google Parent Auth free of gaming provider login copy', () => {
    assert.match(signInSource, /Continue with Google/);
    assert.doesNotMatch(signInSource, /Continue with Riot/);
    assert.doesNotMatch(signInSource, /Continue with Discord/);
  });
});
