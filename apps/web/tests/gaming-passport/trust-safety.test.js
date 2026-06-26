import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BLOCKED_VISUAL_IDENTITY_TERMS,
  PUBLIC_PROFILE_REPORT_CATEGORIES,
  REPORT_DETAILS_MAX_LENGTH,
  getCosmeticAbusePolicy,
  includesBlockedVisualIdentityTerm,
  normalizeReportDetails,
  sanitizePublicProfileReportInput,
  validatePublicProfileReportInput,
} from '../../src/gaming-passport/trust-safety/index.js';

describe('Gaming Passport trust and safety policy', () => {
  it('defines public profile report categories without provider launch categories', () => {
    assert.deepEqual(PUBLIC_PROFILE_REPORT_CATEGORIES, [
      'impersonation',
      'offensive_content',
      'offensive_cosmetic',
      'fake_proof_or_rank',
      'privacy_request',
      'harassment',
      'other',
    ]);
    assert.equal(PUBLIC_PROFILE_REPORT_CATEGORIES.includes('riot_oauth'), false);
    assert.equal(PUBLIC_PROFILE_REPORT_CATEGORIES.includes('provider_launch'), false);
  });

  it('normalizes report details and validates canonical report input', () => {
    assert.equal(normalizeReportDetails('  fake   proof\nclaim  '), 'fake proof claim');
    assert.deepEqual(sanitizePublicProfileReportInput({
      slug: ' Player One!! ',
      category: 'impersonation',
      details: '  pretending   to be me ',
    }), {
      slug: 'player-one',
      category: 'impersonation',
      details: 'pretending to be me',
    });
    assert.equal(validatePublicProfileReportInput({
      slug: 'player-one',
      category: 'impersonation',
      details: 'pretending to be me',
    }).ok, true);
  });

  it('rejects invalid categories and oversized details', () => {
    assert.equal(validatePublicProfileReportInput({
      slug: 'player-one',
      category: 'riot_oauth',
      details: 'bad category',
    }).errors.category, 'invalid_category');

    assert.equal(validatePublicProfileReportInput({
      slug: 'player-one',
      category: 'other',
      details: 'x'.repeat(REPORT_DETAILS_MAX_LENGTH + 1),
    }).errors.details, 'too_long');
  });

  it('keeps blocked visual identity terms aligned with provider, rank, and staff impersonation risk', () => {
    for (const term of [
      'riot',
      'valorant',
      'league of legends',
      'discord',
      'verified',
      'proof',
      'rank boost',
      'admin',
      'staff',
      'official',
      'moderator',
      'support',
      'challenger',
      'grandmaster',
      'master',
      'diamond',
      'platinum',
      'gold',
      'silver',
      'bronze',
      'iron',
      'radiant',
      'immortal',
    ]) {
      assert.equal(BLOCKED_VISUAL_IDENTITY_TERMS.includes(term), true);
      assert.equal(includesBlockedVisualIdentityTerm(`fake ${term} frame`), true);
    }
  });

  it('states cosmetics cannot manufacture proof, rank, official status, or proof state changes', () => {
    assert.deepEqual(getCosmeticAbusePolicy(), {
      blockedTerms: [...BLOCKED_VISUAL_IDENTITY_TERMS],
      disallowFakeProofs: true,
      disallowFakeRanks: true,
      disallowOfficialImpersonation: true,
      disallowThirdPartyAssets: true,
      disallowProofStateOverrides: true,
    });
  });
});
