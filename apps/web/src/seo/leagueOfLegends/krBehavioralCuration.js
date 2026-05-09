/**
 * Behavioral realism — KR ladder lane only (/league-of-legends/korean).
 * Goal: plausible solo-queue discovery rhythm (not batch-perfect generator grids).
 * No LLMs, no external APIs — deterministic structure + bounded lexical strata.
 */

/** @typedef {{ targetCount: number; plainSlotMin: number; plainSlotRatio: number }} KrBehavioralRules */

function strHash(s) {
  const x = String(s);
  let h = 2166136261;
  for (let i = 0; i < x.length; i++) {
    h ^= x.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 — deterministic PRNG for stable ordering across builds/sessions. */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(arr, seedStr) {
  const seed = strHash(String(seedStr));
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Canonical salt for SSR / programmatic pages — client supplies session-scoped salts that compound per draw. */
export const KR_DEFAULT_ECOLOGY_SALT = 'kr-ssr-v1';

/**
 * Mix ecology salt into phase keys so all seeded shuffles react coherently without chaotic RNG.
 * @param {string | number | null | undefined} ecologySalt
 * @param {string} phaseKey
 */
export function mixKrSeed(ecologySalt, phaseKey) {
  const base =
    ecologySalt == null || ecologySalt === ''
      ? KR_DEFAULT_ECOLOGY_SALT
      : String(ecologySalt);
  return `${base}\x1f${String(phaseKey)}`;
}

/**
 * Tunable behavioral curation — “silent realism”: occasional flat picks, asymmetric pacing.
 * Does not relax KR restraint (still single-token, no symbol spam).
 */
export const BehavioralCurationRules = {
  /** Fewer rows than generic 24/28 grids — reads more like a skimmed lobby list */
  targetCount: 22,
  /** At least this many deliberately “flat” English utility surfaces */
  plainSlotMin: 2,
  /** Share of list reserved for plain stratum (bounded by pool size) */
  plainSlotRatio: 0.13,
};

/**
 * Flat, plausible alt-account surfaces — intentionally non-showy (not “aesthetic grind”).
 * Disjoint from mythic cold list; short ASCII that passes finalize minLen.
 */
export const KR_PLAIN_BEHAVIORAL_LEXICON = [
  'sub',
  'off',
  'mod',
  'set',
  'row',
  'odd',
  'ivy',
  'oak',
  'ash',
  'nil',
];

/**
 * Pick canonical lowercase cores: stratified plain slots + main pool, deterministic shuffle.
 * @param {object} params
 * @param {string[]} params.mainCanonical — cold+tight+extras (lowercase)
 * @param {string[]} [params.plainCanonical] — defaults to KR_PLAIN_BEHAVIORAL_LEXICON
 * @param {KrBehavioralRules} [params.rules]
 * @returns {string[]}
 */
export function stratifiedKrCanonicalPick({
  mainCanonical,
  plainCanonical = KR_PLAIN_BEHAVIORAL_LEXICON,
  rules = BehavioralCurationRules,
}) {
  const target = Math.max(8, rules.targetCount);
  const main = [...new Set((mainCanonical || []).map((s) => String(s).toLowerCase()))].filter(Boolean);
  const plain = [...new Set((plainCanonical || []).map((s) => String(s).toLowerCase()))].filter(Boolean);

  const plainSlots = Math.min(
    plain.length,
    Math.max(rules.plainSlotMin, Math.floor(target * rules.plainSlotRatio)),
  );

  const plainPick = seededShuffle(plain, 'kr-plain-stratum').slice(0, plainSlots);
  const plainSet = new Set(plainPick);

  const mainRest = seededShuffle(
    main.filter((t) => !plainSet.has(t)),
    'kr-main-stratum',
  );

  const out = [...plainPick];
  for (const t of mainRest) {
    if (out.length >= target) break;
    out.push(t);
  }

  return out.slice(0, target);
}

/**
 * Length-interleaved ordering — breaks “sorted / batched” silhouettes without noisy shuffle.
 * Uses a mild asymmetric pull pattern so adjacent lines rarely share the same length band.
 * @param {string[]} names — already presented/cased strings
 * @param {string} [ecologySalt]
 * @returns {string[]}
 */
export function humanPaceKrOrder(names, ecologySalt = KR_DEFAULT_ECOLOGY_SALT) {
  const list = (names || []).filter(Boolean).map(String);
  if (list.length <= 1) return list;

  const meta = list.map((n) => ({ n, len: n.length }));
  const short = meta.filter((x) => x.len <= 4);
  const mid = meta.filter((x) => x.len >= 5 && x.len <= 7);
  const long = meta.filter((x) => x.len >= 8);

  const s = seededShuffle(short, mixKrSeed(ecologySalt, 'kr-pace-short')).map((x) => x.n);
  const m = seededShuffle(mid, mixKrSeed(ecologySalt, 'kr-pace-mid')).map((x) => x.n);
  const l = seededShuffle(long, mixKrSeed(ecologySalt, 'kr-pace-long')).map((x) => x.n);

  const buckets = [s, m, l];
  const idx = [0, 0, 0];
  /** Asymmetric pull — not strict round-robin (less mechanical than 0,1,2,0,1,2) */
  const pattern = [0, 1, 2, 1, 0, 2, 1, 1, 0, 2, 0, 1, 2, 0];
  const out = [];
  let pi = 0;
  let emptySkips = 0;

  while (out.length < list.length && emptySkips < 50) {
    const b = pattern[pi % pattern.length];
    pi++;
    if (idx[b] < buckets[b].length) {
      out.push(buckets[b][idx[b]++]);
      emptySkips = 0;
    } else {
      emptySkips++;
      let placed = false;
      for (let k = 1; k <= 3; k++) {
        const bb = (b + k) % 3;
        if (idx[bb] < buckets[bb].length) {
          out.push(buckets[bb][idx[bb]++]);
          placed = true;
          break;
        }
      }
      if (!placed) break;
    }
  }

  for (let b = 0; b < 3; b++) {
    while (idx[b] < buckets[b].length) out.push(buckets[b][idx[b]++]);
  }

  return out;
}

/**
 * Same pacing as {@link humanPaceKrOrder}, but preserves arbitrary row metadata (intent, surfaces, etc.).
 * @template T
 * @param {T[]} items
 * @param {(row: T) => string} getLabel — compared by string length bands (usually displayed name)
 * @param {string} [ecologySalt]
 * @returns {T[]}
 */
export function humanPaceKrOrderKeyed(items, getLabel, ecologySalt = KR_DEFAULT_ECOLOGY_SALT) {
  const list = (items || []).filter(Boolean);
  if (list.length <= 1) return list;

  const meta = list.map((item) => ({ item, len: String(getLabel(item)).length }));
  const short = meta.filter((x) => x.len <= 4);
  const mid = meta.filter((x) => x.len >= 5 && x.len <= 7);
  const long = meta.filter((x) => x.len >= 8);

  const s = seededShuffle(short, mixKrSeed(ecologySalt, 'kr-pace-short-k')).map((x) => x.item);
  const m = seededShuffle(mid, mixKrSeed(ecologySalt, 'kr-pace-mid-k')).map((x) => x.item);
  const l = seededShuffle(long, mixKrSeed(ecologySalt, 'kr-pace-long-k')).map((x) => x.item);

  const buckets = [s, m, l];
  const idx = [0, 0, 0];
  const pattern = [0, 1, 2, 1, 0, 2, 1, 1, 0, 2, 0, 1, 2, 0];
  const out = [];
  let pi = 0;
  let emptySkips = 0;

  while (out.length < list.length && emptySkips < 50) {
    const b = pattern[pi % pattern.length];
    pi++;
    if (idx[b] < buckets[b].length) {
      out.push(buckets[b][idx[b]++]);
      emptySkips = 0;
    } else {
      emptySkips++;
      let placed = false;
      for (let k = 1; k <= 3; k++) {
        const bb = (b + k) % 3;
        if (idx[bb] < buckets[bb].length) {
          out.push(buckets[bb][idx[bb]++]);
          placed = true;
          break;
        }
      }
      if (!placed) break;
    }
  }

  for (let b = 0; b < 3; b++) {
    while (idx[b] < buckets[b].length) out.push(buckets[b][idx[b]++]);
  }

  return out;
}
