export const COSMETIC_TYPES = Object.freeze({
  THEME: 'theme',
  BORDER: 'border',
  BADGE: 'badge',
  BACKGROUND: 'background',
  NAMEPLATE: 'nameplate',
  EFFECT: 'effect',
});

export const FUTURE_COSMETIC_TYPES = Object.freeze([
  'companion',
  'pet',
  'layout',
  'sticker',
  'avatar_frame_3d',
]);

export const COSMETIC_CATEGORIES = Object.freeze({
  CORE: 'core',
  FREE: 'free',
  EARNED: 'earned',
  FOUNDER: 'founder',
  LEGACY: 'legacy',
  SEASONAL: 'seasonal',
  PREMIUM_PREVIEW: 'premium_preview',
  LOCKED: 'locked',
});

export const COSMETIC_STATUSES = Object.freeze({
  ACTIVE: 'active',
  RESERVED: 'reserved',
  LOCKED: 'locked',
});

const BASE_POLICY = Object.freeze({
  thirdPartyAssets: false,
  impliesRank: false,
  impliesVerification: false,
  mutatesProofTruth: false,
  providerLocked: false,
});

function cosmetic(input) {
  return Object.freeze({
    ...input,
    tags: Object.freeze(input.tags || ['tryhardnames_owned', 'visual_only']),
    policy: Object.freeze({ ...BASE_POLICY, ...(input.policy || {}) }),
  });
}

