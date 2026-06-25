import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { INTERACTION_TIMING, useAsyncLock, useTransientFlag } from '@/utils/interactionState.js';

export const CopyButton = ({ text, className, variant = "ghost", size = "icon", showText = false, label }) => {
  const { value: copied, setOn: flashCopied } = useTransientFlag({ durationMs: INTERACTION_TIMING.feedbackMs });
  const { locked: busy, run } = useAsyncLock();
  const isDisabled = !text || text.trim() === '';
  const isCard = variant === 'card';
  const buttonVariant = isCard ? 'default' : variant;
  const shouldShowText = showText || isCard;
  const copyLabel = label || (isCard ? 'Copy Name' : 'Copy');
  
  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled || busy) return;
    await run(async () => {
      const res = await copyTextToClipboard(text, { preventRepeatMs: INTERACTION_TIMING.preventRepeatCopyMs, vibrateMs: 10 });
      if (!res.ok) return;
      flashCopied();
    });
  };
  
  return (
    <Button
      variant={buttonVariant}
      size={shouldShowText ? "default" : size}
      onClick={handleCopy} 
      disabled={isDisabled || busy}
      className={cn(
        "transition-all duration-200 active:scale-95",
        isCard
          ? "min-h-10 w-full rounded-lg px-3 py-2 text-[12px] sm:text-[13px] font-black uppercase tracking-[0.08em]"
          : "min-h-[44px] min-w-[44px]",
        !copied && "bg-slate-200 dark:bg-dark-700 hover:bg-slate-300 dark:hover:bg-dark-600 text-slate-700 dark:text-dark-200",
        isCard && !copied && "border-0 bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 text-white shadow-[0_10px_28px_-16px_rgba(109,40,217,0.58)] hover:brightness-110 hover:shadow-[0_14px_34px_-16px_rgba(109,40,217,0.62)]",
        copied && "bg-green-500 hover:bg-green-600 text-white border-transparent",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )} 
      aria-label={isCard ? `Copy Name: ${text}` : 'Copy to clipboard'}
      title={isCard ? `Copy Name: ${text}` : 'Copy to clipboard'}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {shouldShowText && <span className="ml-1.5 font-bold">{copied ? 'Copied' : copyLabel}</span>}
    </Button>
  );
};
