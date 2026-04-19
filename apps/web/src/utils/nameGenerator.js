// Tryhard Name Generator Utility
// Generates competitive gaming names with optional numbers and symbols

const aggressiveWords = [
  'Apex', 'Lethal', 'Venom', 'Toxic', 'Savage', 'Brutal', 'Ruthless', 'Fierce',
  'Deadly', 'Fatal', 'Killer', 'Slayer', 'Destroyer', 'Annihilator', 'Predator',
  'Hunter', 'Reaper', 'Executioner', 'Terminator', 'Obliterator'
];

const competitiveAdjectives = [
  'Sweaty', 'Tryhard', 'Clutch', 'Cracked', 'Insane', 'Goated', 'Cringe',
  'Toxic', 'Sweating', 'Grinding', 'Fragging', 'Popping', 'Cranking', 'Beaming',
  'Lasering', 'Dominating', 'Owning', 'Wrecking', 'Stomping', 'Crushing'
];

const darkThemedWords = [
  'Shadow', 'Void', 'Phantom', 'Reaper', 'Ghost', 'Demon', 'Dark', 'Night',
  'Raven', 'Crow', 'Skull', 'Death', 'Doom', 'Chaos', 'Abyss', 'Eclipse',
  'Nightmare', 'Specter', 'Wraith', 'Shade', 'Dusk', 'Midnight', 'Obsidian'
];

const sweatyGamerWords = [
  'Grind', 'Sweat', 'Hustle', 'Dominate', 'Carry', 'Clutch', 'Frag', 'Ace',
  'Pro', 'Elite', 'Legend', 'Champion', 'Master', 'King', 'God', 'Beast',
  'Titan', 'Warrior', 'Soldier', 'Veteran', 'Sniper', 'Ninja'
];

const clanStyleFragments = [
  'Clan', 'Squad', 'Crew', 'Legion', 'Guild', 'Team', 'Gang', 'Mob',
  'Army', 'Force', 'Unit', 'Division', 'Faction', 'Alliance', 'Brotherhood',
  'Society', 'Order', 'Syndicate', 'Cartel', 'Empire'
];

const stylishPrefixes = [
  'xX', 'Xx', 'iT', 'iM', 'Lil', 'Big', 'The', 'Mr', 'Ms', 'Dr',
  'Sir', 'Lord', 'King', 'Queen', 'Pro', 'OG', 'Faze', 'TSM', 'TTV', 'YT'
];

const stylishSuffixes = [
  'Xx', 'xX', 'YT', 'TTV', 'TV', 'Live', 'Pro', 'God', 'King', 'Lord',
  'Master', 'Legend', 'Elite', 'Ace', 'Prime', 'Alpha', 'Omega', 'Zero', 'One'
];

const stylishSymbols = ['★', '✦', '◆', '⚡', '✨', '⚔️', '☠️', '♛', '♔', '◈', '◉', '◊'];

// Helper function to get random element from array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random number
const getRandomNumber = (max = 999) => {
  return Math.floor(Math.random() * (max + 1));
};

// Generate a single tryhard name
export const generateSingleName = (options = {}) => {
  const { addNumbers = false, addSymbols = false } = options;
  
  // Randomly choose name structure
  const structures = [
    // Structure 1: Aggressive + Sweaty
    () => `${getRandomElement(aggressiveWords)}${getRandomElement(sweatyGamerWords)}`,
    
    // Structure 2: Competitive + Dark
    () => `${getRandomElement(competitiveAdjectives)}${getRandomElement(darkThemedWords)}`,
    
    // Structure 3: Dark + Aggressive
    () => `${getRandomElement(darkThemedWords)}${getRandomElement(aggressiveWords)}`,
    
    // Structure 4: Prefix + Word + Suffix
    () => `${getRandomElement(stylishPrefixes)}${getRandomElement(sweatyGamerWords)}${getRandomElement(stylishSuffixes)}`,
    
    // Structure 5: Clan + Aggressive
    () => `${getRandomElement(clanStyleFragments)}${getRandomElement(aggressiveWords)}`,
    
    // Structure 6: Single powerful word
    () => getRandomElement([...aggressiveWords, ...darkThemedWords, ...sweatyGamerWords]),
    
    // Structure 7: Competitive + Sweaty + Dark
    () => `${getRandomElement(competitiveAdjectives)}${getRandomElement(darkThemedWords)}`,
    
    // Structure 8: Two aggressive words
    () => `${getRandomElement(aggressiveWords)}${getRandomElement(aggressiveWords)}`
  ];
  
  // Generate base name
  let name = getRandomElement(structures)();
  
  // Add numbers if enabled
  if (addNumbers && Math.random() > 0.3) {
    const numberPosition = Math.random();
    if (numberPosition < 0.33) {
      // Add at start
      name = `${getRandomNumber()}${name}`;
    } else if (numberPosition < 0.66) {
      // Add at end
      name = `${name}${getRandomNumber()}`;
    } else {
      // Add in middle with separator
      const midPoint = Math.floor(name.length / 2);
      name = `${name.slice(0, midPoint)}${getRandomNumber(99)}${name.slice(midPoint)}`;
    }
  }
  
  // Add symbols if enabled
  if (addSymbols && Math.random() > 0.4) {
    const symbol = getRandomElement(stylishSymbols);
    const symbolPosition = Math.random();
    if (symbolPosition < 0.33) {
      // Add at start
      name = `${symbol}${name}`;
    } else if (symbolPosition < 0.66) {
      // Add at end
      name = `${name}${symbol}`;
    } else {
      // Add both sides
      name = `${symbol}${name}${symbol}`;
    }
  }
  
  return name;
};

// Generate multiple tryhard names
export const generateMultipleNames = (count = 10, options = {}) => {
  const names = [];
  const uniqueNames = new Set();
  
  // Generate unique names
  while (uniqueNames.size < count) {
    const name = generateSingleName(options);
    uniqueNames.add(name);
  }
  
  return Array.from(uniqueNames);
};

// Get trending/example names (pre-generated popular styles)
export const getTrendingNames = () => {
  return [
    '★ToxicReaper★',
    'xXShadowSlayerXx',
    'Cracked⚡Phantom',
    'SweatyVenom999',
    'Lethal✨Demon',
    'ClutchGod⚔️',
    'DarkApex◆',
    'TryhardNinja☠️'
  ];
};

// Simulate recently generated names (for social proof)
export const getRecentlyGeneratedNames = () => {
  const recentCount = 8;
  return generateMultipleNames(recentCount, { 
    addNumbers: Math.random() > 0.5, 
    addSymbols: Math.random() > 0.5 
  });
};