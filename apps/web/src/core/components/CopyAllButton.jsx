import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { INTERACTION_TIMING, useAsyncLock, useTransientFlag } from '@/utils/interactionState.js';

export const CopyAllButton = ({ texts, className, variant = "default" }) => {
  const { value: copied, setOn: flashCopied } = useTransientFlag({ durationMs: INTERACTION_TIMING.feedbackMs });
  const { locked: busy, run } = useAsyncLock();
  
  const validTexts = [...new Set((texts || []).filter(t => t && t.trim() !== ''))];
  const isDisabled = validTexts.length === 0;
  
  const handleCopyAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled || busy) return;
    await run(async () => {
      const res = await copyTextToClipboard(validTexts.join('\n'), { preventRepeatMs: INTERACTION_TIMING.preventRepeatShareMs, vibrateMs: 12 });
      if (!res.ok) return;
      flashCopied();
    });
  };
  
  return (
    <Button 
      variant={variant} 
      onClick={handleCopyAll} 
      disabled={isDisabled || busy}
      className={cn(
        "min-h-[44px] transition-all duration-200 active:scale-95 font-medium", 
        !copied && "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white",
        copied && "bg-green-500 hover:bg-green-600 text-white",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
      <span>{copied ? 'Copied' : 'Copy All'}</span>
    </Button>
  );
};