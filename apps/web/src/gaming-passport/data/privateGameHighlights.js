import { buildPrivateOsuCard } from './privateOsuCard.js';

// Reuse the saved connection's display contract; never synthesize ranks or cross-game scores.
export function buildPrivateGameHighlights(connections) {
  if (!Array.isArray(connections)) return [];
  return connections.flatMap((connection) => {
    const card = buildPrivateOsuCard(connection);
    if (!card) return [];
    return [{
      game: 'osu!', username: card.username, mode: card.mode,
      pp: card.pp, globalRank: card.stats.find((stat) => stat.key === 'global')?.value ?? null,
      stale: card.stale,
    }];
  });
}
