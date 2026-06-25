import {
  buildPublishReadiness,
  canClaimSlug,
  canSetPublicationConsent,
  canUnpublishPassport,
} from '@/gaming-passport/domain/publishCommands.js';
import { PASSPORT_SELECT_COLUMNS, mapPassportRow } from './passportRepository.js';

const LINKED_PROVIDER_SELECT_COLUMNS = [
  'id',
  'passport_id',
  'owner_id',
  'provider',
  'external_account_id',
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

export async function getPublishCommandState(client, session, passportId) {
  const ownerId = getSessionOwnerId(session);
  const passport = await getOwnedPassportById(client, ownerId, passportId);
  if (!passport) throw new Error('Gaming Passport not found for owner.');

  const linkedProviderAccounts = await listLinkedProviderAccounts(client, session, passportId);
  const readiness = buildPublishReadiness({
    passport,
    parentAuth: buildParentAuth(session, ownerId),
    linkedProviderAccounts,
  });

  return {
    passport,
    linkedProviderAccounts,
    readiness,
  };
}

export async function listLinkedProviderAccounts(client, session, passportId) {
  const ownerId = getSessionOwnerId(session);
  const { data, error } = await client
    .from('linked_provider_accounts')
    .select(LINKED_PROVIDER_SELECT_COLUMNS)
    .eq('passport_id', passportId)
    .eq('owner_id', ownerId);

  if (error) throw error;
  return Array.isArray(data) ? data.map(mapLinkedProviderAccountRow).filter(Boolean) : [];
}

export async function setPassportPublicationConsent(client, session, passportId, consent) {
  const state = await getPublishCommandState(client, session, passportId);
  const allowed = canSetPublicationConsent({
    passport: state.passport,
    parentAuth: buildParentAuth(session, state.passport.ownerId),
    consent,
  });
  if (!allowed.ok) throwCommandError('Publication consent cannot be changed.', allowed.errors);

  const passport = await rpcPassport(client, 'set_gaming_passport_publication_consent', {
    target_passport_id: passportId,
    next_consent: Boolean(consent),
  });

  return passport;
}

export async function claimPassportSlug(client, session, passportId, rawSlug) {
  const state = await getPublishCommandState(client, session, passportId);
  const allowed = canClaimSlug({
    passport: state.passport,
    parentAuth: buildParentAuth(session, state.passport.ownerId),
    slug: rawSlug,
  });
  if (!allowed.ok) throwCommandError('Slug cannot be claimed.', allowed.errors);

  const passport = await rpcPassport(client, 'claim_gaming_passport_slug', {
    target_passport_id: passportId,
    raw_slug: rawSlug,
  });

  return passport;
}

export async function publishPassport(client, session, passportId) {
  const state = await getPublishCommandState(client, session, passportId);
  if (!state.readiness.publishable) {
    return {
      ok: false,
      blocked: true,
      missing: state.readiness.missing,
      passport: state.passport,
      state,
    };
  }

  const passport = await rpcPassport(client, 'publish_gaming_passport', {
    target_passport_id: passportId,
  });

  return {
    ok: true,
    blocked: false,
    missing: [],
    passport,
    state: {
      ...state,
      passport,
      readiness: buildPublishReadiness({
        passport,
        parentAuth: buildParentAuth(session, passport.ownerId),
        linkedProviderAccounts: state.linkedProviderAccounts,
      }),
    },
  };
}

export async function unpublishPassport(client, session, passportId) {
  const state = await getPublishCommandState(client, session, passportId);
  const allowed = canUnpublishPassport({
    passport: state.passport,
    parentAuth: buildParentAuth(session, state.passport.ownerId),
  });
  if (!allowed.ok) throwCommandError('Gaming Passport cannot be unpublished.', allowed.errors);

  const passport = await rpcPassport(client, 'unpublish_gaming_passport', {
    target_passport_id: passportId,
  });

  return passport;
}

export function mapLinkedProviderAccountRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    passportId: row.passport_id,
    ownerId: row.owner_id,
    provider: row.provider,
    externalAccountId: row.external_account_id,
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

async function getOwnedPassportById(client, ownerId, passportId) {
  const { data, error } = await client
    .from('gaming_passports')
    .select(PASSPORT_SELECT_COLUMNS)
    .eq('id', passportId)
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) throw error;
  return mapPassportRow(data);
}

async function rpcPassport(client, functionName, params) {
  const { data, error } = await client.rpc(functionName, params);
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  const passport = mapPassportRow(row);
  if (!passport) throw new Error('Publish command did not return a Gaming Passport row.');
  return passport;
}

function getSessionOwnerId(session) {
  const ownerId = session?.user?.id;
  if (!ownerId) {
    throw new Error('A signed-in Parent Auth session is required.');
  }
  return ownerId;
}

function buildParentAuth(session, ownerId) {
  return {
    authenticated: Boolean(session?.user?.id),
    ownerId,
    provider: 'parent_auth',
  };
}

function throwCommandError(message, errors = []) {
  const error = new Error(message);
  error.code = 'publish_command_blocked';
  error.details = errors;
  throw error;
}
