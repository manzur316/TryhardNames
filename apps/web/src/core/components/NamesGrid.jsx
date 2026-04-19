import React from 'react';
import { CopyButton } from './CopyButton.jsx';
import { CopyAllButton } from './CopyAllButton.jsx';

export const NamesGrid = ({ title, names = [] }) => {
  const validNames = (names || []).filter(n => n && n.trim() !== '');
  
  if (validNames.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {title && <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-50">{title}</h2>}
        <CopyAllButton texts={validNames} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {validNames.map((name, idx) => (
          <div 
            key={`${name}-${idx}`} 
            className="flex items-center justify-between p-3 bg-slate-100 dark:bg-dark-800 rounded-xl border border-slate-200 dark:border-dark-700 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-md transition-all duration-200 group"
          >
            <span className="font-medium text-slate-900 dark:text-dark-50 truncate mr-2 text-lg">{name}</span>
            <CopyButton 
              text={name} 
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};