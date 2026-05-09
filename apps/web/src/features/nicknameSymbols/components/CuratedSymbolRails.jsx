import React, { useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { CURATED_GLYPHS } from '../utils/symbolCatalog.js';
import { SYMBOL_DISCOVERY_RAILS } from '../data/symbolDiscovery.js';

const glyphById = Object.fromEntries(CURATED_GLYPHS.map((g) => [g.id, g]));

/**
 * Editorial symbol rails — appears before the full explorer.
 */
export const CuratedSymbolRails = ({
  combos = [],
  onCopy,
  copiedId,
  isDarkMode
}) => {
  const muted = isDarkMode ? 'text-dark-500' : 'text-slate-500';
  const card = isDarkMode ? 'bg-dark-900/80 border-dark-700' : 'bg-white border-slate-200';

  const comboById = useMemo(() => Object.fromEntries(combos.map((c) => [c.id, c])), [combos]);

  const rails = useMemo(() => {
    return SYMBOL_DISCOVERY_RAILS.map((rail) => {
      const items = rail.items
        .map((ref) => {
          if (ref.kind === 'glyph') {
            const g = glyphById[ref.id];
            if (!g) return null;
            return {
              key: `g-${ref.id}`,
              label: g.label,
              display: g.char,
              copyText: g.char,
              kind: 'glyph'
            };
          }
          const c = comboById[ref.id];
          if (!c) return null;
          return {
            key: `c-${ref.id}`,
            label: c.name,
            display: c.preview,
            copyText: c.copyText,
            kind: 'combo'
          };
        })
        .filter(Boolean);
      return { ...rail, items };
    }).filter((r) => r.items.length > 0);
  }, [comboById]);

  if (rails.length === 0) return null;

  return (
    <section className="space-y-8 mb-10" aria-labelledby="symbol-curated-heading">
      <div>
        <h2
          id="symbol-curated-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-dark-500 mb-1"
        >
          Curated picks
        </h2>
        <p className={`text-sm ${muted} max-w-2xl`}>
          Hand-picked wrappers and marks — same library below, faster orientation.
        </p>
      </div>

      {rails.map((rail) => (
        <div key={rail.id} className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-dark-50">{rail.title}</h3>
            <p className={`text-xs mt-0.5 ${muted}`}>{rail.subtitle}</p>
          </div>

          <div
            className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1"
            role="list"
            aria-label={rail.title}
          >
            {rail.items.map((item) => {
              const copyKey = `curated-${item.key}`;
              const isCopied = copiedId === copyKey;
              const isGlyph = item.kind === 'glyph';

              return (
                <button
                  key={item.key}
                  type="button"
                  role="listitem"
                  onClick={() => onCopy(item.copyText, copyKey)}
                  title="Copy"
                  className={`snap-start shrink-0 rounded-xl border p-3 text-left transition-colors active:scale-[0.99] flex flex-col justify-between gap-2 ${card} ${
                    isGlyph ? 'w-[min(5.5rem,18vw)] min-h-[88px] items-center text-center' : 'w-[min(11rem,72vw)] min-h-[88px]'
                  } ${isCopied ? 'ring-2 ring-green-500/45 border-green-500/40' : 'hover:border-accent-purple/45'}`}
                >
                  <span className={`text-[10px] font-semibold uppercase tracking-wide line-clamp-2 ${muted}`}>
                    {item.label}
                  </span>
                  <span
                    className={`font-medium text-slate-900 dark:text-dark-50 ${
                      isGlyph ? 'text-2xl leading-none select-none' : 'text-sm break-all line-clamp-3 leading-snug'
                    }`}
                  >
                    {item.display}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-accent-purple font-medium mt-auto">
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" aria-hidden /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 opacity-70" aria-hidden /> Copy
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
