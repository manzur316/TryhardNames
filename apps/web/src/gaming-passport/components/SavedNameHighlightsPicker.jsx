import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { MAX_FEATURED_SAVED_NAMES } from '@/gaming-passport/data/passportRepository.js';

export default function SavedNameHighlightsPicker({
  savedNames,
  selectedNames,
  storageMode,
  syncError,
  disabled,
  onChange,
}) {
  const availableNames = useMemo(() => uniqNames(savedNames), [savedNames]);
  const selected = useMemo(() => uniqNames(selectedNames), [selectedNames]);
  const availableKeys = new Set(availableNames.map(nameKey));
  const missingSelected = selected.filter((name) => !availableKeys.has(nameKey(name)));
  const storageLabel = storageMode === 'account'
    ? 'Saved Names are synced to this account.'
    : 'Saved Names are local or fallback state for this device.';

  function toggleName(name) {
    const key = nameKey(name);
    const exists = selected.some((item) => nameKey(item) === key);
    if (exists) {
      onChange(selected.filter((item) => nameKey(item) !== key));
      return;
    }
    if (selected.length >= MAX_FEATURED_SAVED_NAMES) return;
    onChange([...selected, name]);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">
            Private Saved Names highlights
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
            Pick up to {MAX_FEATURED_SAVED_NAMES}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{storageLabel}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <Star className="h-3.5 w-3.5 fill-amber-400/45" aria-hidden="true" />
          {selected.length}/{MAX_FEATURED_SAVED_NAMES}
        </span>
      </div>

      {syncError && (
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          {syncError}
        </p>
      )}

      {availableNames.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center dark:border-white/15 dark:bg-black/20">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Star names while browsing to feature them privately in this draft.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          {availableNames.map((name) => {
            const checked = selected.some((item) => nameKey(item) === nameKey(name));
            const maxed = !checked && selected.length >= MAX_FEATURED_SAVED_NAMES;
            return (
              <label
                key={name}
                className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled || maxed}
                  onChange={() => toggleName(name)}
                  className="h-4 w-4 accent-cyan-500"
                />
                <span className="th-name-card-title th-name-card-title--compact min-w-0 flex-1" title={name}>
                  {name}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {missingSelected.length > 0 && (
        <div className="mt-4 rounded-md border border-slate-300 bg-white/70 p-3 dark:border-white/15 dark:bg-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Not currently in Saved Names
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingSelected.map((name) => (
              <button
                key={name}
                type="button"
                disabled={disabled}
                onClick={() => toggleName(name)}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Remove {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Highlights are stored only in private `scene_config.featuredSavedNames`; selecting them does not publish, verify, or mutate Saved Names.
      </p>
    </section>
  );
}

function uniqNames(names = []) {
  const byKey = new Map();
  for (const item of names || []) {
    const clean = typeof item === 'string' ? item.trim().replace(/\s+/g, ' ') : '';
    const key = nameKey(clean);
    if (clean && key && !byKey.has(key)) byKey.set(key, clean);
  }
  return [...byKey.values()];
}

function nameKey(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}
