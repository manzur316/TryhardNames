export const VALID_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
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
  '/stylish-text-generator',
  '/nickname-symbols',
  '/sitemap',
  '/sitemap.xml'
];

export const VALID_PATTERNS = [
  /^\/$/,
  /^\/about\/?$/,
  /^\/contact\/?$/,
  /^\/privacy-policy\/?$/,
  /^\/terms-of-service\/?$/,
  /^\/roblox-names(\/(cool|funny|aesthetic|tryhard))?\/?$/,
  /^\/gamer-names(\/(cool|funny|pro|edgy))?\/?$/,
  /^\/stylish-text-generator\/?$/,
  /^\/nickname-symbols\/?$/,
  /^\/sitemap(\.xml)?\/?$/
];

export const sanitizePathname = (pathname) => {
  if (!pathname) return '/';
  // Remove multiple slashes and convert to lowercase
  const sanitized = pathname.replace(/\/+/g, '/').toLowerCase();
  // Remove trailing slash unless it's the root
  return sanitized.length > 1 && sanitized.endsWith('/') 
    ? sanitized.slice(0, -1) 
    : sanitized;
};

export const getClosestValidRoute = (pathname) => {
  const sanitized = sanitizePathname(pathname);
  
  const legacyMap = {
    '/cool-names': '/gamer-names/cool',
    '/funny-names': '/gamer-names/funny',
    '/valorant-names': '/gamer-names',
    '/fortnite-names': '/gamer-names',
    '/fortnite-tryhard-names': '/gamer-names',
    '/gamer-bio-generator': '/',
    '/cool-gamer-bio': '/',
    '/funny-gamer-bio': '/',
    '/roblox-names-generator': '/roblox-names',
    '/roblox-cool-names': '/roblox-names/cool',
    '/roblox-funny-names': '/roblox-names/funny',
    '/roblox-aesthetic-names': '/roblox-names/aesthetic',
    '/roblox-tryhard-names': '/roblox-names/tryhard',
    '/gamer-names-generator': '/gamer-names',
    '/cool-gamer-names': '/gamer-names/cool',
    '/funny-gamer-names': '/gamer-names/funny',
    '/pro-gamer-names': '/gamer-names/pro',
    '/edgy-gamer-names': '/gamer-names/edgy'
  };

  return legacyMap[sanitized] || null;
};

export const isLegacyRoute = (pathname) => {
  return getClosestValidRoute(pathname) !== null;
};

export const isValidRoute = (pathname) => {
  const sanitized = sanitizePathname(pathname);
  return VALID_PATTERNS.some(pattern => pattern.test(sanitized));
};

export const validateURL = (url) => {
  try {
    // Handle both relative and absolute URLs
    const parsedUrl = new URL(url, window.location.origin);
    return isValidRoute(parsedUrl.pathname);
  } catch (error) {
    return false;
  }
};