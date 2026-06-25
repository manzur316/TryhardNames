import React, { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { trackEvent } from '@/utils/analytics.js';
import { readUnifiedFavoriteNames, writeUnifiedFavoriteNames } from '@/utils/favoritesSoT.js';
import { subscribeFavorites } from '@/utils/localFavoritesBridge.js';

function normalizeName(name) {
  return String(name || '').trim();
}

function isNameSaved(name) {
  const key = normalizeName(name);
  if (!key) return false;
  return readUnifiedFavoriteNames().includes(key);
}

export default function FavoriteStarButton({
  name,
  pageSlug = '/',
  category,
  keyword,
  source = 'name_card',
  className = '',
  showLabel = false,
  compact = false,
  onChange,
}) {
  const key = normalizeName(name);
  const [saved, setSaved] = useState(() => isNameSaved(key));

  const refresh = useCallback(() => {
    setSaved(isNameSaved(key));
  }, [key]);

  useEffect(() => {
    refresh();
    return subscribeFavorites(refresh);
  }, [refresh]);

  const toggleFavorite = () => {
    if (!key) return;
    const current = readUnifiedFavoriteNames();
    const exists = current.includes(key);
    const next = exists ? current.filter((item) => item !== key) : [key, ...current];

    writeUnifiedFavoriteNames(next);
    setSaved(!exists);
    onChange?.(!exists);
    trackEvent(exists ? 'REMOVE_FAVORITE' : 'SAVE_FAVORITE', {
      pageSlug,
      category,
      keyword,
      name: key,
      source,
    });
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={!key}
      className={cn(
        'inline-flex shrink-0 items-center justify-center border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        showLabel ? 'gap-2 rounded-lg px-3 text-xs' : 'rounded-lg',
        compact ? 'min-h-9 min-w-9' : 'min-h-10 min-w-10',
        saved
          ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-400/45 dark:bg-amber-500/15 dark:text-amber-100'
          : 'border-slate-200 bg-white/90 text-slate-500 hover:border-amber-300 hover:text-amber-700 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-300 dark:hover:border-amber-400/40 dark:hover:text-amber-100',
        className
      )}
      aria-pressed={saved}
      aria-label={saved ? `Unfavorite ${key}` : `Favorite ${key}`}
      title={saved ? 'Remove favorite' : 'Favorite this name'}
    >
      <Star className={cn('h-4 w-4', saved ? 'fill-amber-400/45' : '')} strokeWidth={2.3} aria-hidden="true" />
      {showLabel && <span>{saved ? 'Favorited' : 'Favorite'}</span>}
    </button>
  );
}
