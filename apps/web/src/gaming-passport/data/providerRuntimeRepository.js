import {
  PROVIDER_AUDIT_EVENT_TYPES,
  PROVIDER_CONNECTION_INTENT_STATUSES,
  PROVIDER_RUNTIME_ERRORS,
  PROVIDER_SYNC_JOB_STATUSES,
  buildProviderRuntimeAuditEvent,
  buildProviderSyncJob,
  buildRevokeCommandResult,
  buildUnlinkCommandResult,
  createProviderConnectionIntent as buildProviderConnectionIntent,
  isKnownProviderId,
} from '@/gaming-passport/domain/index.js';

const PROVIDER_CONNECTION_INTENT_SELECT_COLUMNS = [
  'id',
  'owner_id',
  'passport_id',
  'provider',
  'status',
  'expires_at',
  'consumed_at',
  'created_at',
  'updated_at',
].join(',');

const PROVIDER_AUDIT_EVENT_SELECT_COLUMNS = [
  'id',
  'owner_id',
  'passport_id',
  'provider',
  'event_type',
  'event_status',
  'metadata',
  'created_at',
].join(',');

const PROVIDER_SYNC_JOB_SELECT_COLUMNS = [
  'id',
  'owner_id',
  'passport_id',
  'provider',
  'status',
  'reason',
  'attempt_count',
  'scheduled_for',
  'completed_at',
  'created_at',
  'updated_at',
].join(',');

const LINKED_PROVIDER_ACCOUNT_SELECT_COLUMNS = [
  'id',
  'passport_id',
  'owner_id',
  'provider',
  'display_name',
  'status',
  'visibility',
  'metadata_safe',
  'verified_at',
  'last_synced_at',
  'stale_at',
  'revoked_at',
  'created_at',
  'updated_at',
].join(',');

export async function createProviderConnectionIntent(client, session, passportId, provider, options = {}) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const stateHash = options.stateHash || createOpaqueStateHash(provider);
  const intentResult = buildProviderConnectionIntent({
    ownerId,
    passportId,
    provider,
    stateHash,
    expiresAt: options.expiresAt,
  });

  if (!intentResult.ok) {
    const error = new Error('Invalid provider connection intent.');
    error.validationErrors = intentResult.errors;
    throw error;
  }

  const { data, error } = await client
    .from('provider_connection_intents')
    .insert({
      owner_id: ownerId,
      passport_id: passportId,
      provider,
      status: PROVIDER_CONNECTION_INTENT_STATUSES.PENDING,
      state_hash: intentResult.intent.stateHash,
      requested_scopes: [],
      expires_at: intentResult.intent.expiresAt,
    })
    .select(PROVIDER_CONNECTION_INTENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return mapProviderConnectionIntentRow(data);
}

export async function listProviderConnectionIntents(client, session, passportId) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('provider_connection_intents')
    .select(PROVIDER_CONNECTION_INTENT_SELECT_COLUMNS)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data.map(mapProviderConnectionIntentRow).filter(Boolean) : [];
}

export async function markProviderConnectionIntentConsumed(client, session, passportId, intentId) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('provider_connection_intents')
    .update({
      status: PROVIDER_CONNECTION_INTENT_STATUSES.CONSUMED,
      consumed_at: new Date().toISOString(),
    })
    .eq('id', intentId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .select(PROVIDER_CONNECTION_INTENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return mapProviderConnectionIntentRow(data);
}

export async function createProviderRuntimeAuditEvent(client, session, input = {}) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const event = buildProviderRuntimeAuditEvent({
    ...input,
    ownerId,
  });

  const { data, error } = await client
    .from('provider_audit_events')
    .insert({
      owner_id: ownerId,
      passport_id: event.passportId,
      provider: event.provider,
      event_type: event.eventType,
      event_status: event.eventStatus,
      metadata: event.metadata,
    })
    .select(PROVIDER_AUDIT_EVENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return mapProviderAuditEventRow(data);
}

export async function listLinkedProviderAccountsForOwner(client, session, passportId) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('linked_provider_accounts')
    .select(LINKED_PROVIDER_ACCOUNT_SELECT_COLUMNS)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data.map(mapLinkedProviderAccountRow).filter(Boolean) : [];
}

