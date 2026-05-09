import React from 'react';

/** Preview tag for framed nicknames — placed at top of tool so users set context first. */
export const PreviewTagStrip = ({ previewTag, onPreviewChange, isDarkMode }) => {
  const muted = isDarkMode ? 'text-dark-400' : 'text-slate-500';
  const card = isDarkMode ? 'bg-dark-900 border-dark-700' : 'bg-white border-slate-200';

  return (
    <div
      className={`rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${card}`}
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor="preview-tag"
          className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${muted}`}
        >
          Preview tag (for framed nicknames)
        </label>
        <input
          id="preview-tag"
          type="text"
          value={previewTag}
          onChange={(e) => onPreviewChange(e.target.value)}
          placeholder="e.g. Shadow"
          maxLength={32}
          autoComplete="off"
          className={`w-full max-w-lg rounded-xl px-4 py-2.5 text-base border outline-none focus:ring-2 focus:ring-accent-purple/40 transition-shadow ${
            isDarkMode ? 'bg-dark-800 border-dark-600 text-dark-50' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        />
      </div>
      <p className={`text-xs sm:max-w-xs shrink-0 leading-snug ${muted}`}>
        Solo glyphs ignore this field. Wrappers update live.
      </p>
    </div>
  );
};
