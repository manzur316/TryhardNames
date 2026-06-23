import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, Save } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import {
  DEFAULT_SCENE_CONFIG,
  SCENE_CONFIG_OPTIONS,
  getOrCreatePrivateDraft,
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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDraft() {
      if (!auth.session || !auth.isConfigured) return;
      setIsDraftLoading(true);
      setError('');
      try {
        const { client } = getSupabaseRuntime();
        const draft = await getOrCreatePrivateDraft(client, auth.session, {
          alias: getEmailAlias(auth.user?.email),
        });
        if (!isMounted) return;
        setPassport(draft);
        setForm({
          alias: draft.alias,
          avatarUrl: draft.avatarUrl,
          bioShort: draft.bioShort,
          sceneConfig: draft.sceneConfig,
        });
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
  }, [auth.session, auth.isConfigured, auth.user?.email]);

  if (!auth.isConfigured) return <AuthUnavailable />;
  if (auth.isLoading) return <AccountLoading />;
  if (!auth.session) return <Navigate to="/sign-in?returnTo=%2Faccount" replace />;

  const validation = validatePresentationInput(form);

  async function handleSave(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!passport || !validation.ok) return;

    setIsSaving(true);
    try {
      const { client } = getSupabaseRuntime();
      const updated = await updatePassportPresentation(client, auth.session, passport.id, form);
      setPassport(updated);
      setMessage('Draft saved.');
    } catch {
      setError('Could not save the draft.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Private dashboard</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Gaming Passport draft</h1>
              <p className="mt-2 text-sm text-slate-300">{auth.user?.email}</p>
            </div>
            <button
              type="button"
              onClick={auth.signOut}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
          This Passport is a private draft. It is not published, has no public URL, and cannot be shared yet.
        </div>

        <form className="space-y-5 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={handleSave}>
          <div>
            <label htmlFor="passport-alias" className="block text-sm font-medium text-slate-200">
              Alias
            </label>
            <input
              id="passport-alias"
              type="text"
              maxLength={64}
              disabled={isDraftLoading || isSaving}
              value={form.alias}
              onChange={(event) => setForm({ ...form, alias: event.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
            />
            {validation.errors.alias && <p className="mt-1 text-sm text-red-200">{validation.errors.alias}</p>}
          </div>

          <div>
            <label htmlFor="passport-avatar" className="block text-sm font-medium text-slate-200">
              Avatar URL
            </label>
            <input
              id="passport-avatar"
              type="url"
              maxLength={500}
              disabled={isDraftLoading || isSaving}
              value={form.avatarUrl}
              onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
            />
            {validation.errors.avatarUrl && <p className="mt-1 text-sm text-red-200">{validation.errors.avatarUrl}</p>}
          </div>

          <div>
            <label htmlFor="passport-bio" className="block text-sm font-medium text-slate-200">
              Short bio
            </label>
            <textarea
              id="passport-bio"
              maxLength={200}
              disabled={isDraftLoading || isSaving}
              value={form.bioShort}
              onChange={(event) => setForm({ ...form, bioShort: event.target.value })}
              className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
            />
            <p className="mt-1 text-xs text-slate-500">{form.bioShort.length}/200</p>
            {validation.errors.bioShort && <p className="mt-1 text-sm text-red-200">{validation.errors.bioShort}</p>}
          </div>

          <SceneConfigControls form={form} setForm={setForm} disabled={isDraftLoading || isSaving} />

          {error && <p role="alert" className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p>}
          {message && <p role="status" className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{message}</p>}

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

function SceneConfigControls({ form, setForm, disabled }) {
  const sceneConfig = form.sceneConfig || DEFAULT_SCENE_CONFIG;
  const updateScene = (key, value) => {
    setForm({
      ...form,
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
    <label htmlFor={id} className="block text-sm font-medium text-slate-200">
      {label}
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-cyan-400/40 focus:ring-2"
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
    cyan: 'border-cyan-300/40 bg-cyan-300/10',
    violet: 'border-violet-300/40 bg-violet-300/10',
    emerald: 'border-emerald-300/40 bg-emerald-300/10',
    amber: 'border-amber-300/40 bg-amber-300/10',
  };
  const densityClass = scene.density === 'dense' ? 'gap-3 p-5' : 'gap-5 p-7';

  return (
    <div className={`sticky top-20 flex flex-col rounded-lg border ${accentClasses[scene.accent] || accentClasses.cyan} ${densityClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Private draft
        </span>
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
          Not published
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-300">Preparing draft preview...</p>
      ) : (
        <div className={scene.layout === 'compact' ? 'flex items-center gap-4' : 'space-y-4'}>
          <AvatarPreview avatarUrl={form.avatarUrl} alias={form.alias} />
          <div>
            <h2 className="text-2xl font-semibold text-white">{form.alias || 'Unnamed player'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
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
        className="h-20 w-20 rounded-lg border border-white/15 object-cover"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-white/15 bg-black/30 text-2xl font-semibold text-cyan-200">
      {(alias || '?').trim().slice(0, 1).toUpperCase() || '?'}
    </div>
  );
}

function AccountLoading() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Account</p>
      <h1 className="text-3xl font-semibold text-white">Loading private dashboard...</h1>
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
