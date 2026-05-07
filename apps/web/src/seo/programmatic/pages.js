import { faqPageSchema, breadcrumbListSchema } from '../schema.js';

/**
 * Programmatic SEO architecture (data-driven).
 * Generates hundreds of pages from a small set of datasets + templates.
 * No per-URL hardcoding.
 */

const CATEGORY_DEFS = {
  valorant: {
    label: 'Valorant',
    audience: 'ranked grinders, duelists, and clip hunters',
    context: {
      surfaces: ['killfeed', 'scoreboard', 'party UI', 'clips/YouTube titles'],
      constraints: ['Riot ID needs to be readable fast', 'short tags look cleaner in the HUD'],
      vibeRefs: ['Radiant', 'aim', 'flick', 'clutch', 'agent energy'],
      examples: ['FlickNova', 'RadiantEcho', 'ClutchShift', 'TapGhost'],
    },
    tips: [
      'Prioritize readability at a glance (HUD + scoreboard).',
      'Keep it short for a clean killfeed (4–10 chars works well).',
      'Avoid noisy suffixes like random years unless it is intentional.',
    ],
    ctas: [
      { label: 'Generate a new tag', anchor: '#names' },
      { label: 'Try Stylish Text', to: '/stylish-text-generator' },
      { label: 'Add Symbols', to: '/nickname-symbols' },
    ],
  },
  fortnite: {
    label: 'Fortnite',
    audience: 'builders, arena players, and creators',
    context: {
      surfaces: ['HUD', 'replay clips', 'creator overlays', 'party UI'],
      constraints: ['console restrictions can be stricter for special characters'],
      vibeRefs: ['edit', 'build', 'arena', 'zone', 'pump'],
      examples: ['EditPrime', 'ZoneVex', 'BuildNova', 'ArenaPulse'],
    },
    tips: [
      'Two-word combos look clean on overlays (Creator/comp vibe).',
      'Avoid clutter; keep the vibe consistent across socials.',
      'Use one accent symbol max for compatibility (especially console).',
    ],
    ctas: [
      { label: 'Generate a new name', anchor: '#names' },
      { label: 'Explore Gamer Names', to: '/gamer-names' },
      { label: 'Stylish Text', to: '/stylish-text-generator' },
    ],
  },
  roblox: {
    label: 'Roblox',
    audience: 'roleplayers, creators, and competitive players',
    context: {
      surfaces: ['profile', 'chat', 'RP servers', 'group/clan pages'],
      constraints: ['keep it platform-friendly and avoid borderline words'],
      vibeRefs: ['vibe', 'obby', 'studio', 'roleplay', 'cute/aesthetic'],
      examples: ['MochiVibe', 'CloudyObby', 'PixelStudio', 'StarryRP'],
    },
    tips: [
      'Use playful words for cute/aesthetic styles (it performs better in RP).',
      'Avoid banned words; keep it platform-friendly.',
      'Mix vibe + role (or hobby) for memorability.',
    ],
    ctas: [
      { label: 'Generate Roblox-style ideas', anchor: '#names' },
      { label: 'Roblox hub', to: '/roblox-names' },
      { label: 'Add symbols', to: '/nickname-symbols' },
    ],
  },
  cod: {
    label: 'Call of Duty',
    audience: 'MP grinders and Warzone squads',
    context: {
      surfaces: ['killfeed', 'lobby', 'Warzone squad UI', 'clips'],
      constraints: ['intimidating but readable beats “edgy spam”'],
      vibeRefs: ['recoil', 'drop', 'squad', 'loadout', 'warzone'],
      examples: ['RecoilRuin', 'DropWraith', 'SquadHex', 'LoadoutNyx'],
    },
    tips: [
      'Aggressive words + short tag = strong identity in the killfeed.',
      'Avoid overused year suffixes and random capitals.',
      'Think “clean + intimidating”, not “clutter + edgy”.',
    ],
    ctas: [
      { label: 'Generate tryhard tags', anchor: '#names' },
      { label: 'Browse Popular Generators', to: '/' },
      { label: 'Try Stylish Text', to: '/stylish-text-generator' },
    ],
  },
  general: {
    label: 'Gaming',
    audience: 'any platform',
    context: {
      surfaces: ['profiles', 'streams', 'social handles', 'leaderboards'],
      constraints: ['pronounceable names are easier to remember and share'],
      vibeRefs: ['clean', 'brandable', 'memorable', 'reusable'],
      examples: ['NeonRogue', 'NovaCipher', 'EchoPrime', 'VortexZen'],
    },
    tips: [
      'Pick a name you can say out loud (better recall + shareability).',
      'Keep it consistent across socials for brand strength.',
      'Prefer unique spellings over random numbers.',
    ],
    ctas: [
      { label: 'Generate more', anchor: '#names' },
      { label: 'Nickname Symbols', to: '/nickname-symbols' },
      { label: 'Stylish Text Generator', to: '/stylish-text-generator' },
    ],
  },
};

