import { useState, useEffect } from 'react';
import { adService } from '../services/adService.js';

export const useMonetization = () => {
  const [ads, setAds] = useState([]);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adRevenue, setAdRevenue] = useState(0);

  useEffect(() => {
    let mounted = true;

    const initAds = async () => {
      try {
        // Assuming adService.loadAds exists or we mock it safely
        const loadedAds = adService.loadAds ? await adService.loadAds() : [];
        if (mounted) {
          setAds(loadedAds || []);
          setIsAdLoaded(true);
        }
      } catch (error) {
        console.warn('Failed to load ads', error);
      }
    };

    initAds();

    return () => {
      mounted = false;
    };
  }, []);

  const trackAdImpression = (adId) => {
    if (adService.trackImpression) {
      adService.trackImpression(adId);
    }
  };

  const trackAdClick = (adId) => {
    if (adService.trackClick) {
      adService.trackClick(adId);
    }
  };

  return { 
    ads, 
    isAdLoaded, 
    adRevenue, 
    trackAdImpression, 
    trackAdClick 
  };
};