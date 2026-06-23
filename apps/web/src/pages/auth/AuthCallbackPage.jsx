import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { exchangeCodeForSession } from '@/lib/supabase/authService.js';
import AuthUnavailable from './AuthUnavailable.jsx';

export default function AuthCallbackPage() {
  const { isConfigured, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      if (!isConfigured) return;
      const { client } = getSupabaseRuntime();
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const shouldCleanUrl = Boolean(window.location.search || window.location.hash);

      if (code) {
        const result = await exchangeCodeForSession(client, code);
        if (!isMounted) return;
        if (!result.ok) {
          if (shouldCleanUrl) window.history.replaceState({}, document.title, '/auth/callback');
          setError(result.error);
          return;
        }
      }

      if (shouldCleanUrl) window.history.replaceState({}, document.title, '/auth/callback');
      const session = await refreshSession();
      if (!isMounted) return;
      if (session) {
        navigate('/account', { replace: true });
      } else {
        setError('No active session was found after auth callback.');
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [isConfigured, navigate, refreshSession]);

  if (!isConfigured) return <AuthUnavailable />;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Auth callback</p>
      <h1 className="text-3xl font-semibold text-white">{error ? 'Could not finish sign-in' : 'Finishing sign-in...'}</h1>
      {error ? (
        <p role="alert" className="text-sm leading-6 text-red-100">{error}</p>
      ) : (
        <p className="text-sm leading-6 text-slate-300">Preparing your private account dashboard.</p>
      )}
    </div>
  );
}
