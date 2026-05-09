import { evolveContextualName, getContextKeyFromPage } from '@/utils/contextualNameEngine.js';

function hashString(s) {
  const str = String(s || '');
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed) {
  if (!arr || !arr.length) return null;
  const i = Math.abs(seed) % arr.length;
  return arr[i];
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean).map(String))];
}

function alphaChunk(name) {
  const m = String(name || '').match(/[A-Za-z]+/g);
  return m ? m.join('') : String(name || '').replace(/[^\w]/g, '');
}

function clanTagFromName(name, opts = {}) {
  const clean = alphaChunk(name).toUpperCase();
  const letters = clean.replace(/[^A-Z]/g, '');
  const seed = hashString(name + (opts.contextKey || ''));
  if (!letters) return 'TAG';

  // Prefer 3 letters; if short, pad with context hint.
  const base = letters.slice(0, 3);
  if (base.length === 3) return base;

  const pad = (opts.contextKey === 'valorant' ? 'VCT' : opts.contextKey === 'cs2' ? 'OG' : 'GG').toUpperCase();
  return (base + pad).slice(0, 3);
}

const SYMBOLS = {
  valorant: ['✦', '◇', '⚡', '•'],
  roblox: ['✧', '♡', '✿', '✨'],
  'gta-rp': ['♛', '♦', '✦', '⚜'],
  cs2: ['◆', '•', '✦', '⚡'],
  minecraft: ['⚔️', '⛏️', '✧', '♜'],
};

const VIBE = {
  valorant: ['Tactical Duelist', 'Clean Controller', 'Radiant IGL', 'Sentinel Anchor'],
  roblox: ['Soft Creator', 'Aesthetic Handle', 'Kawaii Avatar Vibe', 'TikTok Core'],
  'gta-rp': ['Luxury RP Persona', 'Mafia Identity', 'Cartel Alias', 'Street Boss'],
  cs2: ['OG Minimal', 'Clean Esports Tag', 'One‑Word Alias', 'Premium Handle'],
  minecraft: ['SMP Guild Vibe', 'Medieval Adventurer', 'Survival Crafter', 'Fantasy Title'],
};

const BIOS = {
  valorant: [
    'Clean aim. No second chances.',
    'Hold angles. Win rounds.',
    'One tap mindset.',
    'Prime peek. Silent reset.',
  ],
  roblox: [
    'Soft vibes. Main character energy.',
    'Creator-coded. Aesthetic only.',
    'Cute, clean, unforgettable.',
    'Avatar on point. Always.',
  ],
  'gta-rp': [
    'Quiet money. Loud reputation.',
    'Respect first. Then business.',
    'Vice city manners.',
    'Luxury taste. Street instincts.',
  ],
  cs2: [
    'No flash. All impact.',
    'Clean tag. Clean shots.',
    'OG energy. Minimal noise.',
    'Aim talks.',
  ],
  minecraft: [
    'SMP-ready. Build, survive, repeat.',
    'Medieval heart. Modern grind.',
    'From the Nether, with vibes.',
    'Guild loyal. Loot hungry.',
  ],
};

const MICRO_LABELS = {
  valorant: ['Esports-ready', 'Killfeed-readable', 'Riot UI clean'],
  roblox: ['Creator-style identity', 'Aesthetic pick', 'Bio-friendly'],
  'gta-rp': ['Luxury RP persona', 'Server-ready alias', 'Roleplay-coded'],
  cs2: ['OG tag', 'Minimal esports', 'Scoreboard clean'],
  minecraft: ['SMP guild vibe', 'Medieval aesthetic', 'Whitelist-friendly'],
};

const VARIATIONS = {
  valorant: ['more_tactical', 'more_clean'],
  roblox: ['more_creator', 'more_clean'],
  'gta-rp': ['more_luxury', 'more_og'],
  cs2: ['more_og', 'more_clean'],
  minecraft: ['more_fantasy', 'more_clean'],
};

