import React from 'react';
import VisualIdentityCard from '@/components/VisualIdentityCard.jsx';

export default function FeaturedIdentitySection({ featured, featuredCardRef, onDownload, onCopyImage, onUseIdentity }) {
  if (!featured?.pack) return null;

  return (
    <section className="container mx-auto max-w-6xl px-4 pb-6 sm:pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">
              Featured today
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-dark-50 tracking-tight">
              Featured identity
            </h2>
          </div>
          <span className="px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-white/70 dark:bg-dark-900/40 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-dark-200">
            {featured.preset?.label}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex justify-center lg:justify-start lg:flex-1">
            <VisualIdentityCard
              ref={featuredCardRef}
              pack={featured.pack}
              rarity={featured.rarity}
              variant="discord"
              featured
            />
          </div>

          <div className="lg:w-[320px] bg-white/70 dark:bg-dark-900/55 backdrop-blur border border-slate-200 dark:border-dark-700 rounded-3xl p-4 sm:p-5 shadow-sm">
            <p className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase text-slate-500 dark:text-dark-400">
              Featured card
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-dark-200">
              Screenshot-ready card with premium frame.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onDownload}
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase bg-gradient-cyan-purple text-white hover:opacity-95 transition-all duration-200"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={onCopyImage}
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase bg-slate-900/90 dark:bg-dark-800 border border-slate-200/20 dark:border-dark-700 text-white hover:border-accent-cyan/50 hover:text-accent-cyan transition-all duration-200"
              >
                Copy Image
              </button>
              <button
                type="button"
                onClick={onUseIdentity}
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-black tracking-widest uppercase bg-white/75 dark:bg-dark-900/40 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-dark-50 hover:border-accent-purple/50 hover:text-accent-purple transition-colors"
              >
                Use this identity
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

