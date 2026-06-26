import {
  COSMETIC_CATALOG,
  COSMETIC_STATUSES,
  FUTURE_COSMETIC_TYPES,
  isActiveCosmetic,
} from './cosmeticCatalog.js';

const FORBIDDEN_THIRD_PARTY_TERMS = [
  /riot/i,
  /valorant/i,
  /league\s*of\s*legends/i,
  /\blol\b/i,
  /discord/i,
];

const FORBIDDEN_RANK_TERMS = [
  /\biron\b/i,
  /\bbronze\b/i,
  /\bsilver\b/i,
  /\bgold\b/i,
  /\bplatinum\b/i,
  /\bdiamond\b/i,
  /\bmaster\b/i,
  /\bgrandmaster\b/i,
  /\bchallenger\b/i,
  /\bradiant\b/i,
  /\bimmortal\b/i,
];

const FORBIDDEN_TRUTH_TERMS = [
  /verified/i,
  /proof/i,
  /rank\s*boost/i,
  /boost/i,
];

export function isCosmeticPolicySafe(cosmetic) {
  if (!cosmetic || typeof cosmetic !== 'object') return false;
  const text = [
    cosmetic.id,
    cosmetic.name,
    cosmetic.description,
    cosmetic.rarity,
    cosmetic.availability,
    cosmetic.unlockSource,
    ...(Array.isArray(cosmetic.tags) ? cosmetic.tags : []),
  ].join(' ');
  const identityText = [
    cosmetic.id,
    cosmetic.name,
    cosmetic.rarity,
    cosmetic.availability,
    cosmetic.unlockSource,
    ...(Array.isArray(cosmetic.tags) ? cosmetic.tags : []),
  ].join(' ');

  if (FORBIDDEN_THIRD_PARTY_TERMS.some((pattern) => pattern.test(text))) return false;
  if (FORBIDDEN_RANK_TERMS.some((pattern) => pattern.test(identityText))) return false;
  if (cosmetic.status === COSMETIC_STATUSES.ACTIVE && FORBIDDEN_TRUTH_TERMS.some((pattern) => pattern.test(identityText))) {
    return false;
  }
  if (FUTURE_COSMETIC_TYPES.includes(cosmetic.type) && cosmetic.status === COSMETIC_STATUSES.ACTIVE) return false;

  return Boolean(
    cosmetic.policy &&
      cosmetic.policy.thirdPartyAssets === false &&
      cosmetic.policy.impliesRank === false &&
      cosmetic.policy.impliesVerification === false &&
      cosmetic.policy.mutatesProofTruth === false &&
      cosmetic.policy.providerLocked === false
  );
}

export function assertCosmeticCatalogPolicySafe(catalog = COSMETIC_CATALOG) {
  const unsafe = catalog.filter((item) => !isCosmeticPolicySafe(item));
  return {
    ok: unsafe.length === 0,
    unsafeIds: unsafe.map((item) => item.id),
  };
}

export function assertNoCosmeticTruthMutation(loadout = {}) {
  const ids = [
    loadout.themeId,
    ...(Array.isArray(loadout.equippedCosmeticIds) ? loadout.equippedCosmeticIds : []),
  ].filter(Boolean);

  const unsafe = ids.filter((id) => /verified|proof|rank|boost|riot|valorant|discord/i.test(String(id)));
  return {
    ok: unsafe.length === 0,
    unsafeIds: unsafe,
  };
}

export function isCosmeticPubliclyRenderable(cosmetic) {
  return isActiveCosmetic(cosmetic) && isCosmeticPolicySafe(cosmetic);
}
