import apiServerClient from '@/lib/apiServerClient.js';
import { LEGACY_ROUTE_PATTERNS } from './routeScanner.js';

export const SITEMAP_ROUTES = [
  '/',
  '/stylish-text-generator',
  '/nickname-symbols',
  '/roblox-names',
  '/roblox-names/cool',
  '/roblox-names/funny',
  '/roblox-names/aesthetic',
  '/roblox-names/tryhard',
  '/gamer-names',
  '/gamer-names/cool',
  '/gamer-names/funny',
  '/gamer-names/pro',
  '/gamer-names/edgy'
];

export const fetchSitemap = async () => {
  try {
    const response = await apiServerClient.fetch('/sitemap/routes');
    if (!response.ok) throw new Error('Failed to fetch sitemap routes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sitemap routes:', error);
    return { routes: SITEMAP_ROUTES }; // Fallback to static routes
  }
};

export const validateSitemap = async () => {
  try {
    const response = await apiServerClient.fetch('/sitemap/validate');
    if (!response.ok) throw new Error('Failed to validate sitemap');
    return await response.json();
  } catch (error) {
    console.error('Error validating sitemap:', error);
    return { valid: false, error: error.message };
  }
};

export const generateSitemapXML = (baseUrl = 'https://tryhardnames.com') => {
  const urls = SITEMAP_ROUTES.map(route => {
    const priority = route === '/' ? '1.0' : (route.split('/').length === 2 ? '0.9' : '0.7');
    const changefreq = route === '/' || route.split('/').length === 2 ? 'daily' : 'weekly';
    
    return `  <url>
    <loc>${baseUrl}${route === '/' ? '' : route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
};

export const verifyNoLegacyRoutes = () => {
  const foundLegacy = SITEMAP_ROUTES.filter(route => 
    LEGACY_ROUTE_PATTERNS.includes(route)
  );
  
  return {
    isValid: foundLegacy.length === 0,
    foundLegacy
  };
};

export const generateSitemapReport = () => {
  console.group('🗺️ Sitemap Generation Report');
  console.log(`Total Routes: ${SITEMAP_ROUTES.length}`);
  
  const legacyCheck = verifyNoLegacyRoutes();
  if (legacyCheck.isValid) {
    console.log('✅ No legacy routes found in sitemap configuration.');
  } else {
    console.error('❌ Legacy routes detected in sitemap:', legacyCheck.foundLegacy);
  }
  
  console.log('Routes included:');
  SITEMAP_ROUTES.forEach(route => console.log(`  - ${route}`));
  console.groupEnd();
  
  return {
    totalRoutes: SITEMAP_ROUTES.length,
    legacyCheck
  };
};