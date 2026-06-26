import { normalizePublicSlug, isCanonicalPublicSlug } from '../domain/index.js';
import { BLOCKED_VISUAL_IDENTITY_TERMS } from './trustSafetyTerms.js';

export const PUBLIC_PROFILE_REPORT_CATEGORIES = Object.freeze([
  'impersonation',
  'offensive_content',
  'offensive_cosmetic',
  'fake_proof_or_rank',
  'privacy_request',
  'harassment',
  'other',
]);

export const PUBLIC_PROFILE_REPORT_CATEGORY_LABELS = Object.freeze({
  impersonation: 'Impersonation',
  offensive_content: 'Offensive content',
  offensive_cosmetic: 'Offensive cosmetic',
  fake_proof_or_rank: 'Fake proof or rank',
  privacy_request: 'Privacy request',
  harassment: 'Harassment',
  other: 'Other',
});

export const REPORT_DETAILS_MAX_LENGTH = 800;

export function isValidReportCategory(category) {
  return PUBLIC_PROFILE_REPORT_CATEGORIES.includes(String(category || '').trim());
}

export function normalizeReportDetails(details) {
  return String(details || '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function sanitizePublicProfileReportInput(input = {}) {
  return {
    slug: normalizePublicSlug(input.slug),
    category: String(input.category || '').trim(),
    details: normalizeReportDetails(input.details),
  };
}

export function validatePublicProfileReportInput(input = {}) {
  const safe = sanitizePublicProfileReportInput(input);
  const errors = {};

  if (!isCanonicalPublicSlug(safe.slug)) errors.slug = 'invalid_slug';
  if (!isValidReportCategory(safe.category)) errors.category = 'invalid_category';
  if (safe.details.length > REPORT_DETAILS_MAX_LENGTH) errors.details = 'too_long';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: safe,
  };
}

export function getReportCategoryLabel(category) {
  return PUBLIC_PROFILE_REPORT_CATEGORY_LABELS[category] || 'Other';
}

export function getCosmeticAbusePolicy() {
  return {
    blockedTerms: [...BLOCKED_VISUAL_IDENTITY_TERMS],
    disallowFakeProofs: true,
    disallowFakeRanks: true,
    disallowOfficialImpersonation: true,
    disallowThirdPartyAssets: true,
    disallowProofStateOverrides: true,
  };
}
