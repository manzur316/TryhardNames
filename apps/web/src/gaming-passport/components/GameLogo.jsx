import React, { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import './gameBadge.css';

const LOGOS = {
  'osu!': '/passport/osu-logo.png',
  Roblox: 'https://www.roblox.com/favicon.ico',
  Steam: 'https://store.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg',
};
// Official provider identity for individual cards; decorative emblems belong in the header.
export default function GameLogo({ game, className = '' }) {
  const [failed, setFailed] = useState(null);
  const src = LOGOS[game];
  return <span className={`gp-game-badge gp-game-logo ${className}`} aria-hidden="true">
    {src && failed !== src ? <img src={src} width="72" height="72" alt="" decoding="async"
      referrerPolicy="no-referrer" onError={() => setFailed(src)} /> : <Gamepad2 size={32} />}
  </span>;
}
