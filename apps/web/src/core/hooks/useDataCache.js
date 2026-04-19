import { useContext } from 'react';
import { DataCacheContext } from '../context/DataCacheContext.jsx';

/**
 * Hook to access the DataCacheContext.
 * Provides getCache, setCache, and clearCache methods.
 * 
 * @throws {Error} If used outside of a DataCacheProvider
 * @returns {Object} Cache context methods
 */
export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  
  if (context === undefined) {
    throw new Error('useDataCache must be used within a DataCacheProvider');
  }
  
  return context;
};