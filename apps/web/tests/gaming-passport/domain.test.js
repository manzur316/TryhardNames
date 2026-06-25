import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GAME_IDS,
  LINKED_PROVIDER_IDS,
  LINKED_PROVIDER_STATUSES,
  PASSPORT_STATUSES,
  PARENT_AUTH_PROVIDER_IDS,
  PROOF_SOURCES,
  PROOF_TYPES,
  PROOF_VISIBILITY,
  PROVIDER_VISIBILITY,
  PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS,
  PUBLIC_PASSPORT_ALLOWED_KEYS,
  PUBLIC_PROOF_ALLOWED_KEYS,
  VERIFIED_PROOF_STATUSES,
  VERIFICATION_METHODS,
  buildPublicPassportProjection,
  buildPublishCommandResult,
  buildPublishReadiness,
  buildUnpublishCommandResult,
  canClaimSlug,
  canDisplayVerifiedProof,
  canPublishPassport,
  canServePublishedPassport,
  canSetPublicationConsent,
  canTransitionLinkedProviderStatus,
  canTransitionPassportStatus,
  canTransitionVerifiedProofStatus,
  canUnpublishPassport,
  getFeaturedVerifiedProofs,
  getPublishability,
  isCanonicalPublicSlug,
  isPassportPublishable,
  normalizePublicSlug,
  validateGlobalProviderOwnership,
  validateVerifiedProofContract,
} from '../../src/gaming-passport/domain/index.js';

const now = '2026-06-23T18:00:00.000Z';

function parentAuth(provider = PARENT_AUTH_PROVIDER_IDS.GOOGLE) {
  return {
    authenticated: true,
    ownerId: 'owner_1',
    provider,
    email: 'owner@example.com',
    accessToken: 'parent-secret-token',
  };
}

function passport(overrides = {}) {
  return {
    id: 'gp_1',
    ownerId: 'owner_1',
    status: PASSPORT_STATUSES.PUBLISHED,
    slug: 'player-one',
    publicationConsent: true,
    alias: 'PlayerOne',
    avatarUrl: 'https://example.test/avatar.png',
    themeId: 'clean-grid',
    equippedCosmeticIds: ['border_founder'],
    publishedAt: now,
    updatedAt: now,
    email: 'owner@example.com',
    privateNotes: 'not public',
    ...overrides,
  };
}

function linkedProvider(overrides = {}) {
  return {
    id: 'lpa_riot',
    provider: LINKED_PROVIDER_IDS.RIOT,
    externalAccountId: 'RiotPUUID-1',
    displayName: 'PlayerOne#NA1',
    status: LINKED_PROVIDER_STATUSES.VERIFIED,
    visibility: PROVIDER_VISIBILITY.PUBLIC,
    verifiedAt: now,
    lastSyncedAt: now,
    metadataSafe: { region: 'NA', arbitraryInternalField: 'internal' },
    ...overrides,
  };
}

function verifiedProof(overrides = {}) {
  return {
    id: 'proof_lol_rank',
    linkedProviderAccountId: 'lpa_riot',
    provider: LINKED_PROVIDER_IDS.RIOT,
    game: GAME_IDS.LEAGUE_OF_LEGENDS,
    proofType: PROOF_TYPES.COMPETITIVE_RANK,
    sourceKey: 'lol:ranked_solo:2026-s1',
    mode: 'ranked_solo',
    title: 'League of Legends Solo/Duo',
    displayValue: 'Emerald IV',
    normalizedValue: 2400,
    season: '2026-S1',
    source: PROOF_SOURCES.GAME_ADAPTER,
    verificationMethod: VERIFICATION_METHODS.GAME_API,
    status: VERIFIED_PROOF_STATUSES.CURRENT,
    verifiedAt: now,
    lastSyncedAt: now,
    staleAt: null,
    revokedAt: null,
    visibility: PROOF_VISIBILITY.PUBLIC,
    metadataSafe: {
      queue: 'solo_duo',
      arbitraryPublicLookingField: 'must-not-leak',
    },
    normalizerVersion: 'lol-rank-v1',
    rawPayload: { lp: 75 },
    accessToken: 'proof-secret-token',
    ...overrides,
  };
}

