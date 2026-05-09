import React from 'react';
import { Link } from 'react-router-dom';
import LiveActivityStrip from '@/components/LiveActivityStrip.jsx';

export default function CommunitySignalsStrip({ presetId, pageSlug = '/', trendingStyles = [], onInternalLinkClick }) {
  return (
    <>
      <div className="pt-5 sm:pt-6 flex justify-center">
        <LiveActivityStrip presetId={presetId} pageSlug={pageSlug} />
      </div>

      {Array.isArray(trendingStyles) && trendingStyles.length > 0 && (
        <nav aria-label="Trending styles" className="pt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {trendingStyles.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                onClick={() => onInternalLinkClick?.(s)}
                className="px-3 py-2 rounded-full text-sm font-semibold bg-white/70 dark:bg-dark-900/60 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-dark-200 hover:border-accent-purple/50 hover:text-accent-purple transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

