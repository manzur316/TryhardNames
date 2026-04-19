const generateRobloxNames = () => {
  const categories = {
    Masculine: { prefixes: ['Boy', 'Mr', 'King', 'Bro', 'Dude', 'Guy', 'Man', 'Lord', 'Sir', 'Alpha'], suffixes: ['Slayer', 'Hunter', 'Gamer', 'Pro', 'Master', 'Beast', 'Titan', 'Strike', 'Force', 'Warrior'] },
    Feminine: { prefixes: ['Girl', 'Ms', 'Queen', 'Sis', 'Lady', 'Miss', 'Princess', 'Bella', 'Luna', 'Star'], suffixes: ['Heart', 'Rose', 'Angel', 'Fairy', 'Pixie', 'Gamer', 'Pro', 'Sparkle', 'Shine', 'Bloom'] },
    Neutral: { prefixes: ['The', 'Pro', 'Noob', 'Epic', 'Super', 'Mega', 'Ultra', 'Hyper', 'Giga', 'Tera'], suffixes: ['Player', 'Gamer', 'User', 'Person', 'Human', 'Avatar', 'Robloxian', 'Guest', 'Citizen', 'Entity'] },
    Epic: { prefixes: ['Shadow', 'Dark', 'Light', 'Fire', 'Ice', 'Storm', 'Thunder', 'Lightning', 'Wind', 'Earth'], suffixes: ['Dragon', 'Phoenix', 'Demon', 'Angel', 'God', 'King', 'Lord', 'Master', 'Legend', 'Myth'] },
    Gaming: { prefixes: ['Tryhard', 'Sweaty', 'Toxic', 'Clutch', 'Cracked', 'Insane', 'Goated', 'Godly', 'Elite', 'Pro'], suffixes: ['Gamer', 'Player', 'Sniper', 'Rusher', 'Camper', 'Builder', 'Fighter', 'Warrior', 'Champion', 'Winner'] },
    Anime: { prefixes: ['Otaku', 'Weeb', 'Ninja', 'Samurai', 'Shinobi', 'Ronin', 'Kitsune', 'Yokai', 'Oni', 'Kami'], suffixes: ['Slayer', 'Hunter', 'Fighter', 'Warrior', 'Master', 'Lord', 'King', 'God', 'Demon', 'Angel'] },
    Stylish: { prefixes: ['xX', 'Xx', 'iT', 'iM', 'Lil', 'Big', 'The', 'Mr', 'Ms', 'Dr'], suffixes: ['Xx', 'xX', 'YT', 'TTV', 'TV', 'Live', 'Pro', 'God', 'King', 'Lord'] },
    Rare: { prefixes: ['Void', 'Abyss', 'Cosmic', 'Astral', 'Lunar', 'Solar', 'Celestial', 'Galactic', 'Universal', 'Infinite'], suffixes: ['Entity', 'Being', 'Presence', 'Force', 'Power', 'Energy', 'Matter', 'Spirit', 'Soul', 'Mind'] },
    Trending: { prefixes: ['Blox', 'Roblox', 'Rbx', 'Rblx', 'Bloxy', 'Bloxian', 'Robloxian', 'Guest', 'Noob', 'Pro'], suffixes: ['Gamer', 'Player', 'User', 'Person', 'Human', 'Avatar', 'Citizen', 'Entity', 'Being', 'Presence'] }
  };

  const gameTypes = ['Simulator', 'Roleplay', 'Survival', 'Tycoon', 'Obby', 'Parkour', 'Horror', 'PvP', 'Casual', 'Building', 'Racing', 'Sports', 'Adventure'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const trends = ['Rising', 'Stable', 'Declining'];

  const names = [];
  let idCounter = 1;

  for (const [category, data] of Object.entries(categories)) {
    for (let i = 0; i < 120; i++) { // ~1080 names total
      const prefix = data.prefixes[Math.floor(Math.random() * data.prefixes.length)];
      const suffix = data.suffixes[Math.floor(Math.random() * data.suffixes.length)];
      const hasNumber = Math.random() > 0.5;
      const number = hasNumber ? Math.floor(Math.random() * 9999) : '';
      const nameStr = `${prefix}${suffix}${number}`;

      names.push({
        id: `rbx_${idCounter++}`,
        name: nameStr,
        category: category,
        gameType: gameTypes[Math.floor(Math.random() * gameTypes.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        popularity: Math.floor(Math.random() * 10) + 1,
        trend: trends[Math.floor(Math.random() * trends.length)],
        tags: [category.toLowerCase(), 'roblox', hasNumber ? 'numbered' : 'clean'],
        usageCount: Math.floor(Math.random() * 10000),
        copyCount: Math.floor(Math.random() * 50000),
        rating: (Math.random() * 2 + 3).toFixed(1),
        year: 2020 + Math.floor(Math.random() * 7),
        source: 'Community'
      });
    }
  }

  return names;
};

const robloxNamesDatabase = generateRobloxNames();
export default robloxNamesDatabase;