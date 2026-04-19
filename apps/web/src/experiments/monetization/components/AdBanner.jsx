import React, { useEffect } from 'react';
import { adService } from '../services/adService.js';

export const AdBanner = ({ position = 'top', adId = 'default-ad' }) => {
  useEffect(() => {
    adService.trackAdImpression(adId);
  }, [adId]);

  const handleClick = () => {
    adService.trackAdClick(adId);
  };

  return (
    <div 
      className="ad-banner my-4 p-4 bg-gray-100 dark:bg-gray-800 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded cursor-pointer" 
      onClick={handleClick}
    >
      <p className="text-sm text-gray-500">Advertisement ({position})</p>
    </div>
  );
};