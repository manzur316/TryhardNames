import React, { useEffect, useRef, useState } from 'react';
import { Activity, Globe2, Link2, LockKeyhole, MapPin, ShieldCheck, Target, Trophy, Unplug } from 'lucide-react';
import { PRIVATE_OSU_CONNECT_URL, requestPrivateOsuProbe } from '../data/privateOsuProbe.js';
import './privateOsuProbe.css';

const MODES = { osu: 'osu!', mania: 'osu!mania', taiko: 'osu!taiko', fruits: 'osu!catch' };
const format = (value, digits = 0) => new Intl.NumberFormat('en', { maximumFractionDigits: digits }).format(value);

export default function PrivateOsuProbe() {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [brokenAvatar, setBrokenAvatar] = useState('');
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const read = async () => {
      try {
        const result = await requestPrivateOsuProbe();
        if (mounted.current) { setState(result); setError(''); }
      } catch {
        if (mounted.current) setError('Private osu! test unavailable. Start the local test server.');
      }
    };
    read();
    window.addEventListener('focus', read);
    const timer = window.setInterval(read, 60_000);
    return () => { mounted.current = false; window.removeEventListener('focus', read); window.clearInterval(timer); };
  }, []);

  async function connect() {
    setBusy(true); setError('');
    try {
      await requestPrivateOsuProbe('connect');
      window.location.assign(PRIVATE_OSU_CONNECT_URL);
    } catch {
      if (mounted.current) setError('Could not start authorization. Check the private configuration and wait one minute before retrying.');
    } finally { if (mounted.current) setBusy(false); }
  }

  async function disconnect() {
    setBusy(true); setError('');
    try {
      await requestPrivateOsuProbe('connection');
      if (mounted.current) setState((current) => ({ ...current, status: 'disconnected', profile: null, message: '' }));
    } catch { if (mounted.current) setError('Could not clear the local test. Try again.'); }
    finally { if (mounted.current) setBusy(false); }
  }

  const profile = state?.profile;
  const stats = profile ? [
    ['Global rank', profile.globalRank == null ? null : `#${format(profile.globalRank)}`, Globe2],
    ['Country rank', profile.countryRank == null ? null : `#${format(profile.countryRank)}`, MapPin],
    ['Accuracy', profile.accuracyPercent == null ? null : `${format(profile.accuracyPercent, 2)}%`, Target],
    ['Medals', profile.medals == null ? null : format(profile.medals), Trophy],
  ].filter(([, value]) => value !== null) : [];
  const updatedAt = profile?.verifiedAt ? new Date(profile.verifiedAt) : null;

  return <section className="gp-osu-probe" aria-label="Private osu! connection">
    <div className="gp-section-heading"><h2>My games</h2><span className="gp-osu-private"><LockKeyhole size={14} aria-hidden="true" />Private test / Not published</span></div>
    {profile ? <article className="gp-osu-profile">
      <header className="gp-osu-game-heading">
        <div className="gp-osu-game-name"><span className="gp-osu-mark" aria-hidden="true">osu!</span><div><h3>osu!</h3><p>{MODES[profile.mode]}</p></div></div>
        <button className="gp-icon-button" disabled={busy} onClick={disconnect} title="Clear private connection" aria-label="Clear private connection"><Unplug size={18} aria-hidden="true" /></button>
      </header>
      <div className="gp-osu-player">
        <div className="gp-osu-avatar">
          {profile.avatarUrl && profile.avatarUrl !== brokenAvatar
            ? <img src={profile.avatarUrl} alt="" width="64" height="64" referrerPolicy="no-referrer" onError={() => setBrokenAvatar(profile.avatarUrl)} />
            : <span aria-hidden="true">{profile.username?.slice(0, 1).toUpperCase()}</span>}
        </div>
        <div className="gp-osu-player-identity"><h4>{profile.username}</h4><p className="gp-osu-authorized"><ShieldCheck size={14} aria-hidden="true" />Account authorized with osu!</p></div>
        {profile.pp != null && <dl className="gp-osu-performance"><div><dt><Activity size={14} aria-hidden="true" />Performance</dt><dd>{format(profile.pp, 2)} <span>PP</span></dd></div></dl>}
      </div>
      {stats.length > 0 && <dl className="gp-osu-stats">{stats.map(([label, value, Icon]) => <div key={label}><dt><Icon size={14} aria-hidden="true" />{label}</dt><dd>{value}</dd></div>)}</dl>}
      <footer><span><LockKeyhole size={14} aria-hidden="true" />Local preview only. Not saved to your account.</span>{updatedAt && !Number.isNaN(updatedAt.getTime()) && <time dateTime={updatedAt.toISOString()}>Updated {updatedAt.toLocaleString()}</time>}</footer>
    </article> : <div className="gp-osu-connect">
      <span className="gp-osu-mark" aria-hidden="true">osu!</span>
      <div><h3>osu!</h3><p role="status">{!state ? (error ? 'Connection unavailable.' : 'Checking local connection...') : !state.configured ? 'OAuth application not configured.'
        : state.status === 'pending' ? 'Waiting for osu! authorization.' : 'No osu! account connected.'}</p></div>
      {state?.configured && <button className="gp-button" disabled={busy} onClick={connect}><Link2 size={16} aria-hidden="true" />{busy ? 'Connecting...' : 'Connect osu!'}</button>}
    </div>}
    {(error || state?.message) && <p role="alert" className="gp-feedback gp-error">{error || state.message}</p>}
  </section>;
}
