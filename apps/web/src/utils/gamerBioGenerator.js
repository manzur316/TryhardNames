const styles = {
  Tryhard: ['Sweat', 'Tryhard', 'Grinder', 'Competitive Player', 'Ranked Demon', 'Clutch Master'],
  Casual: ['Casual Gamer', 'Vibe Checker', 'Just here for fun', 'Weekend Warrior', 'Cozy Gamer'],
  Streamer: ['Live Everyday', 'Twitch Affiliate', 'Content Creator', 'Entertainer', 'Road to Partner'],
  Pro: ['Esports Athlete', 'Tournament Winner', 'Pro Player', 'Signed to', 'Top 500']
};

const tones = {
  Funny: ['I carry my team heavier than my groceries.', 'My aim is potato, but my heart is gold.', 'Respawning in 3... 2... 1...', 'I play on mute so I don\'t hear the haters.', 'Lag is my only enemy.'],
  Serious: ['No excuses, just results.', 'Grinding to the top.', 'Victory is the only option.', 'Focus, execute, win.', 'Always improving.'],
  Aesthetic: ['Lost in the digital world.', 'Neon lights and late nights.', 'Chasing high scores and good vibes.', 'Pixelated dreams.', 'Cyber reality.'],
  Dark: ['Embrace the shadows.', 'Leaving a trail of defeated enemies.', 'The final boss.', 'Fear the unseen.', 'Born in the void.'],
  Motivational: ['Every loss is a lesson.', 'Push your limits.', 'Never give up, never surrender.', 'Dream big, play hard.', 'Be the game changer.']
};

const emojisList = ['🎮', '⚡', '🔥', '💀', '👑', '🎯', '⚔️', '🌙', '✨', '🖤', '🏆', '🕹️', '🚀', '💯'];
const symbolsList = ['★', '✦', '◆', '⚡', '✨', '⚔️', '|', '-', '~', '»', '«', '×', '∆', '∇'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateSingleBio = (options = {}) => {
  const {
    style = 'Tryhard',
    tone = 'Serious',
    length = 'Medium',
    useEmojis = true,
    useSymbols = true,
    customName = '',
    customGame = ''
  } = options;

  const styleWord = getRandom(styles[style] || styles.Tryhard);
  const tonePhrase = getRandom(tones[tone] || tones.Serious);
  const gameText = customGame ? customGame : 'my favorite games';
  const nameText = customName ? customName : 'Gamer';

  let bio = '';
  const e1 = useEmojis ? getRandom(emojisList) : '';
  const e2 = useEmojis ? getRandom(emojisList) : '';
  const s1 = useSymbols ? getRandom(symbolsList) : '';
  const s2 = useSymbols ? getRandom(symbolsList) : '';

  if (length === 'Short') {
    const templates = [
      `${s1} ${styleWord} ${s2} ${tonePhrase} ${e1}`,
      `${nameText} ${s1} ${gameText} ${styleWord} ${e1}`,
      `${tonePhrase} ${s1} ${styleWord} ${e1}`,
      `${e1} Just a ${styleWord} dominating in ${gameText}.`,
      `${s1} ${nameText} ${s2} ${tonePhrase}`
    ];
    bio = getRandom(templates);
  } else if (length === 'Medium') {
    const templates = [
      `${e1} ${nameText} | ${styleWord} ${e2}\n${s1} Maining ${gameText}\n${s2} ${tonePhrase}`,
      `${tonePhrase} ${e1}\n${s1} ${styleWord} focusing on ${gameText}.\nLet's get this win. ${e2}`,
      `${s1} Welcome to my realm ${s2}\n${e1} ${styleWord} | ${gameText}\n${tonePhrase}`,
      `${nameText} ${e1}\n${s1} ${tonePhrase}\n${s2} Catch me playing ${gameText}.`,
      `${e1} ${styleWord} ${e2}\n${s1} ${gameText} is life.\n${tonePhrase}`
    ];
    bio = getRandom(templates);
  } else {
    // Long
    const templates = [
      `${s1} ${nameText}'s Profile ${s2}\n\n${e1} Status: ${styleWord}\n${e2} Current Obsession: ${gameText}\n\n${s1} "${tonePhrase}"\n\nDrop a follow and let's play! 🎮`,
      `${e1} Welcome to the grind ${e2}\n${s1} Player: ${nameText}\n${s1} Class: ${styleWord}\n${s1} Realm: ${gameText}\n\n${tonePhrase}\n\n${s2} Always ready for the next match.`,
      `╔══ ${nameText} ══╗\n╠ ${e1} ${styleWord}\n╠ ${e2} ${gameText}\n╚══════════╝\n\n${s1} ${tonePhrase} ${s2}\nJoin the squad!`,
      `${e1} ${styleWord} entering the lobby...\n\n${s1} Main Game: ${gameText}\n${s2} Mindset: ${tonePhrase}\n\nIf you're reading this, you're already in my crosshairs. ${e2}`,
      `${s1} ${nameText} ${s2}\n\n${e1} Gaming Style: ${styleWord}\n${e2} Currently Destroying: ${gameText}\n\n${tonePhrase}\n\nLet's connect and conquer. 🚀`
    ];
    bio = getRandom(templates);
  }

  // Clean up extra spaces if emojis/symbols are disabled
  return bio.replace(/  +/g, ' ').replace(/^ | $/gm, '').trim();
};

export const generateMultipleBios = (count = 5, options = {}) => {
  const bios = new Set();
  let attempts = 0;
  
  // Use a Set to ensure unique bios, with a fallback counter to prevent infinite loops
  while (bios.size < count && attempts < count * 5) {
    bios.add(generateSingleBio(options));
    attempts++;
  }
  
  return Array.from(bios);
};

export const getTrendingBios = () => [
  "★ Tryhard Demon ★\nMaining Valorant 🎯\nNo excuses, just results. 💀",
  "🎮 Casual Gamer 🎮\nJust here for the vibes and good times.\nLag is my only enemy. ✨",
  "╔══ Pro Player ══╗\n╠ ⚡ FPS God\n╠ 🏆 Tournament Winner\n╚══════════════╝\nVictory is the only option.",
  "🌙 Aesthetic Vibes 🌙\nLost in the digital world.\nChasing high scores. 🖤",
  "Content Creator 🚀\nLive everyday grinding Fortnite.\nI carry my team heavier than my groceries. 😂",
  "◆ Sweaty Grinder ◆\nRanked Demon | Apex Legends\nFear the unseen. ⚔️",
  "✨ Vibe Checker ✨\nCozy games and chill streams.\nPixelated dreams. 🎮",
  "☠️ The Final Boss ☠️\nLeaving a trail of defeated enemies.\nPush your limits. 🔥"
];