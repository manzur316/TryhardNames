import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ExternalLink, Gamepad2, Link2, LockKeyhole, ShieldCheck, Unplug } from 'lucide-react';
import GameLogo from './GameLogo.jsx';
import { ROBLOX_LINK_BASE, requestRobloxLink, robloxAuthorizationUrl, robloxHighlight } from '../data/robloxLinking.js';
import './privateRobloxProbe.css';

const MESSAGES = {
  account_already_linked: 'This Roblox account is already linked to another Passport.',
  rate_limited: 'Wait one minute before starting another authorization.',
  sign_in_required: 'Sign in again, then restart the Roblox connection.',
  invalid_attempt: 'This connection expired or belongs to another session. Start again.',
  private_passport_required: 'Roblox testing currently requires a private Passport.',
};
export default function PersistentRobloxConnections({ ownerId, onHighlightsChange, onAvailabilityChange }) {
  const [params, setParams] = useSearchParams();
  const [available, setAvailable] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [brokenAvatars, setBrokenAvatars] = useState([]);
  const mounted = useRef(false);
  const acting = useRef(false);
  const revision = useRef(0);
  const pending = params.get('robloxLink') === 'ready';
  const failed = params.get('robloxLink') === 'failed';

  useEffect(() => {
    onHighlightsChange(accounts.map(robloxHighlight));
  }, [accounts, onHighlightsChange]);
  useEffect(() => () => { onHighlightsChange([]); onAvailabilityChange(false); }, [onHighlightsChange, onAvailabilityChange]);
  useEffect(() => {
    mounted.current = true;
    const read = async () => {
      if (acting.current) return;
      const id = ++revision.current;
      try {
        const response = await fetch(ROBLOX_LINK_BASE + '/availability', { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
        if (!response.ok || !(await response.json()).enabled) {
          if (mounted.current && id === revision.current) {
            setAvailable(false); onAvailabilityChange(false); setAccounts([]);
          }
          return;
        }
        const result = await requestRobloxLink('status', ownerId);
        if (mounted.current && id === revision.current) {
          setAvailable(true); onAvailabilityChange(true); setAccounts(result.accounts);
        }
      } catch (err) {
        if (mounted.current && id === revision.current) {
          setAccounts([]);
          if (err.message === 'tester_required') { setAvailable(false); onAvailabilityChange(false); }
          if (err.message !== 'tester_required') setError(MESSAGES[err.message] || 'Roblox connection unavailable. Try again later.');
        }
      }
    };
    read();
    window.addEventListener('focus', read);
    return () => { mounted.current = false; ++revision.current; window.removeEventListener('focus', read); };
  }, [ownerId, onAvailabilityChange]);

  function clearResult() {
    const next = new URLSearchParams(params);
    next.delete('robloxLink');
    setParams(next, { replace: true });
  }
  async function act(action, accountId) {
    if (acting.current) return;
    acting.current = true;
    const id = ++revision.current;
    setBusy(true); setError('');
    try {
      const result = await requestRobloxLink(action, ownerId, accountId);
      if (!mounted.current || id !== revision.current) return;
      if (action === 'connect') { window.location.assign(robloxAuthorizationUrl(result.authorizationUrl)); return; }
      clearResult();
      setConfirmId(null);
      const status = await requestRobloxLink('status', ownerId);
      if (mounted.current && id === revision.current) setAccounts(status.accounts);
    } catch (err) {
      if (mounted.current && id === revision.current) setError(MESSAGES[err.message] || 'Could not update the Roblox connection. Please try again.');
    } finally { acting.current = false; if (mounted.current) setBusy(false); }
  }
  if (!available && !pending && !failed) return null;
  return <section className="gp-roblox-probe" id="gp-roblox-linked" tabIndex={-1} aria-label="Linked Roblox accounts">
    <div className="gp-section-heading"><h2>Roblox</h2><span className="gp-roblox-private"><LockKeyhole size={14} />Private connection</span></div>
    {(pending || failed) && <div className="gp-feedback" role="status">
      {pending ? <><span>Authorization received. Confirm the link to this Passport.</span><button className="gp-button" disabled={busy} onClick={() => act('complete')}><Check size={16} />Confirm link</button></>
        : <><span>Roblox authorization could not be completed.</span><button className="gp-button" onClick={clearResult}>Dismiss</button></>}
    </div>}
    {accounts.map((account) => <article className="gp-roblox-account" key={account.id}>
      <GameLogo game="Roblox" className="gp-roblox-emblem" />
      <div className="gp-roblox-player"><span className="gp-roblox-game">Roblox</span>
        <div className="gp-roblox-player-row"><div className="gp-roblox-avatar">
          {account.avatarUrl && !brokenAvatars.includes(account.avatarUrl)
            ? <img src={account.avatarUrl} alt="" width="64" height="64" referrerPolicy="no-referrer" onError={() => setBrokenAvatars((items) => [...items, account.avatarUrl])} />
            : <Gamepad2 size={30} />}
        </div><div className="gp-roblox-identity"><h3>{account.displayName}</h3><p>@{account.username}</p>
          <p className="gp-roblox-verified"><ShieldCheck size={14} />Ownership verified</p></div></div>
      </div>
      <dl className="gp-roblox-facts"><div><dt>Player ID</dt><dd>{account.accountId}</dd></div>
        {account.createdAt && <div><dt>Member since</dt><dd>{new Date(account.createdAt).toLocaleDateString('en', { year: 'numeric', month: 'short', timeZone: 'UTC' })}</dd></div>}
      </dl>
      <div className="gp-roblox-actions">
        <a className="gp-icon-button" href={account.profileUrl} target="_blank" rel="noopener noreferrer" title="Open Roblox profile" aria-label="Open Roblox profile"><ExternalLink size={17} /></a>
        <button className="gp-icon-button" disabled={busy} onClick={() => setConfirmId(account.id)} title="Unlink Roblox account" aria-label="Unlink Roblox account"><Unplug size={17} /></button>
      </div>
      <p className="gp-roblox-notice"><LockKeyhole size={13} />Linked privately. Identity verified {new Date(account.verifiedAt).toLocaleDateString('en')}. No ongoing Roblox access.</p>
      {confirmId === account.id && <div className="gp-roblox-notice gp-roblox-confirm" role="group" aria-label="Confirm unlink">
        <span>Unlink @{account.username}?</span><button className="gp-button" disabled={busy} onClick={() => act('unlink', account.id)}>Unlink</button>
        <button className="gp-button" disabled={busy} onClick={() => setConfirmId(null)}>Cancel</button>
      </div>}
    </article>)}
    {!pending && available && <button className="gp-button" disabled={busy} onClick={() => act('connect')}><Link2 size={16} />{busy ? 'Connecting...' : accounts.length ? 'Link another Roblox account' : 'Link Roblox'}</button>}
    {error && <p className="gp-feedback gp-error" role="alert">{error}</p>}
  </section>;
}
