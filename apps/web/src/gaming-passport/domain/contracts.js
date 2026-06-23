import {
  GAME_IDS,
  LINKED_PROVIDER_IDS,
  LINKED_PROVIDER_STATUSES,
  MAX_PUBLIC_FEATURED_PROOFS,
  PASSPORT_STATUSES,
  PROOF_SOURCES,
  PROOF_TYPES,
  PROOF_VISIBILITY,
  PROVIDER_VISIBILITY,
  RESERVED_PUBLIC_SLUGS,
  VERIFIED_PROOF_STATUSES,
  VERIFICATION_METHODS,
} from './constants.js';

/**
 * @typedef {typeof PASSPORT_STATUSES[keyof typeof PASSPORT_STATUSES]} PassportStatus
 * @typedef {typeof LINKED_PROVIDER_STATUSES[keyof typeof LINKED_PROVIDER_STATUSES]} LinkedProviderStatus
 * @typedef {typeof PROVIDER_VISIBILITY[keyof typeof PROVIDER_VISIBILITY]} ProviderVisibility
 * @typedef {typeof VERIFIED_PROOF_STATUSES[keyof typeof VERIFIED_PROOF_STATUSES]} VerifiedProofStatus
 * @typedef {typeof LINKED_PROVIDER_IDS[keyof typeof LINKED_PROVIDER_IDS]} LinkedProviderId
 * @typedef {typeof GAME_IDS[keyof typeof GAME_IDS]} GameId
 * @typedef {typeof PROOF_TYPES[keyof typeof PROOF_TYPES]} ProofType
 */

/**
 * @typedef {{
 *   id: string;
 *   ownerId?: string;
 *   slug?: string;
 *   status: PassportStatus;
 *   alias?: string;
 *   avatarUrl?: string;
 *   publicationConsent?: boolean;
 *   themeId?: string;
 *   equippedCosmeticIds?: string[];
 *   createdAt?: string;
 *   updatedAt?: string;
 *   publishedAt?: string;
 *   suspendedAt?: string;
 * }} GamingPassport
 */

/**
 * @typedef {{
 *   id: string;
 *   provider: LinkedProviderId;
 *   externalAccountId: string;
 *   displayName?: string;
 *   status: LinkedProviderStatus;
 *   visibility: ProviderVisibility;
 *   verifiedAt?: string;
 *   lastSyncedAt?: string;
 *   staleAt?: string;
 *   revokedAt?: string;
 *   metadataSafe?: Record<string, string | number | boolean | null>;
 * }} LinkedProviderAccount
 */

