import { getAuthCallbackUrl } from './redirects.js';

export function normalizeAuthError(error) {
  if (!error) return null;

  const message = String(error.message || '').toLowerCase();
  if (message.includes('invalid login') || message.includes('credentials')) {
    return 'Unable to sign in with those credentials.';
  }
  if (message.includes('rate') || message.includes('too many')) {
    return 'Please wait a moment before trying again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Auth service is unreachable. Check the local Supabase stack.';
  }
  return 'Auth request could not be completed.';
}

export async function signUpWithEmail(client, { email, password }, origin) {
  requireClient(client);
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthCallbackUrl(origin),
    },
  });

  return toAuthResult({ data, error });
}

export async function signInWithEmail(client, { email, password }) {
  requireClient(client);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return toAuthResult({ data, error });
}

export async function signInWithGoogle(client, { enabled, origin } = {}) {
  requireClient(client);
  if (!enabled) {
    return { ok: false, error: 'Google sign-in is disabled for this environment.' };
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthCallbackUrl(origin),
    },
  });

  return toAuthResult({ data, error });
}

export async function signOutWithSupabase(client) {
  requireClient(client);
  const { error } = await client.auth.signOut();
  return toAuthResult({ data: null, error });
}

export async function exchangeCodeForSession(client, code) {
  requireClient(client);
  if (!code) return { ok: false, error: 'Missing auth callback code.' };
  const { data, error } = await client.auth.exchangeCodeForSession(code);
  return toAuthResult({ data, error });
}

function toAuthResult({ data, error }) {
  if (error) {
    return { ok: false, error: normalizeAuthError(error), data: data || null };
  }
  return { ok: true, error: null, data: data || null };
}

function requireClient(client) {
  if (!client) {
    throw new Error('Supabase client is not configured.');
  }
}
