const OSU_PROVIDER = 'osu';
const PROFILE_LINKED_SOURCE_KEY = 'osu:profile_linked';
const PUBLIC_VISIBILITY = 'public';
const PRIVATE_VISIBILITY = 'private';
const PROOF_VISIBILITIES = new Set([PRIVATE_VISIBILITY, PUBLIC_VISIBILITY]);

export async function createOsuLinkState(supabase, { ownerId, passportId, stateHash, scopes, expiresAt }) {
  await assertOwnedPassport(supabase, ownerId, passportId);

  const { data: intent, error: intentError } = await supabase
    .from('provider_connection_intents')
    .insert({
      owner_id: ownerId,
      passport_id: passportId,
      provider: OSU_PROVIDER,
      status: 'pending',
      state_hash: stateHash,
      requested_scopes: scopes,
      expires_at: expiresAt,
    })
    .select('id, owner_id, passport_id, provider, status, expires_at')
    .maybeSingle();
  if (intentError) throw intentError;

  const { data: callbackState, error: stateError } = await supabase
    .from('provider_callback_states')
    .insert({
      owner_id: ownerId,
      passport_id: passportId,
      connection_intent_id: intent.id,
      provider: OSU_PROVIDER,
      status: 'pending',
      state_hash: stateHash,
      expires_at: expiresAt,
    })
    .select('id, owner_id, passport_id, connection_intent_id, provider, status, state_hash, expires_at, consumed_at')
    .maybeSingle();
  if (stateError) throw stateError;

  await insertOsuAuditEvent(supabase, {
    ownerId,
    passportId,
    eventType: 'callback_state_created',
    eventStatus: 'pending',
    metadata: { tokenStrategy: 'no_refresh_token_storage' },
  });

  return { intent, callbackState };
}

