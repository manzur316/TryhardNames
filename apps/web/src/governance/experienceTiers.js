/**
 * Experience stratification — official tier system (TOOL · HYBRID · IDENTITY).
 *
 * PURPOSE
 * -------
 * Single source of truth for product philosophy, allowed grammar, and surface classification.
 * This module does NOT add UX features; it formalizes boundaries so surfaces can import
 * tier constants and future metadata (e.g. pageData.experienceTier) stays aligned.
 *
 * @module governance/experienceTiers
 */

/** @typedef {'tool' | 'hybrid' | 'identity'} ExperienceTier */

export const EXPERIENCE_TIER = Object.freeze({
  TOOL: 'tool',
  HYBRID: 'hybrid',
  IDENTITY: 'identity',
});

/**
 * Canonical definitions: purpose, grammar, UI energy, SEO tolerance, mutation tolerance.
 * Keep prose short; full narrative lives in EXPERIENCE_STRATIFICATION.md.
 */
export const TIER_DEFINITIONS = Object.freeze({
  [EXPERIENCE_TIER.TOOL]: {
    purpose: 'High-volume utility, SEO acquisition, fast exploration, generator pacing.',
    philosophy: 'Solve the job quickly; clarity over mystique; repeatable patterns.',
    grammarRules: [
      'Utility-forward copy; SEO phrases allowed when honest.',
      'Generator labels can be competitive: sweaty, ranked, esports, streamer.',
      'Suffix stacks and numeric flair tolerated within game constraints.',
    ],
    disallowed: [
      'Passing TOOL grammar off as “curated identity philosophy”.',
      'Identity-kit typography claims on pure generator surfaces.',
    ],
    uiEnergy: 'medium–high: stronger gradients, hover lift, glow acceptable.',
    typographyEnergy: 'punchy headlines; dense chips; action-forward.',
    acceptableBadges: ['Competitive', 'Ranked', 'Esports', 'Sweaty', 'Streamer', 'Tryhard'],
    quickModes: ['streamer', 'esports', 'sweaty', 'ranked', 'funny', 'aesthetic', 'pro', 'edgy'],
    seoTolerance: 'high — long-tail, programmatic pages, intent matching.',
    mutationTolerance: 'high — rerolls, multi-variant evolution, slot-adjacent pacing.',
  },
  [EXPERIENCE_TIER.HYBRID]: {
    purpose: 'Guided exploration, curated discovery, restrained generators, partial cultural framing.',
    philosophy: 'Editorial handrails without full identity studio depth.',
    grammarRules: [
      'Prefer “curated / readable / compact” over hype stacks.',
      'Trending and editorial copy must not mutate primary grids.',
      'Cross-links explain intent; avoid ecology bleed between unrelated lanes.',
    ],
    disallowed: [
      'Full artifact semantics (export bundles) without Identity tier.',
      'Aggressive “TTV +99” loops styled as premium.',
    ],
    uiEnergy: 'medium: restrained motion; hover polish; fewer simultaneous glows.',
    typographyEnergy: 'balanced — clear hierarchy, fewer shouty badges.',
    acceptableBadges: ['Curated', 'Readable', 'Compact', 'Trending', 'Popular'],
    quickModes: [
      'surface-aware presets only (soft mutation; lane-respecting labels)',
      'no hard mutation chains',
    ],
    seoTolerance: 'medium — intent hubs and guides; less keyword stuffing than TOOL.',
    mutationTolerance: 'medium — soft rerolls; bounded variation.',
  },
  [EXPERIENCE_TIER.IDENTITY]: {
    purpose: 'Typographic identity, artifacts, contextual interpretation, calm editorial surfaces.',
    philosophy: 'One coherent read; minimal noise; surface-aware language.',
    grammarRules: [
      'Quiet reads; explain constraints (client, lobby, op.gg) not hype.',
      'KR ladder lane: disjoint ecology from global style sludge (enforced in lolKoreanLane).',
    ],
    disallowed: [
      'X / TTV spam patterns',
      '+99 loops',
      'slot-machine mutation',
      'forced esports suffix chains as default voice',
      'cyclic ornamentation',
      'generator “coolness” stacks presented as identity truth',
    ],
    uiEnergy: 'low–medium: calm editorial; blur/glow sparingly; motion subtle.',
    typographyEnergy: 'high legibility; generous whitespace; minimal badge density.',
    acceptableBadges: ['Minimal', 'Surface-aware', 'Quiet read', 'KR ladder', 'Artifact'],
    quickModes: [
      'KR quick modes (client clean, tighter tag, one surface, lowercase alt) — see LOL_KOREAN_QUICK_MODES',
      'identity kit moods — surface-bound, no aggressive transforms',
    ],
    seoTolerance: 'low–medium — precise intent; avoid gimmick keywords.',
    mutationTolerance: 'low — intentional variation only; no ecology collision with sweaty lanes.',
  },
});

