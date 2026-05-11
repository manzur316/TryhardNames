import React from 'react';
import { cn } from '@/lib/utils.js';
import { getKitInterpretation } from '@/utils/identityCultureNotes.js';
import { normalizeIdentityKit } from '@/utils/identityKitModel.js';

/**
 * Quiet editorial layer — matches bundle appendix via getKitInterpretation (same order and lines).
 */
export default function IdentityCultureNote({ kit }) {
  const k = normalizeIdentityKit(kit);
  const interp = getKitInterpretation(k);

  return (
    <aside
      className={cn(
        'mx-auto space-y-3 border-t border-slate-200/80 dark:border-dark-800 pt-5 mt-2',
        k.artifactLayout === 'banner' ? 'max-w-[720px]' : 'max-w-[520px]'
      )}
      aria-label="Cultural interpretation"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-dark-500">
        Interpretation
      </p>
      <div className="space-y-2.5 text-xs leading-relaxed text-slate-600 dark:text-dark-400">
        <p>{interp.surface}</p>
        <p>{interp.readability}</p>
        <p className="text-slate-600 dark:text-dark-400">{interp.mood}</p>
        {interp.typography.map((line) => (
          <p key={line.slice(0, 48)} className="text-slate-500 dark:text-dark-500">
            {line}
          </p>
        ))}
      </div>
    </aside>
  );
}
