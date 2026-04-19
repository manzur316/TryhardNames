
import valorant from '../pages/clusters/valorant.js';
import fortnite from '../pages/clusters/fortnite.js';
import cod from '../pages/clusters/cod.js';
import general from '../pages/clusters/general.js';
import longtail from '../pages/clusters/longtail.js';

export const clusters = {
  valorant,
  fortnite,
  cod,
  general,
  longtail
};

export const allPages = [
  ...valorant,
  ...fortnite,
  ...cod,
  ...general,
  ...longtail
];

export const pageMap = new Map(allPages.map(page => [page.slug, page]));

// Extract all valid slugs from cluster pages (format: 'category/keyword')
export const validSlugs = allPages.map(page => page.slug);

// Validate if a slug is valid (accepts with or without leading slash, supports multi-segment slugs)
export const isValidSlug = (slug) => {
  if (!slug) return false;
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  return validSlugs.includes(normalized);
};

// Get all valid slugs
export const getAllValidSlugs = () => {
  return validSlugs;
};

export const getPageBySlug = (slug) => {
  // Handle both '/category/keyword' and 'category/keyword' formats
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  return pageMap.get(normalized) || null;
};

export const getAllSlugs = () => {
  return Array.from(pageMap.keys());
};

export const getPagesByCluster = (clusterName) => {
  return clusters[clusterName] || [];
};
