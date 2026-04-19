const championNames = [
  "Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Amumu", "Anivia", "Annie", "Aphelios", "Ashe", 
  "Aurelion Sol", "Aurora", "Azir", "Bard", "Bel'Veth", "Blitzcrank", "Brand", "Braum", "Briar", 
  "Caitlyn", "Camille", "Cassiopeia", "Cho'Gath", "Corki", "Darius", "Diana", "Draven", "Dr. Mundo", 
  "Ekko", "Elise", "Evelynn", "Ezreal", "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "Garen", 
  "Gnar", "Gragas", "Graves", "Gwen", "Hecarim", "Heimerdinger", "Hwei", "Illaoi", "Irelia", "Ivern", 
  "Janna", "Jarvan IV", "Jax", "Jayce", "Jhin", "Jinx", "K'Sante", "Kai'Sa", "Kalista", "Karma", 
  "Karthus", "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen", "Kha'Zix", "Kindred", "Kled", "Kog'Maw", 
  "LeBlanc", "Lee Sin", "Leona", "Lillia", "Lissandra", "Lulu", "Lux", "Malphite", "Malzahar", "Maokai", 
  "Master Yi", "Milio", "Miss Fortune", "Mordekaiser", "Morgana", "Nami", "Nasus", "Nautilus", "Neeko", 
  "Nidalee", "Nilah", "Nocturne", "Nunu & Willump", "Olaf", "Orianna", "Ornn", "Pantheon", "Poppy", 
  "Pyke", "Qiyana", "Quinn", "Rakan", "Rammus", "Rek'Sai", "Renata Glasc", "Renekton", "Rengar", "Riven", 
  "Rumble", "Ryze", "Samira", "Sejuani", "Senna", "Seraphine", "Sett", "Shaco", "Shen", "Shyvana", 
  "Singed", "Sion", "Sivir", "Skarner", "Sona", "Soraka", "Swain", "Sylas", "Syndra", "Tahm Kench", 
  "Taliyah", "Talon", "Taric", "Teemo", "Thresh", "Tristana", "Trundle", "Tryndamere", "Twisted Fate", 
  "Twitch", "Udyr", "Urgot", "Varus", "Vayne", "Veigar", "Vel'Koz", "Vex", "Vi", "Viego", "Viktor", 
  "Vladimir", "Volibear", "Warwick", "Wukong", "Xayah", "Xerath", "Yasuo", "Yone", "Yorick", "Yuumi", 
  "Zac", "Zed", "Zeri", "Ziggs", "Zilean", "Zoe", "Zyra"
];

const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];
const regions = ["Noxus", "Demacia", "Ionia", "Piltover", "Zaun", "Bilgewater", "Freljord", "Shurima", "Targon", "Ixtal", "Vastaya", "Shadow Isles", "Void"];
const difficulties = ["Easy", "Medium", "Hard"];
const types = ["Assassin", "Mage", "Marksman", "Support", "Tank", "Fighter"];

const leagueOfLegendsChampions = championNames.map((name, index) => {
  const role = roles[index % roles.length];
  const secondaryRole = roles[(index + 2) % roles.length];
  const region = regions[index % regions.length];
  const difficulty = difficulties[index % difficulties.length];
  const type1 = types[index % types.length];
  const type2 = types[(index + 1) % types.length];
  
  let customLore = `Hailing from ${region}, ${name} is a formidable force on the battlefield. Known for their prowess in the ${role} role, they have carved a legend that echoes across Runeterra. Their journey is one of conflict, power, and an unyielding desire to achieve their ultimate goals.`;
  let customTags = [type1, type2, role, region];
  
  if (name === "Ahri") {
    customLore = "Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy. She revels in toying with her prey by manipulating their emotions before devouring their life essence. Despite her predatory nature, Ahri retains a sense of empathy as she receives flashes of memory from each soul she consumes.";
    customTags = ["Mage", "Assassin", "Ionia", "Vastaya", "Mid"];
  } else if (name === "Darius") {
    customLore = "There is no greater symbol of Noxian might than Darius, the nation's most feared and battle-hardened commander. Orphaned at a young age, Darius had to fight to keep himself and his younger brother alive. By the time he joined the military, he had already developed the strength and discipline of a veteran soldier.";
    customTags = ["Fighter", "Tank", "Noxus", "Top"];
  } else if (name === "Lux") {
    customLore = "Luxanna Crownguard hails from Demacia, an insular realm where magical abilities are viewed with fear and suspicion. Able to bend light to her will, she grew up dreading discovery and exile, and was forced to keep her power secret in order to preserve her family's noble status.";
    customTags = ["Mage", "Support", "Demacia", "Mid"];
  }

  return {
    id: `champ_${index + 1}`,
    name: name,
    title: `The ${region} ${type1}`,
    role: role,
    secondaryRole: secondaryRole,
    region: region,
    difficulty: difficulty,
    releaseYear: 2009 + (index % 15),
    lore: customLore,
    abilities: {
      passive: { name: `${name}'s Resolve`, description: `Innate power that grants ${name} scaling bonuses.` },
      q: { name: `Striking ${role}`, description: `A powerful targeted attack dealing physical or magical damage.` },
      w: { name: `${region} Defense`, description: `A defensive stance or utility skill that aids in survival.` },
      e: { name: `Swift Movement`, description: `A dash, blink, or movement speed steroid.` },
      r: { name: `Ultimate Force`, description: `A devastating ultimate ability that can turn the tide of a teamfight.` }
    },
    stats: {
      health: 500 + (index * 5),
      mana: 300 + (index * 2),
      armor: 30 + (index % 10),
      magicResist: 30 + (index % 5),
      attackDamage: 55 + (index % 15),
      attackSpeed: 0.625 + ((index % 10) * 0.01)
    },
    pickRate: (1 + (index % 15) * 0.5).toFixed(1),
    winRate: (45 + (index % 10)).toFixed(1),
    banRate: (0.5 + (index % 20) * 0.8).toFixed(1),
    image: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name.replace(/[' &]/g, '')}.png`,
    splashArt: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name.replace(/[' &]/g, '')}_0.jpg`,
    tags: customTags
  };
});

export default leagueOfLegendsChampions;