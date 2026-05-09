import React from 'react';
import TrendingNamesModule from '@/components/TrendingNamesModule.jsx';

/** Thin wrapper — trending reroll is owned inside TrendingNamesModule (no grid coupling). */
export default function TrendingIdentitySection({
  presetId,
  category,
  keyword,
  pageSlug = '/',
  favorites,
  onToggleFavorite,
  title = 'Trending names right now',
  compact = true,
}) {
  return (
    <section className="container mx-auto max-w-6xl px-4 pb-6 sm:pb-10">
      <TrendingNamesModule
        presetId={presetId}
        category={category}
        keyword={keyword}
        pageSlug={pageSlug}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        title={title}
        compact={compact}
      />
    </section>
  );
}
