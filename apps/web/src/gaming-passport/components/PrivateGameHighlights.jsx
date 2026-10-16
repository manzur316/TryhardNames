import React from 'react';
import { ArrowDownRight, Clock3, Gamepad2, LockKeyhole, ShieldCheck } from 'lucide-react';
import GameBadge from './GameBadge.jsx';

export default function PrivateGameHighlights({ highlights, probeHighlights = [] }) {
  if (!highlights.length && !probeHighlights.length) return null;
  const gameCount = new Set(highlights.map((item) => item.game)).size;
  const tiles = [...highlights, ...probeHighlights.map((item) => ({ ...item, temporary: true }))];
  return <div className="gp-game-highlights" aria-label="Linked game highlights" data-private-probe={!highlights.length ? '' : undefined}>
    <div className="gp-highlights-heading">
      <h3><Gamepad2 size={17} aria-hidden="true" />{highlights.length ? 'Linked games' : 'Game preview'}</h3>
      <span>{highlights.length ? <>{gameCount} {gameCount === 1 ? 'game' : 'games'} / {highlights.length} {highlights.length === 1 ? 'account' : 'accounts'}</> : 'Private test'}</span>
    </div>
    <div className="gp-highlight-grid">
      {tiles.map((game, index) => <a key={`${game.game}-${game.username}-${game.mode}-${index}`} className={`gp-game-highlight ${game.temporary ? 'gp-game-highlight-probe' : ''}`} data-game={game.game} data-private-probe={game.temporary ? '' : undefined} href={game.temporary ? '#gp-roblox-test' : game.game === 'Bungie' ? '#gp-bungie-linked' : game.game === 'Steam' ? '#gp-steam-linked' : game.game === 'Roblox' ? '#gp-roblox-linked' : '#gp-linked-games'} aria-label={`View ${game.username}'s ${game.game} ${game.temporary ? 'private test' : 'account details'}`}>
        <GameBadge game={game.game} className="gp-highlight-badge" />
        <div className="gp-highlight-brand">
          <div>
            <div className="gp-highlight-title"><span className="gp-highlight-game">{game.game}</span>{game.mode && <span className="gp-highlight-mode">{game.mode}</span>}</div>
            <p className="gp-highlight-player">{game.username}</p>
          </div>
          <ArrowDownRight size={16} aria-hidden="true" />
        </div>
        {(game.pp !== null || game.globalRank !== null) && <dl className="gp-highlight-stats">
          {game.pp !== null && <div><dt>Performance</dt><dd data-long={game.pp.length > 9}>{game.pp}<span>PP</span></dd></div>}
          {game.globalRank !== null && <div><dt>Global rank</dt><dd data-long={game.globalRank.length > 9}>{game.globalRank}</dd></div>}
        </dl>}
        <div className={`gp-highlight-status ${game.stale || game.temporary ? 'gp-highlight-stale' : ''}`}>
          {game.temporary ? <><LockKeyhole size={12} aria-hidden="true" />OAuth verified / Temporary test</> : game.stale ? <><Clock3 size={12} aria-hidden="true" />Snapshot needs updating</> : <><ShieldCheck size={12} aria-hidden="true" />Ownership verified</>}
        </div>
      </a>)}
    </div>
  </div>;
}
