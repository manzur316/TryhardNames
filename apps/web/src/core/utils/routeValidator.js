import {
  APP_REGISTERED_STATIC_PATHS,
  isAppRegisteredDynamicRoute,
  isAppRegisteredStaticRoute,
  META_OR_EDGE_PATHS,
} from '../routing/routeCatalog.js';
import { isValidSlug } from '../../utils/pageLoader.js';

/**
 * Known static SPA paths — alias of catalog for tooling (`productionValidation`, legacy imports).
 * @type {readonly string[]}
 */
export const VALID_ROUTES = APP_REGISTERED_STATIC_PATHS;

/**
 * Legacy regex list — superseded by `routeCatalog` + `isValidSlug` for dynamic programmatic URLs.
 * Kept as empty frozen array so imports do not break; use `isValidRoute()` instead.
 * @deprecated
 */
export const VALID_PATTERNS = Object.freeze([]);

export const sanitizePathname = (pathname) => {
  if (!pathname) return '/';
  const sanitized = pathname.replace(/\/+/g, '/').toLowerCase();
  return sanitized.length > 1 && sanitized.endsWith('/') ? sanitized.slice(0, -1) : sanitized;
};

export const getClosestValidRoute = (pathname) => {
  const sanitized = sanitizePathname(pathname);

  const legacyMap = {
    '/cool-names': '/gamer-names/cool',
    '/funny-names': '/gamer-names/funny',
    '/valorant-names': '/gamer-names',
    '/fortnite-names': '/gamer-names',
    '/fortnite-tryhard-names': '/gamer-names',
    '/cool-gamer-bio': '/gamer-bio-generator',
    '/funny-gamer-bio': '/gamer-bio-generator',
    '/roblox-names-generator': '/roblox-names',
    '/roblox-cool-names': '/roblox-names/cool',
    '/roblox-funny-names': '/roblox-names/funny',
    '/roblox-aesthetic-names': '/roblox-names/aesthetic',
    '/roblox-tryhard-names': '/roblox-names/tryhard',
    '/gamer-names-generator': '/gamer-names',
    '/cool-gamer-names': '/gamer-names/cool',
    '/funny-gamer-names': '/gamer-names/funny',
    '/pro-gamer-names': '/gamer-names/pro',
    '/edgy-gamer-names': '/gamer-names/edgy',
    '/league-of-legends-names': '/league-of-legends',
  };

  return legacyMap[sanitized] || null;
};

export const isLegacyRoute = (pathname) => {
  return getClosestValidRoute(pathname) !== null;
};

/**
 * Whether `pathname` is allowed in this app: static catalog, meta file paths, or valid programmatic slug.
 */
export const isValidRoute = (pathname) => {
  const sanitized = sanitizePathname(pathname);
  if (isAppRegisteredStaticRoute(sanitized)) return true;
  if (isAppRegisteredDynamicRoute(sanitized)) return true;
  if (META_OR_EDGE_PATHS.includes(sanitized)) return true;
  return isValidSlug(sanitized);
};

export const validateURL = (url) => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return isValidRoute(parsedUrl.pathname);
  } catch {
    return false;
  }
};
