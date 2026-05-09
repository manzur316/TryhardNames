import { CONTEXTUAL_NAMING_DATA } from '@/data/contextualNamingData.js';

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean).map(String))];
}

/** Caps evolve base so Tap+prefix loops cannot compound into megastrings */
function normalizeEvolveCore(raw, maxLen = 14) {
  const clean = String(raw || '').replace(/[^\w]/g, '');
  if (!clean.length) return 'Tag';
  return clean.length <= maxLen ? clean : clean.slice(0, maxLen);
}

function titleCase(s) {
  const str = String(s);
  return str.length ? str[0].toUpperCase() + str.slice(1) : str;
}

function renderPattern(pattern, ctx) {
  return pattern
    .replace('{verb}', () => pick(ctx.verbs || ctx.fragments || ['Prime']))
    .replace('{noun}', () => pick(ctx.nouns || ctx.cores || ctx.fragments || ['Ghost']))
    .replace('{tag}', () => pick(ctx.tags || ['VCT']))
    .replace('{prefix}', () => pick(ctx.prefixes || ['Aura']))
    .replace('{core}', () => pick(ctx.cores || ['Pixel']))
    .replace('{suffix}', () => pick(ctx.suffixes || ['ii']))
    .replace('{first}', () => pick(ctx.firstNames || ['Luca']))
    .replace('{last}', () => pick(ctx.lastNames || ['Santos']))
    .replace('{title}', () => pick(ctx.titles || ['Don']))
    .replace('{lux}', () => pick(ctx.luxBits || ['Lux']))
    .replace('{one}', () => pick(ctx.oneWords || ['Nyx']))
    .replace('{frag}', () => pick(ctx.fragments || ['Volt']))
    .replace('{dot}', () => '.');
}

export function getContextKeyFromPage({ category, keyword, presetId } = {}) {
  const c = presetId || category;
  if (c === 'gta') return 'gta-rp';
  if (c === 'gta-rp') return 'gta-rp';
  if (c === 'minecraft') return 'minecraft';
  if (c === 'cs2') return 'cs2';
  if (c === 'roblox') return 'roblox';
  if (c === 'valorant') return 'valorant';
  // allow keyword to hint cluster
  if (keyword === 'mafia' || keyword === 'luxury' || keyword === 'cartel') return 'gta-rp';
  if (keyword === 'smp' || keyword === 'pvp' || keyword === 'medieval') return 'minecraft';
  if (keyword === 'og' || keyword === 'one-word' || keyword === '3-letter') return 'cs2';
  if (keyword === 'soft' || keyword === 'aesthetic' || keyword === 'tiktok' || keyword === 'avatar') return 'roblox';
  if (keyword === 'jett' || keyword === 'vct' || keyword === 'radiant' || keyword === 'clean') return 'valorant';
  return null;
}

export function generateContextualNames({ contextKey, count = 24 } = {}) {
  const ctx = CONTEXTUAL_NAMING_DATA[contextKey];
  if (!ctx) return [];
  const patterns = ctx.patterns || ['{noun}{tag}'];
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 12) {
    const base = renderPattern(pick(patterns), ctx);
    const name =
      contextKey === 'roblox'
        ? base.replace(/\s+/g, '')
        : contextKey === 'cs2'
          ? base.replace(/\s+/g, '')
          : base.replace(/\s+/g, '');
    out.push(titleCase(name));
  }
  return uniq(out).slice(0, count);
}

export function evolveContextualName({ contextKey, baseName } = {}) {
  const ctx = CONTEXTUAL_NAMING_DATA[contextKey];
  const base = String(baseName || '').replace(/\s+/g, '');
  if (!ctx) return uniq([base]).slice(0, 6);

  if (contextKey === 'valorant') {
    const pre = pick(ctx.evolve?.prefixes || ['Tap']);
    const suf = pick(ctx.evolve?.suffixes || ['VCT']);
    const clean = normalizeEvolveCore(base, 12);
    return uniq([clean, `${clean}${suf}`, `${pre}${clean}`, `${pre}${clean}${suf}`, `${clean}${suf}${Math.random() > 0.6 ? 'RR' : ''}`]).slice(0, 6);
  }

  if (contextKey === 'gta-rp') {
    const pre = pick(ctx.evolve?.titlePrefixes || ['Don']);
    const lux = pick(ctx.evolve?.luxSuffixes || ['Lux']);
    const clean = normalizeEvolveCore(base, 14);
    return uniq([clean, `${pre}${clean}`, `${clean}${lux}`, `${pre}${clean}${lux}`, `${clean}${pick(['Vice', 'Gold', 'Noir'])}`]).slice(0, 6);
  }

  if (contextKey === 'roblox') {
    const soft = pick(ctx.evolve?.softPrefixes || ['Soft']);
    const suf = pick(ctx.evolve?.softenSuffixes || ['ii']);
    const clean = normalizeEvolveCore(base, 14);
    return uniq([clean, `${clean}${suf}`, `${soft}${clean}`, `${soft}${clean}${suf}`, `${clean}${pick(['xo', 'luv', 'ie'])}`]).slice(0, 6);
  }

  if (contextKey === 'cs2') {
    const clean = normalizeEvolveCore(base, 12);
    const suf = pick(ctx.evolve?.suffixes || ['.']);
    return uniq([clean, `${clean}${suf}`, clean.toUpperCase(), clean.toLowerCase(), `${clean}${pick(['OG', 'PRO'])}`]).slice(0, 6);
  }

  if (contextKey === 'minecraft') {
    const pre = pick(ctx.evolve?.realmPrefixes || ['Nether']);
    const suf = pick(ctx.evolve?.medievalSuffixes || ['Knight']);
    const clean = normalizeEvolveCore(base, 14);
    return uniq([clean, `${pre}${clean}`, `${clean}${suf}`, `${pre}${clean}${suf}`, `${clean}${pick(['Rune', 'Craft'])}`]).slice(0, 6);
  }

  return uniq([base]).slice(0, 6);
}

export function pickWhyThisWorks({ contextKey } = {}) {
  const ctx = CONTEXTUAL_NAMING_DATA[contextKey];
  if (!ctx?.why?.length) return null;
  return pick(ctx.why);
}

export function getContextLabel({ contextKey } = {}) {
  return CONTEXTUAL_NAMING_DATA[contextKey]?.label || null;
}

