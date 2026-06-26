import React from 'react';
import { Check, Lock } from 'lucide-react';
import {
  COSMETIC_CATEGORIES,
  COSMETIC_STATUSES,
  COSMETIC_TYPES,
  MAX_EQUIPPED_BADGES,
  getCosmeticById,
  listCosmeticsByCategory,
  sanitizeCosmeticLoadout,
} from '@/gaming-passport/cosmetics/index.js';

const CATEGORY_SECTIONS = Object.freeze([
  { id: COSMETIC_CATEGORIES.CORE, label: 'Core' },
  { id: COSMETIC_CATEGORIES.FREE, label: 'Free' },
  { id: COSMETIC_CATEGORIES.EARNED, label: 'Earned' },
  { id: COSMETIC_CATEGORIES.PREMIUM_PREVIEW, label: 'Premium preview' },
  { id: COSMETIC_CATEGORIES.FOUNDER, label: 'Founder reserved' },
  { id: COSMETIC_CATEGORIES.LEGACY, label: 'Legacy reserved' },
]);

export default function CosmeticPicker({ loadout, unlockHints = {}, disabled = false, onChange }) {
  const safeLoadout = sanitizeCosmeticLoadout(loadout);

  function applyCosmetic(cosmetic) {
    if (disabled || !isUnlocked(cosmetic, unlockHints)) return;

    if (cosmetic.type === COSMETIC_TYPES.THEME) {
      onChange?.(sanitizeCosmeticLoadout({ ...safeLoadout, themeId: cosmetic.id }));
      return;
    }

    const current = safeLoadout.equippedCosmeticIds
      .map((id) => getCosmeticById(id))
      .filter(Boolean);

    let next = current.filter((item) => item.id !== cosmetic.id);
    const isAlreadySelected = current.some((item) => item.id === cosmetic.id);

    if (!isAlreadySelected) {
      if (cosmetic.type === COSMETIC_TYPES.BADGE) {
        const badges = next.filter((item) => item.type === COSMETIC_TYPES.BADGE);
        if (badges.length >= MAX_EQUIPPED_BADGES) return;
        next = [...next, cosmetic];
      } else {
        next = [
          ...next.filter((item) => item.type !== cosmetic.type),
          cosmetic,
        ];
      }
    }

    onChange?.(sanitizeCosmeticLoadout({
      ...safeLoadout,
      equippedCosmeticIds: next.map((item) => item.id),
    }));
  }

  return (
    <div className="space-y-5">
      {CATEGORY_SECTIONS.map((section) => {
        const items = listCosmeticsByCategory(section.id);
        if (!items.length) return null;

        return (
          <section key={section.id}>
            <h4 className="text-sm font-semibold text-slate-950 dark:text-white">{section.label}</h4>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {items.map((item) => {
                const selected = isSelected(item, safeLoadout);
                const unlocked = isUnlocked(item, unlockHints);
                const reserved = item.status === COSMETIC_STATUSES.RESERVED;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={disabled || !unlocked}
                    onClick={() => applyCosmetic(item)}
                    className={`min-h-24 rounded-lg border p-3 text-left transition ${
                      selected
                        ? 'border-cyan-400 bg-cyan-50 text-cyan-950 dark:border-cyan-300/50 dark:bg-cyan-300/10 dark:text-cyan-50'
                        : 'border-slate-200 bg-white/85 text-slate-800 hover:border-cyan-300 dark:border-white/10 dark:bg-black/20 dark:text-slate-100 dark:hover:border-cyan-300/40'
                    } disabled:cursor-not-allowed disabled:opacity-55`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span>
                        <span className="block text-sm font-semibold">{item.name}</span>
                        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                          {reserved ? 'Reserved / coming later' : toLabel(item.availability)}
                        </span>
                      </span>
                      {selected ? (
                        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      ) : !unlocked ? (
                        <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                      ) : null}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </span>
                    {!reserved && !unlocked && (
                      <span className="mt-2 block text-xs font-medium text-amber-700 dark:text-amber-100">
                        Unlock hint: {toLabel(item.unlockSource)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function isSelected(cosmetic, loadout) {
  if (cosmetic.type === COSMETIC_TYPES.THEME) return loadout.themeId === cosmetic.id;
  return loadout.equippedCosmeticIds.includes(cosmetic.id);
}

function isUnlocked(cosmetic, unlockHints) {
  if (cosmetic.status !== COSMETIC_STATUSES.ACTIVE) return false;
  if (['free_core', 'free_foundation_preview'].includes(cosmetic.availability)) return true;
  if (cosmetic.availability === 'earned_ready') return Boolean(unlockHints[cosmetic.unlockSource]);
  return false;
}

function toLabel(value) {
  return String(value || '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
