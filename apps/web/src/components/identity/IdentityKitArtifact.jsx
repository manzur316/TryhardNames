import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils.js';
import {
  normalizeIdentityKit,
  IDENTITY_SURFACES,
  moodAccentClass,
} from '@/utils/identityKitModel.js';
import { getKitInterpretation } from '@/utils/identityCultureNotes.js';
import {
  getVerticalArtifactTokens,
  getBannerArtifactTokens,
} from '@/utils/identityKitArtifactTokens.js';

/**
 * Identity artifact — vertical profile card or horizontal banner.
 * PNG export target: single root with calm typography; interpretation matches text bundle via getKitInterpretation.
 */
const IdentityKitArtifact = forwardRef(function IdentityKitArtifact({ kit }, ref) {
  const k = normalizeIdentityKit(kit);
  const layout = k.artifactLayout === 'banner' ? 'banner' : 'vertical';
  const surfaceMeta = IDENTITY_SURFACES.find((s) => s.id === k.surfaceId);

  const display = (k.styledAlias || k.primaryAlias || '').trim() || 'Your alias';
  const subLine = k.symbolLine.trim()
    ? k.symbolLine.trim()
    : k.styledAlias.trim() && k.primaryAlias.trim() && k.styledAlias.trim() !== k.primaryAlias.trim()
      ? `Plain read: ${k.primaryAlias.trim()}`
      : '';

  const interp = getKitInterpretation(k);

  if (layout === 'banner') {
    const t = getBannerArtifactTokens(k.surfaceId);
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full mx-auto rounded-2xl border border-white/10 bg-[#070A12] text-left shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85) overflow-hidden border-l-4',
          moodAccentClass(k.moodId),
          t.shellMax
        )}
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" aria-hidden />
        <div className={t.inner}>
          <p className={t.kitLabel}>{k.kitLabel ? `Kit · ${k.kitLabel}` : 'Identity kit'}</p>

          <p className={t.display}>{display}</p>
          {subLine ? <p className={t.subLine}>{subLine}</p> : null}
          {k.bioLine.trim() ? <p className={t.bio}>{k.bioLine.trim()}</p> : null}

          <div className={t.chipRow}>
            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              {surfaceMeta?.label || 'Surface'}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              Read {k.readabilityTier}
            </span>
          </div>

          <div className={t.contextWrap}>
            <p className={t.contextLabel}>Read context</p>
            <p className={t.contextLine}>{interp.surface}</p>
            <p className={t.contextLine}>{interp.readability}</p>
            {interp.typography.map((line) => (
              <p key={line.slice(0, 56)} className={t.contextTypo}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const t = getVerticalArtifactTokens(k.surfaceId);
  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full max-w-[520px] mx-auto rounded-2xl border border-white/10 bg-[#070A12] text-left shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85) overflow-hidden border-l-4',
        moodAccentClass(k.moodId)
      )}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" aria-hidden />
      <div className={t.inner}>
        <p className={t.kitLabel}>{k.kitLabel ? `Kit · ${k.kitLabel}` : 'Identity kit'}</p>

        <p className={t.display}>{display}</p>

        {subLine ? <p className={t.subLine}>{subLine}</p> : null}

        {k.bioLine.trim() ? <p className={t.bio}>{k.bioLine.trim()}</p> : null}

        <div className={t.chipRow}>
          <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
            {surfaceMeta?.label || 'Surface'}
          </span>
          <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
            Read {k.readabilityTier}
          </span>
        </div>

        <div className={t.contextWrap}>
          <p className={t.contextLabel}>Read context</p>
          <p className={t.contextLine}>{interp.surface}</p>
          <p className={t.contextLine}>{interp.readability}</p>
          {interp.typography.map((line) => (
            <p key={line.slice(0, 56)} className={t.contextTypo}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
});

export default IdentityKitArtifact;
