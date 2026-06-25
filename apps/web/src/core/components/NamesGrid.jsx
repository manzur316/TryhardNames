import React from 'react';
import { CopyButton } from './CopyButton.jsx';
import { CopyAllButton } from './CopyAllButton.jsx';
import FavoriteStarButton from '@/components/FavoriteStarButton.jsx';

export const NamesGrid = ({ title, names = [], gridId }) => {
  const validNames = (names || []).filter(n => n && n.trim() !== '');
  
  if (validNames.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {title && <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-50">{title}</h2>}
        <CopyAllButton texts={validNames} />
      </div>
      
      <div id={gridId} className="th-feature-card-list">
        {validNames.map((name, idx) => (
          <div 
            key={`${name}-${idx}`} 
            className="th-feature-name-card group"
          >
            <span
              className="th-name-card-title th-feature-name-title"
              title={name}
            >
              {name}
            </span>
            <span className="mt-2 block text-[11px] font-medium tracking-wide text-slate-500 dark:text-dark-400/90">
              {String(name).length} chars
            </span>
            <div className="th-feature-card-actions">
              <CopyButton
                text={name}
                variant="card"
                className="shadow-[0_10px_24px_-18px_rgba(109,40,217,0.62)]"
              />
              <FavoriteStarButton
                name={name}
                source="feature_name_card"
                compact
                className="shadow-[0_10px_24px_-18px_rgba(245,158,11,0.45)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
