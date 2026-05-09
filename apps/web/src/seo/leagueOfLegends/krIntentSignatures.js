/**
 * Intent signature layer — KR ladder lane only (/league-of-legends/korean).
 * Internal psychological strata for behavioral plausibility (not UX categories).
 * Never surface labels to the user.
 */

import {
  BehavioralCurationRules,
  KR_DEFAULT_ECOLOGY_SALT,
  KR_PLAIN_BEHAVIORAL_LEXICON,
  mixKrSeed,
  seededShuffle,
} from './krBehavioralCuration.js';

function strHash(s) {
  const x = String(s);
  let h = 2166136261;
  for (let i = 0; i < x.length; i++) {
    h ^= x.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * @typedef {'quiet_smurf'|'clean_grinder'|'restrained_prestige'|'old_alt'} KrIntentSignatureId
 */

/**
 * Micro-intentions: tuning only — no caricature modes.
 * - lowerShare: P(lowercase) vs sentence case (two-way; KR restraint preserved).
 * - flatNudgeThreshold: deterministic “flat alt” lowercase pull (0–100); higher = quieter / less “styled”.
 */
export const INTENT_SIGNATURE_PARAMS = {
  quiet_smurf: {
    lowerShare: 0.58,
    flatNudgeThreshold: 12,
  },
  clean_grinder: {
    lowerShare: 0.42,
    flatNudgeThreshold: 7,
  },
  restrained_prestige: {
    lowerShare: 0.33,
    flatNudgeThreshold: 5,
  },
  old_alt: {
    lowerShare: 0.55,
    flatNudgeThreshold: 14,
  },
};

/** Slot counts — uneven mix reads more ecological than 25/25/25/25 */
const INTENT_QUOTAS = {
  restrained_prestige: 4,
  clean_grinder: 7,
  quiet_smurf: 6,
  old_alt: 5,
};

function takeUnique(pool, count, used, seedStr) {
  const shuffled = seededShuffle(pool.filter((t) => t && !used.has(t)), seedStr);
  const out = [];
  for (const t of shuffled) {
    if (out.length >= count) break;
    if (used.has(t)) continue;
    used.add(t);
    out.push(t);
  }
  return out;
}

function backfill(need, used, mainPool, seedStr) {
  const shuffled = seededShuffle(mainPool.filter((t) => t && !used.has(t)), seedStr);
  const out = [];
  for (const t of shuffled) {
    if (out.length >= need) break;
    used.add(t);
    out.push(t);
  }
  return out;
}

/**
 * Layered canonical picks + intent tags. Quotas use BehavioralCurationRules.targetCount.
 * Order of filling reduces collisions; pairs are merged and shuffled so lists are not intent-blocked.
 * @param {{ cold: string[], tight: string[], extras: string[], plainLex?: string[] }} pools
 * @param {string} [ecologySalt] — session / draw-scoped; defaults to SSR-stable salt
 * @returns {{ token: string, intent: KrIntentSignatureId }[]}
 */
export function buildKrIntentLayeredPick(pools, ecologySalt = KR_DEFAULT_ECOLOGY_SALT) {
  const target = BehavioralCurationRules.targetCount;
  const plain = [...new Set((pools.plainLex || KR_PLAIN_BEHAVIORAL_LEXICON).map((s) => String(s).toLowerCase()))];
  const cold = [...new Set((pools.cold || []).map((s) => String(s).toLowerCase()))];
  const tight = [...new Set((pools.tight || []).map((s) => String(s).toLowerCase()))];
  const extras = [...new Set((pools.extras || []).map((s) => String(s).toLowerCase()))];

  const shortCold = cold.filter((w) => w.length <= 4);
  const longCold = cold.filter((w) => w.length >= 5);
  const mainAll = [...new Set([...cold, ...tight, ...extras])].filter((t) => t.length >= 3 && t.length <= 11);

  const used = new Set();
  const segments = [];

  const prestigePool = [...longCold, ...extras];
  let pr = takeUnique(
    prestigePool,
    INTENT_QUOTAS.restrained_prestige,
    used,
    mixKrSeed(ecologySalt, 'kr-int-prestige'),
  );
  if (pr.length < INTENT_QUOTAS.restrained_prestige) {
    pr = pr.concat(
      backfill(
        INTENT_QUOTAS.restrained_prestige - pr.length,
        used,
        mainAll,
        mixKrSeed(ecologySalt, 'kr-int-prestige-bf'),
      ),
    );
  }
  segments.push(...pr.map((token) => ({ token, intent: /** @type {const} */ ('restrained_prestige') })));

  let gr = takeUnique(mainAll, INTENT_QUOTAS.clean_grinder, used, mixKrSeed(ecologySalt, 'kr-int-grinder'));
  if (gr.length < INTENT_QUOTAS.clean_grinder) {
    gr = gr.concat(
      backfill(
        INTENT_QUOTAS.clean_grinder - gr.length,
        used,
        mainAll,
        mixKrSeed(ecologySalt, 'kr-int-grinder-bf'),
      ),
    );
  }
  segments.push(...gr.map((token) => ({ token, intent: /** @type {const} */ ('clean_grinder') })));

  const quietOrdered = uniqConcat(
    seededShuffle(plain, mixKrSeed(ecologySalt, 'kr-q-plain')),
    seededShuffle(tight, mixKrSeed(ecologySalt, 'kr-q-tight')),
    seededShuffle(shortCold, mixKrSeed(ecologySalt, 'kr-q-short')),
  );
  let qu = takeUnique(quietOrdered, INTENT_QUOTAS.quiet_smurf, used, mixKrSeed(ecologySalt, 'kr-int-quiet'));
  if (qu.length < INTENT_QUOTAS.quiet_smurf) {
    qu = qu.concat(
      backfill(
        INTENT_QUOTAS.quiet_smurf - qu.length,
        used,
        mainAll,
        mixKrSeed(ecologySalt, 'kr-int-quiet-bf'),
      ),
    );
  }
  segments.push(...qu.map((token) => ({ token, intent: /** @type {const} */ ('quiet_smurf') })));

  const oldOrdered = uniqConcat(
    seededShuffle(tight, mixKrSeed(ecologySalt, 'kr-o-tight')),
    seededShuffle(shortCold, mixKrSeed(ecologySalt, 'kr-o-short')),
    seededShuffle(plain, mixKrSeed(ecologySalt, 'kr-o-plain')),
  );
  let ol = takeUnique(oldOrdered, INTENT_QUOTAS.old_alt, used, mixKrSeed(ecologySalt, 'kr-int-old'));
  if (ol.length < INTENT_QUOTAS.old_alt) {
    ol = ol.concat(
      backfill(INTENT_QUOTAS.old_alt - ol.length, used, mainAll, mixKrSeed(ecologySalt, 'kr-int-old-bf')),
    );
  }
  segments.push(...ol.map((token) => ({ token, intent: /** @type {const} */ ('old_alt') })));

  let merged = seededShuffle(segments, mixKrSeed(ecologySalt, 'kr-intent-ecology'));

  if (merged.length < target) {
    const bf = backfill(
      target - merged.length,
      used,
      mainAll,
      mixKrSeed(ecologySalt, 'kr-intent-final-bf'),
    );
    const fillerIntent = /** @type {const} */ ('clean_grinder');
    merged = merged.concat(bf.map((token) => ({ token, intent: fillerIntent })));
  }

  return merged.slice(0, target);
}

function uniqConcat(...arrays) {
  const seen = new Set();
  const out = [];
  for (const arr of arrays) {
    for (const x of arr || []) {
      if (seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

/**
 * Present single-token surface with implicit intent psychology (deterministic).
 * @param {string} canonicalLower
 * @param {KrIntentSignatureId} intentId
 */
export function presentKrIntentSurface(canonicalLower, intentId) {
  const t = String(canonicalLower).toLowerCase();
  if (t.length < 2) return t;

  const profile = INTENT_SIGNATURE_PARAMS[intentId] || INTENT_SIGNATURE_PARAMS.clean_grinder;
  const salt = `${t}\x1e${intentId}`;
  if (((strHash(salt) >>> 11) % 100) < profile.flatNudgeThreshold) return t;

  const roll = (strHash(`\x00${salt}`) % 100) / 100;
  if (roll < profile.lowerShare) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}
