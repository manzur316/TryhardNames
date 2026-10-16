import React, { useState } from 'react';
import { Check, Copy, LockKeyhole, Share2, UserRound } from 'lucide-react';
import { sanitizeCosmeticLoadout } from '../cosmetics/index.js';
import { copyTextToClipboard } from '@/utils/clipboard.js';
import { resolveAvatarFrame } from '../data/avatarFrames.js';
import { resolveProfileBackground } from '../data/profileBackgrounds.js';
import PrivateGameHighlights from './PrivateGameHighlights.jsx';
import '../passport.css';
import './privateIdentityScene.css';

export default function PassportIdentityScene({
  alias, avatarUrl, bio, scene = {}, slug, updatedAt, privatePreview = false, publicPresentation = false, localOnly = false, isPublished = false, gameHighlights = [], probeHighlights = [],
}) {
  const [brokenAvatar, setBrokenAvatar] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const loadout = sanitizeCosmeticLoadout(scene);
  const accent = ['cyan', 'violet', 'emerald', 'amber'].includes(scene.accent) ? scene.accent : 'violet';
  const title = alias || (privatePreview ? 'Your identity' : slug);
  const decorated = loadout.themeId === 'theme.obsidian-pulse';
  const richPresentation = privatePreview || publicPresentation;
  const frame = richPresentation ? resolveAvatarFrame(scene.avatarFrameId, decorated) : null;
  const background = richPresentation ? resolveProfileBackground(scene.backgroundId) : null;
  const frameStyle = frame?.src ? { '--avatar-size': `${frame.size}%`, '--avatar-left': `${(100 - frame.size) / 2}%`, '--avatar-top': `${frame.top}%` } : undefined;
  const avatarSource = avatarUrl || (decorated ? '/passport/moonlit-avatar.webp' : '');
  const hasAvatar = avatarSource && avatarSource !== brokenAvatar
    && (avatarSource === '/passport/moonlit-avatar.webp' || /^https?:\/\//i.test(avatarSource));
  const Heading = privatePreview ? 'h2' : 'h1';
  const highlightCount = richPresentation ? gameHighlights.length + probeHighlights.length : 0;
  const hasHighlights = richPresentation && highlightCount > 0;
  const portrait = <div className="gp-avatar-frame">
    {hasAvatar ? <img src={avatarSource} alt="" referrerPolicy="no-referrer" onError={() => setBrokenAvatar(avatarSource)} />
      : alias ? <span aria-hidden="true">{Array.from(alias)[0].toUpperCase()}</span>
        : <UserRound size={48} aria-hidden="true" />}
  </div>;

  async function share() {
    if (privatePreview || !slug) return;
    const url = new URL(`/id/${encodeURIComponent(slug)}`, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} | Gaming Passport`, url });
        setShareMessage('Shared.');
      } else {
        const result = await copyTextToClipboard(url);
        setShareMessage(result.ok ? 'Link copied.' : 'Could not copy the link.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShareMessage('Could not share the profile.');
    }
  }

  const identity = <div className="gp-identity">
    <p className="gp-overline">Gaming Passport</p>
    <Heading className={title?.length > 28 ? 'gp-long-alias' : undefined}>{title}</Heading>
    {!privatePreview && slug && <p className="gp-handle">@{slug}</p>}
    {richPresentation && bio && <p className="gp-bio">{bio}</p>}
    {privatePreview ? (
      <div className="gp-private-state"><LockKeyhole size={14} aria-hidden="true" /><span>{localOnly ? 'Local draft' : 'Private preview'}</span><span>{isPublished ? 'Published Passport' : 'Not published'}</span></div>
    ) : (
      <div className="gp-share-row">
        <button className="gp-button gp-button-glass" onClick={share}><Share2 size={16} aria-hidden="true" />Share profile</button>
        {updatedAt && <span className="gp-scene-date">Updated {formatSceneDate(updatedAt)}</span>}
      </div>
    )}
    {shareMessage && <p className="gp-share-message" role="status">{shareMessage.startsWith('Could') ? <Copy size={14} /> : <Check size={14} />}{shareMessage}</p>}
  </div>;

  return (
    <section className={`gp-scene gp-accent-${accent} ${richPresentation ? 'gp-scene-owner' : ''} ${hasHighlights ? 'gp-scene-with-games' : ''} ${decorated ? 'gp-scene-pulse' : ''} ${scene.layout === 'compact' ? 'gp-scene-compact' : ''} ${scene.density === 'dense' ? 'gp-scene-dense' : ''}`} data-highlight-count={richPresentation ? highlightCount : undefined} aria-label={privatePreview ? 'Private Gaming Passport preview' : 'Gaming Passport'}>
      {!richPresentation && <img className="gp-cover" src="/passport/passport-citadel.webp" alt="" fetchPriority="high" width="2160" height="720" />}
      {richPresentation && <img className="gp-owner-backdrop" data-background={background.id} src={background.src} alt="" aria-hidden="true" width={background.width} height={background.height} />}
      <div className="gp-scene-inner">
        {richPresentation ? <>
          <div className="gp-owner-profile">
            <div className={`gp-owner-avatar ${frame.src ? 'gp-owner-avatar-ornate' : ''}`} data-frame={frame.id} style={frameStyle}>
              {portrait}
              {frame.src && <img className="gp-avatar-ornament" src={frame.src} width="640" height="640" alt="" aria-hidden="true" />}
            </div>
            {identity}
          </div>
          {hasHighlights && <PrivateGameHighlights highlights={gameHighlights} probeHighlights={probeHighlights} publicPresentation={publicPresentation} />}
        </> : <>{portrait}{identity}</>}
      </div>
    </section>
  );
}

function formatSceneDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}
