import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { completeAuthCallback, parseAuthCallbackParams } from '@/lib/supabase/callback.js';
import SeoHead from '@/seo/SeoHead.jsx';
import AuthUnavailable from './AuthUnavailable.jsx';

export default function AuthCallbackPage() {
  const { isConfigured, getCurrentSession, setCurrentSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      if (!isConfigured) return;
      const callbackParams = parseAuthCallbackParams(window.location.search, window.location.hash);
      if (callbackParams.shouldCleanUrl) {
        window.history.replaceState({}, document.title, '/auth/callback');
      }

      const { client } = await getSupabaseRuntime();
      const result = await completeAuthCallback({
        client,
        callbackParams,
        getCurrentSession,
      });
      if (!isMounted) return;

      if (result.ok) {
        setCurrentSession(result.session);
        navigate('/account', { replace: true });
      } else {
        setError(result.error);
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [getCurrentSession, isConfigured, navigate, setCurrentSession]);

  const seo = (
    <SeoHead
      title="Auth Callback | TryhardNames"
      description="Finish signing in to your private TryhardNames account."
      path="/auth/callback"
      noIndex
      skipCanonical
    />
  );

  if (!isConfigured) return <>{seo}<AuthUnavailable /></>;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center">
      {seo}
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Auth callback</p>
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{error ? 'Could not finish sign-in' : 'Finishing sign-in...'}</h1>
      {error ? (
        <>
          <p role="alert" className="text-sm leading-6 text-red-700 dark:text-red-100">{error}</p>
          <Link className="text-sm font-medium text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200" to="/sign-in">
            Return to sign in
          </Link>
        </>
      ) : (
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Preparing your private account dashboard.</p>
      )}
    </div>
  );
}
