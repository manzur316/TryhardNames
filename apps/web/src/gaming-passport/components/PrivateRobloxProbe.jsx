import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Gamepad2, Link2, LockKeyhole, ShieldCheck, Unplug } from 'lucide-react';
import { buildPrivateRobloxHighlight, PRIVATE_ROBLOX_CONNECT_URL, requestPrivateRobloxProbe } from '../data/privateRobloxProbe.js';
import GameBadge from './GameBadge.jsx';
import './privateRobloxProbe.css';

export default function PrivateRobloxProbe({ onHighlightChange }) {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [brokenAvatar, setBrokenAvatar] = useState('');
  const mounted = useRef(false);
  const revision = useRef(0);
  useEffect(() => {
    onHighlightChange?.(buildPrivateRobloxHighlight(state));
  }, [state, onHighlightChange]);
  useEffect(() => () => { onHighlightChange?.(null); }, [onHighlightChange]);
  useEffect(() => {
    mounted.current = true;
    const read = async () => {
      const requestId = ++revision.current;
      try {
        const result = await requestPrivateRobloxProbe();
        if (mounted.current && requestId === revision.current) { setState(result); setError(''); }
      } catch {
        if (mounted.current && requestId === revision.current) {
          setState(null); setError('Private Roblox test unavailable. Start the local test server.');
        }
      }
    };
    read();
    window.addEventListener('focus', read);
    const timer = window.setInterval(read, 60_000);
    return () => { mounted.current = false; ++revision.current;
      window.removeEventListener('focus', read); window.clearInterval(timer); };
  }, []);

  async function connect() {
    ++revision.current;
    setBusy(true); setError('');
    try {
      await requestPrivateRobloxProbe('connect');
      if (mounted.current) window.location.assign(PRIVATE_ROBLOX_CONNECT_URL);
    } catch {
      if (mounted.current) setError('Could not start Roblox authorization. Check the configuration and wait one minute before retrying.');
    } finally { if (mounted.current) setBusy(false); }
  }

  async function clear() {
    ++revision.current;
    setBusy(true); setError('');
    try {
      await requestPrivateRobloxProbe('connection');
      ++revision.current;
      if (mounted.current) setState((current) => ({ ...current, status: 'disconnected', profile: null, message: '' }));
    } catch { if (mounted.current) setError('Could not clear the local Roblox test. Try again.'); }
    finally { if (mounted.current) setBusy(false); }
  }

  const profile = state?.status === 'verified' ? state.profile : null;
  const createdAt = profile?.createdAt ? new Date(profile.createdAt) : null;
  const waiting = state?.status === 'pending' || state?.status === 'processing';
  return <section className="gp-roblox-probe" id="gp-roblox-test" tabIndex={-1} aria-label="Private Roblox authorization test">
    <div className="gp-section-heading"><h2>Roblox</h2><span className="gp-roblox-private"><LockKeyhole size={14} aria-hidden="true" />Private OAuth test</span></div>
    <article className="gp-roblox-account">
      <GameBadge game="Roblox" className="gp-roblox-emblem" />
      <div className="gp-roblox-player">
      <span className="gp-roblox-game">Roblox</span>
      <div className="gp-roblox-player-row">
      <div className="gp-roblox-avatar">
        {profile?.avatarUrl && profile.avatarUrl !== brokenAvatar
          ? <img src={profile.avatarUrl} alt="" width="64" height="64" referrerPolicy="no-referrer" onError={() => setBrokenAvatar(profile.avatarUrl)} />
          : <Gamepad2 size={30} aria-hidden="true" />}
      </div>
      <div className="gp-roblox-identity"><h3>{profile?.displayName || 'Roblox account'}</h3>
        {profile ? <><p>@{profile.username}</p><p className="gp-roblox-verified"><ShieldCheck size={14} aria-hidden="true" />Authorization verified</p></>
          : <p role="status">{!state ? (error ? 'Connection unavailable.' : 'Checking configuration...')
            : !state.configured ? 'OAuth application not configured.' : waiting ? 'Waiting for authorization.' : 'No account authorized.'}</p>}
      </div>
      </div>
      </div>
      {profile && <dl className="gp-roblox-facts">
        <div><dt>Player ID</dt><dd>{profile.accountId}</dd></div>
        {createdAt && !Number.isNaN(createdAt.getTime()) && <div><dt>Member since</dt><dd>{createdAt.toLocaleDateString('en', { year: 'numeric', month: 'short', timeZone: 'UTC' })}</dd></div>}
      </dl>}
      <div className="gp-roblox-actions">
        {profile ? <><a className="gp-icon-button" href={profile.profileUrl} target="_blank" rel="noopener noreferrer" title="Open Roblox profile" aria-label="Open Roblox profile"><ExternalLink size={17} /></a>
          <button className="gp-icon-button" disabled={busy} onClick={clear} title="Clear private test" aria-label="Clear private test"><Unplug size={17} /></button></>
          : state?.configured && <button className="gp-button" disabled={busy || state.status === 'processing'} onClick={connect}><Link2 size={16} />{busy ? 'Connecting...' : 'Authorize Roblox'}</button>}
      </div>
      {profile && <p className="gp-roblox-notice"><LockKeyhole size={13} aria-hidden="true" />Temporary result. Access revoked after verification. Not linked to your Passport.</p>}
    </article>
    {(error || state?.message) && <p role="alert" className="gp-feedback gp-error">{error || state.message}</p>}
  </section>;
}
