import React, { useEffect, useState } from 'react';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { getPublicPassportBySlug } from '../data/publicPassportRepository.js';
import PublicPassportProfile from './PublicPassportProfile.jsx';

export default function PublishedPassportPreview({ slug, updatedAt, dirty }) {
  const [state, setState] = useState({ status: 'loading', passport: null });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let revision = 0;
    async function refresh() {
      const current = ++revision;
      try {
        const { client } = await getSupabaseRuntime();
        const passport = await getPublicPassportBySlug(client, slug);
        if (!cancelled && current === revision) setState({ status: passport?.schemaVersion === 2 ? 'ready' : 'unavailable', passport });
      } catch {
        if (!cancelled && current === revision) setState({ status: 'error', passport: null });
      }
    }
    setState({ status: 'loading', passport: null });
    refresh();
    const onFocus = () => { if (!document.hidden) refresh(); };
    const interval = window.setInterval(onFocus, 30000);
    window.addEventListener('focus', onFocus);
    return () => { cancelled = true; window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [slug, updatedAt, retry]);
  return <div className="gp-public-preview">
    <div className="gp-public-preview-note"><strong>Public preview</strong><span>{dirty ? 'Save your edits to update the published profile.' : 'Saved profile and publicly selected accounts'}</span>
      <a href={`/id/${encodeURIComponent(slug)}`} target="_blank" rel="noopener noreferrer">Open public profile</a></div>
    {state.status === 'loading' && <p role="status">Loading public profile...</p>}
    {state.status === 'ready' && <PublicPassportProfile passport={state.passport} />}
    {['error', 'unavailable'].includes(state.status) && <div role="status"><p>{state.status === 'error' ? 'Could not load the public preview.' : 'This profile is not currently public.'}</p>
      <button className="gp-button" onClick={() => setRetry(value => value + 1)}>Retry</button></div>}
  </div>;
}
