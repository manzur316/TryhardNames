const STORAGE_KEY = 'tryhardnames:analytics:v1';

const LIMITS = {
  events: 250,
  topNames: 50,
  topPages: 50,
};

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function readStore() {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      v: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      events: [],
      counters: {},
      topCopiedNames: {},
      topFavorites: {},
      topQuickModes: {},
      topPages: {},
    };
  }
  const parsed = safeJsonParse(raw, null);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
}

function writeStore(store) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function inc(map, key, by = 1) {
  if (!key) return;
  map[key] = (map[key] || 0) + by;
}

function trimTop(map, limit) {
  const entries = Object.entries(map);
  if (entries.length <= limit) return map;
  entries.sort((a, b) => b[1] - a[1]);
  const trimmed = {};
  for (const [k, v] of entries.slice(0, limit)) trimmed[k] = v;
  return trimmed;
}

/**
 * Lightweight local analytics.
 *
 * @param {string} type
 * @param {object} payload
 * @param {object} [opts]
 * @param {boolean} [opts.flush=true] - write to storage immediately
 */
export function trackEvent(type, payload = {}, opts = {}) {
  if (!isBrowser()) return null;
  const flush = opts.flush !== false;

  const store = readStore();
  if (!store) return null;

  const event = {
    type,
    ts: nowIso(),
    ...payload,
  };

  store.updatedAt = event.ts;
  store.events = [event, ...(store.events || [])].slice(0, LIMITS.events);
  store.counters = store.counters || {};
  inc(store.counters, type);

  // derived stats
  const page = payload.pageSlug || payload.page || payload.slug;
  if (page) {
    store.topPages = store.topPages || {};
    inc(store.topPages, page);
    store.topPages = trimTop(store.topPages, LIMITS.topPages);
  }

  if (type === 'COPY_NAME' && payload.name) {
    store.topCopiedNames = store.topCopiedNames || {};
    inc(store.topCopiedNames, payload.name);
    store.topCopiedNames = trimTop(store.topCopiedNames, LIMITS.topNames);
  }

  if ((type === 'SAVE_FAVORITE' || type === 'REMOVE_FAVORITE') && payload.name) {
    store.topFavorites = store.topFavorites || {};
    inc(store.topFavorites, payload.name, type === 'SAVE_FAVORITE' ? 1 : -1);
    // remove zero/negative
    for (const [k, v] of Object.entries(store.topFavorites)) {
      if (v <= 0) delete store.topFavorites[k];
    }
    store.topFavorites = trimTop(store.topFavorites, LIMITS.topNames);
  }

  if (type === 'QUICK_MODE_USED' && payload.mode) {
    store.topQuickModes = store.topQuickModes || {};
    inc(store.topQuickModes, payload.mode);
    store.topQuickModes = trimTop(store.topQuickModes, 25);
  }

  if (flush) writeStore(store);
  return event;
}

export function getAnalyticsSnapshot(opts = {}) {
  const store = readStore();
  if (!store) return null;
  const eventsLimit = typeof opts.eventsLimit === 'number' ? Math.max(0, Math.min(250, opts.eventsLimit)) : 30;

  const toTopList = (map, n) =>
    Object.entries(map || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([k, v]) => ({ key: k, count: v }));

  return {
    version: store.v,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    counters: store.counters || {},
    recentEvents: (store.events || []).slice(0, eventsLimit),
    topCopiedNames: toTopList(store.topCopiedNames, 10),
    topFavorites: toTopList(store.topFavorites, 10),
    topQuickModes: toTopList(store.topQuickModes, 10),
    topPages: toTopList(store.topPages, 10),
  };
}

export function clearAnalytics() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

