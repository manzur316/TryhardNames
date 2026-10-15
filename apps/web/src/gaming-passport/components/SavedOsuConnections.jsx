import React, { useEffect, useState } from 'react';
import { LockKeyhole, RefreshCw } from 'lucide-react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { getSavedOsuConnections } from '../data/savedOsuConnections.js';
import { buildPrivateGameHighlights } from '../data/privateGameHighlights.js';
import PrivateOsuAccountCard from './PrivateOsuAccountCard.jsx';
import './privateOsuProbe.css';

export default function SavedOsuConnections({ ownerId, passportId, onHighlightsChange }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    let controller;
    let version = 0;
    async function load() {
      const requestVersion = ++version;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setLoading(true);
      setError(false);
      try {
        const { client } = await getSupabaseRuntime();
        if (!active || requestVersion !== version) return;
        if (!client) throw new Error('unavailable');
        const { data, error: sessionError } = await client.auth.getSession();
        if (!active || requestVersion !== version) return;
        if (sessionError || data?.session?.user?.id !== ownerId) throw new Error('sign_in_required');
        const saved = await getSavedOsuConnections(client, data.session, passportId, signal);
        if (!active || requestVersion !== version) return;
        setConnections(saved);
        onHighlightsChange(buildPrivateGameHighlights(saved));
      } catch {
        if (!active || requestVersion !== version) return;
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
  }, [ownerId, passportId, onHighlightsChange, retry]);

  if (!loading && !error && !connections.length) return null;
  return <section className="gp-osu-probe" aria-label="Saved osu! accounts">
    <div className="gp-section-heading"><h2>osu!</h2><span className="gp-osu-private"><LockKeyhole size={14} />Private / Not published</span></div>
    {loading && <p role="status">Loading your saved osu! accounts...</p>}
    {connections.map((profile) => <PrivateOsuAccountCard key={profile.id} profile={profile} />)}
    {error && <div role="alert" className="gp-feedback gp-error">Could not load your saved osu! accounts.
      <button className="gp-button" type="button" onClick={() => setRetry((value) => value + 1)}><RefreshCw size={15} />Retry</button>
    </div>}
  </section>;
}
