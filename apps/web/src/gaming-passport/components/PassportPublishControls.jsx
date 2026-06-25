import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Globe2, Lock, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { normalizePublicSlug } from '@/gaming-passport/domain/contracts.js';
import { PASSPORT_STATUSES } from '@/gaming-passport/domain/constants.js';
import {
  claimPassportSlug,
  getPublishCommandState,
  publishPassport,
  setPassportPublicationConsent,
  unpublishPassport,
} from '@/gaming-passport/data/passportPublishRepository.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';

const REQUIREMENT_LABELS = Object.freeze({
  parent_auth: 'Parent Auth session',
  owner: 'Owner-controlled Passport',
  passport: 'Private draft',
  publication_consent: 'Publication consent',
  canonical_slug: 'Canonical public slug',
  verified_linked_provider: 'Verified linked provider',
  not_suspended: 'Not suspended',
});

export default function PassportPublishControls({ passport, session, isLoading = false, onPassportChange }) {
  const [commandState, setCommandState] = useState(null);
  const [slugInput, setSlugInput] = useState(passport?.slug || '');
  const [consent, setConsent] = useState(Boolean(passport?.publicationConsent));
  const [isStateLoading, setIsStateLoading] = useState(false);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSlugInput(passport?.slug || '');
    setConsent(Boolean(passport?.publicationConsent));
  }, [passport?.id, passport?.publicationConsent, passport?.slug]);

  const loadCommandState = useCallback(async () => {
    if (!passport?.id || !session) return;
    setIsStateLoading(true);
    setError('');
    try {
      const { client } = await getSupabaseRuntime();
      const state = await getPublishCommandState(client, session, passport.id);
      setCommandState(state);
      onPassportChange?.(state.passport);
    } catch {
      setError('Could not load private publish command state.');
    } finally {
      setIsStateLoading(false);
    }
  }, [onPassportChange, passport?.id, session]);

  useEffect(() => {
    loadCommandState();
  }, [loadCommandState]);

  const readiness = commandState?.readiness || null;
  const missingRequirements = readiness?.missing || ['verified_linked_provider'];
  const canonicalPreview = useMemo(() => normalizePublicSlug(slugInput), [slugInput]);
  const isPublished = passport?.status === PASSPORT_STATUSES.PUBLISHED;
  const canPublish = Boolean(readiness?.publishable);
  const isBusy = isStateLoading || isSavingConsent || isSavingSlug || isPublishing || isUnpublishing;

  async function handleConsentChange(event) {
    const next = event.target.checked;
    setConsent(next);
    setMessage('');
    setError('');
    if (!passport?.id) return;

    setIsSavingConsent(true);
    try {
      const { client } = await getSupabaseRuntime();
      const updated = await setPassportPublicationConsent(client, session, passport.id, next);
      onPassportChange?.(updated);
      setMessage(next ? 'Publication consent saved.' : 'Publication consent revoked.');
      await loadCommandState();
    } catch {
      setConsent(Boolean(passport?.publicationConsent));
      setError('Could not save publication consent.');
    } finally {
      setIsSavingConsent(false);
    }
  }

  async function handleSlugSave(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!passport?.id) return;

    setIsSavingSlug(true);
    try {
      const { client } = await getSupabaseRuntime();
      const updated = await claimPassportSlug(client, session, passport.id, slugInput);
      setSlugInput(updated.slug || '');
      onPassportChange?.(updated);
      setMessage('Slug command saved.');
      await loadCommandState();
    } catch (err) {
      const detail = err?.details?.includes?.('published_slug_locked')
        ? ' Published slugs are locked until public serving exists.'
        : '';
      setError(`Could not save this slug.${detail}`);
    } finally {
      setIsSavingSlug(false);
    }
  }

  async function handlePublish() {
    setMessage('');
    setError('');
    if (!passport?.id) return;

    setIsPublishing(true);
    try {
      const { client } = await getSupabaseRuntime();
      const result = await publishPassport(client, session, passport.id);
      if (result.blocked) {
        setCommandState(result.state);
        setMessage('Publish blocked by policy. Provider verification is required before public serving.');
        return;
      }
      onPassportChange?.(result.passport);
      setMessage('Publish command completed. Public serving still waits for a later PR.');
      await loadCommandState();
    } catch {
      setError('Publish command failed safely.');
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUnpublish() {
    setMessage('');
    setError('');
    if (!passport?.id) return;

    setIsUnpublishing(true);
    try {
      const { client } = await getSupabaseRuntime();
      const updated = await unpublishPassport(client, session, passport.id);
      onPassportChange?.(updated);
      setMessage('Unpublish command completed.');
      await loadCommandState();
    } catch {
      setError('Unpublish command failed safely.');
    } finally {
      setIsUnpublishing(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            Private publish controls
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Publish Runtime Commands</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            No public profile route exists yet. Publishing commands are being prepared; public <code>/id/:slug</code> comes in a later PR.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-black/30 dark:text-slate-200">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          {passport?.status || 'draft_private'}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="space-y-4">
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
            <input
              type="checkbox"
              checked={consent}
              onChange={handleConsentChange}
              disabled={isLoading || isBusy}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-950 dark:text-white">I consent to prepare this Passport for publication.</span>
              <span className="mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-300">
                Consent can be revoked. Revoking consent unpublishes an already published Passport.
              </span>
            </span>
          </label>

          <form className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20" onSubmit={handleSlugSave}>
            <label htmlFor="passport-public-slug" className="text-sm font-semibold text-slate-950 dark:text-white">
              Public slug command
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="passport-public-slug"
                value={slugInput}
                onChange={(event) => setSlugInput(event.target.value)}
                disabled={isLoading || isBusy || isPublished}
                maxLength={64}
                placeholder="player-one"
                className="min-h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-white/15 dark:bg-black/30 dark:text-white dark:focus:border-emerald-300 dark:focus:ring-emerald-300/20 dark:disabled:bg-white/5"
              />
              <button
                type="submit"
                disabled={isLoading || isBusy || isPublished || !slugInput.trim()}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-white/10 dark:disabled:text-slate-400"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Save slug
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Canonical preview: <span className="font-semibold text-slate-950 dark:text-white">{canonicalPreview || 'none'}</span>
            </p>
            {isPublished && (
              <p className="mt-2 text-xs leading-5 text-amber-700 dark:text-amber-100">
                Published slugs are locked until public serving and cache rules exist.
              </p>
            )}
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isLoading || isBusy || !canPublish}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-white/10 dark:disabled:text-slate-400"
            >
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Run publish command
            </button>
            {isPublished && (
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={isLoading || isBusy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Unpublish
              </button>
            )}
          </div>

          {(message || error) && (
            <p
              role={error ? 'alert' : 'status'}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                error
                  ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100'
              }`}
            >
              {error || message}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center gap-2">
            {canPublish ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-200" aria-hidden="true" />
            )}
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Policy requirements</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
            Provider verification is required before public serving. No Riot or Discord connection is live.
          </p>
          <ul className="mt-3 space-y-2">
            {missingRequirements.length === 0 ? (
              <li className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Publish command requirements are satisfied.
              </li>
            ) : (
              missingRequirements.map((requirement) => (
                <li key={requirement} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-200" aria-hidden="true" />
                  {REQUIREMENT_LABELS[requirement] || requirement}
                </li>
              ))
            )}
          </ul>
          <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            This command layer controls owner consent and status transitions only. It does not create a public page, provider runtime, token storage, or profile serving endpoint.
          </p>
        </div>
      </div>
    </section>
  );
}
