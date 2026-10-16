import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ExternalLink, Gamepad2, Link2, LockKeyhole, RefreshCw, ShieldCheck, Unplug } from 'lucide-react';
import GameLogo from './GameLogo.jsx';
import { BUNGIE_LINK_BASE, requestBungieLink, bungieAuthorizationUrl, bungieHighlight } from '../data/bungieLinking.js';
import './privateSteamProbe.css';
import './persistentBungie.css';

const MESSAGES = {
  account_already_linked: 'This Bungie account is already linked to another Passport.',
  rate_limited: 'Wait one minute before starting another Bungie sign-in.',
  sign_in_required: 'Sign in to TryhardNames again, then restart the Bungie connection.',
  invalid_attempt: 'This connection expired or belongs to another session. Start again.',
  private_passport_required: 'This Passport is unavailable for linking. Check its account status.',
  tester_required: 'Bungie linking is not enabled for this account yet.',
};
function BungieImage({ src, className }) {
  const [failed, setFailed] = useState(null);
  return src && failed !== src ? <img className={className} src={src} alt="" width="48" height="48"
    referrerPolicy="no-referrer" onError={() => setFailed(src)} /> : <Gamepad2 className={className} aria-hidden="true" />;
}
export default function PersistentBungieConnections({ ownerId, onHighlightsChange, onBeforeConnect, onAvailabilityChange }) {
  const [params, setParams] = useSearchParams();
  const [available, setAvailable] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const mounted = useRef(false);
  const acting = useRef(false);
  const revision = useRef(0);
  const pending = params.get('bungieLink') === 'ready';
  const failed = params.get('bungieLink') === 'failed';
  const requested = params.get('bungiePersist') === '1';

  useEffect(() => { onHighlightsChange(accounts.map(bungieHighlight).filter(Boolean)); }, [accounts, onHighlightsChange]);
  useEffect(() => () => onHighlightsChange([]), [onHighlightsChange]);
  useEffect(() => { onAvailabilityChange?.(available); }, [available, onAvailabilityChange]);
  useEffect(() => {
    let cancelled = false;
    mounted.current = true;
    const read = async () => {
      if (acting.current) return;
      const id = ++revision.current;
      try {
        const response = await fetch(BUNGIE_LINK_BASE + '/availability', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        if (!response.ok || !(await response.json()).enabled) {
          if (!cancelled && id === revision.current) { setAvailable(false); setAccounts([]); }
          return;
        }
        if (!cancelled && id === revision.current) setAvailable(true);
        const result = await requestBungieLink('status', ownerId);
        if (!cancelled && id === revision.current) { setAvailable(true); setAccounts(result.accounts); setError(''); }
      } catch (err) {
        if (!cancelled && id === revision.current) {
          setAccounts([]);
          setError(MESSAGES[err.message] || 'Bungie linking is unavailable. Try again later.');
        }
      }
    };
    read();
    window.addEventListener('focus', read);
    return () => { cancelled = true; mounted.current = false; window.removeEventListener('focus', read); };
  }, [ownerId]);

  function clearResult() {
    const next = new URLSearchParams(params); next.delete('bungieLink');
    setParams(next, { replace: true });
  }
  async function act(action, accountId) {
    if (acting.current || (action === 'connect' && onBeforeConnect && !onBeforeConnect())) return;
    acting.current = true; const id = ++revision.current;
    setBusy(true); setError('');
    try {
      const result = await requestBungieLink(action, ownerId, accountId);
      if (!mounted.current || id !== revision.current) return;
      if (action === 'connect') { window.location.assign(bungieAuthorizationUrl(result.authorizationUrl)); return; }
      clearResult(); setConfirmId(null);
      if (action === 'unlink') setAccounts((current) => current.filter((account) => account.id !== accountId));
      const status = await requestBungieLink('status', ownerId);
      if (mounted.current && id === revision.current) setAccounts(status.accounts);
    } catch (err) {
      if (mounted.current && id === revision.current) setError(MESSAGES[err.message] || 'Could not update the Bungie connection. Please try again.');
    } finally { acting.current = false; if (mounted.current && id === revision.current) setBusy(false); }
  }
  if (!available && !pending && !failed && !requested) return null;
  return <section className="gp-steam-probe" id="gp-bungie-linked" tabIndex={-1} aria-label="Linked Bungie accounts">
    <div className="gp-section-heading"><h2>Bungie</h2><span className="gp-steam-status"><LockKeyhole size={14} />Private connection</span></div>
    {(pending || failed) && <div className="gp-feedback" role="status">
      {pending ? <><span>Bungie verified your identity. Save this connection to your Passport?</span><button className="gp-button" disabled={busy} onClick={() => act('complete')}><Check size={16} />Confirm Bungie link</button></>
        : <><span>Bungie sign-in could not be completed.</span><button className="gp-button" onClick={clearResult}>Dismiss</button></>}
    </div>}
    {accounts.map((account) => <article key={account.id}>
      <div className="gp-steam-identity">
        <GameLogo game="Bungie" className="gp-steam-brand" />
        <div className="gp-steam-player"><BungieImage src={account.avatarUrl} className="gp-steam-avatar" />
          <div><h3>{account.bungieName}</h3><p className="gp-steam-verified"><ShieldCheck size={14} />Identity verified with Bungie</p><p className="gp-steam-id">{account.accountId}</p></div>
        </div>
        <dl className="gp-steam-facts"><div><dt>Destiny accounts</dt><dd>{account.destinyMemberships.length}</dd></div></dl>
        <div className="gp-steam-actions">
          <a className="gp-icon-button" href={account.profileUrl} target="_blank" rel="noopener noreferrer" title="Open Bungie profile" aria-label="Open Bungie profile"><ExternalLink size={17} /></a>
          <button className="gp-icon-button" disabled={busy || pending} onClick={() => act('connect')} title="Verify Bungie identity again" aria-label="Verify Bungie identity again"><RefreshCw size={17} /></button>
          <button className="gp-icon-button" disabled={busy} onClick={() => setConfirmId(account.id)} title="Unlink Bungie account" aria-label="Unlink Bungie account"><Unplug size={17} /></button>
        </div>
      </div>
      {account.destinyMemberships.length ? <ul className="gp-bungie-memberships">
        {account.destinyMemberships.map((membership) => <li key={membership.platform + ':' + membership.accountId}>
          <strong>{membership.displayName || 'Destiny account'}</strong>
          <span>{({ 1: 'Xbox', 2: 'PlayStation', 3: 'Steam', 4: 'Battle.net', 5: 'Stadia', 6: 'Epic Games' })[membership.platform] || 'Platform ' + membership.platform}</span>
        </li>)}
      </ul> : <p className="gp-steam-empty">No Destiny accounts returned by Bungie.</p>}
      <p className="gp-steam-notice">Linked privately. Identity verified {new Date(account.verifiedAt).toLocaleDateString('en')}.</p>
      <p className="gp-steam-notice"><a href="https://www.bungie.net/en/Profile/Settings?category=Applications" target="_blank" rel="noopener noreferrer">Manage Bungie permissions</a></p>
      {confirmId === account.id && <div className="gp-feedback" role="group" aria-label="Confirm Bungie unlink">
        <span>Unlink {account.displayName} and remove its saved Bungie details?</span>
        <button className="gp-button" disabled={busy} onClick={() => act('unlink', account.id)}>Unlink</button>
        <button className="gp-button" disabled={busy} onClick={() => setConfirmId(null)}>Cancel</button>
      </div>}
    </article>)}
    {!pending && available && <button className="gp-button" disabled={busy} onClick={() => act('connect')}><Link2 size={16} />{busy ? 'Connecting...' : accounts.length ? 'Link another Bungie account' : 'Link Bungie'}</button>}
    {!available && !pending && !error && <p role="status">Bungie linking is currently unavailable.</p>}
    {error && <p className="gp-feedback gp-error" role="alert">{error}</p>}
  </section>;
}
