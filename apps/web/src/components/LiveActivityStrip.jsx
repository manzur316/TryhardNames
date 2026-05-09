import React, { useEffect, useMemo, useState } from 'react';
import { buildTrendingModel } from '@/utils/trendingSocialProof.js';

export default function LiveActivityStrip({ presetId, category, pageSlug, className = '' }) {
  const model = useMemo(() => buildTrendingModel({ presetId, category, pageSlug }), [presetId, category, pageSlug]);
  const lines = model.activityLines || [];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!lines.length) return;
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setFade(true);
      setTimeout(() => {
        if (!mounted) return;
        setIdx((v) => (v + 1) % lines.length);
        setFade(false);
      }, 180);
    }, 5200);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lines.length]);

  if (!lines.length) return null;

  return (
    <div className={className}>
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-2xl border border-slate-200/80 dark:border-dark-700 bg-white/65 dark:bg-dark-900/55 backdrop-blur shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan/25 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan/90" />
          </span>
          <p
            className={`text-xs sm:text-sm font-bold text-slate-700 dark:text-dark-200 transition-opacity duration-200 ${
              fade ? 'opacity-20' : 'opacity-100'
            }`}
          >
            {lines[idx]}
          </p>
        </div>
      </div>
    </div>
  );
}

