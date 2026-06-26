import {
  COSMETIC_TYPES,
  getCosmeticById,
  isEquipableCosmetic,
} from './cosmeticCatalog.js';
import {
  assertNoCosmeticTruthMutation,
  isCosmeticPubliclyRenderable,
} from './cosmeticPolicy.js';

export const MAX_EQUIPPED_BADGES = 3;

const SINGLE_EQUIP_TYPES = new Set([
  COSMETIC_TYPES.BORDER,
  COSMETIC_TYPES.BACKGROUND,
  COSMETIC_TYPES.NAMEPLATE,
  COSMETIC_TYPES.EFFECT,
]);

const DEFAULT_THEME_ID = 'theme.clean-dark';
const DEFAULT_EQUIPPED_IDS = Object.freeze([
  'border.default-frame',
  'background.soft-shadow',
  'nameplate.minimal-tag',
  'effect.none',
  'badge.starter',
]);

const TYPE_ORDER = Object.freeze({
  [COSMETIC_TYPES.BORDER]: 1,
  [COSMETIC_TYPES.BACKGROUND]: 2,
  [COSMETIC_TYPES.NAMEPLATE]: 3,
  [COSMETIC_TYPES.EFFECT]: 4,
  [COSMETIC_TYPES.BADGE]: 5,
});

const THEME_CLASSES = Object.freeze({
  'theme.clean-dark': {
    shell: 'border-slate-200 bg-white/90 text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-white',
    chip: 'border-slate-300 bg-white text-slate-700 dark:border-white/15 dark:bg-black/30 dark:text-slate-200',
    heading: 'text-slate-950 dark:text-white',
    body: 'text-slate-700 dark:text-slate-200',
  },
  'theme.obsidian-pulse': {
    shell: 'border-cyan-300/70 bg-slate-950 text-white shadow-[0_0_44px_rgba(34,211,238,0.14)] dark:border-cyan-300/50 dark:bg-slate-950',
    chip: 'border-cyan-300/50 bg-cyan-300/10 text-cyan-50',
    heading: 'text-white',
    body: 'text-slate-200',
  },
});

const BORDER_CLASSES = Object.freeze({
  'border.default-frame': 'border-slate-200 dark:border-white/10',
  'border.identity-builder': 'border-emerald-300/80 dark:border-emerald-300/40',
  'border.pulse-frame': 'border-cyan-300/80 ring-1 ring-violet-300/40 dark:border-cyan-300/50',
});

const BACKGROUND_CLASSES = Object.freeze({
  'background.soft-shadow': 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900',
  'background.obsidian-aura': 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),linear-gradient(135deg,#020617,#111827_55%,#1e1b4b)]',
});

const NAMEPLATE_CLASSES = Object.freeze({
  'nameplate.minimal-tag': 'rounded-md bg-white/75 px-3 py-1 dark:bg-white/10',
  'nameplate.pulse-nameplate': 'rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-cyan-50',
});

const EFFECT_CLASSES = Object.freeze({
  'effect.none': '',
  'effect.soft-glow': 'motion-safe:transition-shadow motion-safe:hover:shadow-[0_0_52px_rgba(34,211,238,0.2)]',
});

export function buildDefaultCosmeticLoadout() {
  return {
    themeId: DEFAULT_THEME_ID,
    equippedCosmeticIds: [...DEFAULT_EQUIPPED_IDS],
  };
}

export function sanitizeCosmeticLoadout(input = {}) {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const rawThemeId = source.themeId;
  const theme = getCosmeticById(rawThemeId);
  const themeId = theme?.type === COSMETIC_TYPES.THEME && isCosmeticPubliclyRenderable(theme)
    ? theme.id
    : DEFAULT_THEME_ID;

  const rawIds = Array.isArray(source.equippedCosmeticIds) ? source.equippedCosmeticIds : DEFAULT_EQUIPPED_IDS;
  const seen = new Set();
  const singleByType = new Map();
  const badges = [];

  for (const rawId of rawIds) {
    const id = String(rawId || '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const cosmetic = getCosmeticById(id);
    if (!isEquipableCosmetic(cosmetic) || !isCosmeticPubliclyRenderable(cosmetic)) continue;
    if (cosmetic.type === COSMETIC_TYPES.THEME) continue;

    if (SINGLE_EQUIP_TYPES.has(cosmetic.type)) {
      if (!singleByType.has(cosmetic.type)) singleByType.set(cosmetic.type, cosmetic.id);
      continue;
    }

    if (cosmetic.type === COSMETIC_TYPES.BADGE && badges.length < MAX_EQUIPPED_BADGES) {
      badges.push(cosmetic.id);
    }
  }

  const equippedCosmeticIds = [
    ...[...singleByType.entries()]
      .sort(([a], [b]) => (TYPE_ORDER[a] || 99) - (TYPE_ORDER[b] || 99))
      .map(([, id]) => id),
    ...badges,
  ];

  const loadout = { themeId, equippedCosmeticIds };
  return assertNoCosmeticTruthMutation(loadout).ok ? loadout : buildDefaultCosmeticLoadout();
}

export function getCosmeticPresentationTokens(input = {}) {
  const loadout = sanitizeCosmeticLoadout(input);
  const cosmetics = loadout.equippedCosmeticIds.map(getCosmeticById).filter(Boolean);
  const byType = new Map(cosmetics.map((item) => [item.type, item]));
  const badges = cosmetics.filter((item) => item.type === COSMETIC_TYPES.BADGE);
  const theme = THEME_CLASSES[loadout.themeId] || THEME_CLASSES[DEFAULT_THEME_ID];
  const borderId = byType.get(COSMETIC_TYPES.BORDER)?.id || 'border.default-frame';
  const backgroundId = byType.get(COSMETIC_TYPES.BACKGROUND)?.id || 'background.soft-shadow';
  const nameplateId = byType.get(COSMETIC_TYPES.NAMEPLATE)?.id || 'nameplate.minimal-tag';
  const effectId = byType.get(COSMETIC_TYPES.EFFECT)?.id || 'effect.none';

  return {
    loadout,
    theme,
    badges,
    activeCosmetics: [
      getCosmeticById(loadout.themeId),
      ...cosmetics,
    ].filter(Boolean),
    shellClassName: [
      'rounded-lg border',
      theme.shell,
      BORDER_CLASSES[borderId] || BORDER_CLASSES['border.default-frame'],
      BACKGROUND_CLASSES[backgroundId] || BACKGROUND_CLASSES['background.soft-shadow'],
      EFFECT_CLASSES[effectId] || '',
    ].filter(Boolean).join(' '),
    nameplateClassName: NAMEPLATE_CLASSES[nameplateId] || NAMEPLATE_CLASSES['nameplate.minimal-tag'],
    chipClassName: theme.chip,
    headingClassName: theme.heading,
    bodyClassName: theme.body,
  };
}

export function getEarnedCosmeticUnlockHints(passport = {}, savedNames = []) {
  const savedCount = Array.isArray(savedNames) ? savedNames.filter(Boolean).length : 0;
  const profileComplete = Boolean(passport?.alias?.trim?.()) && Boolean(passport?.bioShort?.trim?.());
  const slugClaimed = Boolean(passport?.slug);
  const passportPublished = passport?.status === 'published';

  return {
    profile_complete: profileComplete,
    saved_names_collector: savedCount >= 3,
    slug_claimed: slugClaimed,
    passport_published: passportPublished,
    identity_builder: profileComplete && savedCount > 0,
  };
}
