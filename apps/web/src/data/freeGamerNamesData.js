const generateNames = (prefixes, suffixes, count) => {
  const names = new Set();
  while (names.size < count) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    const hasNum = Math.random() > 0.7;
    const num = hasNum ? Math.floor(Math.random() * 99) : '';
    const hasSymbol = Math.random() > 0.8;
    const symbol = hasSymbol ? (Math.random() > 0.5 ? 'xX' : 'zZ') : '';
    
    let name = `${p}${s}${num}`;
    if (hasSymbol) {
      name = `${symbol}_${name}_${symbol}`;
    }
    names.add(name);
  }
  return Array.from(names);
};

const aggressivePrefixes = ['Lethal', 'Savage', 'Toxic', 'Blood', 'Venom', 'Doom', 'Grim', 'Fatal', 'Rage', 'Fury', 'Viper', 'Skull', 'Demon', 'Ghost', 'Dark'];
const aggressiveSuffixes = ['Strike', 'Shot', 'Killer', 'Slayer', 'Hunter', 'Reaper', 'Fiend', 'Beast', 'Titan', 'Wolf', 'Fang', 'Claw', 'Bane', 'Wrath'];

const mysticalPrefixes = ['Astral', 'Cosmic', 'Lunar', 'Solar', 'Void', 'Abyss', 'Crystal', 'Aura', 'Mystic', 'Rune', 'Spell', 'Mana', 'Spirit', 'Soul', 'Ethereal'];
const mysticalSuffixes = ['Walker', 'Weaver', 'Mage', 'Caster', 'Born', 'Light', 'Shadow', 'Dust', 'Spark', 'Glow', 'Whisper', 'Song', 'Echo', 'Dream'];

const stylishPrefixes = ['Aero', 'Neo', 'Nova', 'Zephyr', 'Krypt', 'Cypher', 'Onyx', 'Flux', 'Pulse', 'Vibe', 'Aura', 'Zen', 'Echo', 'Rift', 'Apex'];
const stylishSuffixes = ['X', 'Z', 'V', 'Q', 'Dash', 'Flow', 'Wave', 'Drift', 'Shift', 'Sync', 'Core', 'Link', 'Byte', 'Grid'];

const competitivePrefixes = ['Pro', 'Elite', 'God', 'King', 'Alpha', 'Prime', 'Omega', 'Master', 'Clutch', 'Sweat', 'Tryhard', 'Goat', 'Peak', 'Optic', 'Faze'];
const competitiveSuffixes = ['Aim', 'Flick', 'Tap', 'Peek', 'Rush', 'Push', 'Frag', 'Drop', 'Win', 'Carry', 'Play', 'Move', 'Shot', 'God'];

const rarePrefixes = ['Xenon', 'Quark', 'Aegis', 'Vortex', 'Nebula', 'Pulsar', 'Quasar', 'Zenith', 'Nadir', 'Vertex', 'Cipher', 'Enigma', 'Paradox', 'Mirage', 'Phantom'];
const rareSuffixes = ['Prime', 'Zero', 'One', 'Infinity', 'Null', 'Void', 'Abyss', 'Core', 'Nexus', 'Matrix', 'Grid', 'Web', 'Net', 'Link'];

const trendingPrefixes = ['Aesthetic', 'Soft', 'Cute', 'Chill', 'Vibe', 'Cloud', 'Star', 'Moon', 'Sky', 'Rain', 'Snow', 'Ice', 'Frost', 'Winter', 'Autumn'];
const trendingSuffixes = ['Boy', 'Girl', 'Kid', 'Child', 'Baby', 'Angel', 'Fairy', 'Pixie', 'Sprite', 'Elf', 'Demon', 'Devil', 'Imp', 'Ghost'];

const freeGamerNamesData = [
  {
    id: 'aggressive',
    title: 'Aggressive Names',
    description: 'Intimidate your opponents before the match even starts.',
    color: '#ef4444', // red-500
    icon: 'Swords',
    names: generateNames(aggressivePrefixes, aggressiveSuffixes, 120)
  },
  {
    id: 'mystical',
    title: 'Mystical Names',
    description: 'Ethereal and magical names for RPGs and fantasy games.',
    color: '#a855f7', // purple-500
    icon: 'Sparkles',
    names: generateNames(mysticalPrefixes, mysticalSuffixes, 120)
  },
  {
    id: 'stylish',
    title: 'Stylish Names',
    description: 'Clean, aesthetic, and modern usernames.',
    color: '#06b6d4', // cyan-500
    icon: 'Zap',
    names: generateNames(stylishPrefixes, stylishSuffixes, 120)
  },
  {
    id: 'competitive',
    title: 'Competitive Names',
    description: 'Sweaty and tryhard names for FPS and Battle Royale games.',
    color: '#f59e0b', // yellow-500
    icon: 'Trophy',
    names: generateNames(competitivePrefixes, competitiveSuffixes, 120)
  },
  {
    id: 'rare',
    title: 'Rare Names',
    description: 'Unique and uncommon names that stand out.',
    color: '#ec4899', // pink-500
    icon: 'Gem',
    names: generateNames(rarePrefixes, rareSuffixes, 120)
  },
  {
    id: 'trending',
    title: 'Trending Names',
    description: 'The most popular naming styles right now.',
    color: '#10b981', // emerald-500
    icon: 'TrendingUp',
    names: generateNames(trendingPrefixes, trendingSuffixes, 120)
  }
];

export default freeGamerNamesData;