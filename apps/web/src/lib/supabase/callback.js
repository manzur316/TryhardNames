import { exchangeCodeForSession as exchangeCodeForSessionRequest } from './authService.js';

export const AUTH_CALLBACK_ERROR = 'Sign-in could not be completed. Please try again.';
export const AUTH_CALLBACK_MISSING_SESSION = 'No active session was found after auth callback.';

export function parseAuthCallbackParams(search = '', hash = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

  for (const [key, value] of hashParams.entries()) {
    if (!params.has(key)) params.set(key, value);
  }

  const hasOAuthError = Boolean(
    params.get('error') ||
    params.get('error_code') ||
    params.get('error_description'),
  );

  return {
    code: params.get('code') || null,
    hasOAuthError,
    errorMessage: hasOAuthError ? AUTH_CALLBACK_ERROR : null,
    shouldCleanUrl: Boolean(search || hash),
  };
}

export async function completeAuthCallback({
  client,
  callbackParams,
  getCurrentSession,
  exchangeCodeForSession = exchangeCodeForSessionRequest,
}) {
  if (callbackParams.hasOAuthError) {
    return { ok: false, error: callbackParams.errorMessage, session: null };
  }

  if (callbackParams.code) {
    const result = await safeExchangeCodeForSession(exchangeCodeForSession, client, callbackParams.code);
    if (!result.ok) {
      return { ok: false, error: result.error || AUTH_CALLBACK_ERROR, session: null };
    }

    const exchangedSession = result.data?.session || null;
    if (exchangedSession) {
      return { ok: true, error: null, session: exchangedSession };
    }
  }

  const existingSession = await getCurrentSession();
  if (existingSession) {
    return { ok: true, error: null, session: existingSession };
  }

  return { ok: false, error: AUTH_CALLBACK_MISSING_SESSION, session: null };
}

async function safeExchangeCodeForSession(exchangeCodeForSession, client, code) {
  try {
    return await exchangeCodeForSession(client, code);
  } catch {
    return { ok: false, error: AUTH_CALLBACK_ERROR, data: null };
  }
}
