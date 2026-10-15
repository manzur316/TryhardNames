import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, LoaderCircle, LockKeyhole, RefreshCw } from 'lucide-react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { OSU_PRIVATE_AUTHORIZE_URL, requestOsuPersistence } from '../data/privateOsuPersistence.js';
import PrivateOsuAccountCard from './PrivateOsuAccountCard.jsx';
import { buildPrivateGameHighlights } from '../data/privateGameHighlights.js';
import './privateOsuProbe.css';

export default function PersistentOsuConnections({ auth, passportReady, onHighlightsChange }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const mounted = useRef(false);
  const ownerId = auth.user?.id;

  useEffect(() => {
    onHighlightsChange?.(ownerId && passportReady && auth.isConfigured ? buildPrivateGameHighlights(connections) : []);
  }, [connections, ownerId, passportReady, auth.isConfigured, onHighlightsChange]);

  async function request(action, accountId) {
    let session;
    try {
      const { client } = await getSupabaseRuntime();
      if (!client) throw new Error('unavailable');
      const { data, error: sessionError } = await client.auth.getSession();
      if (sessionError || data?.session?.user?.id !== ownerId) throw new Error('unavailable');
      session = data.session;
    } catch { throw new Error('Sign in again to continue.'); }
    return requestOsuPersistence(action, session, accountId);
  }

  useEffect(() => {
    mounted.current = true;
    if (!ownerId || !passportReady || !auth.isConfigured) return () => { mounted.current = false; };
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const status = await request('status');
        if (cancelled) return;
        setConfigured(status.configured === true);
        if (status.status === 'error') setError('osu! authorization was not completed. Connect again from this account.');
        if (status.status === 'awaiting_owner') {
          await request('complete');
          if (cancelled) return;
          const saved = await request('status');
          if (!cancelled) { setConnections(saved.connections); setMessage('osu! linked to your private Passport.'); }
        } else setConnections(status.connections);
      } catch (failure) { if (!cancelled) setError(failure.message); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; mounted.current = false; };
    // Token refresh must not restart the linking command. Each request obtains the current session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, passportReady, auth.isConfigured]);

  async function connect() {
    setBusy(true); setError(''); setMessage('');
    try { await request('connect'); window.location.assign(OSU_PRIVATE_AUTHORIZE_URL); }
    catch (failure) { if (mounted.current) setError(failure.message); }
    finally { if (mounted.current) setBusy(false); }
  }
  async function unlink(id) {
    setBusy(true); setError(''); setMessage('');
    try {
      await request('connection', id);
      const next = await request('status');
      if (mounted.current) { setConnections(next.connections); setMessage('osu! unlinked. Its proofs are revoked.'); }
    } catch (failure) { if (mounted.current) setError(failure.message); }
    finally { if (mounted.current) setBusy(false); }
  }

  const connectionLabel = !ownerId ? 'Sign in to link osu!'
    : busy ? 'Please wait...' : loading ? 'Loading osu!...'
      : connections.length ? 'Authorize osu! again' : 'Connect osu!';
  const connectionContent = <>
    <span className="gp-osu-connect-logo" aria-hidden="true"><img src="/passport/osu-logo.png" alt="" width="64" height="64" /></span>
    <span className="gp-osu-connect-label">{connectionLabel}</span>
    {busy || loading ? <LoaderCircle className="gp-osu-connect-icon gp-osu-connect-spinner" size={20} aria-hidden="true" />
      : connections.length ? <RefreshCw className="gp-osu-connect-icon" size={20} aria-hidden="true" />
        : <ArrowUpRight className="gp-osu-connect-icon" size={22} aria-hidden="true" />}
  </>;

  return <section className="gp-osu-probe" aria-label="Private osu! accounts">
    <div className="gp-section-heading"><h2>My games</h2><span className="gp-osu-private"><LockKeyhole size={14} />Private / Not published</span></div>
    {loading && <p role="status">Loading your saved connections...</p>}
    {connections.map((profile) => <PrivateOsuAccountCard key={profile.id} profile={profile} busy={busy} onUnlink={unlink} />)}
    <div className="gp-osu-connection-action">
      {!ownerId ? <Link className="gp-osu-connect-button" to="/sign-in?returnTo=%2Fgaming-passport">{connectionContent}</Link>
        : <button className="gp-osu-connect-button" type="button" aria-busy={busy || loading} disabled={busy || loading || !passportReady || !configured} onClick={connect}>{connectionContent}</button>}
    </div>
    {message && <p role="status" className="gp-feedback">{message}</p>}
    {error && <p role="alert" className="gp-feedback gp-error">{error}</p>}
  </section>;
}
