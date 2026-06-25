import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const appSource = readWeb('src/App.jsx');
const dynamicPageSource = readWeb('src/pages/DynamicPage.jsx');
const seoTemplateSource = readWeb('src/components/SeoTemplate.jsx');
const internalLinkGridSource = readWeb('src/components/editorial/InternalLinkGrid.jsx');
const indexCss = readWeb('src/index.css');
const auditDoc = readRepo('docs/product/THEME_SURFACE_ROUTE_AUDIT.md');

describe('dynamic generator theme surface', () => {
  it('keeps dynamic routes wired through DynamicPage and SeoTemplate', () => {
    assert.match(appSource, /path="\/:category\/:keyword"/);
    assert.match(dynamicPageSource, /import SeoTemplate/);
    assert.match(dynamicPageSource, /return <SeoTemplate pageData=\{pageData\} \/>/);
  });

  it('uses a theme-aware atmosphere shell instead of a dark-only root', () => {
    assert.doesNotMatch(seoTemplateSource, /th-atmosphere-shell text-dark-300/);
    assert.match(seoTemplateSource, /th-atmosphere-shell text-slate-700 dark:text-dark-300/);
    assert.match(indexCss, /\.th-atmosphere-shell\s*\{[\s\S]*background-color:\s*hsl\(210 40% 98%\)/);
    assert.match(indexCss, /\.dark \.th-atmosphere-shell\s*\{[\s\S]*background-color:\s*#020617/);
    assert.match(indexCss, /\.dark \.th-atmosphere-shell::before/);
  });

  it('pairs dynamic template headings, body text, cards, chips, and controls', () => {
    assert.match(seoTemplateSource, /text-slate-950 dark:text-dark-50/);
    assert.match(seoTemplateSource, /text-slate-700 dark:text-dark-300/);
    assert.match(seoTemplateSource, /bg-white\/85[\s\S]*dark:bg-dark-800/);
    assert.match(seoTemplateSource, /bg-white\/90[\s\S]*dark:bg-dark-900/);
    assert.match(seoTemplateSource, /bg-cyan-50 text-cyan-700 border-cyan-200[\s\S]*dark:bg-accent-cyan\/15/);
    assert.match(seoTemplateSource, /bg-violet-50 text-violet-700 border-violet-200[\s\S]*dark:bg-accent-purple\/15/);
    assert.match(seoTemplateSource, /bg-emerald-50 text-emerald-700 border-emerald-200[\s\S]*dark:bg-emerald-500\/15/);
  });

  it('keeps generated-name cards readable in light and dark mode', () => {
    assert.match(seoTemplateSource, /nameCardClass/);
    assert.match(seoTemplateSource, /bg-white\/92 border border-slate-200\/90 rounded-2xl/);
    assert.match(seoTemplateSource, /dark:bg-dark-900\/96 dark:border-dark-700\/90/);
    assert.match(seoTemplateSource, /text-\[1\.15rem\] sm:text-xl font-black text-slate-950 dark:text-dark-50/);
    assert.match(seoTemplateSource, /text-slate-500 dark:text-dark-400\/90/);
  });

  it('makes InternalLinkGrid cards and links theme-aware', () => {
    assert.match(internalLinkGridSource, /border-slate-200\/90[\s\S]*dark:border-dark-700/);
    assert.match(internalLinkGridSource, /text-slate-950 dark:text-dark-50/);
    assert.match(internalLinkGridSource, /bg-white\/85[\s\S]*dark:bg-dark-800/);
    assert.match(internalLinkGridSource, /bg-white\/90[\s\S]*dark:bg-dark-900/);
    assert.doesNotMatch(internalLinkGridSource, /className="bg-dark-800/);
  });

  it('updates the audit to describe PR10.4 implementation status', () => {
    assert.match(auditDoc, /PR10\.4 Implementation Status/);
    assert.match(auditDoc, /`SeoTemplate` is now theme-aware/);
    assert.match(auditDoc, /`InternalLinkGrid` is now theme-aware/);
    assert.match(auditDoc, /WORKS AFTER PR10\.4/);
  });

  it('does not add provider auth/runtime copy to dynamic route templates', () => {
    assert.doesNotMatch(seoTemplateSource, /Continue with Riot|Continue with Discord/);
    assert.doesNotMatch(seoTemplateSource, /Riot OAuth is live\b/i);
    assert.doesNotMatch(seoTemplateSource, /Discord OAuth is live\b/i);
    assert.doesNotMatch(seoTemplateSource, /production Riot key exists\b/i);
  });
});
