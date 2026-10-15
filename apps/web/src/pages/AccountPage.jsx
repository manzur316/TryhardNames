import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Check, Copy, Gamepad2, LockKeyhole, LogOut, RefreshCw, Star, Trash2, UserRound } from 'lucide-react';
import { FavoritesContext } from '@/contexts/FavoritesContext.jsx';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import SeoHead from '@/seo/SeoHead.jsx';
import { getOrCreatePrivateDraft } from '@/gaming-passport/data/passportRepository.js';
import { getAccountPassportSummary } from '@/gaming-passport/data/accountSummary.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import AuthUnavailable from './auth/AuthUnavailable.jsx';
import '@/gaming-passport/passport.css';

export default function AccountPage() {
  const auth = useAuth();
  const seo = <SeoHead title="Account | TryhardNames" description="Manage your private TryhardNames account, saved names, and Gaming Passport draft." path="/account" noIndex skipCanonical />;
  if (auth.isLoading) return <>{seo}<div className="gp-account" role="status">Loading your account...</div></>;
  if (!auth.isConfigured) return <>{seo}<AuthUnavailable /></>;
  if (!auth.session || !auth.user?.id) return <Navigate to="/sign-in?returnTo=%2Faccount" replace />;
  return <>{seo}<AccountWorkspace key={auth.user.id} auth={auth} /></>;
}

function AccountWorkspace({ auth }) {
  const favoritesContext = useContext(FavoritesContext);
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [copiedName, setCopiedName] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [favoriteError, setFavoriteError] = useState('');
  const mounted = useRef(false);
  const sessionRef = useRef(auth.session);
  sessionRef.current = auth.session;
  const ownerId = auth.user.id;
  const savedNames = useMemo(() => [...new Set((favoritesContext?.favorites || []).map((item) => item?.name).filter(Boolean))], [favoritesContext?.favorites]);
  const summary = getAccountPassportSummary(passport);
  const storageMode = favoritesContext?.storageMode || 'local';

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    (async () => {
      try {
        const { client } = await getSupabaseRuntime();
        const draft = await getOrCreatePrivateDraft(client, sessionRef.current);
        if (!cancelled) setPassport(draft);
      } catch {
        if (!cancelled) setLoadError('Could not load your Passport. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ownerId, auth.isConfigured, retry]);

  async function signOut() {
    setSigningOut(true);
    setSessionError('');
    try {
      const result = await auth.signOut();
      if (!result?.ok && mounted.current) setSessionError('Could not sign out. Your session is still active. Please try again.');
    } catch {
      if (mounted.current) setSessionError('Could not sign out. Please try again.');
    } finally {
      if (mounted.current) setSigningOut(false);
    }
  }

  async function copySavedName(name) {
    setFavoriteError('');
    try {
      const result = await copyTextToClipboard(name, { preventRepeatMs: 320 });
      if (!result.ok) throw new Error('copy_failed');
      if (mounted.current) { setCopiedName(name); setFavoriteMessage('Name copied.'); }
    } catch {
      if (mounted.current) setFavoriteError('Could not copy the name.');
    }
  }

  async function removeSavedName(name) {
    setPendingName(name);
    setFavoriteError('');
    setFavoriteMessage('');
    try {
      if (!favoritesContext?.removeFavorite) throw new Error('unavailable');
      await favoritesContext.removeFavorite(name);
    } catch {
      if (mounted.current) setFavoriteError('Could not remove the name.');
    } finally {
      if (mounted.current) setPendingName('');
    }
  }

  return <div className="gp-account">
    <header className="gp-account-header">
      <div><p className="gp-account-eyebrow"><LockKeyhole size={14} />Private account</p><h1>Your account</h1></div>
      <Link className="gp-button" to="/gaming-passport"><Gamepad2 size={17} />Open Gaming Passport<ArrowRight size={16} /></Link>
    </header>

    <section className="gp-account-section gp-account-passport" aria-labelledby="account-passport-title">
      <div className="gp-account-passport-content">
        <h2 id="account-passport-title">Gaming Passport</h2>
        {loading ? <p role="status">Loading your Passport...</p> : loadError ? <div role="alert" className="gp-feedback gp-error">{loadError}<button className="gp-icon-button" onClick={() => setRetry((value) => value + 1)} aria-label="Retry loading Passport" title="Retry loading Passport"><RefreshCw size={17} /></button></div>
          : summary && <><p className="gp-account-alias">{summary.alias}</p><p className="gp-account-state">{summary.status}</p>{summary.updatedAt && <p className="gp-account-meta">Last saved <time dateTime={summary.updatedAt}>{new Date(summary.updatedAt).toLocaleString()}</time></p>}</>}
      </div>
      <img className="gp-account-scene" src="/passport/passport-citadel.webp" alt="" width="2160" height="720" />
    </section>

    <section className="gp-account-section" aria-labelledby="account-session-title">
      <div className="gp-account-section-title"><UserRound size={19} /><h2 id="account-session-title">Sign-in & session</h2></div>
      <div className="gp-account-session-row">
        <dl><div><dt>Sign-in email</dt><dd>{auth.user.email || 'Not available'}</dd></div><div><dt>Session</dt><dd><span className="gp-status-dot" />Active</dd></div></dl>
        <button className="gp-button" onClick={signOut} disabled={signingOut}><LogOut size={16} />{signingOut ? 'Signing out...' : 'Sign out'}</button>
      </div>
      {sessionError && <p role="alert" className="gp-feedback gp-error">{sessionError}</p>}
    </section>

    <details className="gp-account-section gp-account-favorites">
      <summary><Star size={19} /><span>Saved Names</span><span className="gp-account-count">{savedNames.length}</span></summary>
      <p className="gp-account-meta">{storageMode === 'account' ? 'Synced to this account.' : 'Saved locally on this device.'}</p>
      {favoritesContext?.syncError && <p className="gp-account-sync" role="status">Account sync unavailable. Your local names are still available.</p>}
      {favoritesContext?.isLoading ? <p role="status">Loading saved names...</p> : savedNames.length === 0 ? <p className="gp-account-empty">No saved names yet.</p> : <ul className="gp-account-names">{savedNames.map((name) => <li key={name}>
        <span className="gp-account-name">{name}</span>
        <button className="gp-icon-button" onClick={() => copySavedName(name)} title={'Copy ' + name} aria-label={'Copy ' + name}>{copiedName === name ? <Check size={16} /> : <Copy size={16} />}</button>
        <button className="gp-icon-button" onClick={() => removeSavedName(name)} disabled={Boolean(pendingName)} title={'Remove ' + name} aria-label={'Remove ' + name}><Trash2 size={16} /></button>
      </li>)}</ul>}
      {favoriteMessage && <p role="status" className="gp-account-meta">{favoriteMessage}</p>}
      {favoriteError && <p role="alert" className="gp-feedback gp-error">{favoriteError}</p>}
    </details>
  </div>;
}
