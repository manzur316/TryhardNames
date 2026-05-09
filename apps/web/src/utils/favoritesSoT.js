import { persistFavoritesArray, readFavoritesArray, FAVORITES_V1_KEY } from '@/utils/localFavoritesBridge.js';

/**
 * Favorites Source of Truth (SoT)
 *
 * Primary: `tryhardnames:favorites:v1` (array of name strings)
 * Compatibility: can hydrate from legacy `tryhard_favorites` (records) without rewriting backend.
 */

const LEGACY_KEY = 'tryhard_favorites';

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function uniqStrings(arr) {
  return [...new Set((arr || []).map((x) => String(x || '').trim()).filter(Boolean))];
}

function readLegacyRecords() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return [];
  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

function namesFromLegacy(records) {
  return uniqStrings((records || []).map((r) => (r && typeof r === 'object' ? r.name : null)));
}

/**
 * Read unified favorites names.
 * Merges v1 + legacy records to avoid “lost favorites”.
 */
export function readUnifiedFavoriteNames() {
  const v1 = readFavoritesArray();
  const legacy = namesFromLegacy(readLegacyRecords());
  return uniqStrings([...v1, ...legacy]);
}

/**
 * Persist names into v1 (primary). Optionally mirror into legacy key as best-effort
 * (only when legacy is present) to keep older UI surfaces from diverging.
 */
export function writeUnifiedFavoriteNames(names, { mirrorLegacy = true } = {}) {
  const next = uniqStrings(names);
  persistFavoritesArray(next);

  if (!mirrorLegacy || typeof window === 'undefined') return;

  // Mirror only if legacy key exists to avoid creating a new backend-like format.
  const hasLegacy = localStorage.getItem(LEGACY_KEY) != null;
  if (!hasLegacy) return;

  const legacy = readLegacyRecords();
  const legacyByName = new Map(
    (Array.isArray(legacy) ? legacy : [])
      .filter((r) => r && typeof r === 'object' && r.name)
      .map((r) => [String(r.name), r])
  );

  const mirrored = next.map((n) => {
    const existing = legacyByName.get(n);
    if (existing) return existing;
    // Minimal record that won't break consumers expecting { name, nameId, addedDate }.
    return {
      nameId: String(n).toLowerCase().replace(/\s+/g, '_'),
      name: String(n),
      category: existing?.category || 'General',
      gameType: existing?.gameType || 'General',
      gender: existing?.gender || 'Neutral',
      addedDate: new Date().toISOString(),
      copyCount: 0,
      rating: 5,
    };
  });

  try {
    localStorage.setItem(LEGACY_KEY, JSON.stringify(mirrored));
  } catch {
    // ignore
  }
}

export function getFavoritesPrimaryKey() {
  return FAVORITES_V1_KEY;
}