/**
 * Component / module keys → default tier (shell behavior).
 * Routes may override via resolveExperienceTierForPath.
 */
export const SURFACE_COMPONENT_TIER = Object.freeze({
  SeoTemplate: EXPERIENCE_TIER.TOOL,
  DynamicPage: EXPERIENCE_TIER.TOOL,
  TrendingNamesModule: EXPERIENCE_TIER.HYBRID,
  TrendingNamesSection: EXPERIENCE_TIER.HYBRID,
  TrendingIdentitySection: EXPERIENCE_TIER.HYBRID,
  TopicHubPage: EXPERIENCE_TIER.HYBRID,
  LeagueOfLegendsHubPage: EXPERIENCE_TIER.HYBRID,
  IdentityKitPage: EXPERIENCE_TIER.IDENTITY,
  IdentityKitArtifact: EXPERIENCE_TIER.IDENTITY,
  HeroIdentitySection: EXPERIENCE_TIER.HYBRID,
  HomePage: EXPERIENCE_TIER.HYBRID,
  GamerNamesLayout: EXPERIENCE_TIER.TOOL,
  RobloxNamesLayout: EXPERIENCE_TIER.TOOL,
  GameNameGenerator: EXPERIENCE_TIER.TOOL,
  StylishTextGeneratorPage: EXPERIENCE_TIER.TOOL,
  NicknameSymbolsPage: EXPERIENCE_TIER.TOOL,
  GamerBioGeneratorPage: EXPERIENCE_TIER.TOOL,
  LeaderboardsPage: EXPERIENCE_TIER.TOOL,
  FavoritesPage: EXPERIENCE_TIER.TOOL,
  EditorialSection: EXPERIENCE_TIER.HYBRID,
  FAQSection: EXPERIENCE_TIER.TOOL,
});

/** Path patterns evaluated top-to-bottom; first match wins. */
const ROUTE_TIER_RULES = Object.freeze([
  { test: /^\/identity-kit\/?$/, tier: EXPERIENCE_TIER.IDENTITY },
  { test: /^\/league-of-legends\/korean\/?$/, tier: EXPERIENCE_TIER.IDENTITY },
  { test: /^\/league-of-legends\/?$/, tier: EXPERIENCE_TIER.HYBRID },
  {
    test: /^\/(competitive-gamer-names|aesthetic-gaming-tags|brandable-usernames|edgy-gamer-tags)\/?$/,
    tier: EXPERIENCE_TIER.HYBRID,
  },
  { test: /^\/$/, tier: EXPERIENCE_TIER.HYBRID },
  {
    test: /^\/(about|contact|privacy-policy|terms-of-service)\/?$/,
    tier: EXPERIENCE_TIER.HYBRID,
  },
]);

/**
 * Non-negotiable system boundaries (documentation + future lint hooks).
 */
export const SYSTEM_BOUNDARIES = Object.freeze([
  'Trending modules do not mutate programmatic name grids (ownership isolated in TrendingNamesModule).',
  'Identity Kit copy and artifacts do not reuse pure generator hype grammar.',
  'KR lane ecology (lolKoreanLane + krIntentSignatures) stays disjoint from global STYLE_DEFS recycling.',
  'TOOL generators do not inject typography into Identity artifact pipelines without explicit tier bridge.',
]);

/**
 * Surfaces where tier mixing risk remains until route-level metadata exists.
 */
export const HIGH_LEAKAGE_RISK_SURFACES = Object.freeze([
  'HomePage — combines Identity hero, TOOL quick sample, and HYBRID trending.',
  'SeoTemplate — single shell; KR identity lane vs default programmatic TOOL must stay slug-aware.',
  'LeagueOfLegendsHubPage — HYBRID routing to lanes that may be TOOL or IDENTITY.',
]);

/**
 * Minimum bar to promote a surface from TOOL → HYBRID → IDENTITY (governance checklist).
 */
export const MIGRATION_REQUIREMENTS = Object.freeze({
  tool_to_hybrid: [
    'Editorial framing present (not raw generator-only).',
    'Quick modes bounded; no unbounded mutation chains.',
    'Visual energy stepped down one notch vs pure TOOL.',
  ],
  hybrid_to_identity: [
    'Grammar passes IDENTITY disallowed list.',
    'Typography-first or artifact-ready layout; reduced SEO gimmick density.',
    'Isolated ecology OR explicit composition profile (e.g. lol-kr-minimal).',
  ],
});

/**
 * @param {string} pathname — e.g. window.location.pathname
 * @returns {ExperienceTier}
 */
export function resolveExperienceTierForPath(pathname) {
  const p = String(pathname || '/').replace(/\/+$/, '') || '/';
  for (const rule of ROUTE_TIER_RULES) {
    if (rule.test.test(p)) return rule.tier;
  }
  // Programmatic SEO: /category/keyword
  if (/^\/[^/]+\/[^/]+$/.test(p)) return EXPERIENCE_TIER.TOOL;
  return EXPERIENCE_TIER.TOOL;
}
