/**
 * Pinterest configuration reads environment names only. No secrets live in code.
 * OAuth credentials are provided by runtime environment.
 */

export function getPinterestConfig() {
  const appId = process.env.PINTEREST_APP_ID || '';
  const appSecret = process.env.PINTEREST_APP_SECRET || '';
  const redirectUri = process.env.PINTEREST_REDIRECT_URI || '';
  const stateSecret = process.env.PINTEREST_STATE_SECRET || '';
  const tokenEndpoint = process.env.PINTEREST_TOKEN_ENDPOINT || 'https://api.pinterest.com/v5/oauth/token';
  const apiBaseUrl = process.env.PINTEREST_API_BASE_URL || 'https://api.pinterest.com/v5';
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN || '';
  const scopes = (
    process.env.PINTEREST_SCOPES || 'boards:read,pins:read,pins:write,user_accounts:read'
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

export function getPinterestPublishConfig() {
  const apiBaseUrl = process.env.PINTEREST_API_BASE_URL || 'https://api.pinterest.com/v5';
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN || '';
  const missing = [];
  if (!accessToken) missing.push('PINTEREST_ACCESS_TOKEN');

  return {
    ok: missing.length === 0,
    missing,
    apiBaseUrl,
    accessToken,
  };
}
