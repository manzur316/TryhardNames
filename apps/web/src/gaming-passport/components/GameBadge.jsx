import React from 'react';
import { getGameBadge } from '../data/gameBadges.js';
import './gameBadge.css';

export default function GameBadge({ game, className = '' }) {
  const badge = getGameBadge(game);
  if (!badge) return null;
  return <span className={`gp-game-badge ${className}`} aria-hidden="true">
    <img src={badge.src} alt="" width="384" height="384" decoding="async" />
  </span>;
}
