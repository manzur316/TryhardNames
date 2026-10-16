import React, { useEffect, useRef, useState } from 'react';
import { Copy, ExternalLink, Globe2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { isCanonicalPublicSlug, normalizePublicSlug } from '../domain/contracts.js';
import { managePassportPublication, publicationError } from '../data/passportPublication.js';
import GameLogo from './GameLogo.jsx';
import './publication.css';

export default function PassportVisibilityControls({ passport, session, dirty, disabled, onPassportChange }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [slug, setSlug] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [retry, setRetry] = useState(0);
  const sessionRef = useRef(session);
  const generation = useRef(0);
  sessionRef.current = session;
  const published = passport.status === 'published';
  const canonical = normalizePublicSlug(slug);
  const publicUrl = new URL(`/id/${encodeURIComponent(passport.slug || canonical)}`, window.location.origin).href;

  useEffect(() => {
    const version = ++generation.current;
    if (!open) return;
    setState(null); setConsent(false); setError(''); setMessage(''); setBusy(true);
    (async () => {
      try {
        const { client } = await getSupabaseRuntime();
        const result = await managePassportPublication(client, sessionRef.current, passport.id);
        if (version !== generation.current) return;
        setState(result); setAccounts(result.accounts);
        setSlug(result.passport.slug || normalizePublicSlug(result.passport.alias).slice(0, 32));
      } catch (err) {
        if (version === generation.current) setError(publicationError(err));
      } finally {
        if (version === generation.current) setBusy(false);
      }
    })();
    return () => { generation.current++; };
  }, [open, passport.id, retry]);

  async function submit(action) {
    if (busy || !state) return;
    const version = generation.current;
    setBusy(true); setError(''); setMessage('');
    try {
      const { client } = await getSupabaseRuntime();
      const result = await managePassportPublication(client, sessionRef.current, passport.id, {
        action, slug, accounts, consent, updatedAt: passport.updatedAt,
      });
      if (version !== generation.current) return;
      setState(result); setAccounts(result.accounts); setConsent(false);
      onPassportChange(result.passport);
      setMessage(action === 'unpublish' ? 'Your Passport is private. Its public link is no longer available.' : 'Your Passport is public. You can share its link.');
    } catch (err) {
      if (version === generation.current) setError(publicationError(err));
    } finally {
      if (version === generation.current) setBusy(false);
    }
  }

  function updateAccount(id, patch) {
    setConsent(false);
    setAccounts((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }
  const changedElsewhere = state && state.passport.updatedAt !== passport.updatedAt;
  return <Dialog open={open} onOpenChange={(next) => { if (!busy) setOpen(next); }}>
    <DialogTrigger asChild><button className="gp-button" disabled={disabled}>
      {published ? <Globe2 size={16} /> : <LockKeyhole size={16} />}{published ? 'Public profile' : 'Make public'}
    </button></DialogTrigger>
    <DialogContent className="gp-publication-dialog">
      <DialogTitle className="gp-publication-title">{published ? 'Public profile' : 'Publish your Passport'}</DialogTitle>
      <DialogDescription>Anyone with the link can see your saved alias, bio, avatar, appearance and the game details you choose below.</DialogDescription>
      {busy && !state && <p role="status">Loading publication settings...</p>}
      {state && <>
        <label className="gp-publication-label" htmlFor="gp-public-slug">Public address</label>
        <div className="gp-publication-address"><span>/id/</span><input id="gp-public-slug" value={slug} maxLength={32}
          disabled={busy || Boolean(state.passport.slug)} onChange={(event) => { setSlug(event.target.value); setConsent(false); }} /></div>
        {!isCanonicalPublicSlug(canonical) && <p className="gp-field-error">Use 2-32 letters, numbers or hyphens. This address is not valid.</p>}
        <fieldset disabled={busy} className="gp-publication-accounts"><legend>Visible game accounts</legend>
          {accounts.length === 0 && <p>Link and verify a game account before publishing.</p>}
          {accounts.map((account) => <div className="gp-publication-account" key={account.id}>
            <GameLogo game={account.provider === 'osu' ? 'osu!' : 'Roblox'} />
            <div><label><input type="checkbox" checked={account.selected} onChange={(event) => updateAccount(account.id, { selected: event.target.checked })} />
              <span>{account.provider === 'osu' ? 'osu!' : 'Roblox'} <strong>{account.username}</strong></span></label>
              {account.provider === 'osu' && <label className="gp-publication-stats"><input type="checkbox" disabled={!account.selected} checked={account.selected && account.showStats}
                onChange={(event) => updateAccount(account.id, { showStats: event.target.checked })} />Show PP, ranks, accuracy and medals</label>}
            </div>
          </div>)}
        </fieldset>
        <label className="gp-publication-consent"><input type="checkbox" checked={consent} disabled={busy}
          onChange={(event) => setConsent(event.target.checked)} /><span>I agree to publish my saved profile and these selected game details. I can make it private again.</span></label>
        {dirty && <p role="status">Save or discard your edits before publishing.</p>}
        {changedElsewhere && <p role="alert">Your saved Passport changed. Reload this page before publishing.</p>}
        {published && <div className="gp-publication-share">
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}<ExternalLink size={15} /></a>
          <button className="gp-icon-button" title="Copy public link" aria-label="Copy public link" onClick={async () => {
            const result = await copyTextToClipboard(publicUrl);
            setMessage(result.ok ? 'Public link copied.' : 'Could not copy. Select the link above.');
          }}><Copy size={16} /></button>
        </div>}
        <div className="gp-publication-actions">
          {published && <button className="gp-button" disabled={busy} onClick={() => submit('unpublish')}><LockKeyhole size={16} />Make private</button>}
          <button className="gp-button gp-primary" disabled={busy || disabled || dirty || changedElsewhere || !consent || !accounts.length || !isCanonicalPublicSlug(canonical) || passport.status === 'suspended'}
            onClick={() => submit('publish')}><ShieldCheck size={16} />{busy ? 'Saving...' : published ? 'Update public profile' : 'Publish profile'}</button>
        </div>
      </>}
      {error && <div role="alert" className="gp-feedback gp-error">{error}<button className="gp-button" disabled={busy} onClick={() => setRetry((value) => value + 1)}>Retry</button></div>}
      {message && <p role="status" className="gp-feedback">{message}</p>}
    </DialogContent>
  </Dialog>;
}
