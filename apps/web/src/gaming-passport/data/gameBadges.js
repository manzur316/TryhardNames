// Presentation assets only. Catalog membership never establishes a linked account or achievement.
export const GAME_BADGES = Object.freeze([
  { id: 'fortnite', game: 'Fortnite' },
  { id: 'rocket-league', game: 'Rocket League' },
  { id: 'apex-legends', game: 'Apex Legends' },
  { id: 'valorant', game: 'VALORANT' },
  { id: 'osu', game: 'osu!' },
  { id: 'counter-strike-2', game: 'Counter-Strike 2' },
  { id: 'brawl-stars', game: 'Brawl Stars' },
  { id: 'league-of-legends', game: 'League of Legends' },
  { id: 'clash-of-clans', game: 'Clash of Clans' },
  { id: 'roblox', game: 'Roblox', src: '/passport/game-badges/roblox.png' },
  { id: 'steam', game: 'Steam', src: 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg' },
].map((badge) => Object.freeze({ ...badge, src: badge.src ?? `/passport/game-badges/${badge.id}.webp` })));

export function getGameBadge(game) {
  return GAME_BADGES.find((badge) => badge.game === game) ?? null;
}
