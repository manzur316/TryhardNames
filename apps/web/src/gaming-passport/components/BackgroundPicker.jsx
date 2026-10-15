import React, { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { PROFILE_BACKGROUND_OPTIONS, resolveProfileBackground } from '../data/profileBackgrounds.js';
import './backgroundPicker.css';

export default function BackgroundPicker({ value, onChange }) {
  const name = useId();
  const selected = resolveProfileBackground(value);
  return <details className="gp-background-picker">
    <summary><span>Background</span><span className="gp-background-current">{selected.name}</span><ChevronDown size={15} aria-hidden="true" /></summary>
    <fieldset>
      <legend className="sr-only">Profile background</legend>
      <div className="gp-background-options">
        {PROFILE_BACKGROUND_OPTIONS.map((background) => <label key={background.id} className="gp-background-choice">
          <input type="radio" name={name} value={background.id} checked={selected.id === background.id} onChange={() => onChange(background.id)} />
          <span className="gp-background-choice-body">
            <img src={background.thumbnail} alt="" width={background.width} height={background.height} loading="lazy" />
            <span className="gp-background-choice-name">{background.name}</span>
            {selected.id === background.id && <Check className="gp-background-check" size={14} aria-hidden="true" />}
          </span>
        </label>)}
      </div>
    </fieldset>
  </details>;
}
