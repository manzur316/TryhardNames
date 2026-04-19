const baseGames = [
  { name: 'Adopt Me!', type: 'Roleplay', desc: 'Raise and dress cute pets, decorate your house, and play with friends in the magical, family-friendly world of Adopt Me!' },
  { name: 'Bloxburg', type: 'Roleplay', desc: 'Build and design your own amazing house, own awesome vehicles, hang out with friends, work, roleplay or explore the city of Bloxburg.' },
  { name: 'Brookhaven RP', type: 'Roleplay', desc: 'A place to hang out with like-minded people and roleplay. Own and live in amazing houses, drive cool vehicles and explore the city.' },
  { name: 'Jailbreak', type: 'Adventure', desc: 'Orchestrate a robbery or stop the criminals before they get away! Team up with friends for even more fun and plan the ultimate raid or heist.' },
  { name: 'Royale High', type: 'Roleplay', desc: 'Welcome to Royale High, your ever-growing dream world! Dress up, play games, and chat with friends.' },
  { name: 'MeepCity', type: 'Roleplay', desc: 'The city that is all about YOU! Play games, earn coins, and customize your very own estate.' },
  { name: 'Murder Mystery 2', type: 'Horror', desc: 'Can you solve the Mystery and survive each round? Innocents, Sheriff, and Murderer battle it out.' },
  { name: 'Phantom Forces', type: 'PvP', desc: 'A competitive first-person shooter with deep weapon customization and fast-paced tactical gameplay.' },
  { name: 'Arsenal', type: 'PvP', desc: 'Race to the top through a massive arsenal of weapons! Conquer the day in fast paced arcade gameplay.' },
  { name: 'Flee the Facility', type: 'Horror', desc: 'Run, hide, and escape! Team up with others to unlock the exits and flee the facility before the beast catches you.' },
  { name: 'Piggy', type: 'Horror', desc: 'Do you have what it takes to escape Piggy and uncover the mysteries surrounding the beast?' },
  { name: 'Lumber Tycoon 2', type: 'Tycoon', desc: 'Chop trees, build your dream base, and explore the vast world to find rare woods and items.' }
];

const gameTypes = ['Simulator', 'Roleplay', 'Survival', 'Tycoon', 'Obby', 'Parkour', 'Horror', 'PvP', 'Casual', 'Building', 'Racing', 'Sports', 'Adventure'];

const generateGames = () => {
  const games = [];
  let idCounter = 1;

  // Add base games
  baseGames.forEach(game => {
    games.push({
      id: `game_${idCounter++}`,
      name: game.name,
      gameType: game.type,
      description: game.desc,
      activePlayers: Math.floor(Math.random() * 500000) + 50000,
      popularNames: [`${game.name.split(' ')[0]}Pro`, `xX${game.name.split(' ')[0]}Xx`, `Best${game.name.split(' ')[0]}`],
      image: `https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop&q=80`
    });
  });

  // Generate remaining to reach 50
  for (let i = baseGames.length; i < 50; i++) {
    const type = gameTypes[Math.floor(Math.random() * gameTypes.length)];
    const name = `Epic ${type} ${Math.floor(Math.random() * 100)}`;
    games.push({
      id: `game_${idCounter++}`,
      name: name,
      gameType: type,
      description: `Welcome to ${name}! The best ${type} game on Roblox. Join thousands of players today!`,
      activePlayers: Math.floor(Math.random() * 100000) + 1000,
      popularNames: [`${type}Master`, `Pro${type}`, `The${type}King`],
      image: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&q=80`
    });
  }

  return games.sort((a, b) => b.activePlayers - a.activePlayers);
};

const robloxGamesDatabase = generateGames();
export default robloxGamesDatabase;