import React from 'react';
import { Sparkles } from 'lucide-react';
import { getCosmeticPresentationTokens } from '@/gaming-passport/cosmetics/index.js';

export default function CosmeticLoadoutPreview({ loadout, label = 'Cosmetic preview' }) {
  const tokens = getCosmeticPresentationTokens(loadout);

  return (
    <div className={`${tokens.shellClassName} p-4`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tokens.chipClassName}`}>
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tokens.chipClassName}`}>
          Visual-only
        </span>
      </div>
      <div className={`mt-4 inline-flex ${tokens.nameplateClassName}`}>
        <span className={`text-lg font-semibold ${tokens.headingClassName}`}>Passport preview</span>
      </div>
      <p className={`mt-3 text-sm leading-6 ${tokens.bodyClassName}`}>
        Cosmetics style identity presentation only. They do not create proof, verification, rank, or provider status.
      </p>
      {tokens.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tokens.badges.map((badge) => (
            <span key={badge.id} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tokens.chipClassName}`}>
              {badge.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
