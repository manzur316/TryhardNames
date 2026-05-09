import React, { useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { textStyles } from '@/utils/textStyleConverter.js';
import { STYLISH_DISCOVERY_RAILS } from '../data/stylishDiscovery.js';

/**
 * Compact horizontal rails — editorial “best picks” before the full catalog.
 */
export const CuratedStyleRails = ({
  inputText,
  generateStylishText,
  onCopy,
  copiedId,
  isDarkMode
}) => {
  const sample = inputText?.trim() || 'Stylish Text';
  const muted = isDarkMode ? 'text-dark-500' : 'text-slate-500';
  const card = isDarkMode ? 'bg-dark-900/80 border-dark-700' : 'bg-white border-slate-200';

  const rails = useMemo(() => {
    return STYLISH_DISCOVERY_RAILS.map((rail) => {
      const items = rail.styleIds
        .map((styleId) => {
          const def = textStyles[styleId];
          if (!def) return null;
          const out = generateStylishText(sample, def.transform);
          if (!out.success) return null;
          return {
            styleId,
            name: def.name,
            text: out.text,
            copyKey: `curated-${rail.id}-${styleId}`
          };
        })
        .filter(Boolean);
      return { ...rail, items };
    }).filter((r) => r.items.length > 0);
  }, [sample, generateStylishText]);

  if (rails.length === 0) return null;

  return (
    <section className="space-y-8" aria-labelledby="stylish-curated-heading">
      <div className="border-t border-slate-200 dark:border-dark-800 pt-6">
        <h2
          id="stylish-curated-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-dark-500 mb-1"
        >
          Curated picks
        </h2>
        <p className={`text-sm ${muted} max-w-2xl`}>
          A short guided set — scroll sideways on mobile. The full library stays below.
        </p>
      </div>

      {rails.map((rail) => (
        <div key={rail.id} className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-dark-50">{rail.title}</h3>
            <p className={`text-xs mt-0.5 ${muted}`}>{rail.subtitle}</p>
          </div>

          <div
            className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin -mx-1 px-1"
            role="list"
            aria-label={rail.title}
          >
            {rail.items.map((item) => {
              const isCopied = copiedId === item.copyKey;
              return (
                <button
                  key={item.copyKey}
                  type="button"
                  role="listitem"
                  onClick={() => onCopy(item.text, item.copyKey)}
                  title="Copy"
                  className={`snap-start shrink-0 w-[min(11rem,72vw)] rounded-xl border p-3 text-left transition-colors active:scale-[0.99] min-h-[88px] flex flex-col justify-between gap-2 ${card} ${
                    isCopied ? 'ring-2 ring-green-500/45 border-green-500/40' : 'hover:border-accent-cyan/45'
                  }`}
                >
                  <span className={`text-[10px] font-semibold uppercase tracking-wide truncate ${muted}`}>
                    {item.name}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-dark-50 break-all line-clamp-3 leading-snug">
                    {item.text}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-accent-cyan font-medium">
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" aria-hidden /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 opacity-70" aria-hidden /> Tap to copy
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};
