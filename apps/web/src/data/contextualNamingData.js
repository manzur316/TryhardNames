export const CONTEXTUAL_NAMING_DATA = {
  valorant: {
    label: 'Tactical aliases',
    why: ['Looks clean in Riot UI', 'Readable in killfeed', 'VCT-ready', 'Short enough for scoreboard', 'Aim-culture vibe'],
    // clean tactical vocabulary (avoid generic dark/kill words)
    verbs: ['Tap', 'Peek', 'Hold', 'Retake', 'Clutch', 'Trade', 'Swing', 'Plant', 'Defuse', 'Anchor', 'Entry'],
    nouns: ['Prime', 'Burst', 'Ghost', 'Vandal', 'Phantom', 'Crosshair', 'Sight', 'Angle', 'Strat', 'Exec', 'Pulse'],
    tags: ['VCT', 'RR', 'IGL', 'ACE', '1Tap', 'Prime'],
    patterns: [
      '{verb}{noun}', // TapGhost
      '{noun}{tag}', // DashVCT / PrimeRR
      '{verb}{tag}', // RetakeVCT
      '{noun}', // Prime
    ],
    evolve: {
      prefixes: ['Tap', 'Prime', 'Retake', 'Clutch', 'Hold', 'Peek'],
      suffixes: ['VCT', 'RR', 'IGL', 'ACE'],
    },
  },

  roblox: {
    label: 'Creator-style handles',
    why: ['Popular creator-style format', 'Soft + aesthetic vibe', 'Looks good in bio', 'Readable on overlays'],
    prefixes: ['Aura', 'Moon', 'Cherry', 'Soft', 'Plush', 'Pixel', 'Bunni', 'Cloud', 'Honey', 'Nova'],
    cores: ['Bunni', 'Pixel', 'Bloom', 'Vibe', 'Luna', 'Mochi', 'Daisy', 'Kitsu', 'Sprout', 'Star'],
    suffixes: ['ii', 'ie', 'xo', 'luv', 'vibe', 'core', 'kit', 'milk', 'pix'],
    patterns: [
      '{prefix}{core}', // AuraBunni
      '{prefix}{suffix}', // Moonii
      '{core}{suffix}', // Pixelii
      '{prefix}{core}{suffix}', // CherryNovie
    ],
    evolve: {
      softenSuffixes: ['ii', 'ie', 'xo', 'luv'],
      softPrefixes: ['Soft', 'Aura', 'Plush', 'Moon', 'Cherry'],
    },
  },

  'gta-rp': {
    label: 'Luxury RP identities',
    why: ['Fits luxury RP servers', 'Realistic identity vibe', 'Mafia-coded', 'Cartel naming energy'],
    firstNames: ['Luca', 'Marco', 'Enzo', 'Vito', 'Gianni', 'Nico', 'Santino', 'Rafael', 'Diego', 'Mateo'],
    lastNames: ['Moretti', 'Salieri', 'Bianchi', 'Romano', 'DeLuca', 'Vercetti', 'Santos', 'Mendoza', 'Cabrera', 'Navarro'],
    titles: ['Don', 'Capo', 'Boss', 'El', 'La'],
    luxBits: ['Lux', 'Gold', 'Vice', 'Noir', 'Diamond', 'Velvet'],
    patterns: [
      '{title}{last}', // DonSalieri
      '{first}{last}', // LucaMoretti
      '{last}{lux}', // VercettiLux
      '{title}{last}{lux}', // DonSantosLux
    ],
    evolve: {
      titlePrefixes: ['Don', 'Capo', 'El'],
      luxSuffixes: ['Lux', 'Vice', 'Gold'],
    },
  },

  cs2: {
    label: 'OG clean tags',
    why: ['Readable in killfeed', 'One-word esports tag', 'Minimal, premium vibe'],
    oneWords: ['Nyx', 'Prime', 'Volt', 'Vex', 'Clutch', 'Zero', 'Iris', 'Rune', 'Kite', 'Echo'],
    fragments: ['Prime', 'Volt', 'Vex', 'Zero', 'Nyx', 'Echo'],
    patterns: [
      '{one}', // Nyx
      '{one}{dot}', // Nyx.
      '{frag}', // Volt
    ],
    evolve: {
      suffixes: ['.', 'OG', 'PRO'],
    },
  },

  minecraft: {
    label: 'SMP-ready names',
    why: ['Fits SMP culture', 'Medieval naming vibe', 'Fantasy readable tag', 'Good for whitelist servers'],
    nouns: ['Nether', 'Oak', 'Ember', 'Block', 'Rune', 'Ash', 'Moss', 'Stone', 'Frost', 'Glow'],
    suffixes: ['Wisp', 'fang', 'Keep', 'Knight', 'Smith', 'Mage', 'Rune', 'Craft', 'Hollow', 'Vale'],
    patterns: [
      '{noun}{suffix}', // NetherWisp
      '{noun}{noun}', // BlockRune
      '{suffix}{noun}', // KnightOak
    ],
    evolve: {
      medievalSuffixes: ['Knight', 'Keep', 'Rune', 'Smith'],
      realmPrefixes: ['Nether', 'Ember', 'Frost', 'Oak'],
    },
  },
};

