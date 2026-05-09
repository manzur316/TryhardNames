import { copyTextToClipboard } from '@/utils/clipboard.js';
import { getAnalyticsSnapshot } from '@/utils/analytics.js';

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean).map(String))];
}

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

function readFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tryhardnames:favorites:v1');
    const parsed = safeJsonParse(raw, []);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function getRecentlyCopiedNames(limit = 8) {
  const snap = getAnalyticsSnapshot({ eventsLimit: 250 });
  if (!snap?.recentEvents?.length) return [];
  const out = [];
  for (const e of snap.recentEvents) {
    if (e?.type !== 'COPY_NAME') continue;
    const n = String(e?.name || '').trim();
    if (!n) continue;
    out.push(n);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Context-aware selection:
 * favorites → recently copied → current
 */
export function buildContextAwareDiscordPackNames({ currentName, max = 6 } = {}) {
  const favorites = readFavorites();
  const copied = getRecentlyCopiedNames(10);
  const current = currentName ? [String(currentName)] : [];
  const names = uniq([...favorites, ...copied, ...current]).slice(0, max);
  return names;
}

export function buildDiscordNamePack({ title = 'Tryhard Name Pack', names = [], originUrl } = {}) {
  const list = uniq(names).slice(0, 16);
  const lines = [];
  lines.push(`# ${String(title).trim() || 'Tryhard Name Pack'}`);
  lines.push('');
  for (const n of list.length ? list : ['GhostVCT']) {
    lines.push(`• ${n}`);
  }
  lines.push('');
  lines.push('Generated on TryhardNames.com');
  if (originUrl) lines.push(String(originUrl));
  return lines.join('\n');
}

export async function exportDiscordNamePackToClipboard({ title, names, originUrl } = {}) {
  const text = buildDiscordNamePack({ title, names, originUrl });
  const res = await copyTextToClipboard(text, { preventRepeatMs: 650, vibrateMs: 14 });
  return { ...res, text };
}