describe('Gaming Passport publication and serving policies', () => {
  it('lets an authenticated owner publish when all owner command requirements are met', () => {
    const result = getPublishability({
      passport: passport(),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [linkedProvider()],
    });

    assert.equal(result.publishable, true);
    assert.deepEqual(result.missing, []);
    assert.equal(isPassportPublishable({
      passport: passport(),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [linkedProvider()],
    }), true);
  });

  it('lets an anonymous visitor receive the public projection for an already published Passport', () => {
    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [linkedProvider()],
      verifiedProofs: [verifiedProof()],
      featuredProofIds: ['proof_lol_rank'],
    });

    assert.ok(projection);
    assert.equal(projection.slug, 'player-one');
    assert.equal(projection.featuredProofs.length, 1);
  });

  it('does not serve draft, unpublished, or suspended Passports publicly', () => {
    for (const status of [
      PASSPORT_STATUSES.DRAFT_PRIVATE,
      PASSPORT_STATUSES.UNPUBLISHED,
      PASSPORT_STATUSES.SUSPENDED,
    ]) {
      assert.equal(
        buildPublicPassportProjection({
          passport: passport({ status }),
          linkedProviderAccounts: [linkedProvider()],
          verifiedProofs: [verifiedProof()],
        }),
        null
      );
    }
  });

  it('does not serve a published Passport whose only provider was revoked', () => {
    const revoked = linkedProvider({
      status: LINKED_PROVIDER_STATUSES.REVOKED,
      revokedAt: now,
    });

    assert.equal(canServePublishedPassport({ passport: passport(), linkedProviderAccounts: [revoked] }), false);
    assert.equal(
      buildPublicPassportProjection({
        passport: passport(),
        linkedProviderAccounts: [revoked],
        verifiedProofs: [verifiedProof()],
      }),
      null
    );
  });
});

describe('Gaming Passport public DTOs', () => {
  it('projects only the exact public allowlist for Passport, provider, and proof DTOs', () => {
    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [linkedProvider()],
      verifiedProofs: [verifiedProof()],
      featuredProofIds: ['proof_lol_rank'],
    });

    assert.deepEqual(Object.keys(projection), PUBLIC_PASSPORT_ALLOWED_KEYS);
    assert.deepEqual(Object.keys(projection.linkedProviders[0]), PUBLIC_LINKED_PROVIDER_ALLOWED_KEYS);
    assert.deepEqual(Object.keys(projection.featuredProofs[0]), PUBLIC_PROOF_ALLOWED_KEYS);
  });

  it('excludes internal IDs, external account IDs, tokens, raw payloads, and arbitrary metadata', () => {
    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [linkedProvider()],
      verifiedProofs: [verifiedProof()],
      featuredProofIds: ['proof_lol_rank'],
    });

    const json = JSON.stringify(projection);
    for (const forbidden of [
      'gp_1',
      'owner_1',
      'lpa_riot',
      'proof_lol_rank',
      'RiotPUUID-1',
      'sourceKey',
      'normalizedValue',
      'verificationMethod',
      'normalizerVersion',
      'metadataSafe',
      'rawPayload',
      'proof-secret-token',
      'owner@example.com',
      'arbitraryInternalField',
      'arbitraryPublicLookingField',
      'must-not-leak',
    ]) {
      assert.equal(json.includes(forbidden), false, forbidden);
    }
  });
});

describe('Gaming Passport provider visibility', () => {
  it('omits a verified private provider from linkedProviders while still allowing valid public proofs', () => {
    const privateProvider = linkedProvider({ visibility: PROVIDER_VISIBILITY.PRIVATE });
    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [privateProvider],
      verifiedProofs: [verifiedProof()],
      featuredProofIds: ['proof_lol_rank'],
    });

    assert.ok(projection);
    assert.deepEqual(projection.linkedProviders, []);
    assert.equal(projection.featuredProofs.length, 1);
  });

  it('never exposes a revoked provider', () => {
    const activeProvider = linkedProvider({ id: 'lpa_active', externalAccountId: 'RiotPUUID-2' });
    const revokedProvider = linkedProvider({
      id: 'lpa_revoked',
      externalAccountId: 'RiotPUUID-3',
      status: LINKED_PROVIDER_STATUSES.REVOKED,
      revokedAt: now,
    });
    const proof = verifiedProof({ linkedProviderAccountId: 'lpa_active' });

    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [activeProvider, revokedProvider],
      verifiedProofs: [proof],
    });

    assert.equal(projection.linkedProviders.length, 1);
    assert.equal(projection.linkedProviders[0].provider, LINKED_PROVIDER_IDS.RIOT);
    assert.equal(JSON.stringify(projection).includes('RiotPUUID-3'), false);
  });
});