const STYLE_DEFS = {
  sweaty: {
    label: 'Sweaty',
    tone: 'competitive',
    titleNoun: 'Names',
    hooks: ['ranked', 'tryhard', 'competitive'],
    dos: ['Keep it short (one punchy core word).', 'Use clean spelling (readable at speed).', 'Choose a vibe that matches your playstyle.'],
    donts: ['Avoid long numbers or birth years.', 'Avoid stacking symbols.', 'Avoid “generic top-10” clones.'],
    formulas: ['[Verb] + [Noun]', '[Adjective] + [Noun]', '[Noun] + X', '[Noun] + 99 (only if intentional)'],
    faq: [
      {
        question: 'What is a sweaty gamer name?',
        answer:
          "Sweaty names are competitive, tryhard-style tags that signal skill and intensity. They’re usually short, clean, and intimidating—built to look good in-game and on overlays.",
      },
      {
        question: 'Should I use symbols in my username?',
        answer:
          "Use symbols sparingly. Some platforms restrict special characters, especially on console. If you do use them, choose one subtle symbol to keep the name readable.",
      },
    ],
    sectionAngles: ['Dominate the lobby', 'Clean formats that win'],
    seed: ['Clutch', 'Flick', 'Tap', 'Peak', 'Frag', 'Demon', 'Radiant', 'Cracked'],
  },
  funny: {
    label: 'Funny',
    tone: 'humor',
    titleNoun: 'Names',
    hooks: ['memes', 'troll', 'funny'],
    dos: ['Aim for one clear joke.', 'Keep it readable (chat + clips).', 'Use a “straight face” delivery (simple phrasing).'],
    donts: ['Avoid long sentences.', 'Avoid dated memes.', 'Avoid edgy/offensive jokes (risk of flags).'],
    formulas: ['[Everyday thing] + [Gamer word]', 'Not[Thing]', '[Role] + Main', '[Action] + Enjoyer'],
    faq: [
      {
        question: 'Do funny usernames work in competitive games?',
        answer:
          'Yes. A funny name can be memorable and disarming, and it often gets more reactions in chat and clips—great for engagement.',
      },
      {
        question: 'How do I make a funny name not cringe?',
        answer:
          'Keep it short, avoid over-explaining, and pick one clear joke. The best funny names are simple and readable.',
      },
    ],
    sectionAngles: ['Humor that gets reactions', 'Formats that stay readable'],
    seed: ['NoScopeDad', 'LagWizard', 'BotLobby', 'SnackTime', 'FreeELO', 'NotMyFault', 'MuteMe', 'GGez'],
  },
  pro: {
    label: 'Pro',
    tone: 'esports',
    titleNoun: 'Tags',
    hooks: ['esports', 'pro', 'clean'],
    dos: ['Keep it 3–8 characters when possible.', 'Make it pronounceable.', 'Pick a “brandable” core word.'],
    donts: ['Avoid extra punctuation.', 'Avoid mixed casing randomness.', 'Avoid trendy words that age fast.'],
    formulas: ['[Short word]', '[Short word] + X', '[Initials]', '[Word] + [Short suffix]'],
    faq: [
      {
        question: 'What makes a pro-style gamer tag?',
        answer:
          'Pro tags are short, clean, and pronounceable. They avoid clutter and look strong in leaderboards, killfeeds, and jerseys.',
      },
      {
        question: 'Are numbers okay in a pro tag?',
        answer:
          'They can be, but keep them minimal and intentional (e.g., 2–3 characters max). Random years usually reduce perceived quality.',
      },
    ],
    sectionAngles: ['A tag that looks “signed”', 'Minimalism that scales'],
    seed: ['Nova', 'Vex', 'Aero', 'Pulse', 'Keen', 'Zero', 'Proxy', 'Cipher'],
  },
  cute: {
    label: 'Cute',
    tone: 'soft',
    titleNoun: 'Names',
    hooks: ['cute', 'soft', 'aesthetic'],
    dos: ['Use cozy nouns (food, pets, clouds).', 'Use one soft symbol max.', 'Prefer lower noise (no random numbers).'],
    donts: ['Avoid harsh words (kills the vibe).', 'Avoid symbol stacks.', 'Avoid “xX_” style framing.'],
    formulas: ['[Cute noun]', '[Cute noun] + [Vibe]', '[Noun] + ♡', '[Noun] + •[Noun]'],
    faq: [
      {
        question: 'What are cute gamer names?',
        answer:
          'Cute names lean into friendly words, cozy vibes, and playful spelling. They’re great for social games, RP, and creator profiles.',
      },
      {
        question: 'Should I use underscores or separators?',
        answer:
          'A single underscore or dot can improve readability. Avoid stacking separators—it looks spammy and lowers CTR.',
      },
    ],
    sectionAngles: ['Cozy vibes that stand out', 'Readable cute formats'],
    seed: ['Bunny', 'Mochi', 'Peach', 'Cloudy', 'Luna', 'Kiki', 'Starry', 'Daisy'],
  },
  cool: {
    label: 'Cool',
    tone: 'modern',
    titleNoun: 'Usernames',
    hooks: ['cool', 'clean', 'modern'],
    dos: ['Use strong nouns (ghost, onyx, rogue).', 'Keep it simple enough to remember.', 'Add one modifier for uniqueness.'],
    donts: ['Avoid generic “ShadowXx” variants.', 'Avoid long numbers.', 'Avoid over-styling fonts everywhere.'],
    formulas: ['[Noun]', '[Modifier] + [Noun]', '[Noun] + [Short suffix]', '[Noun] + [Vibe word]'],
    faq: [
      {
        question: 'How do I make my username look cool?',
        answer:
          'Use a clear theme, keep it short, and pick words that sound strong. Cool names balance readability with uniqueness.',
      },
      {
        question: 'What should I avoid in a cool name?',
        answer:
          'Avoid long numbers, random capitalization, and overly generic words. If it looks common, it gets skipped faster.',
      },
    ],
    sectionAngles: ['Modern names that pop', 'Patterns that look premium'],
    seed: ['Shadow', 'Neon', 'Vortex', 'Ghost', 'Onyx', 'Rogue', 'Nova', 'Hyper'],
  },
  aesthetic: {
    label: 'Aesthetic',
    tone: 'minimal',
    titleNoun: 'Names',
    hooks: ['aesthetic', 'clean', 'cute'],
    dos: ['Use nature/space words (luna, mist, dawn).', 'Prefer simple ASCII if compatibility matters.', 'Keep the rhythm consistent (same length words).'],
    donts: ['Avoid chaotic mixed symbols.', 'Avoid too many separators.', 'Avoid heavy “fancy font” blocks for usernames.'],
    formulas: ['[Nature word]', '[Word] + ✨', '[Word] + [Soft suffix]', '[Two short words]'],
    faq: [
      {
        question: 'What are aesthetic usernames?',
        answer:
          'Aesthetic usernames are clean, minimal, and vibe-driven—often inspired by nature, space, or soft concepts that look good on profiles.',
      },
      {
        question: 'Do aesthetic names need special fonts?',
        answer:
          "Not necessarily. Simple words with consistent styling often look better (and are more compatible) than heavy Unicode fonts.",
      },
    ],
    sectionAngles: ['Minimal vibe, maximum effect', 'Clean layouts for profiles'],
    seed: ['Luna', 'Dusk', 'Mist', 'Echo', 'Bloom', 'Sage', 'Aura', 'Drift'],
  },
  tryhard: {
    label: 'Tryhard',
    tone: 'aggressive',
    titleNoun: 'Names',
    hooks: ['tryhard', 'sweaty', 'ranked'],
    dos: ['Choose words that imply skill (clutch, cracked).', 'Keep it sharp and readable.', 'Make it consistent with your gameplay identity.'],
    donts: ['Avoid long phrases.', 'Avoid copying streamer tags.', 'Avoid edgy/offensive terms.'],
    formulas: ['[Skill word] + [Noun]', '[Noun] + [Short suffix]', '[Dark noun] + X', '[Verb] + [Noun]'],
    faq: [
      {
        question: 'What is a tryhard name?',
        answer:
          'Tryhard names are built to look competitive and intimidating. They’re usually short, sharp, and focused on performance vibes.',
      },
      {
        question: 'How do I make a tryhard name unique?',
        answer:
          'Combine one competitive word with a less common modifier, or use a clean spelling twist. Avoid copying common “Top 10” tags.',
      },
    ],
    sectionAngles: ['Intimidation + clarity', 'Competitive patterns that work'],
    seed: ['Wraith', 'Reaper', 'Venom', 'Abyss', 'Phantom', 'Savage', 'Void', 'Rival'],
  },
  edgy: {
    label: 'Edgy',
    tone: 'dark',
    titleNoun: 'Usernames',
    hooks: ['dark', 'edgy', 'shadow'],
    dos: ['Stick to fantasy-dark vibes (void, nyx).', 'Keep it premium-looking (minimal).', 'Make it readable in small UI.'],
    donts: ['Avoid hateful/offensive words.', 'Avoid threat language.', 'Avoid symbol spam.'],
    formulas: ['[Dark noun]', '[Dark noun] + [Short suffix]', '[Word] + Hex', '[Word] + Nyx'],
    faq: [
      {
        question: 'What makes an edgy username?',
        answer:
          'Edgy usernames lean into darker themes—shadow, void, chaos—while staying readable. The best ones feel intentional, not random.',
      },
      {
        question: 'Will edgy names get flagged?',
        answer:
          'Avoid offensive terms and slurs. Stick to fantasy/dark vibes rather than real-world hate or threats.',
      },
    ],
    sectionAngles: ['Dark themes that still look premium', 'Readable “dark” formats'],
    seed: ['Void', 'Abyss', 'Nyx', 'Hex', 'Grim', 'Ruin', 'Shade', 'Blight'],
  },
  og: {
    label: 'OG',
    tone: 'nostalgia',
    titleNoun: 'Names',
    hooks: ['og', 'classic', 'rare'],
    dos: ['Use timeless words (frost, prime).', 'Prefer single words or simple combos.', 'Avoid trendy slang.'],
    donts: ['Avoid heavy symbols.', 'Avoid long suffixes.', 'Avoid too many modifiers.'],
    formulas: ['[One word]', '[One word] + X', '[Word] + Prime', '[Word] + OG (sparingly)'],
    faq: [
      {
        question: 'What are OG names?',
        answer:
          'OG names feel classic and rare—short, timeless words that look like they’ve been around forever.',
      },
      {
        question: 'How do I find an OG name that’s available?',
        answer:
          'Try slight spelling variants, add a subtle suffix, or use a two-word combination that still feels minimal.',
      },
    ],
    sectionAngles: ['Classic names that age well', 'Availability-friendly variants'],
    seed: ['Ace', 'King', 'Frost', 'Wolf', 'Nexus', 'Blade', 'Ghost', 'Prime'],
  },
  best: {
    label: 'Best',
    tone: 'curated',
    titleNoun: 'Gaming Names',
    hooks: ['best', 'top', 'popular'],
    dos: ['Choose a name that is brandable across platforms.', 'Prefer readability over cleverness.', 'Keep it easy to type.'],
    donts: ['Avoid names you can’t pronounce.', 'Avoid long numbers.', 'Avoid overcomplication.'],
    formulas: ['[Noun]', '[Modifier] + [Noun]', '[Short word] + X', '[Two-word combo]'],
    faq: [
      {
        question: 'What are the best gaming names?',
        answer:
          'The best names are short, memorable, and readable. They match your style and are easy to reuse across platforms.',
      },
      {
        question: 'How do I choose the best one?',
        answer:
          'Pick 3–5 favorites, test them in-game, and choose the one that looks best in your HUD/killfeed and feels natural to say out loud.',
      },
    ],
    sectionAngles: ['What “best” actually means', 'How to pick your final name'],
    seed: ['Shadow', 'Nova', 'Rogue', 'Vex', 'Pulse', 'Echo', 'Prime', 'Blaze'],
  },
  anime: {
    label: 'Anime',
    tone: 'fandom',
    titleNoun: 'Usernames',
    hooks: ['anime', 'otaku', 'weeb'],
    dos: ['Use archetypes (ronin, kitsune) vs direct character names.', 'Keep it clean (no long romaji).', 'One theme per name.'],
    donts: ['Avoid copyrighted full names.', 'Avoid long suffix stacks.', 'Avoid heavy Unicode blocks for handles.'],
    formulas: ['[Archetype]', '[Power] + [Noun]', '[Word] + Senpai (sparingly)', '[Place] + [Role]'],
    faq: [
      {
        question: 'Are anime usernames allowed on most platforms?',
        answer:
          'Yes, as long as they don’t use copyrighted logos or offensive terms. Names inspired by themes are usually safer than exact character names.',
      },
      {
        question: 'How do I make an anime username original?',
        answer:
          'Use archetypes, powers, or locations as inspiration instead of copying character names directly.',
      },
    ],
    sectionAngles: ['Fandom vibes without copying', 'Clean formats for profiles'],
    seed: ['Senpai', 'Shinobi', 'Kitsune', 'Ronin', 'Shogun', 'Akuma', 'Kage', 'Sakura'],
  },
  '3-letter': {
    label: '3-Letter',
    tone: 'minimal',
    titleNoun: 'Names',
    hooks: ['short', 'clean', 'rare'],
    dos: ['Pick letters that sound good as initials.', 'Avoid awkward consonant piles.', 'Try abbreviations that match your brand.'],
    donts: ['Avoid random strings you can’t say.', 'Avoid adding symbols (kills the point).', 'Avoid forced leetspeak.'],
    formulas: ['[Initials]', '[Abbreviation]', '[3-letter word]', '[Brand short code]'],
    faq: [
      {
        question: 'Why are 3-letter names so popular?',
        answer:
          'They’re minimal, look premium, and are easy to remember. They also stand out in overlays and leaderboards.',
      },
      {
        question: 'Are 3-letter names still available?',
        answer:
          'Many are taken, but you can still find variants with subtle spelling or by using initials that match your brand.',
      },
    ],
    sectionAngles: ['Minimalism that looks premium', 'How to find available variants'],
    seed: ['VEX', 'NOVA', 'AIM', 'LUX', 'ZEN', 'KOS', 'RIP', 'ARC'],
  },
};

