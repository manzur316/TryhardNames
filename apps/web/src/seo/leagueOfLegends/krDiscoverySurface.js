/**
 * Discovery surface realism — KR lane only. Visual micro-hierarchy + rhythm (no badges, scores, or UX theater).
 * Tier ids are internal; never shown or exposed as selectable modes.
 */

/** @typedef {'baseline'|'air'|'loom'|'fade'} KrDiscoveryTierId */

function strHash(s) {
  const x = String(s);
  let h = 2166136261;
  for (let i = 0; i < x.length; i++) {
    h ^= x.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Tunable discovery atmosphere — spacing/weight variance targets, not user-facing vocabulary.
 */
export const DiscoverySurfaceRules = {
  /** Tier vocabulary (implementation detail only) */
  tiers: /** @type {const} */ (['baseline', 'air', 'loom', 'fade']),
  /** Soft standout density target (~fraction of list that may read slightly louder) */
  loomBiasCap: 0.22,
  /** Quiet coexistence floor (~fraction that may read slightly recessed) */
  fadeBiasFloor: 0.18,
  notes: [
    'Micro-asymmetry only — premium restraint preserved.',
    'No rarity UX: tiers map to spacing/opacity/weight, not labels.',
  ],
};

/** Intent → soft anchor distribution (still blended with hash noise — not 1:1 personas). */
const INTENT_TIER_ANCHORS = {
  restrained_prestige: ['loom', 'loom', 'air', 'baseline'],
  clean_grinder: ['baseline', 'baseline', 'air', 'loom'],
  quiet_smurf: ['fade', 'air', 'baseline', 'fade'],
  old_alt: ['fade', 'fade', 'air', 'baseline'],
};

/**
 * @param {{ intent: string, presented: string, index: number, ecologySalt?: string }} row
 * @returns {KrDiscoveryTierId}
 */
export function resolveKrDiscoveryTier(row) {
  const { intent, presented, index, ecologySalt } = row;
  const h = strHash(`${presented}\x1e${intent}\x1e${index}\x1e${ecologySalt ?? ''}`);
  const noise = h % 100;

  if (noise < DiscoverySurfaceRules.fadeBiasFloor * 100) return 'fade';
  if (noise > 100 - DiscoverySurfaceRules.loomBiasCap * 100) return 'loom';

  const anchors = INTENT_TIER_ANCHORS[intent] || INTENT_TIER_ANCHORS.clean_grinder;
  return anchors[(h >>> 10) % anchors.length];
}

/**
 * Fallback tier when surfaces were lost (e.g. client-side remix) — deterministic, still bounded.
 * @param {string} name
 * @param {number} index
 * @returns {KrDiscoveryTierId}
 */
export function resolveKrDiscoveryTierFallback(name, index) {
  const h = strHash(`fallback\x1e${name}\x1e${index}`);
  const k = h % 100;
  if (k < 20) return 'fade';
  if (k > 82) return 'loom';
  if (k > 55) return 'air';
  return 'baseline';
}

/**
 * Tailwind class bundles — subtle only (Kr laboratory).
 * @param {KrDiscoveryTierId} tier
 */
export function krDiscoveryCardClassNames(tier) {
  switch (tier) {
    case 'loom':
      return {
        pad: 'p-4',
        wrap: 'border-zinc-500/35 bg-dark-900 ring-1 ring-inset ring-white/[0.07]',
        name: 'text-xl font-bold text-dark-50 tracking-tight',
        meta: 'text-dark-300/95',
      };
    case 'air':
      return {
        pad: 'px-4 py-6 md:py-7',
        wrap: 'border-dark-700/55 bg-dark-900/95',
        name: 'text-xl font-black text-dark-50 tracking-tight',
        meta: 'text-dark-400/90',
      };
    case 'fade':
      return {
        pad: 'p-4',
        wrap: 'border-dark-700/45 bg-dark-900/85 opacity-[0.94]',
        name: 'text-lg font-semibold text-dark-100/95 tracking-normal',
        meta: 'text-dark-500/85',
      };
    default:
      return {
        pad: 'p-4',
        wrap: 'border-dark-700 bg-dark-900',
        name: 'text-xl font-black text-dark-50 tracking-tight',
        meta: 'text-dark-400/90',
      };
  }
}
