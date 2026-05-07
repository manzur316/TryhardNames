import { breadcrumbListSchema } from './schema.js';

const ROBLOX_CHILD_LABELS = {
  cool: 'Cool',
  funny: 'Funny',
  aesthetic: 'Aesthetic',
  tryhard: 'Tryhard',
};

const GAMER_CHILD_LABELS = {
  cool: 'Cool',
  funny: 'Funny',
  pro: 'Pro',
  edgy: 'Edgy',
};

/** @param {string} pathname */
export function robloxHubBreadcrumbJsonLd(pathname) {
  if (pathname === '/roblox-names') {
    return breadcrumbListSchema([{ name: 'Roblox Names', path: '/roblox-names' }]);
  }
  const rest = pathname.replace(/^\/roblox-names\/?/, '');
  const label = ROBLOX_CHILD_LABELS[rest] || rest;
  return breadcrumbListSchema([
    { name: 'Roblox Names', path: '/roblox-names' },
    { name: label, path: pathname },
  ]);
}

/** @param {string} pathname */
export function gamerHubBreadcrumbJsonLd(pathname) {
  if (pathname === '/gamer-names') {
    return breadcrumbListSchema([{ name: 'Gamer Names', path: '/gamer-names' }]);
  }
  const rest = pathname.replace(/^\/gamer-names\/?/, '');
  const label = GAMER_CHILD_LABELS[rest] || rest;
  return breadcrumbListSchema([
    { name: 'Gamer Names', path: '/gamer-names' },
    { name: label, path: pathname },
  ]);
}
