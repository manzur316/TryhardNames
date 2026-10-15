import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Download, Eye, Gamepad2, LockKeyhole, Palette, Pencil, RotateCcw, Save, UserRound } from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import { exportNodeToPng, downloadDataUrl } from '@/utils/imageExport.js';
import { getOrCreatePrivateDraft, mapPassportToPresentationForm, updatePassportPresentation, validatePresentationInput } from '../data/passportRepository.js';
import { getBrowserDraftStorage, readWorkspaceDraft, removeLegacyPresentationParams, saveWorkspaceDraft } from '../data/workspaceDraft.js';
import PassportIdentityScene from './PassportIdentityScene.jsx';
import AvatarFramePicker from './AvatarFramePicker.jsx';
import BackgroundPicker from './BackgroundPicker.jsx';
import PersistentRobloxConnections from './PersistentRobloxConnections.jsx';
import PersistentSteamConnections from './PersistentSteamConnections.jsx';
import { isSteamLinkingEnabled } from '../data/steamLinking.js';
import SavedOsuConnections from './SavedOsuConnections.jsx';
import PassportVisibilityControls from './PassportVisibilityControls.jsx';
import { isPrivateOsuProbeEnabled } from '../data/privateOsuProbe.js';
import { isPrivateOsuPersistenceEnabled } from '../data/privateOsuPersistence.js';
import { isPrivateRobloxProbeEnabled } from '../data/privateRobloxProbe.js';
import '../passport.css';

const PrivateOsuProbe = import.meta.env.DEV ? lazy(() => import('./PrivateOsuProbe.jsx')) : null;
const PersistentOsuConnections = import.meta.env.DEV ? lazy(() => import('./PersistentOsuConnections.jsx')) : null;
const PrivateRobloxProbe = import.meta.env.DEV ? lazy(() => import('./PrivateRobloxProbe.jsx')) : null;

export default function PassportWorkspace() {
  const auth = useAuth();
  // Changing owner remounts the workspace; a refreshed session does not.
  return <OwnerWorkspace key={auth.user?.id || 'local'} auth={auth} />;
}

