import { SITE_ORIGIN } from './constants.js';

/**
 * Normalizes a pathname to a single leading slash (e.g. /a/b).
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (!path || path === '/') return '/';
  const pathname = String(path).split(/[?#]/, 1)[0];
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return p.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
}

/**
 * Full absolute URL for canonical, og:url, etc.
 * @param {string} path - pathname with or without leading slash
 * @returns {string}
 */
export function absoluteUrl(path) {
  const n = normalizePath(path);
  if (n === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${n}`;
}
