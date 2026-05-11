/**
 * Identity Kit V1 — conceptual unit: a paste-ready bundle for how you read online,
 * not a random string tool. Persisted locally only (no accounts in V1).
 */

import { formatCultureBundleAppendix } from './identityCultureNotes.js';

export const IDENTITY_KIT_STORAGE_KEY = 'tryhardnames:identity-kit:v1';

/** Where the alias is meant to live — informs copy hints, not validation rules in V1 */
export const IDENTITY_SURFACES = [
  { id: 'generic', label: 'General profile', hint: 'Paste anywhere · universal read' },
  { id: 'riot', label: 'Riot client', hint: 'Compact · summoner culture' },
  { id: 'discord', label: 'Discord', hint: 'Username + bio rhythm' },
  { id: 'twitch', label: 'Twitch', hint: 'Overlay-safe length' },
  { id: 'steam', label: 'Steam', hint: 'Clean roman characters' },
  { id: 'roblox', label: 'Roblox', hint: 'Profile + discoverability' },
];

export const IDENTITY_MOODS = [
  { id: 'calm', label: 'Calm' },
  { id: 'sharp', label: 'Sharp' },
  { id: 'soft', label: 'Soft' },
  { id: 'neutral', label: 'Neutral' },
];

/** Readability tier — editorial labels (no internal letter codes in UI) */
export const READABILITY_TIERS = [
  { id: 'A', label: 'Legibility-first' },
  { id: 'B', label: 'Balanced read' },
  { id: 'C', label: 'Expressive read' },
];

/** Official export layouts — two controlled templates only */
export const ARTIFACT_LAYOUTS = [
  { id: 'vertical', label: 'Vertical profile card' },
  { id: 'banner', label: 'Horizontal banner' },
];

export function defaultIdentityKit() {
  return {
    kitLabel: '',
    primaryAlias: '',
    styledAlias: '',
    symbolLine: '',
    bioLine: '',
    surfaceId: 'generic',
    moodId: 'neutral',
    readabilityTier: 'B',
    artifactLayout: 'vertical',
  };
}

export function normalizeIdentityKit(raw) {
  const d = defaultIdentityKit();
  if (!raw || typeof raw !== 'object') return d;
  return {
    ...d,
    ...raw,
    kitLabel: String(raw.kitLabel ?? '').slice(0, 48),
    primaryAlias: String(raw.primaryAlias ?? '').slice(0, 64),
    styledAlias: String(raw.styledAlias ?? '').slice(0, 120),
    symbolLine: String(raw.symbolLine ?? '').slice(0, 96),
    bioLine: String(raw.bioLine ?? '').slice(0, 200),
    surfaceId: IDENTITY_SURFACES.some((s) => s.id === raw.surfaceId) ? raw.surfaceId : d.surfaceId,
    moodId: IDENTITY_MOODS.some((m) => m.id === raw.moodId) ? raw.moodId : d.moodId,
    readabilityTier: ['A', 'B', 'C'].includes(raw.readabilityTier) ? raw.readabilityTier : d.readabilityTier,
    artifactLayout: ARTIFACT_LAYOUTS.some((l) => l.id === raw.artifactLayout) ? raw.artifactLayout : d.artifactLayout,
  };
}

export function loadIdentityKitFromStorage() {
  if (typeof window === 'undefined') return defaultIdentityKit();
  try {
    const raw = JSON.parse(localStorage.getItem(IDENTITY_KIT_STORAGE_KEY) || 'null');
    return normalizeIdentityKit(raw);
  } catch {
    return defaultIdentityKit();
  }
}

export function saveIdentityKitToStorage(kit) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(IDENTITY_KIT_STORAGE_KEY, JSON.stringify(normalizeIdentityKit(kit)));
  } catch {
    // ignore quota
  }
}

/**
 * Plain-text bundle: paste into notes, Discord, or ship with exports.
 */
export function buildIdentityKitBundle(kit, { origin } = {}) {
  const k = normalizeIdentityKit(kit);
  const surface = IDENTITY_SURFACES.find((s) => s.id === k.surfaceId)?.label || k.surfaceId;
  const mood = IDENTITY_MOODS.find((m) => m.id === k.moodId)?.label || k.moodId;
  const lines = [];
  lines.push('TryhardNames · Identity Kit');
  lines.push('—'.repeat(32));
  if (k.kitLabel) lines.push(`Label: ${k.kitLabel}`);
  lines.push('');
  lines.push(`Primary read: ${k.primaryAlias || '—'}`);
  if (k.styledAlias) lines.push(`Styled display: ${k.styledAlias}`);
  if (k.symbolLine) lines.push(`Symbol line: ${k.symbolLine}`);
  if (k.bioLine) lines.push(`Bio line: ${k.bioLine}`);
  lines.push('');
  lines.push(`Surface (label): ${surface}`);
  lines.push(`Readability tier: ${k.readabilityTier}`);
  lines.push(`Mood: ${mood}`);
  const layoutLabel = ARTIFACT_LAYOUTS.find((l) => l.id === k.artifactLayout)?.label || 'Vertical profile card';
  lines.push(`Artifact layout: ${layoutLabel}`);
  lines.push('');
  lines.push('One bundle — tune spacing and characters per platform.');
  lines.push(...formatCultureBundleAppendix(k));

  if (origin) lines.push('', origin);
  return lines.join('\n');
}

export function moodAccentClass(moodId) {
  const map = {
    calm: 'border-l-cyan-500/70',
    sharp: 'border-l-amber-500/70',
    soft: 'border-l-rose-400/60',
    neutral: 'border-l-slate-500/50',
  };
  return map[moodId] || map.neutral;
}
