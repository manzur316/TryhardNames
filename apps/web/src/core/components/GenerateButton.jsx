import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';

export const GenerateButton = ({ onClick, isGenerating, label = "Sample", className, icon }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isGenerating}
      className={cn(
        "min-h-[44px] sm:min-h-[56px] py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-bold w-full sm:w-auto transition-all duration-300 active:scale-95 rounded-xl shadow-lg hover:shadow-xl", 
        "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white",
        isGenerating && "opacity-80 cursor-not-allowed",
        className
      )}
    >
      {isGenerating ? (
        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
      ) : (
        icon || <Sparkles className="w-5 h-5 mr-3" />
      )}
      {label}
    </Button>
  );
};