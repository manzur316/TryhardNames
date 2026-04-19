import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';

export const CopyAllButton = ({ texts, className, variant = "default" }) => {
  const [copied, setCopied] = useState(false);
  
  const validTexts = [...new Set((texts || []).filter(t => t && t.trim() !== ''))];
  const isDisabled = validTexts.length === 0;
  
  const handleCopyAll = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    navigator.clipboard.writeText(validTexts.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleCopyAll} 
      disabled={isDisabled}
      className={cn(
        "min-h-[44px] transition-all duration-200 active:scale-95 font-medium", 
        !copied && "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white",
        copied && "bg-green-500 hover:bg-green-600 text-white",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
      <span>{copied ? '✅ Copied' : 'Copy All'}</span>
    </Button>
  );
};