import {
  LINKED_PROVIDER_IDS,
  LINKED_PROVIDER_STATUSES,
  PROVIDER_VISIBILITY,
} from './constants.js';
import { canTransitionLinkedProviderStatus } from './stateMachine.js';

export const PROVIDER_RUNTIME_ACTIVATION = Object.freeze({
  CONTRACT_ONLY: 'contract_only',
  NOT_LIVE: 'not_live',
});

export const PROVIDER_CONNECTION_INTENT_STATUSES = Object.freeze({
  PENDING: 'pending',
  CONSUMED: 'consumed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
});

export const PROVIDER_CALLBACK_STATE_STATUSES = Object.freeze({
  PENDING: 'pending',
  CONSUMED: 'consumed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
});

export const PROVIDER_TOKEN_STATUSES = Object.freeze({
  EMPTY: 'empty',
  PLACEHOLDER: 'placeholder',
  REVOKED: 'revoked',
});

export const PROVIDER_SYNC_JOB_STATUSES = Object.freeze({
  BLOCKED: 'blocked',
  QUEUED: 'queued',
  SKIPPED: 'skipped',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

export const PROVIDER_AUDIT_EVENT_TYPES = Object.freeze({
  CONNECTION_INTENT_CREATED: 'connection_intent_created',
  CALLBACK_STATE_CREATED: 'callback_state_created',
  INTENT_CONSUMED: 'intent_consumed',
  UNLINK_REQUESTED: 'unlink_requested',
  REVOKE_REQUESTED: 'revoke_requested',
  SYNC_JOB_CREATED: 'sync_job_created',
});

export const PROVIDER_RUNTIME_ERRORS = Object.freeze({
  PARENT_AUTH: 'parent_auth',
  OWNER: 'owner',
  PASSPORT: 'passport',
  UNSUPPORTED_PROVIDER: 'unsupported_provider',
  CALLBACK_STATE_HASH: 'callback_state_hash',
  STATE_EXPIRED: 'state_expired',
  STATE_CONSUMED: 'state_consumed',
  PROVIDER_RUNTIME_NOT_LIVE: 'provider_runtime_not_live',
  INVALID_TRANSITION: 'invalid_transition',
});

const KNOWN_PROVIDER_IDS = Object.freeze(Object.values(LINKED_PROVIDER_IDS));
const INTENT_STATUSES = Object.freeze(Object.values(PROVIDER_CONNECTION_INTENT_STATUSES));
const CALLBACK_STATUSES = Object.freeze(Object.values(PROVIDER_CALLBACK_STATE_STATUSES));
const TOKEN_STATUSES = Object.freeze(Object.values(PROVIDER_TOKEN_STATUSES));
const SYNC_JOB_STATUSES = Object.freeze(Object.values(PROVIDER_SYNC_JOB_STATUSES));
const AUDIT_EVENT_TYPES = Object.freeze(Object.values(PROVIDER_AUDIT_EVENT_TYPES));
const TEN_MINUTES_MS = 10 * 60 * 1000;
const MAX_METADATA_KEYS = 24;
const MAX_METADATA_STRING_LENGTH = 240;
const MAX_PRIVATE_METADATA_SIZE = 4096;

const FORBIDDEN_METADATA_KEYS = new Set([
  'accesstoken',
  'authorizationurl',
  'clientsecret',
  'externalaccountid',
  'oauthurl',
  'providertoken',
  'rawpayload',
  'refreshtoken',
  'secret',
  'token',
]);

const ACTIVATION_PATTERNS = Object.freeze([
  /continue with riot/i,
  /continue with discord/i,
  /authorize\?/i,
  /oauth\/authorize/i,
  /api\.riotgames\.com/i,
  /discord\.com\/api/i,
  /clientSecret/i,
  /accessToken/i,
  /refreshToken/i,
  /providerToken/i,
  /provider_token/i,
]);

export function createProviderConnectionIntent(input = {}) {
  const ownerId = cleanString(input.ownerId || input.parentAuth?.ownerId);
  const passportId = cleanString(input.passportId || input.passport?.id);
  const provider = cleanString(input.provider);
  const stateHash = cleanString(input.stateHash);
  const createdAt = cleanIso(input.createdAt) || new Date().toISOString();
  const expiresAt = cleanIso(input.expiresAt) || new Date(Date.parse(createdAt) + TEN_MINUTES_MS).toISOString();

  const intent = {
    ownerId,
    passportId,
    provider,
    status: PROVIDER_CONNECTION_INTENT_STATUSES.PENDING,
    stateHash,
    requestedScopes: [],
    activation: PROVIDER_RUNTIME_ACTIVATION.NOT_LIVE,
    createdAt,
    expiresAt,
  };
  const validation = validateProviderConnectionIntent(intent, { now: input.now || createdAt });

  return {
    ok: validation.ok,
    errors: validation.errors,
    intent: validation.ok ? intent : null,
  };
}

export function validateProviderConnectionIntent(intent = {}, options = {}) {
  const errors = [];
  const now = Date.parse(options.now || new Date().toISOString());

  if (!cleanString(intent.ownerId)) errors.push(PROVIDER_RUNTIME_ERRORS.PARENT_AUTH);
  if (!cleanString(intent.passportId)) errors.push(PROVIDER_RUNTIME_ERRORS.PASSPORT);
  if (!isKnownProviderId(intent.provider)) errors.push(PROVIDER_RUNTIME_ERRORS.UNSUPPORTED_PROVIDER);
  if (!isSafeStateHash(intent.stateHash)) errors.push(PROVIDER_RUNTIME_ERRORS.CALLBACK_STATE_HASH);
  if (!INTENT_STATUSES.includes(intent.status)) errors.push('intent_status');
  if (isConsumedStatus(intent.status, intent.consumedAt)) errors.push(PROVIDER_RUNTIME_ERRORS.STATE_CONSUMED);
  if (isExpiredStatus(intent.status, intent.expiresAt, now)) errors.push(PROVIDER_RUNTIME_ERRORS.STATE_EXPIRED);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function validateProviderCallbackState(state = {}, options = {}) {
  const errors = [];
  const now = Date.parse(options.now || new Date().toISOString());

  if (!cleanString(state.ownerId)) errors.push(PROVIDER_RUNTIME_ERRORS.PARENT_AUTH);
  if (!cleanString(state.passportId)) errors.push(PROVIDER_RUNTIME_ERRORS.PASSPORT);
  if (!isKnownProviderId(state.provider)) errors.push(PROVIDER_RUNTIME_ERRORS.UNSUPPORTED_PROVIDER);
  if (!isSafeStateHash(state.stateHash)) errors.push(PROVIDER_RUNTIME_ERRORS.CALLBACK_STATE_HASH);
  if (!CALLBACK_STATUSES.includes(state.status)) errors.push('callback_status');
  if (isConsumedStatus(state.status, state.consumedAt)) errors.push(PROVIDER_RUNTIME_ERRORS.STATE_CONSUMED);
  if (isExpiredStatus(state.status, state.expiresAt, now)) errors.push(PROVIDER_RUNTIME_ERRORS.STATE_EXPIRED);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function canStartProviderLink(input = {}) {
  const errors = ownerScopedErrors(input);
  if (!isKnownProviderId(input.provider)) errors.push(PROVIDER_RUNTIME_ERRORS.UNSUPPORTED_PROVIDER);
  errors.push(PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE);

  return {
    ok: false,
    active: false,
    blocked: true,
    errors: unique(errors),
  };
}

export function canCompleteProviderLink(input = {}) {
  const stateValidation = validateProviderCallbackState(input.callbackState || {}, input);
  const errors = [...stateValidation.errors, PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE];

  return {
    ok: false,
    active: false,
    blocked: true,
    errors: unique(errors),
  };
}

export function canUnlinkProvider(input = {}) {
  const errors = ownerScopedErrors(input);
  const account = input.account || {};
  if (!isKnownProviderId(input.provider || account.provider)) errors.push(PROVIDER_RUNTIME_ERRORS.UNSUPPORTED_PROVIDER);
  if (!canTransitionLinkedProviderStatus(account.status, LINKED_PROVIDER_STATUSES.REVOKED) && account.status !== LINKED_PROVIDER_STATUSES.REVOKED) {
    errors.push(PROVIDER_RUNTIME_ERRORS.INVALID_TRANSITION);
  }

  return {
    ok: errors.length === 0,
    command: 'unlink_provider',
    noop: account.status === LINKED_PROVIDER_STATUSES.REVOKED,
    nextStatus: LINKED_PROVIDER_STATUSES.REVOKED,
    publicServingAllowed: false,
    errors: unique(errors),
  };
}

export function canRevokeProvider(input = {}) {
  const result = canUnlinkProvider(input);
  return {
    ...result,
    command: 'revoke_provider',
  };
}

export function buildLinkCommandResult(input = {}) {
  const start = canStartProviderLink(input);
  return {
    ok: start.ok,
    command: 'link_provider',
    blocked: true,
    activation: PROVIDER_RUNTIME_ACTIVATION.NOT_LIVE,
    errors: start.errors,
  };
}

export function buildUnlinkCommandResult(input = {}) {
  const unlink = canUnlinkProvider(input);
  return {
    ok: unlink.ok,
    command: 'unlink_provider',
    blocked: !unlink.ok,
    noop: unlink.noop,
    nextStatus: unlink.nextStatus,
    errors: unlink.errors,
  };
}

export function buildRevokeCommandResult(input = {}) {
  const revoke = canRevokeProvider(input);
  return {
    ok: revoke.ok,
    command: 'revoke_provider',
    blocked: !revoke.ok,
    noop: revoke.noop,
    nextStatus: revoke.nextStatus,
    publicServingAllowed: false,
    errors: revoke.errors,
  };
}

export function buildProviderRuntimeAuditEvent(input = {}) {
  const eventType = AUDIT_EVENT_TYPES.includes(input.eventType)
    ? input.eventType
    : PROVIDER_AUDIT_EVENT_TYPES.SYNC_JOB_CREATED;

  return {
    ownerId: cleanString(input.ownerId || input.parentAuth?.ownerId),
    passportId: cleanString(input.passportId || input.passport?.id),
    provider: isKnownProviderId(input.provider) ? input.provider : '',
    eventType,
    eventStatus: cleanString(input.eventStatus) || 'recorded',
    metadata: sanitizeProviderPrivateMetadata(input.metadata || {}),
    createdAt: cleanIso(input.createdAt) || new Date().toISOString(),
  };
}

export function buildProviderSyncJob(input = {}) {
  const provider = isKnownProviderId(input.provider) ? input.provider : '';
  const requestedStatus = cleanString(input.status);
  const status = SYNC_JOB_STATUSES.includes(requestedStatus)
    ? requestedStatus
    : PROVIDER_SYNC_JOB_STATUSES.BLOCKED;

  return {
    ownerId: cleanString(input.ownerId || input.parentAuth?.ownerId),
    passportId: cleanString(input.passportId || input.passport?.id),
    provider,
    status,
    reason: cleanString(input.reason) || PROVIDER_RUNTIME_ERRORS.PROVIDER_RUNTIME_NOT_LIVE,
    shouldCallProvider: false,
    attemptCount: clampInteger(input.attemptCount, 0, 20),
    scheduledFor: cleanIso(input.scheduledFor) || new Date().toISOString(),
  };
}

export function buildProviderTokenVaultEnvelope(input = {}) {
  const requestedStatus = cleanString(input.tokenStatus);
  const tokenStatus = TOKEN_STATUSES.includes(requestedStatus)
    ? requestedStatus
    : PROVIDER_TOKEN_STATUSES.EMPTY;

  return {
    ownerId: cleanString(input.ownerId || input.parentAuth?.ownerId),
    passportId: cleanString(input.passportId || input.passport?.id),
    provider: isKnownProviderId(input.provider) ? input.provider : '',
    tokenStatus,
    tokenVersion: clampInteger(input.tokenVersion, 0, 999),
    hasTokenCiphertext: Boolean(cleanString(input.tokenCiphertext)),
  };
}

export function sanitizeProviderPublicMetadata(input = {}) {
  return sanitizeMetadata(input, { allowObjects: false, maxDepth: 1 });
}

export function sanitizeProviderPrivateMetadata(input = {}) {
  const clean = sanitizeMetadata(input, { allowObjects: true, maxDepth: 3 });
  const serialized = JSON.stringify(clean);
  if (serialized.length <= MAX_PRIVATE_METADATA_SIZE) return clean;
  return { truncated: true };
}

export function assertNoProviderRuntimeActivation(input = {}) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  const errors = ACTIVATION_PATTERNS
    .filter((pattern) => pattern.test(text || ''))
    .map((pattern) => `activation_pattern:${pattern.source}`);

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function isKnownProviderId(provider) {
  return KNOWN_PROVIDER_IDS.includes(provider);
}

function ownerScopedErrors(input = {}) {
  const errors = [];
  const passport = input.passport || null;
  const parentAuth = input.parentAuth || null;
  const ownerId = parentAuth?.ownerId || input.ownerId;

  if (parentAuth?.authenticated !== true && !ownerId) errors.push(PROVIDER_RUNTIME_ERRORS.PARENT_AUTH);
  if (!passport && !input.passportId) errors.push(PROVIDER_RUNTIME_ERRORS.PASSPORT);
  if (passport?.ownerId && ownerId && passport.ownerId !== ownerId) errors.push(PROVIDER_RUNTIME_ERRORS.OWNER);

  return errors;
}

function isSafeStateHash(value) {
  const text = cleanString(value);
  return text.length >= 16 && text.length <= 256 && text === value;
}

function isConsumedStatus(status, consumedAt) {
  return status === PROVIDER_CONNECTION_INTENT_STATUSES.CONSUMED
    || status === PROVIDER_CALLBACK_STATE_STATUSES.CONSUMED
    || Boolean(cleanString(consumedAt));
}

function isExpiredStatus(status, expiresAt, now) {
  const expires = Date.parse(expiresAt || '');
  if (status === PROVIDER_CONNECTION_INTENT_STATUSES.EXPIRED || status === PROVIDER_CALLBACK_STATE_STATUSES.EXPIRED) return true;
  if (!Number.isFinite(expires)) return true;
  return expires <= now;
}

function sanitizeMetadata(value, options, depth = 0) {
  if (!isPlainObject(value) || depth > options.maxDepth) return {};

  const out = {};
  for (const [rawKey, rawValue] of Object.entries(value).slice(0, MAX_METADATA_KEYS)) {
    const key = cleanMetadataKey(rawKey);
    if (!key || isForbiddenMetadataKey(key)) continue;
    const cleanValue = sanitizeMetadataValue(rawValue, options, depth + 1);
    if (cleanValue !== undefined) out[key] = cleanValue;
  }

  return out;
}

function sanitizeMetadataValue(value, options, depth) {
  if (value == null) return null;
  if (typeof value === 'string') return value.trim().slice(0, MAX_METADATA_STRING_LENGTH);
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value) && options.allowObjects) {
    return value.slice(0, 12).map((item) => sanitizeMetadataValue(item, options, depth)).filter((item) => item !== undefined);
  }
  if (isPlainObject(value) && options.allowObjects && depth <= options.maxDepth) {
    return sanitizeMetadata(value, options, depth);
  }
  return undefined;
}

function cleanMetadataKey(value) {
  return cleanString(value).replace(/[^\w.-]/g, '').slice(0, 48);
}

function isForbiddenMetadataKey(key) {
  return FORBIDDEN_METADATA_KEYS.has(key.toLowerCase().replace(/[^a-z0-9]/g, ''));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanIso(value) {
  const text = cleanString(value);
  if (!text) return '';
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

function clampInteger(value, min, max) {
  const number = Number.isInteger(value) ? value : min;
  return Math.min(Math.max(number, min), max);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