describe('Gaming Passport proof contract validation', () => {
  it('rejects a Riot proof associated with a Discord linked account', () => {
    const discord = linkedProvider({
      id: 'lpa_discord',
      provider: LINKED_PROVIDER_IDS.DISCORD,
      externalAccountId: 'discord-user-1',
    });
    const proof = verifiedProof({ linkedProviderAccountId: 'lpa_discord' });

    const result = validateVerifiedProofContract(proof, [discord]);
    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('provider_mismatch'));
    assert.equal(canDisplayVerifiedProof(proof, [discord]), false);
  });

  it('rejects competitive_rank without game', () => {
    const proof = verifiedProof({ game: null });
    const result = validateVerifiedProofContract(proof, [linkedProvider()]);

    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('game_required'));
  });

  it('rejects social_verification with game', () => {
    const discord = linkedProvider({
      id: 'lpa_discord',
      provider: LINKED_PROVIDER_IDS.DISCORD,
      externalAccountId: 'discord-user-1',
    });
    const proof = verifiedProof({
      id: 'proof_discord',
      linkedProviderAccountId: 'lpa_discord',
      provider: LINKED_PROVIDER_IDS.DISCORD,
      proofType: PROOF_TYPES.SOCIAL_VERIFICATION,
      source: PROOF_SOURCES.LINKED_PROVIDER,
      verificationMethod: VERIFICATION_METHODS.OAUTH,
      sourceKey: 'discord:account',
      mode: 'account',
      title: 'Discord verified',
      displayValue: 'Verified',
      normalizerVersion: 'discord-social-v1',
      game: GAME_IDS.LEAGUE_OF_LEGENDS,
    });

    const result = validateVerifiedProofContract(proof, [discord]);
    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('game_must_be_null'));
  });

  it('rejects proof without verifiedAt', () => {
    const proof = verifiedProof({ verifiedAt: '' });
    const result = validateVerifiedProofContract(proof, [linkedProvider()]);

    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('verifiedAt_required'));
  });

  it('rejects proof with source incompatible with its proof type', () => {
    const proof = verifiedProof({ source: PROOF_SOURCES.LINKED_PROVIDER });
    const result = validateVerifiedProofContract(proof, [linkedProvider()]);

    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('source_must_be_game_adapter'));
  });

  it('rejects proof with unknown status', () => {
    const proof = verifiedProof({ status: 'fresh' });
    const result = validateVerifiedProofContract(proof, [linkedProvider()]);

    assert.equal(result.ok, false);
    assert.ok(result.errors.includes('status_unknown'));
    assert.equal(canDisplayVerifiedProof(proof, [linkedProvider()]), false);
  });
});

describe('Gaming Passport external account ownership keys', () => {
  it('detects conflict for exactly equal external account IDs', () => {
    const result = validateGlobalProviderOwnership([
      linkedProvider({ id: 'lpa_a', externalAccountId: 'PUUID-1' }),
      linkedProvider({ id: 'lpa_b', externalAccountId: 'PUUID-1' }),
    ]);

    assert.equal(result.ok, false);
    assert.equal(result.conflictKey, 'riot::PUUID-1');
  });

  it('does not collapse IDs that differ only by capitalization', () => {
    const result = validateGlobalProviderOwnership([
      linkedProvider({ id: 'lpa_a', externalAccountId: 'PUUID-1' }),
      linkedProvider({ id: 'lpa_b', externalAccountId: 'puuid-1' }),
    ]);

    assert.equal(result.ok, true);
  });

  it('allows a future ProviderAdapter to canonicalize IDs before calling the domain', () => {
    const canonicalizeFutureAdapter = (externalAccountId) => externalAccountId.trim().toLowerCase();
    const result = validateGlobalProviderOwnership([
      linkedProvider({ id: 'lpa_a', externalAccountId: canonicalizeFutureAdapter(' PUUID-1 ') }),
      linkedProvider({ id: 'lpa_b', externalAccountId: canonicalizeFutureAdapter('puuid-1') }),
    ]);

    assert.equal(result.ok, false);
    assert.equal(result.conflictKey, 'riot::puuid-1');
  });
});

describe('Gaming Passport canonical slug contract', () => {
  it('accepts canonical stored slug player-one', () => {
    assert.equal(isCanonicalPublicSlug('player-one'), true);
  });

  it('rejects non-canonical stored slugs', () => {
    assert.equal(isCanonicalPublicSlug('Player-One'), false);
    assert.equal(isCanonicalPublicSlug('player one'), false);
  });

  it('normalizes future form input without making it valid as persisted state', () => {
    assert.equal(normalizePublicSlug('Player One'), 'player-one');
    assert.equal(isCanonicalPublicSlug('Player One'), false);
  });

  it('rejects reserved slugs', () => {
    assert.equal(isCanonicalPublicSlug('account'), false);
  });
});

