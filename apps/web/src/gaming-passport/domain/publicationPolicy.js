import {
  LINKED_PROVIDER_STATUSES,
  PASSPORT_STATUSES,
  PROOF_VISIBILITY,
  PROVIDER_VISIBILITY,
  VERIFIED_PROOF_STATUSES,
} from './constants.js';
import {
  coerceFeaturedProofLimit,
  isCanonicalPublicSlug,
  isKnownLinkedProvider,
  validateVerifiedProofContract,
} from './contracts.js';

export function isParentAccountAuthenticated(parentAuth) {
  return Boolean(parentAuth && typeof parentAuth === 'object' && parentAuth.authenticated === true);
}

export function isLinkedProviderAccountValid(account) {
  return Boolean(
    account &&
      typeof account === 'object' &&
      isKnownLinkedProvider(account.provider) &&
      account.externalAccountId &&
      account.status === LINKED_PROVIDER_STATUSES.VERIFIED
  );
}

export function isLinkedProviderAccountPubliclyVisible(account) {
  return isLinkedProviderAccountValid(account) && account.visibility === PROVIDER_VISIBILITY.PUBLIC;
}

export function getVerifiedLinkedProviderAccounts(accounts) {
  return (Array.isArray(accounts) ? accounts : []).filter(isLinkedProviderAccountValid);
}

export function getPublicLinkedProviderAccounts(accounts) {
  return (Array.isArray(accounts) ? accounts : []).filter(isLinkedProviderAccountPubliclyVisible);
}

export function hasVerifiedLinkedProvider(accounts) {
  return getVerifiedLinkedProviderAccounts(accounts).length > 0;
}

export function getPublishability({ passport, parentAuth, linkedProviderAccounts } = {}) {
  const missing = [];
  if (!isParentAccountAuthenticated(parentAuth)) missing.push('parent_auth');
  if (!hasVerifiedLinkedProvider(linkedProviderAccounts)) missing.push('verified_linked_provider');
  if (!passport?.publicationConsent) missing.push('publication_consent');
  if (!isCanonicalPublicSlug(passport?.slug)) missing.push('canonical_slug');
  if (passport?.status === PASSPORT_STATUSES.SUSPENDED) missing.push('not_suspended');

  return {
    publishable: missing.length === 0,
    missing,
  };
}

export function isPassportPublishable(input = {}) {
  return getPublishability(input).publishable;
}

export function canServePublishedPassport({ passport, linkedProviderAccounts } = {}) {
  return Boolean(
    passport &&
      passport.status === PASSPORT_STATUSES.PUBLISHED &&
      passport.publicationConsent === true &&
      isCanonicalPublicSlug(passport.slug) &&
      hasVerifiedLinkedProvider(linkedProviderAccounts)
  );
}

export function canDisplayVerifiedProof(proof, linkedProviderAccounts = []) {
  if (!proof || typeof proof !== 'object') return false;
  if (proof.visibility !== PROOF_VISIBILITY.PUBLIC) return false;
  if (![VERIFIED_PROOF_STATUSES.CURRENT, VERIFIED_PROOF_STATUSES.STALE].includes(proof.status)) return false;
  if (!validateVerifiedProofContract(proof, linkedProviderAccounts).ok) return false;

  const accounts = Array.isArray(linkedProviderAccounts) ? linkedProviderAccounts : [];
  const sourceAccount = accounts.find((account) => account.id === proof.linkedProviderAccountId);
  return isLinkedProviderAccountValid(sourceAccount);
}

export function getDisplayableVerifiedProofs(proofs, linkedProviderAccounts = []) {
  return (Array.isArray(proofs) ? proofs : []).filter((proof) =>
    canDisplayVerifiedProof(proof, linkedProviderAccounts)
  );
}

export function getFeaturedVerifiedProofs({
  proofs,
  featuredProofIds,
  linkedProviderAccounts,
  max = 6,
} = {}) {
  const limit = coerceFeaturedProofLimit(max);
  const displayable = getDisplayableVerifiedProofs(proofs, linkedProviderAccounts);
  const byId = new Map(displayable.map((proof) => [proof.id, proof]));

  if (Array.isArray(featuredProofIds) && featuredProofIds.length > 0) {
    const ordered = [];
    for (const id of featuredProofIds) {
      const proof = byId.get(id);
      if (proof && !ordered.some((row) => row.id === proof.id)) ordered.push(proof);
      if (ordered.length >= limit) break;
    }
    return ordered;
  }

  return displayable.slice(0, limit);
}
