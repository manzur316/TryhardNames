/**
 * Micro-editorial datasets per game/category.
 * Goal: increase information gain without giant copy blocks.
 *
 * Rules:
 * - Keep content gaming-native and specific.
 * - No filler / generic SEO paragraphs.
 * - Deterministic selection happens in editorialSections.js.
 */
export const GAME_EDITORIAL_DATA = {
  valorant: {
    gameLabel: 'Valorant',
    culture: {
      shortNameThesis: [
        'Scoreboard + killfeed are small UI surfaces; short tags read faster.',
        'Clean spelling matters because comms + clips reward pronounceable tags.',
        'Riot UI favors minimal noise: one signature word beats stacked modifiers.',
      ],
      roleCulture: [
        {
          title: 'Duelist vs Sentinel naming culture',
          bullets: [
            'Duelist-coded tags skew sharp + kinetic (Dash, Slice, Flick, Entry).',
            'Sentinel-coded tags skew calm + controlled (Anchor, Hold, Lock, Setup).',
            'IGL/tactical tags often read like verbs (Retake, Default, Rotate).',
          ],
        },
      ],
      vctPatterns: {
        cues: ['VCT', 'RR', 'IGL', 'ACE', 'Tap', 'Flick', 'Angle', 'Retake'],
        notes: [
          'VCT-coded names are “jersey-friendly”: short, consistent casing, low punctuation.',
          'Subtle cues work better than literal “RadiantImmortal” stacks.',
        ],
      },
      pitfalls: [
        'Avoid heavy Unicode stacks: many fonts render inconsistently in scoreboard.',
        'Avoid long suffix chains (…TTVYT99): feels spammy, lowers perceived skill.',
        'Avoid mixed random caps: it reads messy in killfeed.',
      ],
      quickChecks: [
        'Killfeed test: can you read it in <250ms?',
        'Comms test: can a teammate say it once and remember it?',
        'Overlay test: does it look clean at 24px height?',
      ],
    },
    internalLinks: [
      { label: 'Clean esports aliases', to: '/valorant/clean' },
      { label: 'VCT-style tags', to: '/valorant/vct' },
      { label: 'Tactical naming', to: '/valorant/tactical' },
    ],
  },

  roblox: {
    gameLabel: 'Roblox',
    culture: {
      creatorNaming: [
        'Creator handles optimize for mobile scanning and profile aesthetics.',
        '“Soft” patterns perform because they look consistent with avatar branding.',
        'Display name trends shift fast—keep your core word stable and swap one vibe cue.',
      ],
      tiktokAesthetic: {
        cues: ['core', 'era', 'aura', 'soft', 'doll', 'cloud', 'moon', 'pixel'],
        notes: [
          'TikTok-style handles win when they are easy to type and consistent in rhythm.',
          'One vibe cue + one clean noun beats emoji spam.',
        ],
      },
      avatarBranding: [
        'Username and avatar should tell the same story (same vibe words).',
        'Lower-noise styling improves recall: one separator max (dot or underscore).',
        'Mobile-first: avoid characters that look similar (l/I/1) if you want clarity.',
      ],
      pitfalls: [
        'Avoid over-styling with multiple separators (.__._): looks bot-like.',
        'Avoid unreadable Unicode fonts if your audience copies on mobile.',
        'Avoid mixing three aesthetics at once (soft + edgy + luxury).',
      ],
      quickChecks: [
        'Profile test: does it look “finished” next to your avatar?',
        'Mobile test: can you type it without switching keyboards?',
        'Copy test: does it survive Roblox filtering + spacing?',
      ],
    },
    internalLinks: [
      { label: 'Creator-style handles', to: '/roblox/avatar' },
      { label: 'TikTok aesthetic usernames', to: '/roblox/tiktok' },
      { label: 'Soft usernames', to: '/roblox/soft' },
    ],
  },

  'gta-rp': {
    gameLabel: 'GTA RP',
    culture: {
      realisticIdentity: [
        'Whitelist servers reward believable structure: name + surname reads immersive.',
        'Clean identities get remembered in rosters and voice RP.',
        'Subtle “district / luxury” cues feel premium; loud crime keywords feel tryhard.',
      ],
      mafiaCartel: [
        {
          title: 'Mafia vs Cartel vs Street',
          bullets: [
            'Mafia: surname-first feel, understated authority (Rossi, Marconi, DeLuca).',
            'Cartel: coded cues, but keep it non-threatening and readable (Sombra, Oro).',
            'Street: alias-forward, neighborhood-coded words (District, Side, Night).',
          ],
        },
      ],
      luxuryAesthetic: [
        'Luxury RP names read like brands: Gold, Crown, District—one cue max.',
        'Believability beats “edgy”: if it sounds like a username, it breaks immersion.',
      ],
      pitfalls: [
        'Avoid meme words if you play serious RP—people will not address you in-character.',
        'Avoid platform-coded suffixes (TTV/YT): it reads out-of-world.',
        'Avoid violent/explicit language (risk of server rules + moderation).',
      ],
      quickChecks: [
        'Roster test: does it look like a real person/alias in a whitelist list?',
        'Voice test: can someone say it naturally in RP dialogue?',
        'Immersion test: would this fit the server’s tone?',
      ],
    },
    internalLinks: [
      { label: 'Realistic RP identities', to: '/gta-rp/realistic' },
      { label: 'Luxury RP aesthetics', to: '/gta-rp/luxury' },
      { label: 'Mafia-style aliases', to: '/gta-rp/mafia' },
    ],
  },

  cs2: {
    gameLabel: 'CS2',
    culture: {
      oneWord: [
        'One-word aliases feel premium because they read clean in HUD and killfeed.',
        'OG tags favor short syllables and simple spelling—easy to say in comms.',
        'Minimal casing tends to look more “pro scene” than stylized punctuation.',
      ],
      proScene: [
        {
          title: 'Pro-scene naming signals',
          bullets: [
            'Short, pronounceable, and consistent (same handle across socials).',
            'No noise: avoid numbers unless they are part of your identity.',
            'Clean ASCII wins for compatibility across clients and overlays.',
          ],
        },
      ],
      pitfalls: [
        'Avoid over-tactical acronyms that feel game-specific if you want brandability.',
        'Avoid long words that wrap or truncate in UI.',
        'Avoid mixed separators; it stops feeling “OG”.',
      ],
      quickChecks: [
        'Killfeed test: does it fit without truncation?',
        'Steam test: does it look clean in a small font?',
        'Chant test: could a teammate call it fast?',
      ],
    },
    internalLinks: [
      { label: 'One-word aliases', to: '/cs2/one-word' },
      { label: 'OG tags', to: '/cs2/og' },
      { label: '3-letter minimal names', to: '/cs2/3-letter' },
    ],
  },

  minecraft: {
    gameLabel: 'Minecraft',
    culture: {
      smp: [
        'SMP names lean story-friendly: readable in chat and memorable over weeks.',
        'Guild vibes work because they imply role and identity (Ranger, Smith, Warden).',
        'Cozy nouns + roles beat generic “BlockGuy” clones.',
      ],
      fantasyMedieval: [
        {
          title: 'Fantasy / Medieval vibes',
          bullets: [
            'Titles + archetypes read immersive (Knight, Scribe, Warden, Monk).',
            'One realm cue max (Nether/Ember/Oak) keeps it from becoming generic.',
            'Keep it pronounceable—RP works better when names are sayable.',
          ],
        },
      ],
      pvpIdentity: [
        'PvP tags benefit from tab-list readability: short, sharp, low punctuation.',
        'Servers may strip symbols—an ASCII fallback keeps your identity stable.',
      ],
      pitfalls: [
        'Avoid symbol stacks—many servers/clients normalize or block them.',
        'Avoid ultra-long names that wrap in chat or overlays.',
        'Avoid mixing RP titles with sweat suffixes (breaks vibe consistency).',
      ],
      quickChecks: [
        'Tab-list test: can you spot it instantly?',
        'Chat test: does it look good in monospace fonts?',
        'Server test: does it survive restrictions (ASCII fallback)?',
      ],
    },
    internalLinks: [
      { label: 'SMP culture names', to: '/minecraft/smp' },
      { label: 'Medieval roleplay', to: '/minecraft/medieval' },
      { label: 'PvP identity tags', to: '/minecraft/pvp' },
    ],
  },

  'league-of-legends': {
    gameLabel: 'League of Legends',
    culture: {
      shortNameThesis: [
        'Summoner names live on every surface—loading screen, death recap, op.gg—so restraint compounds over time.',
        'Roman-letter handles stay portable across clubs, Discord, and vod without fighting fonts.',
        'One lane fantasy per reset: mixed moods read noisy faster than loud spelling.',
      ],
      oneWord: [
        'Short cores reward decisive spelling—every letter shows up in client chrome.',
        'One-word bias favors recall when teammates ping you by habit.',
        'Minimal casing survives roster exports and profile screenshots.',
      ],
      pitfalls: [
        'Avoid cosplaying real pros—respect boundaries; steal patterns, not identities.',
        'Avoid stream/platform suffix stacks unless that is truly your brand.',
        'Avoid ironic meme energy mixed with “minimal prestige”—pick one temperature.',
      ],
      quickChecks: [
        'Lobby test: does it read calm at a glance?',
        'op.gg test: does it look intentional next to match history?',
        'Voice test: can someone say it once in comms without rehearsal?',
      ],
    },
    internalLinks: [
      { label: 'LoL identity hub', to: '/league-of-legends' },
      { label: 'One-word lane', to: '/league-of-legends/one-word' },
      { label: 'Clean lane', to: '/league-of-legends/clean' },
    ],
  },
};

