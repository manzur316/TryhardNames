const OSU_PROVIDER = 'osu';
const PROFILE_LINKED_SOURCE_KEY = 'osu:profile_linked';

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
  return Array.isArray(data) ? data.map(toSafeConnectionStatus) : [];
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

function toSafeConnectionStatus(row) {
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
  };
}
