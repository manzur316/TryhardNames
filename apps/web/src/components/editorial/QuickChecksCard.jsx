import React from 'react';

export default function QuickChecksCard({ title, eyebrow, bullets, links, onLinkClick }) {
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 shadow-refined">
      {eyebrow && <p className="text-[11px] font-black tracking-widest uppercase text-accent-cyan/80">{eyebrow}</p>}
      <h3 className="text-lg font-black text-dark-50 mt-2">{title}</h3>
      {bullets?.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-dark-300">
          {bullets.map((b, idx) => (
            <li key={idx} className="leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}
      {links?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => onLinkClick?.(l)}
              className="px-3 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-dark-900 border border-dark-700 text-dark-100 hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors"
            >
              {l.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

