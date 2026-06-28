import {
  getFeaturedVerifiedProofs,
  getPublicLinkedProviderAccounts,
  canServePublishedPassport,
} from './publicationPolicy.js';
import {
  isOsuLinkedProvider,
  isOsuProfileLinkedProof,
} from './osuPublicProjectionPolicy.js';
import { sanitizeCosmeticLoadout } from '../cosmetics/cosmeticLoadout.js';

const OSU_PROFILE_HOST_PARTS = Object.freeze(['osu', 'ppy', 'sh']);

function optionalString(value) {
  const text = String(value || '').trim();
  return text.length ? text : undefined;
}

function optionalOsuProfileUrl(account) {
  const rawUrl = optionalString(account?.profileUrl || account?.metadataSafe?.profileUrl);
  if (!rawUrl) return undefined;

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
    return undefined;
  }

  return undefined;
}

function projectLinkedProvider(account) {
  if (isOsuLinkedProvider(account)) return projectOsuLinkedProvider(account);

  return {
    provider: account.provider,
    displayName: optionalString(account.displayName),
    verifiedAt: optionalString(account.verifiedAt),
    lastSyncedAt: optionalString(account.lastSyncedAt),
  };
}

function projectOsuLinkedProvider(account) {
  return {
    providerId: 'osu',
    displayName: 'osu!',
    externalUsername: optionalString(account.displayName),
    profileUrl: optionalOsuProfileUrl(account),
    verifiedAt: optionalString(account.verifiedAt),
  };
}

function projectProof(proof) {
  if (isOsuProfileLinkedProof(proof)) return projectOsuProfileLinkedProof(proof);

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

function projectOsuProfileLinkedProof(proof) {
  return {
    type: 'profile_linked',
    label: 'Linked osu! account',
    source: 'osu',
    observedAt: optionalString(proof.verifiedAt),
    visibility: 'public',
  };
}

export function buildPublicPassportProjection({
  passport,
  linkedProviderAccounts,
  verifiedProofs,
  featuredProofIds,
  maxFeaturedProofs = 6,
  osuPublicProjectionAllowlistEnabled = false,
  suspensionBlock = false,
  reportBlock = false,
} = {}) {
  if (!canServePublishedPassport({ passport, linkedProviderAccounts })) return null;

  const publicProjectionOptions = {
    passport,
    verifiedProofs,
    osuPublicProjectionAllowlistEnabled,
    suspensionBlock,
    reportBlock,
  };

  const linkedProviders = getPublicLinkedProviderAccounts(
    linkedProviderAccounts,
    publicProjectionOptions
  ).map(projectLinkedProvider);
  const cosmeticLoadout = sanitizeCosmeticLoadout({
    themeId: passport.themeId || passport.sceneConfig?.themeId,
    equippedCosmeticIds: passport.equippedCosmeticIds || passport.sceneConfig?.equippedCosmeticIds,
  });
  const featuredProofs = getFeaturedVerifiedProofs({
    proofs: verifiedProofs,
    featuredProofIds,
    linkedProviderAccounts,
    max: maxFeaturedProofs,
    publicProjectionOptions,
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
