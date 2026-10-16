import React, { useId } from 'react';
import { Clock3, Gamepad2, ShieldCheck, Trophy } from 'lucide-react';
import PassportIdentityScene from './PassportIdentityScene.jsx';
import GameLogo from './GameLogo.jsx';
import { publicGameHighlights } from '../data/publicPassportV2.js';
import './publicPassportProfile.css';

const number = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
const metrics = [
  ['pp', 'Performance', 'PP'], ['globalRank', 'Global rank', ''],
  ['countryRank', 'Country rank', ''], ['accuracyPercent', 'Accuracy', '%'], ['medals', 'Medals', ''],
];
const games = {
  osu: { name: 'osu!', art: '/passport/osu-rhythm.webp' },
  roblox: { name: 'Roblox', art: '/passport/backgrounds/neon-gateway.webp' },
};

export default function PublicPassportProfile({ passport }) {
  return <div className="gp-profile-presentation">
    <PassportIdentityScene alias={passport.alias} avatarUrl={passport.avatarUrl} bio={passport.bio} scene={passport.scene}
      slug={passport.slug} updatedAt={passport.updatedAt} isPublished publicPresentation gameHighlights={publicGameHighlights(passport.games)} />
    {passport.games.length > 0 && <section className="gp-public-content" id="gp-linked-games" tabIndex={-1}>
      <div className="gp-profile-games-heading"><h2><Gamepad2 size={23} aria-hidden="true" />Linked games</h2>
        <span>{passport.games.length} verified {passport.games.length === 1 ? 'account' : 'accounts'}</span></div>
      <div className="gp-profile-games">{passport.games.map((game, index) => <PublicGameCard game={game} key={`${game.provider}-${index}`} />)}</div>
    </section>}
  </div>;
}

function PublicGameCard({ game }) {
  const heading = useId();
  const presentation = games[game.provider];
  if (!presentation) return null;
  const stats = metrics.filter(([key]) => Number.isFinite(game.stats?.[key]));
  return <article className="gp-profile-game" data-provider={game.provider} aria-labelledby={heading}>
    <img className="gp-profile-game-art" src={presentation.art} alt="" loading="lazy" width="1280" height="720" />
    <div className="gp-profile-game-body">
      <GameLogo game={presentation.name} className="gp-profile-game-badge" />
      <header className="gp-profile-game-identity">
        <p className="gp-profile-game-title">{presentation.name}{game.stats?.mode && <span>{game.stats.mode}</span>}</p>
        <h3 id={heading}>{game.displayName || game.username}</h3>
        {game.displayName && game.displayName !== game.username && <p className="gp-profile-game-handle">@{game.username}</p>}
        <span className="gp-profile-game-verified"><ShieldCheck size={14} aria-hidden="true" />Ownership verified</span>
      </header>
      {stats.length > 0 ? <dl className="gp-profile-game-stats">{stats.map(([key, label, unit]) => <div key={key}>
        <dt>{key === 'medals' && <Trophy size={13} aria-hidden="true" />}{label}</dt>
        <dd>{key.endsWith('Rank') ? '#' : ''}{number.format(game.stats[key])}{unit && <span>{unit}</span>}</dd>
      </div>)}</dl> : <div className="gp-profile-identity-only"><ShieldCheck size={22} aria-hidden="true" /><span>Verified account</span></div>}
    </div>
    <footer className="gp-profile-game-footer" data-stale={game.stale}>
      <span><Clock3 size={13} aria-hidden="true" />{game.stale ? 'Snapshot needs updating' : 'Account verified'}</span>
      {game.updatedAt && <time dateTime={game.updatedAt}>Updated {new Date(game.updatedAt).toLocaleDateString('en', {dateStyle:'medium', timeZone:'UTC'})}</time>}
    </footer>
  </article>;
}
