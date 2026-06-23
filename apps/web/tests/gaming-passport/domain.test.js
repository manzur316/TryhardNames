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
  VERIFIED_PROOF_STATUSES,
  VERIFICATION_METHODS,
  buildPublicPassportProjection,
  canDisplayVerifiedProof,
  getFeaturedVerifiedProofs,
  getPublishability,
  isPassportPublishable,
  validateGlobalProviderOwnership,
} from '../../src/gaming-passport/domain/index.js';

const now = '2026-06-23T18:00:00.000Z';

function parentAuth(provider = PARENT_AUTH_PROVIDER_IDS.GOOGLE) {
  return {
    authenticated: true,
    provider,
    email: 'owner@example.com',
    accessToken: 'parent-secret-token',
  };
}

function passport(overrides = {}) {
  return {
    id: 'gp_1',
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
    externalAccountId: 'riot-puuid-1',
    displayName: 'PlayerOne#NA1',
    status: LINKED_PROVIDER_STATUSES.VERIFIED,
    verifiedAt: now,
    lastSyncedAt: now,
    metadataSafe: { region: 'NA' },
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
    metadataSafe: { queue: 'solo_duo' },
    normalizerVersion: 'lol-rank-v1',
    rawPayload: { lp: 75 },
    accessToken: 'proof-secret-token',
    ...overrides,
  };
}

describe('Gaming Passport domain policies', () => {
  it('keeps a Passport private draft and not publishable without a verified provider', () => {
    const draft = passport({ status: PASSPORT_STATUSES.DRAFT_PRIVATE });
    const result = getPublishability({
      passport: draft,
      parentAuth: parentAuth(),
      linkedProviderAccounts: [],
    });

    assert.equal(draft.status, PASSPORT_STATUSES.DRAFT_PRIVATE);
    assert.equal(result.publishable, false);
    assert.ok(result.missing.includes('verified_linked_provider'));
  });

  it('lets verified Discord satisfy minimum verification without creating competitive proof', () => {
    const discord = linkedProvider({
      id: 'lpa_discord',
      provider: LINKED_PROVIDER_IDS.DISCORD,
      externalAccountId: 'discord-user-1',
      displayName: 'PlayerOne',
    });

    assert.equal(
      isPassportPublishable({
        passport: passport(),
        parentAuth: parentAuth(),
        linkedProviderAccounts: [discord],
      }),
      true
    );

    assert.deepEqual(
      getFeaturedVerifiedProofs({
        proofs: [],
        linkedProviderAccounts: [discord],
      }),
      []
    );
  });

  it('treats Riot verification as provider ownership without creating a rank by itself', () => {
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
      parentAuth: parentAuth(),
      linkedProviderAccounts: [riot],
      verifiedProofs: [ownershipProof],
      featuredProofIds: [ownershipProof.id],
    });

    assert.equal(projection.featuredProofs.length, 1);
    assert.equal(projection.featuredProofs[0].proofType, PROOF_TYPES.PROVIDER_OWNERSHIP);
    assert.ok(projection.featuredProofs.every((proof) => proof.proofType !== PROOF_TYPES.COMPETITIVE_RANK));
  });

  it('allows current League of Legends rank proof as competitive_rank', () => {
    const riot = linkedProvider();
    const lolRank = verifiedProof();

    assert.equal(canDisplayVerifiedProof(lolRank, [riot]), true);

    const projection = buildPublicPassportProjection({
      passport: passport(),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [riot],
      verifiedProofs: [lolRank],
      featuredProofIds: [lolRank.id],
    });

    assert.equal(projection.featuredProofs[0].game, GAME_IDS.LEAGUE_OF_LEGENDS);
    assert.equal(projection.featuredProofs[0].proofType, PROOF_TYPES.COMPETITIVE_RANK);
  });

  it('never includes revoked proofs publicly', () => {
    const riot = linkedProvider();
    const revoked = verifiedProof({
      id: 'proof_revoked',
      status: VERIFIED_PROOF_STATUSES.REVOKED,
      revokedAt: now,
    });

    assert.equal(canDisplayVerifiedProof(revoked, [riot]), false);
    assert.deepEqual(
      getFeaturedVerifiedProofs({
        proofs: [revoked],
        linkedProviderAccounts: [riot],
      }),
      []
    );
  });

  it('keeps stale proof status explicit instead of silently treating it as current', () => {
    const riot = linkedProvider();
    const stale = verifiedProof({
      id: 'proof_stale',
      status: VERIFIED_PROOF_STATUSES.STALE,
      staleAt: now,
    });

    const projection = buildPublicPassportProjection({
      passport: passport(),
      parentAuth: parentAuth(),
      linkedProviderAccounts: [riot],
      verifiedProofs: [stale],
      featuredProofIds: [stale.id],
    });

    assert.equal(projection.featuredProofs[0].status, VERIFIED_PROOF_STATUSES.STALE);
    assert.notEqual(projection.featuredProofs[0].status, VERIFIED_PROOF_STATUSES.CURRENT);
  });

  it('never places Parent Auth Google or email into the public projection', () => {
    const riot = linkedProvider();
    const projection = buildPublicPassportProjection({
      passport: passport(),
      parentAuth: parentAuth(PARENT_AUTH_PROVIDER_IDS.GOOGLE),
      linkedProviderAccounts: [riot],
      verifiedProofs: [verifiedProof()],
    });

    const json = JSON.stringify(projection);
    assert.equal(Object.hasOwn(projection, 'parentAuth'), false);
    assert.equal(json.includes('owner@example.com'), false);
    assert.equal(json.includes(PARENT_AUTH_PROVIDER_IDS.GOOGLE), false);
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

  it('requires global ownership uniqueness for provider plus externalAccountId', () => {
    const result = validateGlobalProviderOwnership([
      linkedProvider({ id: 'lpa_a', externalAccountId: 'PUUID-1' }),
      linkedProvider({ id: 'lpa_b', externalAccountId: 'puuid-1' }),
    ]);

    assert.equal(result.ok, false);
    assert.equal(result.conflictKey, 'riot::puuid-1');
  });

  it('excludes tokens, emails, raw payloads, and private metadata from public projection', () => {
    const riot = linkedProvider({
      metadataSafe: {
        accessToken: 'provider-secret',
        region: 'NA',
      },
    });
    const proof = verifiedProof({
      metadataSafe: {
        queue: 'solo_duo',
        privateNote: 'owner-only',
        rawPayloadDigest: 'raw',
        email: 'owner@example.com',
        accessToken: 'proof-secret',
      },
    });

    const projection = buildPublicPassportProjection({
      passport: passport(),
      parentAuth: parentAuth(PARENT_AUTH_PROVIDER_IDS.EMAIL_PASSWORD),
      linkedProviderAccounts: [riot],
      verifiedProofs: [proof],
      featuredProofIds: [proof.id],
    });

    const json = JSON.stringify(projection);
    assert.equal(json.includes('accessToken'), false);
    assert.equal(json.includes('proof-secret'), false);
    assert.equal(json.includes('provider-secret'), false);
    assert.equal(json.includes('owner@example.com'), false);
    assert.equal(json.includes('rawPayload'), false);
    assert.equal(json.includes('privateNote'), false);
    assert.equal(projection.featuredProofs[0].metadataSafe.queue, 'solo_duo');
  });
});
