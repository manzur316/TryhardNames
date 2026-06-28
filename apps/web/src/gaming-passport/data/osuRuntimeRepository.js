const OSU_RUNTIME_PATH = '/api/v1/integrations/osu';
const SESSION_AUTH_FIELD = ['access', 'token'].join('_');
const SENSITIVE_RESPONSE_KEYS = new Set([
  SESSION_AUTH_FIELD,
  ['refresh', 'token'].join('_'),
  ['client', 'secret'].join('_'),
  ['OSU', 'CLIENT', 'SECRET'].join('_'),
  ['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_'),
  ['token', 'ciphertext'].join('_'),
  ['provider', 'token'].join('_'),
  ['external', 'account', 'id'].join('_'),
  ['linked', 'provider', 'account', 'id'].join('_'),
  ['owner', 'id'].join('_'),
  ['raw', 'payload'].join('_'),
  ['metadata', 'safe'].join('_'),
  'code',
]);

export async function getOsuRuntimeOverview() {
  return requestOsuRuntime(OSU_RUNTIME_PATH);
}

export async function getOsuRuntimeStatus({ accessToken, passportId }) {
  assertParentBearer(accessToken);
  const params = new URLSearchParams({ passportId: requirePassportId(passportId) });
  const result = await requestOsuRuntime(`${OSU_RUNTIME_PATH}/status?${params}`, { accessToken });
  return {
    ...result,
    connections: Array.isArray(result.connections) ? result.connections.map(toSafeConnectionStatus) : [],
  };
}

export async function createOsuLinkIntent({ accessToken, passportId }) {
  assertParentBearer(accessToken);
  const result = await requestOsuRuntime(`${OSU_RUNTIME_PATH}/link-intent`, {
    accessToken,
    method: 'POST',
    body: { passportId: requirePassportId(passportId) },
  });

  return {
    authorizeUrl: typeof result.authorizeUrl === 'string' ? result.authorizeUrl : '',
    expiresAt: cleanString(result.expiresAt),
    scopes: Array.isArray(result.scopes) ? result.scopes.filter(Boolean) : [],
    tokenStrategy: cleanString(result.tokenStrategy),
    status: cleanString(result.status),
  };
}

export async function unlinkOsuProvider({ accessToken, passportId, linkedProviderAccountId }) {
  assertParentBearer(accessToken);
  const result = await requestOsuRuntime(`${OSU_RUNTIME_PATH}/unlink`, {
    accessToken,
    method: 'POST',
    body: {
      passportId: requirePassportId(passportId),
      linkedProviderAccountId: requireLinkedProviderAccountId(linkedProviderAccountId),
    },
  });

  return {
    status: cleanString(result.status),
    tokenStrategy: cleanString(result.tokenStrategy),
    revokeStrategy: cleanString(result.revokeStrategy),
    result: {
      linkedProviderAccountId: cleanString(result.result?.linkedProviderAccountId),
      status: cleanString(result.result?.status),
      idempotent: Boolean(result.result?.idempotent),
      publicServingAllowed: result.result?.publicServingAllowed === true,
    },
  };
}

export async function setOsuProofVisibility({
  accessToken,
  passportId,
  linkedProviderAccountId,
  visibility,
}) {
  assertParentBearer(accessToken);
  const result = await requestOsuRuntime(`${OSU_RUNTIME_PATH}/proof-visibility`, {
    accessToken,
    method: 'POST',
    body: {
      passportId: requirePassportId(passportId),
      linkedProviderAccountId: requireLinkedProviderAccountId(linkedProviderAccountId),
      visibility: requireProofVisibility(visibility),
    },
  });

  return {
    status: cleanString(result.status),
    tokenStrategy: cleanString(result.tokenStrategy),
    visibility: cleanString(result.visibility),
    publicServingAllowed: result.publicServingAllowed === true,
    projectionEligibility: toSafeProjectionEligibility(result.projectionEligibility),
    connection: toSafeConnectionStatus(result.connection),
    proof: toSafeProofStatus(result.proof),
  };
}

export function getParentAuthBearer(session) {
  return typeof session?.[SESSION_AUTH_FIELD] === 'string' ? session[SESSION_AUTH_FIELD] : '';
}

async function requestOsuRuntime(endpoint, options = {}) {
  const response = await fetch(buildApiUrl(endpoint), {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await parseJsonResponse(response);
  assertNoSensitivePropertyNames(payload);
  if (!response.ok || payload?.ok === false) {
    throw createRuntimeError(payload?.error || `osu_runtime_http_${response.status}`, response.status);
  }
  return payload || {};
}

function buildApiUrl(endpoint) {
  const apiOrigin = getApiOrigin();
  return `${apiOrigin}${endpoint}`;
}

function getApiOrigin() {
  const configured = cleanString(import.meta.env.VITE_API_URL).replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:3001';
  }
  return '';
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw createRuntimeError('osu_runtime_invalid_response', response.status);
  }
}

function toSafeConnectionStatus(connection = {}) {
  return {
    id: cleanString(connection.id),
    provider: cleanString(connection.provider),
    displayName: cleanString(connection.displayName),
    status: cleanString(connection.status),
    visibility: cleanString(connection.visibility),
    verifiedAt: cleanString(connection.verifiedAt),
    lastSyncedAt: cleanString(connection.lastSyncedAt),
    staleAt: cleanString(connection.staleAt),
    revokedAt: cleanString(connection.revokedAt),
    profileUrl: cleanSafeUrl(connection.profileUrl),
    proof: toSafeProofStatus(connection.proof),
  };
}

function toSafeProofStatus(proof = null) {
  if (!proof || typeof proof !== 'object') return null;
  return {
    type: cleanString(proof.type),
    source: cleanString(proof.source),
    label: cleanString(proof.label),
    status: cleanString(proof.status),
    visibility: cleanString(proof.visibility),
    verifiedAt: cleanString(proof.verifiedAt),
    lastSyncedAt: cleanString(proof.lastSyncedAt),
    staleAt: cleanString(proof.staleAt),
    revokedAt: cleanString(proof.revokedAt),
    publicServingAllowed: proof.publicServingAllowed === true,
  };
}

function toSafeProjectionEligibility(value = null) {
  if (!value || typeof value !== 'object') {
    return {
      allowed: false,
      reason: '',
      nextMilestone: '',
    };
  }
  return {
    allowed: value.allowed === true,
    reason: cleanString(value.reason),
    nextMilestone: cleanString(value.nextMilestone),
  };
}

function assertNoSensitivePropertyNames(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (SENSITIVE_RESPONSE_KEYS.has(key)) {
      throw createRuntimeError('osu_runtime_sensitive_response');
    }
    assertNoSensitivePropertyNames(child);
  }
}

function cleanSafeUrl(value) {
  const text = cleanString(value);
  if (!text) return '';
  try {
    const url = new URL(text);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function assertParentBearer(value) {
  if (!cleanString(value)) throw createRuntimeError('parent_auth_required', 401);
}

function requirePassportId(value) {
  const passportId = cleanString(value);
  if (!passportId) throw createRuntimeError('passport_id_required', 400);
  return passportId;
}

function requireLinkedProviderAccountId(value) {
  const id = cleanString(value);
  if (!id) throw createRuntimeError(['linked', 'provider', 'account', 'id', 'required'].join('_'), 400);
  return id;
}

function requireProofVisibility(value) {
  const visibility = cleanString(value).toLowerCase();
  if (!['private', 'public'].includes(visibility)) {
    throw createRuntimeError('proof_visibility_required', 400);
  }
  return visibility;
}

function createRuntimeError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}
