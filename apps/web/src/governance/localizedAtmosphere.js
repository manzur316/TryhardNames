/**
 * Localized atmosphere governance — where emotional energy may live (and where it must not).
 *
 * Official direction: “curated prestige gaming atmosphere” — NOT cold editorial minimalism,
 * NOT RGB SaaS. Energy is focal and intentional, never global noise.
 *
 * Pairs with {@link ./experienceTiers.js} (experience tier ≠ atmosphere band; correlate via maps below).
 *
 * @module governance/localizedAtmosphere
 */

import { EXPERIENCE_TIER } from './experienceTiers.js';

/** Canonical phrase for reviews / lint comments / design QA */
export const ATMOSPHERE_PRINCIPLE =
  'Controlled emotional atmosphere — localized prestige, not visual chaos.';

/**
 * Atmosphere “bands” — emotional energy budget by surface role.
 * Not the same as experience tier: tier = product grammar; band = lighting/motion budget.
 */
export const ATMOSPHERE_BAND = Object.freeze({
  /** Emotional gateway: highest aspirational lighting allowed (still no carnival). */
  ASPIRATIONAL_GATEWAY: 'aspirational_gateway',
  /** Depth and readability; restrained glow; no competing focal stacks. */
  PROGRAMMATIC_DEPTH: 'programmatic_depth',
  /** Calm prestige — typography-first, minimal concurrent accents. */
  PREMIUM_CALM: 'premium_calm',
  /** Tool clarity — interaction feedback only; no atmospheric stacks. */
  UTILITY_CLEAR: 'utility_clear',
});

/** @typedef {keyof typeof ATMOSPHERE_BAND extends string ? (typeof ATMOSPHERE_BAND)[keyof typeof ATMOSPHERE_BAND] : never} AtmosphereBand */

/**
 * Allowed glow vocabulary — implement only where band permits (CSS shadows / radial overlays).
 */
export const GLOW_GOVERNANCE = Object.freeze({
  [ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY]: {
    allowed: [
      'Single primary focal stack (e.g. hero bloom + vignette).',
      'CTA hover luminance (one accent family: cyan and/or violet, not both fighting).',
      'One secondary cluster max (e.g. generator card edge light on home).',
    ],
    disallowed: [
      'Viewport-wide animated glow.',
      'Same-frame competing hero + grid + nav + footer all glowing.',
      'RGB gradient borders on every card.',
    ],
  },
  [ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH]: {
    allowed: [
      'Page shell depth (layered radial + vignette).',
      'Section cards: refined shadow or single edge accent — not both at max everywhere.',
    ],
    disallowed: [
      'Breathing animation on every section.',
      'Trending/module chrome duplicating hero energy at full intensity.',
    ],
  },
  [ATMOSPHERE_BAND.PREMIUM_CALM]: {
    allowed: [
      'Soft top wash or single quiet radial.',
      'Inset typography shadow for legibility only.',
    ],
    disallowed: [
      'Pulsing glows.',
      'High-frequency hover luminance on dense controls.',
    ],
  },
  [ATMOSPHERE_BAND.UTILITY_CLEAR]: {
    allowed: ['Standard focus rings', 'subtle hover border shift'],
    disallowed: ['Decorative glow layers', 'ambient animation'],
  },
});

/**
 * Motion governance — lightweight CSS only; respect prefers-reduced-motion.
 */
export const MOTION_GOVERNANCE = Object.freeze({
  [ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY]: {
    allowed: ['Opacity-only ambient drift on a single decorative layer (slow, ≥14s).', 'CSS transition on hover (shadow/border)'],
    disallowed: ['Parallax stacks', 'continuous bg drift on full page', 'staggered motion on every child'],
  },
  [ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH]: {
    allowed: ['CSS transitions on interactive elements'],
    disallowed: ['Looping section animations', 'Framer choreographed entrances on long-scroll pages'],
  },
  [ATMOSPHERE_BAND.PREMIUM_CALM]: {
    allowed: ['Near-static transitions', 'opacity for disclosure'],
    disallowed: ['Ambient loops', 'scale-bounce emphasis'],
  },
  [ATMOSPHERE_BAND.UTILITY_CLEAR]: {
    allowed: ['Micro-feedback (copy, toggle)'],
    disallowed: ['Ambient loops'],
  },
});

/**
 * CTA / emotional intent — copy tone is governed elsewhere; this flags *chrome* treatment.
 */
export const CTA_ENERGY = Object.freeze({
  ASPIRATIONAL: 'aspirational', // primary gateway CTAs — may use strongest restrained luminance
  SUPPORTING: 'supporting', // secondary links — border/shadow one notch quieter
  FUNCTIONAL: 'functional', // utility only — no prestige glow
});

/** Route / surface keys → atmosphere band (refine as routes grow). */
export const SURFACE_ATMOSPHERE_BAND = Object.freeze({
  '/': ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY,
  HomePage: ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY,
  HeroIdentitySection: ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY,
  '/identity-kit': ATMOSPHERE_BAND.PREMIUM_CALM,
  IdentityKitPage: ATMOSPHERE_BAND.PREMIUM_CALM,
  '/league-of-legends/korean': ATMOSPHERE_BAND.PREMIUM_CALM,
  LeagueOfLegendsHubPage: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  TopicHubPage: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  SeoTemplate: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  DynamicPage: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  TrendingNamesModule: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  TrendingNamesSection: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  GamerBioGeneratorPage: ATMOSPHERE_BAND.UTILITY_CLEAR,
  StylishTextGeneratorPage: ATMOSPHERE_BAND.UTILITY_CLEAR,
  NicknameSymbolsPage: ATMOSPHERE_BAND.UTILITY_CLEAR,
});

/**
 * Correlation: experience tier ↔ default atmosphere band (not 1:1).
 */
export const TIER_DEFAULT_ATMOSPHERE = Object.freeze({
  [EXPERIENCE_TIER.TOOL]: ATMOSPHERE_BAND.PROGRAMMATIC_DEPTH,
  [EXPERIENCE_TIER.HYBRID]: ATMOSPHERE_BAND.ASPIRATIONAL_GATEWAY,
  [EXPERIENCE_TIER.IDENTITY]: ATMOSPHERE_BAND.PREMIUM_CALM,
});

/** When tier and route disagree (e.g. HYBRID home), route/surface map wins for atmosphere. */
export const ATMOSPHERE_PRECEDENCE_NOTE =
  'SURFACE_ATMOSPHERE_BAND overrides TIER_DEFAULT_ATMOSPHERE when both apply; document exceptions in PRs.';
