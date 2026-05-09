/**
 * Single source of truth for Topic Hub routes.
 *
 * IMPORTANT:
 * - Keep slugs stable (SEO).
 * - Keep paths stable (routing + canonical).
 * - Avoid Vite-only aliases (this file is safe for Node too).
 */

export const TOPIC_HUB_ROUTES = [
  {
    slug: 'competitive-gamer-names',
    path: '/competitive-gamer-names',
    label: 'Competitive Gamer Names',
  },
  {
    slug: 'aesthetic-gaming-tags',
    path: '/aesthetic-gaming-tags',
    label: 'Aesthetic Gaming Tags',
  },
  {
    slug: 'brandable-usernames',
    path: '/brandable-usernames',
    label: 'Brandable Usernames',
  },
  {
    slug: 'edgy-gamer-tags',
    path: '/edgy-gamer-tags',
    label: 'Edgy Gamer Tags',
  },
];

export function getTopicHubRouteBySlug(slug) {
  const normalized = String(slug || '').replace(/^\//, '');
  return TOPIC_HUB_ROUTES.find((r) => r.slug === normalized) || null;
}

