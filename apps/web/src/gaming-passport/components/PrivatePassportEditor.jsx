import React from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import {
  DEFAULT_SCENE_CONFIG,
  SCENE_CONFIG_OPTIONS,
  sanitizeFeaturedSavedNames,
} from '@/gaming-passport/data/passportRepository.js';
import { sanitizeCosmeticLoadout } from '@/gaming-passport/cosmetics/index.js';
import PassportCompletionChecklist from './PassportCompletionChecklist.jsx';
import PassportCosmeticsPanel from './PassportCosmeticsPanel.jsx';
import PrivatePassportPreview from './PrivatePassportPreview.jsx';
import SavedNameHighlightsPicker from './SavedNameHighlightsPicker.jsx';

export default function PrivatePassportEditor({
  passport,
  form,
  validation,
  isDraftLoading,
  isSaving,
  isDirty,
  message,
  error,
  handleSave,
  updateForm,
  savedNames,
  savedNamesStorageMode,
  savedNamesSyncError,
}) {
  const sceneConfig = normalizeSceneForEditor(form.sceneConfig);
  const isBlocked = !validation.ok;

  function updateScene(patch) {
    updateForm({
      sceneConfig: normalizeSceneForEditor({
        ...sceneConfig,
        ...patch,
      }),
    });
  }

  return (
    <section
      id="passport-editor"
      className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Private editor V2</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Shape your private draft</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            This Gaming Passport editor is owner-only. It saves presentation fields, private Saved Names highlights, and visual settings without publishing a profile.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Private draft
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
        <form className="space-y-5" onSubmit={handleSave}>
          <EditorSaveState
            isDraftLoading={isDraftLoading}
            isSaving={isSaving}
            isDirty={isDirty}
            isBlocked={isBlocked}
            message={message}
          />

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

          <SceneConfigControls sceneConfig={sceneConfig} updateScene={updateScene} disabled={isDraftLoading || isSaving} />

          <PassportCosmeticsPanel
            sceneConfig={sceneConfig}
            passport={{
              ...passport,
              alias: form.alias,
              bioShort: form.bioShort,
            }}
            savedNames={savedNames}
            disabled={isDraftLoading || isSaving}
            onChange={(next) => updateScene(next)}
          />

          <SavedNameHighlightsPicker
            savedNames={savedNames}
            selectedNames={sceneConfig.featuredSavedNames}
            storageMode={savedNamesStorageMode}
            syncError={savedNamesSyncError}
            disabled={isDraftLoading || isSaving}
            onChange={(next) => updateScene({ featuredSavedNames: sanitizeFeaturedSavedNames(next) })}
          />

          {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">{error}</p>}
          {isBlocked && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">Fix validation issues before saving this private draft.</p>}
          {isDirty && !message && !isBlocked && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">Unsaved draft changes.</p>}
          {message && <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">{message}</p>}

          <button
            type="submit"
            disabled={isSaving || isDraftLoading || isBlocked}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {isSaving ? 'Saving...' : 'Save private draft'}
          </button>
        </form>

        <div className="space-y-5">
          <PrivatePassportPreview form={{ ...form, sceneConfig }} isLoading={isDraftLoading} />
          <PassportCompletionChecklist
            form={{ ...form, sceneConfig }}
            validation={validation}
            isDirty={isDirty}
            isSaving={isSaving}
            isDraftLoading={isDraftLoading}
          />
        </div>
      </div>
    </section>
  );
}

function EditorSaveState({ isDraftLoading, isSaving, isDirty, isBlocked, message }) {
  let label = 'Saved';
  if (isDraftLoading) label = 'Loading draft';
  else if (isSaving) label = 'Saving';
  else if (isBlocked) label = 'Validation blocked';
  else if (isDirty) label = 'Unsaved changes';
  else if (message) label = message;

  return (
    <div role="status" className="rounded-lg border border-slate-200 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-200">
      {label}
    </div>
  );
}

function SceneConfigControls({ sceneConfig, updateScene, disabled }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-3">
      <legend className="sr-only">Visual configuration</legend>
      <SelectControl
        id="scene-layout"
        label="Layout"
        value={sceneConfig.layout}
        options={SCENE_CONFIG_OPTIONS.layout}
        onChange={(value) => updateScene({ layout: value })}
        disabled={disabled}
      />
      <SelectControl
        id="scene-accent"
        label="Accent"
        value={sceneConfig.accent}
        options={SCENE_CONFIG_OPTIONS.accent}
        onChange={(value) => updateScene({ accent: value })}
        disabled={disabled}
      />
      <SelectControl
        id="scene-density"
        label="Density"
        value={sceneConfig.density}
        options={SCENE_CONFIG_OPTIONS.density}
        onChange={(value) => updateScene({ density: value })}
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

function normalizeSceneForEditor(sceneConfig = {}) {
  const cosmeticLoadout = sanitizeCosmeticLoadout(sceneConfig);
  return {
    layout: sceneConfig.layout || DEFAULT_SCENE_CONFIG.layout,
    accent: sceneConfig.accent || DEFAULT_SCENE_CONFIG.accent,
    density: sceneConfig.density || DEFAULT_SCENE_CONFIG.density,
    themeId: cosmeticLoadout.themeId,
    equippedCosmeticIds: cosmeticLoadout.equippedCosmeticIds,
    featuredSavedNames: sanitizeFeaturedSavedNames(sceneConfig.featuredSavedNames),
  };
}

function toLabel(value) {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
