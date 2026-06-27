const DEFAULT_AUTHORIZATION_URL = 'https://osu.ppy.sh/oauth/authorize';
const DEFAULT_TOKEN_ENDPOINT = 'https://osu.ppy.sh/oauth/token';
const DEFAULT_API_BASE_URL = 'https://osu.ppy.sh/api/v2';
const DEFAULT_SCOPES = Object.freeze(['identify', 'public']);
const ALLOWED_SCOPES = new Set(DEFAULT_SCOPES);

export function getOsuRuntimeConfig(env = process.env) {
  const enabled = env.OSU_PROVIDER_ENABLED === 'true';
  const clientId = clean(env.OSU_CLIENT_ID);
  const clientSecret = clean(env.OSU_CLIENT_SECRET);
  const redirectUri = clean(env.OSU_REDIRECT_URI);
  const stateSecret = clean(env.OSU_STATE_SECRET);
  const supabaseUrl = clean(env.SUPABASE_URL);
  const supabaseServiceRoleKey = clean(env.SUPABASE_SERVICE_ROLE_KEY);
  const authorizationUrl = clean(env.OSU_AUTHORIZATION_URL) || DEFAULT_AUTHORIZATION_URL;
  const tokenEndpoint = clean(env.OSU_TOKEN_ENDPOINT) || DEFAULT_TOKEN_ENDPOINT;
  const apiBaseUrl = clean(env.OSU_API_BASE_URL) || DEFAULT_API_BASE_URL;
  const scopes = parseScopes(env.OSU_SCOPES);
  const invalidScopes = scopes.filter((scope) => !ALLOWED_SCOPES.has(scope));

  const missing = [];
  if (enabled) {
    if (!clientId) missing.push('OSU_CLIENT_ID');
    if (!clientSecret) missing.push('OSU_CLIENT_SECRET');
    if (!redirectUri) missing.push('OSU_REDIRECT_URI');
    if (!stateSecret) missing.push('OSU_STATE_SECRET');
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (invalidScopes.length > 0) missing.push('OSU_SCOPES');
  }

  return {
    provider: 'osu',
    enabled,
    configured: enabled && missing.length === 0,
    status: !enabled ? 'disabled' : missing.length === 0 ? 'configured' : 'missing_configuration',
    missing,
    clientId,
    clientSecret,
    hasClientSecret: Boolean(clientSecret),
    redirectUri,
    stateSecret,
    authorizationUrl,
    tokenEndpoint,
    apiBaseUrl: trimTrailingSlash(apiBaseUrl),
    scopes,
    invalidScopes,
    supabaseUrl,
    supabaseServiceRoleKey,
    tokenStrategy: 'no_refresh_token_storage',
  };
}

export function toSafeOsuRuntimeConfig(config) {
  return {
    provider: 'osu',
    enabled: config.enabled,
    configured: config.configured,
    status: config.status,
    missing: config.missing,
    scopes: config.scopes,
    tokenStrategy: config.tokenStrategy,
    hasClientSecret: config.hasClientSecret,
  };
}

function parseScopes(value) {
  const scopes = (clean(value) || DEFAULT_SCOPES.join(' '))
    .split(/[\s,]+/)
    .map((scope) => scope.trim())
    .filter(Boolean);
  return [...new Set(scopes)];
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}
