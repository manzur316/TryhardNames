const prefixes = ['Team', 'Clan', 'FaZe', 'Optic', 'Dark', 'Void', 'Neon', 'Cyber', 'Ghost', 'Shadow', 'Apex', 'Elite', 'Rogue', 'Savage', 'Lethal', 'Toxic', 'Mystic', 'Quantum', 'Astral', 'Cosmic'];
const cores = ['Legion', 'Esports', 'Gaming', 'Force', 'Syndicate', 'Cartel', 'Empire', 'Vanguard', 'Knights', 'Assassins', 'Reapers', 'Titans', 'Gods', 'Demons', 'Dragons', 'Wolves', 'Phantoms', 'Wraiths', 'Ninjas', 'Samurai'];
const suffixes = ['HQ', 'GG', 'Win', 'Pro', 'X', 'Z', 'Prime', 'Zero', 'One', 'Core', 'Tech', 'Net', 'Hub', 'Lab', 'Forge', 'Nexus', 'Vertex', 'Zenith', 'Pinnacle', 'Apex'];
const symbols = ['★', '⚡', '✨', '◆', '☠️', '⚔️', '♛', '◈', '◉', '✧'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateSingleClanName = (options = {}) => {
  const { addNumbers = false, addSymbols = false, customPrefix = '' } = options;
  
  let name = '';
  const structure = Math.random();
  
  const prefix = customPrefix.trim() ? customPrefix.trim() : getRandomElement(prefixes);
  
  if (structure < 0.4) {
    name = `${prefix} ${getRandomElement(cores)}`;
  } else if (structure < 0.7) {
    name = `${getRandomElement(cores)} ${getRandomElement(suffixes)}`;
  } else {
    name = `${prefix}${getRandomElement(suffixes)}`;
  }

  if (addNumbers && Math.random() > 0.3) {
    const num = Math.floor(Math.random() * 9000) + 1000; // 4 digit number
    name = `${name}${num}`;
  }

  if (addSymbols && Math.random() > 0.3) {
    const sym = getRandomElement(symbols);
    name = Math.random() > 0.5 ? `${sym} ${name} ${sym}` : `${name} ${sym}`;
  }

  // 1 in 5 chance for a rare name
  const isRare = Math.random() < 0.2;

  return { name, isRare };
};

export const generateMultipleClanNames = (count = 10, options = {}) => {
  return Array.from({ length: count }, () => generateSingleClanName(options));
};

export const getTrendingClanNames = () => {
  return [
    'Dark★Legion',
    'Team Apex',
    'Ghost Syndicate',
    'Neon Esports',
    'Cyber Knights',
    'Void Vanguard',
    'Rogue Empire',
    'Lethal Force'
  ];
};

export const generateClanTag = (length = 3) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let tag = '';
  for (let i = 0; i < length; i++) {
    tag += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tag;
};