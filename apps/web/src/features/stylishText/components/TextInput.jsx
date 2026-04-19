import React from 'react';
import { Type, Trash2 } from 'lucide-react';

export const TextInput = ({ value, onChange, onClear, maxLength = 500, isDarkMode }) => {
  const bgInput = isDarkMode ? 'bg-dark-800' : 'bg-gray-100';
  const borderCard = isDarkMode ? 'border-dark-700' : 'border-gray-200';
  const textMuted = isDarkMode ? 'text-dark-400' : 'text-gray-500';

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="text-input" className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${textMuted}`}>
          <Type className="w-4 h-4 text-accent-cyan" />
          Your Text
        </label>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-medium ${value.length >= maxLength ? 'text-red-500' : textMuted}`}>
            {value.length} / {maxLength}
          </span>
        </div>
      </div>
      
      <textarea
        id="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type something cool here..."
        maxLength={maxLength}
        aria-label="Text input for styling"
        className={`w-full min-h-[120px] sm:min-h-[150px] ${bgInput} border ${borderCard} rounded-xl p-4 text-lg sm:text-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all resize-y custom-scrollbar`}
      />
      
      {value && (
        <button
          onClick={onClear}
          className={`absolute bottom-4 right-4 ${isDarkMode ? 'bg-dark-700 hover:bg-dark-600 text-dark-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'} p-2 rounded-lg transition-colors active:scale-95`}
          aria-label="Clear text"
          title="Clear text (Ctrl+X)"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};