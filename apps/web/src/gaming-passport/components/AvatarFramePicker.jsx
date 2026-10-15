import React, { useId } from 'react';
import { Circle, Palette } from 'lucide-react';
import { AVATAR_FRAME_OPTIONS, sanitizeAvatarFrameId } from '../data/avatarFrames.js';
import './avatarFramePicker.css';

const collections = [
  { id: 'classic', name: 'Classic', frames: AVATAR_FRAME_OPTIONS.filter((frame) => !frame.collection) },
  { id: 'halloween', name: 'Halloween', frames: AVATAR_FRAME_OPTIONS.filter((frame) => frame.collection === 'halloween') },
  { id: 'christmas', name: 'Christmas', frames: AVATAR_FRAME_OPTIONS.filter((frame) => frame.collection === 'christmas') },
];

export default function AvatarFramePicker({ value, onChange }) {
  const name = useId();
  const selected = sanitizeAvatarFrameId(value) || 'auto';
  return <fieldset className="gp-frame-picker">
    <legend>Avatar frame</legend>
    {collections.map((collection) => <div key={collection.id} className="gp-frame-collection" role="group" aria-labelledby={`${name}-${collection.id}`}>
      <p id={`${name}-${collection.id}`} className="gp-frame-collection-name">{collection.name}</p>
      <div className="gp-frame-options">
        {collection.frames.map((frame) => <label key={frame.id} className="gp-frame-choice" title={frame.name}>
          <input type="radio" name={name} value={frame.id} checked={selected === frame.id} onChange={() => onChange(frame.id)} />
          <span className="gp-frame-choice-body">
            <span className="gp-frame-thumbnail" aria-hidden="true">
              {frame.src ? <img src={frame.src} alt="" width="640" height="640" loading="lazy" />
                : frame.id === 'auto' ? <Palette size={28} /> : <Circle size={34} />}
            </span>
            <span className="gp-frame-choice-name">{frame.name}</span>
          </span>
        </label>)}
      </div>
    </div>)}
  </fieldset>;
}
