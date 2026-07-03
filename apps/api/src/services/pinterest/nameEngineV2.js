const SUPPORTED_STYLES = Object.freeze([
  'clean',
  'sweaty',
  'dark',
  'aesthetic',
  'funny',
  'streamer',
  'brandable',
]);

const CONTEXTS = Object.freeze([
  'valorant',
  'roblox',
  'fortnite',
  'league-of-legends',
  'gamer-names',
  'social',
]);

const BLOCKED_EXACT_NAMES = new Set([
  'faker',
  'tenz',
  'chovy',
  's1mple',
  'simple',
  'scump',
  'caps',
  'showmaker',
  'rookie',
  'tarik',
  'yay',
  'aspas',
  'derke',
  'boaster',
  'rekkles',
  'doublelift',
  'bjergsen',
  'ninja',
  'shroud',
]);

const STYLE_PARTS = Object.freeze({
  clean: {
    prefixes: ['Clear', 'Prime', 'Noble', 'Slate', 'True', 'Bright', 'North', 'Fresh', 'Core', 'Linear'],
    stems: ['Signal', 'Vertex', 'Mode', 'Pulse', 'Frame', 'Orbit', 'Glyph', 'Anchor', 'Vector', 'Flow'],
    suffixes: ['Tag', 'Arc', 'Key', 'Unit', 'Lane', 'Mark', 'Sync', 'Form', 'Pilot', 'Line'],
    modifiers: ['', '', '', 'HQ', 'One', 'Labs', 'Club', 'Studio'],
  },
  sweaty: {
    prefixes: ['Clutch', 'Rapid', 'Peak', 'Zero', 'Flick', 'Lock', 'Rush', 'Sharp', 'Prime', 'Stack'],
    stems: ['Angle', 'Cross', 'Burst', 'Reset', 'Entry', 'Focus', 'Strafe', 'Vandal', 'Zone', 'Drop'],
    suffixes: ['Shift', 'Core', 'Win', 'Tap', 'Dash', 'Cue', 'Line', 'Cast', 'Mark', 'Point'],
    modifiers: ['', '', '', 'X', 'V2', 'One', 'Labs', 'Stack'],
  },
  dark: {
    prefixes: ['Void', 'Grim', 'Obsidian', 'Raven', 'Hex', 'Night', 'Noir', 'Dusk', 'Vanta', 'Shade'],
    stems: ['Warden', 'Cipher', 'Hollow', 'Rift', 'Signal', 'Blade', 'Veil', 'Orbit', 'Specter', 'Crown'],
    suffixes: ['Fall', 'Lock', 'Trace', 'Mark', 'Drift', 'Vale', 'Fang', 'Rune', 'Line', 'Echo'],
    modifiers: ['', '', '', 'X', 'Nine', 'Labs', 'Unit', 'Core'],
  },
  aesthetic: {
    prefixes: ['Luna', 'Velvet', 'Peach', 'Misty', 'Pearl', 'Bloom', 'Aurora', 'Honey', 'Soft', 'Ivy'],
    stems: ['Cloud', 'Dawn', 'Petal', 'Wish', 'Muse', 'Lake', 'Nova', 'Meadow', 'Glow', 'Charm'],
    suffixes: ['Club', 'Ray', 'Era', 'Room', 'Loop', 'Nest', 'Note', 'Path', 'Mood', 'Sky'],
    modifiers: ['', '', '', 'xo', 'diary', 'studio', 'day', 'lane'],
  },
  funny: {
    prefixes: ['Snack', 'Lobby', 'Oops', 'Waffle', 'Potato', 'Tilted', 'Panic', 'Bean', 'Toast', 'Noodle'],
    stems: ['Wizard', 'Captain', 'Glitchless', 'Button', 'Sprinter', 'Camper', 'Keyboard', 'Ping', 'Pickle', 'Helmet'],
    suffixes: ['Mode', 'Boss', 'Club', 'Quest', 'Taxi', 'Energy', 'Legend', 'Moment', 'Arc', 'Patch'],
    modifiers: ['', '', '', '3000', 'Deluxe', 'Junior', 'Prime', 'Party'],
  },
  streamer: {
    prefixes: ['Live', 'Clip', 'Studio', 'Hype', 'Chat', 'Prime', 'Daily', 'Cast', 'Raid', 'Vibe'],
    stems: ['Signal', 'Lobby', 'Cam', 'Queue', 'Overlay', 'Spark', 'Channel', 'Scene', 'Moment', 'Wave'],
    suffixes: ['TV', 'Live', 'Plays', 'HQ', 'Cast', 'Club', 'Room', 'Labs', 'Show', 'Stack'],
    modifiers: ['', '', '', 'Now', 'Plus', 'Daily', 'Squad', 'Studio'],
  },
  brandable: {
    prefixes: ['Nova', 'Kairo', 'Zento', 'Vexa', 'Orbi', 'Lumo', 'Koda', 'Astra', 'Nexo', 'Riven'],
    stems: ['Forge', 'Pilot', 'Signal', 'Vibe', 'Atlas', 'Quest', 'Nexus', 'Glyph', 'Tempo', 'Craft'],
    suffixes: ['ly', 'io', 'ix', 'up', 'lab', 'base', 'deck', 'loop', 'works', 'grid'],
    modifiers: ['', '', '', 'HQ', 'Labs', 'Club', 'Go', 'One'],
  },
});

