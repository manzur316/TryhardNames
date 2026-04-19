import { analyticsService } from '../../analytics/index.js';

export const adService = {
  loadAds: () => {
    console.warn('Ads loaded');
  },
  trackAdImpression: (adId) => {
    analyticsService.trackAdImpression(adId);
  },
  trackAdClick: (adId) => {
    analyticsService.trackAdClick(adId);
  }
};