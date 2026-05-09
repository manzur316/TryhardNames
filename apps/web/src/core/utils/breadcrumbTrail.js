import { TOPIC_HUB_ROUTES } from '@/seo/programmatic/topicHubRoutes.js';
import { isProgrammaticSlug, getProgrammaticBreadcrumbSchemaItems } from '@/seo/programmatic/pages.js';
import { LOL_HUB_PATH, LOL_IDENTITY_LANES } from '@/seo/leagueOfLegends/lolIdentityHub.js';
import { SINGLE_SEGMENT_BREADCRUMB_LABELS } from '@/core/routing/routeCatalog.js';

const LOL_LANE_LABEL = Object.fromEntries(LOL_IDENTITY_LANES.map((l) => [l.slug, l.title]));

const ROBLOX_CHILD = {
  cool: 'Cool',
  funny: 'Funny',
  aesthetic: 'Aesthetic',
  tryhard: 'Tryhard',
};

const GAMER_CHILD = {
  cool: 'Cool',
  funny: 'Funny',
  pro: 'Pro',
  edgy: 'Edgy',
};

function capitalize(seg) {
  if (!seg) return '';
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
}

/**
 * Canonical breadcrumb trail for global chrome + JSON-LD (excluding Home — added by schema helper).
 * @returns {{ schemaItems: { name: string, path: string }[], navItems: { name: string, path: string, isLast: boolean }[] } | null}
 */
export function getBreadcrumbTrail(pathname) {
  const raw = (pathname || '/').replace(/\/$/, '') || '/';
  if (raw === '/' || raw === '/404') return null;

  const segments = raw.split('/').filter(Boolean);

  if (segments.length === 1) {
    const seg = segments[0];
    const hub = TOPIC_HUB_ROUTES.find((r) => r.path === raw || r.slug === seg);
    if (hub) {
      const items = [{ name: hub.label, path: hub.path }];
      return {
        schemaItems: items,
        navItems: items.map((item, i) => ({ ...item, isLast: i === items.length - 1 })),
      };
    }
    const title = SINGLE_SEGMENT_BREADCRUMB_LABELS[seg];
    if (title) {
      const items = [{ name: title, path: raw }];
      return {
        schemaItems: items,
        navItems: items.map((item, i) => ({ ...item, isLast: i === items.length - 1 })),
      };
    }
    return null;
  }

  if (segments.length === 2 && segments[0] === 'roblox-names') {
    const childKey = segments[1];
    const child = ROBLOX_CHILD[childKey] || capitalize(childKey);
    const schemaItems = [
      { name: 'Roblox Names', path: '/roblox-names' },
      { name: child, path: raw },
    ];
    return {
      schemaItems,
      navItems: [
        { name: 'Roblox Names', path: '/roblox-names', isLast: false },
        { name: child, path: raw, isLast: true },
      ],
    };
  }

  if (segments.length === 2 && segments[0] === 'gamer-names') {
    const childKey = segments[1];
    const child = GAMER_CHILD[childKey] || capitalize(childKey);
    const schemaItems = [
      { name: 'Gamer Names', path: '/gamer-names' },
      { name: child, path: raw },
    ];
    return {
      schemaItems,
      navItems: [
        { name: 'Gamer Names', path: '/gamer-names', isLast: false },
        { name: child, path: raw, isLast: true },
      ],
    };
  }

  if (segments.length === 2 && segments[0] === 'league-of-legends') {
    const childKey = segments[1];
    const child = LOL_LANE_LABEL[childKey] || capitalize(childKey);
    const schemaItems = [
      { name: 'League of Legends', path: LOL_HUB_PATH },
      { name: child, path: raw },
    ];
    return {
      schemaItems,
      navItems: [
        { name: 'League of Legends', path: LOL_HUB_PATH, isLast: false },
        { name: child, path: raw, isLast: true },
      ],
    };
  }

  const joined = segments.join('/');
  if (isProgrammaticSlug(joined)) {
    const schemaItems = getProgrammaticBreadcrumbSchemaItems(joined);
    if (!schemaItems?.length) return null;
    return {
      schemaItems,
      navItems: schemaItems.map((item, i) => ({
        ...item,
        isLast: i === schemaItems.length - 1,
      })),
    };
  }

  if (segments.length === 2) {
    const label = `${capitalize(segments[0])} — ${capitalize(segments[1])}`;
    const items = [{ name: label, path: raw }];
    return {
      schemaItems: items,
      navItems: items.map((item, i) => ({ ...item, isLast: i === items.length - 1 })),
    };
  }

  return null;
}