export const COSMETIC_CATALOG = Object.freeze([
  cosmetic({
    id: 'theme.clean-dark',
    type: COSMETIC_TYPES.THEME,
    name: 'Clean Dark',
    description: 'A quiet dark Passport baseline for readable identity scenes.',
    category: COSMETIC_CATEGORIES.CORE,
    rarity: 'core',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'border.default-frame',
    type: COSMETIC_TYPES.BORDER,
    name: 'Default Frame',
    description: 'A restrained frame for every Passport draft.',
    category: COSMETIC_CATEGORIES.CORE,
    rarity: 'core',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'background.soft-shadow',
    type: COSMETIC_TYPES.BACKGROUND,
    name: 'Soft Shadow',
    description: 'Soft depth behind the Passport header.',
    category: COSMETIC_CATEGORIES.CORE,
    rarity: 'core',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'nameplate.minimal-tag',
    type: COSMETIC_TYPES.NAMEPLATE,
    name: 'Minimal Tag',
    description: 'A clean nameplate that keeps the alias legible.',
    category: COSMETIC_CATEGORIES.CORE,
    rarity: 'core',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'effect.none',
    type: COSMETIC_TYPES.EFFECT,
    name: 'No Effect',
    description: 'No decorative effect.',
    category: COSMETIC_CATEGORIES.CORE,
    rarity: 'core',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'badge.starter',
    type: COSMETIC_TYPES.BADGE,
    name: 'Starter',
    description: 'A visual-only starter mark for new Passport drafts.',
    category: COSMETIC_CATEGORIES.FREE,
    rarity: 'free',
    availability: 'free_core',
    unlockSource: 'core',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'badge.profile-complete',
    type: COSMETIC_TYPES.BADGE,
    name: 'Profile Complete',
    description: 'Earned-ready visual for completing alias and bio basics.',
    category: COSMETIC_CATEGORIES.EARNED,
    rarity: 'earned',
    availability: 'earned_ready',
    unlockSource: 'profile_complete',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'badge.saved-names-collector',
    type: COSMETIC_TYPES.BADGE,
    name: 'Saved Names Collector',
    description: 'Earned-ready visual for keeping a set of favorite names.',
    category: COSMETIC_CATEGORIES.EARNED,
    rarity: 'earned',
    availability: 'earned_ready',
    unlockSource: 'saved_names_collector',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'badge.slug-claimed',
    type: COSMETIC_TYPES.BADGE,
    name: 'Slug Claimed',
    description: 'Earned-ready visual for preparing a public slug command.',
    category: COSMETIC_CATEGORIES.EARNED,
    rarity: 'earned',
    availability: 'earned_ready',
    unlockSource: 'slug_claimed',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'badge.published-passport',
    type: COSMETIC_TYPES.BADGE,
    name: 'Passport Published',
    description: 'Earned-ready visual for a policy-valid published Passport.',
    category: COSMETIC_CATEGORIES.EARNED,
    rarity: 'earned',
    availability: 'earned_ready',
    unlockSource: 'passport_published',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'border.identity-builder',
    type: COSMETIC_TYPES.BORDER,
    name: 'Identity Builder',
    description: 'Earned-ready border for owners shaping a complete identity draft.',
    category: COSMETIC_CATEGORIES.EARNED,
    rarity: 'earned',
    availability: 'earned_ready',
    unlockSource: 'identity_builder',
    status: COSMETIC_STATUSES.ACTIVE,
  }),
  cosmetic({
    id: 'theme.obsidian-pulse',
    type: COSMETIC_TYPES.THEME,
    name: 'Obsidian Pulse',
    description: 'Deep obsidian surfaces with cyan and violet pulse accents.',
    category: COSMETIC_CATEGORIES.PREMIUM_PREVIEW,
    rarity: 'premium_preview',
    availability: 'free_foundation_preview',
    unlockSource: 'foundation_preview',
    status: COSMETIC_STATUSES.ACTIVE,
    tags: ['tryhardnames_owned', 'visual_only', 'foundation_preview'],
  }),
  cosmetic({
    id: 'border.pulse-frame',
    type: COSMETIC_TYPES.BORDER,
    name: 'Pulse Frame',
    description: 'A cyan-violet frame paired with Obsidian Pulse.',
    category: COSMETIC_CATEGORIES.PREMIUM_PREVIEW,
    rarity: 'premium_preview',
    availability: 'free_foundation_preview',
    unlockSource: 'foundation_preview',
    status: COSMETIC_STATUSES.ACTIVE,
    tags: ['tryhardnames_owned', 'visual_only', 'foundation_preview'],
  }),
  cosmetic({
    id: 'background.obsidian-aura',
    type: COSMETIC_TYPES.BACKGROUND,
    name: 'Obsidian Aura',
    description: 'A dark visual-only aura for Passport presentation.',
    category: COSMETIC_CATEGORIES.PREMIUM_PREVIEW,
    rarity: 'premium_preview',
    availability: 'free_foundation_preview',
    unlockSource: 'foundation_preview',
    status: COSMETIC_STATUSES.ACTIVE,
    tags: ['tryhardnames_owned', 'visual_only', 'foundation_preview'],
  }),
  cosmetic({
    id: 'nameplate.pulse-nameplate',
    type: COSMETIC_TYPES.NAMEPLATE,
    name: 'Pulse Nameplate',
    description: 'A compact pulse-accented nameplate for aliases.',
    category: COSMETIC_CATEGORIES.PREMIUM_PREVIEW,
    rarity: 'premium_preview',
    availability: 'free_foundation_preview',
    unlockSource: 'foundation_preview',
    status: COSMETIC_STATUSES.ACTIVE,
    tags: ['tryhardnames_owned', 'visual_only', 'foundation_preview'],
  }),
  cosmetic({
    id: 'effect.soft-glow',
    type: COSMETIC_TYPES.EFFECT,
    name: 'Soft Glow',
    description: 'A restrained glow effect that does not alter proof truth.',
    category: COSMETIC_CATEGORIES.PREMIUM_PREVIEW,
    rarity: 'premium_preview',
    availability: 'free_foundation_preview',
    unlockSource: 'foundation_preview',
    status: COSMETIC_STATUSES.ACTIVE,
    tags: ['tryhardnames_owned', 'visual_only', 'foundation_preview'],
  }),
  cosmetic({
    id: 'badge.founder-reserved',
    type: COSMETIC_TYPES.BADGE,
    name: 'Founder Reserved',
    description: 'Reserved category placeholder. Not active or equipable in PR21.',
    category: COSMETIC_CATEGORIES.FOUNDER,
    rarity: 'founder',
    availability: 'reserved',
    unlockSource: 'future_founder_policy',
    status: COSMETIC_STATUSES.RESERVED,
  }),
  cosmetic({
    id: 'badge.legacy-reserved',
    type: COSMETIC_TYPES.BADGE,
    name: 'Legacy Reserved',
    description: 'Reserved category placeholder. Not active or equipable in PR21.',
    category: COSMETIC_CATEGORIES.LEGACY,
    rarity: 'legacy',
    availability: 'reserved',
    unlockSource: 'future_legacy_policy',
    status: COSMETIC_STATUSES.RESERVED,
  }),
]);

const CATALOG_BY_ID = new Map(COSMETIC_CATALOG.map((item) => [item.id, item]));

export function listCosmetics() {
  return COSMETIC_CATALOG;
}

export function getCosmeticById(id) {
  return CATALOG_BY_ID.get(String(id || '')) || null;
}

export function isKnownCosmeticId(id) {
  return CATALOG_BY_ID.has(String(id || ''));
}

export function listCosmeticsByType(type) {
  return COSMETIC_CATALOG.filter((item) => item.type === type);
}

export function listCosmeticsByCategory(category) {
  return COSMETIC_CATALOG.filter((item) => item.category === category);
}

export function listAvailableFoundationCosmetics() {
  return COSMETIC_CATALOG.filter((item) => (
    item.status === COSMETIC_STATUSES.ACTIVE &&
    ['free_core', 'free_foundation_preview'].includes(item.availability)
  ));
}

export function isActiveCosmetic(cosmetic) {
  return Boolean(cosmetic && cosmetic.status === COSMETIC_STATUSES.ACTIVE);
}

export function isEquipableCosmetic(cosmetic) {
  return isActiveCosmetic(cosmetic) && cosmetic.availability !== 'reserved';
}
