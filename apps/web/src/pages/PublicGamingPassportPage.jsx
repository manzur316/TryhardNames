import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, Home, ShieldCheck } from 'lucide-react';
import PublicLinkedProviders from '@/gaming-passport/components/PublicLinkedProviders.jsx';
import PublicPassportCard from '@/gaming-passport/components/PublicPassportCard.jsx';
import PublicPassportProfile from '@/gaming-passport/components/PublicPassportProfile.jsx';
import PublicPassportSafetyNotice from '@/gaming-passport/components/PublicPassportSafetyNotice.jsx';
import PublicProfileReportDialog from '@/gaming-passport/components/PublicProfileReportDialog.jsx';
import PublicProofCard from '@/gaming-passport/components/PublicProofCard.jsx';
import { getPublicPassportBySlug } from '@/gaming-passport/data/publicPassportRepository.js';
import { normalizePublicSlug } from '@/gaming-passport/domain/contracts.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import SeoHead from '@/seo/SeoHead.jsx';

export default function PublicGamingPassportPage() {
  const { slug = '' } = useParams();
  const normalizedSlug = useMemo(() => normalizePublicSlug(slug), [slug]);
  const [state, setState] = useState({
    status: 'loading',
    passport: null,
    error: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadPassport() {
      setState({ status: 'loading', passport: null, error: '' });
      try {
        const { client, config } = await getSupabaseRuntime();
        if (!client || !config.isConfigured) {
          if (!cancelled) {
            setState({
              status: 'unavailable',
              passport: null,
              error: 'Public Gaming Passport lookup is not configured in this environment.',
            });
          }
          return;
        }

        const passport = await getPublicPassportBySlug(client, slug);
        if (cancelled) return;
        if (!passport) {
          setState({ status: 'not-found', passport: null, error: '' });
          return;
        }
        setState({ status: 'ready', passport, error: '' });
      } catch {
        if (!cancelled) {
          setState({
            status: 'unavailable',
            passport: null,
            error: 'Public Gaming Passport lookup is temporarily unavailable.',
          });
        }
      }
    }

    loadPassport();
    const refresh = () => { if (!document.hidden) loadPassport(); };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [slug]);

  if (state.status === 'ready' && state.passport) {
    return <PublicPassportLoaded passport={state.passport} />;
  }

  if (state.status === 'loading') {
    return (
      <>
        <SeoHead
          title="Gaming Passport | TryhardNames"
          description="Loading a public TryhardNames Gaming Passport."
          path={`/id/${normalizedSlug || slug}`}
          skipCanonical
        />
        <main className="min-h-[70vh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
          <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Loading Gaming Passport...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <PassportUnavailable
      slug={normalizedSlug || slug}
      error={state.status === 'unavailable' ? state.error : ''}
    />
  );
}

function PublicPassportLoaded({ passport }) {
  const displayName = passport.alias || passport.slug;
  const description = 'View a public TryhardNames Gaming Passport.';

  return (
    <>
      <SeoHead
        title={`${displayName} | TryhardNames Gaming Passport`}
        description={description}
        path={`/id/${passport.slug}`}
        ogType="profile"
      />
      <main className="gp-public bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        {passport.schemaVersion === 2 ? <PublicPassportProfile passport={passport} /> : <PublicPassportCard passport={passport} />}

        {passport.schemaVersion !== 2 && <section className="gp-public-content">
          {passport.featuredProofs.length > 0 && <div>
            <div className="gp-section-heading">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Featured public proofs</h2>
            </div>
              <div className="gp-proof-grid">
                {passport.featuredProofs.map((proof) => (
                  <PublicProofCard
                    key={getPublicProofKey(proof)}
                    proof={proof}
                  />
                ))}
              </div>
          </div>}

          <div className="space-y-6 py-8">
            <PublicLinkedProviders providers={passport.linkedProviders} />
            <PublicProfileReportDialog slug={passport.slug} />
          </div>
        </section>}
        <details className="gp-policy">
          <summary>Verification & privacy</summary>
          <PublicPassportSafetyNotice />
        </details>
      </main>
    </>
  );
}

function getPublicProofKey(proof) {
  if (proof.source === 'osu' && proof.type === 'profile_linked') {
    return `${proof.source}-${proof.type}-${proof.observedAt || proof.label || 'profile'}`;
  }

  return `${proof.provider}-${proof.proofType}-${proof.mode}-${proof.title}`;
}

function PassportUnavailable({ slug, error }) {
  return (
    <>
      <SeoHead
        title="Gaming Passport unavailable | TryhardNames"
        description="This Gaming Passport is not available as a public profile."
        path={`/id/${slug || ''}`}
        noIndex
        skipCanonical
      />
      <main className="min-h-[70vh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-normal text-slate-950 dark:text-white">
            Passport not available
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            This Gaming Passport may not exist, may not be published, or may not meet public serving requirements. Private draft state is never exposed here.
          </p>
          {error && (
            <p role="status" className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
              {error}
            </p>
          )}
          <Link
            to="/gaming-passport"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Learn about Gaming Passport
          </Link>
        </div>
      </main>
    </>
  );
}
