import React, { useId, useState } from 'react';
import { Activity, ChevronDown, Clock3, Globe2, LockKeyhole, MapPin, Medal, ShieldCheck, Target, Unplug } from 'lucide-react';
import { buildPrivateOsuCard } from '../data/privateOsuCard.js';
import GameBadge from './GameBadge.jsx';
import './privateOsuCard.css';

const STAT_ICONS = { global: Globe2, country: MapPin, accuracy: Target, medals: Medal };
const displayDate = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function PrivateOsuAccountCard({ profile, busy, onUnlink }) {
  const headingId = useId();
  const [brokenAvatar, setBrokenAvatar] = useState(null);
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const card = buildPrivateOsuCard(profile);
  if (!card) return null;

  return <article className="gp-osu-card" aria-labelledby={headingId} data-stale={card.stale}>
    <div className="gp-osu-card-cover">
      <img className="gp-osu-card-art" src="/passport/osu-rhythm.webp" width="1280" height="720" alt="" />
      <header className="gp-osu-card-brand">
        <GameBadge game="osu!" className="gp-osu-card-badge" />
        <div><span className="gp-osu-card-game">osu!</span>{card.mode && <span className="gp-osu-card-mode">Mode <strong>{card.mode}</strong></span>}</div>
        <span className="gp-osu-card-private"><LockKeyhole size={13} aria-hidden="true" />Private</span>
      </header>
      <div className="gp-osu-card-player">
        <div className="gp-osu-card-avatar">
          {card.avatarUrl && brokenAvatar !== card.avatarUrl
            ? <img src={card.avatarUrl} alt="" width="68" height="68" referrerPolicy="no-referrer" onError={() => setBrokenAvatar(card.avatarUrl)} />
            : <span aria-hidden="true">{card.initial}</span>}
        </div>
        <div className="gp-osu-card-identity"><h3 id={headingId}>{card.username}</h3><span className="gp-osu-card-ownership"><ShieldCheck size={15} aria-hidden="true" />Account ownership verified</span></div>
        {card.pp !== null && <dl className="gp-osu-card-performance"><div><dt><Activity size={14} aria-hidden="true" />Performance</dt><dd>{card.pp}<span>PP</span></dd></div></dl>}
      </div>
    </div>

    {card.stats.length > 0 && <dl className="gp-osu-card-stats">{card.stats.map(({ key, label, value }) => {
      const Icon = STAT_ICONS[key];
      return <div key={key} data-stat={key}><dt><Icon size={15} aria-hidden="true" />{label}</dt><dd data-long={value.length > 10}>{value}</dd></div>;
    })}</dl>}

    <footer className="gp-osu-card-footer">
      <div className="gp-osu-card-snapshot"><Clock3 size={14} aria-hidden="true" /><span>{card.stale ? 'Snapshot needs updating' : 'Saved snapshot'}{card.updatedAt && <time dateTime={card.updatedAt}>Updated {displayDate(card.updatedAt)}</time>}</span></div>
      <span className="gp-osu-card-saved"><LockKeyhole size={13} aria-hidden="true" />Saved privately to your Passport</span>
    </footer>

    <details className="gp-osu-card-details" onToggle={(event) => { if (!event.currentTarget.open) setConfirmUnlink(false); }}>
      <summary>Connection details<ChevronDown size={16} aria-hidden="true" /></summary>
      <div className="gp-osu-card-details-body">
        <dl><div><dt>Source</dt><dd>osu!</dd></div><div><dt>Verification</dt><dd>Account ownership</dd></div>{card.verifiedAt && <div><dt>Verified</dt><dd><time dateTime={card.verifiedAt}>{displayDate(card.verifiedAt)}</time></dd></div>}<div><dt>Visibility</dt><dd>Private / Not published</dd></div></dl>
        {onUnlink && (confirmUnlink ? <div className="gp-osu-card-confirm" role="group" aria-label="Confirm unlink">
          <p>Unlink {card.username} from this Passport?</p>
          <button className="gp-button" type="button" disabled={busy} onClick={() => setConfirmUnlink(false)}>Cancel</button>
          <button className="gp-button gp-osu-card-unlink" type="button" disabled={busy} onClick={() => { setConfirmUnlink(false); onUnlink(profile.id); }}><Unplug size={15} aria-hidden="true" />Confirm unlink</button>
        </div> : <button className="gp-text-button gp-osu-card-unlink" type="button" disabled={busy} onClick={() => setConfirmUnlink(true)}><Unplug size={15} aria-hidden="true" />Unlink account</button>)}
      </div>
    </details>
  </article>;
}
