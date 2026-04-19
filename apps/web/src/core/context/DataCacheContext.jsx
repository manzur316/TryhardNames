import React, { createContext, useRef, useEffect, useCallback } from 'react';

export const DataCacheContext = createContext(undefined);

export const DataCacheProvider = ({ children }) => {
  const cache = useRef(new Map());
  const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  const setCache = useCallback((key, data, customTtl = DEFAULT_TTL) => {
    cache.current.set(key, {
      data,
      expiry: Date.now() + customTtl
    });
  }, [DEFAULT_TTL]);

  const getCache = useCallback((key) => {
    const item = cache.current.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.current.delete(key);
      return null;
    }
    
    return item.data;
  }, []);

  const clearCache = useCallback((key) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  // Automatic cleanup of expired entries every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of cache.current.entries()) {
        if (now > value.expiry) {
          cache.current.delete(key);
        }
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <DataCacheContext.Provider value={{ getCache, setCache, clearCache }}>
      {children}
    </DataCacheContext.Provider>
  );
};