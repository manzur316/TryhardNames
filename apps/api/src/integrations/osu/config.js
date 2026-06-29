const DEFAULT_AUTHORIZATION_URL = 'https://osu.ppy.sh/oauth/authorize';
const DEFAULT_TOKEN_ENDPOINT = 'https://osu.ppy.sh/oauth/token';
const DEFAULT_API_BASE_URL = 'https://osu.ppy.sh/api/v2';
const DEFAULT_SCOPES = Object.freeze(['identify', 'public']);
const ALLOWED_SCOPES = new Set(DEFAULT_SCOPES);
export const OSU_PRODUCTION_RUNTIME_GATES = Object.freeze([
  'OSU_PRODUCTION_GO_NO_GO_ACCEPTED',
  'OSU_PRODUCTION_CALLBACK_REVIEWED',
  'OSU_PRODUCTION_ROLLBACK_ACCEPTED',
  'OSU_PRODUCTION_MONITORING_REVIEWED',
  'OSU_PRODUCTION_SOURCE_GUARDS_PASSED',
]);

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
  const productionRuntimeGate = getProductionRuntimeGate(env, enabled);

  const missing = [];
  if (enabled) {
    if (!clientId) missing.push('OSU_CLIENT_ID');
    if (!clientSecret) missing.push('OSU_CLIENT_SECRET');
    if (!redirectUri) missing.push('OSU_REDIRECT_URI');
    if (!stateSecret) missing.push('OSU_STATE_SECRET');
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (invalidScopes.length > 0) missing.push('OSU_SCOPES');
    missing.push(...productionRuntimeGate.missing);
  }

  const configured = enabled && missing.length === 0;

  return {
    provider: 'osu',
    enabled,
    configured,
    status: getRuntimeStatus({ enabled, configured, productionRuntimeGate }),
    missing,
    productionRuntimeGate,
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
    productionRuntimeGate: {
      required: config.productionRuntimeGate.required,
      satisfied: config.productionRuntimeGate.satisfied,
      missing: config.productionRuntimeGate.missing,
    },
    scopes: config.scopes,
    tokenStrategy: config.tokenStrategy,
    hasClientSecret: config.hasClientSecret,
  };
}

function getRuntimeStatus({ enabled, configured, productionRuntimeGate }) {
  if (!enabled) return 'disabled';
  if (configured) return 'configured';
  if (productionRuntimeGate.required && !productionRuntimeGate.satisfied) {
    return 'production_gate_blocked';
  }
  return 'missing_configuration';
}

function getProductionRuntimeGate(env, enabled) {
  const required = enabled && isProductionRuntime(env);
  const missing = required
    ? OSU_PRODUCTION_RUNTIME_GATES.filter((gateName) => clean(env[gateName]) !== 'true')
    : [];

  return {
    required,
    satisfied: required ? missing.length === 0 : true,
    missing,
  };
}

function isProductionRuntime(env) {
  return ['NODE_ENV', 'VERCEL_ENV', 'APP_ENV'].some((name) => clean(env[name]) === 'production');
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
