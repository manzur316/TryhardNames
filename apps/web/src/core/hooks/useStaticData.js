import { useState, useCallback } from 'react';

/**
 * Hook for lazy loading static data using dynamic imports.
 * Prevents re-fetching if data is already loaded.
 * 
 * @param {Function} loaderFn - Async function that returns the static data
 * @returns {Object} { data, isLoading, error, loadData }
 */
export const useStaticData = (loaderFn) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (data) return; // Skip if already loaded
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loaderFn();
      setData(result);
    } catch (err) {
      console.error('Failed to load static data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [data, loaderFn]);

  return { data, isLoading, error, loadData };
};