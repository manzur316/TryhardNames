import React from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';
import { trackEvent } from '@/utils/analytics.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { INTERACTION_TIMING, useAsyncLock, useTransientFlag } from '@/utils/interactionState.js';

const CopyButton = ({ textToCopy, className = '', analytics, onCopied }) => {
  const { value: copied, setOn: flashCopied, setOff: clearCopied } = useTransientFlag({ durationMs: INTERACTION_TIMING.feedbackMs });
  const { value: failed, setOn: flashFailed, setOff: clearFailed } = useTransientFlag({ durationMs: INTERACTION_TIMING.feedbackMs });
  const { locked: busy, run } = useAsyncLock();

  const handleCopy = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    if (!textToCopy) return;
    if (busy) return;

    await run(async () => {
      const res = await copyTextToClipboard(textToCopy, { preventRepeatMs: INTERACTION_TIMING.preventRepeatCopyMs, vibrateMs: 12 });
      if (!res.ok) {
        clearCopied();
        flashFailed();
        return;
      }

      clearFailed();
      flashCopied();
      if (analytics && typeof analytics === 'object') {
        trackEvent('COPY_NAME', { ...analytics, name: String(textToCopy), source: analytics.source || 'copy_button' });
      }
      if (typeof onCopied === 'function') {
        onCopied(String(textToCopy));
      }
    });
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }} 
      animate={copied ? { scale: [0.95, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="w-full min-w-0"
    >
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-base relative overflow-hidden transition-all duration-300 font-semibold rounded-xl min-h-[50px] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#040912]',
          copied
            ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/45 shadow-none'
            : failed
              ? 'bg-red-500/15 text-red-100 border border-red-500/35 shadow-none'
              : 'border-0 bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 text-white shadow-[0_14px_44px_-14px_rgba(109,40,217,0.55)] hover:brightness-110 hover:shadow-[0_18px_48px_-12px_rgba(109,40,217,0.62)] active:scale-[0.99]',
          className
        )}
        disabled={!textToCopy || busy}
        aria-live="polite"
      >
        {copied ? (
          <span className="flex items-center font-bold">
            <Check className="w-5 h-5 mr-2 animate-in zoom-in duration-200" />
            Copied
          </span>
        ) : failed ? (
          <span className="flex items-center font-bold">
            <Copy className="w-5 h-5 mr-2" />
            Copy failed
          </span>
        ) : (
          <span className="flex items-center">
            <Copy className="w-5 h-5 mr-2" />
            Copy Name
          </span>
        )}
      </button>
    </motion.div>
  );
};

export default CopyButton;