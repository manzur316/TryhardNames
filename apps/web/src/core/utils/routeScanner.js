export const LEGACY_ROUTE_PATTERNS = [
  '/cool-names',
  '/funny-names',
  '/valorant-names',
  '/fortnite-names',
  '/fortnite-tryhard-names',
  '/cool-gamer-bio',
  '/funny-gamer-bio',
  '/roblox-names-generator',
  '/roblox-cool-names',
  '/roblox-funny-names',
  '/roblox-aesthetic-names',
  '/roblox-tryhard-names',
  '/gamer-names-generator',
  '/cool-gamer-names',
  '/funny-gamer-names',
  '/pro-gamer-names',
  '/edgy-gamer-names'
];

export const scanForLegacyRoutes = (content) => {
  if (!content || typeof content !== 'string') {
    return { found: [], total: 0, timestamp: new Date().toISOString() };
  }
  
  const found = LEGACY_ROUTE_PATTERNS.filter(route => {
    // Look for exact matches in hrefs, to props, or string literals
    const patterns = [
      `"${route}"`,
      `'${route}'`,
      `\`${route}\``,
      `to="${route}"`,
      `href="${route}"`,
      `to={'${route}'}`,
      `to={"${route}"}`
    ];
    
    return patterns.some(p => content.includes(p));
  });

  return {
    found,
    total: found.length,
    timestamp: new Date().toISOString()
  };
};

export const validateNoLegacyRoutes = (content) => {
  const { total } = scanForLegacyRoutes(content);
  return total === 0;
};

export const generateScanReport = (content) => {
  const { found, total, timestamp } = scanForLegacyRoutes(content);
  const isValid = total === 0;
  
  return {
    timestamp,
    isValid,
    issuesFound: total,
    legacyRoutesDetected: found,
    status: isValid ? 'PASS' : 'FAIL',
    message: isValid 
      ? 'No legacy routes detected in content.' 
      : `Found ${total} legacy route references.`
  };
};