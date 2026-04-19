import { useState, useCallback, useContext, useRef } from 'react';
import { DataCacheContext } from '../context/DataCacheContext.jsx';
import { hybridCache } from '../cache/hybridCache.js';
import { errorService } from '../services/errorService.js';

// Global deduplication map for useLazyFetch
const inFlightRequests = new Map();

/**
 * Hook for lazy fetching data with automatic retry, exponential backoff, caching, and fallback support.
 * 
 * @param {Function} fetchFn - The async function to call
 * @param {Object} options - Configuration options
 * @returns {Object} State and control methods
 */
export const useLazyFetch = (fetchFn, options = {}) => {
  const { 
    retries = 3, 
    retryDelay = 100,
    onSuccess, 
    onError, 
    cacheKey, 
    useContextCache = false, 
    useHybridCache = false,
    fallbackData = null,
    ttl 
  } = options;
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  
  const retriesCount = useRef(0);
  const cacheContext = useContext(DataCacheContext);

  const fetch = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    setIsFallback(false);
    retriesCount.current = 0;
    
    // 1. Check Hybrid Cache
    if (useHybridCache && cacheKey) {
      const cached = hybridCache.get(cacheKey);
      if (cached) {
        setData(cached);
        if (onSuccess) onSuccess(cached);
        setIsLoading(false);
        return cached;
      }
    }

    // 2. Check Context Cache
    if (useContextCache && cacheKey && cacheContext) {
      const cachedData = cacheContext.getCache(cacheKey);
      if (cachedData) {
        setData(cachedData);
        if (onSuccess) onSuccess(cachedData);
        setIsLoading(false);
        return cachedData;
      }
    }
    
    // 3. Request Deduplication
    const dedupKey = cacheKey || fetchFn.name + JSON.stringify(args);
    if (inFlightRequests.has(dedupKey)) {
      try {
        const result = await inFlightRequests.get(dedupKey);
        setData(result);
        setIsLoading(false);
        return result;
      } catch (err) {
        // If the in-flight request fails, we'll fall through to our own retry logic
      }
    }

    const executeFetch = async () => {
      let attempt = 0;
      
      while (attempt <= retries) {
        try {
          const result = await fetchFn(...args);
          
          // Save to caches
          if (useHybridCache && cacheKey) {
            hybridCache.set(cacheKey, result);
          }
          if (useContextCache && cacheKey && cacheContext) {
            cacheContext.setCache(cacheKey, result, ttl);
          }
          
          setData(result);
          if (onSuccess) onSuccess(result);
          setIsLoading(false);
          return result;
        } catch (err) {
          attempt++;
          retriesCount.current = attempt;
          
          if (attempt > retries) {
            const apiError = errorService.createApiError(err);
            errorService.logError(apiError, { cacheKey, args });
            
            if (fallbackData) {
              setData(fallbackData);
              setIsFallback(true);
              if (onSuccess) onSuccess(fallbackData);
            } else {
              setError(apiError);
              if (onError) onError(apiError);
            }
            
            setIsLoading(false);
            throw apiError;
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * retryDelay));
        }
      }
    };

    const fetchPromise = executeFetch();
    inFlightRequests.set(dedupKey, fetchPromise);
    
    try {
      return await fetchPromise;
    } finally {
      inFlightRequests.delete(dedupKey);
    }
  }, [fetchFn, retries, retryDelay, onSuccess, onError, cacheKey, useContextCache, useHybridCache, cacheContext, ttl, fallbackData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsFallback(false);
    retriesCount.current = 0;
  }, []);

  return { 
    data, 
    isLoading, 
    error, 
    fetch, 
    reset, 
    retries: retriesCount.current,
    isFallback 
  };
};