const ALLOWED = {
  valorant: ['sweaty', 'funny', 'pro', 'aesthetic', 'cool', 'tryhard', 'edgy'],
  fortnite: ['sweaty', 'funny', 'pro', 'og', 'cool', 'tryhard'],
  roblox: ['cute', 'funny', 'aesthetic', 'cool', 'tryhard'],
  cod: ['sweaty', 'funny', 'pro', 'cool', 'tryhard', 'edgy'],
  general: ['best', 'cool', 'funny', 'pro', 'anime', '3-letter', 'edgy'],
};

const STYLE_INTENTS = {
  sweaty: ['competitive'],
  tryhard: ['competitive'],
  pro: ['competitive', 'brandable'],
  funny: ['humor'],
  cute: ['aesthetic'],
  aesthetic: ['aesthetic'],
  cool: ['brandable'],
  edgy: ['dark'],
  og: ['nostalgia', 'brandable'],
  best: ['curated', 'brandable'],
  anime: ['fandom'],
  '3-letter': ['minimal', 'brandable'],
};

const INTENT_ADJACENCY = {
  competitive: ['brandable', 'dark'],
  aesthetic: ['brandable', 'minimal'],
  brandable: ['competitive', 'aesthetic', 'minimal', 'curated'],
  minimal: ['brandable', 'aesthetic'],
  dark: ['competitive', 'brandable'],
  humor: ['brandable'],
  nostalgia: ['brandable', 'curated'],
  curated: ['brandable'],
  fandom: ['brandable'],
};