/**
 * @typedef {{
 *   id: string;
 *   linkedProviderAccountId: string;
 *   provider: LinkedProviderId;
 *   game: GameId | null;
 *   proofType: ProofType;
 *   sourceKey: string;
 *   mode: string;
 *   title: string;
 *   displayValue: string;
 *   normalizedValue?: number | string | null;
 *   season?: string | null;
 *   source: typeof PROOF_SOURCES[keyof typeof PROOF_SOURCES];
 *   verificationMethod: typeof VERIFICATION_METHODS[keyof typeof VERIFICATION_METHODS];
 *   status: VerifiedProofStatus;
 *   verifiedAt: string;
 *   lastSyncedAt?: string | null;
 *   staleAt?: string | null;
 *   revokedAt?: string | null;
 *   visibility: typeof PROOF_VISIBILITY[keyof typeof PROOF_VISIBILITY];
 *   metadataSafe?: Record<string, string | number | boolean | null>;
 *   normalizerVersion: string;
 * }} VerifiedProof
 */

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizePublicSlug(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isCanonicalPublicSlug(raw) {
  if (typeof raw !== 'string') return false;
  if (raw !== normalizePublicSlug(raw)) return false;
  return raw.length >= 2 && raw.length <= 32 && SLUG_RE.test(raw) && !RESERVED_PUBLIC_SLUGS.has(raw);
}

export function isValidPublicSlug(raw) {
  return isCanonicalPublicSlug(raw);
}

export function isKnownLinkedProvider(provider) {
  return Object.values(LINKED_PROVIDER_IDS).includes(provider);
}

export function isKnownProviderVisibility(visibility) {
  return Object.values(PROVIDER_VISIBILITY).includes(visibility);
}

export function isKnownGame(game) {
  return game == null || Object.values(GAME_IDS).includes(game);
}

export function isKnownProofType(proofType) {
  return Object.values(PROOF_TYPES).includes(proofType);
}

export function isKnownProofVisibility(visibility) {
  return Object.values(PROOF_VISIBILITY).includes(visibility);
}

export function isKnownVerificationMethod(method) {
  return Object.values(VERIFICATION_METHODS).includes(method);
}

export function isKnownProofSource(source) {
  return Object.values(PROOF_SOURCES).includes(source);
}

export function toProviderOwnershipKey(provider, externalAccountId) {
  return `${String(provider || '').trim().toLowerCase()}::${String(externalAccountId ?? '').trim()}`;
}

export function validateGlobalProviderOwnership(accounts) {
  const seen = new Set();
  for (const account of Array.isArray(accounts) ? accounts : []) {
    const provider = account?.provider;
    const externalAccountId = account?.externalAccountId;
    if (!isKnownLinkedProvider(provider) || !externalAccountId) continue;
    const key = toProviderOwnershipKey(provider, externalAccountId);
    if (seen.has(key)) {
      return { ok: false, conflictKey: key };
    }
    seen.add(key);
  }
  return { ok: true };
}

export function coerceFeaturedProofLimit(limit) {
  const n = Number.isFinite(limit) ? Math.floor(limit) : MAX_PUBLIC_FEATURED_PROOFS;
  if (n < 0) return 0;
  return Math.min(n, MAX_PUBLIC_FEATURED_PROOFS);
}

export function isPassportContractStatus(status) {
  return Object.values(PASSPORT_STATUSES).includes(status);
}

export function isLinkedProviderContractStatus(status) {
  return Object.values(LINKED_PROVIDER_STATUSES).includes(status);
}

export function isVerifiedProofContractStatus(status) {
  return Object.values(VERIFIED_PROOF_STATUSES).includes(status);
}

function addRequiredStringError(errors, proof, key) {
  if (!isNonEmptyString(proof?.[key])) errors.push(`${key}_required`);
}

function validateProofTypeInvariant(errors, proof) {
  if (!isKnownProofType(proof?.proofType)) return;

  if (
    proof.proofType === PROOF_TYPES.SOCIAL_VERIFICATION ||
    proof.proofType === PROOF_TYPES.PROVIDER_OWNERSHIP
  ) {
    if (proof.game !== null) errors.push('game_must_be_null');
    if (proof.source !== PROOF_SOURCES.LINKED_PROVIDER) errors.push('source_must_be_linked_provider');
    return;
  }

  if (!proof.game) errors.push('game_required');
  if (proof.game && !isKnownGame(proof.game)) errors.push('game_unknown');
  if (proof.source !== PROOF_SOURCES.GAME_ADAPTER) errors.push('source_must_be_game_adapter');
}

export function validateVerifiedProofContract(proof, linkedProviderAccounts = []) {
  const errors = [];
  if (!proof || typeof proof !== 'object') {
    return { ok: false, errors: ['proof_required'] };
  }

  for (const key of [
    'id',
    'linkedProviderAccountId',
    'provider',
    'proofType',
    'sourceKey',
    'mode',
    'title',
    'displayValue',
    'source',
    'verificationMethod',
    'status',
    'visibility',
    'normalizerVersion',
    'verifiedAt',
  ]) {
    addRequiredStringError(errors, proof, key);
  }

  if (!isKnownLinkedProvider(proof.provider)) errors.push('provider_unknown');
  if (!isKnownProofType(proof.proofType)) errors.push('proof_type_unknown');
  if (!isVerifiedProofContractStatus(proof.status)) errors.push('status_unknown');
  if (!isKnownProofVisibility(proof.visibility)) errors.push('visibility_unknown');
  if (!isKnownProofSource(proof.source)) errors.push('source_unknown');
  if (!isKnownVerificationMethod(proof.verificationMethod)) errors.push('verification_method_unknown');

  const accounts = Array.isArray(linkedProviderAccounts) ? linkedProviderAccounts : [];
  const sourceAccount = accounts.find((account) => account.id === proof.linkedProviderAccountId);
  if (!sourceAccount) {
    errors.push('linked_provider_account_missing');
  } else if (sourceAccount.provider !== proof.provider) {
    errors.push('provider_mismatch');
  }

  validateProofTypeInvariant(errors, proof);

  return errors.length ? { ok: false, errors } : { ok: true, errors: [] };
}
