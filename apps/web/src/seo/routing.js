import { APP_REGISTERED_STATIC_PATHS } from '../core/routing/routeCatalog.js';
import { LEGACY_ROUTE_MAP } from '../core/routing/legacyRoutes.js';
import { getAllValidSlugs } from '../utils/pageLoader.js';

export const NOINDEX_PATHS = ['/account', '/auth/callback', '/sign-in', '/sign-up', '/favorites', '/leaderboards', '/404'];

export function getSeoRouting() {
  const redirectMap = { ...LEGACY_ROUTE_MAP, '/identity-kit': '/gaming-passport', '/index.html': '/' };
  const paths = [...new Set([...APP_REGISTERED_STATIC_PATHS, ...getAllValidSlugs().map(slug => '/' + slug)])]
    .filter(path => path !== '/' && path !== '/404' && !redirectMap[path]).sort();
  return {
    redirects: Object.entries(redirectMap).map(([source, destination]) => ({ source, destination, permanent: true })),
    headers: [...NOINDEX_PATHS, '/api/:path*'].map(source => ({
      source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    })),
    rewrites: [
      { source: '/api/:path*', destination: '/api/index.mjs?apiPath=:path*' },
      ...paths.map(source => ({ source, destination: '/index.html' })),
      { source: '/id/:slug([a-z0-9][a-z0-9-]{0,30}[a-z0-9])', destination: '/index.html' },
    ],
  };
}
