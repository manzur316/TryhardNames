import React, { useMemo, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import CopyButton from '@/components/CopyButton.jsx';
import { buildCommunitySignal, buildTrendingModel } from '@/utils/trendingSocialProof.js';
import { trackEvent } from '@/utils/analytics.js';
import { resolveTrendingRerollDisplayName, clipTrendingSeedLabel } from '@/utils/trendingRerollEvolve.js';
import { cn } from '@/lib/utils.js';

function presetPillClass() {
  return 'th-badge-meta border-cyan-400/30 bg-cyan-500/[0.12] text-cyan-200 dark:border-cyan-400/35 dark:text-cyan-200';
}

/**
 * Community trending — isolated reroll state; premium card chrome.
 */
export default function TrendingNamesModule({
  presetId,
  category,
  keyword,
  pageSlug,
  favorites,
  onToggleFavorite,
  title = 'Trending now',
  compact = false,
}) {
  const model = useMemo(() => buildTrendingModel({ presetId, category, pageSlug }), [presetId, category, pageSlug]);

  const items = useMemo(() => {
    const snap = model.popularThisWeek || [];
    return snap.map((x, i) => ({
      name: x.name,
      copyCount: x.copyCount,
      saveCount: x.saveCount,
      signal: i < 3 ? buildCommunitySignal({ presetId, copyCount: x.copyCount, saveCount: x.saveCount }) : null,
    }));
  }, [model.popularThisWeek, presetId]);

  const [localDisplayByIndex, setLocalDisplayByIndex] = useState(() => ({}));

  const handleRerollCard = useCallback(
    (idx, currentDisplay) => {
      const next = resolveTrendingRerollDisplayName(currentDisplay, { category, keyword });
      setLocalDisplayByIndex((prev) => ({ ...prev, [idx]: next }));
      trackEvent('QUICK_MODE_USED', {
        pageSlug: pageSlug || '/',
        mode: 'trending_reroll_local',
        seed: currentDisplay,
        result: next,
        preset: presetId,
        category,
        keyword,
      });
    },
    [category, keyword, pageSlug, presetId]
  );

  if (!items.length) return null;

  return (
    <section className={compact ? '' : 'mt-10'}>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-dark-400">
            Community
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-dark-50 tracking-tight">{title}</h2>
        </div>
        {presetId && (
          <span className={`${presetPillClass()} shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide`}>
            {model.preset?.label || presetId}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.slice(0, compact ? 6 : 9).map((it, idx) => {
          const seeded = clipTrendingSeedLabel(it.name);
          const displayName = localDisplayByIndex[idx] ?? seeded;
          const saved = favorites?.has?.(String(displayName));
          const showSignal = Boolean(it.signal) && idx < 3;

          return (
            <div
              key={`trending-${idx}`}
              className={cn(
                'group relative flex flex-col rounded-2xl overflow-hidden',
                'border border-white/[0.08] dark:border-white/[0.07]',
                'bg-gradient-to-b from-slate-900/[0.03] to-slate-900/[0.06] dark:from-dark-800/80 dark:to-dark-900',
                'shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]',
                'ring-1 ring-inset ring-white/[0.04] dark:ring-white/[0.06]',
                'transition-all duration-300 hover:border-white/[0.11] hover:shadow-[0_26px_56px_-22px_rgba(34,211,238,0.07)] dark:hover:border-cyan-400/12'
              )}
            >
              <div className="relative p-4 sm:p-5 flex flex-col flex-1 min-h-[168px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 pr-1">
                    <p
                      key={`${idx}-${displayName}`}
                      className="text-[15px] sm:text-base font-semibold text-slate-900 dark:text-dark-50 tracking-tight leading-snug line-clamp-3 break-words [overflow-wrap:anywhere]"
                      title={displayName}
                    >
                      {displayName}
                    </p>
                    {showSignal && (
                      <p className="mt-2 text-[11px] font-medium text-slate-600 dark:text-dark-400 leading-relaxed">
                        {it.signal}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleFavorite?.(displayName);
                      trackEvent('FILTER_USED', {
                        pageSlug: pageSlug || '/',
                        filter: 'trending_save',
                        value: saved ? 'unfavorite' : 'favorite',
                        name: displayName,
                      });
                    }}
                    className={cn(
                      'shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition-all duration-200',
                      saved
                        ? 'border-violet-400/40 bg-violet-500/15 text-violet-200 shadow-[0_0_16px_-6px_rgba(139,92,246,0.45)]'
                        : 'border-slate-200/80 bg-white/80 text-slate-400 hover:border-violet-400/35 hover:text-violet-300 dark:border-dark-600 dark:bg-dark-800/80 dark:text-dark-400 dark:hover:border-violet-500/40 dark:hover:text-violet-200'
                    )}
                    aria-label={saved ? 'Unfavorite name' : 'Favorite name'}
                  >
                    ★
                  </button>
                </div>

                <div className="mt-auto pt-5 grid grid-cols-2 gap-2.5">
                  <CopyButton
                    textToCopy={displayName}
                    analytics={{ pageSlug: pageSlug || '/', category, keyword: presetId, source: 'trending_module' }}
                    className="w-full [&_button]:rounded-xl [&_button]:min-h-[44px] [&_button]:text-xs [&_button]:font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRerollCard(idx, displayName)}
                    className={cn(
                      'relative flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2.5',
                      'text-[11px] font-bold uppercase tracking-[0.12em]',
                      'border border-cyan-400/45 bg-gradient-to-b from-cyan-500/20 to-cyan-600/[0.08]',
                      'text-cyan-50 shadow-[0_0_22px_-8px_rgba(34,211,238,0.45)]',
                      'hover:border-cyan-300/70 hover:from-cyan-400/25 hover:shadow-[0_0_28px_-6px_rgba(34,211,238,0.55)]',
                      'active:scale-[0.98] transition-all duration-200',
                      'dark:text-cyan-50 dark:border-cyan-400/50'
                    )}
                    aria-label="Generate another suggestion"
                  >
                    <RefreshCw className="w-3.5 h-3.5 opacity-90" aria-hidden />
                    Reroll
                  </button>
                </div>

                {(it.copyCount >= 3 || it.saveCount >= 3) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {it.copyCount >= 3 && (
                      <span className="th-badge-meta dark:text-dark-300">Copied {it.copyCount}×</span>
                    )}
                    {it.saveCount >= 3 && (
                      <span className="th-badge-meta dark:text-dark-300">Favorited {it.saveCount}×</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
