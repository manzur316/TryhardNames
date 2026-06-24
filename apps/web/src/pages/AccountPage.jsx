import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, Save } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import SeoHead from '@/seo/SeoHead.jsx';
import {
  DEFAULT_SCENE_CONFIG,
  SCENE_CONFIG_OPTIONS,
  getOrCreatePrivateDraft,
  mapPassportToPresentationForm,
  shouldLoadDraftForOwner,
  updatePassportPresentation,
  validatePresentationInput,
} from '@/gaming-passport/data/passportRepository.js';
import AuthUnavailable from './auth/AuthUnavailable.jsx';

export default function AccountPage() {
  const auth = useAuth();
  const [passport, setPassport] = useState(null);
  const [form, setForm] = useState({
    alias: '',
    avatarUrl: '',
    bioShort: '',
    sceneConfig: DEFAULT_SCENE_CONFIG,
  });
  const [isDraftLoading, setIsDraftLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loadedOwnerId, setLoadedOwnerId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const ownerId = auth.user?.id || null;

  useEffect(() => {
    let isMounted = true;

    async function loadDraft() {
      if (!shouldLoadDraftForOwner({ isConfigured: auth.isConfigured, ownerId, loadedOwnerId, isDirty })) return;
      setIsDraftLoading(true);
      setError('');
      try {
        const { client } = await getSupabaseRuntime();
        const draft = await getOrCreatePrivateDraft(client, auth.session, {
          alias: getEmailAlias(auth.user?.email),
        });
        if (!isMounted) return;
        setPassport(draft);
        setForm(mapPassportToPresentationForm(draft));
        setLoadedOwnerId(ownerId);
        setIsDirty(false);
      } catch {
        if (isMounted) setError('Could not load your private Gaming Passport draft.');
      } finally {
        if (isMounted) setIsDraftLoading(false);
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [auth.isConfigured, auth.session, auth.user?.email, isDirty, loadedOwnerId, ownerId]);

  const seo = (
    <SeoHead
      title="Account | TryhardNames"
      description="Manage your private TryhardNames account and Gaming Passport draft."
      path="/account"
      noIndex
      skipCanonical
    />
  );

  if (!auth.isConfigured) return <>{seo}<AuthUnavailable /></>;
  if (auth.isLoading) return <>{seo}<AccountLoading /></>;
  if (!auth.session) return <Navigate to="/sign-in?returnTo=%2Faccount" replace />;

  const validation = validatePresentationInput(form);

  async function handleSave(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!passport || !validation.ok) return;

    setIsSaving(true);
    try {
      const runtime = await getSupabaseRuntime();
      const updated = await updatePassportPresentation(runtime.client, auth.session, passport.id, form);
      setPassport(updated);
      setForm(mapPassportToPresentationForm(updated));
      setIsDirty(false);
      setMessage('Draft saved.');
    } catch {
      setError('Could not save the draft.');
    } finally {
      setIsSaving(false);
    }
  }

  function updateForm(patch) {
    setForm((current) => ({ ...current, ...patch }));
    setIsDirty(true);
    setMessage('');
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      {seo}
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Private dashboard</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Gaming Passport draft</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{auth.user?.email}</p>
            </div>
            <button
              type="button"
              onClick={auth.signOut}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-cyan-300 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
          This Passport is a private draft. It is not published, has no public URL, and cannot be shared yet.
        </div>

        <form className="space-y-5 rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20" onSubmit={handleSave}>
          <div>
            <label htmlFor="passport-alias" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Alias
            </label>
            <input
              id="passport-alias"
              type="text"
              maxLength={64}
              disabled={isDraftLoading || isSaving}
              value={form.alias}
              onChange={(event) => updateForm({ alias: event.target.value })}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
            />
            {validation.errors.alias && <p className="mt-1 text-sm text-red-700 dark:text-red-200">{validation.errors.alias}</p>}
          </div>

          <div>
            <label htmlFor="passport-avatar" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Avatar URL
            </label>
            <input
              id="passport-avatar"
              type="url"
              maxLength={500}
              disabled={isDraftLoading || isSaving}
              value={form.avatarUrl}
              onChange={(event) => updateForm({ avatarUrl: event.target.value })}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
            />
            {validation.errors.avatarUrl && <p className="mt-1 text-sm text-red-700 dark:text-red-200">{validation.errors.avatarUrl}</p>}
          </div>

          <div>
            <label htmlFor="passport-bio" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Short bio
            </label>
            <textarea
              id="passport-bio"
              maxLength={200}
              disabled={isDraftLoading || isSaving}
              value={form.bioShort}
              onChange={(event) => updateForm({ bioShort: event.target.value })}
              className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{form.bioShort.length}/200</p>
            {validation.errors.bioShort && <p className="mt-1 text-sm text-red-700 dark:text-red-200">{validation.errors.bioShort}</p>}
          </div>

          <SceneConfigControls form={form} updateForm={updateForm} disabled={isDraftLoading || isSaving} />

          {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">{error}</p>}
          {isDirty && !message && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">Unsaved draft changes.</p>}
          {message && <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">{message}</p>}

          <button
            type="submit"
            disabled={isSaving || isDraftLoading || !validation.ok}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {isSaving ? 'Saving...' : 'Save draft'}
          </button>
        </form>
      </section>

      <section>
        <PrivateDraftPreview form={form} isLoading={isDraftLoading} />
      </section>
    </div>
  );
}

function SceneConfigControls({ form, updateForm, disabled }) {
  const sceneConfig = form.sceneConfig || DEFAULT_SCENE_CONFIG;
  const updateScene = (key, value) => {
    updateForm({
      sceneConfig: {
        layout: sceneConfig.layout,
        accent: sceneConfig.accent,
        density: sceneConfig.density,
        [key]: value,
      },
    });
  };

  return (
    <fieldset className="grid gap-4 sm:grid-cols-3">
      <legend className="sr-only">Visual configuration</legend>
      <SelectControl
        id="scene-layout"
        label="Layout"
        value={sceneConfig.layout}
        options={SCENE_CONFIG_OPTIONS.layout}
        onChange={(value) => updateScene('layout', value)}
        disabled={disabled}
      />
      <SelectControl
        id="scene-accent"
        label="Accent"
        value={sceneConfig.accent}
        options={SCENE_CONFIG_OPTIONS.accent}
        onChange={(value) => updateScene('accent', value)}
        disabled={disabled}
      />
      <SelectControl
        id="scene-density"
        label="Density"
        value={sceneConfig.density}
        options={SCENE_CONFIG_OPTIONS.density}
        onChange={(value) => updateScene('density', value)}
        disabled={disabled}
      />
    </fieldset>
  );
}

function SelectControl({ id, label, value, options, onChange, disabled }) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-cyan-400/40 focus:ring-2 dark:border-white/10 dark:bg-black/30 dark:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>{toLabel(option)}</option>
        ))}
      </select>
    </label>
  );
}

function PrivateDraftPreview({ form, isLoading }) {
  const scene = form.sceneConfig || DEFAULT_SCENE_CONFIG;
  const accentClasses = {
    cyan: 'border-cyan-300 bg-cyan-50/80 dark:border-cyan-300/40 dark:bg-cyan-300/10',
    violet: 'border-violet-300 bg-violet-50/80 dark:border-violet-300/40 dark:bg-violet-300/10',
    emerald: 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-300/40 dark:bg-emerald-300/10',
    amber: 'border-amber-300 bg-amber-50/80 dark:border-amber-300/40 dark:bg-amber-300/10',
  };
  const densityClass = scene.density === 'dense' ? 'gap-3 p-5' : 'gap-5 p-7';

  return (
    <div className={`sticky top-20 flex flex-col rounded-lg border ${accentClasses[scene.accent] || accentClasses.cyan} ${densityClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white dark:bg-white/10">
          Private draft
        </span>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-black/20 dark:text-slate-200">
          Not published
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">Preparing draft preview...</p>
      ) : (
        <div className={scene.layout === 'compact' ? 'flex items-center gap-4' : 'space-y-4'}>
          <AvatarPreview avatarUrl={form.avatarUrl} alias={form.alias} />
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{form.alias || 'Unnamed player'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {form.bioShort || 'Add a short private bio to preview your future Gaming Passport.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarPreview({ avatarUrl, alias }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alias ? `${alias} avatar` : 'Draft avatar'}
        className="h-20 w-20 rounded-lg border border-slate-300 object-cover dark:border-white/15"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl font-semibold text-cyan-700 dark:border-white/15 dark:bg-black/30 dark:text-cyan-200">
      {(alias || '?').trim().slice(0, 1).toUpperCase() || '?'}
    </div>
  );
}

function AccountLoading() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Account</p>
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Loading private dashboard...</h1>
    </div>
  );
}

function getEmailAlias(email) {
  if (!email || typeof email !== 'string') return '';
  return email.split('@')[0].slice(0, 64);
}

function toLabel(value) {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
