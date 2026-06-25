import { PASSPORT_STATUSES } from './constants.js';
import { isCanonicalPublicSlug, normalizePublicSlug } from './contracts.js';
import { getPublishability } from './publicationPolicy.js';

export const PUBLISH_REQUIREMENTS = Object.freeze({
  PARENT_AUTH: 'parent_auth',
  OWNER: 'owner',
  PASSPORT: 'passport',
  PUBLICATION_CONSENT: 'publication_consent',
  CANONICAL_SLUG: 'canonical_slug',
  VERIFIED_LINKED_PROVIDER: 'verified_linked_provider',
  NOT_SUSPENDED: 'not_suspended',
  NOT_PUBLISHED: 'not_published',
  PUBLISHED: 'published',
});

export function buildPublishReadiness(input = {}) {
  const passport = input.passport || null;
  const parentAuth = input.parentAuth || null;
  const linkedProviderAccounts = Array.isArray(input.linkedProviderAccounts)
    ? input.linkedProviderAccounts
    : [];
  const normalizedSlug = normalizePublicSlug(input.slug ?? passport?.slug ?? '');
  const missing = new Set();

  if (!passport) missing.add(PUBLISH_REQUIREMENTS.PASSPORT);
  if (!hasParentAuth(parentAuth)) missing.add(PUBLISH_REQUIREMENTS.PARENT_AUTH);
  if (!hasOwnerMatch({ passport, parentAuth })) missing.add(PUBLISH_REQUIREMENTS.OWNER);

  const publishability = getPublishability({
    passport: passport ? { ...passport, slug: normalizedSlug || passport.slug } : passport,
    parentAuth,
    linkedProviderAccounts,
  });

  for (const item of publishability.missing) missing.add(item);
  if (!normalizedSlug || !isCanonicalPublicSlug(normalizedSlug)) {
    missing.add(PUBLISH_REQUIREMENTS.CANONICAL_SLUG);
  }

  return {
    ok: missing.size === 0,
    publishable: missing.size === 0,
    missing: [...missing],
    normalizedSlug,
    status: passport?.status || PASSPORT_STATUSES.DRAFT_PRIVATE,
  };
}

export function canClaimSlug(input = {}) {
  const passport = input.passport || null;
  const parentAuth = input.parentAuth || null;
  const normalizedSlug = normalizePublicSlug(input.slug || '');
  const errors = [];

  if (!passport) errors.push(PUBLISH_REQUIREMENTS.PASSPORT);
  if (!hasParentAuth(parentAuth)) errors.push(PUBLISH_REQUIREMENTS.PARENT_AUTH);
  if (!hasOwnerMatch({ passport, parentAuth })) errors.push(PUBLISH_REQUIREMENTS.OWNER);
  if (!normalizedSlug || !isCanonicalPublicSlug(normalizedSlug)) errors.push(PUBLISH_REQUIREMENTS.CANONICAL_SLUG);
  if (passport?.status === PASSPORT_STATUSES.PUBLISHED) errors.push('published_slug_locked');
  if (passport?.status === PASSPORT_STATUSES.SUSPENDED) errors.push(PUBLISH_REQUIREMENTS.NOT_SUSPENDED);

  return {
    ok: errors.length === 0,
    errors,
    normalizedSlug,
  };
}

export function canSetPublicationConsent(input = {}) {
  const passport = input.passport || null;
  const parentAuth = input.parentAuth || null;
  const errors = [];

  if (!passport) errors.push(PUBLISH_REQUIREMENTS.PASSPORT);
  if (!hasParentAuth(parentAuth)) errors.push(PUBLISH_REQUIREMENTS.PARENT_AUTH);
  if (!hasOwnerMatch({ passport, parentAuth })) errors.push(PUBLISH_REQUIREMENTS.OWNER);
  if (passport?.status === PASSPORT_STATUSES.SUSPENDED && input.consent === true) {
    errors.push(PUBLISH_REQUIREMENTS.NOT_SUSPENDED);
  }

  return { ok: errors.length === 0, errors };
}

export function canPublishPassport(input = {}) {
  const readiness = buildPublishReadiness(input);
  const errors = [...readiness.missing];
  const status = input.passport?.status;

  if (status === PASSPORT_STATUSES.SUSPENDED && !errors.includes(PUBLISH_REQUIREMENTS.NOT_SUSPENDED)) {
    errors.push(PUBLISH_REQUIREMENTS.NOT_SUSPENDED);
  }

  return {
    ok: errors.length === 0,
    errors,
    missing: errors,
    readiness,
  };
}

export function canUnpublishPassport(input = {}) {
  const passport = input.passport || null;
  const parentAuth = input.parentAuth || null;
  const errors = [];

  if (!passport) errors.push(PUBLISH_REQUIREMENTS.PASSPORT);
  if (!hasParentAuth(parentAuth)) errors.push(PUBLISH_REQUIREMENTS.PARENT_AUTH);
  if (!hasOwnerMatch({ passport, parentAuth })) errors.push(PUBLISH_REQUIREMENTS.OWNER);
  if (passport?.status === PASSPORT_STATUSES.SUSPENDED) errors.push(PUBLISH_REQUIREMENTS.NOT_SUSPENDED);

  return {
    ok: errors.length === 0,
    errors,
    noop: passport?.status !== PASSPORT_STATUSES.PUBLISHED,
  };
}

export function buildPublishCommandResult(input = {}) {
  const publish = canPublishPassport(input);
  return {
    ok: publish.ok,
    command: 'publish',
    blocked: !publish.ok,
    missing: publish.missing,
    normalizedSlug: publish.readiness.normalizedSlug,
  };
}

export function buildUnpublishCommandResult(input = {}) {
  const unpublish = canUnpublishPassport(input);
  return {
    ok: unpublish.ok,
    command: 'unpublish',
    blocked: !unpublish.ok,
    noop: unpublish.noop,
    missing: unpublish.errors,
  };
}

function hasParentAuth(parentAuth) {
  return parentAuth?.authenticated === true;
}

function hasOwnerMatch({ passport, parentAuth }) {
  if (!passport || !parentAuth?.ownerId) return false;
  return passport.ownerId === parentAuth.ownerId;
}
