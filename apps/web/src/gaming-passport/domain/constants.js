export const PASSPORT_STATUSES = /** @type {const} */ ({
  DRAFT_PRIVATE: 'draft_private',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  SUSPENDED: 'suspended',
});

export const LINKED_PROVIDER_STATUSES = /** @type {const} */ ({
  PENDING: 'pending',
  VERIFIED: 'verified',
  FAILED: 'failed',
  STALE: 'stale',
  REVOKED: 'revoked',
});

export const PROVIDER_VISIBILITY = /** @type {const} */ ({
  PRIVATE: 'private',
  PUBLIC: 'public',
});

export const VERIFIED_PROOF_STATUSES = /** @type {const} */ ({
  CURRENT: 'current',
  STALE: 'stale',
  REVOKED: 'revoked',
});

export const PARENT_AUTH_PROVIDER_IDS = /** @type {const} */ ({
  EMAIL_PASSWORD: 'email_password',
  GOOGLE: 'google',
});

export const LINKED_PROVIDER_IDS = /** @type {const} */ ({
  DISCORD: 'discord',
  RIOT: 'riot',
});

export const GAME_IDS = /** @type {const} */ ({
  LEAGUE_OF_LEGENDS: 'league_of_legends',
});

export const PROOF_TYPES = /** @type {const} */ ({
  SOCIAL_VERIFICATION: 'social_verification',
  PROVIDER_OWNERSHIP: 'provider_ownership',
  COMPETITIVE_RANK: 'competitive_rank',
  COMPETITIVE_RATING: 'competitive_rating',
  PROGRESSION_ACHIEVEMENT: 'progression_achievement',
  TITLE_OR_COMPLETION: 'title_or_completion',
});

export const PROOF_VISIBILITY = /** @type {const} */ ({
  PRIVATE: 'private',
  PUBLIC: 'public',
});

export const VERIFICATION_METHODS = /** @type {const} */ ({
  OAUTH: 'oauth',
  PROVIDER_API: 'provider_api',
  GAME_API: 'game_api',
  ONE_TIME_API_TOKEN: 'one_time_api_token',
});

export const PROOF_SOURCES = /** @type {const} */ ({
  LINKED_PROVIDER: 'linked_provider',
  GAME_ADAPTER: 'game_adapter',
});

export const MAX_PUBLIC_FEATURED_PROOFS = 6;

export const RESERVED_PUBLIC_SLUGS = new Set([
  'account',
  'admin',
  'api',
  'auth',
  'gaming-passport',
  'id',
  'null',
  'sign-in',
  'sign-up',
  'undefined',
  'www',
]);

export const PUBLIC_PASSPORT_ALLOWED_KEYS = Object.freeze([
  'slug',
  'alias',
  'avatarUrl',
  'publishedAt',
  'updatedAt',
  'scene',
  'linkedProviders',
  'featuredProofs',
]);

export const PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS = Object.freeze([
  'provider',
  'displayName',
  'verifiedAt',
  'lastSyncedAt',
]);

export const PUBLIC_PROOF_ALLOWED_KEYS = Object.freeze([
  'provider',
  'game',
  'proofType',
  'mode',
  'title',
  'displayValue',
  'season',
  'status',
  'verifiedAt',
  'lastSyncedAt',
  'staleAt',
]);
