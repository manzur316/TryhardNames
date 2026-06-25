import React from 'react';
import { CopyButton } from './CopyButton.jsx';
import { TrendingUp } from 'lucide-react';

export const TrendingNames = ({ title = "Trending Now", names = [], startIndex = 0, maxItems = 6 }) => {
  const validNames = [...new Set((names || []).filter(n => n && n.trim() !== ''))];
  const displayNames = validNames.slice(startIndex, startIndex + maxItems);
  
  if (displayNames.length === 0) return null;
  
  return (
    <div className="th-feature-trending-panel">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-dark-50">
        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        {title}
      </h3>
      <div className="th-feature-card-list">
        {displayNames.map((name, idx) => (
          <div 
            key={idx} 
            className="th-feature-name-card group min-h-[140px]"
          >
            <span
              className="th-name-card-title th-feature-name-title"
              title={name}
            >
              {name}
            </span>
            <span className="mt-2 block text-[11px] font-medium tracking-wide text-slate-500 dark:text-dark-400/90">
              Trending pick
            </span>
            <div className="th-feature-card-actions">
              <CopyButton
                text={name}
                variant="card"
                className="shadow-[0_10px_24px_-18px_rgba(109,40,217,0.62)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
