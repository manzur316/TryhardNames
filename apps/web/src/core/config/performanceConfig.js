/**
 * Global performance configuration settings for the application.
 * Centralizes magic numbers used for debouncing, throttling, virtualization, and lazy loading.
 */
export const performanceConfig = {
  // Intersection Observer settings
  lazyLoadThreshold: 0.1,
  lazyLoadRootMargin: '50px',
  
  // Virtualized List settings
  virtualListItemHeight: 50,
  virtualListBufferSize: 5,
  
  // Timing settings (ms)
  searchDebounceMs: 300,
  resizeDebounceMs: 150,
  
  // Cache settings
  cacheExpireMs: 300000, // 5 minutes
  maxCacheSize: 100,
  
  // Batch processing settings
  batchSize: 50,
  batchDelayMs: 100,
  
  // Analytics settings
  analyticsFlushIntervalMs: 30000, // 30 seconds
  analyticsMaxBatchSize: 100
};