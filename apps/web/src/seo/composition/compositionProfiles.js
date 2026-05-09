/**
 * Composition behavior profiles — structural grammar per universe/lane (not vocabulary).
 * Incremental adoption: wire finalize* helpers from lane modules; avoid changing all of buildNames at once.
 */

/** League · KR ladder minimal — calm width, no generator ornament */
export const LOL_KR_MINIMAL_COMPOSITION = {
  id: 'lol-kr-minimal',
  maxLen: 14,
  minLen: 3,
  /** Preferred shapes for this lane’s psychology */
  allowedStructures: ['single-token', 'dual-fused-compact'],
  forbiddenPatterns: [
    /\d/, // no numeric spam
    /ttv$/i,
    /yt$/i,
    /99$/,
  ],
  symbolTolerance: 0,
  casingModes: ['Title', 'lower'],
  /** Visual rhythm: narrow glyphs, no punctuation pressure */
  visualPressure: 'low',
  syllableCompression: 'high',
};

/**
 * Finalize KR structural rules on a list of candidate tags (latin letters only after sanitize).
 * @param {string[]} names
 * @returns {string[]}
 */
/*
 * Future profiles (same file pattern — wire when migrating lanes):
 * - COD_SWEATY: staccato, sharp endings, optional compressed numeric stress (bounded)
 * - ROBLOX_AESTHETIC: airy rhythm, softer consonant clusters, selective soft symbols
 * - VAL_TACTICAL: competitive readability, HUD-width discipline, minimal punctuation
 */

/**
 * KR lane — composition pacing (structural psychology, not lexicon).
 * Goal: “found” alt / smurf read, not assembled CamelCase compounds.
 */
export const LOL_KR_COMPOSITION_PACING = {
  singleTokenTarget: 1.0,
  maxDualFusedRatio: 0,
  idealLen: { min: 3, max: 8, softMax: 11 },
  casingMix: { lowerWeight: 0.4, sentenceWeight: 0.6 },
  notes: [
    'No CamelCase dual fusion in primary output — reads “crafted generator”.',
    'Lowercase reads queue-native; sentence case reads crisp — mix both, never shoutCASE.',
  ],
};

export function finalizeLolKrComposition(names) {
  const { maxLen, minLen } = LOL_KR_MINIMAL_COMPOSITION;
  const out = [];
  const seen = new Set();
  for (const raw of names || []) {
    let s = String(raw).replace(/[^a-zA-Z]/g, '');
    if (!s) continue;
    if (s.length > maxLen) s = s.slice(0, maxLen);
    if (s.length < minLen) continue;
    let reject = false;
    for (const re of LOL_KR_MINIMAL_COMPOSITION.forbiddenPatterns) {
      if (re.test(s)) {
        reject = true;
        break;
      }
    }
    if (reject) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}