function OwnerWorkspace({ auth }) {
  const [params, setParams] = useSearchParams();
  const [localDraft] = useState(() => readWorkspaceDraft(getBrowserDraftStorage(), params.toString()));
  const [form, setForm] = useState(() => auth.user ? mapPassportToPresentationForm(null) : localDraft.form);
  const [savedForm, setSavedForm] = useState(form);
  const [passport, setPassport] = useState(null);
  const [gameHighlights, setGameHighlights] = useState([]);
  const [robloxHighlight, setRobloxHighlight] = useState(null);
  const [linkedRobloxHighlights, setLinkedRobloxHighlights] = useState([]);
  const [robloxAvailable, setRobloxAvailable] = useState(false);
  const [steamAvailable, setSteamAvailable] = useState(false);
  const [linkedSteamHighlights, setLinkedSteamHighlights] = useState([]);
  const [loading, setLoading] = useState(Boolean(auth.user));
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState(localDraft.imported && !auth.user ? 'Your Identity Kit alias and bio have been recovered locally.' : '');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('edit');
  const [tab, setTab] = useState('identity');
  const [retry, setRetry] = useState(0);
  const sceneRef = useRef(null);
  const sessionRef = useRef(auth.session);
  const mounted = useRef(true);
  sessionRef.current = auth.session;
  const ownerId = auth.user?.id;
  const validation = validatePresentationInput(form);
  const busy = loading || saving || auth.isLoading;
  const showOsuProbe = isPrivateOsuProbeEnabled(import.meta.env.DEV, window.location);
  const showOsuPersistence = isPrivateOsuPersistenceEnabled(import.meta.env.DEV, window.location);
  const showRobloxProbe = isPrivateRobloxProbeEnabled(import.meta.env.DEV, window.location);
  const showSteamLinking = isSteamLinkingEnabled(import.meta.env.DEV, window.location);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const nextParams = removeLegacyPresentationParams(params);
    if (nextParams.toString() !== params.toString()) setParams(nextParams, { replace: true });
  }, [params, setParams]);

  useEffect(() => {
    if (!ownerId || !auth.isConfigured) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const { client } = await getSupabaseRuntime();
        const draft = await getOrCreatePrivateDraft(client, sessionRef.current);
        if (cancelled) return;
        const presentation = mapPassportToPresentationForm(draft);
        setPassport(draft);
        setForm(presentation);
        setSavedForm(presentation);
        setDirty(false);
      } catch {
        if (!cancelled) setError('Could not load your Passport. Your local draft has not been changed.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ownerId, auth.isConfigured, retry]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function edit(patch) {
    setForm((current) => ({ ...current, ...patch }));
    setDirty(true);
    setMessage('');
  }
  function editScene(patch) { edit({ sceneConfig: { ...form.sceneConfig, ...patch } }); }

  async function save(event) {
    event?.preventDefault();
    if (busy || !validation.ok || (ownerId && !passport)) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      let presentation;
      if (ownerId) {
        const { client } = await getSupabaseRuntime();
        const updated = await updatePassportPresentation(client, sessionRef.current, passport.id, form);
        if (!mounted.current) return;
        setPassport(updated);
        presentation = mapPassportToPresentationForm(updated);
      } else {
        presentation = saveWorkspaceDraft(getBrowserDraftStorage(), form);
      }
      if (!mounted.current) return;
      setForm(presentation);
      setSavedForm(presentation);
      setDirty(false);
      setMessage(ownerId ? 'Passport presentation saved.' : 'Draft saved on this device.');
    } catch {
      if (mounted.current) setError('Could not save. Your edits are still here; try again.');
    } finally {
      if (mounted.current) setSaving(false);
    }
  }

  async function exportPreview() {
    if (!sceneRef.current) return;
    setExporting(true);
    setError('');
    try {
      const png = await exportNodeToPng(sceneRef.current, { backgroundColor: '#111315', pixelRatio: 2,
        filter: (node) => !node.hasAttribute?.('data-private-probe') });
      downloadDataUrl(png, 'gaming-passport-private-preview.png');
      if (mounted.current) setMessage('Private preview downloaded.');
    } catch {
      if (mounted.current) setError('Could not export the preview. Try the built-in avatar or initials.');
    } finally {
      if (mounted.current) setExporting(false);
    }
  }

  return (
    <div className="gp-workspace">
      <header className="gp-workspace-header">
        <div className="gp-product-title"><Gamepad2 size={28} aria-hidden="true" /><div><h1>Gaming Passport</h1><p>Your games. Your identity.</p></div></div>
        <div className="gp-toolbar">
          {ownerId && passport && <PassportVisibilityControls passport={passport} session={auth.session} dirty={dirty} disabled={busy} onPassportChange={setPassport} />}
          <div className="gp-mode-switch" role="group" aria-label="Workspace view">
            <button aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}><Pencil size={15} />Edit</button>
            <button aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}><Eye size={15} />Preview</button>
          </div>
          <button className="gp-icon-button" title="Download private preview" aria-label="Download private preview" onClick={exportPreview} disabled={exporting || busy}><Download size={17} /></button>
          <button className="gp-button gp-primary" disabled={busy || !validation.ok || (Boolean(ownerId) && !passport)} onClick={save}><Save size={16} />{saving ? 'Saving...' : ownerId ? 'Save Passport' : 'Save draft'}</button>
        </div>
      </header>

      <div className="gp-save-status" aria-live="polite"><span className="gp-status-dot" /><span>{loading ? 'Loading your Passport...' : dirty ? 'Unsaved changes' : ownerId ? 'Account workspace' : 'Local workspace'}</span><span className="gp-status-divider" />{passport?.status === 'published' ? 'Published Passport: saved presentation changes affect your profile.' : 'Private draft / Not published'}</div>
      {message && <p role="status" className="gp-feedback"><Check size={16} />{message}</p>}
      {error && <div role="alert" className="gp-feedback gp-error">{error}{ownerId && !passport && <button className="gp-button" onClick={() => setRetry((value) => value + 1)}>Retry</button>}</div>}

      <div className="gp-identity-banner" ref={sceneRef}><PassportIdentityScene alias={form.alias} avatarUrl={form.avatarUrl} bio={form.bioShort} scene={form.sceneConfig} privatePreview localOnly={!ownerId} isPublished={passport?.status === 'published'} gameHighlights={ownerId && passport ? [...gameHighlights, ...linkedRobloxHighlights, ...linkedSteamHighlights] : []} probeHighlights={showRobloxProbe && robloxHighlight ? [robloxHighlight] : []} /></div>

      <div className={`gp-editor-layout ${mode === 'preview' ? 'gp-preview-mode' : ''}`}>
        {mode === 'edit' && <aside className="gp-inspector" aria-label="Passport editor">
          <div className="gp-inspector-tabs" role="group" aria-label="Editor sections">
            <button aria-pressed={tab === 'identity'} onClick={() => setTab('identity')}><UserRound size={16} />Identity</button>
            <button aria-pressed={tab === 'style'} onClick={() => setTab('style')}><Palette size={16} />Appearance</button>
          </div>
          <form onSubmit={save}>
            <fieldset disabled={busy || (Boolean(ownerId) && !passport)}>
              {tab === 'identity' ? <>
                <h2>Your player identity</h2>
                <label htmlFor="gp-alias">Alias <span>{form.alias.length}/64</span></label>
                <input id="gp-alias" value={form.alias} maxLength={64} placeholder="Your gaming name" onChange={(event) => edit({ alias: event.target.value })} />
                <label htmlFor="gp-bio">Bio <span>{form.bioShort.length}/200</span></label>
                <textarea id="gp-bio" value={form.bioShort} rows={3} maxLength={200} placeholder="A few words about your gaming journey" onChange={(event) => edit({ bioShort: event.target.value })} />
                <label htmlFor="gp-avatar">Avatar URL</label>
                <input id="gp-avatar" type="url" value={form.avatarUrl} maxLength={500} placeholder="https://..." onChange={(event) => edit({ avatarUrl: event.target.value })} aria-invalid={Boolean(validation.errors.avatarUrl)} aria-describedby={validation.errors.avatarUrl ? 'gp-avatar-error' : undefined} />
                {validation.errors.avatarUrl && <p id="gp-avatar-error" className="gp-field-error">{validation.errors.avatarUrl}</p>}
                <div className="gp-avatar-options">
                  <button type="button" className="gp-avatar-option" aria-label="Use Moonlit avatar" title="Use Moonlit avatar" onClick={() => edit({ avatarUrl: '', sceneConfig: { ...form.sceneConfig, themeId: 'theme.obsidian-pulse' } })}><img src="/passport/moonlit-avatar.webp" alt="" width="48" height="48" /><span>Moonlit</span></button>
                  <button type="button" className="gp-avatar-option" onClick={() => edit({ avatarUrl: '', sceneConfig: { ...form.sceneConfig, themeId: 'theme.clean-dark' } })}><UserRound size={26} /><span>Initials</span></button>
                </div>
                {ownerId && (localDraft.form.alias || localDraft.form.bioShort) && <button type="button" className="gp-text-button" onClick={() => edit(localDraft.form)}>Use my local draft <ArrowRight size={14} /></button>}
              </> : <>
                <h2>Make it yours</h2>
                <label htmlFor="gp-theme">Portrait style</label>
                <select id="gp-theme" value={form.sceneConfig.themeId} onChange={(event) => editScene({ themeId: event.target.value })}><option value="theme.clean-dark">Minimal / Initials</option><option value="theme.obsidian-pulse">Obsidian / Moonlit</option></select>
                <p className="gp-field-label" id="gp-accent-label">Accent</p>
                <div className="gp-swatches" role="group" aria-labelledby="gp-accent-label">{['cyan', 'violet', 'emerald', 'amber'].map((color) => <button key={color} type="button" className={`gp-swatch gp-accent-${color}`} title={color} aria-label={`${color} accent`} aria-pressed={form.sceneConfig.accent === color} onClick={() => editScene({ accent: color })}>{form.sceneConfig.accent === color && <Check size={16} />}</button>)}</div>
                <BackgroundPicker value={form.sceneConfig.backgroundId} onChange={(backgroundId) => editScene({ backgroundId })} />
                <AvatarFramePicker value={form.sceneConfig.avatarFrameId} onChange={(avatarFrameId) => editScene({ avatarFrameId })} />
              </>}
            </fieldset>
          </form>
          <div className="gp-inspector-footer">
            <button className="gp-text-button" disabled={!dirty || busy} onClick={() => { setForm(savedForm); setDirty(false); setMessage('Changes discarded.'); }}><RotateCcw size={14} />Discard changes</button>
            {auth.isConfigured && <Link className="gp-text-button" to={ownerId ? '/account' : '/sign-in?returnTo=%2Fgaming-passport'}>{ownerId ? 'Account & session' : 'Sign in to save to your account'}<ArrowRight size={14} /></Link>}
          </div>
        </aside>}

        <div className="gp-canvas" id="gp-linked-games" tabIndex={-1}>
          {ownerId && passport && !showOsuPersistence && !showOsuProbe && <SavedOsuConnections key={passport.id} ownerId={ownerId} passportId={passport.id} onHighlightsChange={setGameHighlights} />}
          {ownerId && passport && !showRobloxProbe && <PersistentRobloxConnections ownerId={ownerId} onHighlightsChange={setLinkedRobloxHighlights} onAvailabilityChange={setRobloxAvailable} />}
          {ownerId && passport && showSteamLinking && <PersistentSteamConnections ownerId={ownerId} onHighlightsChange={setLinkedSteamHighlights} onAvailabilityChange={setSteamAvailable} onBeforeConnect={() => !dirty || window.confirm('Leave with unsaved Passport changes?')} />}
          {showRobloxProbe && PrivateRobloxProbe && <Suspense fallback={<p role="status">Loading private Roblox test...</p>}><PrivateRobloxProbe onHighlightChange={setRobloxHighlight} /></Suspense>}
          {showOsuPersistence && PersistentOsuConnections ? <Suspense fallback={<p role="status">Loading private osu! accounts...</p>}><PersistentOsuConnections auth={auth} passportReady={Boolean(passport)} onHighlightsChange={setGameHighlights} /></Suspense>
            : showOsuProbe && PrivateOsuProbe ? <Suspense fallback={<p role="status">Loading private osu! test...</p>}><PrivateOsuProbe /></Suspense> : showRobloxProbe || robloxAvailable || steamAvailable || gameHighlights.length ? null : <section className="gp-owner-connections">
            <div className="gp-section-heading"><h2>My games</h2><LockKeyhole size={16} aria-hidden="true" /></div>
            <div className="gp-connections-content"><Gamepad2 size={30} aria-hidden="true" /><div><h3>Your story starts with you.</h3><p>{ownerId ? 'No game accounts are displayed in this preview.' : 'This local draft contains your presentation only. No accounts or achievements are verified.'}</p></div>
              {auth.isConfigured && !ownerId && <Link className="gp-button" to="/sign-in?returnTo=%2Fgaming-passport">Sign in<ArrowRight size={15} /></Link>}
            </div>
          </section>}
          <footer className="gp-canvas-footer"><LockKeyhole size={14} /><span>{ownerId ? 'Saving does not change publication consent or verification.' : 'Saved only on this device. No public link.'}</span></footer>
        </div>
      </div>
    </div>
  );
}
