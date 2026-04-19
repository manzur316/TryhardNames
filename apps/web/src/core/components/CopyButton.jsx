import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';

export const CopyButton = ({ text, className, variant = "ghost", size = "icon", showText = false }) => {
  const [copied, setCopied] = useState(false);
  const isDisabled = !text || text.trim() === '';
  
  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <Button 
      variant={variant} 
      size={showText ? "default" : size} 
      onClick={handleCopy} 
      disabled={isDisabled}
      className={cn(
        "min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95", 
        !copied && "bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-600 text-slate-700 dark:text-dark-200",
        copied && "bg-green-500 hover:bg-green-600 text-white border-transparent",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )} 
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {showText && <span className="ml-2 font-medium">{copied ? '✅ Copied' : 'Copy'}</span>}
    </Button>
  );
};