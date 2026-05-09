import { faqPageSchema } from '../schema.js';
import { getTopicHubRouteBySlug } from './topicHubRoutes.js';
import { buildLolKoreanSummonerNames, mergeLolKoreanLanePageData } from '../leagueOfLegends/lolKoreanLane.js';

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
      surfaces: ['scoreboard', 'killfeed', 'party UI', 'Riot profile', 'streamer overlays', 'agent select'],
      constraints: [
        'readability during fights matters (killfeed + scoreboard)',
        'compact tags look cleaner in Riot UI',
        'Riot naming culture favors clean competitive aliases',
        'esports aesthetics: minimal, pronounceable, brandable',
      ],
      vibeRefs: [
        'VCT',
        'Radiant',
        'Jett vibes',
        'Reyna vibes',
        'Chamber vibes',
        'aim demons',
        'clean esports tags',
        'edgy tactical aliases',
      ],
      examples: [
        'VCTCipher',
        'RadiantVex',
        'JettFlick',
        'ReynaClutch',
        'ChamberOnyx',
        'TapDiscipline',
        'AngleHolder',
        'EcoToAce',
      ],
    },
    tips: [
      'Prioritize readability at a glance (killfeed + scoreboard).',
      'Keep it compact for Riot UI (4–10 chars is a sweet spot).',
      'Avoid noisy suffixes (random years, symbol stacks).',
      'If you’re aiming for a “pro/VCT” feel: pick one strong word and keep spelling clean.',
    ],
    ctas: [
      { label: 'Sample a new tag', anchor: '#names' },
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
      { label: 'Sample another name', anchor: '#names' },
      { label: 'Explore Gamer Names', to: '/gamer-names' },
      { label: 'Stylish Text', to: '/stylish-text-generator' },
    ],
  },
  roblox: {
    label: 'Roblox',
    audience: 'roleplayers, creators, and competitive players',
    context: {
      surfaces: ['profile', 'chat', 'RP servers', 'group/clan pages', 'TikTok/short-form clips', 'avatar pages'],
      constraints: ['keep it platform-friendly and avoid borderline words', 'readability matters in chat bubbles and mobile UI'],
      vibeRefs: [
        'vibe',
        'obby',
        'studio',
        'roleplay',
        'cute/aesthetic',
        'soft usernames',
        'avatar branding',
        'TikTok naming',
        'premium handles',
      ],
      examples: [
        'MochiVibe',
        'CloudyObby',
        'PixelStudio',
        'StarryRP',
        'SoftBlox',
        'KitsuneVibe',
        'DollCoreRP',
        'AvatarAura',
        'PreppyVibe',
      ],
    },
    tips: [
      'Use playful words for cute/aesthetic styles (it performs better in RP).',
      'Avoid banned words; keep it platform-friendly.',
      'Mix vibe + role (or hobby) for memorability.',
    ],
    ctas: [
      { label: 'See Roblox-style ideas', anchor: '#names' },
      { label: 'Roblox hub', to: '/roblox-names' },
      { label: 'Add symbols', to: '/nickname-symbols' },
    ],
  },
  minecraft: {
    label: 'Minecraft',
    audience: 'SMP builders, PvP grinders, Bedwars mains, and roleplayers',
    context: {
      surfaces: ['chat', 'tab list', 'nametags', 'server leaderboards', 'Discord server lists', 'YouTube/Twitch'],
      constraints: [
        'short names are easier to spot in tab list fights',
        'avoid unreadable symbol stacks (many servers strip formatting)',
        'names should fit the server vibe (SMP vs PvP vs RP)',
      ],
      vibeRefs: ['SMP', 'Bedwars', 'PvP', 'survival', 'medieval', 'roleplay', 'Dream SMP vibes'],
      examples: ['SMPWanderer', 'BedwarsFlick', 'Blocksmith', 'NetherKnight', 'Oakbound', 'EnderVow', 'SkybridgeAce'],
    },
    tips: [
      'Pick a vibe that matches the server (SMP/RP vs PvP/Bedwars).',
      'Prioritize readability in chat + tab list (especially for PvP).',
      'Use “Minecraft nouns” sparingly (block, nether, ender) to avoid generic clones.',
    ],
    ctas: [
      { label: 'Sample Minecraft tags', anchor: '#names' },
      { label: 'Brandable usernames hub', to: '/brandable-usernames' },
      { label: 'Nickname symbols', to: '/nickname-symbols' },
    ],
  },
  cs2: {
    label: 'CS2',
    audience: 'faceit grinders, puggers, and esports fans',
    context: {
      surfaces: ['scoreboard', 'killfeed', 'Steam profile', 'team HUD', 'esports overlays'],
      constraints: ['clean aliases look better in HUD', 'one-word tags are more memorable', 'avoid clutter; keep it premium'],
      vibeRefs: ['OG tags', 'one-word aliases', 'pro player vibes', 'minimal branding', 'clean', 'edgy premium'],
      examples: ['RopzVibe', 'CleanAce', 'OneTap', 'SilentPeek', 'PixelRogue', 'OGAlias', 'DustWraith'],
    },
    tips: [
      'Aim for one strong word or a clean two-part alias (HUD friendly).',
      'Avoid random numbers; use a short suffix only if needed.',
      'Keep spelling simple—premium tags are easy to say out loud.',
    ],
    ctas: [
      { label: 'Sample CS2 aliases', anchor: '#names' },
      { label: 'Competitive hub', to: '/competitive-gamer-names' },
      { label: 'Brandable hub', to: '/brandable-usernames' },
    ],
  },
  apex: {
    label: 'Apex Legends',
    audience: 'movement grinders, ranked climbers, and Predator chasers',
    context: {
      surfaces: ['banner cards', 'killfeed', 'ranked lobbies', 'clips/YouTube titles', 'Twitch overlays'],
      constraints: ['short names look cleaner on banners', 'movement/aim identity reads faster than jokes in ranked'],
      vibeRefs: ['sweaty', 'movement gods', 'Predator vibes', 'ranked', 'arena aliases', 'clean competitive'],
      examples: ['StrafeGod', 'TapRecoil', 'PredVex', 'SlideNova', 'BeamCipher', 'ArenaWraith', 'ZiplineAce'],
    },
    tips: [
      'If you play ranked, choose a name that reads fast on banners and in killfeed.',
      'Movement/aim words (strafe, slide, beam) feel authentic to the community.',
      'Keep it clean—one signature word beats three modifiers.',
    ],
    ctas: [
      { label: 'Sample Apex tags', anchor: '#names' },
      { label: 'Competitive hub', to: '/competitive-gamer-names' },
      { label: 'Edgy hub', to: '/edgy-gamer-tags' },
    ],
  },
  'gta-rp': {
    label: 'GTA RP',
    audience: 'serious RP players, luxury RP creators, and gang storylines',
    context: {
      surfaces: ['server whitelists', 'in-game chat', 'character sheets', 'Discord rosters', 'stream overlays'],
      constraints: ['names should feel believable for the setting', 'avoid meme names for serious RP', 'clarity beats gimmicks'],
      vibeRefs: ['realistic identities', 'mafia aliases', 'cartel names', 'luxury RP', 'gang names', 'street culture'],
      examples: ['VitoMarconi', 'IslaNavarro', 'SantosCrown', 'LuciaRossi', 'CartelSombra', 'StreetSaint', 'GoldDistrict'],
    },
    tips: [
      'Match the server tone: serious RP prefers believable identities.',
      'Use name + surname formats or clean aliases (avoid clutter).',
      'If you want “criminal” vibes, keep it subtle and premium (no edgy spam).',
    ],
    ctas: [
      { label: 'Sample RP identities', anchor: '#names' },
      { label: 'Brandable hub', to: '/brandable-usernames' },
      { label: 'Edgy hub', to: '/edgy-gamer-tags' },
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
      { label: 'Explore tryhard tags', anchor: '#names' },
      { label: 'Browse home picks', to: '/' },
      { label: 'Try Stylish Text', to: '/stylish-text-generator' },
    ],
  },
  'league-of-legends': {
    label: 'League of Legends',
    audience: 'ranked grinders, ARAM enjoyers, and players building a long-term summoner identity',
    context: {
      surfaces: ['client', 'loading screen', 'death recap', 'op.gg', 'match history', 'Discord', 'clips'],
      constraints: [
        'your name is always visible—readability beats decoration',
        'Riot ID + tag means recall and pronunciation still matter',
        'queue context changes tone: what works in ranked may feel off in ARAM',
      ],
      vibeRefs: [
        'solo queue',
        'LCK-adjacent minimal',
        'one-word challenger tags',
        'sweaty ranked energy',
        'clean esports-adjacent aliases',
        'lobby humor',
      ],
      examples: ['Vex', 'CipherOn', 'SoloCurse', 'TapDuel', 'DriftLane', 'MutePing', 'NovaQueue'],
    },
    tips: [
      'Pick one lane (pro minimal vs sweaty vs funny) and stay consistent—mixed signals read as noise.',
      'Short, pronounceable handles survive seasons; meme stacks age fast.',
      'If you want “high-level minimal”, favor tight syllables and clean romanization over symbol stacks.',
    ],
    ctas: [
      { label: 'Explore all LoL lanes', to: '/league-of-legends' },
      { label: 'Open samples in this lane', anchor: '#names' },
      { label: 'Nickname symbols', to: '/nickname-symbols' },
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
      { label: 'More samples', anchor: '#names' },
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
  clean: {
    label: 'Clean',
    tone: 'esports',
    titleNoun: 'Names',
    hooks: ['clean', 'esports', 'minimal'],
    dos: ['Keep it short and pronounceable.', 'Prefer one strong word or a clean two-part alias.', 'Use consistent casing (no random caps).'],
    donts: ['Avoid symbol stacks.', 'Avoid random years.', 'Avoid overly generic words without a twist.'],
    formulas: ['[One word]', '[Short word] + X', '[Noun] + [Short suffix]', '[Two short words]'],
    faq: [
      {
        question: 'What makes a Valorant tag look clean?',
        answer:
          'Clean Valorant tags are short, readable in the scoreboard, and pronounceable. They avoid clutter (symbols/years) and feel like an esports alias.',
      },
      {
        question: 'Should a clean tag include game references?',
        answer:
          'Not usually. A subtle nod is fine, but clean tags perform best when they’re brandable across games and socials.',
      },
    ],
    sectionAngles: ['Clean esports tags that look pro', 'Minimal patterns that stay readable'],
    seed: ['Vex', 'Cipher', 'Onyx', 'Nova', 'Rogue', 'Pulse', 'Keen', 'Prime'],
  },
  aim: {
    label: 'Aim',
    tone: 'competitive',
    titleNoun: 'Names',
    hooks: ['aim', 'one tap', 'precision'],
    dos: ['Use precision words (tap, flick, discipline).', 'Keep it readable in killfeed.', 'One signature skill word beats multiple modifiers.'],
    donts: ['Avoid long phrases.', 'Avoid noisy numbers.', 'Avoid gimmick spelling that hurts readability.'],
    formulas: ['[Tap/Flick] + [Noun]', '[Skill word]', '[Verb] + [Noun]', '[Word] + Aim'],
    faq: [
      {
        question: 'What are “aim demon” Valorant names?',
        answer:
          'Aim-demon names emphasize precision and confidence—tap, flick, discipline, crosshair—designed to read clean in killfeed and clips.',
      },
      {
        question: 'Do aim names work for stream branding?',
        answer:
          'Yes, if your content matches. Aim-centric tags are easy to theme around for montages and highlight titles.',
      },
    ],
    sectionAngles: ['Aim-demon tags for clips', 'Precision patterns that look clean'],
    seed: ['OneTap', 'Flick', 'Discipline', 'Crosshair', 'TapGod', 'CleanFlick', 'AngleTap', 'AimKeen'],
  },
  tactical: {
    label: 'Tactical',
    tone: 'tactical',
    titleNoun: 'Names',
    hooks: ['tactical', 'utility', 'discipline'],
    dos: ['Use tactical nouns (angle, anchor, retake).', 'Keep it compact for Riot UI.', 'Sound calm and controlled, not edgy spam.'],
    donts: ['Avoid meme phrasing if you want serious vibes.', 'Avoid long words that wrap in UI.', 'Avoid symbol clutter.'],
    formulas: ['[Tactical noun]', '[Noun] + Holder', '[Verb] + Angle', '[Word] + Retake'],
    faq: [
      {
        question: 'What is a tactical Valorant name?',
        answer:
          'Tactical names lean into discipline and utility: anchor, angle, retake, default. They feel like a player who wins with decisions, not only aim.',
      },
      {
        question: 'Are tactical names better for IGL vibes?',
        answer:
          'Often yes—calm, controlled tags can signal leadership and a serious competitive mindset.',
      },
    ],
    sectionAngles: ['Tactical aliases that feel “VCT”', 'Utility-coded naming recipes'],
    seed: ['AngleHolder', 'Anchor', 'Retake', 'Default', 'MidControl', 'SilentRotate', 'EcoToAce', 'Lockdown'],
  },
  radiant: {
    label: 'Radiant',
    tone: 'ranked',
    titleNoun: 'Names',
    hooks: ['radiant', 'ranked', 'top'],
    dos: ['Keep it premium and minimal.', 'Use one rank-coded cue max.', 'Make it pronounceable for comms.'],
    donts: ['Avoid stacking rank words (Radiant+Immortal).', 'Avoid cringe exaggerations.', 'Avoid long numbers.'],
    formulas: ['Radiant + [Noun]', '[Noun] + Radiant', '[Short word] + Rank', '[Word] + RR'],
    faq: [
      {
        question: 'What are Radiant-style Valorant names?',
        answer:
          'Radiant-style names signal top-rank confidence: clean, minimal, and premium—built for scoreboard readability and ranked identity.',
      },
      {
        question: 'How do I avoid making it cringe?',
        answer:
          'Use one subtle rank cue (or none) and focus on a brandable core word. Premium beats loud.',
      },
    ],
    sectionAngles: ['Radiant vibes without the cringe', 'Ranked-coded patterns that stay clean'],
    seed: ['RadiantVex', 'RRPrime', 'TopFrag', 'ImmortalKeen', 'RankedCipher', 'CleanRadiant', 'VCTReady', 'AceRate'],
  },
  jett: {
    label: 'Jett',
    tone: 'agent',
    titleNoun: 'Names',
    hooks: ['jett', 'dash', 'op'],
    dos: ['Use dash/entry words (dash, drift, slice).', 'Keep it short for clips.', 'Add one sharp modifier max.'],
    donts: ['Avoid full agent names as the whole tag.', 'Avoid symbol spam.', 'Avoid long multi-word names.'],
    formulas: ['[Dash] + [Noun]', '[Word] + Knife', '[Word] + OP', '[Verb] + Dash'],
    faq: [
      {
        question: 'What are Jett-style gamer tags?',
        answer:
          'Jett tags lean fast and sharp: dash, knife, OP, entry. They fit clip culture and aggressive duelists.',
      },
      {
        question: 'Should I include “Jett” in the username?',
        answer:
          'Only if it’s subtle. A dash/entry-coded word often feels more premium than literally using the agent name.',
      },
    ],
    sectionAngles: ['Jett vibes for entry fraggers', 'Dash-coded patterns for clip culture'],
    seed: ['JettFlick', 'DashKnife', 'OPAngle', 'EntryNova', 'KnifeDrift', 'SliceDash', 'CloudPeek', 'FastRetake'],
  },
  reyna: {
    label: 'Reyna',
    tone: 'agent',
    titleNoun: 'Names',
    hooks: ['reyna', 'duelist', 'clutch'],
    dos: ['Use clutch/confidence words.', 'Keep it intimidating but readable.', 'One dark cue max (premium).'],
    donts: ['Avoid edgy spam.', 'Avoid long phrases.', 'Avoid noisy suffixes.'],
    formulas: ['[Clutch] + [Noun]', '[Dark noun] + [Skill]', '[Word] + Soul', '[Word] + Dismiss'],
    faq: [
      {
        question: 'What are Reyna-style Valorant names?',
        answer:
          'Reyna names feel confident and clutch-heavy—clean intimidation, soul/dismiss vibes, and scoreboard readability.',
      },
      {
        question: 'How do I keep it readable?',
        answer:
          'Prefer one strong word and a short suffix. If you add a dark cue, keep it subtle.',
      },
    ],
    sectionAngles: ['Reyna clutch vibes', 'Dark-clean patterns that still look premium'],
    seed: ['ReynaClutch', 'SoulTap', 'Dismissed', 'VoidClutch', 'AceVow', 'ShadowSoul', 'ClutchRuin', 'CleanVenom'],
  },
  chamber: {
    label: 'Chamber',
    tone: 'agent',
    titleNoun: 'Names',
    hooks: ['chamber', 'one tap', 'precision'],
    dos: ['Lean into precision + premium vibe.', 'Keep it minimal (fits Chamber aesthetic).', 'Use clean words that feel expensive.'],
    donts: ['Avoid clutter.', 'Avoid meme phrasing.', 'Avoid long numbers.'],
    formulas: ['[Luxury cue] + [Skill]', '[One word]', '[Word] + Ace', '[Word] + Op'],
    faq: [
      {
        question: 'What are Chamber-style Valorant names?',
        answer:
          'Chamber names feel premium and precise—clean words, “expensive” vibe, and one-tap confidence without clutter.',
      },
      {
        question: 'Should I use French words?',
        answer:
          'You can, but keep them readable. A premium feel comes more from minimalism than from hard-to-type words.',
      },
    ],
    sectionAngles: ['Chamber premium vibes', 'Minimal patterns that feel “expensive”'],
    seed: ['ChamberOnyx', 'GoldTap', 'VelvetAce', 'NoirOp', 'PrimeTap', 'CrownAngle', 'SilkClutch', 'CleanCipher'],
  },
  vct: {
    label: 'VCT',
    tone: 'esports',
    titleNoun: 'Tags',
    hooks: ['VCT', 'esports', 'pro'],
    dos: ['Make it jersey-friendly.', 'Keep it 3–8 chars if possible.', 'Pick a name you can commit to across socials.'],
    donts: ['Avoid symbols (unless your brand uses them everywhere).', 'Avoid long words.', 'Avoid copying known pro tags.'],
    formulas: ['[Short word]', '[Short word] + X', '[Word] + VCT (rare)', '[Initials]'],
    faq: [
      {
        question: 'What makes a VCT-style tag?',
        answer:
          'VCT-style tags are clean esports aliases: short, pronounceable, and consistent across platforms—designed for overlays and jerseys.',
      },
      {
        question: 'How do I choose a pro-feeling tag?',
        answer:
          'Pick a simple core word, avoid clutter, and test how it looks in small UI. If it’s easy to say and type, it’s usually better.',
      },
    ],
    sectionAngles: ['VCT-ready esports aliases', 'Brandable patterns for competitive identity'],
    seed: ['VCTCipher', 'VCTX', 'ProVex', 'KeenVCT', 'NovaIGL', 'EchoOp', 'PrimeAce', 'CleanIGL'],
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
  smp: {
    label: 'SMP',
    tone: 'server',
    titleNoun: 'Minecraft Names',
    hooks: ['SMP', 'survival', 'server'],
    dos: ['Pick a calm, story-friendly word.', 'Use builder/cottagecore/forest vibes if it fits.', 'Keep it easy to type on Java/Bedrock.'],
    donts: ['Avoid sweat-coded words if you play chill SMP.', 'Avoid ultra-generic “BlockGuy”.', 'Avoid noisy suffixes unless they are part of your brand.'],
    formulas: ['[Nature word] + [Role]', '[Noun] + [Soft suffix]', '[Place] + [Title]', '[Word] + SMP (rarely)'],
    faq: [
      {
        question: 'What is an SMP name?',
        answer:
          'SMP names fit survival multiplayer servers: calm, readable, and story-friendly. They often lean into nature, building themes, or light roleplay vibes.',
      },
      {
        question: 'Should SMP names be “Minecraft themed”?',
        answer:
          'A little is fine, but too much becomes generic. One subtle reference (nether, oak, ender) works better than stacking Minecraft words.',
      },
    ],
    sectionAngles: ['SMP vibes that feel authentic', 'Builder-friendly naming patterns'],
    seed: ['Oakbound', 'Mossroot', 'Wanderer', 'Blocksmith', 'Lantern', 'Hearth', 'Meadow', 'Ender'],
  },
  pvp: {
    label: 'PvP',
    tone: 'competitive',
    titleNoun: 'Minecraft Names',
    hooks: ['PvP', 'competitive', 'duels'],
    dos: ['Keep it short for tab list fights.', 'Choose sharp words (flick, clutch, edge).', 'Prefer clean spelling over leetspeak.'],
    donts: ['Avoid long multi-word names.', 'Avoid year suffixes.', 'Avoid symbol spam (servers may strip).'],
    formulas: ['[Skill word]', '[Verb] + [Noun]', '[Noun] + X', '[Short word] + [Short suffix]'],
    faq: [
      {
        question: 'What makes a Minecraft PvP name good?',
        answer:
          'PvP names should be short, readable, and intimidating without being messy. Think tab list readability and quick recognition.',
      },
      {
        question: 'Do symbols work on Minecraft servers?',
        answer:
          'Sometimes, but many servers strip or block special characters. A clean ASCII tag is the safest choice.',
      },
    ],
    sectionAngles: ['PvP tags that look clean in fights', 'Formats that win tab-list readability'],
    seed: ['Flick', 'Clutch', 'Combo', 'Aim', 'Edge', 'Tap', 'Wraith', 'Peak'],
  },
  bedwars: {
    label: 'Bedwars',
    tone: 'competitive',
    titleNoun: 'Minecraft Names',
    hooks: ['Bedwars', 'PvP', 'clutch'],
    dos: ['Use short, clip-friendly words.', 'Pick one signature word to build your identity.', 'Avoid clutter so it looks good on overlays.'],
    donts: ['Avoid long jokes if you’re comp.', 'Avoid overused “BedWarrior”.', 'Avoid random numbers.'],
    formulas: ['[Action] + [Noun]', '[Noun] + [Short suffix]', '[Word] + Bridge', '[Word] + Clutch'],
    faq: [
      {
        question: 'What are good Bedwars usernames?',
        answer:
          'Bedwars names are usually short and energetic—built for clips, fast fights, and quick recognition in the lobby and tab list.',
      },
      {
        question: 'Should I reference “bed” or “bridge” in my name?',
        answer:
          'A subtle reference can work, but avoid making it the whole identity. One clean nod is better than a literal “BedwarsName123”.',
      },
    ],
    sectionAngles: ['Bedwars names for clips', 'Clean patterns that look “main”'],
    seed: ['Skybridge', 'Rush', 'Final', 'Pearl', 'Combo', 'Clutch', 'Ace', 'Void'],
  },
  survival: {
    label: 'Survival',
    tone: 'cozy',
    titleNoun: 'Minecraft Names',
    hooks: ['survival', 'building', 'SMP'],
    dos: ['Use cozy words (hearth, lantern, meadow).', 'Pick a craft/role (smith, ranger).', 'Keep it story-friendly.'],
    donts: ['Avoid overly aggressive words for chill survival.', 'Avoid edgy terms if you’re RP-focused.', 'Avoid spammy punctuation.'],
    formulas: ['[Cozy noun]', '[Role] + [Place]', '[Word] + craft', '[Nature] + [Title]'],
    faq: [
      {
        question: 'What are survival Minecraft names?',
        answer:
          'Survival names lean cozy and story-like—good for building worlds, long-term servers, and friendly communities.',
      },
      {
        question: 'How do I make a survival name unique?',
        answer:
          'Use a specific role or vibe (LanternRanger, Blocksmith) instead of generic “SurvivalGuy”. One unique modifier usually does it.',
      },
    ],
    sectionAngles: ['Survival names that feel like a character', 'Patterns for long-term servers'],
    seed: ['Hearth', 'Lantern', 'Meadow', 'Oak', 'Ranger', 'Smith', 'Warden', 'Cinder'],
  },
  medieval: {
    label: 'Medieval',
    tone: 'roleplay',
    titleNoun: 'Minecraft Names',
    hooks: ['medieval', 'kingdom', 'RP'],
    dos: ['Use titles and archetypes (Knight, Scribe).', 'Pick one strong fantasy noun (steel, ember).', 'Keep it pronounceable.'],
    donts: ['Avoid modern slang (breaks RP).', 'Avoid too many titles.', 'Avoid overlong names.'],
    formulas: ['[Title] + [Noun]', '[Place] + [Title]', '[Noun] + of + [Noun] (short)', '[Word] + Knight'],
    faq: [
      {
        question: 'What makes a good medieval Minecraft name?',
        answer:
          'Medieval names sound like a character in a kingdom: titles, archetypes, and fantasy nouns—kept readable for chat and nametags.',
      },
      {
        question: 'Should I use “Sir/Lord/Lady” in my name?',
        answer:
          'It can work, but use one title max. Too many titles looks like cosplay spam and hurts readability.',
      },
    ],
    sectionAngles: ['Kingdom RP names that feel real', 'Medieval patterns that stay readable'],
    seed: ['NetherKnight', 'IronSquire', 'EmberScribe', 'StoneBaron', 'OakWarden', 'FrostMonk', 'DawnKnight', 'Crownforge'],
  },
  rp: {
    label: 'Roleplay',
    tone: 'roleplay',
    titleNoun: 'Usernames',
    hooks: ['RP', 'roleplay', 'server'],
    dos: ['Use a name that implies a role (scribe, ranger).', 'Keep it platform-friendly.', 'Match the server theme (medieval, city, school).'],
    donts: ['Avoid meme names if you want serious RP.', 'Avoid overly long titles.', 'Avoid symbols that break immersion.'],
    formulas: ['[Name] + [Role]', '[Role] + of + [Place]', '[Vibe] + [Role]', '[Two-word character name]'],
    faq: [
      {
        question: 'What are good RP usernames?',
        answer:
          'RP usernames are character-first: readable, theme-consistent, and easy for other players to address in chat.',
      },
      {
        question: 'Should RP names be realistic?',
        answer:
          'They should fit the world. “Realistic” depends on the server theme—fantasy RP can be stylized, modern RP can be simple.',
      },
    ],
    sectionAngles: ['RP names that fit the world', 'Character-first naming patterns'],
    seed: ['StarryRP', 'LanternRanger', 'KitsuneVibe', 'CityScribe', 'DollCore', 'OakWarden', 'MoonClerk', 'SkyNomad'],
  },
  soft: {
    label: 'Soft',
    tone: 'aesthetic',
    titleNoun: 'Usernames',
    hooks: ['soft', 'cozy', 'aesthetic'],
    dos: ['Use cozy nouns (mochi, peach, cloud).', 'Keep it lowercase-ish in vibe.', 'One soft symbol max.'],
    donts: ['Avoid harsh words.', 'Avoid stacked separators.', 'Avoid random numbers.'],
    formulas: ['[Soft noun]', '[Soft noun] + [Vibe]', '[Word] + ♡', '[Two soft words]'],
    faq: [
      {
        question: 'What are soft usernames?',
        answer:
          'Soft usernames lean cozy, friendly, and aesthetic. They’re common in Roblox RP, TikTok naming styles, and avatar branding.',
      },
      {
        question: 'Do soft usernames work outside Roblox?',
        answer:
          'Yes—soft names often perform well on socials too because they’re memorable and visually consistent.',
      },
    ],
    sectionAngles: ['Soft vibes without being generic', 'Patterns that look good on profiles'],
    seed: ['SoftBlox', 'Mochi', 'Peach', 'Cloudy', 'DollCore', 'Starry', 'Luna', 'Cozy'],
  },
  tiktok: {
    label: 'TikTok',
    tone: 'social',
    titleNoun: 'Usernames',
    hooks: ['TikTok', 'aesthetic', 'avatar'],
    dos: ['Make it handle-friendly (easy to type).', 'Use a consistent aesthetic keyword.', 'Keep it readable on mobile.'],
    donts: ['Avoid long numbers.', 'Avoid confusing separators.', 'Avoid too many emojis/symbols.'],
    formulas: ['[Vibe] + [Noun]', '[Noun] + era', '[Word] + core', '[Two short words]'],
    faq: [
      {
        question: 'What makes a good TikTok-style username?',
        answer:
          'A TikTok-style username is short, aesthetic, and easy to type. It usually signals a vibe (soft, core, era) and looks clean on mobile.',
      },
      {
        question: 'Should I match my avatar to my username?',
        answer:
          'Yes. Consistency helps recall and CTR—matching vibe words and visual style makes profiles feel “finished”.',
      },
    ],
    sectionAngles: ['Handle-first names for mobile', 'Avatar branding patterns'],
    seed: ['VibeEra', 'DollCore', 'SoftCore', 'PixelEra', 'Cloudcore', 'StarEra', 'MochiCore', 'AestheticBlox'],
  },
  avatar: {
    label: 'Avatar',
    tone: 'social',
    titleNoun: 'Usernames',
    hooks: ['avatar', 'branding', 'profile'],
    dos: ['Pick one aesthetic keyword that matches your avatar.', 'Keep it handle-friendly.', 'Use consistent casing and rhythm.'],
    donts: ['Avoid cluttered symbols.', 'Avoid long numbers.', 'Avoid mixing three vibes at once.'],
    formulas: ['[Vibe] + [Noun]', '[Noun] + aura', '[Word] + core', '[Two short words]'],
    faq: [
      {
        question: 'What is “avatar branding” for usernames?',
        answer:
          'It means your username and your avatar tell the same story. Matching vibe words (soft, luxe, anime) to your visuals increases recall and makes profiles feel premium.',
      },
      {
        question: 'How do I make an avatar-style username look premium?',
        answer:
          'Keep it short, readable, and consistent. One strong vibe word plus a clean noun often beats complicated styling.',
      },
    ],
    sectionAngles: ['Profile-first usernames that match your look', 'Premium patterns for avatar handles'],
    seed: ['AvatarAura', 'VibeMuse', 'SoftLuxe', 'PixelDoll', 'NeonMuse', 'CloudAura', 'StarMuse', 'DollCore'],
  },
  'one-word': {
    label: 'One-Word',
    tone: 'minimal',
    titleNoun: 'Aliases',
    hooks: ['one word', 'clean', 'minimal'],
    dos: ['Choose a word you can say out loud.', 'Prefer short syllables.', 'Avoid confusing spelling.'],
    donts: ['Avoid numbers.', 'Avoid underscores.', 'Avoid trendy slang that ages fast.'],
    formulas: ['[One strong noun]', '[One strong verb]', '[Short archetype]', '[Myth word]'],
    faq: [
      {
        question: 'Why do one-word tags feel premium?',
        answer:
          'They look clean in HUD/scoreboards and are easy to remember. One-word aliases also transfer better across platforms and socials.',
      },
      {
        question: 'How do I find a one-word name that is available?',
        answer:
          'Try a slight spelling twist, a short suffix, or a rarer synonym. Keep the result readable and pronounceable.',
      },
    ],
    sectionAngles: ['One-word aliases that look pro', 'Availability-friendly patterns'],
    seed: ['Rogue', 'Onyx', 'Cipher', 'Wraith', 'Vex', 'Prime', 'Echo', 'Drift'],
  },
  korean: {
    label: 'KR ladder minimal',
    tone: 'minimal',
    titleNoun: 'Handles',
    hooks: ['solo queue', 'roman-letter restraint', 'minimal', 'high elo'],
    dos: [
      'Favor short, legible romanized syllables that read well in client and op.gg.',
      'Keep one clear rhythm (two short parts or one tight token).',
      'Treat this as a naming habit echo, not cosplay of real pros.',
    ],
    donts: [
      'Avoid random Korean morphemes you cannot explain.',
      'Avoid caricature or faux “hangul vibe” clutter.',
      'Avoid mixing this lane with edgy meme stacks—it dilutes the minimal read.',
    ],
    formulas: ['[Short romanized syllable pair]', '[Tight 4–7 letter token]', '[Soft noun] + [short suffix]', '[Minimal two-word]'],
    faq: [
      {
        question: 'What does “KR ladder minimal” mean on this page?',
        answer:
          'It names the restraint-heavy roman-letter tags common in elite solo queue culture—short, legible, calm presence in client and op.gg. Not a category of “Korean names”; pattern discipline, not ethnicity.',
      },
      {
        question: 'Who is this lane for?',
        answer:
          'Anyone chasing that aspirational high-elo identity fantasy—whether or not you play on KR. The aim is quiet confidence, not cosplay.',
      },
    ],
    sectionAngles: ['Minimal handles that read fast in client', 'Culturally aware, restrained'],
    seed: ['Soo', 'Min', 'Jin', 'Hane', 'Rae', 'Kyul', 'Nae', 'Eon'],
  },
  movement: {
    label: 'Movement',
    tone: 'competitive',
    titleNoun: 'Tags',
    hooks: ['movement', 'strafe', 'slide'],
    dos: ['Use movement verbs (slide, strafe).', 'Keep it short for banners/HUD.', 'Pick one signature word.'],
    donts: ['Avoid long jokes in ranked contexts.', 'Avoid number clutter.', 'Avoid symbol stacks.'],
    formulas: ['[Movement] + [Noun]', '[Verb] + [Short noun]', '[Noun] + Glide', '[Word] + Strafe'],
    faq: [
      {
        question: 'What are movement-style gamer tags?',
        answer:
          'Movement tags signal speed and mechanics: slide, strafe, glide, zip. They’re popular in Apex and other high-mobility shooters.',
      },
      {
        question: 'Do movement tags help your brand?',
        answer:
          'Yes—if it matches your content. A movement-centric name is easy to build a theme around for clips and highlights.',
      },
    ],
    sectionAngles: ['Movement tags that feel authentic', 'Clean patterns for high-mobility games'],
    seed: ['Strafe', 'Slide', 'Glide', 'Zipline', 'Skate', 'Dash', 'Drift', 'Beam'],
  },
  predator: {
    label: 'Predator',
    tone: 'competitive',
    titleNoun: 'Tags',
    hooks: ['predator', 'ranked', 'sweaty'],
    dos: ['Keep it intimidating but clean.', 'Use ranked/skill words sparingly.', 'Stay readable on banners.'],
    donts: ['Avoid edgy spam.', 'Avoid long numbers.', 'Avoid “top 10” clones.'],
    formulas: ['[Dark noun] + [Skill word]', '[Rank] + [Noun]', '[Noun] + Pred', '[Word] + Apex'],
    faq: [
      {
        question: 'What are Predator-style names?',
        answer:
          'Predator-style names are ranked-coded, competitive tags built to feel intimidating and clean—popular with Apex Pred/masters grinders.',
      },
      {
        question: 'How do I avoid making it cringe?',
        answer:
          'Keep it short and readable. One strong word beats stacking “Pred/Ranked/Sweaty” in the same tag.',
      },
    ],
    sectionAngles: ['Pred vibes without the cringe', 'Ranked-ready clean patterns'],
    seed: ['PredVex', 'ApexWraith', 'RankedVoid', 'MasterCipher', 'SweatPrime', 'ClutchPred', 'VoidPred', 'BeamPred'],
  },
  realistic: {
    label: 'Realistic',
    tone: 'roleplay',
    titleNoun: 'RP Names',
    hooks: ['realistic', 'identity', 'roleplay'],
    dos: ['Use believable name + surname.', 'Match the server setting (modern vs mafia).', 'Keep it easy to read in chat.'],
    donts: ['Avoid meme names for serious RP.', 'Avoid edgy spam.', 'Avoid excessive symbols.'],
    formulas: ['[First] [Last]', '[First] [Last] (2 syllables)', '[Surname] + [Title] (rare)', '[Name] + [District]'],
    faq: [
      {
        question: 'What makes an RP identity feel realistic?',
        answer:
          'Believable structure (first + last), readable spelling, and a vibe that fits the server setting. Realistic names help immersion and recognition.',
      },
      {
        question: 'Should I use special characters in RP names?',
        answer:
          'Usually no. Clean names feel more believable and are easier for other players to type and remember.',
      },
    ],
    sectionAngles: ['Realistic identities for serious RP', 'Patterns that feel believable'],
    seed: ['Vito', 'Rossi', 'Marconi', 'Navarro', 'Santos', 'DeLuca', 'Moretti', 'Valenti'],
  },
  mafia: {
    label: 'Mafia',
    tone: 'roleplay',
    titleNoun: 'Aliases',
    hooks: ['mafia', 'mob', 'alias'],
    dos: ['Keep it subtle and premium.', 'Use name + surname or clean alias.', 'Avoid over-the-top edgy words.'],
    donts: ['Avoid threats/offense.', 'Avoid symbol clutter.', 'Avoid long phrases.'],
    formulas: ['[First] [Last]', '[Alias] + [Surname]', '[Surname] + [Title]', '[District] + [Surname]'],
    faq: [
      {
        question: 'What are good mafia-style RP names?',
        answer:
          'Mafia RP names are believable and clean—Italian/LatAm-inspired surnames, subtle aliases, and premium readability.',
      },
      {
        question: 'How do I keep it immersive?',
        answer:
          'Use realistic structure and avoid meme references. One subtle nickname is fine, but don’t stack criminal keywords.',
      },
    ],
    sectionAngles: ['Mafia aliases that feel believable', 'Clean patterns for serious RP'],
    seed: ['Rossi', 'Marconi', 'Moretti', 'DeLuca', 'Valenti', 'Capo', 'Consigliere', 'Santos'],
  },
  cartel: {
    label: 'Cartel',
    tone: 'roleplay',
    titleNoun: 'Aliases',
    hooks: ['cartel', 'alias', 'street'],
    dos: ['Use subtle Spanish/LatAm-coded words sparingly.', 'Keep it readable and premium.', 'Match the server’s seriousness.'],
    donts: ['Avoid glorifying violence.', 'Avoid offensive terms.', 'Avoid keyword stuffing.'],
    formulas: ['[Alias] + [Surname]', '[First] [Last]', '[Word] + Sombra', '[District] + [Alias]'],
    faq: [
      {
        question: 'What are cartel-style RP aliases?',
        answer:
          'Cartel-style aliases are subtle, coded names that fit a serious RP setting—clean spelling, premium vibe, and believable identity structure.',
      },
      {
        question: 'Can cartel names get you in trouble?',
        answer:
          'Avoid anything offensive or that glorifies harm. Keep it within fictional, non-threatening vibes and follow server rules.',
      },
    ],
    sectionAngles: ['Coded aliases without being edgy', 'Believable patterns for RP'],
    seed: ['Sombra', 'Navarro', 'Isla', 'Santos', 'Cielo', 'Oro', 'Distrito', 'Rosa'],
  },
  luxury: {
    label: 'Luxury',
    tone: 'roleplay',
    titleNoun: 'RP Names',
    hooks: ['luxury', 'premium', 'clean'],
    dos: ['Use premium words (gold, crown, district).', 'Keep it short and elegant.', 'Match your character archetype.'],
    donts: ['Avoid tacky spelling.', 'Avoid long numbers.', 'Avoid too many modifiers.'],
    formulas: ['[Surname] + [District]', '[Gold] + [Noun]', '[Word] + Crown', '[Two elegant words]'],
    faq: [
      {
        question: 'What are luxury RP names?',
        answer:
          'Luxury RP names are clean, elegant identities for high-end characters: district-coded, premium vocabulary, and high readability.',
      },
      {
        question: 'How do I make a luxury name not cheesy?',
        answer:
          'Keep it subtle: one premium cue (Gold, Crown, District) plus a clean name beats stacking luxury keywords.',
      },
    ],
    sectionAngles: ['Luxury identities that feel premium', 'Elegant patterns for high-end RP'],
    seed: ['GoldDistrict', 'SantosCrown', 'Velvet', 'Crown', 'Marble', 'Silk', 'District', 'Noir'],
  },
  gang: {
    label: 'Gang',
    tone: 'roleplay',
    titleNoun: 'Aliases',
    hooks: ['gang', 'crew', 'street'],
    dos: ['Keep it believable and readable.', 'Use a crew-style alias that fits the arc.', 'Avoid threats/offense.'],
    donts: ['Avoid slurs.', 'Avoid violent language.', 'Avoid spammy symbols.'],
    formulas: ['[Street word] + [Alias]', '[Alias] + Crew', '[District] + [Alias]', '[Nickname] + [Surname]'],
    faq: [
      {
        question: 'What makes a good gang RP alias?',
        answer:
          'A good gang RP alias is believable, readable, and fits your character story. It should sound natural in dialogue and look clean in chat.',
      },
      {
        question: 'Should I include “gang/crew” in the name?',
        answer:
          'Usually no. It’s better implied through vibe and story than literally included as a keyword.',
      },
    ],
    sectionAngles: ['Crew-style aliases that feel real', 'Believable patterns for street arcs'],
    seed: ['StreetSaint', 'NoirCrew', 'DistrictGhost', 'SantosKid', 'GoldBoy', 'SideStreet', 'RogueKid', 'NightCrew'],
  },
  street: {
    label: 'Street',
    tone: 'roleplay',
    titleNoun: 'Aliases',
    hooks: ['street', 'culture', 'RP'],
    dos: ['Use subtle street-coded words (district, side, night).', 'Keep it short.', 'Make it easy to say in voice RP.'],
    donts: ['Avoid stereotypes/offense.', 'Avoid edgy spam.', 'Avoid long phrases.'],
    formulas: ['[District] + [Alias]', '[Night] + [Noun]', '[Side] + [Surname]', '[Alias] + [Street]'],
    faq: [
      {
        question: 'What are street-culture RP names?',
        answer:
          'Street-culture RP names are believable aliases with subtle vocabulary cues. They’re designed for immersion and quick recognition in chat and rosters.',
      },
      {
        question: 'How do I keep it authentic?',
        answer:
          'Keep it subtle, readable, and consistent with your character. Avoid overdoing keywords and focus on one clear vibe.',
      },
    ],
    sectionAngles: ['Street-coded names without keyword spam', 'Patterns for believable voice RP'],
    seed: ['NightDistrict', 'SideStreet', 'SantosNoir', 'DistrictSaint', 'StreetGhost', 'GoldSide', 'NoirSaint', 'CrownStreet'],
  },
  brandable: {
    label: 'Brandable',
    tone: 'brand',
    titleNoun: 'Usernames',
    hooks: ['brandable', 'clean', 'memorable'],
    dos: ['Make it pronounceable.', 'Keep it short enough for handles.', 'Prefer one clear theme per name.'],
    donts: ['Avoid random numbers.', 'Avoid symbol stacks.', 'Avoid overly generic words without a twist.'],
    formulas: ['[One strong noun]', '[Modifier] + [Noun]', '[Short word] + X', '[Two short words]'],
    faq: [
      {
        question: 'What is a brandable username?',
        answer:
          'A brandable username is easy to remember, easy to say out loud, and consistent across platforms. It looks clean on profiles and overlays.',
      },
      {
        question: 'How do I make my username brandable but still unique?',
        answer:
          'Start with a strong base word, then add one small twist: a short modifier, a subtle suffix, or a spelling change that stays readable.',
      },
    ],
    sectionAngles: ['Brand-friendly names that scale', 'Patterns that improve recall'],
    seed: ['Nova', 'Rogue', 'Onyx', 'Echo', 'Pulse', 'Vortex', 'Prime', 'Cipher'],
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
  valorant: [
    // keep existing slugs stable
    'sweaty',
    'funny',
    'pro',
    'aesthetic',
    'cool',
    'tryhard',
    'edgy',
    // premium Valorant cluster expansion
    'clean',
    'tactical',
    'jett',
    'reyna',
    'chamber',
    'radiant',
    'aim',
    'vct',
  ],
  fortnite: ['sweaty', 'funny', 'pro', 'og', 'cool', 'tryhard'],
  roblox: ['cute', 'soft', 'aesthetic', 'anime', 'tiktok', 'avatar', 'rp', 'cool', 'tryhard', 'funny'],
  minecraft: ['smp', 'survival', 'pvp', 'bedwars', 'medieval', 'og', 'cool', 'brandable'],
  cs2: ['one-word', 'og', 'pro', 'cool', 'edgy', '3-letter', 'brandable'],
  apex: ['movement', 'predator', 'sweaty', 'pro', 'cool', 'tryhard', 'edgy'],
  'gta-rp': ['realistic', 'mafia', 'cartel', 'luxury', 'gang', 'street', 'brandable'],
  cod: ['sweaty', 'funny', 'pro', 'cool', 'tryhard', 'edgy'],
  'league-of-legends': [
    'pro',
    'sweaty',
    'tryhard',
    'one-word',
    '3-letter',
    'clean',
    'korean',
    'aesthetic',
    'anime',
    'funny',
    'edgy',
    'brandable',
    'cool',
  ],
  general: ['best', 'cool', 'funny', 'pro', 'anime', '3-letter', 'edgy'],
};

const STYLE_INTENTS = {
  sweaty: ['competitive'],
  tryhard: ['competitive'],
  pro: ['competitive', 'brandable'],
  funny: ['humor'],
  cute: ['aesthetic'],
  aesthetic: ['aesthetic', 'brandable'],
  cool: ['brandable'],
  edgy: ['dark'],
  og: ['nostalgia', 'brandable'],
  best: ['curated', 'brandable'],
  anime: ['fandom', 'aesthetic', 'brandable'],
  '3-letter': ['minimal', 'brandable'],
  smp: ['aesthetic', 'brandable'],
  survival: ['aesthetic', 'brandable'],
  pvp: ['competitive'],
  bedwars: ['competitive'],
  medieval: ['nostalgia', 'brandable', 'aesthetic'],
  rp: ['aesthetic', 'brandable'],
  soft: ['aesthetic', 'brandable'],
  tiktok: ['brandable', 'aesthetic'],
  brandable: ['brandable', 'minimal'],
  avatar: ['brandable', 'aesthetic'],
  'one-word': ['minimal', 'brandable'],
  korean: ['minimal', 'brandable', 'competitive'],
  movement: ['competitive', 'brandable'],
  predator: ['competitive', 'dark'],
  realistic: ['brandable'],
  mafia: ['dark', 'nostalgia', 'brandable'],
  cartel: ['dark', 'brandable'],
  luxury: ['brandable', 'aesthetic'],
  gang: ['dark', 'brandable'],
  street: ['dark', 'brandable'],
  // Valorant premium styles
  clean: ['minimal', 'brandable', 'competitive'],
  aim: ['competitive', 'brandable'],
  tactical: ['competitive', 'brandable'],
  radiant: ['competitive', 'brandable'],
  jett: ['competitive'],
  reyna: ['competitive', 'dark'],
  chamber: ['competitive', 'brandable'],
  vct: ['competitive', 'brandable', 'minimal'],
};

const INTENT_ADJACENCY = {
  competitive: ['brandable', 'dark', 'minimal'],
  aesthetic: ['brandable', 'minimal', 'fandom'],
  brandable: ['competitive', 'aesthetic', 'minimal', 'curated', 'fandom', 'nostalgia'],
  minimal: ['brandable', 'aesthetic'],
  dark: ['competitive', 'brandable', 'minimal'],
  humor: ['brandable'],
  nostalgia: ['brandable', 'curated', 'aesthetic'],
  curated: ['brandable'],
  fandom: ['aesthetic', 'brandable'],
};

const TOPIC_HUBS = {
  competitive: { slug: 'competitive-gamer-names', label: 'Competitive Gamer Names' },
  aesthetic: { slug: 'aesthetic-gaming-tags', label: 'Aesthetic Gaming Tags' },
  brandable: { slug: 'brandable-usernames', label: 'Brandable Usernames' },
  dark: { slug: 'edgy-gamer-tags', label: 'Edgy Gamer Tags' },
};

const STYLE_TERMS = {
  sweaty: ['Sweaty', 'Ranked', 'Competitive'],
  tryhard: ['Tryhard', 'Sweaty', 'Ranked'],
  pro: ['Pro', 'Esports', 'Competitive'],
  funny: ['Funny', 'Meme', 'Funny'],
  cute: ['Cute', 'Cozy', 'Soft'],
  aesthetic: ['Aesthetic', 'Clean', 'Minimal'],
  cool: ['Cool', 'Clean', 'Modern'],
  edgy: ['Edgy', 'Dark', 'Shadow'],
  og: ['OG', 'Classic', 'Rare'],
  best: ['Best', 'Top', 'Popular'],
  anime: ['Anime', 'Anime', 'Fandom'],
  '3-letter': ['3-Letter', 'Short', 'Minimal'],
  // Valorant premium styles
  clean: ['Clean', 'Esports', 'Minimal'],
  tactical: ['Tactical', 'Utility', 'Discipline'],
  jett: ['Jett', 'Dash', 'Entry'],
  reyna: ['Reyna', 'Clutch', 'Duelist'],
  chamber: ['Chamber', 'Premium', 'One-Tap'],
  radiant: ['Radiant', 'Top', 'Ranked'],
  aim: ['Aim', 'One-Tap', 'Flick'],
  vct: ['VCT', 'Esports', 'Pro'],
  smp: ['SMP', 'Survival SMP', 'SMP'],
  survival: ['Survival', 'SMP Survival', 'Survival'],
  pvp: ['PvP', 'PvP', 'Competitive'],
  bedwars: ['Bedwars', 'Bed Wars', 'Bedwars'],
  medieval: ['Medieval', 'Kingdom', 'Medieval'],
  rp: ['Roleplay', 'RP', 'Roleplay'],
  soft: ['Soft', 'Cozy', 'Soft'],
  tiktok: ['TikTok', 'Profile', 'Aesthetic'],
  brandable: ['Brandable', 'Clean', 'Memorable'],
  avatar: ['Avatar', 'Profile', 'Brand'],
  'one-word': ['One-Word', 'One Word', 'Minimal'],
  korean: ['KR ladder', 'Minimal', 'Solo queue'],
  movement: ['Movement', 'Strafe', 'Slide'],
  predator: ['Predator', 'Ranked', 'Sweaty'],
  realistic: ['Realistic', 'Roleplay', 'Identity'],
  mafia: ['Mafia', 'Mob', 'Alias'],
  cartel: ['Cartel', 'Coded', 'Alias'],
  luxury: ['Luxury', 'Premium', 'Clean'],
  gang: ['Gang', 'Crew', 'Street'],
  street: ['Street', 'District', 'RP'],
};

const TITLE_TEMPLATES = {
  competitive: [
    '{style} {game} {noun} – Clean Ranked Tags | TryhardNames',
    '{style} {game} {noun} – Tryhard Usernames for Ranked | TryhardNames',
    '{style} {game} {noun} – Copy-Paste Tags That Look Pro | TryhardNames',
  ],
  aesthetic: [
    '{style} {game} {noun} – Clean, Cute & Minimal | TryhardNames',
    '{style} {game} {noun} – Aesthetic Tags for Profiles | TryhardNames',
    '{style} {game} {noun} – Soft Vibes, Readable Names | TryhardNames',
  ],
  brandable: [
    '{style} {game} {noun} – Brandable Usernames | TryhardNames',
    '{style} {game} {noun} – Clean Tags for Gaming & Socials | TryhardNames',
    '{style} {game} {noun} – Memorable, Easy-to-Type Names | TryhardNames',
  ],
  dark: [
    '{style} {game} {noun} – Dark, Clean & Premium | TryhardNames',
    '{style} {game} {noun} – Edgy Tags Without Spam | TryhardNames',
    '{style} {game} {noun} – Shadow Vibes, Readable Names | TryhardNames',
  ],
  humor: [
    '{style} {game} {noun} – Funny Usernames That Get Reactions | TryhardNames',
    '{style} {game} {noun} – Meme Tags (Still Readable) | TryhardNames',
    '{style} {game} {noun} – Funny Names for Clips | TryhardNames',
  ],
  nostalgia: [
    '{style} {game} {noun} – Classic OG Tags | TryhardNames',
    '{style} {game} {noun} – Timeless, Clean Usernames | TryhardNames',
    '{style} {game} {noun} – Rare-Feeling Names | TryhardNames',
  ],
  curated: [
    '{style} {game} {noun} – Top Picks You Can Copy | TryhardNames',
    '{style} {game} {noun} – Readable Tag Picks | TryhardNames',
    '{style} {game} {noun} – Popular Names (Updated) | TryhardNames',
  ],
  fandom: [
    '{style} {game} {noun} – Anime-Inspired Tags | TryhardNames',
    '{style} {game} {noun} – Clean Anime Usernames | TryhardNames',
    '{style} {game} {noun} – Fandom Vibes, Original Names | TryhardNames',
  ],
  minimal: [
    '{style} {game} {noun} – Short, Clean Tags | TryhardNames',
    '{style} {game} {noun} – Minimal Names That Look Premium | TryhardNames',
    '{style} {game} {noun} – Simple Tags, High Recall | TryhardNames',
  ],
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

  // Minecraft ↔ Roblox semantic bridge (small, contextual, non-spam)
  const isBridgeCategory = category === 'minecraft' || category === 'roblox';
  const bridgeTarget = category === 'minecraft' ? 'roblox' : category === 'roblox' ? 'minecraft' : null;
  const bridgeCandidates = [];
  if (isBridgeCategory && bridgeTarget) {
    const fromIntents = STYLE_INTENTS[keyword] || [];
    const targetStyles = (ALLOWED[bridgeTarget] || []).filter((k) => k && k !== keyword);
    for (const ts of targetStyles) {
      const toIntents = STYLE_INTENTS[ts] || [];
      const shares = fromIntents.some((i) => toIntents.includes(i));
      const adjacent = fromIntents.some((i) => (INTENT_ADJACENCY[i] || []).some((a) => toIntents.includes(a)));
      if (shares || adjacent) {
        bridgeCandidates.push({ category: bridgeTarget, keyword: ts });
      }
    }
  }
  const semanticBridge = bridgeCandidates.length
    ? selectTopLinks(`${key}:bridge`, bridgeCandidates, 3, category, keyword)
    : [];

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
  if (semanticBridge.length) {
    blocks.push({
      title: bridgeTarget === 'roblox' ? 'Roblox pages with similar vibes' : 'Minecraft pages with similar vibes',
      links: semanticBridge,
    });
  }
  if (trendingLinks.length) blocks.push({ title: 'Trending combinations', links: trendingLinks });

  // cap blocks for UX
  return blocks.slice(0, 4);
}

function buildTopicHubRecommendation({ category, keyword }) {
  // One hub per page: deterministic + intent-first
  const intents = STYLE_INTENTS[keyword] || [];
  const primary = intents[0];
  const secondary = intents[1];

  const hub =
    (primary && TOPIC_HUBS[primary]) ||
    (secondary && TOPIC_HUBS[secondary]) ||
    (primary && (INTENT_ADJACENCY[primary] || []).map((i) => TOPIC_HUBS[i]).find(Boolean)) ||
    (secondary && (INTENT_ADJACENCY[secondary] || []).map((i) => TOPIC_HUBS[i]).find(Boolean)) ||
    TOPIC_HUBS.brandable;

  // slight contextual label for UX without keyword stuffing
  const catLabel = CATEGORY_DEFS[category]?.label || 'Gaming';
  const styleLabel = STYLE_DEFS[keyword]?.label || 'Style';

  const prompts = [
    `See the ${hub.label} hub`,
    `Browse ${hub.label}`,
    `Explore ${hub.label}`,
  ];

  const route = getTopicHubRouteBySlug(hub.slug);
  const cta = pickVariant(`${category}:${keyword}:hubCta`, prompts) || prompts[0];
  const desc = `${styleLabel} patterns across games — plus related intents and top picks.`;

  return {
    slug: hub.slug,
    path: route?.path || `/${hub.slug}`,
    title: hub.label,
    cta,
    desc,
    // helpful for debugging/analytics later without changing SEO surface
    meta: { category: catLabel, style: styleLabel, intent: primary || 'brandable' },
  };
}

function buildNames({ category, keyword }) {
  if (category === 'league-of-legends' && keyword === 'korean') {
    return buildLolKoreanSummonerNames();
  }

  const style = STYLE_DEFS[keyword];
  const cat = CATEGORY_DEFS[category];

  const base = style.seed || [];
  const extras =
    category === 'valorant'
      ? ['VLR', 'Radiant', 'Flick', 'Dash', 'Omen', 'Jett']
      : category === 'fortnite'
        ? ['Build', 'Edit', 'Arena', 'Zone', 'Pump', 'Solo']
        : category === 'roblox'
          ? ['Blox', 'Studio', 'Obby', 'RP', 'Vibe', 'Pixel', 'Core', 'Era']
          : category === 'minecraft'
            ? ['Block', 'Nether', 'Ender', 'Creeper', 'Warden', 'Pearl', 'Skybridge', 'SMP']
            : category === 'cs2'
              ? ['Dust', 'Inferno', 'Mirage', 'Nuke', 'OneTap', 'Clutch', 'Peek', 'Ace']
              : category === 'apex'
                ? ['Strafe', 'Slide', 'Beam', 'Zip', 'Pred', 'Apex', 'Ranked', 'Arena']
                : category === 'gta-rp'
                  ? ['District', 'Noir', 'Crown', 'Gold', 'Santos', 'Rossi', 'Navarro', 'Crew']
          : category === 'cod'
            ? ['Warzone', 'Squad', 'Drop', 'Loadout', 'Raven', 'Recoil']
            : ['Clip', 'Main', 'GG', 'Nova', 'Echo', 'Prime'];

  const symbols = keyword === 'cute' || keyword === 'aesthetic' ? ['✨', '♡', '•'] : ['★', '⚡', '◆'];
  /** Identity-governed pools: avoid cyclic X/99 spam; keep tokens readable for SEO samples */
  const suffixes =
    keyword === 'pro' || keyword === '3-letter'
      ? ['', '', '', 'X']
      : keyword === 'sweaty' || keyword === 'tryhard'
        ? ['', '', '', '']
        : ['', '', 'ii', ''];

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
          : `${w}${suf}${i % 6 === 0 ? sym : ''}`;
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
  const key = `${category}:${keyword}:title`;

  const intents = STYLE_INTENTS[keyword] || [];
  const primaryIntent = intents[0] || 'brandable';

  const styleTerm = pickVariant(key, STYLE_TERMS[keyword] || [style.label]) || style.label;
  const game = cat.label === 'Gaming' ? 'Gaming' : cat.label;
  const noun = style.titleNoun || 'Names';

  const templates = TITLE_TEMPLATES[primaryIntent] || TITLE_TEMPLATES.brandable;
  const tpl = pickVariant(key, templates) || templates[0];

  return tpl
    .replace('{style}', styleTerm)
    .replace('{game}', game)
    .replace('{noun}', noun);
}

function buildDescription({ category, keyword }) {
  const cat = CATEGORY_DEFS[category];
  const style = STYLE_DEFS[keyword];
  const key = `${category}:${keyword}:desc`;

  const gamePhrase = cat.label === 'Gaming' ? 'for any game' : `for ${cat.label}`;
  const surface = pickVariant(key, cat.context?.surfaces || ['profile', 'leaderboards']);
  const hook = pickVariant(key, style.hooks || ['unique']);
  const vibeRef = pickVariant(key, cat.context?.vibeRefs || []);

  const styleLower = style.label.toLowerCase();
  const nounLower = (style.titleNoun || 'names').toLowerCase();

  const openers = [
    `Sample ${styleLower} ${nounLower} ${gamePhrase} that read clean in the ${surface}.`,
    `Find ${styleLower} ${nounLower} ${gamePhrase} that feel right for your playstyle and stay readable at a glance.`,
    `Copy-ready ${styleLower} ${nounLower} ${gamePhrase}, built to be memorable, clean, and easy to reuse.`,
    `Browse ${styleLower} ${nounLower} ${gamePhrase} with recipes and examples that help you pick faster.`,
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

/**
 * Schema-only breadcrumb items for programmatic cluster URLs (Home is prepended by breadcrumbListSchema).
 * @param {string} normalizedSlug — e.g. `valorant/sweaty` (no leading slash)
 */
export function getProgrammaticBreadcrumbSchemaItems(normalizedSlug) {
  const normalized = normalizedSlug.startsWith('/') ? normalizedSlug.slice(1) : normalizedSlug;
  if (!isProgrammaticSlug(normalized)) return null;
  const [category, keyword] = normalized.split('/').filter(Boolean);
  const pageSlug = buildSlug(category, keyword);
  const breadcrumbName = `${CATEGORY_DEFS[category].label} ${STYLE_DEFS[keyword].label}`;
  return [{ name: breadcrumbName, path: `/${pageSlug}` }];
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
  const topicHub = buildTopicHubRecommendation({ category, keyword });

  const jsonLd = [faqPageSchema(faqs)];

  const basePage = {
    slug: pageSlug,
    title,
    description,
    h1,
    sections,
    names,
    related,
    linkBlocks,
    topicHub,
    faqs,
    jsonLd,
  };

  if (normalized === 'league-of-legends/korean') {
    return mergeLolKoreanLanePageData(basePage);
  }

  return basePage;
}

export function getProgrammaticPagesByCategory(category) {
  const styles = ALLOWED[category] || [];
  return styles
    .map((keyword) => getProgrammaticPageBySlug(buildSlug(category, keyword)))
    .filter(Boolean);
}

