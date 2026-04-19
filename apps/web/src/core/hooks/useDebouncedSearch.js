import { useState, useCallback, useRef } from 'react';
import { debounce } from '../utils/debounce.js';
import { performanceConfig } from '../config/performanceConfig.js';

/**
 * Hook for handling search inputs with debouncing to prevent excessive API calls or heavy computations.
 * 
 * @param {Function} searchFn - Async function that performs the search and returns results
 * @param {number} delayMs - Debounce delay in milliseconds
 * @returns {Object} Search state and handlers
 */
export const useDebouncedSearch = (
  searchFn, 
  delayMs = performanceConfig.searchDebounceMs
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  const searchCount = useRef(0);

  // Use ref to persist the debounced function across renders
  const debouncedSearch = useRef(
    debounce(async (q) => {
      if (!q || q.trim() === '') {
        setResults([]);
        setIsSearching(false);
        return;
      }
      
      try {
        setError(null);
        const res = await searchFn(q);
        setResults(res || []);
        searchCount.current += 1;
      } catch (err) {
        console.error('Search error:', err);
        setError(err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delayMs)
  ).current;

  const handleSearch = useCallback((newQuery) => {
    setQuery(newQuery);
    if (newQuery && newQuery.trim() !== '') {
      setIsSearching(true);
      debouncedSearch(newQuery);
    } else {
      setResults([]);
      setIsSearching(false);
      setError(null);
    }
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    setError(null);
  }, []);

  return { 
    query, 
    results, 
    isSearching, 
    error, 
    handleSearch, 
    clearSearch, 
    searchCount: searchCount.current 
  };
};