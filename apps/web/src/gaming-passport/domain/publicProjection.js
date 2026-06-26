import {
  getFeaturedVerifiedProofs,
  getPublicLinkedProviderAccounts,
  canServePublishedPassport,
} from './publicationPolicy.js';
import { sanitizeCosmeticLoadout } from '../cosmetics/cosmeticLoadout.js';

function optionalString(value) {
  const text = String(value || '').trim();
  return text.length ? text : undefined;
}

function projectLinkedProvider(account) {
  return {
    provider: account.provider,
    displayName: optionalString(account.displayName),
    verifiedAt: optionalString(account.verifiedAt),
    lastSyncedAt: optionalString(account.lastSyncedAt),
  };
}

function projectProof(proof) {
  return {
    provider: proof.provider,
    game: proof.game || null,
    proofType: proof.proofType,
    mode: proof.mode,
    title: proof.title,
    displayValue: proof.displayValue,
    season: optionalString(proof.season),
    status: proof.status,
    verifiedAt: proof.verifiedAt,
    lastSyncedAt: optionalString(proof.lastSyncedAt),
    staleAt: optionalString(proof.staleAt),
  };
}

export function buildPublicPassportProjection({
  passport,
  linkedProviderAccounts,
  verifiedProofs,
  featuredProofIds,
  maxFeaturedProofs = 6,
} = {}) {
  if (!canServePublishedPassport({ passport, linkedProviderAccounts })) return null;

  const linkedProviders = getPublicLinkedProviderAccounts(linkedProviderAccounts).map(projectLinkedProvider);
  const cosmeticLoadout = sanitizeCosmeticLoadout({
    themeId: passport.themeId || passport.sceneConfig?.themeId,
    equippedCosmeticIds: passport.equippedCosmeticIds || passport.sceneConfig?.equippedCosmeticIds,
  });
  const featuredProofs = getFeaturedVerifiedProofs({
    proofs: verifiedProofs,
    featuredProofIds,
    linkedProviderAccounts,
    max: maxFeaturedProofs,
  }).map(projectProof);

  return {
    slug: passport.slug,
    alias: optionalString(passport.alias),
    avatarUrl: optionalString(passport.avatarUrl),
    publishedAt: optionalString(passport.publishedAt),
    updatedAt: optionalString(passport.updatedAt),
    scene: cosmeticLoadout,
    linkedProviders,
    featuredProofs,
  };
}
