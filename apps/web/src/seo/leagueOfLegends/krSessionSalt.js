/**
 * Controlled session variability — KR lane browser session only.
 * Ecology salt = stable UUID per tab session + monotonic draw counter (deterministic rebuilds, no Math.random chaos).
 */

const STORAGE_KEY = 'tryhardnames:kr-ecology-session:v1';

let fallbackId = 0;
function safeUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  fallbackId += 1;
  return `kr-fb-${Date.now()}-${fallbackId}`;
}

/**
 * Read persisted session + draw index; first visit allocates session base.
 * @returns {{ effectiveSalt: string, sessionBase: string, drawIndex: number }}
 */
export function readKrEcologySession() {
  if (typeof sessionStorage === 'undefined') {
    return { effectiveSalt: 'kr-client-static', sessionBase: 'kr-client-static', drawIndex: 0 };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const sessionBase = typeof p.sessionBase === 'string' ? p.sessionBase : safeUuid();
      const drawIndex = Number.isFinite(p.drawIndex) ? Math.max(0, Math.floor(p.drawIndex)) : 0;
      const effectiveSalt = `${sessionBase}:${drawIndex}`;
      return { effectiveSalt, sessionBase, drawIndex };
    }
  } catch {
    // fall through
  }
  const sessionBase = safeUuid();
  const drawIndex = 0;
  const effectiveSalt = `${sessionBase}:${drawIndex}`;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionBase, drawIndex, updatedAt: Date.now() }),
    );
  } catch {
    // ignore
  }
  return { effectiveSalt, sessionBase, drawIndex };
}

/**
 * Increment draw index (New draw) — new ecology from same session universe.
 * @returns {string} effectiveSalt for buildLolKoreanSummonerNamesDetailed
 */
export function bumpKrEcologyDraw() {
  if (typeof sessionStorage === 'undefined') {
    return `kr-bump-${Date.now()}`;
  }
  const cur = readKrEcologySession();
  const nextIndex = cur.drawIndex + 1;
  const effectiveSalt = `${cur.sessionBase}:${nextIndex}`;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionBase: cur.sessionBase, drawIndex: nextIndex, updatedAt: Date.now() }),
    );
  } catch {
    // ignore
  }
  return effectiveSalt;
}

export function clearKrEcologySession() {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
