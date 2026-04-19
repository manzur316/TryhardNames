import { VALID_ROUTES, getClosestValidRoute, isValidRoute } from './routeValidator.js';
import { LEGACY_ROUTE_PATTERNS } from './routeScanner.js';

export const runProductionValidation = () => {
  console.group('🛡️ Production Route Validation Report');
  
  const results = {
    validRoutes: [],
    legacyRoutes: [],
    invalidRoutes: [],
    timestamp: new Date().toISOString()
  };

  // 1. Validate all known valid routes
  console.log('✅ Testing Valid Routes:');
  VALID_ROUTES.forEach(route => {
    const isValid = isValidRoute(route);
    results.validRoutes.push({ route, status: isValid ? 'PASS' : 'FAIL' });
    console.log(`  ${isValid ? '✓' : '❌'} ${route}`);
  });

  // 2. Validate all legacy routes mapping
  console.log('\n🔄 Testing Legacy Route Mappings:');
  LEGACY_ROUTE_PATTERNS.forEach(route => {
    const mappedTo = getClosestValidRoute(route);
    const isMapped = mappedTo !== null;
    results.legacyRoutes.push({ route, mappedTo, status: isMapped ? 'PASS' : 'FAIL' });
    console.log(`  ${isMapped ? '✓' : '❌'} ${route} -> ${mappedTo || 'UNMAPPED'}`);
  });

  // 3. Test some known invalid routes
  console.log('\n🚫 Testing Invalid Routes:');
  const testInvalid = ['/random-page', '/roblox-names/invalid-category', '/gamer-names/fake'];
  testInvalid.forEach(route => {
    const isInvalid = !isValidRoute(route) && getClosestValidRoute(route) === null;
    results.invalidRoutes.push({ route, status: isInvalid ? 'PASS' : 'FAIL' });
    console.log(`  ${isInvalid ? '✓' : '❌'} ${route} (Correctly identified as invalid)`);
  });

  console.groupEnd();
  return results;
};

export const validateDOMForLegacyRoutes = () => {
  if (typeof document === 'undefined') {
    return { error: 'DOM not available' };
  }

  const links = Array.from(document.querySelectorAll('a[href]'));
  const legacyLinks = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const isLegacy = LEGACY_ROUTE_PATTERNS.some(pattern => 
      href === pattern || href.startsWith(`${pattern}/`) || href.startsWith(`${pattern}?`)
    );

    if (isLegacy) {
      legacyLinks.push({
        href,
        text: link.textContent?.trim() || 'No text',
        element: link
      });
    }
  });

  if (legacyLinks.length > 0) {
    console.warn('⚠️ WARNING: Legacy routes found in DOM!', legacyLinks);
  } else {
    console.log('✅ DOM Validation Passed: No legacy routes found in current view.');
  }

  return {
    totalLinksScanned: links.length,
    legacyLinksFound: legacyLinks.length,
    details: legacyLinks
  };
};