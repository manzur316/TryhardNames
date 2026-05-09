import React from 'react';
import { motion } from 'framer-motion';
import VisualIdentityCard from '@/components/VisualIdentityCard.jsx';
import { rarityVisual } from '@/utils/rarityEngine.js';

export default function IdentityPackDrawer({
  open,
  pack,
  rarity,
  presetId,
  pageSlug = '/',
  heroCardRef,
  heroCardVariant,
  setHeroCardVariant,
  heroPackCopied,
  heroDiscordPackCopied,
  heroImageBusy,
  heroImageCopied,
  heroImageDownloaded,
  onRarityViewed,
  onBadgeClicked,
  onAltPicked,
  onExportPackCopy,
  onExportPackDiscord,
  onExportPackClean,
  onExportDiscordPack,
  onExportCardDownload,
  onExportCardCopy,
  onExportCardShare,
  onApplyVariation,
  onSameVibe,
  onMoreLikeThis,
}) {
  if (!open || !pack) return null;

  const rv = rarityVisual(rarity?.tier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-6 sm:mt-7 max-w-3xl mx-auto"
    >
      <div
        className={`relative rounded-3xl border ${rv.border} ${rv.glow} bg-white/70 dark:bg-dark-900/55 backdrop-blur overflow-hidden`}
        onMouseEnter={() => onRarityViewed?.()}
      >
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r ${rv.accent} opacity-45`} />

        <div className="relative px-4 sm:px-6 py-5 sm:py-4 border-b border-slate-200/70 dark:border-dark-700/70 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">
              Identity pack
            </p>
            <p className="mt-1 text-sm sm:text-base font-black text-slate-900 dark:text-dark-50">
              {pack.name}{' '}
              <span className="text-slate-500 dark:text-dark-400 font-black">{pack.clanTag}</span>
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-dark-300">
              <span className="font-bold text-slate-800 dark:text-dark-100">{pack.vibe}</span>
              {pack.microLabel ? ` • ${pack.microLabel}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {rarity?.tier && (
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${rv.badge}`}>
                  {rarity.tier}
                </span>
              )}
              {rarity?.micro && (
                <span className="text-[11px] font-semibold text-slate-600 dark:text-dark-400">{rarity.micro}</span>
              )}
              {(rarity?.badges || []).slice(0, 1).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onBadgeClicked?.(b)}
                  className="th-chip-quiet text-[10px] font-semibold uppercase tracking-wide"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(pack.symbols || []).map((s) => (
              <span
                key={s}
                className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border border-slate-200/80 bg-white/60 px-2.5 text-sm font-semibold text-slate-800 dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="relative px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">Status / bio</p>
              <p className="mt-2 text-sm sm:text-base text-slate-800 dark:text-dark-100">“{pack.bio}”</p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">Alt versions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(pack.altVersions || []).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => onAltPicked?.(a)}
                    className="th-chip-quiet text-xs font-semibold"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => onExportPackCopy?.()}
              className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-200 ${
                heroPackCopied
                  ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                  : 'bg-gradient-cyan-purple text-white shadow-sm hover:opacity-95'
              }`}
            >
              {heroPackCopied ? 'Copied' : 'Copy pack'}
            </button>
            <button
              type="button"
              onClick={() => onExportPackDiscord?.()}
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-slate-200/90 bg-white/70 text-slate-800 transition-all duration-200 hover:border-accent-purple/35 hover:text-accent-purple dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-50"
            >
              Discord format
            </button>
            <button
              type="button"
              onClick={() => onExportPackClean?.()}
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-slate-200/90 bg-white/70 text-slate-800 transition-all duration-200 hover:border-accent-cyan/40 hover:text-accent-cyan dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-50"
            >
              Clean text
            </button>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => onExportDiscordPack?.()}
              className={`w-full px-4 py-4 rounded-2xl text-sm font-black tracking-widest uppercase border transition-all duration-200 ${
                heroDiscordPackCopied
                  ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
                  : 'bg-white/75 dark:bg-dark-900/40 text-slate-800 dark:text-dark-50 border-slate-200 dark:border-dark-700 hover:border-accent-cyan/50 hover:text-accent-cyan'
              }`}
            >
              {heroDiscordPackCopied ? 'Copied for Discord' : 'Export Discord Pack'}
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-dark-400">One tap → paste into Discord. No settings.</p>
          </div>

          <div className="mt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">
                  Visual share card
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-dark-300 mt-1">
                  Screenshot-ready collectible card for Discord, Stories, and Pinterest.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                {['discord', 'story', 'pinterest'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setHeroCardVariant?.(v)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border transition-colors ${
                      heroCardVariant === v
                        ? 'border-accent-cyan/45 bg-accent-cyan/12 text-accent-cyan'
                        : 'border-slate-200/80 bg-white/65 text-slate-700 hover:border-accent-purple/35 hover:text-accent-purple dark:border-dark-700 dark:bg-dark-900/45 dark:text-dark-200'
                    }`}
                  >
                    {v === 'discord' ? 'Discord Card' : v === 'story' ? 'Story' : 'Pinterest'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="w-full flex justify-center">
                <div className="hover:translate-y-[-1px] transition-transform duration-200">
                  <VisualIdentityCard ref={heroCardRef} pack={pack} rarity={rarity} variant={heroCardVariant} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => onExportCardDownload?.()}
                disabled={heroImageBusy}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide uppercase border transition-all duration-200 ${
                  heroImageDownloaded
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-slate-200/90 bg-white/75 text-slate-800 hover:border-emerald-400/35 hover:text-emerald-700 dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-50 dark:hover:text-emerald-200'
                } ${heroImageBusy ? 'opacity-70' : ''}`}
              >
                {heroImageDownloaded ? 'Downloaded' : 'Download PNG'}
              </button>
              <button
                type="button"
                onClick={() => onExportCardCopy?.()}
                disabled={heroImageBusy}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase bg-gradient-cyan-purple text-white shadow-sm transition-all duration-200 hover:opacity-95 ${
                  heroImageBusy ? 'opacity-70' : ''
                }`}
              >
                {heroImageCopied ? 'Copied image' : 'Copy Image'}
              </button>
              <button
                type="button"
                onClick={() => onExportCardShare?.()}
                disabled={heroImageBusy}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-slate-200/90 bg-white/75 text-slate-800 transition-all duration-200 hover:border-accent-purple/40 hover:text-accent-purple dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-50 ${
                  heroImageBusy ? 'opacity-70' : ''
                }`}
              >
                Share identity
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroCardVariant?.('story');
                  onExportCardDownload?.();
                }}
                disabled={heroImageBusy}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide uppercase border border-slate-200/90 bg-white/75 text-slate-800 transition-colors hover:border-accent-purple/35 hover:text-accent-purple dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-50 ${
                  heroImageBusy ? 'opacity-70' : ''
                }`}
              >
                Export Story
              </button>
            </div>
          </div>

          {pack.availableVariations?.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {pack.availableVariations.includes('more_tactical') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_tactical')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More Tactical
                </button>
              )}
              {pack.availableVariations.includes('more_clean') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_clean')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More Clean
                </button>
              )}
              {pack.availableVariations.includes('more_og') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_og')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More OG
                </button>
              )}
              {pack.availableVariations.includes('more_luxury') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_luxury')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More Luxury
                </button>
              )}
              {pack.availableVariations.includes('more_creator') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_creator')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More Creator
                </button>
              )}
              {pack.availableVariations.includes('more_fantasy') && (
                <button
                  type="button"
                  onClick={() => onApplyVariation?.('more_fantasy')}
                  className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
                >
                  More Fantasy
                </button>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => onSameVibe?.()}
              className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
            >
              Same vibe
            </button>
            <button
              type="button"
              onClick={() => onMoreLikeThis?.()}
              className="th-chip-quiet text-[11px] font-semibold uppercase tracking-wide"
            >
              More like this
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