const CONTEXT_PARTS = Object.freeze({
  valorant: {
    prefixes: ['Ace', 'Spike', 'Haven', 'Lotus', 'Bind', 'Duel', 'Clutch', 'Angle'],
    stems: ['Entry', 'Crosshair', 'Recon', 'Tap', 'Flash', 'Anchor', 'Retake', 'Lineup'],
    suffixes: ['Peak', 'Shift', 'Cue', 'Site', 'Pulse', 'Focus', 'Gate', 'Round'],
  },
  roblox: {
    prefixes: ['Block', 'Blox', 'Obby', 'Pixel', 'Brick', 'Quest', 'Tycoon', 'Rift'],
    stems: ['Builder', 'Avatar', 'Jump', 'Portal', 'Craft', 'Studio', 'World', 'Dash'],
    suffixes: ['Kid', 'Crew', 'Wave', 'Pilot', 'Zone', 'Mode', 'Spark', 'Tag'],
  },
  fortnite: {
    prefixes: ['Storm', 'Drop', 'Build', 'Glide', 'Loot', 'Zone', 'Ramp', 'Edit'],
    stems: ['Box', 'Crank', 'Island', 'Bloom', 'Dropper', 'Reset', 'Launch', 'Pulse'],
    suffixes: ['Rush', 'Peak', 'Shift', 'Pad', 'Wave', 'Dash', 'Cue', 'Stack'],
  },
  'league-of-legends': {
    prefixes: ['Rift', 'Baron', 'Rune', 'Nexus', 'Minion', 'Lantern', 'Dragon', 'Ward'],
    stems: ['Lantern', 'Wave', 'Jungle', 'Lane', 'Oracle', 'Crest', 'Gank', 'Roam'],
    suffixes: ['Bloom', 'Call', 'Path', 'Guard', 'Pulse', 'Crown', 'Wing', 'Vale'],
  },
  'gamer-names': {
    prefixes: ['Game', 'Quest', 'Pixel', 'Arcade', 'Combo', 'Nova', 'Button', 'Hero'],
    stems: ['Signal', 'Player', 'Quest', 'Lobby', 'Avatar', 'Combo', 'Arc', 'Mode'],
    suffixes: ['Tag', 'Crew', 'Pilot', 'Stack', 'Flow', 'Cue', 'Dash', 'Point'],
  },
  social: {
    prefixes: ['Social', 'Chat', 'Pixel', 'Status', 'Handle', 'Profile', 'Link', 'Vibe'],
    stems: ['Handle', 'Server', 'Signal', 'Avatar', 'Thread', 'Channel', 'Badge', 'Room'],
    suffixes: ['Club', 'HQ', 'Loop', 'Lab', 'Mode', 'Desk', 'Flow', 'Cast'],
  },
});

const STYLE_BY_CONTEXT = Object.freeze({
  valorant: 'sweaty',
  roblox: 'funny',
  fortnite: 'sweaty',
  'league-of-legends': 'dark',
  'gamer-names': 'brandable',
  social: 'brandable',
});

function hashString(s) {
  let h = 2166136261 >>> 0;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rnd, values) {
  return values[Math.floor(rnd() * values.length)];
}

function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toTitleToken(value) {
  const s = String(value || '').trim();
  if (!s) return '';
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

function safeJoinName(parts) {
  const compact = parts.filter(Boolean).join('');
  return compact.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24);
}

function resolveStyle(style, context) {
  const normalized = String(style || '').trim().toLowerCase();
  if (SUPPORTED_STYLES.includes(normalized)) return normalized;
  return STYLE_BY_CONTEXT[context] || 'brandable';
}

export function resolveNameContext(topicOrContext) {
  const raw = String(topicOrContext || '').trim().toLowerCase();
  if (CONTEXTS.includes(raw)) return raw;
  if (raw.includes('valorant')) return 'valorant';
  if (raw.includes('roblox') || raw.includes('blox')) return 'roblox';
  if (raw.includes('fortnite')) return 'fortnite';
  if (raw.includes('league') || raw.includes('lol')) return 'league-of-legends';
  if (raw.includes('discord') || raw.includes('social') || raw.includes('brandable')) return 'social';
  return 'gamer-names';
}

