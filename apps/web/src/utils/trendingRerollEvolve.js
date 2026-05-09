/**
 * Trending-only evolution — never mutates page pools; outputs are length-capped (no compound megastrings).
 */

import {
  getContextKeyFromPage,
  evolveContextualName,
  generateContextualNames,
} from '@/utils/contextualNameEngine.js';

const MAX_TAG_LEN = 34;

function clampTag(str, max = MAX_TAG_LEN) {
  const t = String(str || '').trim();
  if (!t.length) return t;
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + '\u2026';
}

/**
 * @param {string} seed
 * @param {{ category?: string, keyword?: string }} ctx
 * @returns {string}
 */
export function resolveTrendingRerollDisplayName(seed, ctx = {}) {
  let s = String(seed || '').trim();
  if (!s) return s;

  const contextKey = getContextKeyFromPage({
    category: ctx.category,
    keyword: ctx.keyword,
  });

  if (contextKey) {
    // Broken / concatenated analytics seeds — ignore and draw fresh from the same cultural cluster
    if (s.length > 36) {
      const fresh = generateContextualNames({ contextKey, count: 16 });
      if (fresh.length) {
        return clampTag(fresh[Math.floor(Math.random() * fresh.length)]);
      }
    }

    const vars = evolveContextualName({ contextKey, baseName: s });
    const alt = (vars || []).filter((v) => v && String(v).trim() !== s);
    if (alt.length) {
      return clampTag(String(alt[Math.floor(Math.random() * alt.length)]));
    }

    const fresh = generateContextualNames({ contextKey, count: 12 });
    if (fresh.length) {
      return clampTag(fresh[Math.floor(Math.random() * fresh.length)]);
    }
    if (vars?.length) return clampTag(String(vars[0]));
  }

  const title = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const clipped = s.length > 3 ? s.slice(0, -1) : s;
  const candidates = [title, clipped].filter((x) => x && x !== s);
  const chosen = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : s;
  return clampTag(chosen);
}

/** Safe label for card UI when upstream data is noisy */
export function clipTrendingSeedLabel(raw, max = MAX_TAG_LEN) {
  return clampTag(raw, max);
}
