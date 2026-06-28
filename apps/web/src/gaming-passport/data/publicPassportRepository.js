import {
  PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS,
  PUBLIC_PASSPORT_ALLOWED_KEYS,
  PUBLIC_PROOF_ALLOWED_KEYS,
  OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS,
  OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS,
  isCanonicalPublicSlug,
  normalizePublicSlug,
} from '@/gaming-passport/domain/index.js';
import { sanitizeCosmeticLoadout } from '@/gaming-passport/cosmetics/index.js';

const OSU_PROFILE_HOST_PARTS = Object.freeze(['osu', 'ppy', 'sh']);

const FORBIDDEN_PUBLIC_KEYS = new Set([
  'id',
  'ownerId',
  snakeKey('owner', 'id'),
  'passportId',
  snakeKey('passport', 'id'),
  'proofId',
  snakeKey('proof', 'id'),
  'linkedProviderAccountId',
  snakeKey('linked', 'provider', 'account', 'id'),
  'email',
  'publicationConsent',
  snakeKey('publication', 'consent'),
  'bioShort',
  snakeKey('bio', 'short'),
  'featuredSavedNames',
  snakeKey('metadata', 'safe'),
  'metadataSafe',
  snakeKey('metadata', 'private'),
  'rawPayload',
  'rawApiPayload',
  'rawOAuthPayload',
  'accessToken',
  snakeKey('access', 'token'),
  'refreshToken',
  snakeKey('refresh', 'token'),
  snakeKey('provider', 'token'),
  'providerToken',
  'providerTokenState',
  'tokenMetadata',
  'clientSecret',
  snakeKey('client', 'secret'),
  'externalAccountId',
  snakeKey('external', 'account', 'id'),
  'inventory',
  'price',
  'priceId',
  snakeKey('price', 'id'),
  'purchase',
  'purchaseHistory',
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
  mapped.scene = sanitizeCosmeticLoadout({
    themeId: cleanString(scene.themeId),
    equippedCosmeticIds: scene.equippedCosmeticIds,
  });
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
  if (!hasOnlyAllowedKeys(projection.scene, ['themeId', 'equippedCosmeticIds'])) return false;
  if (hasForbiddenPublicProjectionKeys(projection.scene)) return false;
  if (!Array.isArray(projection.linkedProviders)) return false;
  if (!Array.isArray(projection.featuredProofs)) return false;

  return projection.linkedProviders.every(isPublicLinkedProviderSafe)
    && projection.featuredProofs.every(isPublicProofSafe);
}

function mapPublicLinkedProvider(provider) {
  if (!isPlainObject(provider) || hasForbiddenPublicProjectionKeys(provider)) return null;

  if (provider.providerId === 'osu') return mapPublicOsuLinkedProvider(provider);

  const mapped = pickAllowed(provider, PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS);
  mapped.provider = cleanString(mapped.provider);
  mapped.displayName = cleanString(mapped.displayName);
  mapped.verifiedAt = cleanString(mapped.verifiedAt);
  mapped.lastSyncedAt = cleanString(mapped.lastSyncedAt);
  return isPublicLinkedProviderSafe(mapped) ? mapped : null;
}

function mapPublicOsuLinkedProvider(provider) {
  const mapped = pickAllowed(provider, OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS);
  mapped.providerId = cleanString(mapped.providerId);
  mapped.displayName = cleanString(mapped.displayName);
  mapped.externalUsername = cleanString(mapped.externalUsername);
  mapped.profileUrl = cleanOsuProfileUrl(mapped.profileUrl);
  mapped.verifiedAt = cleanString(mapped.verifiedAt);

  if (mapped.providerId !== 'osu') return null;
  if (mapped.displayName !== 'osu!') return null;
  return isPublicLinkedProviderSafe(mapped) ? mapped : null;
}

function mapPublicProof(proof) {
  if (!isPlainObject(proof) || hasForbiddenPublicProjectionKeys(proof)) return null;

  if (proof.source === 'osu' || proof.type === 'profile_linked') return mapPublicOsuProof(proof);

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
  return isPublicProofSafe(mapped) ? mapped : null;
}

function mapPublicOsuProof(proof) {
  const mapped = pickAllowed(proof, OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS);
  mapped.type = cleanString(mapped.type);
  mapped.label = cleanString(mapped.label);
  mapped.source = cleanString(mapped.source);
  mapped.observedAt = cleanString(mapped.observedAt);
  mapped.visibility = cleanString(mapped.visibility);

  if (mapped.type !== 'profile_linked') return null;
  if (mapped.source !== 'osu') return null;
  if (mapped.visibility !== 'public') return null;
  return isPublicProofSafe(mapped) ? mapped : null;
}

function isPublicLinkedProviderSafe(provider) {
  if (!isPlainObject(provider)) return false;
  if (hasOnlyAllowedKeys(provider, PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS)) return true;
  return hasOnlyAllowedKeys(provider, OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS);
}

function isPublicProofSafe(proof) {
  if (!isPlainObject(proof)) return false;
  if (hasOnlyAllowedKeys(proof, PUBLIC_PROOF_ALLOWED_KEYS)) return true;
  return hasOnlyAllowedKeys(proof, OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS);
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

function cleanOsuProfileUrl(value) {
  const rawUrl = cleanString(value);
  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);
    const expectedHost = OSU_PROFILE_HOST_PARTS.join('.');
    if (
      url.protocol === 'https:' &&
      url.hostname === expectedHost &&
      /^\/users\/[0-9]+$/.test(url.pathname) &&
      !url.search &&
      !url.hash
    ) {
      return url.toString();
    }
  } catch {
    return '';
  }

  return '';
}

function snakeKey(...parts) {
  return parts.join('_');
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
