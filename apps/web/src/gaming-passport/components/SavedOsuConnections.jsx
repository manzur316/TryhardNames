import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link2, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { getSavedOsuConnections } from '../data/savedOsuConnections.js';
import { buildPrivateGameHighlights } from '../data/privateGameHighlights.js';
import PrivateOsuAccountCard from './PrivateOsuAccountCard.jsx';
import { OSU_LINK_BASE, osuAuthorizationUrl, requestOsuLink } from '../data/osuLinking.js';
import './privateOsuProbe.css';

export default function SavedOsuConnections({ ownerId, passportId, onHighlightsChange }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [params, setParams] = useSearchParams();
  const callback = params.get('osuLink');
  const mutation = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    fetch(OSU_LINK_BASE + '/availability', { cache: 'no-store', signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (!controller.signal.aborted) setEnabled(result?.enabled === true); })
      .catch(() => {});
    return () => { mounted.current = false; controller.abort(); };
  }, []);

  function clearCallback() {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('osuLink');
      return next;
    }, { replace: true });
  }

  async function act(action, accountId) {
    if (mutation.current) return;
    mutation.current = true;
    setBusy(true);
    setActionError('');
    try {
      const result = await requestOsuLink(action, ownerId, accountId);
      if (!mounted.current) return;
      if (action === 'connect') {
        window.location.assign(osuAuthorizationUrl(result.authorizationUrl));
        return;
      }
      clearCallback();
      if (action === 'unlink') {
        setConnections((current) => current.filter((profile) => profile.id !== accountId));
        onHighlightsChange([]);
      }
      setRetry((value) => value + 1);
    } catch (failure) {
      if (!mounted.current) return;
      const messages = {
        sign_in_required: 'Sign in again before linking osu!.',
        account_already_linked: 'This osu! account is already linked to another Passport.',
        rate_limited: 'Wait a minute before starting another authorization.',
        invalid_attempt: 'This authorization expired or belongs to another session. Connect again.',
      };
      setActionError(messages[failure.message] || 'Could not finish the osu! request. Please try again.');
      if (failure.message === 'invalid_attempt') clearCallback();
    } finally {
      mutation.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  useEffect(() => {
    if (busy) return;
    let active = true;
    let controller;
    let version = 0;
    async function load() {
      if (mutation.current) return;
      const requestVersion = ++version;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setLoading(true);
      setError(false);
      try {
        const { client } = await getSupabaseRuntime();
        if (!active || mutation.current || requestVersion !== version) return;
        if (!client) throw new Error('unavailable');
        const { data, error: sessionError } = await client.auth.getSession();
        if (!active || mutation.current || requestVersion !== version) return;
        if (sessionError || data?.session?.user?.id !== ownerId) throw new Error('sign_in_required');
        const saved = await getSavedOsuConnections(client, data.session, passportId, signal);
        if (!active || mutation.current || requestVersion !== version) return;
        setConnections(saved);
        onHighlightsChange(buildPrivateGameHighlights(saved));
      } catch {
        if (!active || mutation.current || requestVersion !== version) return;
        setConnections([]);
        onHighlightsChange([]);
        setError(true);
      } finally {
        if (active && requestVersion === version) setLoading(false);
      }
    }
    load();
    window.addEventListener('focus', load);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener('focus', load);
      onHighlightsChange([]);
    };
  }, [ownerId, passportId, onHighlightsChange, retry, busy]);

  if (!enabled && !callback && !loading && !error && !connections.length) return null;
  return <section id="gp-osu-linked" className="gp-osu-probe" aria-label="Saved osu! accounts">
    <div className="gp-section-heading"><h2>osu!</h2><span className="gp-osu-private"><LockKeyhole size={14} />Private / Not published</span></div>
    {enabled && <div className="gp-osu-probe-actions">
      {callback === 'ready' ? <>
        <button className="gp-button" type="button" disabled={busy} onClick={() => act('complete')}><ShieldCheck size={15} />Confirm osu! link</button>
        <button className="gp-button" type="button" disabled={busy} onClick={() => act('cancel')}>Cancel</button>
      </> : <button className="gp-button" type="button" disabled={busy} onClick={() => act('connect')}><Link2 size={15} />{connections.length ? 'Update osu! connection' : 'Link osu!'}</button>}
    </div>}
    {callback === 'failed' && <p role="alert">osu! authorization could not be completed. Connect again.</p>}
    {busy && <p role="status">Processing osu! connection...</p>}
    {actionError && <p className="gp-feedback gp-error" role="alert">{actionError}</p>}
    {loading && <p role="status">Loading your saved osu! accounts...</p>}
    {connections.map((profile) => <PrivateOsuAccountCard key={profile.id} profile={profile} busy={busy} onUnlink={enabled ? (id) => act('unlink', id) : undefined} />)}
    {error && <div role="alert" className="gp-feedback gp-error">Could not load your saved osu! accounts.
      <button className="gp-button" type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15} />Retry</button>
    </div>}
  </section>;
}
