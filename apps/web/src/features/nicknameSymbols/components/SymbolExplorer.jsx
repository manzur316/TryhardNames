import React from 'react';
import { Copy, Check } from 'lucide-react';
import { SYMBOL_CATEGORIES } from '../utils/symbolCatalog.js';

/**
 * Symbol categories, glyph grid, and framed nickname combos. Preview tag lives in PreviewTagStrip (page top).
 */
export const SymbolExplorer = ({
  glyphs = [],
  combos = [],
  activeCategory,
  onCategoryChange,
  copiedId,
  onCopy,
  isDarkMode
}) => {
  const showGlyphSection = activeCategory !== 'Combos';
  const muted = isDarkMode ? 'text-dark-400' : 'text-slate-500';
  const card = isDarkMode ? 'bg-dark-900 border-dark-700' : 'bg-white border-slate-200';
  const chipOff = isDarkMode
    ? 'border-dark-600 text-dark-300 hover:bg-dark-800'
    : 'border-slate-200 text-slate-600 hover:bg-slate-50';

  return (
    <div className="space-y-8">
      {/* Category navigation — exploration first */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Symbol categories">
        {SYMBOL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] active:scale-[0.98] ${
              activeCategory === cat
                ? 'bg-accent-purple text-white ring-1 ring-accent-purple/40'
                : `bg-transparent border ${chipOff}`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dense glyph grid — instant payoff */}
      {showGlyphSection && (
        <section aria-labelledby="glyph-heading">
          <div className="flex items-end justify-between gap-4 mb-3">
            <div>
              <h2 id="glyph-heading" className="text-lg font-bold text-slate-900 dark:text-dark-50">
                Tap to copy
              </h2>
              <p className={`text-sm mt-1 ${muted}`}>
                Single symbols — paste into any tag, bio, or clan field.
              </p>
            </div>
            <span className={`text-xs tabular-nums shrink-0 ${muted}`}>{glyphs.length} shown</span>
          </div>

          <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {glyphs.map((g) => {
              const isCopied = copiedId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onCopy(g.char, g.id)}
                  title={`Copy ${g.char}`}
                  aria-label={`Copy symbol ${g.char}, ${g.label}`}
                  className={`group relative flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-xl border transition-colors active:scale-[0.97] ${card} ${
                    isCopied ? 'border-green-500/60 bg-green-500/10' : 'hover:border-accent-purple/50'
                  }`}
                >
                  <span className="text-2xl sm:text-[26px] leading-none select-none">{g.char}</span>
                  <span className={`text-[9px] uppercase tracking-wide truncate max-w-[92%] ${muted}`}>
                    {g.label}
                  </span>
                  {isCopied && (
                    <span className="absolute top-1 right-1 text-green-500">
                      <Check className="w-3.5 h-3.5" aria-hidden />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Framed layouts — shared nicknameSymbols patterns */}
      <section
        className={`rounded-2xl border p-4 sm:p-5 ${card}`}
        aria-labelledby="combo-heading"
      >
        <h2 id="combo-heading" className="text-lg font-bold text-slate-900 dark:text-dark-50 mb-1">
          Framed nicknames
        </h2>
        <p className={`text-sm mb-5 ${muted}`}>
          One tap copies the full decorated tag — ready for Discord, Roblox, or clan tags.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {combos.map((row) => {
            const isCopied = copiedId === row.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => onCopy(row.copyText, row.id)}
                title="Copy framed nickname"
                aria-label={`Copy ${row.name}: ${row.preview}`}
                className={`text-left rounded-xl border p-4 transition-colors active:scale-[0.99] min-h-[88px] flex flex-col gap-2 ${
                  isDarkMode ? 'bg-dark-950/50 border-dark-700 hover:border-accent-purple/40' : 'bg-slate-50/80 border-slate-200 hover:border-accent-purple/35'
                } ${isCopied ? 'ring-2 ring-green-500/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>{row.name}</span>
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" aria-hidden />
                  ) : (
                    <Copy className={`w-4 h-4 shrink-0 opacity-35 ${muted}`} aria-hidden />
                  )}
                </div>
                <span className="text-base sm:text-lg font-medium text-slate-900 dark:text-dark-50 break-all leading-snug">
                  {row.preview}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
