import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

export const StyleGrid = ({ styles, copiedId, onCopy, isDarkMode }) => {
  const bgCard = isDarkMode ? 'bg-dark-900' : 'bg-white';
  const borderCard = isDarkMode ? 'border-dark-700' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-dark-400' : 'text-gray-500';
  const bgInput = isDarkMode ? 'bg-dark-800' : 'bg-gray-100';

  if (styles.length === 0) {
    return (
      <div className={`text-center py-16 ${bgCard} rounded-xl border ${borderCard}`}>
        <p className={textMuted}>No styles found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="region" aria-label="Generated text styles">
      {styles.map((style) => {
        const isCopied = copiedId === style.id;
        
        return (
          <div 
            key={style.id}
            className={`${bgCard} border ${borderCard} rounded-xl p-4 flex flex-col gap-3 group hover:border-accent-cyan/50 hover:shadow-lg transition-all relative overflow-hidden`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{style.name}</span>
              <span className={`text-[10px] ${bgInput} ${textMuted} px-2 py-1 rounded-md border ${borderCard}`}>{style.category}</span>
            </div>
            
            <div className="text-lg sm:text-xl break-all pr-10 min-h-[3rem] flex items-center">
              {!style.success ? (
                <span className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {style.error}</span>
              ) : (
                <span className={style.hasWarning ? 'text-yellow-500' : ''}>{style.text}</span>
              )}
            </div>

            {style.success && (
              <button
                onClick={() => onCopy(style.text, style.id)}
                className={`absolute bottom-4 right-4 p-2.5 rounded-lg transition-all active:scale-90 ${
                  isCopied 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/50' 
                    : `${isDarkMode ? 'bg-dark-700 text-dark-300' : 'bg-gray-100 text-gray-600'} hover:bg-accent-cyan hover:text-dark-950 border ${borderCard} hover:border-accent-cyan`
                }`}
                aria-label={`Copy ${style.name} style to clipboard`}
                title="Copy to clipboard"
              >
                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
            
            {/* Copied Toast Overlay */}
            <div className={`absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
              <span className="bg-green-500 text-dark-950 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Check className="w-4 h-4" /> Copied!
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};