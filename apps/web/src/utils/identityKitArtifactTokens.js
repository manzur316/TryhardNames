/**
 * Surface-aware micro-tokens for Identity Kit artifacts only.
 * Adjusts padding, type scale, and rhythm — not full app simulation.
 */

/** @typedef {'vertical' | 'banner'} ArtifactLayoutKind */

const VERTICAL_BASE = {
  inner: 'relative px-8 py-9 sm:px-10 sm:py-10',
  kitLabel: 'text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35 mb-6',
  display:
    'text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-white/95 leading-[1.28] break-words [overflow-wrap:anywhere]',
  subLine: 'mt-3 text-sm text-white/45 font-medium tracking-wide break-words [overflow-wrap:anywhere]',
  bio: 'mt-6 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-5 max-w-md break-words [overflow-wrap:anywhere]',
  chipRow: 'mt-8 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
  contextWrap: 'mt-6 pt-5 border-t border-white/[0.06] space-y-2 max-w-md',
  contextLabel: 'text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30',
  contextLine: 'text-[11px] leading-[1.55] text-white/42 tracking-wide',
  contextTypo: 'text-[11px] leading-[1.55] text-white/38 tracking-wide',
};

/** Partial overrides per surface — merged onto VERTICAL_BASE */
const VERTICAL_SURFACE = {
  riot: {
    inner: 'relative px-6 py-7 sm:px-8 sm:py-8',
    kitLabel: 'text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35 mb-5',
    display:
      'text-xl sm:text-[1.45rem] font-semibold tracking-tight text-white/95 leading-[1.22] break-words [overflow-wrap:anywhere]',
    subLine: 'mt-2.5 text-[13px] text-white/45 font-medium tracking-wide break-words [overflow-wrap:anywhere]',
    bio: 'mt-4 text-sm leading-snug text-white/55 border-t border-white/[0.08] pt-4 max-w-md break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-6 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-5 pt-4 border-t border-white/[0.06] space-y-1.5 max-w-md',
  },
  discord: {
    inner: 'relative px-9 py-10 sm:px-11 sm:py-11',
    kitLabel: 'text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35 mb-7',
    display:
      'text-[1.6rem] sm:text-[1.72rem] font-semibold tracking-tight text-white/95 leading-[1.32] break-words [overflow-wrap:anywhere]',
    subLine: 'mt-4 text-sm text-white/45 font-medium tracking-wide break-words [overflow-wrap:anywhere]',
    bio: 'mt-8 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-6 max-w-md break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-10 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-8 pt-6 border-t border-white/[0.06] space-y-2.5 max-w-md',
  },
  twitch: {
    inner: 'relative px-8 py-8 sm:px-10 sm:py-9',
    display:
      'text-xl sm:text-[1.55rem] font-semibold tracking-wide text-white/95 leading-[1.28] break-words [overflow-wrap:anywhere]',
    subLine: 'mt-3 text-[13px] text-white/45 font-medium tracking-wide break-words [overflow-wrap:anywhere]',
    bio: 'mt-5 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-5 max-w-md break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-7 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-6 pt-5 border-t border-white/[0.06] space-y-2 max-w-md',
  },
  steam: {
    inner: 'relative px-8 py-9 sm:px-10 sm:py-10',
    display:
      'text-2xl sm:text-[1.58rem] font-semibold tracking-normal text-white/95 leading-[1.26] break-words [overflow-wrap:anywhere]',
    subLine: 'mt-3 text-sm text-white/45 font-medium tracking-normal break-words [overflow-wrap:anywhere]',
  },
  roblox: {
    inner: 'relative px-6 py-8 sm:px-8 sm:py-9',
    display:
      'text-xl sm:text-[1.52rem] font-semibold tracking-tight text-white/95 leading-[1.26] break-words [overflow-wrap:anywhere]',
    bio: 'mt-5 text-sm leading-snug text-white/55 border-t border-white/[0.08] pt-4 max-w-md break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-7 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-6 pt-4 border-t border-white/[0.06] space-y-1.5 max-w-md',
  },
};

const BANNER_BASE = {
  shellMax: 'max-w-[min(100%,720px)]',
  inner: 'relative px-7 py-7 sm:px-9 sm:py-8',
  kitLabel: 'text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35 mb-4',
  display:
    'text-xl sm:text-[1.65rem] font-semibold tracking-tight text-white/95 leading-[1.28] break-words [overflow-wrap:anywhere]',
  subLine: 'mt-2 text-sm text-white/45 font-medium tracking-wide break-words [overflow-wrap:anywhere]',
  bio: 'mt-4 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-4 max-w-[min(56ch,100%)] break-words [overflow-wrap:anywhere]',
  /** Single row below body — durable in narrow / Riot-like widths; no side column overlap */
  chipRow: 'mt-5 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
  contextWrap: 'mt-6 pt-5 border-t border-white/[0.06] space-y-1.5 w-full',
  contextLabel: 'text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30',
  contextLine: 'text-[11px] leading-[1.55] text-white/42 tracking-wide',
  contextTypo: 'text-[11px] leading-[1.55] text-white/38 tracking-wide',
};

const BANNER_SURFACE = {
  riot: {
    inner: 'relative px-6 py-6 sm:px-8 sm:py-7',
    display:
      'text-lg sm:text-[1.45rem] font-semibold tracking-tight text-white/95 leading-[1.22] break-words [overflow-wrap:anywhere]',
    kitLabel: 'text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35 mb-3',
    bio: 'mt-3 text-sm leading-snug text-white/55 border-t border-white/[0.08] pt-3 max-w-[min(48ch,100%)] break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-5 pt-4 border-t border-white/[0.06] space-y-1.5 w-full',
  },
  discord: {
    inner: 'relative px-9 py-8 sm:px-10 sm:py-9',
    display:
      'text-[1.55rem] sm:text-[1.72rem] font-semibold tracking-tight text-white/95 leading-[1.32] break-words [overflow-wrap:anywhere]',
    bio: 'mt-5 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-5 max-w-[min(52ch,100%)] break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-6 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
    contextWrap: 'mt-7 pt-6 border-t border-white/[0.06] space-y-2 w-full',
  },
  twitch: {
    display:
      'text-lg sm:text-[1.52rem] font-semibold tracking-wide text-white/95 leading-[1.28] break-words [overflow-wrap:anywhere]',
    bio: 'mt-4 text-sm leading-relaxed text-white/55 border-t border-white/[0.08] pt-4 max-w-[min(48ch,100%)] break-words [overflow-wrap:anywhere]',
    chipRow: 'mt-5 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/35',
  },
  steam: {
    display:
      'text-xl sm:text-[1.58rem] font-semibold tracking-normal text-white/95 leading-[1.26] break-words [overflow-wrap:anywhere]',
  },
  roblox: {
    inner: 'relative px-6 py-7 sm:px-8 sm:py-8',
    display:
      'text-lg sm:text-[1.5rem] font-semibold tracking-tight text-white/95 leading-[1.24] break-words [overflow-wrap:anywhere]',
  },
};

function mergeTokens(base, patch) {
  return { ...base, ...(patch || {}) };
}

/**
 * @param {string} surfaceId
 * @returns {Record<string, string>}
 */
export function getVerticalArtifactTokens(surfaceId) {
  return mergeTokens(VERTICAL_BASE, VERTICAL_SURFACE[surfaceId]);
}

/**
 * @param {string} surfaceId
 * @returns {Record<string, string>}
 */
export function getBannerArtifactTokens(surfaceId) {
  return mergeTokens(BANNER_BASE, BANNER_SURFACE[surfaceId]);
}
