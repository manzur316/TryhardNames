import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  COSMETIC_CATEGORIES,
  COSMETIC_CATALOG,
  COSMETIC_STATUSES,
  COSMETIC_TYPES,
  FUTURE_COSMETIC_TYPES,
  MAX_EQUIPPED_BADGES,
  assertCosmeticCatalogPolicySafe,
  assertNoCosmeticTruthMutation,
  buildDefaultCosmeticLoadout,
  getCosmeticById,
  getCosmeticPresentationTokens,
  getEarnedCosmeticUnlockHints,
  isEquipableCosmetic,
  listAvailableFoundationCosmetics,
  sanitizeCosmeticLoadout,
} from '../../src/gaming-passport/cosmetics/index.js';

const ids = COSMETIC_CATALOG.map((item) => item.id);

describe('Passport cosmetics catalog', () => {
  it('contains the required core/free foundation cosmetics', () => {
    [
      'theme.clean-dark',
      'border.default-frame',
      'background.soft-shadow',
      'nameplate.minimal-tag',
      'effect.none',
      'badge.starter',
    ].forEach((id) => assert.ok(ids.includes(id), id));

    const defaults = buildDefaultCosmeticLoadout();
    assert.equal(defaults.themeId, 'theme.clean-dark');
    assert.deepEqual(defaults.equippedCosmeticIds, [
      'border.default-frame',
      'background.soft-shadow',
      'nameplate.minimal-tag',
      'effect.none',
      'badge.starter',
    ]);
  });

  it('ships Obsidian Pulse as a free foundation preview, not a purchase', () => {
    const obsidian = getCosmeticById('theme.obsidian-pulse');

    assert.equal(obsidian.name, 'Obsidian Pulse');
    assert.equal(obsidian.category, COSMETIC_CATEGORIES.PREMIUM_PREVIEW);
    assert.equal(obsidian.availability, 'free_foundation_preview');
    assert.equal(obsidian.unlockSource, 'foundation_preview');
    assert.equal(obsidian.status, COSMETIC_STATUSES.ACTIVE);
    assert.equal(isEquipableCosmetic(obsidian), true);
    assert.equal(JSON.stringify(obsidian).includes('price'), false);
    assert.equal(JSON.stringify(obsidian).includes('purchase'), false);
  });

  it('keeps the catalog TryhardNames-owned, visual-only, and safe for proof truth', () => {
    const policy = assertCosmeticCatalogPolicySafe(COSMETIC_CATALOG);
    assert.equal(policy.ok, true, policy.unsafeIds.join(', '));

    const catalogText = JSON.stringify(COSMETIC_CATALOG);
    assert.doesNotMatch(catalogText, /Riot|Valorant|League of Legends|\bLoL\b|Discord/i);
    assert.doesNotMatch(catalogText, /Radiant|Immortal|Challenger|Grandmaster|Diamond|Platinum|Gold|Silver|Bronze|Iron/i);
    assert.equal(assertNoCosmeticTruthMutation({
      themeId: 'theme.obsidian-pulse',
      equippedCosmeticIds: ['border.pulse-frame', 'badge.starter'],
    }).ok, true);
  });

  it('models earned-ready and reserved categories without making reserved items equipable', () => {
    [
      'badge.profile-complete',
      'badge.saved-names-collector',
      'badge.slug-claimed',
      'badge.published-passport',
      'border.identity-builder',
    ].forEach((id) => {
      const item = getCosmeticById(id);
      assert.equal(item.category, COSMETIC_CATEGORIES.EARNED);
      assert.equal(item.availability, 'earned_ready');
      assert.equal(item.status, COSMETIC_STATUSES.ACTIVE);
    });

    for (const id of ['badge.founder-reserved', 'badge.legacy-reserved']) {
      const item = getCosmeticById(id);
      assert.equal(item.status, COSMETIC_STATUSES.RESERVED);
      assert.equal(isEquipableCosmetic(item), false);
    }
  });

  it('documents future companions without activating companion runtime cosmetics', () => {
    assert.ok(FUTURE_COSMETIC_TYPES.includes('companion'));
    assert.ok(FUTURE_COSMETIC_TYPES.includes('pet'));
    assert.ok(FUTURE_COSMETIC_TYPES.includes('avatar_frame_3d'));
    assert.equal(COSMETIC_CATALOG.some((item) => FUTURE_COSMETIC_TYPES.includes(item.type)), false);
  });
});