export async function findOsuCallbackStateByHash(supabase, stateHash) {
  const { data, error } = await supabase
    .from('provider_callback_states')
    .select('id, owner_id, passport_id, connection_intent_id, provider, status, state_hash, expires_at, consumed_at')
    .eq('provider', OSU_PROVIDER)
    .eq('state_hash', stateHash)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function completeOsuLink(supabase, { callbackState, identity, observedAt }) {
  const existing = await findExistingOsuAccount(supabase, identity.externalAccountId);
  if (existing && existing.owner_id !== callbackState.owner_id) {
    const error = new Error('external_account_conflict');
    error.status = 409;
    throw error;
  }

  const linkedProviderAccount = existing
    ? await updateOsuLinkedProviderAccount(supabase, existing.id, identity, observedAt)
    : await insertOsuLinkedProviderAccount(supabase, callbackState, identity, observedAt);

  const proof = await upsertOsuProfileLinkedProof(supabase, {
    callbackState,
    linkedProviderAccount,
    identity,
    observedAt,
  });

  await markOsuStateConsumed(supabase, callbackState);
  await insertOsuAuditEvent(supabase, {
    ownerId: callbackState.owner_id,
    passportId: callbackState.passport_id,
    eventType: 'intent_consumed',
    eventStatus: 'verified_no_token_stored',
    metadata: {
      providerProof: 'profile_linked',
      tokenStrategy: 'no_refresh_token_storage',
      tokenRevokedImmediately: true,
    },
  });

  return { linkedProviderAccount, proof };
}

export async function getOsuConnectionStatus(supabase, { ownerId, passportId }) {
  await assertOwnedPassport(supabase, ownerId, passportId);
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .select('id, provider, display_name, status, visibility, verified_at, last_synced_at, stale_at, revoked_at, metadata_safe')
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .eq('provider', OSU_PROVIDER)
    .order('created_at', { ascending: false });
  if (error) throw error;

  if (!Array.isArray(data) || data.length === 0) return [];

  const proofsByAccountId = await getOsuProfileProofsByAccountId(supabase, {
    ownerId,
    passportId,
    linkedProviderAccountIds: data.map((row) => row.id),
  });

  return data.map((row) => toSafeConnectionStatus(row, proofsByAccountId.get(row.id)));
}

export async function setOsuProfileProofVisibility(supabase, {
  ownerId,
  passportId,
  linkedProviderAccountId,
  nextVisibility,
}) {
  const requestedVisibility = safeVisibility(nextVisibility);
  if (!PROOF_VISIBILITIES.has(requestedVisibility)) {
    const error = new Error('invalid_visibility');
    error.status = 400;
    throw error;
  }

  const passport = await getOwnedPassportForVisibility(supabase, ownerId, passportId);
  const account = await getOwnedLinkedProviderAccount(supabase, {
    ownerId,
    passportId,
    linkedProviderAccountId,
  });

  validateAccountForVisibility(account, requestedVisibility);

  const proof = await getOsuProfileProof(supabase, {
    ownerId,
    passportId,
    linkedProviderAccountId,
  });

  validateProofForVisibility(proof, requestedVisibility);
  if (requestedVisibility === PUBLIC_VISIBILITY) validatePassportForPublicVisibility(passport);

  const updatedAccount = await updateLinkedProviderVisibility(supabase, {
    ownerId,
    passportId,
    linkedProviderAccountId,
    nextVisibility: requestedVisibility,
  });

  const updatedProof = await updateProofVisibility(supabase, {
    ownerId,
    passportId,
    proofId: proof.id,
    nextVisibility: requestedVisibility,
  });

  await insertOsuAuditEvent(supabase, {
    ownerId,
    passportId,
    eventType: 'proof_visibility_changed',
    eventStatus: requestedVisibility === PUBLIC_VISIBILITY
      ? 'owner_requested_public_projection_gated'
      : 'owner_requested_private_projection_blocked',
    metadata: {
      proofModel: 'profile_linked',
      nextVisibility: requestedVisibility,
      publicServingAllowed: false,
      projectionGate: getProjectionEligibility({
        passport,
        account: updatedAccount,
        proof: updatedProof,
      }).reason,
    },
  });

  return {
    status: 'proof_visibility_updated',
    connection: toSafeConnectionStatus(updatedAccount, updatedProof),
    proof: toSafeProofStatus(updatedProof),
    visibility: requestedVisibility,
    publicServingAllowed: false,
    projectionEligibility: getProjectionEligibility({
      passport,
      account: updatedAccount,
      proof: updatedProof,
    }),
  };
}

export async function unlinkOsuProvider(supabase, { ownerId, passportId, linkedProviderAccountId }) {
  await assertOwnedPassport(supabase, ownerId, passportId);
  const { data: account, error } = await supabase
    .from('linked_provider_accounts')
    .select('id, owner_id, passport_id, provider, status')
    .eq('id', linkedProviderAccountId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .eq('provider', OSU_PROVIDER)
    .maybeSingle();
  if (error) throw error;
  if (!account) {
    const notFound = new Error('linked_provider_not_found');
    notFound.status = 404;
    throw notFound;
  }

  const revokedAt = new Date().toISOString();
  if (account.status !== 'revoked') {
    const { error: accountError } = await supabase
      .from('linked_provider_accounts')
      .update({
        status: 'revoked',
        visibility: 'private',
        revoked_at: revokedAt,
        metadata_safe: { unlinkStrategy: 'local_revoke_no_token_stored' },
      })
      .eq('id', linkedProviderAccountId)
      .eq('owner_id', ownerId)
      .eq('passport_id', passportId);
    if (accountError) throw accountError;

    const { error: proofError } = await supabase
      .from('verified_proofs')
      .update({
        status: 'revoked',
        visibility: 'private',
        revoked_at: revokedAt,
        metadata_safe: { unlinkStrategy: 'local_revoke_no_token_stored' },
      })
      .eq('linked_provider_account_id', linkedProviderAccountId)
      .eq('owner_id', ownerId)
      .eq('passport_id', passportId)
      .eq('provider', OSU_PROVIDER);
    if (proofError) throw proofError;

    const { error: tokenError } = await supabase
      .from('provider_token_vault')
      .update({
        token_status: 'revoked',
        revoked_at: revokedAt,
      })
      .eq('linked_provider_account_id', linkedProviderAccountId)
      .eq('owner_id', ownerId)
      .eq('passport_id', passportId)
      .eq('provider', OSU_PROVIDER);
    if (tokenError) throw tokenError;
  }

  await insertOsuAuditEvent(supabase, {
    ownerId,
    passportId,
    eventType: 'revoke_requested',
    eventStatus: 'local_revoked_no_token_stored',
    metadata: { linkedProviderAccountId, tokenStrategy: 'no_refresh_token_storage' },
  });

  return {
    linkedProviderAccountId,
    status: 'revoked',
    idempotent: account.status === 'revoked',
    publicServingAllowed: false,
  };
}

async function assertOwnedPassport(supabase, ownerId, passportId) {
  const { data, error } = await supabase
    .from('gaming_passports')
    .select('id, owner_id')
    .eq('id', passportId)
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const notFound = new Error('passport_not_found');
    notFound.status = 404;
    throw notFound;
  }
  return data;
}

async function getOwnedPassportForVisibility(supabase, ownerId, passportId) {
  const { data, error } = await supabase
    .from('gaming_passports')
    .select('id, owner_id, status, publication_consent, suspended_at')
    .eq('id', passportId)
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const notFound = new Error('passport_not_found');
    notFound.status = 404;
    throw notFound;
  }
  return data;
}

