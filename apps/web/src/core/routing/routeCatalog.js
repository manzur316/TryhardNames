/**
 * Routing governance — single source of truth for SPA paths registered in App.jsx.
 *
 * OWNERSHIP MODEL
 * ────────────────
 * • Static routes: this list MUST match `<Route path="…">` in App.jsx (review both on every new route).
 * • Programmatic URLs (`/category/keyword`): owned by `seo/programmatic/pages.js` + validated via `pageLoader.isValidSlug`.
 * • Legacy redirects only: `LegacyRouteHandler` / `LEGACY_ROUTE_MAP` (never duplicate paths here unless also in App).
 * • Meta / edge URLs (static files, not React): `META_OR_EDGE_PATHS` — allowed by routeValidator for tooling, not RouteGuard navigation.
 *
 * @module core/routing/routeCatalog
 */

import { TOPIC_HUB_ROUTES } from '@/seo/programmatic/topicHubRoutes.js';

/** Exact pathname matches for every static `<Route>` in App.jsx (incl. topic hubs). */
export const APP_REGISTERED_STATIC_PATHS = Object.freeze([
  '/',
  '/404',
  '/about',
  '/contact',
  '/favorites',
  '/gamer-bio-generator',
  '/gamer-names',
  '/gamer-names/cool',
  '/gamer-names/edgy',
  '/gamer-names/funny',
  '/gamer-names/pro',
  '/identity-kit',
  '/leaderboards',
  '/league-of-legends',
  '/nickname-symbols',
  '/privacy-policy',
  '/roblox-names',
  '/roblox-names/aesthetic',
  '/roblox-names/cool',
  '/roblox-names/funny',
  '/roblox-names/tryhard',
  '/stylish-text-generator',
  '/terms-of-service',
  ...TOPIC_HUB_ROUTES.map((r) => r.path),
]);

export const APP_REGISTERED_STATIC_PATH_SET = new Set(APP_REGISTERED_STATIC_PATHS);

/** Paths that may appear in links/validators but are not React routes (public files, etc.). */
export const META_OR_EDGE_PATHS = Object.freeze(['/sitemap', '/sitemap.xml']);

/**
 * @param {string} pathname — sanitized (no trailing slash except '/')
 */
export function isAppRegisteredStaticRoute(pathname) {
  if (!pathname) return false;
  return APP_REGISTERED_STATIC_PATH_SET.has(pathname);
}

/**
 * Breadcrumb label for first URL segment when no dedicated hub row applies.
 * Topic hubs use TOPIC_HUB_ROUTES[].label in breadcrumbTrail.
 */
export const SINGLE_SEGMENT_BREADCRUMB_LABELS = Object.freeze({
  about: 'About',
  contact: 'Contact',
  'privacy-policy': 'Privacy Policy',
  'terms-of-service': 'Terms of Service',
  favorites: 'Favorites',
  leaderboards: 'Leaderboards',
  'gamer-bio-generator': 'Gamer Bio Generator',
  'gamer-names': 'Gamer Names',
  'roblox-names': 'Roblox Names',
  'stylish-text-generator': 'Stylish Text Generator',
  'nickname-symbols': 'Nickname Symbols',
  'identity-kit': 'Identity Kit',
  'league-of-legends': 'League of Legends',
});
