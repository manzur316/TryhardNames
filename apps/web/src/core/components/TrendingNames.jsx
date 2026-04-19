import React from 'react';
import { CopyButton } from './CopyButton.jsx';
import { TrendingUp } from 'lucide-react';

export const TrendingNames = ({ title = "Trending Now", names = [], startIndex = 0, maxItems = 6 }) => {
  const validNames = [...new Set((names || []).filter(n => n && n.trim() !== ''))];
  const displayNames = validNames.slice(startIndex, startIndex + maxItems);
  
  if (displayNames.length === 0) return null;
  
  return (
    <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/50 shadow-sm">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-dark-50">
        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayNames.map((name, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm rounded-xl border border-white/40 dark:border-dark-700/50 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600/50 transition-all duration-200 group"
          >
            <span className="font-bold text-slate-800 dark:text-dark-100 text-lg truncate mr-2">{name}</span>
            <CopyButton 
              text={name} 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 min-h-[40px] min-w-[40px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};