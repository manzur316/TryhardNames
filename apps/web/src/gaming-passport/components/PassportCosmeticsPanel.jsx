import React, { useMemo } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import {
  getCosmeticPresentationTokens,
  getEarnedCosmeticUnlockHints,
  sanitizeCosmeticLoadout,
} from '@/gaming-passport/cosmetics/index.js';
import CosmeticLoadoutPreview from './CosmeticLoadoutPreview.jsx';
import CosmeticPicker from './CosmeticPicker.jsx';

const OBSIDIAN_PULSE_LOADOUT = Object.freeze({
  themeId: 'theme.obsidian-pulse',
  equippedCosmeticIds: Object.freeze([
    'border.pulse-frame',
    'background.obsidian-aura',
    'nameplate.pulse-nameplate',
    'effect.soft-glow',
    'badge.starter',
  ]),
});

export default function PassportCosmeticsPanel({
  sceneConfig,
  passport,
  savedNames,
  disabled = false,
  onChange,
}) {
  const loadout = sanitizeCosmeticLoadout(sceneConfig);
  const unlockHints = useMemo(() => (
    getEarnedCosmeticUnlockHints({
      ...passport,
      alias: passport?.alias || '',
      bioShort: passport?.bioShort || '',
    }, savedNames)
  ), [passport, savedNames]);
  const tokens = getCosmeticPresentationTokens(loadout);

  function updateLoadout(nextLoadout) {
    const safe = sanitizeCosmeticLoadout(nextLoadout);
    onChange?.({
      ...sceneConfig,
      ...safe,
    });
  }

  function equipObsidianPulse() {
    updateLoadout(OBSIDIAN_PULSE_LOADOUT);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-200">
            Passport Cosmetics
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Visual-only identity cosmetics</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            Style your private draft with TryhardNames-owned cosmetics. Cosmetics can style identity; cosmetics cannot manufacture proof.
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={equipObsidianPulse}
          className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-white/10 dark:disabled:text-slate-400"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Equip Obsidian Pulse preview
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {['Foundation preview', 'Visual-only', 'No fake proofs', 'No rank boosts', 'No Riot assets'].map((label) => (
          <span
            key={label}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
        <CosmeticPicker
          loadout={loadout}
          unlockHints={unlockHints}
          disabled={disabled}
          onChange={updateLoadout}
        />
        <div className="space-y-3">
          <CosmeticLoadoutPreview loadout={loadout} />
          <div className={`${tokens.shellClassName} p-3 text-xs leading-5`}>
            <p className={tokens.bodyClassName}>
              Founder and Legacy categories are reserved. Future `/cosmetics` showcase work is documentation-only in PR21.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
