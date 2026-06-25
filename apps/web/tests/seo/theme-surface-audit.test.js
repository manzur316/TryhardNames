import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const auditUrl = new URL('../../../../docs/product/THEME_SURFACE_ROUTE_AUDIT.md', import.meta.url);
const audit = readRepo('docs/product/THEME_SURFACE_ROUTE_AUDIT.md');
const themeAudit = readRepo('docs/product/THEME_AUDIT.md');
const themeContract = readRepo('docs/product/UI_THEME_SURFACE_CONTRACT.md');
const auditDocs = [audit, themeAudit, themeContract].join('\n');

describe('theme surface route audit', () => {
  it('keeps the route audit document present and covering required routes', () => {
    assert.equal(existsSync(auditUrl), true);

    for (const route of [
      '/roblox-names',
      '/roblox-names/cool',
      '/gamer-names',
      '/gamer-names/cool',
      '/general/best',
      '/general/cool',
      '/gaming-passport',
      '/identity-kit',
    ]) {
      assert.match(audit, new RegExp(route.replaceAll('/', '\\/')));
    }
  });

  it('uses the route audit status vocabulary', () => {
    assert.match(audit, /WORKS/);
    assert.match(audit, /PARTIAL/);
    assert.match(audit, /BROKEN/);
    assert.match(audit, /NOT_VISUALLY_TESTED/);
  });

  it('identifies source templates instead of treating every URL as unique', () => {
    assert.match(audit, /DynamicPage/);
    assert.match(audit, /SeoTemplate/);
    assert.match(audit, /RobloxNamesLayout/);
    assert.match(audit, /GamerNamesLayout/);
    assert.match(audit, /InternalLinkGrid/);
  });

  it('defines PR10.4 as the shared template implementation follow-up', () => {
    assert.match(audit, /PR10\.4/);
    assert.match(audit, /fix shared generator\/dynamic templates, not individual URLs one by one/);
    assert.match(themeAudit, /PR10\.3 Route Audit Follow-up/);
    assert.match(themeAudit, /PR10\.4 should fix shared templates, not individual URLs one by one/);
  });

  it('extends the theme contract for generator and dynamic route templates', () => {
    assert.match(themeContract, /Generator and programmatic route templates must be theme-aware/);
    assert.match(themeContract, /Dynamic route pages must not use dark-only root shells/);
    assert.match(themeContract, /\| `\/:category\/:keyword` \| Must be theme-aware/);
  });

  it('does not overclaim that every route is already fixed', () => {
    assert.match(audit, /This audit is not a completion claim\./);
    assert.doesNotMatch(auditDocs, /all routes (are|have been) (fixed|repaired|aligned)/i);
  });

  it('does not claim Riot runtime capabilities are live', () => {
    assert.doesNotMatch(auditDocs, /Riot OAuth is live\b/i);
    assert.doesNotMatch(auditDocs, /real Riot data is live\b/i);
    assert.doesNotMatch(auditDocs, /production Riot key exists\b/i);
  });
});
