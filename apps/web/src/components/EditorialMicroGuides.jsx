import React from 'react';
import { Link } from 'react-router-dom';

function toneBadgeClass(tone) {
  const t = String(tone || '');
  if (t === 'cyan') return 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40';
  if (t === 'purple') return 'bg-accent-purple/15 text-accent-purple border-accent-purple/40';
  if (t === 'gold') return 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30';
  if (t === 'pink') return 'bg-pink-500/10 text-pink-200 border-pink-500/30';
  if (t === 'emerald') return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30';
  return 'bg-dark-900 border-dark-700 text-dark-200';
}

/**
 * Presentational component only.
 * Receives pre-built editorial blocks (deterministic selection happens in SEO engine).
 */
export default function EditorialMicroGuides({ blocks, category, keyword, pageSlug, onLinkClick }) {
  if (!blocks?.length) return null;

  return (
    <div className="mb-16">
      <div className="text-center mb-10 space-y-3">
        <p className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase text-dark-400">Micro editorial</p>
        <h2 className="text-2xl sm:text-3xl font-black text-dark-50 tracking-tight">Naming culture notes (keyword-specific)</h2>
        <p className="text-sm text-dark-300/90 max-w-2xl mx-auto leading-relaxed">
          Short, practical notes tuned to this subculture—so pages don’t feel like template variants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {blocks.slice(0, 4).map((b, idx) => (
          <section
            key={`${b.title}-${idx}`}
            className={[
              'bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 transition-colors shadow-refined',
              idx === 0 ? 'hover:border-accent-cyan/35' : 'hover:border-accent-purple/28',
            ].join(' ')}
            aria-label={b.title}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-black tracking-[0.22em] uppercase text-dark-400">
                  {b.eyebrow || 'Editorial'}
                  <span className="ml-2 font-semibold normal-case tracking-normal text-dark-500">
                    {category}/{keyword}
                  </span>
                </p>
                <h3 className="mt-2 text-xl md:text-2xl font-black text-dark-50 tracking-tight text-balance">{b.title}</h3>
              </div>
              {b.tone && (
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${toneBadgeClass(b.tone)}`}>
                  {String(b.tone)}
                </span>
              )}
            </div>

            {Array.isArray(b.bullets) && b.bullets.length > 0 && (
              <ul className="mt-4 space-y-2.5 list-disc pl-5 text-sm md:text-base text-dark-300 leading-relaxed">
                {b.bullets.slice(0, 4).map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            )}

            {Array.isArray(b.links) && b.links.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dark-700 flex flex-wrap gap-2">
                {b.links.slice(0, 3).map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => onLinkClick?.(l)}
                    className="th-chip-quiet border-dark-700 bg-dark-900/80 text-dark-100 hover:border-accent-cyan/40 hover:text-accent-cyan dark:bg-dark-900/60"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}

            {pageSlug && idx === 0 && (
              <p className="mt-4 text-[11px] text-dark-400">
                Built for <span className="text-dark-200 font-bold">{pageSlug}</span> (deterministic, lightweight).
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

