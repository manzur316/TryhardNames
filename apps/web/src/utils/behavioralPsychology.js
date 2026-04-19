export const generateRandomMessage = () => {
  const messages = [
    '🔥 That one hits',
    '💀 Sweaty enough?',
    '⚡ Try another?',
    '👑 Dominate with this',
    '🎯 Perfect for ranked',
    '✨ Chef\'s kiss',
    '🔥 Absolute banger',
    '⚔️ Ready for war'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const checkVariableReward = () => {
  // Returns true exactly 1 in 5 times (20% chance)
  return Math.random() < 0.2;
};

export const trackGenerationCount = (key = 'global') => {
  const current = parseInt(sessionStorage.getItem(`gen_count_${key}`) || '0', 10);
  const next = current + 1;
  sessionStorage.setItem(`gen_count_${key}`, next.toString());
  return next;
};

export const getGenerationCount = (key = 'global') => {
  return parseInt(sessionStorage.getItem(`gen_count_${key}`) || '0', 10);
};