export async function requestProviderUnlink(client, session, passportId, linkedProviderAccountId) {
  const account = await getOwnedLinkedProviderAccount(client, session, passportId, linkedProviderAccountId);
  const result = buildUnlinkCommandResult({
    account,
    provider: account?.provider,
    ownerId: account?.ownerId,
    passportId,
  });

  await createProviderRuntimeAuditEvent(client, session, {
    passportId,
    provider: account?.provider,
    eventType: PROVIDER_AUDIT_EVENT_TYPES.UNLINK_REQUESTED,
    eventStatus: result.ok ? 'blocked_until_provider_runtime' : 'rejected',
    metadata: {
      reason: PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE,
      linkedProviderAccountId,
    },
  });

  return {
    ...result,
    blocked: true,
    reason: PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE,
  };
}

export async function requestProviderRevoke(client, session, passportId, linkedProviderAccountId) {
  const account = await getOwnedLinkedProviderAccount(client, session, passportId, linkedProviderAccountId);
  const result = buildRevokeCommandResult({
    account,
    provider: account?.provider,
    ownerId: account?.ownerId,
    passportId,
  });

  await createProviderRuntimeAuditEvent(client, session, {
    passportId,
    provider: account?.provider,
    eventType: PROVIDER_AUDIT_EVENT_TYPES.REVOKE_REQUESTED,
    eventStatus: result.ok ? 'blocked_until_provider_runtime' : 'rejected',
    metadata: {
      reason: PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE,
      linkedProviderAccountId,
    },
  });

  return {
    ...result,
    blocked: true,
    reason: PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE,
  };
}

export async function createProviderSyncJob(client, session, input = {}) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  const job = buildProviderSyncJob({
    ...input,
    ownerId,
    status: input.status || PROVIDER_SYNC_JOB_STATUSES.BLOCKED,
  });

  const { data, error } = await client
    .from('provider_sync_jobs')
    .insert({
      owner_id: ownerId,
      passport_id: job.passportId,
      provider: job.provider,
      status: job.status,
      reason: job.reason,
      attempt_count: job.attemptCount,
      scheduled_for: job.scheduledFor,
    })
    .select(PROVIDER_SYNC_JOB_SELECT_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return mapProviderSyncJobRow(data);
}

function getOwnedLinkedProviderAccount(client, session, passportId, linkedProviderAccountId) {
  assertClient(client);
  const ownerId = getSessionOwnerId(session);
  return client
    .from('linked_provider_accounts')
    .select(LINKED_PROVIDER_ACCOUNT_SELECT_COLUMNS)
    .eq('id', linkedProviderAccountId)
    .eq('owner_id', ownerId)
    .eq('passport_id', passportId)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) throw error;
      const account = mapLinkedProviderAccountRow(data);
      if (!account) throw new Error('Linked provider account not found for owner.');
      return account;
    });
}

function mapProviderConnectionIntentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    passportId: row.passport_id,
    provider: row.provider,
    status: row.status,
    expiresAt: row.expires_at,
    consumedAt: row.consumed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProviderAuditEventRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    passportId: row.passport_id,
    provider: row.provider,
    eventType: row.event_type,
    eventStatus: row.event_status,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  };
}

function mapProviderSyncJobRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    passportId: row.passport_id,
    provider: row.provider,
    status: row.status,
    reason: row.reason,
    attemptCount: row.attempt_count,
    scheduledFor: row.scheduled_for,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLinkedProviderAccountRow(row) {
  if (!row || !isKnownProviderId(row.provider)) return null;
  return {
    id: row.id,
    passportId: row.passport_id,
    ownerId: row.owner_id,
    provider: row.provider,
    displayName: row.display_name || '',
    status: row.status,
    visibility: row.visibility,
    metadataSafe: row.metadata_safe || {},
    verifiedAt: row.verified_at,
    lastSyncedAt: row.last_synced_at,
    staleAt: row.stale_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createOpaqueStateHash(provider) {
  const prefix = isKnownProviderId(provider) ? provider : 'provider';
  const random = typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:foundation:${random}`;
}

function assertClient(client) {
  if (!client) throw new Error('Supabase client is required for provider runtime foundation.');
}

function getSessionOwnerId(session) {
  const ownerId = session?.user?.id;
  if (!ownerId) {
    throw new Error('A signed-in Parent Auth session is required.');
  }
  return ownerId;
}