function titleCase(s) {
  return String(s)
    .split(/[\s-]+/g)
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');
}

function buildSlug(category, keyword) {
  return `${category}/${keyword}`;
}

function hashToInt(input) {
  const s = String(input);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickVariant(key, options) {
  if (!options || options.length === 0) return null;
  const idx = hashToInt(key) % options.length;
  return options[idx];
}

function pickMany(key, options, count) {
  if (!options || options.length === 0) return [];
  const start = hashToInt(key) % options.length;
  const out = [];
  for (let i = 0; i < options.length && out.length < count; i++) {
    out.push(options[(start + i) % options.length]);
  }
  return out;
}

export function isProgrammaticSlug(slug) {
  if (!slug) return false;
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  const [category, keyword, ...rest] = normalized.split('/').filter(Boolean);
  if (rest.length > 0) return false;
  if (!CATEGORY_DEFS[category]) return false;
  if (!STYLE_DEFS[keyword]) return false;
  const allowed = ALLOWED[category] || [];
  return allowed.includes(keyword);
}

export function getAllProgrammaticSlugs() {
  return Object.keys(CATEGORY_DEFS).flatMap((category) => {
    const styles = ALLOWED[category] || [];
    return styles.map((keyword) => buildSlug(category, keyword));
  });
}

function unique(arr) {
  return [...new Set(arr)];
}

function buildLinkTitle(category, keyword) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  if (!cat || !style) return '';
  const game = cat.label === 'Gaming' ? 'Gaming' : cat.label;
  return `${style.label} ${game} ${style.titleNoun}`;
}

