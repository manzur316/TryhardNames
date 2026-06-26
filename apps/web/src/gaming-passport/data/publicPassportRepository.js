import {
  PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS,
  PUBLIC_PASSPORT_ALLOWED_KEYS,
  PUBLIC_PROOF_ALLOWED_KEYS,
  isCanonicalPublicSlug,
  normalizePublicSlug,
} from '@/gaming-passport/domain/index.js';

const FORBIDDEN_PUBLIC_KEYS = new Set([
  'id',
  'ownerId',
  'owner_id',
  'email',
  'publicationConsent',
  'publication_consent',
  'bioShort',
  'bio_short',
  'featuredSavedNames',
  'metadata_safe',
  'metadataSafe',
  'metadata_private',
  'rawPayload',
  'accessToken',
  'refreshToken',
  'provider_token',
  'providerToken',
  'clientSecret',
  'externalAccountId',
  'external_account_id',
]);

export async function getPublicPassportBySlug(client, slug) {
  if (!client) throw new Error('Supabase client is required for public Passport lookup.');

  const normalizedSlug = normalizePublicSlug(slug);
  if (!isCanonicalPublicSlug(normalizedSlug)) return null;

  const { data, error } = await client.rpc('get_public_gaming_passport_projection', {
    public_slug: slug,
  });

  if (error) throw error;
  if (!data) return null;
  return mapPublicPassportProjection(data);
}

export function mapPublicPassportProjection(projection) {
  if (!isPlainObject(projection)) return null;
  if (hasForbiddenPublicProjectionKeys(projection)) return null;

  const scene = isPlainObject(projection.scene) ? projection.scene : {};
  const linkedProviders = Array.isArray(projection.linkedProviders)
    ? projection.linkedProviders.map(mapPublicLinkedProvider).filter(Boolean)
    : [];
  const featuredProofs = Array.isArray(projection.featuredProofs)
    ? projection.featuredProofs.map(mapPublicProof).filter(Boolean)
    : [];

  const mapped = pickAllowed(projection, PUBLIC_PASSPORT_ALLOWED_KEYS);
  mapped.slug = cleanString(mapped.slug);
  mapped.alias = cleanString(mapped.alias);
  mapped.avatarUrl = cleanString(mapped.avatarUrl);
  mapped.publishedAt = cleanString(mapped.publishedAt);
  mapped.updatedAt = cleanString(mapped.updatedAt);
  mapped.scene = {
    themeId: cleanString(scene.themeId),
    equippedCosmeticIds: Array.isArray(scene.equippedCosmeticIds)
      ? scene.equippedCosmeticIds.map(String).filter(Boolean).slice(0, 24)
      : [],
  };
  mapped.linkedProviders = linkedProviders;
  mapped.featuredProofs = featuredProofs;

  return isPublicPassportProjectionSafe(mapped) ? mapped : null;
}

export function isPublicPassportProjectionSafe(projection) {
  if (!isPlainObject(projection)) return false;
  if (hasForbiddenPublicProjectionKeys(projection)) return false;
  if (!hasOnlyAllowedKeys(projection, PUBLIC_PASSPORT_ALLOWED_KEYS)) return false;
  if (!isCanonicalPublicSlug(projection.slug)) return false;
  if (!isPlainObject(projection.scene)) return false;
  if (!Array.isArray(projection.linkedProviders)) return false;
  if (!Array.isArray(projection.featuredProofs)) return false;

  return projection.linkedProviders.every((provider) =>
    isPlainObject(provider) && hasOnlyAllowedKeys(provider, PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS)
  ) && projection.featuredProofs.every((proof) =>
    isPlainObject(proof) && hasOnlyAllowedKeys(proof, PUBLIC_PROOF_ALLOWED_KEYS)
  );
}

function mapPublicLinkedProvider(provider) {
  if (!isPlainObject(provider) || hasForbiddenPublicProjectionKeys(provider)) return null;
  const mapped = pickAllowed(provider, PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS);
  mapped.provider = cleanString(mapped.provider);
  mapped.displayName = cleanString(mapped.displayName);
  mapped.verifiedAt = cleanString(mapped.verifiedAt);
  mapped.lastSyncedAt = cleanString(mapped.lastSyncedAt);
  return hasOnlyAllowedKeys(mapped, PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS) ? mapped : null;
}

function mapPublicProof(proof) {
  if (!isPlainObject(proof) || hasForbiddenPublicProjectionKeys(proof)) return null;
  const mapped = pickAllowed(proof, PUBLIC_PROOF_ALLOWED_KEYS);
  mapped.provider = cleanString(mapped.provider);
  mapped.game = mapped.game == null ? null : cleanString(mapped.game);
  mapped.proofType = cleanString(mapped.proofType);
  mapped.mode = cleanString(mapped.mode);
  mapped.title = cleanString(mapped.title);
  mapped.displayValue = cleanString(mapped.displayValue);
  mapped.season = cleanString(mapped.season);
  mapped.status = cleanString(mapped.status);
  mapped.verifiedAt = cleanString(mapped.verifiedAt);
  mapped.lastSyncedAt = cleanString(mapped.lastSyncedAt);
  mapped.staleAt = cleanString(mapped.staleAt);
  return hasOnlyAllowedKeys(mapped, PUBLIC_PROOF_ALLOWED_KEYS) ? mapped : null;
}

function hasForbiddenPublicProjectionKeys(value) {
  if (Array.isArray(value)) return value.some(hasForbiddenPublicProjectionKeys);
  if (!isPlainObject(value)) return false;
  return Object.entries(value).some(([key, child]) => (
    FORBIDDEN_PUBLIC_KEYS.has(key) || hasForbiddenPublicProjectionKeys(child)
  ));
}

function hasOnlyAllowedKeys(value, allowedKeys) {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function pickAllowed(value, allowedKeys) {
  return allowedKeys.reduce((out, key) => {
    out[key] = value[key] ?? null;
    return out;
  }, {});
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
