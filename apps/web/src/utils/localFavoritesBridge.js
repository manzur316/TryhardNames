/**
 * Cross-surface sync for tryhardnames:favorites:v1 (read / notify only).
 * Does not change storage format or keys.
 */

export const FAVORITES_V1_KEY = 'tryhardnames:favorites:v1';

const CHANGED = 'tryhardnames:favorites:v1:changed';

export function readFavoritesArray() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_V1_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export function notifyFavoritesChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CHANGED));
}

export function subscribeFavorites(onChange) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onChange();
  const onStorage = (e) => {
    if (e.key === FAVORITES_V1_KEY || e.key === null) onChange();
  };
  window.addEventListener(CHANGED, handler);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGED, handler);
    window.removeEventListener('storage', onStorage);
  };
}

export function persistFavoritesArray(names) {
  const arr = [...new Set((names || []).map(String).map((s) => s.trim()).filter(Boolean))];
  try {
    localStorage.setItem(FAVORITES_V1_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
  notifyFavoritesChanged();
}

export function removeFavoriteName(name) {
  const key = String(name || '').trim();
  if (!key) return;
  const next = readFavoritesArray().filter((x) => x !== key);
  persistFavoritesArray(next);
}
