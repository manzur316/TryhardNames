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
  
  const handleGenerate = async () => {
    if (onGenerate) {
      const names = await onGenerate(defaultCount);
      if (onNamesGenerated && names) {
        onNamesGenerated(names);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
      <div className="flex flex-col items-center text-center mb-10">
        {title && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-50 mb-6">{title}</h2>}
        <GenerateButton 
          onClick={handleGenerate} 
          isGenerating={isGenerating} 
          label={buttonLabel || `Generate ${defaultCount} Names`} 
          className="w-full sm:w-auto sm:min-w-[300px]"
        />
        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
      </div>
      
      <NamesGrid 
        names={generatedNames} 
        emptyMessage="Click the button above to generate unique names." 
      />
    </div>
  );
};