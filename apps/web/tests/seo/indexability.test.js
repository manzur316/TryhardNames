import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { absoluteUrl, normalizePath } from '../../src/seo/paths.js';
import { breadcrumbListSchema } from '../../src/seo/schema.js';
import { getSeoRouting, NOINDEX_PATHS } from '../../src/seo/routing.js';
import { getSitemapUrls } from '../../src/utils/sitemapGenerator.js';
import { APP_REGISTERED_STATIC_PATHS } from '../../src/core/routing/routeCatalog.js';
import { getAllProgrammaticSlugs, getProgrammaticPageBySlug } from '../../src/seo/programmatic/pages.js';
import { getEditorialBlocks } from '../../src/seo/editorial/editorialSections.js';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('generated recommendations and editorial links point to registered pages', () => {
  const slugs = getAllProgrammaticSlugs();
  const valid = new Set([...APP_REGISTERED_STATIC_PATHS, ...slugs.map(slug => '/' + slug)]);
  for (const slug of slugs) {
    const [category, keyword] = slug.split('/');
    const page = getProgrammaticPageBySlug(slug);
    const links = [
      ...page.related,
      ...page.linkBlocks.flatMap(block => block.links),
      ...getEditorialBlocks({ category, keyword, slug }).flatMap(block => block.links || []),
    ];
    for (const link of links) {
      const path = link.to || '/' + link.slug;
      assert.ok(valid.has(path), slug + ' -> ' + path);
    }
  }
});

test('canonical URLs use HTTPS www and discard queries, fragments and trailing slashes', () => {
  for (const input of ['roblox-names/', '/roblox-names?utm_source=test', '//roblox-names/#names']) {
    assert.equal(absoluteUrl(input), 'https://www.tryhardnames.com/roblox-names');
  }
  assert.equal(normalizePath('///?x=1'), '/');
  assert.equal(absoluteUrl('/'), 'https://www.tryhardnames.com/');
});
test('breadcrumb URLs share the canonical builder', () => {
  const schema = breadcrumbListSchema([{name:'Names', path:'/gamer-names/'}]);
  assert.equal(schema.itemListElement[0].item, absoluteUrl('/'));
  assert.equal(schema.itemListElement[1].item, absoluteUrl('/gamer-names'));
});
test('initial fallback tags are owned by Helmet and cannot remain duplicate tags', () => {
  const html = read('../../index.html');
  assert.match(html, /<meta data-react-helmet="true" name="description"/);
  assert.match(html, /<meta data-react-helmet="true" name="robots"/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.doesNotMatch(html, /https:\/\/tryhardnames\.com/);
});
test('checked-in Vercel routing matches the shared registered route catalog', () => {
  const config = JSON.parse(read('../../../../vercel.json'));
  const routing = getSeoRouting();
  for (const key of ['redirects','headers','rewrites']) assert.deepEqual(config[key], routing[key]);
  assert.ok(!config.rewrites.some(rule=>rule.source==='/(.*)'));
  assert.deepEqual(config.rewrites[0], {source:'/api/:path*',destination:'/api/index.mjs?apiPath=:path*'});
});
test('all sitemap pages resolve without being redirects, private, or error pages', () => {
  const routing = getSeoRouting();
  for (const {path} of getSitemapUrls()) {
    assert.ok(!NOINDEX_PATHS.includes(path), path);
    assert.ok(!routing.redirects.some(rule=>rule.source===path), path);
    assert.ok(path==='/' || routing.rewrites.some(rule=>rule.source===path), path);
    assert.ok(!path.startsWith('/id/'));
  }
});
test('every static app route is preserved, redirected or intentionally returns 404', () => {
  const routing = getSeoRouting();
  for (const path of APP_REGISTERED_STATIC_PATHS) {
    assert.ok(path==='/' || path==='/404' || routing.redirects.some(r=>r.source===path) || routing.rewrites.some(r=>r.source===path), path);
  }
  assert.ok(routing.rewrites.some(r=>r.source.startsWith('/id/:slug')));
  assert.ok(routing.headers.some(r=>r.source==='/auth/callback'));
});
test('legacy identity links redirect permanently without reintroducing sitemap duplicates', () => {
  const redirect=getSeoRouting().redirects.find(r=>r.source==='/identity-kit');
  assert.deepEqual(redirect,{source:'/identity-kit',destination:'/gaming-passport',permanent:true});
});
test('public lookup loading is not a premature noindex decision', () => {
  const source=read('../../src/pages/PublicGamingPassportPage.jsx');
  const loading=source.slice(source.indexOf("if (state.status === 'loading')"),source.indexOf('function PublicPassportLoaded'));
  assert.doesNotMatch(loading,/\bnoIndex\b/);
  assert.match(source.slice(source.indexOf('function PassportUnavailable')),/\bnoIndex\b/);
});
