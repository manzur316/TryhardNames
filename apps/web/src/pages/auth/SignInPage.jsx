import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth.js';
import { sanitizeReturnTo } from '@/lib/supabase/redirects.js';
import SeoHead from '@/seo/SeoHead.jsx';
import AuthUnavailable from './AuthUnavailable.jsx';

export default function SignInPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return sanitizeReturnTo(params.get('returnTo'));
  }, [location.search]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.isLoading && auth.session) {
      navigate(returnTo, { replace: true });
    }
  }, [auth.isLoading, auth.session, navigate, returnTo]);

  const seo = (
    <SeoHead
      title="Sign In | TryhardNames"
      description="Sign in to manage your private TryhardNames account."
      path="/sign-in"
      noIndex
      skipCanonical
    />
  );

  if (!auth.isConfigured) return <>{seo}<AuthUnavailable /></>;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || password.length < 6) {
      setError('Enter an email and a password of at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await auth.signInWithEmail({ email: email.trim(), password });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(returnTo, { replace: true });
  }

  async function handleGoogle() {
    setError('');
    setIsSubmitting(true);
    const result = await auth.signInWithGoogle();
    setIsSubmitting(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      {seo}
      <section className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Parent Auth</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Sign in to TryhardNames</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
          Access your private Gaming Passport draft. Generators stay public and do not require an account.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signin-email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
              required
            />
          </div>

          <div>
            <label htmlFor="signin-password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || auth.isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {auth.googleEnabled && (
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>
        )}

        <p className="mt-5 text-center text-sm text-slate-300">
          Need an account?{' '}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" to={`/sign-up?returnTo=${encodeURIComponent(returnTo)}`}>
            Sign up
          </Link>
        </p>
      </section>
    </div>
  );
}
