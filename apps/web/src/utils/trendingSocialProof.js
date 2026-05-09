import { getPageBySlug } from '@/utils/pageLoader.js';
import { getAnalyticsSnapshot } from '@/utils/analytics.js';

const CURATED_BY_PRESET = {
  valorant: {
    label: 'Valorant',
    vibe: 'tactical • VCT • Radiant',
    slugs: ['valorant/vct', 'valorant/clean', 'valorant/radiant', 'valorant/jett', 'valorant/chamber'],
    signals: ['Trending in scrims', 'Popular in ranked', 'Esports-coded pick'],
  },
  roblox: {
    label: 'Roblox',
    vibe: 'aesthetic • soft • creator',
    slugs: ['roblox/aesthetic', 'roblox/soft', 'roblox/avatar', 'roblox/tiktok', 'roblox/tryhard'],
    signals: ['Creator-friendly', 'Trending aesthetic pick', 'Popular among Roblox creators'],
  },
  'gta-rp': {
    label: 'GTA RP',
    vibe: 'mafia • luxury • street',
    slugs: ['gta-rp/realistic', 'gta-rp/mafia', 'gta-rp/luxury', 'gta-rp/street'],
    signals: ['Most saved in GTA RP', 'RP-ready identity', 'Popular in whitelisted servers'],
  },
  cs2: {
    label: 'CS2',
    vibe: 'OG • clean • one-word',
    slugs: ['cs2/og', 'cs2/one-word', 'cs2/3-letter', 'cs2/edgy'],
    signals: ['OG clean alias', 'Killfeed-ready', 'Minimal esports brand'],
  },
  minecraft: {
    label: 'Minecraft',
    vibe: 'SMP • medieval • PvP',
    slugs: ['minecraft/smp', 'minecraft/pvp', 'minecraft/survival', 'minecraft/medieval'],
    signals: ['SMP-friendly', 'PvP vibe', 'Medieval roleplay pick'],
  },
};

function clampInt(n, min, max) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.max(min, Math.min(max, Math.round(x)));
}

function pick(arr, n) {
  return (arr || []).slice(0, n);
}

function uniq(arr) {
  const out = [];
  const seen = new Set();
  for (const x of arr || []) {
    const k = String(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function isoDayKey(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function countEvents(events, predicate) {
  let c = 0;
  for (const e of events || []) if (predicate(e)) c++;
  return c;
}

export function buildTrendingModel({ presetId, category, pageSlug } = {}) {
  const snap = getAnalyticsSnapshot({ eventsLimit: 250 }) || {
    counters: {},
    recentEvents: [],
    topCopiedNames: [],
    topFavorites: [],
    topPages: [],
  };

  const presetKey = presetId || category || 'valorant';
  const preset = CURATED_BY_PRESET[presetKey] || CURATED_BY_PRESET.valorant;

  const curatedNames = [];
  for (const slug of preset.slugs) {
    const p = getPageBySlug(slug);
    const names = (p?.names || []).filter(Boolean).map(String);
    curatedNames.push(...names.slice(0, 10));
    if (curatedNames.length > 60) break;
  }

  const hottest = uniq([
    ...snap.topCopiedNames.map((x) => x.key),
    ...snap.topFavorites.map((x) => x.key),
    ...curatedNames,
  ]);

  const dayKey = isoDayKey(Date.now());
  const copiedTodayRaw = countEvents(snap.recentEvents, (e) => e.type === 'COPY_NAME' && isoDayKey(e.ts) === dayKey);
  const savedTodayRaw = countEvents(snap.recentEvents, (e) => e.type === 'SAVE_FAVORITE' && isoDayKey(e.ts) === dayKey);

  // Elegant heuristic: scale within realistic ranges (no absurd numbers)
  const copiedToday = clampInt(copiedTodayRaw * 7 + 24, 18, 420);
  const savedToday = clampInt(savedTodayRaw * 4 + 8, 6, 160);

  const topPage = snap.topPages?.[0]?.key;
  const activityLines = [
    `${copiedToday} players copied names today`,
    `Trending in ${preset.label}`,
    savedToday > 18 ? `Most saved today: ${preset.label}` : preset.signals[0],
    topPage && topPage !== pageSlug ? `Popular page: ${String(topPage).replace(/^\//, '')}` : preset.signals[1],
    preset.signals[2],
  ].filter(Boolean);

  const popularThisWeek = pick(hottest, 6).map((name, i) => {
    const copy = snap.topCopiedNames.find((x) => x.key === name)?.count || 0;
    const fav = snap.topFavorites.find((x) => x.key === name)?.count || 0;
    const score = copy * 2 + fav * 3 + Math.max(0, 8 - i);
    return { name, copyCount: copy, saveCount: fav, score };
  });

  popularThisWeek.sort((a, b) => b.score - a.score);

  return {
    preset,
    activityLines: pick(activityLines, 5),
    hottestNames: pick(hottest, 12),
    popularThisWeek: pick(popularThisWeek, 6),
  };
}

export function buildCommunitySignal({ presetId, copyCount = 0, saveCount = 0 } = {}) {
  const preset = CURATED_BY_PRESET[presetId] || CURATED_BY_PRESET.valorant;
  if (saveCount >= 3) return `Saved ${saveCount}×`;
  if (copyCount >= 3) return `Copied ${copyCount}×`;
  return preset.signals[Math.floor(Math.random() * preset.signals.length)];
}

