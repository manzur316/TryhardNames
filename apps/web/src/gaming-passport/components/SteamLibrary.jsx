import React, { useState } from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
import { steamPlaytime } from '../data/steamLinking.js';

function Artwork({ game }) {
  const [failed, setFailed] = useState(0);
  const cover = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg`;
  return failed < 2 && (failed === 0 || game.iconUrl) ? <img className={`gp-steam-cover${failed ? ' is-fallback' : ''}`}
    src={failed ? game.iconUrl : cover} alt="" width="460" height="215" loading="lazy" decoding="async"
    referrerPolicy="no-referrer" onError={() => setFailed((value) => value + 1)} />
    : <span className="gp-steam-cover is-fallback"><Gamepad2 size={32} /></span>;
}
function AchievementIcon({ item }) {
  const [failed, setFailed] = useState(false);
  return <span className="gp-steam-achievement-icon" title={item.name} aria-label={item.name} tabIndex={0}>
    {item.iconUrl && !failed ? <img src={item.iconUrl} width="32" height="32" alt="" loading="lazy"
      referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : <Trophy size={20} />}
    <span role="tooltip">{item.name}</span>
  </span>;
}
export default function SteamLibrary({ library, achievements = [] }) {
  return <ul className="gp-steam-library" aria-label="Most played games reported by Steam">
    {library.games.map((game) => {
      const progress = achievements.find((item) => item.appId === game.appId);
      const available = progress?.status === 'available';
      return <li key={game.appId}>
        <div className="gp-steam-game-main"><Artwork game={game} /><div>
          <h4>{game.name}</h4><p>{steamPlaytime(game.playtimeMinutes)} played</p>
          {game.recentMinutes !== null && <span>{steamPlaytime(game.recentMinutes)} / last 2 weeks</span>}
        </div></div>
        <div className="gp-steam-achievements"><Trophy size={19} aria-hidden="true" />
          <div className="gp-steam-progress"><span>{available
            ? progress.total ? `${progress.unlocked} / ${progress.total} achievements` : 'No achievements reported'
            : progress?.status === 'unavailable' ? 'Achievements unavailable' : 'Achievements pending daily update'}</span>
            {available && progress.total > 0 && <progress value={progress.unlocked} max={progress.total}
              aria-label={`${game.name}: achievements unlocked`} />}
          </div>
          {available && <div className="gp-steam-achievement-icons">{progress.recent.slice(0, 3).map((item, index) => <AchievementIcon key={`${item.name}-${index}`} item={item} />)}</div>}
        </div>
      </li>;
    })}
  </ul>;
}