async function getOwnedLinkedProviderAccount(supabase, { ownerId, passportId, linkedProviderAccountId }) {
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .select('id, owner_id, passport_id, provider, display_name, status, visibility, verified_at, last_synced_at, stale_at, revoked_at, metadata_safe')
    .eq('id', linkedProviderAccountId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const notFound = new Error('linked_provider_not_found');
    notFound.status = 404;
    throw notFound;
  }
  return data;
}

async function getOsuProfileProof(supabase, { ownerId, passportId, linkedProviderAccountId }) {
  const { data, error } = await supabase
    .from('verified_proofs')
    .select('id, linked_provider_account_id, provider, proof_type, source_key, source, verification_method, status, visibility, verified_at, last_synced_at, stale_at, revoked_at')
    .eq('linked_provider_account_id', linkedProviderAccountId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const notFound = new Error('profile_linked_proof_not_found');
    notFound.status = 404;
    throw notFound;
  }
  return data;
}

async function updateLinkedProviderVisibility(supabase, {
  ownerId,
  passportId,
  linkedProviderAccountId,
  nextVisibility,
}) {
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .update({ visibility: nextVisibility })
    .eq('id', linkedProviderAccountId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .eq('provider', OSU_PROVIDER)
    .select('id, provider, display_name, status, visibility, verified_at, last_synced_at, stale_at, revoked_at, metadata_safe')
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function updateProofVisibility(supabase, {
  ownerId,
  passportId,
  proofId,
  nextVisibility,
}) {
  const { data, error } = await supabase
    .from('verified_proofs')
    .update({ visibility: nextVisibility })
    .eq('id', proofId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .eq('provider', OSU_PROVIDER)
    .eq('source_key', PROFILE_LINKED_SOURCE_KEY)
    .select('id, linked_provider_account_id, provider, proof_type, source_key, source, verification_method, status, visibility, verified_at, last_synced_at, stale_at, revoked_at')
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getOsuProfileProofsByAccountId(supabase, { ownerId, passportId, linkedProviderAccountIds }) {
  const ids = Array.isArray(linkedProviderAccountIds) ? linkedProviderAccountIds.filter(Boolean) : [];
  if (ids.length === 0) return new Map();

  const { data, error } = await supabase
    .from('verified_proofs')
    .select('linked_provider_account_id, provider, proof_type, source_key, source, verification_method, status, visibility, verified_at, last_synced_at, stale_at, revoked_at')
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .eq('provider', OSU_PROVIDER)
    .eq('source_key', PROFILE_LINKED_SOURCE_KEY)
    .in('linked_provider_account_id', ids);
  if (error) throw error;

  return new Map((Array.isArray(data) ? data : []).map((proof) => [proof.linked_provider_account_id, proof]));
}

function validateAccountForVisibility(account, nextVisibility) {
  if (account.provider !== OSU_PROVIDER) {
    const error = new Error('non_osu_provider_rejected');
    error.status = 400;
    throw error;
  }
  if (account.revoked_at || account.stale_at) {
    const error = new Error('linked_provider_not_current');
    error.status = 409;
    throw error;
  }
  if (account.status !== 'verified') {
    const error = new Error('linked_provider_not_verified');
    error.status = 409;
    throw error;
  }
  if (nextVisibility !== PUBLIC_VISIBILITY && nextVisibility !== PRIVATE_VISIBILITY) {
    const error = new Error('invalid_visibility');
    error.status = 400;
    throw error;
  }
}

function validateProofForVisibility(proof) {
  if (
    proof.provider !== OSU_PROVIDER ||
    proof.source_key !== PROFILE_LINKED_SOURCE_KEY ||
    proof.proof_type !== 'provider_ownership' ||
    proof.source !== 'linked_provider' ||
    proof.verification_method !== 'oauth'
  ) {
    const error = new Error('non_osu_profile_proof_rejected');
    error.status = 400;
    throw error;
  }
  if (proof.status !== 'current' || proof.revoked_at || proof.stale_at) {
    const error = new Error('profile_linked_proof_not_current');
    error.status = 409;
    throw error;
  }
}

function validatePassportForPublicVisibility(passport) {
  if (passport.status === 'suspended' || passport.suspended_at) {
    const error = new Error('passport_blocked');
    error.status = 409;
    throw error;
  }
  if (passport.status !== 'published' || passport.publication_consent !== true) {
    const error = new Error('passport_not_publication_ready');
    error.status = 409;
    throw error;
  }
}

function getProjectionEligibility({ passport, account, proof }) {
  if (passport?.status === 'suspended' || passport?.suspended_at) return blockedProjection('passport_blocked');
  if (!passport || passport.status !== 'published') return blockedProjection('passport_not_published');
  if (passport.publication_consent !== true) return blockedProjection('owner_publish_consent_missing');
  if (account?.status !== 'verified' || account?.revoked_at || account?.stale_at) {
    return blockedProjection('linked_provider_not_current');
  }
  if (account.visibility !== PUBLIC_VISIBILITY) return blockedProjection('linked_provider_not_public');
  if (proof?.status !== 'current' || proof?.revoked_at || proof?.stale_at) return blockedProjection('proof_not_current');
  if (proof.visibility !== PUBLIC_VISIBILITY) return blockedProjection('proof_not_public');

  return blockedProjection('public_projection_allowlist_disabled');
}

function blockedProjection(reason) {
  return {
    allowed: false,
    reason,
    nextMilestone: 'RM-33 osu! Public Projection Smoke / Projection QA',
  };
}

async function findExistingOsuAccount(supabase, externalAccountId) {
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .select('id, owner_id, passport_id, provider')
    .eq('provider', OSU_PROVIDER)
    .eq('external_account_id', externalAccountId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function insertOsuLinkedProviderAccount(supabase, callbackState, identity, observedAt) {
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .insert({
      owner_id: callbackState.owner_id,
      passport_id: callbackState.passport_id,
      provider: OSU_PROVIDER,
      external_account_id: identity.externalAccountId,
      display_name: identity.displayName,
      status: 'verified',
      visibility: 'private',
      metadata_safe: {
        username: identity.username,
        profileUrl: identity.profileUrl,
        proofModel: 'profile_linked',
      },
      verified_at: observedAt,
      last_synced_at: observedAt,
    })
    .select('id, owner_id, passport_id, provider, display_name, status, visibility, verified_at, last_synced_at, metadata_safe')
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function updateOsuLinkedProviderAccount(supabase, id, identity, observedAt) {
  const { data, error } = await supabase
    .from('linked_provider_accounts')
    .update({
      display_name: identity.displayName,
      status: 'verified',
      visibility: 'private',
      metadata_safe: {
        username: identity.username,
        profileUrl: identity.profileUrl,
        proofModel: 'profile_linked',
      },
      verified_at: observedAt,
      last_synced_at: observedAt,
      stale_at: null,
      revoked_at: null,
    })
    .eq('id', id)
    .select('id, owner_id, passport_id, provider, display_name, status, visibility, verified_at, last_synced_at, metadata_safe')
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function upsertOsuProfileLinkedProof(supabase, { callbackState, linkedProviderAccount, identity, observedAt }) {
  const payload = {
    passport_id: callbackState.passport_id,
    owner_id: callbackState.owner_id,
    linked_provider_account_id: linkedProviderAccount.id,
    provider: OSU_PROVIDER,
    game: null,
    proof_type: 'provider_ownership',
    source_key: PROFILE_LINKED_SOURCE_KEY,
    mode: 'profile',
    title: 'Linked osu! account',
    display_value: identity.displayName,
    normalized_value: null,
    season: null,
    source: 'linked_provider',
    verification_method: 'oauth',
    status: 'current',
    visibility: 'private',
    metadata_safe: {
      proofModel: 'profile_linked',
      profileUrl: identity.profileUrl,
    },
    normalizer_version: 'osu-profile-linked-v1',
    verified_at: observedAt,
    last_synced_at: observedAt,
    stale_at: null,
    revoked_at: null,
  };

  const { data: existing, error: existingError } = await supabase
    .from('verified_proofs')
    .select('id')
    .eq('linked_provider_account_id', linkedProviderAccount.id)
    .eq('source_key', PROFILE_LINKED_SOURCE_KEY)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const { data, error } = await supabase
      .from('verified_proofs')
      .update(payload)
      .eq('id', existing.id)
      .select('id, provider, proof_type, source_key, status, visibility, verified_at, last_synced_at')
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('verified_proofs')
    .insert(payload)
    .select('id, provider, proof_type, source_key, status, visibility, verified_at, last_synced_at')
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function markOsuStateConsumed(supabase, callbackState) {
  const consumedAt = new Date().toISOString();
  const { error: stateError } = await supabase
    .from('provider_callback_states')
    .update({ status: 'consumed', consumed_at: consumedAt })
    .eq('id', callbackState.id)
    .eq('status', 'pending');
  if (stateError) throw stateError;

  if (callbackState.connection_intent_id) {
    const { error: intentError } = await supabase
      .from('provider_connection_intents')
      .update({ status: 'consumed', consumed_at: consumedAt })
      .eq('id', callbackState.connection_intent_id)
      .eq('status', 'pending');
    if (intentError) throw intentError;
  }
}

async function insertOsuAuditEvent(supabase, { ownerId, passportId, eventType, eventStatus, metadata }) {
  const { error } = await supabase
    .from('provider_audit_events')
    .insert({
      owner_id: ownerId,
      passport_id: passportId,
      provider: OSU_PROVIDER,
      event_type: eventType,
      event_status: eventStatus,
      metadata,
      created_at: new Date().toISOString(),
    });
  if (error) throw error;
}

function toSafeConnectionStatus(row, proof = null) {
  return {
    id: row.id,
    provider: row.provider,
    displayName: row.display_name,
    status: row.status,
    visibility: row.visibility,
    verifiedAt: row.verified_at,
    lastSyncedAt: row.last_synced_at,
    staleAt: row.stale_at,
    revokedAt: row.revoked_at,
    profileUrl: row.metadata_safe?.profileUrl || '',
    proof: toSafeProofStatus(proof),
  };
}

function toSafeProofStatus(row) {
  if (!row) return null;
  return {
    type: 'profile_linked',
    source: OSU_PROVIDER,
    label: 'Linked osu! account',
    status: row.status,
    visibility: row.visibility,
    verifiedAt: row.verified_at,
    lastSyncedAt: row.last_synced_at,
    staleAt: row.stale_at,
    revokedAt: row.revoked_at,
    publicServingAllowed: false,
  };
}

function safeVisibility(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
