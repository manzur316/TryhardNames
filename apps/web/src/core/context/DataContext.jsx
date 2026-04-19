import React, { createContext, useMemo } from 'react';
import { LocalStorageProvider } from '../data/providers/localStorageProvider.js';
import { NamesRepository, NicknamesRepository, AnalyticsRepository } from '../data/repositories/index.js';

export const DataContext = createContext(null);

/**
 * DataProvider Component
 * 
 * Architecture Overview:
 * 1. Providers (StorageProvider, LocalStorageProvider, SupabaseProvider) handle raw data storage and retrieval.
 *    They abstract away the underlying storage mechanism (localStorage, database, etc.).
 * 2. Repositories (NamesRepository, etc.) handle domain logic, validation, and transformation.
 *    They use a Provider to persist data but ensure data integrity before saving.
 * 3. DataContext provides these repositories to the React tree via the useData() hook.
 *    This ensures no component directly interacts with localStorage or databases.
 */
export const DataProvider = ({ children, storageProvider }) => {
  const contextValue = useMemo(() => {
    // Instantiate the default provider if none is passed.
    // This ensures all data operations go through the provider abstraction, not direct localStorage calls.
    const provider = storageProvider || new LocalStorageProvider('tryhard');
    
    // Instantiate repositories with the chosen provider
    const repositories = {
      names: new NamesRepository(provider),
      nicknames: new NicknamesRepository(provider),
      analytics: new AnalyticsRepository(provider)
    };

    return { provider, repositories };
  }, [storageProvider]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};