function buildLinkCandidatesForCategory(category, excludeKeyword) {
  const styles = (ALLOWED[category] || []).filter((k) => k !== excludeKeyword);
  return styles.map((k) => ({ category, keyword: k }));
}

function buildLinkCandidatesForStyle(keyword, excludeCategory) {
  const categories = Object.keys(CATEGORY_DEFS).filter((c) => c !== excludeCategory);
  return categories
    .filter((c) => (ALLOWED[c] || []).includes(keyword))
    .map((c) => ({ category: c, keyword }));
}

function scoreCandidate({ fromCategory, fromKeyword, toCategory, toKeyword }) {
  // deterministic-ish scoring based on semantic adjacency first, then variety
  const fromIntents = STYLE_INTENTS[fromKeyword] || [];
  const toIntents = STYLE_INTENTS[toKeyword] || [];
  const sharesIntent = fromIntents.some((i) => toIntents.includes(i));
  const adjacentIntent = fromIntents.some((i) => (INTENT_ADJACENCY[i] || []).some((a) => toIntents.includes(a)));

  let score = 0;
  if (sharesIntent) score += 40;
  if (adjacentIntent) score += 20;
  if (fromCategory === toCategory) score += 10; // intra-cluster is still strong
  if (fromKeyword === toKeyword) score += 15; // cross-game same style is useful
  if (toCategory === 'general') score += 4; // general is a good hub but shouldn't dominate
  if (fromCategory === 'general') score -= 2;

  // keep a stable tie-breaker using hash
  score += (hashToInt(`${fromCategory}/${fromKeyword}=>${toCategory}/${toKeyword}`) % 7);
  return score;
}

