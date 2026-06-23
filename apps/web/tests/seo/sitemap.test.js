import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  generateSitemap,
  getPageMetadata,
  getSitemapLastmod,
  getSitemapUrls,
} from '../../src/utils/sitemapGenerator.js';

describe('sitemap generation', () => {
  it('uses a deterministic lastmod date', () => {
    assert.equal(getSitemapLastmod(), '2026-05-10');
    assert.match(generateSitemap(), /<lastmod>2026-05-10<\/lastmod>/);
  });

  it('includes core public routes once', () => {
    const paths = getSitemapUrls().map((url) => url.path);
    assert.equal(new Set(paths).size, paths.length);
    assert.ok(paths.includes('/'));
    assert.ok(paths.includes('/roblox-names'));
    assert.ok(paths.includes('/gamer-names'));
    assert.ok(paths.includes('/identity-kit'));
  });

  it('assigns expected metadata for public route classes', () => {
    assert.deepEqual(getPageMetadata('/'), { priority: 1.0, changefreq: 'daily' });
    assert.deepEqual(getPageMetadata('/identity-kit'), { priority: 0.8, changefreq: 'monthly' });
    assert.deepEqual(getPageMetadata('/roblox-names'), { priority: 0.9, changefreq: 'weekly' });
    assert.deepEqual(getPageMetadata('/roblox-names/cool'), {
      priority: 0.7,
      changefreq: 'monthly',
    });
  });
});
