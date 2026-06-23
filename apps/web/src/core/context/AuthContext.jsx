import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
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
  refreshSession: async () => null,
  login: async () => ({ ok: false }),
  logout: async () => ({ ok: false }),
});

export const AuthProvider = ({ children }) => {
  const { client, config } = useMemo(() => getSupabaseRuntime(), []);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!client) {
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    client.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session || null);
      setUser(data.session?.user || null);
      setIsLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setSession(null);
      setUser(null);
      setIsLoading(false);
    });

    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data?.subscription?.unsubscribe?.();
    };
  }, [client]);

  const refreshSession = useCallback(async () => {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    setSession(data.session || null);
    setUser(data.session?.user || null);
    return data.session || null;
  }, [client]);

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
    setUser(null);
    setSession(null);
    return result;
  }, [client]);

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
    refreshSession,
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
    refreshSession,
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
