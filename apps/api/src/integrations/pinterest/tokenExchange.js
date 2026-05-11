function encodeBasicAuth(appId, appSecret) {
  return Buffer.from(`${appId}:${appSecret}`).toString('base64');
}

function sanitizeTokenResponse(data) {
  return {
    tokenType: data.token_type || null,
    scope: data.scope || null,
    expiresIn: data.expires_in || null,
    refreshTokenExpiresAt: data.refresh_token_expires_at || null,
    hasAccessToken: Boolean(data.access_token),
    hasRefreshToken: Boolean(data.refresh_token),
  };
}

export async function exchangePinterestCode(code, cfg) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: cfg.redirectUri,
  });

  const response = await fetch(cfg.tokenEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeBasicAuth(cfg.appId, cfg.appSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: 'token_exchange_failed',
      details: data,
    };
  }

  const accessToken = typeof data.access_token === 'string' ? data.access_token : '';

  return {
    ok: true,
    status: response.status,
    token: sanitizeTokenResponse(data),
    /** Present for callback bootstrap only; never log or persist server-side. */
    accessToken,
  };
}
