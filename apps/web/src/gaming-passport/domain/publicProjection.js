import { PASSPORT_STATUSES, PROOF_VISIBILITY } from './constants.js';
import { normalizePublicSlug, pickMetadataSafe } from './contracts.js';
import {
  getFeaturedVerifiedProofs,
  getVerifiedLinkedProviderAccounts,
  isPassportPublishable,
} from './publicationPolicy.js';

function optionalString(value) {
  const text = String(value || '').trim();
  return text.length ? text : undefined;
}

function projectLinkedProvider(account) {
  return {
    id: account.id,
    provider: account.provider,
    displayName: optionalString(account.displayName),
    status: account.status,
    verifiedAt: optionalString(account.verifiedAt),
    lastSyncedAt: optionalString(account.lastSyncedAt),
  };
}

function projectProof(proof) {
  const out = {
    id: proof.id,
    provider: proof.provider,
    game: proof.game || null,
    proofType: proof.proofType,
    sourceKey: proof.sourceKey,
    mode: proof.mode,
    title: proof.title,
    displayValue: proof.displayValue,
    source: proof.source,
    verificationMethod: proof.verificationMethod,
    status: proof.status,
    verifiedAt: proof.verifiedAt,
    visibility: PROOF_VISIBILITY.PUBLIC,
    metadataSafe: pickMetadataSafe(proof.metadataSafe),
    normalizerVersion: proof.normalizerVersion,
  };

  if (proof.normalizedValue != null) out.normalizedValue = proof.normalizedValue;
  if (proof.season) out.season = proof.season;
  if (proof.lastSyncedAt) out.lastSyncedAt = proof.lastSyncedAt;
  if (proof.staleAt) out.staleAt = proof.staleAt;

  return out;
}

export function buildPublicPassportProjection({
  passport,
  parentAuth,
  linkedProviderAccounts,
  verifiedProofs,
  featuredProofIds,
  maxFeaturedProofs = 6,
} = {}) {
  if (!passport || passport.status !== PASSPORT_STATUSES.PUBLISHED) return null;
  if (!isPassportPublishable({ passport, parentAuth, linkedProviderAccounts })) return null;

  const linkedProviders = getVerifiedLinkedProviderAccounts(linkedProviderAccounts).map(projectLinkedProvider);
  const featuredProofs = getFeaturedVerifiedProofs({
    proofs: verifiedProofs,
    featuredProofIds,
    linkedProviderAccounts,
    max: maxFeaturedProofs,
  }).map(projectProof);

  return {
    id: passport.id,
    slug: normalizePublicSlug(passport.slug),
    alias: optionalString(passport.alias),
    avatarUrl: optionalString(passport.avatarUrl),
    status: PASSPORT_STATUSES.PUBLISHED,
    publishedAt: optionalString(passport.publishedAt),
    updatedAt: optionalString(passport.updatedAt),
    scene: {
      themeId: optionalString(passport.themeId),
      equippedCosmeticIds: Array.isArray(passport.equippedCosmeticIds)
        ? passport.equippedCosmeticIds.map(String).filter(Boolean).slice(0, 24)
        : [],
    },
    linkedProviders,
    featuredProofs,
  };
}
