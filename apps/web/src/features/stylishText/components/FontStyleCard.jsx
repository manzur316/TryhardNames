import React, { memo } from 'react';

export const FontStyleCard = memo(({ style, label, preview, onSelect, isSelected, fontName, fontPreview }) => {
  // Support both new requested props and legacy props
  const displayLabel = label || fontName;
  const displayPreview = preview || fontPreview;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border/50 bg-card hover:border-primary/50 hover:bg-accent/5'
      }`}
    >
      <div className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider">
        {displayLabel}
      </div>
      <div className="text-xl text-foreground break-all">
        {displayPreview}
      </div>
    </div>
  );
});

FontStyleCard.displayName = 'FontStyleCard';