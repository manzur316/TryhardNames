export const validateRoutes = () => {
  const legacyRoutes = [
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

  const validRoutes = [
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
    '/gamer-names/edgy',
    '/gamer-bio-generator',
    '*'
  ];

  return { legacyRoutes, validRoutes };
};

export const validateNoLegacyReferences = (content) => {
  if (!content || typeof content !== 'string') return [];
  
  const { legacyRoutes } = validateRoutes();
  const foundReferences = legacyRoutes.filter(route => {
    // Check for common string patterns containing the route
    return content.includes(`"${route}"`) || 
           content.includes(`'${route}'`) || 
           content.includes(`\`${route}\``) ||
           content.includes(`to="${route}"`) ||
           content.includes(`href="${route}"`);
  });

  if (foundReferences.length > 0) {
    console.warn('⚠️ Legacy route references found in content:', foundReferences);
  }

  return foundReferences;
};