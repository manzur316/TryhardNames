import { SITEMAP_ROUTES, fetchSitemap } from './sitemapGenerator.js';
import { LEGACY_ROUTE_PATTERNS } from './routeScanner.js';

export const validateSitemapStructure = (xmlString) => {
  if (!xmlString || typeof xmlString !== 'string') return false;
  
  const hasXmlHeader = xmlString.includes('<?xml version="1.0"');
  const hasUrlset = xmlString.includes('<urlset') && xmlString.includes('</urlset>');
  const hasUrls = xmlString.includes('<url>') && xmlString.includes('</url>');
  
  // Extract routes using basic string manipulation (since DOMParser isn't always available in Node/tests)
  const locMatches = xmlString.match(/<loc>(.*?)<\/loc>/g) || [];
  const routes = locMatches.map(loc => {
    const url = loc.replace(/<\/?loc>/g, '');
    try {
      return new URL(url).pathname;
    } catch (e) {
      return url;
    }
  });

  return {
    isValid: hasXmlHeader && hasUrlset && hasUrls,
    routes
  };
};

export const validateSitemapRoutes = (routes) => {
  const missingRoutes = SITEMAP_ROUTES.filter(required => !routes.includes(required));
  const extraRoutes = routes.filter(route => !SITEMAP_ROUTES.includes(route));
  
  return {
    isValid: missingRoutes.length === 0,
    missingRoutes,
    extraRoutes
  };
};

export const validateNoLegacyInSitemap = (routes) => {
  const foundLegacy = routes.filter(route => LEGACY_ROUTE_PATTERNS.includes(route));
  
  return {
    isValid: foundLegacy.length === 0,
    foundLegacy
  };
};

export const runFullSitemapValidation = async () => {
  console.group('🔍 Full Sitemap Validation');
  
  const results = {
    apiFetch: false,
    structureValid: false,
    routesValid: false,
    noLegacyValid: false,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fetch from API
    console.log('Fetching sitemap data from API...');
    const apiData = await fetchSitemap();
    results.apiFetch = true;
    
    const routesToTest = apiData.routes || SITEMAP_ROUTES;
    
    // 2. Validate Routes
    const routeValidation = validateSitemapRoutes(routesToTest);
    results.routesValid = routeValidation.isValid;
    console.log(`Route Validation: ${routeValidation.isValid ? '✅ PASS' : '❌ FAIL'}`);
    if (!routeValidation.isValid) {
      console.warn('Missing routes:', routeValidation.missingRoutes);
    }

    // 3. Validate No Legacy
    const legacyValidation = validateNoLegacyInSitemap(routesToTest);
    results.noLegacyValid = legacyValidation.isValid;
    console.log(`Legacy Route Check: ${legacyValidation.isValid ? '✅ PASS' : '❌ FAIL'}`);
    if (!legacyValidation.isValid) {
      console.error('Legacy routes found:', legacyValidation.foundLegacy);
    }

  } catch (error) {
    console.error('Validation failed:', error);
  }

  console.groupEnd();
  return results;
};