describe('Gaming Passport publish runtime command domain', () => {
  it('normalizes slug command input and rejects reserved slugs', () => {
    const draft = passport({ status: PASSPORT_STATUSES.DRAFT_PRIVATE, slug: null, publicationConsent: false });

    assert.deepEqual(canClaimSlug({
      passport: draft,
      parentAuth: parentAuth(),
      slug: ' Player One!! ',
    }), {
      ok: true,
      errors: [],
      normalizedSlug: 'player-one',
    });

    const reserved = canClaimSlug({
      passport: draft,
      parentAuth: parentAuth(),
      slug: 'account',
    });

    assert.equal(reserved.ok, false);
    assert.ok(reserved.errors.includes('canonical_slug'));
  });

  it('requires Parent Auth ownership before mutating publish state', () => {
    const draft = passport({ status: PASSPORT_STATUSES.DRAFT_PRIVATE, slug: null });

    assert.equal(canSetPublicationConsent({
      passport: draft,
      parentAuth: { authenticated: true, ownerId: 'someone_else' },
      consent: true,
    }).ok, false);

    assert.equal(canClaimSlug({
      passport: draft,
      parentAuth: { authenticated: false, ownerId: 'owner_1' },
      slug: 'player-one',
    }).ok, false);
  });

  it('requires consent, canonical slug, and verified linked provider before publish', () => {
    const draft = passport({
      status: PASSPORT_STATUSES.DRAFT_PRIVATE,
      slug: null,
      publicationConsent: false,
      publishedAt: null,
    });
    const readiness = buildPublishReadiness({
      passport: draft,
      parentAuth: parentAuth(),
      linkedProviderAccounts: [],
    });

    assert.equal(readiness.publishable, false);
    assert.ok(readiness.missing.includes('publication_consent'));
    assert.ok(readiness.missing.includes('canonical_slug'));
    assert.ok(readiness.missing.includes('verified_linked_provider'));
    assert.equal(canPublishPassport({
      passport: draft,
      parentAuth: parentAuth(),
      linkedProviderAccounts: [],
    }).ok, false);
  });

  it('does not treat stale or revoked providers as publishable verification', () => {
    for (const status of [LINKED_PROVIDER_STATUSES.STALE, LINKED_PROVIDER_STATUSES.REVOKED]) {
      const result = buildPublishCommandResult({
        passport: passport({ status: PASSPORT_STATUSES.UNPUBLISHED }),
        parentAuth: parentAuth(),
        linkedProviderAccounts: [linkedProvider({ status })],
      });

      assert.equal(result.ok, false);
      assert.ok(result.missing.includes('verified_linked_provider'));
    }
  });

  it('blocks suspended Passports from publish commands', () => {
    const result = buildPublishCommandResult({
      passport: passport({ status: PASSPORT_STATUSES.SUSPENDED, suspendedAt: now }),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [linkedProvider()],
    });

    assert.equal(result.ok, false);
    assert.ok(result.missing.includes('not_suspended'));
    assert.equal(canSetPublicationConsent({
      passport: passport({ status: PASSPORT_STATUSES.SUSPENDED, suspendedAt: now }),
      parentAuth: parentAuth(),
      consent: true,
    }).ok, false);
  });

  it('allows publish only when policy requirements are satisfied with a mock verified provider', () => {
    const result = buildPublishCommandResult({
      passport: passport({ status: PASSPORT_STATUSES.UNPUBLISHED }),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [linkedProvider()],
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.missing, []);
    assert.equal(result.normalizedSlug, 'player-one');
  });

  it('supports unpublish from published and safe no-op states', () => {
    assert.deepEqual(buildUnpublishCommandResult({
      passport: passport({ status: PASSPORT_STATUSES.PUBLISHED }),
      parentAuth: parentAuth(),
    }), {
      ok: true,
      command: 'unpublish',
      blocked: false,
      noop: false,
      missing: [],
    });

    const unpublished = canUnpublishPassport({
      passport: passport({ status: PASSPORT_STATUSES.UNPUBLISHED }),
      parentAuth: parentAuth(),
    });

    assert.equal(unpublished.ok, true);
    assert.equal(unpublished.noop, true);
  });
});

describe('Gaming Passport state machines', () => {
  it('allows and rejects Passport transitions explicitly', () => {
    assert.equal(canTransitionPassportStatus(PASSPORT_STATUSES.DRAFT_PRIVATE, PASSPORT_STATUSES.PUBLISHED), true);
    assert.equal(canTransitionPassportStatus(PASSPORT_STATUSES.PUBLISHED, PASSPORT_STATUSES.UNPUBLISHED), true);
    assert.equal(canTransitionPassportStatus(PASSPORT_STATUSES.PUBLISHED, PASSPORT_STATUSES.DRAFT_PRIVATE), false);
    assert.equal(canTransitionPassportStatus(PASSPORT_STATUSES.SUSPENDED, PASSPORT_STATUSES.UNPUBLISHED), true);
  });

  it('treats revoked proof as terminal and allows stale proof to become current', () => {
    assert.equal(canTransitionVerifiedProofStatus(VERIFIED_PROOF_STATUSES.REVOKED, VERIFIED_PROOF_STATUSES.CURRENT), false);
    assert.equal(canTransitionVerifiedProofStatus(VERIFIED_PROOF_STATUSES.STALE, VERIFIED_PROOF_STATUSES.CURRENT), true);
  });

  it('allows revoked provider to begin a new pending link', () => {
    assert.equal(canTransitionLinkedProviderStatus(LINKED_PROVIDER_STATUSES.REVOKED, LINKED_PROVIDER_STATUSES.PENDING), true);
  });

  it('rejects unknown transitions', () => {
    assert.equal(canTransitionPassportStatus('unknown', PASSPORT_STATUSES.PUBLISHED), false);
    assert.equal(canTransitionLinkedProviderStatus(LINKED_PROVIDER_STATUSES.VERIFIED, 'unknown'), false);
    assert.equal(canTransitionVerifiedProofStatus('unknown', VERIFIED_PROOF_STATUSES.CURRENT), false);
  });
});

describe('Gaming Passport legacy proof expectations', () => {
  it('keeps Riot ownership separate from competitive rank', () => {
    const riot = linkedProvider();
    const ownershipProof = verifiedProof({
      id: 'proof_riot_ownership',
      game: null,
      proofType: PROOF_TYPES.PROVIDER_OWNERSHIP,
      sourceKey: 'riot:account',
      mode: 'account',
      title: 'Riot account verified',
      displayValue: 'Owned',
      source: PROOF_SOURCES.LINKED_PROVIDER,
      verificationMethod: VERIFICATION_METHODS.OAUTH,
      normalizerVersion: 'riot-ownership-v1',
    });

    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [riot],
      verifiedProofs: [ownershipProof],
      featuredProofIds: [ownershipProof.id],
    });

    assert.equal(projection.featuredProofs[0].proofType, PROOF_TYPES.PROVIDER_OWNERSHIP);
    assert.ok(projection.featuredProofs.every((proof) => proof.proofType !== PROOF_TYPES.COMPETITIVE_RANK));
  });

  it('never includes revoked proofs publicly and preserves stale proof status explicitly', () => {
    const riot = linkedProvider();
    const revoked = verifiedProof({
      id: 'proof_revoked',
      status: VERIFIED_PROOF_STATUSES.REVOKED,
      revokedAt: now,
    });
    const stale = verifiedProof({
      id: 'proof_stale',
      status: VERIFIED_PROOF_STATUSES.STALE,
      staleAt: now,
    });

    assert.equal(canDisplayVerifiedProof(revoked, [riot]), false);
    assert.deepEqual(getFeaturedVerifiedProofs({
      proofs: [revoked],
      linkedProviderAccounts: [riot],
    }), []);

    const projection = buildPublicPassportProjection({
      passport: passport(),
      linkedProviderAccounts: [riot],
      verifiedProofs: [stale],
      featuredProofIds: [stale.id],
    });

    assert.equal(projection.featuredProofs[0].status, VERIFIED_PROOF_STATUSES.STALE);
    assert.notEqual(projection.featuredProofs[0].status, VERIFIED_PROOF_STATUSES.CURRENT);
  });

  it('caps public featured proofs at 6', () => {
    const riot = linkedProvider();
    const proofs = Array.from({ length: 8 }, (_, index) =>
      verifiedProof({
        id: `proof_${index}`,
        sourceKey: `lol:ranked_solo:${index}`,
      })
    );

    const featured = getFeaturedVerifiedProofs({
      proofs,
      linkedProviderAccounts: [riot],
      max: 99,
    });

    assert.equal(featured.length, 6);
  });
});