function applyBias(contextKey, baseName, bias, seed) {
  const clean = alphaChunk(baseName);
  if (contextKey === 'valorant') {
    if (bias === 'more_tactical') return `Tap${clean}`.replace(/\s+/g, '');
    if (bias === 'more_clean') return clean.replace(/[^\w]/g, '');
  }
  if (contextKey === 'gta-rp') {
    if (bias === 'more_luxury') return `${clean}${pick(['Lux', 'Vice', 'Gold'], seed)}`;
    if (bias === 'more_og') return `${pick(['Don', 'Capo', 'El'], seed)}${clean}`;
  }
  if (contextKey === 'roblox') {
    if (bias === 'more_creator') return `${pick(['Aura', 'Plush', 'Soft', 'Moon'], seed)}${clean}${pick(['ii', 'ie'], seed + 7)}`;
    if (bias === 'more_clean') return clean.replace(/[^\w]/g, '');
  }
  if (contextKey === 'cs2') {
    if (bias === 'more_og') return clean.slice(0, 8);
    if (bias === 'more_clean') return clean.replace(/[^\w]/g, '');
  }
  if (contextKey === 'minecraft') {
    if (bias === 'more_fantasy') return `${pick(['Nether', 'Ember', 'Frost', 'Oak'], seed)}${clean}${pick(['Knight', 'Rune'], seed + 3)}`;
    if (bias === 'more_clean') return clean.replace(/[^\w]/g, '');
  }
  return String(baseName);
}

export function buildIdentityPack({ name, category, keyword, presetId, contextKey: overrideContextKey, bias } = {}) {
  const baseName = String(name || '').trim();
  const contextKey =
    overrideContextKey ||
    getContextKeyFromPage({ category, keyword, presetId }) ||
    (presetId === 'gta' ? 'gta-rp' : presetId) ||
    null;

  const safeContext = contextKey && (SYMBOLS[contextKey] ? contextKey : null);
  const seed = hashString(`${safeContext || ''}:${baseName}:${bias || ''}`);

  const biasedName = safeContext ? applyBias(safeContext, baseName, bias, seed) : baseName;
  const clanTag = clanTagFromName(biasedName, { contextKey: safeContext });
  const vibe = safeContext ? pick(VIBE[safeContext], seed) : 'Gaming identity';
  const symbols = safeContext ? SYMBOLS[safeContext] : ['✦', '•', '◇'];
  const micro = safeContext ? pick(MICRO_LABELS[safeContext], seed + 11) : null;
  const bio = safeContext ? pick(BIOS[safeContext], seed + 21) : 'Built to stand out.';

  const evolved = safeContext ? evolveContextualName({ contextKey: safeContext, baseName: biasedName }) : [];
  const alts = uniq([biasedName, ...(evolved || [])]).filter((x) => x && x !== biasedName).slice(0, 3);

  const availableVariations = safeContext ? VARIATIONS[safeContext] || [] : [];

  return {
    contextKey: safeContext,
    name: biasedName,
    clanTag: `[${clanTag}]`,
    vibe,
    altVersions: alts,
    symbols: symbols.slice(0, 3),
    bio,
    microLabel: micro,
    availableVariations,
  };
}

export function formatIdentityPack({ pack, format = 'copy' } = {}) {
  if (!pack) return '';
  const lines = [];
  if (format === 'discord') {
    lines.push(`## Identity Pack`);
    lines.push('');
    lines.push('```yaml');
    lines.push(`name: ${pack.name}`);
    lines.push(`clan: ${pack.clanTag}`);
    lines.push(`vibe: ${pack.vibe}`);
    lines.push(`alts: [${(pack.altVersions || []).join(', ')}]`);
    lines.push(`symbols: ${(pack.symbols || []).join(' ')}`);
    lines.push(`bio: "${pack.bio}"`);
    lines.push('```');
    return lines.join('\n');
  }

  if (format === 'clean') {
    lines.push(pack.name);
    lines.push(pack.clanTag);
    lines.push(pack.vibe);
    if (pack.altVersions?.length) lines.push(pack.altVersions.join(' / '));
    lines.push((pack.symbols || []).join(' '));
    lines.push(pack.bio);
    return lines.join('\n');
  }

  // default copy format (premium)
  lines.push(`IDENTITY PACK`);
  lines.push(`Name: ${pack.name}`);
  lines.push(`Clan: ${pack.clanTag}`);
  lines.push(`Vibe: ${pack.vibe}${pack.microLabel ? ` • ${pack.microLabel}` : ''}`);
  if (pack.altVersions?.length) lines.push(`Alts: ${pack.altVersions.join(' • ')}`);
  lines.push(`Symbols: ${(pack.symbols || []).join(' ')}`);
  lines.push(`Bio: ${pack.bio}`);
  return lines.join('\n');
}

