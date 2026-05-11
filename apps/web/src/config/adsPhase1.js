/**
 * AdSense Fase 1 — configuración (sin anuncios activos).
 * `ADSENSE_ENABLED` se activa solo tras aprobación e inserción del script de AdSense.
 *
 * @see AdSlot in `src/components/ads/AdSlot.jsx`
 */

import { TOPIC_HUB_ROUTES } from '@/seo/programmatic/topicHubRoutes.js';

export const ADSENSE_ENABLED = false;

/** Formatos reservados para prevenir CLS cuando se activen anuncios */
export const AD_SLOT_MIN_HEIGHT_PX = { default: 280, mobile: 250 };

const TOPIC_HUB_PATHS = TOPIC_HUB_ROUTES.map((r) => r.path);

/**
 * Rutas que nunca mostrarán anuncios (denylist estricta).
 * Incluye home, herramientas core, identidad y trust.
 */
export const ADS_ROUTE_DENYLIST = new Set([
  '/',
  '/identity-kit',
  '/stylish-text-generator',
  '/nickname-symbols',
  '/gamer-bio-generator',
  '/favorites',
  '/leaderboards',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/404',
  '/league-of-legends',
  ...TOPIC_HUB_PATHS,
]);

/**
 * Programmatic: solo `/:category/:keyword` resuelto por `SeoTemplate` vía `DynamicPage`.
 * El componente de anuncio comprobará la ruta al activar Fase 1.
 */
export function isProgrammaticSeoPath(pathname) {
  if (!pathname || pathname === '/') return false;
  const p = pathname.replace(/\/+$/, '') || '/';
  if (ADS_ROUTE_DENYLIST.has(p)) return false;
  const parts = p.split('/').filter(Boolean);
  if (parts.length !== 2) return false;
  const [segA] = parts;
  // Feature sections use the same /a/b shape as programmatic URLs — never treat as ad surfaces here.
  if (segA === 'roblox-names' || segA === 'gamer-names') return false;
  return true;
}
