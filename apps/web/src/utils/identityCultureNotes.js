/**
 * Cultural Interpretation Layer V1 — curated, manual copy only.
 * Context for how an identity reads on real digital surfaces. Not SEO, not generated.
 */

/** @type {Record<string, string>} */
export const SURFACE_NOTES = {
  generic: 'Verify spacing on each surface — universal tags still change shape by UI.',
  riot: 'Clearer in narrow lobby rows.',
  discord: 'Lower visual pressure in busy servers.',
  twitch: 'Readable at small overlay scale.',
  steam: 'Holds better in older UI layouts.',
  roblox: 'Profile and discovery surfaces — chat lines truncate fast.',
};

/** @type {Record<string, string>} */
export const READABILITY_INSIGHTS = {
  A: 'High recall at a fast glance.',
  B: 'Balanced readability with mild styling.',
  C: 'Better for profile identity than rapid feeds.',
};

/**
 * @param {string} surfaceId
 * @returns {string}
 */
export function getSurfaceNote(surfaceId) {
  return SURFACE_NOTES[surfaceId] || SURFACE_NOTES.generic;
}

/**
 * @param {string} tier — A | B | C
 * @returns {string}
 */
export function getReadabilityInsight(tier) {
  return READABILITY_INSIGHTS[tier] || READABILITY_INSIGHTS.B;
}

/**
 * @param {string} s
 * @returns {string[]}
 */
function insightsForText(s) {
  const chars = [...s];
  const nonAscii = chars.filter((c) => c.codePointAt(0) > 127).length;
  const ratio = nonAscii / Math.max(chars.length, 1);
  const out = [];

  const denseShortTag =
    chars.length <= 36 && nonAscii >= 2 && ratio >= 0.1;
  if (ratio > 0.35 || nonAscii > 10 || denseShortTag) {
    out.push('Dense Unicode may collapse in narrow client rows — keep a plain fallback.');
  } else if (chars.length > 26) {
    out.push('Longer styled strings need more horizontal air in HUD-style layouts.');
  }

  if (/[\u3000-\u9FFF\uFF00-\uFFEF]/.test(s)) {
    out.push('Wide glyphs read softer in profile surfaces than in killfeeds.');
  }

  if (out.length === 0) {
    const hasSignal =
      nonAscii > 0 ||
      chars.length > 24 ||
      /[\u3000-\u9FFF\uFF00-\uFFEF]/.test(s);
    if (hasSignal) {
      out.push('Compare styled and plain reads in-client before you commit.');
    }
  }

  return out.slice(0, 2);
}

/**
 * Unicode density 0–1 for picking which line to analyze when both styled + primary differ.
 * @param {string} s
 */
function unicodeDensity(s) {
  const chars = [...String(s || '').trim()];
  if (!chars.length) return 0;
  return chars.filter((c) => c.codePointAt(0) > 127).length / chars.length;
}

/**
 * 0–2 typography observations for visible alias text (styled and/or primary).
 * Heuristics are utilitarian, not “AI opinions”.
 * @param {string} styledAlias
 * @param {string} [primaryAlias]
 * @returns {string[]}
 */
export function resolveTypographyInsights(styledAlias, primaryAlias = '') {
  const styled = String(styledAlias || '').trim();
  const primary = String(primaryAlias || '').trim();

  /** @type {string[]} */
  const candidates = [];
  if (styled) candidates.push(styled);
  if (primary && primary !== styled) {
    if (!styled || unicodeDensity(primary) > unicodeDensity(styled) + 0.02) {
      candidates.push(primary);
    }
  }

  if (!candidates.length) return [];

  const merged = [];
  const seen = new Set();
  for (const s of candidates) {
    for (const line of insightsForText(s)) {
      if (!seen.has(line)) {
        seen.add(line);
        merged.push(line);
        if (merged.length >= 2) return merged;
      }
    }
  }
  return merged;
}

/**
 * Single source for interpretation copy — preview card, aside note, and text bundle appendix.
 * @param {{ surfaceId?: string, readabilityTier?: string, styledAlias?: string, primaryAlias?: string }} kit
 * @returns {{ surface: string, readability: string, typography: string[] }}
 */
export function getKitInterpretation(kit) {
  const surfaceId = kit.surfaceId || 'generic';
  const tier = kit.readabilityTier || 'B';
  return {
    surface: getSurfaceNote(surfaceId),
    readability: getReadabilityInsight(tier),
    typography: resolveTypographyInsights(kit.styledAlias, kit.primaryAlias),
  };
}

/**
 * Lines to append to the text export bundle.
 * @param {{ surfaceId?: string, readabilityTier?: string, styledAlias?: string, primaryAlias?: string }} kit — normalized fields
 * @returns {string[]}
 */
export function formatCultureBundleAppendix(kit) {
  const i = getKitInterpretation(kit);
  const lines = [];
  lines.push('');
  lines.push('Interpretation');
  lines.push('—'.repeat(24));
  lines.push(`Surface: ${i.surface}`);
  lines.push(`Readability: ${i.readability}`);
  if (i.typography.length) {
    i.typography.forEach((t) => lines.push(`Typography: ${t}`));
  }
  return lines;
}
