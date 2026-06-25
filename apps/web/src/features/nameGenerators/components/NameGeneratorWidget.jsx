import React from 'react';
import { NamesGrid, GenerateButton } from '@/core/components/index.js';

export const NameGeneratorWidget = ({ 
  type, 
  category, 
  onGenerate, 
  generatedNames = [], 
  isGenerating, 
  error, 
  title, 
  defaultCount = 12,
  buttonLabel,
  onNamesGenerated
}) => {
  const validGenerated = (generatedNames || []).filter((n) => n && String(n).trim() !== '');
  /** Never show an empty-state message while we have cards from this generator. */
  const showEmptyMessage = Boolean(error) && validGenerated.length === 0 && !isGenerating;

  const handleGenerate = async () => {
    if (onGenerate) {
      const names = await onGenerate(defaultCount);
      if (onNamesGenerated && names) {
        onNamesGenerated(names);
      }
    }
  };

  return (
    <div className="th-feature-generator-widget">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/35 to-transparent dark:via-white/12" aria-hidden />
      <div className="flex flex-col items-center text-center mb-7">
        {title && (
          <h2 className="text-xl sm:text-2xl md:text-[2rem] font-bold tracking-[-0.03em] text-slate-950 dark:text-dark-50 mb-4 max-w-2xl leading-tight">
            {title}
          </h2>
        )}
        <GenerateButton 
          onClick={handleGenerate} 
          isGenerating={isGenerating} 
          label={buttonLabel || `Sample ${defaultCount} names`} 
          className="w-full sm:w-auto sm:min-w-[300px]"
        />
        {showEmptyMessage && (
          <div
            role="status"
            className="mt-5 w-full max-w-md rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800/80 px-4 py-3 text-sm text-slate-600 dark:text-dark-300 leading-relaxed"
          >
            {error}
          </div>
        )}
      </div>
      
      <NamesGrid 
        names={generatedNames} 
        gridId="names"
        emptyMessage="Use the button above to pull a fresh set of names." 
      />
    </div>
  );
};
