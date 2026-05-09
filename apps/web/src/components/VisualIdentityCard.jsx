import React, { forwardRef, useMemo } from 'react';
import { rarityVisual } from '@/utils/rarityEngine.js';

const sizes = {
  discord: { w: 860, h: 360, className: 'w-full max-w-[860px] aspect-[860/360]' },
  story: { w: 900, h: 1600, className: 'w-full max-w-[420px] aspect-[9/16]' },
  pinterest: { w: 900, h: 1200, className: 'w-full max-w-[480px] aspect-[3/4]' },
};

function safeBadges(badges) {
  return (badges || []).slice(0, 1);
}

const VisualIdentityCard = forwardRef(function VisualIdentityCard(
  { pack, rarity, variant = 'discord', featured = false },
  ref
) {
  const rv = useMemo(() => rarityVisual(rarity?.tier), [rarity?.tier]);
  const dims = sizes[variant] || sizes.discord;

  if (!pack) return null;

  return (
    <div
      ref={ref}
      className={`relative rounded-[28px] overflow-hidden border ${rv.border} ${rv.glow} bg-[#070A12] ${dims.className}`}
      style={{ width: '100%' }}
    >
      {/* background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-r ${rv.accent} opacity-55`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.09),transparent_48%),radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.09),transparent_48%)]" />
        {featured && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.12),transparent_55%)]" />
        )}
      </div>

      {/* shimmer (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <div className="absolute -left-1/2 top-0 h-full w-[60%] bg-gradient-to-r from-transparent via-white to-transparent rotate-[12deg] animate-[shimmer_6.5s_ease-in-out_infinite]" />
      </div>

      {/* content */}
      <div className="relative h-full w-full p-6 sm:p-7 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {rarity?.tier && (
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${rv.badge}`}>
                  {rarity.tier}
                </span>
              )}
              {safeBadges(rarity?.badges).map((b) => (
                <span
                  key={b.id}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-white/[0.06] border border-white/10 text-white/70"
                >
                  {b.label}
                </span>
              ))}
              {pack.microLabel && (
                <span className="text-[10px] font-medium tracking-wide text-white/55">
                  {pack.microLabel}
                </span>
              )}
            </div>

            <p className="mt-4 text-white font-black tracking-tight break-all leading-[0.95]" style={{ fontSize: variant === 'discord' ? 54 : 58 }}>
              {pack.name}
            </p>
            <p className="mt-2 text-white/70 text-sm font-bold">
              <span className="text-white/90">{pack.clanTag}</span> • <span className="text-white/90">{pack.vibe}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {(pack.symbols || []).slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="h-9 w-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10 text-white text-base"
                >
                  {s}
                </span>
              ))}
            </div>
            {rarity?.micro && (
              <p className="text-white/60 text-xs font-bold">{rarity.micro}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/85 text-sm font-medium leading-relaxed">
              “{pack.bio}”
            </p>
            {pack.altVersions?.length ? (
              <p className="mt-3 text-white/55 text-xs font-bold">
                Alts: <span className="text-white/70">{pack.altVersions.slice(0, 3).join(' • ')}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-white/45 text-[11px] font-bold tracking-widest uppercase">TryhardNames</p>
          <p className="text-white/45 text-[11px] font-bold tracking-widest uppercase">
            Identity collectible
          </p>
        </div>
      </div>

      {/* keyframes */}
      <style>
        {`@keyframes shimmer { 0% { transform: translateX(-40%) rotate(12deg); opacity: 0; } 35% { opacity: .12; } 55% { opacity: .12; } 100% { transform: translateX(160%) rotate(12deg); opacity: 0; } }`}
      </style>
    </div>
  );
});

export default VisualIdentityCard;

