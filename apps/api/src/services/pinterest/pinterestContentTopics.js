/**
 * Pinterest + n8n content topics — aligned with live TryhardNames routes and hubs.
 * Name pools come from `nameGeneratorService` (same data as the web generators).
 */

import { TOPIC_HUB_ROUTES } from '../../../../web/src/seo/programmatic/topicHubRoutes.js';

/**
 * @typedef {{ topic: string, keyword: string, category: string, path: string, slug: string, audience: string, engine: { type: 'roblox'|'gamer', category: string }, visualStyle: { lighting: string, composition: string, mood: string } }} PinterestContentTopicDef
 */

/** @type {PinterestContentTopicDef[]} */
const STATIC_TOPIC_DEFS = [
  {
    topic: 'gamer-names',
    keyword: 'Gamer Names & Gamertags',
    category: 'gamer-names',
    path: '/gamer-names',
    slug: 'gamer-names',
    audience: 'PC and console players building a memorable gamertag',
    engine: { type: 'gamer', category: 'all' },
    visualStyle: {
      lighting: 'dark neon rim light with subtle cyan-magenta split',
      composition: 'vertical 2:3 Pinterest poster, hero character silhouette',
      mood: 'competitive gaming, high energy, clean esports vibe',
    },
  },
  {
    topic: 'gamer-names-cool',
    keyword: 'Cool Gamer Names',
    category: 'gamer-names',
    path: '/gamer-names/cool',
    slug: 'gamer-names-cool',
    audience: 'Players who want sleek, memorable tags for ranked queues',
    engine: { type: 'gamer', category: 'cool' },
    visualStyle: {
      lighting: 'cinematic low-key with cool blue edge light',
      composition: 'vertical 2:3, single focal character, minimal UI clutter',
      mood: 'premium tryhard aesthetic without noisy text',
    },
  },
  {
    topic: 'roblox-names',
    keyword: 'Roblox Username Ideas',
    category: 'roblox',
    path: '/roblox-names',
    slug: 'roblox-names',
    audience: 'Roblox players rebranding display names and usernames',
    engine: { type: 'roblox', category: 'all' },
    visualStyle: {
      lighting: 'bright playful key light with soft bloom',
      composition: 'vertical 2:3, bold avatar-friendly silhouette',
      mood: 'fun creator-friendly Roblox energy',
    },
  },
  {
    topic: 'roblox-tryhard',
    keyword: 'Tryhard Roblox Names',
    category: 'roblox',
    path: '/roblox-names/tryhard',
    slug: 'roblox-names-tryhard',
    audience: 'Competitive Roblox players and PvP grinders',
    engine: { type: 'roblox', category: 'tryhard' },
    visualStyle: {
      lighting: 'high contrast neon accents on dark background',
      composition: 'vertical 2:3, aggressive stance, leaderboard-ready',
      mood: 'sweaty competitive, sharp edges, minimal readable text',
    },
  },
  {
    topic: 'valorant-sweaty',
    keyword: 'Sweaty Valorant Names',
    category: 'valorant',
    path: '/valorant/sweaty',
    slug: 'valorant-sweaty',
    audience: 'Valorant ranked grinders and duelists',
    engine: { type: 'gamer', category: 'pro' },
    visualStyle: {
      lighting: 'dark neon cinematic with tactical rim light',
      composition: 'vertical 2:3 tactical poster, one strong hero read',
      mood: 'VCT-style competitive tension, crisp shapes',
    },
  },
  {
    topic: 'valorant-clean',
    keyword: 'Clean Valorant Usernames',
    category: 'valorant',
    path: '/valorant/clean',
    slug: 'valorant-clean',
    audience: 'Players who want pro-looking, readable Valorant tags',
    engine: { type: 'gamer', category: 'cool' },
    visualStyle: {
      lighting: 'soft studio key with neutral gray backdrop',
      composition: 'vertical 2:3, minimal clutter, esports jersey mood',
      mood: 'clean pro branding, subtle glow only',
    },
  },
  {
    topic: 'fortnite-sweaty',
    keyword: 'Sweaty Fortnite Names',
    category: 'fortnite',
    path: '/fortnite/sweaty',
    slug: 'fortnite-sweaty',
    audience: 'Fortnite ranked and build-fight players',
    engine: { type: 'gamer', category: 'tryhard' },
    visualStyle: {
      lighting: 'saturated sunset neon with stormy contrast',
      composition: 'vertical 2:3 battle royale thumbnail energy',
      mood: 'fast, loud, viral BR thumbnail — almost no on-image text',
    },
  },
  {
    topic: 'league-of-legends',
    keyword: 'League of Legends Name Ideas',
    category: 'league-of-legends',
    path: '/league-of-legends',
    slug: 'league-of-legends',
    audience: 'LoL summoners renaming before ranked climb',
    engine: { type: 'gamer', category: 'edgy' },
    visualStyle: {
      lighting: 'mystic rune glow with emerald highlights',
      composition: 'vertical 2:3 fantasy-moba poster silhouette',
      mood: 'legendary ranked grind, dark fantasy undertone',
    },
  },
];

function hubToDef(hub) {
  return {
    topic: hub.slug,
    keyword: hub.label,
    category: 'topic-hub',
    path: hub.path,
    slug: hub.slug,
    audience: 'Creators and players searching curated naming angles on TryhardNames',
    engine: { type: 'gamer', category: 'cool' },
    visualStyle: {
      lighting: 'dark neon cinematic with soft volumetric haze',
      composition: 'vertical 2:3 Pinterest poster, strong focal silhouette',
      mood: 'brandable gaming identity, high CTR thumbnail energy',
    },
  };
}

const ALL_DEFS = [...TOPIC_HUB_ROUTES.map(hubToDef), ...STATIC_TOPIC_DEFS];

const TOPIC_INDEX = new Map();
for (const def of ALL_DEFS) {
  TOPIC_INDEX.set(def.topic.toLowerCase(), def);
}

/** Common Pinterest / legacy phrasing → canonical topic id */
const TOPIC_ALIASES = {
  'valorant-usernames': 'valorant-sweaty',
  'fortnite-usernames': 'fortnite-sweaty',
  'roblox-usernames': 'roblox-names',
};

export function listPinterestContentTopicDefs() {
  return ALL_DEFS;
}

export function listPinterestContentTopicIds() {
  return [...new Set(ALL_DEFS.map((d) => d.topic))];
}

export function getPinterestContentTopicDef(topicQuery) {
  if (!topicQuery || typeof topicQuery !== 'string') {
    return null;
  }
  const raw = topicQuery.trim().toLowerCase();
  const q = TOPIC_ALIASES[raw] || raw;
  if (TOPIC_INDEX.has(q)) {
    return TOPIC_INDEX.get(q);
  }
  const pathNorm = q.startsWith('/') ? q : `/${q}`;
  return (
    ALL_DEFS.find(
      (d) =>
        d.slug.toLowerCase() === q
        || d.path.toLowerCase() === pathNorm
        || d.path.toLowerCase().replace(/^\//, '') === q.replace(/^\//, ''),
    ) || null
  );
}

export function defaultPinterestContentTopicDef() {
  return STATIC_TOPIC_DEFS.find((d) => d.topic === 'gamer-names') || ALL_DEFS[0];
}
