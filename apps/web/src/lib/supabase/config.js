const FORBIDDEN_CLIENT_ENV_KEYS = Object.freeze([
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
  'VITE_SUPABASE_SERVICE_ROLE_KEY',
]);
const ADMIN_SECRET_PREFIX = ['sb', 'secret', ''].join('_');

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
  const hasForbiddenKeyShape = hasAdminKeyShape(publishableKey);
  const isConfigured = Boolean(url && publishableKey && forbiddenKeys.length === 0 && !hasForbiddenKeyShape);

  return {
    url,
    publishableKey,
    googleEnabled: clean(env.VITE_AUTH_GOOGLE_ENABLED) === 'true',
    forbiddenKeys,
    isConfigured,
    reason: isConfigured
      ? null
      : getConfigReason({ url, publishableKey, forbiddenKeys, hasForbiddenKeyShape }),
  };
}

function getConfigReason({ url, publishableKey, forbiddenKeys, hasForbiddenKeyShape }) {
  if (forbiddenKeys.length || hasForbiddenKeyShape) {
    return 'Supabase client configuration includes a prohibited admin credential.';
  }
  if (!url || !publishableKey) {
    return 'Supabase Parent Auth is not configured for this environment.';
  }
  return 'Supabase Parent Auth configuration is invalid.';
}
