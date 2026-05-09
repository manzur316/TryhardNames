import React, { createContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { readUnifiedFavoriteNames, writeUnifiedFavoriteNames } from '@/utils/favoritesSoT.js';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Try loading from PocketBase if authenticated
        if (pb.authStore.isValid) {
          const records = await pb.collection('user_favorites').getFullList({
            sort: '-created',
            $autoCancel: false
          });
          setFavorites(records);
          // Backup to local storage
          localStorage.setItem('tryhard_favorites', JSON.stringify(records));
          // Source-of-truth mirror for other UI surfaces (names-only)
          writeUnifiedFavoriteNames(records.map((r) => r?.name).filter(Boolean));
        } else {
          // Load from local storage
          const localFavs = localStorage.getItem('tryhard_favorites');
          if (localFavs) {
            const parsed = JSON.parse(localFavs);
            setFavorites(parsed);
            // Also ensure SoT has all names (merge with v1)
            const mergedNames = readUnifiedFavoriteNames();
            const fromLegacy = Array.isArray(parsed) ? parsed.map((r) => r?.name).filter(Boolean) : [];
            writeUnifiedFavoriteNames([...mergedNames, ...fromLegacy]);
          }
          // If legacy storage absent, still hydrate from v1 so favorites UI isn't “empty”
          if (!localFavs) {
            const names = readUnifiedFavoriteNames();
            if (names.length) {
              setFavorites(
                names.map((name) => ({
                  nameId: String(name).toLowerCase().replace(/\s+/g, '_'),
                  name: String(name),
                  category: 'General',
                  gameType: 'General',
                  gender: 'Neutral',
                  addedDate: new Date().toISOString(),
                  copyCount: 0,
                  rating: 5,
                }))
              );
            }
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        // Fallback to local storage on error
        const localFavs = localStorage.getItem('tryhard_favorites');
        if (localFavs) {
          const parsed = JSON.parse(localFavs);
          setFavorites(parsed);
          const mergedNames = readUnifiedFavoriteNames();
          const fromLegacy = Array.isArray(parsed) ? parsed.map((r) => r?.name).filter(Boolean) : [];
          writeUnifiedFavoriteNames([...mergedNames, ...fromLegacy]);
        } else {
          const names = readUnifiedFavoriteNames();
          if (names.length) {
            setFavorites(
              names.map((name) => ({
                nameId: String(name).toLowerCase().replace(/\s+/g, '_'),
                name: String(name),
                category: 'General',
                gameType: 'General',
                gender: 'Neutral',
                addedDate: new Date().toISOString(),
                copyCount: 0,
                rating: 5,
              }))
            );
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Listen for auth changes to reload favorites
    const unsubscribe = pb.authStore.onChange(() => {
      loadFavorites();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync to local storage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tryhard_favorites', JSON.stringify(favorites));
      // Keep SoT up to date for other surfaces (names-only).
      writeUnifiedFavoriteNames(favorites.map((f) => f?.name).filter(Boolean));
    }
  }, [favorites, isLoading]);

  const addFavorite = async (name, category = 'General', gameType = 'General', gender = 'Neutral') => {
    const nameId = name.toLowerCase().replace(/\s+/g, '_');
    
    if (isFavorite(nameId)) return;

    const newFavorite = {
      nameId,
      name,
      category,
      gameType,
      gender,
      addedDate: new Date().toISOString(),
      copyCount: 0,
      rating: 5
    };

    // Optimistic update
    setFavorites(prev => [newFavorite, ...prev]);
    writeUnifiedFavoriteNames(readUnifiedFavoriteNames().concat([name]));

    if (pb.authStore.isValid) {
      try {
        const record = await pb.collection('user_favorites').create({
          userId: pb.authStore.model.id,
          nameId,
          name,
          category,
          gameType,
          gender,
          addedDate: newFavorite.addedDate,
          copyCount: 0,
          rating: 5
        }, { $autoCancel: false });
        
        // Update with actual DB record (to get the real ID for deletion later)
        setFavorites(prev => prev.map(f => f.nameId === nameId ? record : f));
      } catch (error) {
        console.error('Error saving favorite to DB:', error);
      }
    }
  };

  const removeFavorite = async (nameId) => {
    const favToRemove = favorites.find(f => f.nameId === nameId || f.id === nameId);
    if (!favToRemove) return;

    // Optimistic update
    setFavorites(prev => prev.filter(f => f.nameId !== nameId && f.id !== nameId));
    const nextNames = readUnifiedFavoriteNames().filter((n) => String(n) !== String(favToRemove.name));
    writeUnifiedFavoriteNames(nextNames);

    if (pb.authStore.isValid && favToRemove.id) {
      try {
        await pb.collection('user_favorites').delete(favToRemove.id, { $autoCancel: false });
      } catch (error) {
        console.error('Error removing favorite from DB:', error);
      }
    }
  };

  const isFavorite = useCallback((nameId) => {
    const normalizedId = nameId.toLowerCase().replace(/\s+/g, '_');
    return favorites.some(f => f.nameId === normalizedId || f.name.toLowerCase().replace(/\s+/g, '_') === normalizedId);
  }, [favorites]);

  const getFavorites = useCallback(() => {
    return favorites;
  }, [favorites]);

  const clearFavorites = async () => {
    const currentFavs = [...favorites];
    setFavorites([]);
    localStorage.removeItem('tryhard_favorites');
    writeUnifiedFavoriteNames([], { mirrorLegacy: false });

    if (pb.authStore.isValid) {
      try {
        // Delete all user favorites in DB
        const promises = currentFavs.filter(f => f.id).map(f => 
          pb.collection('user_favorites').delete(f.id, { $autoCancel: false })
        );
        await Promise.all(promises);
      } catch (error) {
        console.error('Error clearing favorites from DB:', error);
      }
    }
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tryhard_favorites.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFavorites = async (jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      
      let addedCount = 0;
      for (const item of imported) {
        if (item.name && !isFavorite(item.name)) {
          await addFavorite(item.name, item.category, item.gameType, item.gender);
          addedCount++;
        }
      }
      return { success: true, count: addedCount };
    } catch (error) {
      console.error('Error importing favorites:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isLoading,
      addFavorite,
      removeFavorite,
      isFavorite,
      getFavorites,
      clearFavorites,
      exportFavorites,
      importFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};