function selectTopLinks(key, candidates, maxLinks, fromCategory, fromKeyword) {
  const scored = candidates
    .map((c) => ({
      ...c,
      score: scoreCandidate({ fromCategory, fromKeyword, toCategory: c.category, toKeyword: c.keyword }),
    }))
    .sort((a, b) => b.score - a.score);

  const out = [];
  const seen = new Set();
  for (const c of scored) {
    const slug = buildSlug(c.category, c.keyword);
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      title: buildLinkTitle(c.category, c.keyword),
    });
    if (out.length >= maxLinks) break;
  }

  // deterministic rotate: if all scores tie, we still don't want the same order across all pages
  if (out.length > 1) {
    const shift = hashToInt(key) % out.length;
    return out.slice(shift).concat(out.slice(0, shift));
  }
  return out;
}

function buildInternalLinkBlocks({ category, keyword }) {
  const key = `${category}:${keyword}:links`;

  const sameGame = selectTopLinks(
    `${key}:sameGame`,
    buildLinkCandidatesForCategory(category, keyword),
    4,
    category,
    keyword
  );

  const sameStyleOtherGames = selectTopLinks(
    `${key}:sameStyle`,
    buildLinkCandidatesForStyle(keyword, category),
    3,
    category,
    keyword
  );

  const fromIntents = STYLE_INTENTS[keyword] || [];
  const adjacentIntents = unique(fromIntents.flatMap((i) => INTENT_ADJACENCY[i] || [])).slice(0, 2);
  const adjacentStyles = unique(
    Object.keys(STYLE_DEFS).filter((k) => k !== keyword && (STYLE_INTENTS[k] || []).some((i) => fromIntents.includes(i) || adjacentIntents.includes(i)))
  );

  // keep adjacency inside category first
  const adjacentInCategoryCandidates = adjacentStyles
    .filter((k) => (ALLOWED[category] || []).includes(k))
    .map((k) => ({ category, keyword: k }));

  // then fill with general hub equivalents
  const adjacentGeneralCandidates = adjacentStyles
    .filter((k) => (ALLOWED.general || []).includes(k))
    .map((k) => ({ category: 'general', keyword: k }));

  const adjacentIntentsLinks = selectTopLinks(
    `${key}:adjacent`,
    [...adjacentInCategoryCandidates, ...adjacentGeneralCandidates],
    4,
    category,
    keyword
  );

  const trendingCombos = [
    { category: 'valorant', keyword: 'sweaty' },
    { category: 'fortnite', keyword: 'tryhard' },
    { category: 'roblox', keyword: 'aesthetic' },
    { category: 'cod', keyword: 'sweaty' },
    { category: 'general', keyword: 'cool' },
  ]
    .filter((x) => isProgrammaticSlug(buildSlug(x.category, x.keyword)))
    .filter((x) => !(x.category === category && x.keyword === keyword));

  const trendingLinks = selectTopLinks(
    `${key}:trending`,
    trendingCombos,
    3,
    category,
    keyword
  );

  const blocks = [];
  if (sameGame.length) blocks.push({ title: `${CATEGORY_DEFS[category].label} styles`, links: sameGame });
  if (adjacentIntentsLinks.length) blocks.push({ title: 'Related naming intents', links: adjacentIntentsLinks });
  if (sameStyleOtherGames.length) blocks.push({ title: `Same style in other games`, links: sameStyleOtherGames });
  if (trendingLinks.length) blocks.push({ title: 'Trending combinations', links: trendingLinks });

  // cap blocks for UX
  return blocks.slice(0, 4);
}

