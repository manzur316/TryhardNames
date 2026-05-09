
import {
  getAllProgrammaticSlugs,
  getProgrammaticPageBySlug,
  getProgrammaticPagesByCategory,
  isProgrammaticSlug,
} from '../seo/programmatic/pages.js';

/**
 * Programmatic SEO single source of truth.
 *
 * - No per-URL hardcoded pages.
 * - Slugs are validated from datasets + allowed combos.
 * - Page data is generated on demand from templates.
 */

export const clusters = {
  valorant: getProgrammaticPagesByCategory('valorant'),
  fortnite: getProgrammaticPagesByCategory('fortnite'),
  cod: getProgrammaticPagesByCategory('cod'),
  roblox: getProgrammaticPagesByCategory('roblox'),
  'league-of-legends': getProgrammaticPagesByCategory('league-of-legends'),
  general: getProgrammaticPagesByCategory('general'),
};

// Extract all valid slugs from programmatic generator (format: 'category/keyword')
export const validSlugs = getAllProgrammaticSlugs();

// Validate if a slug is valid (accepts with or without leading slash, supports multi-segment slugs)
export const isValidSlug = (slug) => {
  if (!slug) return false;
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  return isProgrammaticSlug(normalized);
};

// Get all valid slugs
export const getAllValidSlugs = () => {
  return validSlugs;
};

export const getPageBySlug = (slug) => {
  // Handle both '/category/keyword' and 'category/keyword' formats
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  return getProgrammaticPageBySlug(normalized) || null;
};

export const getAllSlugs = () => {
  return validSlugs;
};

export const getPagesByCluster = (clusterName) => {
  return clusters[clusterName] || [];
};
