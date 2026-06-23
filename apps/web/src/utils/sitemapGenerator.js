
import { getAllValidSlugs } from './pageLoader.js';
import { getAllTopicHubPaths } from '../seo/programmatic/hubs.js';

const toolPages = ['/stylish-text-generator', '/nickname-symbols', '/identity-kit'];
const hubPages = ['/roblox-names', '/gamer-names', '/league-of-legends'];
const DEFAULT_SITEMAP_LASTMOD = '2026-05-10';

/** Indexable static routes not covered by hub/tool/dynamic lists */
const staticPages = [
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/gamer-bio-generator',
  '/roblox-names/cool',
  '/roblox-names/funny',
  '/roblox-names/aesthetic',
  '/roblox-names/tryhard',
  '/gamer-names/cool',
  '/gamer-names/funny',
  '/gamer-names/pro',
  '/gamer-names/edgy',
];

export const getSitemapLastmod = () => DEFAULT_SITEMAP_LASTMOD;

/**
 * Automatically determines page priority and change frequency based on URL structure.
 * Strict condition order:
 * 1. Homepage (/): priority 1.0, daily
 * 2. Tool pages (/stylish-text-generator, etc): priority 0.8, monthly
 * 3. Hub pages (/roblox-names, etc): priority 0.9, weekly
 * 4. Dynamic pages (/segment1/segment2): priority 0.7, monthly
 * 5. Default: priority 0.5, yearly
 * 
 * @param {string} path - The URL path
 * @returns {{priority: number, changefreq: string}}
 */
export const getPageMetadata = (path) => {
  // 1. Homepage
  if (path === '/' || path === '') {
    return { priority: 1.0, changefreq: 'daily' };
  }

  // 2. Tool pages
  if (toolPages.includes(path)) {
    return { priority: 0.8, changefreq: 'monthly' };
  }

  const segments = path.split('/').filter(Boolean);

  // 3. Hub pages
  if (hubPages.includes(path) || segments.length === 1) {
    return { priority: 0.9, changefreq: 'weekly' };
  }

  // 4. Dynamic pages (2 or more segments)
  if (segments.length >= 2) {
    return { priority: 0.7, changefreq: 'monthly' };
  }

  // 5. Default fallback
  return { priority: 0.5, changefreq: 'yearly' };
};

export const getSitemapUrls = () => {
  const homepage = ['/'];
  const topicHubs = getAllTopicHubPaths();

  // Get dynamic slugs (format: 'category/keyword') and format as paths
  const dynamicPaths = getAllValidSlugs().map(slug => {
    // Ensure slug starts with a slash
    return slug.startsWith('/') ? slug : `/${slug}`;
  });

  // Build allRoutes array by iterating: homepage, hub pages, tool pages, then dynamic slugs
  const allPaths = [...new Set([
    ...homepage,
    ...hubPages,
    ...topicHubs,
    ...toolPages,
    ...staticPages,
    ...dynamicPaths
  ])];

  // Map to objects with automatic metadata assignment
  return allPaths.map(path => {
    const metadata = getPageMetadata(path);
    return {
      path,
      priority: metadata.priority,
      changefreq: metadata.changefreq
    };
  });
};

export const generateSitemap = () => {
  const baseUrl = 'https://tryhardnames.com';
  const urls = getSitemapUrls();
  const date = getSitemapLastmod();

  const urlElements = urls.map(url => `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`.trim();
};
