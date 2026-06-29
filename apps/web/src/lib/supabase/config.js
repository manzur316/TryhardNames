const FORBIDDEN_CLIENT_ENV_KEYS = Object.freeze([
  ['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_'),
  ['SUPABASE', 'SECRET', 'KEY'].join('_'),
  ['VITE', 'SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_'),
]);
const MODERN_PUBLISHABLE_PREFIX = ['sb', 'publishable', ''].join('_');
const ADMIN_SECRET_PREFIX = ['sb', 'secret', ''].join('_');
const LEGACY_ADMIN_ROLE = ['service', 'role'].join('_');

function getDefaultEnv() {
  return typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function hasAdminKeyShape(value) {
  const text = clean(value);
  return text.startsWith(ADMIN_SECRET_PREFIX) || /service[_-]?role/i.test(text);
}

export function readSupabaseConfig(env = getDefaultEnv()) {
  const forbiddenKeys = FORBIDDEN_CLIENT_ENV_KEYS.filter((key) => clean(env[key]));
  const url = clean(env.VITE_SUPABASE_URL);
  const publishableKey = clean(env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const urlValidation = validateSupabaseUrl(url);
  const keyValidation = validatePublishableKey(publishableKey);
  const isConfigured = Boolean(urlValidation.ok && keyValidation.ok && forbiddenKeys.length === 0);

  return {
    url,
    publishableKey,
    googleEnabled: clean(env.VITE_AUTH_GOOGLE_ENABLED) === 'true',
    forbiddenKeys,
    isConfigured,
    reason: isConfigured
      ? null
      : getConfigReason({ url, publishableKey, forbiddenKeys, urlValidation, keyValidation }),
  };
}

export function validateSupabaseUrl(url) {
  if (!url) return { ok: false, reason: 'missing_url' };

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, reason: 'invalid_protocol' };
    }
    return { ok: true, reason: null };
  } catch {
    return { ok: false, reason: 'invalid_url' };
  }
}

export function validatePublishableKey(key) {
  const text = clean(key);
  if (!text) return { ok: false, reason: 'missing_key' };
  if (hasAdminKeyShape(text)) return { ok: false, reason: 'admin_key' };
  if (text.startsWith(MODERN_PUBLISHABLE_PREFIX)) return { ok: true, reason: null, format: 'modern_publishable' };
  if (looksLikeJwt(text)) return validateLegacyJwtKey(text);
  return { ok: false, reason: 'unsupported_key_format' };
}

function validateLegacyJwtKey(key) {
  const payload = decodeJwtPayload(key);
  if (!payload.ok) return { ok: false, reason: 'malformed_jwt' };
  if (payload.value?.role === 'anon') return { ok: true, reason: null, format: 'legacy_anon_jwt' };
  if (payload.value?.role === LEGACY_ADMIN_ROLE) return { ok: false, reason: 'admin_key' };
  return { ok: false, reason: 'unsupported_jwt_role' };
}

function decodeJwtPayload(key) {
  const [, encodedPayload] = key.split('.');
  try {
    const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = typeof atob === 'function'
      ? atob(padded)
      : globalThis.Buffer.from(padded, 'base64').toString('utf8');
    return { ok: true, value: JSON.parse(decoded) };
  } catch {
    return { ok: false, value: null };
  }
}

function looksLikeJwt(value) {
  return value.split('.').length === 3;
}

function getConfigReason({ url, publishableKey, forbiddenKeys, urlValidation, keyValidation }) {
  if (forbiddenKeys.length || keyValidation.reason === 'admin_key') {
    return 'Supabase client configuration includes a prohibited admin credential.';
  }
  if (!url || !publishableKey) {
    return 'Supabase Parent Auth is not configured for this environment.';
  }
  if (!urlValidation.ok) {
    return 'Supabase Parent Auth URL must be a valid http or https URL.';
  }
  if (!keyValidation.ok) {
    return 'Supabase Parent Auth publishable key is invalid.';
  }
  return 'Supabase Parent Auth configuration is invalid.';
}
