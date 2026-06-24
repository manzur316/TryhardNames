import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth.js';
import { sanitizeReturnTo } from '@/lib/supabase/redirects.js';
import SeoHead from '@/seo/SeoHead.jsx';
import AuthUnavailable from './AuthUnavailable.jsx';

export default function SignUpPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return sanitizeReturnTo(params.get('returnTo'));
  }, [location.search]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && auth.session) {
      navigate(returnTo, { replace: true });
    }
  }, [auth.isLoading, auth.session, navigate, returnTo]);

  const seo = (
    <SeoHead
      title="Sign Up | TryhardNames"
      description="Create a private TryhardNames account."
      path="/sign-up"
      noIndex
      skipCanonical
    />
  );

  if (!auth.isConfigured) return <>{seo}<AuthUnavailable /></>;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim() || password.length < 6) {
      setError('Enter an email and a password of at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await auth.signUpWithEmail({ email: email.trim(), password });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.data?.session) {
      navigate(returnTo, { replace: true });
      return;
    }

    setMessage('Check your email to confirm the account, then sign in.');
  }

  async function handleGoogle() {
    setError('');
    setMessage('');
    setIsSubmitting(true);
    const result = await auth.signInWithGoogle();
    setIsSubmitting(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      {seo}
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Parent Auth</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Create your account</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
          Parent Auth is only for entering TryhardNames. Discord and Riot are not login providers here.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || auth.isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {auth.googleEnabled && (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Continue with Google
          </button>
        )}

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link className="font-medium text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200" to={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}>
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
