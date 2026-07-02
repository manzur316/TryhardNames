/**
 * Pinterest configuration reads environment names only. No credential values live in code.
 * OAuth credentials are provided by runtime environment.
 */

export const PINTEREST_AUTOMATION_SECRET_HEADER = 'X-TryhardNames-Automation-Secret';
export const PINTEREST_AUTOMATION_SECRET_HEADER_FALLBACK = 'X-THN-Automation-Secret';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getPinterestConfig(env = process.env) {
  const appId = clean(env.PINTEREST_APP_ID);
  const appSecret = clean(env.PINTEREST_APP_SECRET);
  const redirectUri = clean(env.PINTEREST_REDIRECT_URI);
  const stateSecret = clean(env.PINTEREST_STATE_SECRET);
  const tokenEndpoint = clean(env.PINTEREST_TOKEN_ENDPOINT) || 'https://api.pinterest.com/v5/oauth/token';
  const apiBaseUrl = clean(env.PINTEREST_API_BASE_URL) || 'https://api.pinterest.com/v5';
  const accessToken = clean(env.PINTEREST_ACCESS_TOKEN);
  const scopes = (
    clean(env.PINTEREST_SCOPES) || 'boards:read,pins:read,pins:write,user_accounts:read'
  )
    .split(/[\s,]+/)
    .filter(Boolean);
  const missing = [];
  if (!appId) missing.push('PINTEREST_APP_ID');
  if (!appSecret) missing.push('PINTEREST_APP_SECRET');
  if (!redirectUri) missing.push('PINTEREST_REDIRECT_URI');
  if (!stateSecret) missing.push('PINTEREST_STATE_SECRET');
  return {
    ok: missing.length === 0,
    missing,
    appId,
    appSecret,
    hasSecret: Boolean(appSecret),
    redirectUri,
    stateSecret,
    tokenEndpoint,
    apiBaseUrl,
    scopes,
    hasAccessToken: Boolean(accessToken),
  };
}

export function getPinterestPublishConfig(env = process.env) {
  const apiBaseUrl = clean(env.PINTEREST_API_BASE_URL) || 'https://api.pinterest.com/v5';
  const accessToken = clean(env.PINTEREST_ACCESS_TOKEN);
  const missing = [];
  if (!accessToken) missing.push('PINTEREST_ACCESS_TOKEN');

  return {
    ok: missing.length === 0,
    missing,
    apiBaseUrl,
    accessToken,
  };
}

export function getPinterestAutomationConfig(env = process.env) {
  const automationSecret = clean(env.PINTEREST_AUTOMATION_SECRET);
  const missing = [];
  if (!automationSecret) missing.push('PINTEREST_AUTOMATION_SECRET');

  return {
    ok: missing.length === 0,
    missing,
    headerName: PINTEREST_AUTOMATION_SECRET_HEADER,
    fallbackHeaderName: PINTEREST_AUTOMATION_SECRET_HEADER_FALLBACK,
    hasAutomationSecret: Boolean(automationSecret),
    automationSecret,
  };
}