function buildCandidate({ rnd, style, context, index }) {
  const styleParts = STYLE_PARTS[style];
  const contextParts = CONTEXT_PARTS[context] || CONTEXT_PARTS['gamer-names'];
  const prefixPool = index % 3 === 0
    ? [...contextParts.prefixes, ...styleParts.prefixes]
    : [...styleParts.prefixes, ...contextParts.prefixes];
  const stemPool = index % 2 === 0
    ? [...contextParts.stems, ...styleParts.stems]
    : [...styleParts.stems, ...contextParts.stems];
  const suffixPool = index % 4 === 0
    ? [...contextParts.suffixes, ...styleParts.suffixes]
    : [...styleParts.suffixes, ...contextParts.suffixes];

  const prefix = toTitleToken(pick(rnd, prefixPool));
  const stem = toTitleToken(pick(rnd, stemPool));
  const suffix = toTitleToken(pick(rnd, suffixPool));
  const modifier = pick(rnd, styleParts.modifiers);

  let name;
  const layout = Math.floor(rnd() * 5);
  if (layout === 0) {
    name = safeJoinName([prefix, stem, suffix]);
  } else if (layout === 1) {
    name = safeJoinName([prefix, stem, modifier]);
  } else if (layout === 2) {
    name = safeJoinName([stem, suffix, modifier]);
  } else if (layout === 3) {
    name = safeJoinName([prefix, suffix]);
  } else {
    name = safeJoinName([prefix, stem]);
  }

  return {
    name,
    parts: { prefix, stem, suffix, modifier },
  };
}

function noveltyScoreFor(name, parts) {
  const uniqueParts = new Set(Object.values(parts).filter(Boolean).map((part) => part.toLowerCase())).size;
  const lengthBonus = Math.min(0.12, Math.max(0, String(name).length - 8) * 0.01);
  const hashBonus = (hashString(name) % 17) / 100;
  const score = 0.58 + (uniqueParts * 0.055) + lengthBonus + hashBonus;
  return Math.min(0.98, Number(score.toFixed(2)));
}

export function isBlockedGeneratedName(name) {
  return BLOCKED_EXACT_NAMES.has(normalizeName(name));
}

/**
 * Generate Pinterest-ready names by composing prefix/stem/suffix/modifier parts.
 *
 * @param {{ count?: number, style?: string, topic?: string, context?: string, seed?: string, random?: boolean }} opts
 */
export function generateNamesV2(opts = {}) {
  const count = Math.min(100, Math.max(1, Number(opts.count) || 12));
  const context = resolveNameContext(opts.context || opts.topic);
  const style = resolveStyle(opts.style, context);
  const seedBase = opts.random
    ? `${opts.seed || context}-${style}-${Date.now()}-${Math.random()}`
    : `${opts.seed || context}-${style}`;
  const rnd = mulberry32(hashString(seedBase));
  const generated = [];
  const used = new Set();
  let guard = 0;

  while (generated.length < count && guard < count * 80) {
    guard += 1;
    const candidate = buildCandidate({ rnd, style, context, index: guard });
    const normalized = normalizeName(candidate.name);
    if (!candidate.name || used.has(normalized) || isBlockedGeneratedName(candidate.name)) {
      continue;
    }

    used.add(normalized);
    generated.push({
      name: candidate.name,
      style,
      context,
      noveltyScore: noveltyScoreFor(candidate.name, candidate.parts),
      source: 'generated-v2',
      parts: candidate.parts,
    });
  }

  if (generated.length < count) {
    for (const prefix of CONTEXT_PARTS[context].prefixes) {
      for (const stem of STYLE_PARTS[style].stems) {
        const candidateName = safeJoinName([prefix, stem, generated.length + 1]);
        const normalized = normalizeName(candidateName);
        if (!used.has(normalized) && !isBlockedGeneratedName(candidateName)) {
          used.add(normalized);
          const parts = {
            prefix: toTitleToken(prefix),
            stem: toTitleToken(stem),
            suffix: '',
            modifier: String(generated.length + 1),
          };
          generated.push({
            name: candidateName,
            style,
            context,
            noveltyScore: noveltyScoreFor(candidateName, parts),
            source: 'generated-v2',
            parts,
          });
          if (generated.length >= count) break;
        }
      }
      if (generated.length >= count) break;
    }
  }

  return generated;
}

export function listNameEngineV2Styles() {
  return [...SUPPORTED_STYLES];
}
