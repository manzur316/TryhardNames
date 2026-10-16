import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ExternalLink, Gamepad2, Link2, LockKeyhole, RefreshCw, ShieldCheck, Unplug } from 'lucide-react';
import GameLogo from './GameLogo.jsx';
import SteamLibrary from './SteamLibrary.jsx';
import { STEAM_LINK_BASE, requestSteamLink, steamAuthorizationUrl, steamHighlight } from '../data/steamLinking.js';
import './privateSteamProbe.css';

const MESSAGES = {
  account_already_linked: 'This Steam account is already linked to another Passport.',
  rate_limited: 'Wait one minute before starting another Steam sign-in.',
  sign_in_required: 'Sign in to TryhardNames again, then restart the Steam connection.',
  invalid_attempt: 'This connection expired or belongs to another session. Start again.',
  private_passport_required: 'This Passport is unavailable for linking. Check its account status.',
  tester_required: 'Steam linking is not enabled for this account yet.',
};
function SteamImage({ src, className }) {
  const [failed, setFailed] = useState(null);
  return src && failed !== src ? <img className={className} src={src} alt="" width="48" height="48"
    referrerPolicy="no-referrer" onError={() => setFailed(src)} /> : <Gamepad2 className={className} aria-hidden="true" />;
}
export default function PersistentSteamConnections({ ownerId, onHighlightsChange, onBeforeConnect, onAvailabilityChange }) {
  const [params, setParams] = useSearchParams();
  const [available, setAvailable] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const mounted = useRef(false);
  const acting = useRef(false);
  const revision = useRef(0);
  const pending = params.get('steamLink') === 'ready';
  const failed = params.get('steamLink') === 'failed';
  const requested = params.get('steamPersist') === '1';

  useEffect(() => { onHighlightsChange(accounts.map(steamHighlight).filter(Boolean)); }, [accounts, onHighlightsChange]);
  useEffect(() => () => onHighlightsChange([]), [onHighlightsChange]);
  useEffect(() => { onAvailabilityChange?.(available); }, [available, onAvailabilityChange]);
  useEffect(() => {
    let cancelled = false;
    mounted.current = true;
    const read = async () => {
      if (acting.current) return;
      const id = ++revision.current;
      try {
        const response = await fetch(STEAM_LINK_BASE + '/availability', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        if (!response.ok || !(await response.json()).enabled) {
          if (!cancelled && id === revision.current) { setAvailable(false); setAccounts([]); }
          return;
        }
        if (!cancelled && id === revision.current) setAvailable(true);
        const result = await requestSteamLink('status', ownerId);
        if (!cancelled && id === revision.current) { setAvailable(true); setAccounts(result.accounts); setError(''); }
      } catch (err) {
        if (!cancelled && id === revision.current) {
          setAccounts([]);
          setError(MESSAGES[err.message] || 'Steam linking is unavailable. Try again later.');
        }
      }
    };
    read();
    window.addEventListener('focus', read);
    return () => { cancelled = true; mounted.current = false; window.removeEventListener('focus', read); };
  }, [ownerId]);

  function clearResult() {
    const next = new URLSearchParams(params); next.delete('steamLink');
    setParams(next, { replace: true });
  }
  async function act(action, accountId) {
    if (acting.current || (action === 'connect' && onBeforeConnect && !onBeforeConnect())) return;
    acting.current = true; const id = ++revision.current;
    setBusy(true); setError('');
    try {
      const result = await requestSteamLink(action, ownerId, accountId);
      if (!mounted.current || id !== revision.current) return;
      if (action === 'connect') { window.location.assign(steamAuthorizationUrl(result.authorizationUrl)); return; }
      clearResult(); setConfirmId(null);
      if (action === 'unlink') setAccounts((current) => current.filter((account) => account.id !== accountId));
      const status = await requestSteamLink('status', ownerId);
      if (mounted.current && id === revision.current) setAccounts(status.accounts);
    } catch (err) {
      if (mounted.current && id === revision.current) setError(MESSAGES[err.message] || 'Could not update the Steam connection. Please try again.');
    } finally { acting.current = false; if (mounted.current && id === revision.current) setBusy(false); }
  }
  if (!available && !pending && !failed && !requested) return null;
  return <section className="gp-steam-probe" id="gp-steam-linked" tabIndex={-1} aria-label="Linked Steam accounts">
    <div className="gp-section-heading"><h2>Steam</h2><span className="gp-steam-status"><LockKeyhole size={14} />Private connection</span></div>
    {(pending || failed) && <div className="gp-feedback" role="status">
      {pending ? <><span>Steam verified your identity. Save this connection to your Passport?</span><button className="gp-button" disabled={busy} onClick={() => act('complete')}><Check size={16} />Confirm Steam link</button></>
        : <><span>Steam sign-in could not be completed.</span><button className="gp-button" onClick={clearResult}>Dismiss</button></>}
    </div>}
    {accounts.map((account) => <article key={account.id}>
      <div className="gp-steam-identity">
        <GameLogo game="Steam" className="gp-steam-brand" />
        <div className="gp-steam-player"><SteamImage src={account.avatarUrl} className="gp-steam-avatar" />
          <div><h3>{account.displayName}</h3><p className="gp-steam-verified"><ShieldCheck size={14} />Identity verified with Steam</p><p className="gp-steam-id">{account.steamId}</p></div>
        </div>
        <dl className="gp-steam-facts"><div><dt>Games reported</dt><dd>{account.library.gameCount ?? 'Unavailable'}</dd></div>
          <div><dt>Member since</dt><dd>{account.createdAt ? new Date(account.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Unavailable'}</dd></div></dl>
        <div className="gp-steam-actions">
          <a className="gp-icon-button" href={account.profileUrl} target="_blank" rel="noopener noreferrer" title="Open Steam profile" aria-label="Open Steam profile"><ExternalLink size={17} /></a>
          <button className="gp-icon-button" disabled={busy || pending} onClick={() => act('connect')} title="Verify Steam identity again" aria-label="Verify Steam identity again"><RefreshCw size={17} /></button>
          <button className="gp-icon-button" disabled={busy} onClick={() => setConfirmId(account.id)} title="Unlink Steam account" aria-label="Unlink Steam account"><Unplug size={17} /></button>
        </div>
      </div>
      {account.dataError && <p className="gp-feedback" role="status">Identity verified. Some Steam details were unavailable during the last update.</p>}
      {account.library.status === 'available' ? account.library.games.length ? <SteamLibrary library={account.library} achievements={account.achievements} />
        : <p className="gp-steam-empty">Steam returned no games for this account.</p>
        : <p className="gp-steam-empty"><LockKeyhole size={15} />Game details unavailable. Your Steam privacy settings may hide your library or playtime.</p>}
      <p className="gp-steam-notice">Private snapshot · {new Date(account.lastSyncedAt || account.verifiedAt).toLocaleString()}{steamHighlight(account)?.stale ? ' · Awaiting daily update' : ''}</p>
      {confirmId === account.id && <div className="gp-feedback" role="group" aria-label="Confirm Steam unlink">
        <span>Unlink {account.displayName} and remove its saved Steam details?</span>
        <button className="gp-button" disabled={busy} onClick={() => act('unlink', account.id)}>Unlink</button>
        <button className="gp-button" disabled={busy} onClick={() => setConfirmId(null)}>Cancel</button>
      </div>}
    </article>)}
    {!pending && available && <button className="gp-button" disabled={busy} onClick={() => act('connect')}><Link2 size={16} />{busy ? 'Connecting...' : accounts.length ? 'Link another Steam account' : 'Sign in through Steam'}</button>}
    {!available && !pending && !error && <p role="status">Steam linking is currently unavailable.</p>}
    {error && <p className="gp-feedback gp-error" role="alert">{error}</p>}
  </section>;
}
