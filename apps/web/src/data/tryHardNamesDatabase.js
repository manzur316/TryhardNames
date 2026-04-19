const generateNames = () => {
  const categories = {
    "Aggressive Names": {
      prefixes: ["Blood", "Axe", "Noxian", "War", "Battle", "Crimson", "Iron", "Steel", "Thunder", "Venom", "Savage", "Fierce", "Brutal", "Lethal", "Doom"],
      suffixes: ["King", "Lord", "Force", "Master", "Fist", "Hammer", "Strike", "Fang", "Breaker", "Crusher", "Slayer", "Bringer", "Reaper", "Hunter"]
    },
    "Mystical Names": {
      prefixes: ["Mystic", "Spirit", "Arcane", "Spell", "Enchanted", "Soul", "Echo", "Void", "Shadow", "Astral", "Lunar", "Solar", "Celestial", "Ethereal"],
      suffixes: ["Fox", "Weaver", "Force", "Sage", "Mind", "Seeker", "Walker", "Mage", "Caster", "Sorcerer", "Prophet", "Oracle", "Whisperer"]
    },
    "Stylish Names": {
      prefixes: ["Neon", "Cyber", "Pixel", "Synth", "Digital", "Virtual", "Holo", "Retro", "Aero", "Quantum", "Mecha", "Techno", "Glitch"],
      suffixes: ["Ghost", "Ninja", "King", "Wave", "Force", "Blade", "Punk", "Strike", "Dash", "Flash", "Pulse", "Spark", "Drifter"]
    },
    "Competitive Names": {
      prefixes: ["Pro", "Ranked", "Elite", "Competitive", "Victory", "Champion", "Master", "Grand", "Challenger", "Apex", "Prime", "Supreme"],
      suffixes: ["Player", "King", "Force", "Edge", "Seeker", "Mind", "Gamer", "Master", "Grinder", "Climber", "Smurf", "Carry", "Legend"]
    },
    "Rare Names": {
      prefixes: ["Phoenix", "Dragon", "Venom", "Thunder", "Silent", "Blaze", "Frost", "Iron", "Steel", "Dark", "Light", "Storm", "Abyssal"],
      suffixes: ["Rising", "Slayer", "Strike", "Lord", "Hunter", "Fury", "Byte", "Will", "Heart", "Sorcerer", "Bringer", "Chaser", "Walker"]
    },
    "Short Tags": {
      exact: ["DRG", "VNM", "TRX", "SHD", "PHX", "ICE", "THR", "INF", "VTX", "ELT", "PRO", "RNK", "CMP", "DOM", "VCT", "BLD", "AXE", "NOX", "WAR", "BAT", "TSM", "FNC", "C9", "G2", "T1", "SKT", "DWG", "IG", "RNG", "EDG", "FPX", "JDG", "GEN", "KT", "DRX", "HLE", "BRO", "KDF", "NS", "LSB", "MAD", "WE", "LNG", "BLG", "TES", "OMG", "AL", "LGD", "RA", "UP", "TT", "NIP", "TL", "100", "FLY", "EG", "NRG", "GG", "IMT", "DIG", "MAD", "G2", "FNC", "BDS", "KOI", "SK", "AST", "XL", "TH", "VIT"]
    },
    "Gaming Slang": {
      exact: ["Noob", "Pwned", "Gamer", "Streamer", "Clutch", "Carry", "Support", "Jungle", "Mid", "ADC", "Top", "Ranked", "Casual", "Tryhard", "Sweaty", "Toxic", "Salty", "Tilt", "Feed", "Int", "Gank", "Camp", "Peel", "Kite", "Dive", "Bait", "Throw", "Diff", "Gap", "FF", "15", "Surrender", "Open", "Mid", "AFK", "BRB", "OMW", "OOM", "CD", "Ult", "Flash", "Heal", "Ignite", "Smite", "TP", "Teleport", "Cleanse", "Exhaust", "Barrier", "Ghost"]
    },
    "Anime-Inspired": {
      prefixes: ["Shadow", "Crimson", "Ice", "Phoenix", "Venom", "Thunder", "Silent", "Blaze", "Frost", "Iron", "Kitsune", "Shinigami", "Ronin", "Samurai", "Ninja"],
      suffixes: ["Assassin", "Mage", "Warden", "Rising", "Strike", "Lord", "Hunter", "Fury", "Byte", "Will", "Blade", "Soul", "Spirit", "Demon", "God"]
    }
  };

  const names = [];
  let idCounter = 1;

  for (const [category, data] of Object.entries(categories)) {
    if (data.exact) {
      data.exact.forEach(name => {
        names.push({
          id: `name_${idCounter++}`,
          name: name,
          category: category,
          difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
          popularity: Math.floor(Math.random() * 10) + 1,
          tags: [category.split(' ')[0], "LoL", "Tryhard"],
          createdDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          usageCount: Math.floor(Math.random() * 5000),
          copyCount: Math.floor(Math.random() * 10000),
          rating: (Math.random() * 2 + 3).toFixed(1)
        });
      });
    } else {
      for (let i = 0; i < data.prefixes.length; i++) {
        for (let j = 0; j < data.suffixes.length; j++) {
          names.push({
            id: `name_${idCounter++}`,
            name: `${data.prefixes[i]}${data.suffixes[j]}`,
            category: category,
            difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
            popularity: Math.floor(Math.random() * 10) + 1,
            tags: [category.split(' ')[0], "LoL", "Tryhard"],
            createdDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            usageCount: Math.floor(Math.random() * 5000),
            copyCount: Math.floor(Math.random() * 10000),
            rating: (Math.random() * 2 + 3).toFixed(1)
          });
        }
      }
    }
  }

  return names;
};

const tryHardNamesDatabase = generateNames();
export default tryHardNamesDatabase;