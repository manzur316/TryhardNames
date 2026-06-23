import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { readSupabaseConfig } from '@/lib/supabase/config.js';
import { applySignedOutSessionState } from '@/lib/supabase/sessionState.js';
import {
  signInWithEmail as signInWithEmailRequest,
  signInWithGoogle as signInWithGoogleRequest,
  signOutWithSupabase,
  signUpWithEmail as signUpWithEmailRequest,
} from '@/lib/supabase/authService.js';

export const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: false,
  signUpWithEmail: async () => ({ ok: false }),
  signInWithEmail: async () => ({ ok: false }),
  signInWithGoogle: async () => ({ ok: false }),
  signOut: async () => ({ ok: false }),
  getCurrentSession: async () => null,
  setCurrentSession: () => {},
  login: async () => ({ ok: false }),
  logout: async () => ({ ok: false }),
});

export const AuthProvider = ({ children }) => {
  const initialConfig = useMemo(() => readSupabaseConfig(), []);
  const [runtime, setRuntime] = useState({ client: null, config: initialConfig });
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let subscription;

    async function initializeAuth() {
      if (!initialConfig.isConfigured) {
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }

      const nextRuntime = await getSupabaseRuntime();
      if (!isMounted) return;
      setRuntime(nextRuntime);

      const { client } = nextRuntime;
      if (!client) {
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await client.auth.getSession();
        if (!isMounted) return;
        setSession(data.session || null);
        setUser(data.session?.user || null);
      } catch {
        if (!isMounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }

      const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
        if (!isMounted) return;
        setSession(nextSession || null);
        setUser(nextSession?.user || null);
        setIsLoading(false);
      });
      subscription = data?.subscription;
    }

    initializeAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [initialConfig]);

  const client = runtime.client;
  const config = runtime.config;

  const getCurrentSession = useCallback(async () => {
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      setSession(data.session || null);
      setUser(data.session?.user || null);
      return data.session || null;
    } catch {
      setSession(null);
      setUser(null);
      return null;
    }
  }, [client]);

  const setCurrentSession = useCallback((nextSession) => {
    setSession(nextSession || null);
    setUser(nextSession?.user || null);
  }, []);

  const signUpWithEmail = useCallback(async (credentials) => {
    if (!client) return authNotConfigured();
    return signUpWithEmailRequest(client, credentials, getCurrentOrigin());
  }, [client]);

  const signInWithEmail = useCallback(async (credentials) => {
    if (!client) return authNotConfigured();
    return signInWithEmailRequest(client, credentials);
  }, [client]);

  const signInWithGoogle = useCallback(async () => {
    if (!client) return authNotConfigured();
    return signInWithGoogleRequest(client, {
      enabled: config.googleEnabled,
      origin: getCurrentOrigin(),
    });
  }, [client, config.googleEnabled]);

  const signOut = useCallback(async () => {
    if (!client) return authNotConfigured();
    const result = await signOutWithSupabase(client);
    const next = applySignedOutSessionState(result, { user, session });
    setUser(next.user);
    setSession(next.session);
    return result;
  }, [client, session, user]);

  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    isConfigured: config.isConfigured,
    configReason: config.reason,
    googleEnabled: config.googleEnabled,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    getCurrentSession,
    setCurrentSession,
    login: signInWithEmail,
    logout: signOut,
  }), [
    user,
    session,
    isLoading,
    config.isConfigured,
    config.reason,
    config.googleEnabled,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    getCurrentSession,
    setCurrentSession,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function authNotConfigured() {
  return { ok: false, error: 'Supabase Parent Auth is not configured.' };
}

function getCurrentOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}
