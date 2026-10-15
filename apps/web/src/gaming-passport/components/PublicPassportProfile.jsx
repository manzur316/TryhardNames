import React from 'react';
import { Clock3, ShieldCheck } from 'lucide-react';
import PassportIdentityScene from './PassportIdentityScene.jsx';
import GameBadge from './GameBadge.jsx';
import { publicGameHighlights } from '../data/publicPassportV2.js';
import './publication.css';

const labels = { pp: 'Performance (PP)', globalRank: 'Global rank', countryRank: 'Country rank', accuracyPercent: 'Accuracy (%)', medals: 'Medals' };
const number = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

export default function PublicPassportProfile({ passport }) {
  return <>
    <PassportIdentityScene alias={passport.alias} avatarUrl={passport.avatarUrl} bio={passport.bio} scene={passport.scene}
      slug={passport.slug} updatedAt={passport.updatedAt} isPublished publicPresentation gameHighlights={publicGameHighlights(passport.games)} />
    {passport.games.length > 0 && <section className="gp-public-content" id="gp-linked-games" tabIndex={-1}>
      <div className="gp-section-heading"><h2>Linked games</h2></div>
      <div className="gp-public-games">{passport.games.map((game, index) => <article className="gp-public-game" data-provider={game.provider} key={`${game.provider}-${index}`}>
        <header><GameBadge game={game.provider === 'osu' ? 'osu!' : 'Roblox'} /><div><h3>{game.provider === 'osu' ? 'osu!' : 'Roblox'}</h3><p>{game.displayName || game.username}</p>
          {game.displayName !== game.username && <p>@{game.username}</p>}{game.stats?.mode && <p>Mode: {game.stats.mode}</p>}</div></header>
        {game.stats && <dl>{Object.entries(labels).filter(([key]) => game.stats[key] !== null).map(([key, label]) =>
          <div key={key}><dt>{label}</dt><dd>{number.format(game.stats[key])}</dd></div>)}</dl>}
        <footer>{game.stale ? <><Clock3 size={14} />Snapshot needs updating</> : <><ShieldCheck size={14} />Ownership verified</>}
          {game.updatedAt && <time dateTime={game.updatedAt}>{new Date(game.updatedAt).toLocaleDateString('en')}</time>}</footer>
      </article>)}</div>
    </section>}
  </>;
}
