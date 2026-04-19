import React from 'react';

const AdPlaceholder = ({ position = 'banner', className = '' }) => {
  const heights = {
    banner: 'h-24 md:h-32',
    square: 'h-64',
    skyscraper: 'h-96'
  };

  return (
    <div 
      className={`w-full ${heights[position]} bg-card/50 border-2 border-dashed border-border rounded-lg flex items-center justify-center ${className}`}
      data-ad-position={position}
    >
      <div className="text-center">
        <p className="text-foreground/40 text-sm font-medium">Ad Space</p>
        <p className="text-foreground/30 text-xs mt-1">Monetag Integration Zone</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;