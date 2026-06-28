import {
  LINKED_PROVIDER_IDS,
  LINKED_PROVIDER_STATUSES,
  PASSPORT_STATUSES,
  PROOF_SOURCES,
  PROOF_TYPES,
  PROOF_VISIBILITY,
  PROVIDER_VISIBILITY,
  VERIFIED_PROOF_STATUSES,
  VERIFICATION_METHODS,
} from './constants.js';

export const OSU_PROFILE_LINKED_SOURCE_KEY = 'osu:profile_linked';
export const OSU_OWNER_VISIBILITY_CONTROLS_BLOCK_REASON = 'owner_visibility_controls_missing';
export const OSU_PUBLIC_PROJECTION_BLOCK_REASON = 'public_projection_allowlist_disabled';
export const OSU_PUBLIC_PROJECTION_NEXT_RM = 'RM-34 osu! Public Profile Trust-Safety QA';

export const OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS = Object.freeze([
  'providerId',
  'displayName',
  'externalUsername',
  'profileUrl',
  'verifiedAt',
]);

export const OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS = Object.freeze([
  'type',
  'label',
  'source',
  'observedAt',
  'visibility',
]);

export function isOsuLinkedProvider(account) {
  return account?.provider === LINKED_PROVIDER_IDS.OSU;
}

export function isOsuProfileLinkedProof(proof) {
  return (
    proof?.provider === LINKED_PROVIDER_IDS.OSU &&
    proof?.proofType === PROOF_TYPES.PROVIDER_OWNERSHIP &&
    proof?.sourceKey === OSU_PROFILE_LINKED_SOURCE_KEY
  );
}

export function canProjectOsuLinkedProvider(account, options = {}) {
  if (!isOsuLinkedProvider(account)) return true;

  return getOsuPublicProjectionDecision({
    ...options,
    linkedProviderAccount: account,
  }).allowed;
}

export function canProjectOsuProfileLinkedProof({ proof, linkedProviderAccounts, passport, options = {} } = {}) {
  if (!isOsuProfileLinkedProof(proof)) return true;

  const linkedProviderAccount = (Array.isArray(linkedProviderAccounts) ? linkedProviderAccounts : [])
    .find((account) => account.id === proof.linkedProviderAccountId);

  return getOsuPublicProjectionDecision({
    ...options,
    passport,
    linkedProviderAccount,
    proof,
  }).allowed;
}

export function getOsuPublicProjectionDecision({
  passport,
  linkedProviderAccount,
  proof,
  ownerVisibilityControlsEnabled = true,
  publicProjectionAllowlistEnabled = false,
  suspensionBlock = false,
  reportBlock = false,
} = {}) {
  if (!isOsuLinkedProvider(linkedProviderAccount) && !isOsuProfileLinkedProof(proof)) {
    return allow('not_osu');
  }

  if (!ownerVisibilityControlsEnabled) return deny(OSU_OWNER_VISIBILITY_CONTROLS_BLOCK_REASON);
  if (passport?.status === PASSPORT_STATUSES.SUSPENDED || passport?.suspendedAt || suspensionBlock || reportBlock) {
    return deny('passport_blocked');
  }
  if (!passport || passport.status !== PASSPORT_STATUSES.PUBLISHED) return deny('passport_not_published');
  if (passport.publicationConsent !== true) return deny('owner_publish_consent_missing');
  if (!isOsuLinkedProvider(linkedProviderAccount)) return deny('linked_provider_missing');
  if (linkedProviderAccount.status !== LINKED_PROVIDER_STATUSES.VERIFIED) return deny('linked_provider_not_verified');
  if (linkedProviderAccount.visibility !== PROVIDER_VISIBILITY.PUBLIC) return deny('linked_provider_not_public');
  if (linkedProviderAccount.revokedAt || linkedProviderAccount.staleAt) return deny('linked_provider_not_current');
  if (!isOsuProfileLinkedProof(proof)) return deny('profile_linked_proof_missing');
  if (proof.status !== VERIFIED_PROOF_STATUSES.CURRENT) return deny('proof_not_current');
  if (proof.visibility !== PROOF_VISIBILITY.PUBLIC) return deny('proof_not_public');
  if (proof.source !== PROOF_SOURCES.LINKED_PROVIDER) return deny('proof_source_not_linked_provider');
  if (proof.verificationMethod !== VERIFICATION_METHODS.OAUTH) return deny('proof_not_oauth_verified');
  if (proof.revokedAt || proof.staleAt) return deny('proof_not_current');
  if (!publicProjectionAllowlistEnabled) return deny(OSU_PUBLIC_PROJECTION_BLOCK_REASON);

  return allow('policy_gate_passed');
}

function allow(reason) {
  return {
    allowed: true,
    reason,
    nextMilestone: null,
    allowedProviderFields: OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS,
    allowedProofFields: OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS,
  };
}

function deny(reason) {
  return {
    allowed: false,
    reason,
    nextMilestone: OSU_PUBLIC_PROJECTION_NEXT_RM,
    allowedProviderFields: OSU_PUBLIC_PROJECTION_ALLOWED_PROVIDER_FIELDS,
    allowedProofFields: OSU_PUBLIC_PROJECTION_ALLOWED_PROOF_FIELDS,
  };
}
