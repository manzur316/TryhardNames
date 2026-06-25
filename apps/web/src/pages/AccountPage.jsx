import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Compass, Copy, ExternalLink, Gamepad2, LogOut, Save, ShieldCheck, Star, Trash2, UserRound } from 'lucide-react';
import { FavoritesContext } from '@/contexts/FavoritesContext.jsx';
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
import { copyTextToClipboard } from '@/utils/clipboard.js';
import AuthUnavailable from './auth/AuthUnavailable.jsx';

export default function AccountPage() {
  const auth = useAuth();
  const favoritesContext = useContext(FavoritesContext);
  const [passport, setPassport] = useState(null);
  const [form, setForm] = useState({
    alias: '',
    avatarUrl: '',
    bioShort: '',
    sceneConfig: DEFAULT_SCENE_CONFIG,
  });
  const [copiedName, setCopiedName] = useState('');
  const [isDraftLoading, setIsDraftLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loadedOwnerId, setLoadedOwnerId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const ownerId = auth.user?.id || null;
  const savedNames = useMemo(() => {
    return [...new Set((favoritesContext?.favorites || []).map((fav) => fav?.name).filter(Boolean))];
  }, [favoritesContext?.favorites]);
  const savedNamesStorageMode = favoritesContext?.storageMode || 'local';
  const savedNamesSyncError = favoritesContext?.syncError || '';

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
      description="Manage your private TryhardNames account, saved names, and Gaming Passport draft."
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

  async function copySavedName(name) {
    const key = String(name || '').trim();
    if (!key) return;
    const result = await copyTextToClipboard(key, { preventRepeatMs: 320, vibrateMs: 10 });
    if (result.ok) {
      setCopiedName(key);
      setTimeout(() => setCopiedName(''), 1100);
    }
  }

  async function removeSavedName(name) {
    const key = String(name || '').trim();
    if (!key) return;
    await favoritesContext?.removeFavorite?.(key);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      {seo}
      <AccountHeader email={auth.user?.email} savedCount={savedNames.length} onSignOut={auth.signOut} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <main className="space-y-6">
          <GamingPassportDraftSummary />

          <section
            id="passport-editor"
            className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20"
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Private editor</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Shape your draft</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-200">
                  This profile starts private by default. Nothing publishes automatically, and connected provider accounts are future options.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Private draft
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
              <PassportDraftForm
                form={form}
                validation={validation}
                isDraftLoading={isDraftLoading}
                isSaving={isSaving}
                isDirty={isDirty}
                message={message}
                error={error}
                handleSave={handleSave}
                updateForm={updateForm}
              />
              <PrivateDraftPreview form={form} isLoading={isDraftLoading} />
            </div>
          </section>

          <AccountHuntingGuide />
        </main>

        <aside className="space-y-6">
          <SavedNamesPanel
            savedNames={savedNames}
            storageMode={savedNamesStorageMode}
            syncError={savedNamesSyncError}
            copiedName={copiedName}
            copySavedName={copySavedName}
            removeSavedName={removeSavedName}
          />
          <QuickActions savedCount={savedNames.length} />
          <FutureConnections />
        </aside>
      </div>
    </div>
  );
}

function AccountHeader({ email, savedCount, onSignOut }) {
  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Account Dashboard V2</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">Your TryhardNames account</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-900 dark:border-white/10 dark:bg-black/30 dark:text-white">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Signed in
            </span>
            <span>{email}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
              <Star className="h-3.5 w-3.5 fill-amber-400/45" aria-hidden="true" />
              {savedCount} saved
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/gamer-names/pro"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            Browse names
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}

function GamingPassportDraftSummary() {
  return (
    <section className="rounded-lg border border-cyan-300 bg-cyan-50 p-5 text-cyan-800 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Gaming Passport Draft</p>
          <h2 className="mt-1 text-2xl font-semibold">Private until you publish</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6">
            Your Gaming Passport is a private draft by default. Google Auth is Parent Auth. Riot and Discord are future linked providers, not live account integrations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="#passport-editor"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Edit draft
          </a>
          <Link
            to="/gaming-passport"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-cyan-300/60 bg-white/70 px-4 py-2 text-sm font-semibold text-cyan-900 transition hover:bg-white dark:border-cyan-200/30 dark:bg-white/10 dark:text-cyan-50 dark:hover:bg-white/15"
          >
            Learn about Gaming Passport
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PassportDraftForm({
  form,
  validation,
  isDraftLoading,
  isSaving,
  isDirty,
  message,
  error,
  handleSave,
  updateForm,
}) {
  return (
    <form className="space-y-5" onSubmit={handleSave}>
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
  );
}

function SavedNamesPanel({ savedNames, storageMode, syncError, copiedName, copySavedName, removeSavedName }) {
  const isAccountBacked = storageMode === 'account';
  return (
    <section id="saved-names" className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">Favorite-first model</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Saved Names</h2>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {isAccountBacked ? 'Synced to this account.' : 'Saved locally on this device.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <Star className="h-3.5 w-3.5 fill-amber-400/45" aria-hidden="true" />
          {savedNames.length}
        </span>
      </div>

      {syncError && (
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          {syncError}
        </p>
      )}

      {savedNames.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center dark:border-white/15 dark:bg-black/20">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Star names while browsing to keep them here.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {savedNames.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/85 p-2.5 shadow-sm dark:border-white/10 dark:bg-black/20"
            >
              <span className="th-name-card-title th-name-card-title--compact min-w-0 flex-1 text-sm font-semibold text-slate-950 dark:text-white" title={name}>
                {name}
              </span>
              <button
                type="button"
                onClick={() => copySavedName(name)}
                className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copiedName === name ? 'Copied' : 'Copy Name'}
              </button>
              <button
                type="button"
                onClick={() => removeSavedName(name)}
                className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border border-slate-300 px-2.5 text-xs font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-white/15 dark:text-white dark:hover:border-red-400/40 dark:hover:text-red-100"
                aria-label={`Remove ${name}`}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QuickActions({ savedCount }) {
  const actions = [
    { label: 'Browse gamer names', href: '/gamer-names/pro', icon: Gamepad2 },
    { label: 'Browse roblox names', href: '/roblox-names/cool', icon: Compass },
    { label: 'Open gaming passport', href: '/gaming-passport', icon: ShieldCheck },
    { label: savedCount ? 'Continue with saved names' : 'Start with saved names', href: '#saved-names', icon: Star },
  ];

  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Quick Actions</p>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const className = 'inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-black/30 dark:text-white dark:hover:bg-white/10';
          const content = (
            <>
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {action.label}
              </span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </>
          );
          return action.href.startsWith('#') ? (
            <a key={action.label} href={action.href} className={className}>
              {content}
            </a>
          ) : (
            <Link key={action.label} to={action.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AccountHuntingGuide() {
  const steps = [
    'Explore a generator',
    'Copy names you like',
    'Star names you want to keep',
    'Find them again in your account',
    'Shape your private Gaming Passport draft',
    "Publish only when you're ready",
  ];

  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-200">Account Hunting Guide</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">How to use TryhardNames without losing good picks</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200">
        Browse names, copy the ones you want to test, and star the ones worth keeping. Your account keeps those favorites next to your private Gaming Passport draft.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
              {index + 1}
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">{step}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
        Your profile starts private. Nothing is published automatically. Riot and Discord provider linking is planned for a future release and is not live here yet.
      </p>
    </section>
  );
}

function FutureConnections() {
  const providers = [
    { name: 'Riot', status: 'Planned / pending approval', detail: 'Future account signal for players who choose to link it.' },
    { name: 'Discord', status: 'Planned', detail: 'Future community identity connection, not a live OAuth flow.' },
  ];

  return (
    <section className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">Future Connections</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Planned providers</h2>
      <div className="mt-4 space-y-3">
        {providers.map((provider) => (
          <div key={provider.name} className="rounded-lg border border-slate-200 bg-white/85 p-3 dark:border-white/10 dark:bg-black/20">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-950 dark:text-white">{provider.name}</p>
              <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/15 dark:text-slate-200">
                {provider.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{provider.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        No Riot OAuth or Discord OAuth button is exposed in this dashboard.
      </p>
    </section>
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
    <div className={`flex flex-col rounded-lg border ${accentClasses[scene.accent] || accentClasses.cyan} ${densityClass}`}>
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