describe('Passport cosmetic loadout sanitizer', () => {
  it('strips unknown, duplicate, reserved, and theme-in-equipped cosmetic IDs', () => {
    const loadout = sanitizeCosmeticLoadout({
      themeId: 'theme.obsidian-pulse',
      equippedCosmeticIds: [
        'border.pulse-frame',
        'border.identity-builder',
        'background.obsidian-aura',
        'nameplate.pulse-nameplate',
        'effect.soft-glow',
        'badge.starter',
        'badge.starter',
        'badge.profile-complete',
        'badge.saved-names-collector',
        'badge.slug-claimed',
        'badge.founder-reserved',
        'theme.clean-dark',
        'unknown.cosmetic',
      ],
    });

    assert.equal(loadout.themeId, 'theme.obsidian-pulse');
    assert.equal(loadout.equippedCosmeticIds.includes('unknown.cosmetic'), false);
    assert.equal(loadout.equippedCosmeticIds.includes('badge.founder-reserved'), false);
    assert.equal(loadout.equippedCosmeticIds.includes('theme.clean-dark'), false);
    assert.equal(loadout.equippedCosmeticIds.filter((id) => id === 'badge.starter').length, 1);
  });

  it('keeps one single-slot cosmetic and caps badges at three', () => {
    const loadout = sanitizeCosmeticLoadout({
      themeId: 'missing-theme',
      equippedCosmeticIds: [
        'border.identity-builder',
        'border.pulse-frame',
        'background.obsidian-aura',
        'nameplate.pulse-nameplate',
        'effect.soft-glow',
        'badge.starter',
        'badge.profile-complete',
        'badge.saved-names-collector',
        'badge.slug-claimed',
        'badge.published-passport',
      ],
    });

    const equippedTypes = loadout.equippedCosmeticIds.map((id) => getCosmeticById(id)?.type);
    assert.equal(loadout.themeId, 'theme.clean-dark');
    assert.equal(equippedTypes.filter((type) => type === COSMETIC_TYPES.BORDER).length, 1);
    assert.equal(equippedTypes.filter((type) => type === COSMETIC_TYPES.BACKGROUND).length, 1);
    assert.equal(equippedTypes.filter((type) => type === COSMETIC_TYPES.NAMEPLATE).length, 1);
    assert.equal(equippedTypes.filter((type) => type === COSMETIC_TYPES.EFFECT).length, 1);
    assert.equal(equippedTypes.filter((type) => type === COSMETIC_TYPES.BADGE).length, MAX_EQUIPPED_BADGES);
  });

  it('returns explicit presentation tokens without using raw cosmetic IDs as classes', () => {
    const tokens = getCosmeticPresentationTokens({
      themeId: 'theme.obsidian-pulse',
      equippedCosmeticIds: ['border.pulse-frame', 'background.obsidian-aura', 'nameplate.pulse-nameplate', 'effect.soft-glow'],
    });

    assert.equal(tokens.loadout.themeId, 'theme.obsidian-pulse');
    assert.match(tokens.shellClassName, /border-cyan/);
    assert.match(tokens.nameplateClassName, /cyan/);
    assert.doesNotMatch(tokens.shellClassName, /theme\.obsidian-pulse|border\.pulse-frame/);
  });

  it('uses only internal milestones for earned cosmetic hints', () => {
    const hints = getEarnedCosmeticUnlockHints(
      { alias: 'PlayerOne', bioShort: 'Testing private identity.', slug: 'player-one', status: 'published' },
      ['ClutchTag', 'AuraTag', 'PulseTag']
    );

    assert.equal(hints.profile_complete, true);
    assert.equal(hints.saved_names_collector, true);
    assert.equal(hints.slug_claimed, true);
    assert.equal(hints.passport_published, true);
    assert.equal(hints.identity_builder, true);

    assert.ok(listAvailableFoundationCosmetics().some((item) => item.id === 'theme.obsidian-pulse'));
  });
});
