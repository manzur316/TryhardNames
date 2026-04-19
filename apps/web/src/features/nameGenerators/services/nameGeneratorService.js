const nameDatabase = {
  roblox: {
    cool: [
      'ShadowNinja', 'FrostBite', 'NeonStrike', 'CyberPunk', 'VoidWalker', 'StormChaser', 'NightHawk', 'CrimsonBlade',
      'SilverStorm', 'EchoVoid', 'VortexKing', 'IcePhoenix', 'ThunderStrike', 'NeonGhost', 'DarkMatter', 'SolarFlare',
      'QuantumLeap', 'AbyssWalker', 'PhantomStrike', 'Venomous'
    ],
    funny: [
      'SirFartsALot', 'NoobSlayer9000', 'CouchPotato', 'ToastCruncher', 'WaffleNinja', 'BaconBandit', 'CerealKiller', 'DerpMaster',
      'PizzaLover99', 'CatWalksOnKeyboard', 'BananaSlippers', 'LaggingLlama', 'ControllerThrower', 'CasualNoob', 'AFK_Forever',
      'BreadPitt', 'JuliusCheeser', 'MorganFreeFarming', 'DarthVaderTots', 'ObiWanCannoli'
    ],
    aesthetic: [
      'lxzyclouds', 'moonlightbae', 'stxrrynight', 'peachyvibes', 'softpetals', 'oceanbreeze', 'velvetdreams', 'cherryblossom',
      'MoonlightDreams', 'SilverMist', 'VioletSky', 'PearlWhisper', 'autumnleaves', 'goldenhour', 'crystaltears', 'pastelgoth',
      'etherealbeauty', 'serendipity', 'auroraborealis', 'lunaeclipse'
    ],
    tryhard: [
      '1v4Clutch', 'SweatyPalms', 'AimBotZ', 'ToxicSlayer', 'NoScopeKing', 'TryHardPro', 'SweatBand', 'RageQuit',
      'ProGamer2024', 'CompetitiveKing', 'RankGrinder', 'SkillMaster', 'Faker', 'Simple', 'TenZ', 'Scump',
      'HeadshotMachine', 'FlickShot', 'WallBang', 'ClutchGod'
    ]
  },
  gamer: {
    cool: [
      'PhantomStrike', 'NeonPulse', 'CyberGhost', 'QuantumLeap', 'SilverBullet', 'EchoBlade', 'NovaStorm', 'ApexPredator',
      'ShadowAssassin', 'NeonBlade', 'VortexMaster', 'IceWolf', 'ThunderFury', 'SilentHunter', 'VoidKnight', 'CrimsonKnight',
      'DarkReaper', 'ShadowDemon', 'VoidWalker', 'StormBringer'
    ],
    funny: [
      'CerealKillah', 'BreadPitt', 'JuliusCheeser', 'MorganFreeFarming', 'DarthVaderTots', 'ObiWanCannoli', 'BilboBaggins', 'FrodoTebaggins',
      'LaggingLlama', 'ControllerThrower', 'CasualNoob', 'AFK_Forever', 'SirFartsALot', 'NoobSlayer9000', 'CouchPotato', 'ToastCruncher',
      'WaffleNinja', 'BaconBandit', 'CerealKiller', 'DerpMaster'
    ],
    pro: [
      'Faker', 'Simple', 'TenZ', 'Scump', 'Caps', 'ShowMaker', 'Rookie', 'Chovy',
      'ProPlayer2024', 'EsportsChampion', 'CompetitiveEdge', 'RankGrinder', 'AimBotZ', 'ToxicSlayer', 'NoScopeKing', 'TryHardPro',
      'Lethal', 'Precision', 'Apex', 'Zenith'
    ],
    edgy: [
      'GrimReaper', 'SoulTaker', 'BloodLust', 'DarkMatter', 'Venomous', 'DeathWish', 'ShadowFiend', 'AbyssWalker',
      'DarkReaper', 'ShadowDemon', 'VoidWalker', 'CrimsonKnight', 'NightHawk', 'CrimsonBlade', 'SilverStorm', 'EchoVoid',
      'VortexKing', 'IcePhoenix', 'ThunderStrike', 'NeonGhost'
    ]
  }
};

const categoryMetadata = {
  roblox: {
    cool: { title: 'Cool', desc: 'Edgy and awesome names that stand out.', emoji: '⚡' },
    funny: { title: 'Funny', desc: 'Hilarious names to make players laugh.', emoji: '😂' },
    aesthetic: { title: 'Aesthetic', desc: 'Pleasing, soft, and stylish names.', emoji: '✨' },
    tryhard: { title: 'Tryhard', desc: 'Sweaty and competitive names.', emoji: '🎯' }
  },
  gamer: {
    cool: { title: 'Cool', desc: 'Sleek and memorable gamertags.', emoji: '⚡' },
    funny: { title: 'Funny', desc: 'Gamertags that will get a laugh in the lobby.', emoji: '😂' },
    pro: { title: 'Pro', desc: 'Clean, professional names for competitive play.', emoji: '🏆' },
    edgy: { title: 'Edgy', desc: 'Dark and intimidating names.', emoji: '💀' }
  }
};

export const getNamesByCategory = (type, category) => {
  if (!nameDatabase[type] || !nameDatabase[type][category]) return [];
  return [...nameDatabase[type][category]];
};

export const getCategoriesForType = (type) => {
  if (!categoryMetadata[type]) return [];
  return Object.keys(categoryMetadata[type]).map(key => ({
    id: key,
    ...categoryMetadata[type][key]
  }));
};

export const getCategoryInfo = (type, category) => {
  if (!categoryMetadata[type] || !categoryMetadata[type][category]) return null;
  return categoryMetadata[type][category];
};

export const generateRandomName = (type, category) => {
  const names = getNamesByCategory(type, category);
  if (names.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

export const generateRandomNames = (type, category, count = 10) => {
  const names = getNamesByCategory(type, category);
  if (names.length === 0) return [];
  
  // Shuffle array
  const shuffled = [...names].sort(() => 0.5 - Math.random());
  
  // If requested count is more than available, we might need to duplicate or just return max available
  // For a generator, returning max available unique is usually better, or we can allow duplicates if needed.
  // Here we'll just return up to the max available unique names to keep it simple and high quality.
  return shuffled.slice(0, Math.min(count, names.length));
};