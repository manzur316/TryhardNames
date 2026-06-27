export function buildOsuAuthorizeUrl(config, state) {
  const url = new URL(config.authorizationUrl);
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', config.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', config.scopes.join(' '));
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeOsuCode(code, config, fetchImpl = fetch) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
  });

  const response = await fetchImpl(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await readJson(response);

  if (!response.ok || !data.access_token) {
    return {
      ok: false,
      status: response.status,
      error: 'token_exchange_failed',
      details: sanitizeProviderError(data),
    };
  }

  return {
    ok: true,
    status: response.status,
    token: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || '',
      expiresIn: data.expires_in || null,
      tokenType: data.token_type || 'Bearer',
      scope: data.scope || '',
    },
    safeTokenSummary: {
      hasAccessToken: true,
      hasRefreshToken: Boolean(data.refresh_token),
      expiresIn: data.expires_in || null,
      tokenType: data.token_type || 'Bearer',
      scope: data.scope || '',
    },
  };
}

export async function fetchOsuOwnProfile(accessToken, config, fetchImpl = fetch) {
  const response = await fetchImpl(`${config.apiBaseUrl}/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await readJson(response);

  if (!response.ok || !data.id) {
    return {
      ok: false,
      status: response.status,
      error: 'profile_fetch_failed',
      details: sanitizeProviderError(data),
    };
  }

  return {
    ok: true,
    status: response.status,
    identity: normalizeOsuIdentity(data),
  };
}

export async function revokeOsuCurrentToken(accessToken, config, fetchImpl = fetch) {
  const response = await fetchImpl(`${config.apiBaseUrl}/oauth/tokens/current`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await readJson(response);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: 'token_revoke_failed',
      details: sanitizeProviderError(data),
    };
  }

  return { ok: true, status: response.status };
}

export function normalizeOsuIdentity(data = {}) {
  const externalAccountId = String(data.id || '').trim();
  const username = String(data.username || '').trim();
  return {
    externalAccountId,
    displayName: username || `osu! user ${externalAccountId}`,
    username,
    profileUrl: externalAccountId ? `https://osu.ppy.sh/users/${encodeURIComponent(externalAccountId)}` : '',
  };
}

export function sanitizeOsuRuntimeResult(input = {}) {
  return JSON.parse(JSON.stringify(input, (key, value) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if ([
      'accesstoken',
      'refreshtoken',
      'clientsecret',
      'code',
      'rawpayload',
      'token',
    ].includes(normalizedKey)) {
      return undefined;
    }
    return value;
  }));
}

function sanitizeProviderError(data) {
  if (!data || typeof data !== 'object') return {};
  return {
    error: String(data.error || data.message || 'provider_error').slice(0, 120),
  };
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: 'non_json_response' };
  }
}