function buildNames({ category, keyword }) {
  const style = STYLE_DEFS[keyword];
  const cat = CATEGORY_DEFS[category];

  const base = style.seed || [];
  const extras =
    category === 'valorant'
      ? ['VLR', 'Radiant', 'Flick', 'Dash', 'Omen', 'Jett']
      : category === 'fortnite'
        ? ['Build', 'Edit', 'Arena', 'Zone', 'Pump', 'Solo']
        : category === 'roblox'
          ? ['Blox', 'Studio', 'Obby', 'RP', 'Vibe', 'Pixel']
          : category === 'cod'
            ? ['Warzone', 'Squad', 'Drop', 'Loadout', 'Raven', 'Recoil']
            : ['Clip', 'Main', 'GG', 'Nova', 'Echo', 'Prime'];

  const symbols = keyword === 'cute' || keyword === 'aesthetic' ? ['✨', '♡', '•'] : ['★', '⚡', '◆'];
  const suffixes = keyword === 'pro' || keyword === '3-letter' ? ['', '', '', 'X'] : ['', '', 'X', '99'];

  const merged = unique([...base, ...extras]);

  const names = [];
  for (let i = 0; i < merged.length && names.length < 24; i++) {
    const w = merged[i];
    const sym = symbols[i % symbols.length];
    const suf = suffixes[i % suffixes.length];
    const candidate =
      keyword === '3-letter'
        ? String(w).slice(0, 3).toUpperCase()
        : keyword === 'aesthetic' || keyword === 'cute'
          ? `${w}${sym}${suf}`.replace(/•/g, '•')
          : `${w}${suf}${i % 4 === 0 ? sym : ''}`;
    names.push(candidate);
  }

  // Ensure we always have something indexable.
  if (names.length < 12) {
    names.push(`${cat.label}${style.label}`, `${style.label}${cat.label}`);
  }

  return unique(names).slice(0, 24);
}

