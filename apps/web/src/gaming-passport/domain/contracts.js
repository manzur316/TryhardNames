import {
  GAME_IDS,
  LINKED_PROVIDER_IDS,
  LINKED_PROVIDER_STATUSES,
  MAX_PUBLIC_FEATURED_PROOFS,
  PASSPORT_STATUSES,
  PROOF_SOURCES,
  PROOF_TYPES,
  RESERVED_PUBLIC_SLUGS,
  VERIFIED_PROOF_STATUSES,
  VERIFICATION_METHODS,
} from './constants.js';

/**
 * @typedef {typeof PASSPORT_STATUSES[keyof typeof PASSPORT_STATUSES]} PassportStatus
 * @typedef {typeof LINKED_PROVIDER_STATUSES[keyof typeof LINKED_PROVIDER_STATUSES]} LinkedProviderStatus
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
 *   game?: GameId | null;
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
 *   visibility: string;
 *   metadataSafe?: Record<string, string | number | boolean | null>;
 *   normalizerVersion: string;
 * }} VerifiedProof
 */

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])$/;
const SAFE_METADATA_KEY_RE = /^[a-zA-Z0-9_.:-]{1,64}$/;
const PUBLIC_METADATA_DENY_RE = /token|secret|authorization|bearer|password|raw|payload|email|private/i;

export function normalizePublicSlug(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidPublicSlug(raw) {
  const slug = normalizePublicSlug(raw);
  return slug.length >= 2 && slug.length <= 32 && SLUG_RE.test(slug) && !RESERVED_PUBLIC_SLUGS.has(slug);
}

export function isKnownLinkedProvider(provider) {
  return Object.values(LINKED_PROVIDER_IDS).includes(provider);
}

export function isKnownGame(game) {
  return game == null || Object.values(GAME_IDS).includes(game);
}

export function isKnownProofType(proofType) {
  return Object.values(PROOF_TYPES).includes(proofType);
}

export function isKnownVerificationMethod(method) {
  return Object.values(VERIFICATION_METHODS).includes(method);
}

export function isKnownProofSource(source) {
  return Object.values(PROOF_SOURCES).includes(source);
}

export function toProviderOwnershipKey(provider, externalAccountId) {
  return `${String(provider || '').trim().toLowerCase()}::${String(externalAccountId || '').trim().toLowerCase()}`;
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

export function pickMetadataSafe(metadata) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return {};
  const out = {};
  for (const [rawKey, value] of Object.entries(metadata)) {
    const key = String(rawKey);
    if (!SAFE_METADATA_KEY_RE.test(key)) continue;
    if (PUBLIC_METADATA_DENY_RE.test(key)) continue;
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
      out[key] = typeof value === 'string' ? value.slice(0, 160) : value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value;
    }
  }
  return out;
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