function buildTitle({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const styleWord = style.label;
  const gameWord = cat.label === 'Gaming' ? '' : ` ${cat.label}`;
  return `${styleWord}${gameWord} ${style.titleNoun} – TryhardNames Generator`;
}

function buildDescription({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const key = `${category}:${keyword}:desc`;

  const gamePhrase = cat.label === 'Gaming' ? 'for any game' : `for ${cat.label}`;
  const surface = pickVariant(key, cat.context?.surfaces || ['profile', 'leaderboards']);
  const hook = pickVariant(key, style.hooks || ['unique']);
  const vibeRef = pickVariant(key, cat.context?.vibeRefs || []);

  const openers = [
    `Generate ${style.label.toLowerCase()} ${style.titleNoun.toLowerCase()} ${gamePhrase} that look good in the ${surface}.`,
    `Find ${style.label.toLowerCase()} ${style.titleNoun.toLowerCase()} ${gamePhrase} that feel right for your playstyle and stay readable at a glance.`,
    `Copy-ready ${style.label.toLowerCase()} ${style.titleNoun.toLowerCase()} ${gamePhrase}, built to be memorable, clean, and easy to reuse.`,
  ];

  const closers = [
    `Includes formulas, do/don’t rules, and examples so you can pick a name that fits.`,
    `Use the tips and examples to tweak one element and make your final tag unique.`,
    `Built around ${hook} vibes${vibeRef ? ` and ${vibeRef} energy` : ''} so the style matches the community.`,
  ];

  return `${pickVariant(key, openers)} ${pickVariant(key, closers)}`;
}

function buildH1({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const gamePart = cat.label === 'Gaming' ? 'Gaming' : cat.label;
  return `${style.label} ${gamePart} ${style.titleNoun}`;
}

function buildSections({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const key = `${category}:${keyword}:sections`;

  const [a1, a2] = style.sectionAngles || ['Why this style works', 'Best formats'];

  const surface = pickVariant(key, cat.context?.surfaces || ['profile']);
  const constraint = pickVariant(key, cat.context?.constraints || []);
  const example = pickVariant(key, cat.context?.examples || []);
  const formulas = pickMany(key, style.formulas || [], 4);

  return [
    {
      title: a1,
      content: [
        `This page focuses on ${style.label.toLowerCase()} ${style.titleNoun.toLowerCase()} that match ${cat.label === 'Gaming' ? 'your platform' : cat.label} culture — built for ${cat.audience}.`,
        constraint ? `Context note: ${constraint}.` : null,
        surface ? `Design goal: look clean in the ${surface}.` : null,
        example ? `Fast example: ${example}.` : null,
      ].filter(Boolean).join(' '),
    },
    {
      title: a2,
      content: [
        ...cat.tips,
        ...(style.dos ? [`Style “do”: ${pickVariant(key, style.dos)}`] : []),
        ...(style.donts ? [`Style “don’t”: ${pickVariant(key, style.donts)}`] : []),
      ],
    },
    {
      title: 'Naming recipes (fast patterns)',
      content: [
        formulas.length ? `Formulas: ${formulas.join(' • ')}` : null,
        'Availability trick: keep the core word, then change exactly one element (suffix, spelling, or a second modifier).',
        keyword === 'cute' || keyword === 'aesthetic'
          ? 'Compatibility tip: test a plain ASCII version too (some platforms restrict special characters).'
          : 'Compatibility tip: avoid symbol stacking; it reduces readability and can fail platform checks.',
      ].filter(Boolean),
    },
    {
      title: `Examples and variations`,
      content: [
        `Start from a base idea, then iterate: “core” → “core+suffix” → “core+modifier”.`,
        `Try 3 quick edits: swap one vowel, add a short suffix, or switch the second word to match your vibe.`,
        ...(cat.context?.examples?.length ? [`Example starters: ${pickMany(key, cat.context.examples, 3).join(', ')}.`] : []),
      ],
    },
  ];
}

function buildFaqs({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const key = `${category}:${keyword}:faqs`;
  const base = style.faq || [];
  const surface = pickVariant(key, cat.context?.surfaces || ['profile']);
  const constraint = pickVariant(key, cat.context?.constraints || []);
  const extra = [
    {
      question: `Will these ${style.label.toLowerCase()} names work on all platforms?`,
      answer:
        "Most do, but every platform has its own restrictions. If a name uses symbols, try a plain version too. Always check character limits and blocked characters before you commit.",
    },
    {
      question: `How do I make a ${style.label.toLowerCase()} ${cat.label === 'Gaming' ? 'gaming' : cat.label.toLowerCase()} name unique?`,
      answer:
        'Start with a strong base word, then change one element: spelling, suffix, or a second modifier. Small changes often make the biggest availability difference.',
    },
    {
      question: `What should a good ${cat.label === 'Gaming' ? 'gaming' : cat.label} name look like in the ${surface}?`,
      answer: `It should be readable at a glance and easy to remember. If it is hard to type, hard to say, or visually noisy, it tends to get skipped faster in the ${surface}.`,
    },
    ...(constraint
      ? [
          {
            question: `Any ${cat.label === 'Gaming' ? 'platform' : cat.label} restrictions to keep in mind?`,
            answer: `Yes. ${constraint} When in doubt, keep the name simple (letters + one clean suffix) and avoid stacked symbols.`,
          },
        ]
      : []),
  ];
  return unique([...base, ...extra].map((x) => JSON.stringify(x))).map((s) => JSON.parse(s)).slice(0, 8);
}

function buildRelated({ category, keyword }) {
  const style = STYLE_DEFS[keyword];
  const sameCategory = (ALLOWED[category] || [])
    .filter((k) => k !== keyword)
    .slice(0, 4)
    .map((k) => ({
      slug: buildSlug(category, k),
      title: `${STYLE_DEFS[k].label} ${CATEGORY_DEFS[category].label} ${STYLE_DEFS[k].titleNoun}`,
    }));

  const crossCategory = Object.keys(CATEGORY_DEFS)
    .filter((c) => c !== category)
    .filter((c) => (ALLOWED[c] || []).includes(keyword))
    .slice(0, 3)
    .map((c) => ({
      slug: buildSlug(c, keyword),
      title: `${style.label} ${CATEGORY_DEFS[c].label === 'Gaming' ? 'Gaming' : CATEGORY_DEFS[c].label} ${style.titleNoun}`,
    }));

  return [...sameCategory, ...crossCategory];
}

export function getProgrammaticPageBySlug(slug) {
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
  if (!isProgrammaticSlug(normalized)) return null;

  const [category, keyword] = normalized.split('/').filter(Boolean);

  const pageSlug = buildSlug(category, keyword);
  const title = buildTitle({ category, keyword });
  const description = buildDescription({ category, keyword });
  const h1 = buildH1({ category, keyword });
  const sections = buildSections({ category, keyword });
  const names = buildNames({ category, keyword });
  const faqs = buildFaqs({ category, keyword });
  const related = buildRelated({ category, keyword });
  const linkBlocks = buildInternalLinkBlocks({ category, keyword });

  const breadcrumbName = `${CATEGORY_DEFS[category].label} ${STYLE_DEFS[keyword].label}`;
  const jsonLd = [
    breadcrumbListSchema([{ name: breadcrumbName, path: `/${pageSlug}` }]),
    faqPageSchema(faqs),
  ];

  return {
    slug: pageSlug,
    title,
    description,
    h1,
    sections,
    names,
    related,
    linkBlocks,
    faqs,
    jsonLd,
  };
}

export function getProgrammaticPagesByCategory(category) {
  const styles = ALLOWED[category] || [];
  return styles
    .map((keyword) => getProgrammaticPageBySlug(buildSlug(category, keyword)))
    .filter(Boolean);
}

