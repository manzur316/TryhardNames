import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/core/hooks/useAuth.js';
import { getSupabaseRuntime } from '@/lib/supabase/client.js';
import {
  deleteSavedName,
  deleteSavedNameByName,
  listSavedNames,
  normalizeSavedNameKey,
  syncLocalFavoriteNamesToAccount,
  upsertSavedName,
} from '@/saved-names/data/savedNamesRepository.js';
import { readUnifiedFavoriteNames, writeUnifiedFavoriteNames } from '@/utils/favoritesSoT.js';
import { subscribeFavorites } from '@/utils/localFavoritesBridge.js';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const auth = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');
  const [syncError, setSyncError] = useState('');
  const localSignatureRef = useRef('');

  const persistNamesIfChanged = useCallback((names, options) => {
    const nextNames = uniqNames(names);
    const nextSignature = namesSignature(nextNames);
    localSignatureRef.current = nextSignature;
    if (namesSignature(readUnifiedFavoriteNames()) !== nextSignature) {
      writeUnifiedFavoriteNames(nextNames, options);
    }
  }, []);

  const loadLocalFavorites = useCallback(({ mode = 'local', error = '' } = {}) => {
    const names = readUnifiedFavoriteNames();
    localSignatureRef.current = namesSignature(names);
    setFavorites(names.map((name) => makeFavoriteRecord({ name })));
    setStorageMode(mode);
    setSyncError(error);
  }, []);

  const loadPocketBaseFavorites = useCallback(async () => {
    const records = await pb.collection('user_favorites').getFullList({
      sort: '-created',
      $autoCancel: false,
    });
    setFavorites(records);
    persistNamesIfChanged(records.map((r) => r?.name).filter(Boolean));
    setStorageMode('legacy-pocketbase');
    setSyncError('');
  }, [persistNamesIfChanged]);

  const loadAccountFavorites = useCallback(async () => {
    const { client } = await getSupabaseRuntime();
    if (!client) throw new Error('Supabase Parent Auth client is not configured.');

    const localNames = readUnifiedFavoriteNames();
    const rows = await syncLocalFavoriteNamesToAccount(client, auth.session, localNames);
    setFavorites(rows.map(makeFavoriteRecord));
    persistNamesIfChanged(rows.map((row) => row.name));
    setStorageMode('account');
    setSyncError('');
  }, [auth.session, persistNamesIfChanged]);

  const loadFavorites = useCallback(async ({ quiet = false } = {}) => {
    if (auth.isLoading) return;
    if (!quiet) setIsLoading(true);

    try {
      if (auth.session?.user?.id) {
        await loadAccountFavorites();
        return;
      }

      if (pb.authStore.isValid) {
        await loadPocketBaseFavorites();
        return;
      }

      loadLocalFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
      loadLocalFavorites({
        mode: 'local-fallback',
        error: 'Saved names are stored locally on this device until account sync is available.',
      });
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, [auth.isLoading, auth.session, loadAccountFavorites, loadLocalFavorites, loadPocketBaseFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      if (!auth.session?.user?.id) loadFavorites();
    });
    return () => {
      unsubscribe();
    };
  }, [auth.session, loadFavorites]);

  useEffect(() => subscribeFavorites(() => {
    const names = readUnifiedFavoriteNames();
    const nextSignature = namesSignature(names);
    if (nextSignature === localSignatureRef.current) return;
    localSignatureRef.current = nextSignature;

    if (auth.session?.user?.id) {
      loadFavorites({ quiet: true });
    } else {
      setFavorites(names.map((name) => makeFavoriteRecord({ name })));
      setStorageMode('local');
      setSyncError('');
    }
  }), [auth.session, loadFavorites]);

  const addFavorite = useCallback(async (
    name,
    category = 'General',
    gameType = 'General',
    gender = 'Neutral',
    meta = {}
  ) => {
    const cleanName = cleanString(name);
    const nameKey = normalizeSavedNameKey(cleanName);
    if (!cleanName || isFavoriteName(favorites, nameKey)) return;

    const newFavorite = makeFavoriteRecord({
      name: cleanName,
      category,
      gameType,
      gender,
      sourcePath: meta.sourcePath,
      sourceLabel: meta.sourceLabel || gameType,
      keyword: meta.keyword,
    });

    setFavorites((prev) => [newFavorite, ...prev.filter((fav) => favoriteRecordKey(fav) !== nameKey)]);
    persistNamesIfChanged([cleanName, ...favorites.map((fav) => fav?.name).filter(Boolean)]);

    if (auth.session?.user?.id) {
      try {
        const { client } = await getSupabaseRuntime();
        if (!client) throw new Error('Supabase Parent Auth client is not configured.');
        const row = await upsertSavedName(client, auth.session, {
          name: cleanName,
          sourcePath: meta.sourcePath,
          sourceLabel: meta.sourceLabel || gameType,
          category,
          keyword: meta.keyword,
        });
        setFavorites((prev) => prev.map((fav) => favoriteRecordKey(fav) === nameKey ? makeFavoriteRecord(row) : fav));
        setStorageMode('account');
        setSyncError('');
      } catch (error) {
        console.error('Error saving favorite to Supabase:', error);
        setStorageMode('local-fallback');
        setSyncError('Saved locally on this device. Account sync will retry later.');
      }
      return;
    }

    if (pb.authStore.isValid) {
      try {
        const record = await pb.collection('user_favorites').create({
          userId: pb.authStore.model.id,
          nameId: newFavorite.nameId,
          name: cleanName,
          category,
          gameType,
          gender,
          addedDate: newFavorite.addedDate,
          copyCount: 0,
          rating: 5,
        }, { $autoCancel: false });
        setFavorites((prev) => prev.map((fav) => favoriteRecordKey(fav) === nameKey ? record : fav));
        setStorageMode('legacy-pocketbase');
      } catch (error) {
        console.error('Error saving favorite to legacy DB:', error);
      }
    }
  }, [auth.session, favorites, persistNamesIfChanged]);

  const removeFavorite = useCallback(async (nameId) => {
    const targetKey = normalizeSavedNameKey(nameId);
    const favToRemove = favorites.find((fav) => {
      return fav?.id === nameId
        || fav?.savedNameId === nameId
        || fav?.nameId === nameId
        || favoriteRecordKey(fav) === targetKey;
    });
    if (!favToRemove) return;

    const removeKey = favoriteRecordKey(favToRemove);
    const nextFavorites = favorites.filter((fav) => favoriteRecordKey(fav) !== removeKey);
    setFavorites(nextFavorites);
    persistNamesIfChanged(nextFavorites.map((fav) => fav?.name).filter(Boolean), { mirrorLegacy: false });

    if (auth.session?.user?.id) {
      try {
        const { client } = await getSupabaseRuntime();
        if (!client) throw new Error('Supabase Parent Auth client is not configured.');
        if (favToRemove.savedNameId) {
          await deleteSavedName(client, auth.session, favToRemove.savedNameId);
        } else {
          await deleteSavedNameByName(client, auth.session, favToRemove.name);
        }
        setStorageMode('account');
        setSyncError('');
      } catch (error) {
        console.error('Error removing favorite from Supabase:', error);
        setStorageMode('local-fallback');
        setSyncError('Removed locally on this device. Account sync will retry later.');
      }
      return;
    }

    if (pb.authStore.isValid && favToRemove.id) {
      try {
        await pb.collection('user_favorites').delete(favToRemove.id, { $autoCancel: false });
      } catch (error) {
        console.error('Error removing favorite from legacy DB:', error);
      }
    }
  }, [auth.session, favorites, persistNamesIfChanged]);

  const isFavorite = useCallback((nameId) => {
    const normalizedId = normalizeSavedNameKey(nameId);
    return isFavoriteName(favorites, normalizedId);
  }, [favorites]);

  const getFavorites = useCallback(() => {
    return favorites;
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    const currentFavs = [...favorites];
    setFavorites([]);
    persistNamesIfChanged([], { mirrorLegacy: false });
    try {
      localStorage.removeItem('tryhard_favorites');
    } catch {
      // ignore
    }

    if (auth.session?.user?.id) {
      try {
        const { client } = await getSupabaseRuntime();
        if (!client) throw new Error('Supabase Parent Auth client is not configured.');
        await Promise.all(currentFavs.map((fav) => (
          fav.savedNameId
            ? deleteSavedName(client, auth.session, fav.savedNameId)
            : deleteSavedNameByName(client, auth.session, fav.name)
        )));
        setStorageMode('account');
        setSyncError('');
      } catch (error) {
        console.error('Error clearing favorites from Supabase:', error);
        setStorageMode('local-fallback');
        setSyncError('Cleared locally on this device. Account sync will retry later.');
      }
      return;
    }

    if (pb.authStore.isValid) {
      try {
        await Promise.all(currentFavs.filter((fav) => fav.id).map((fav) =>
          pb.collection('user_favorites').delete(fav.id, { $autoCancel: false })
        ));
      } catch (error) {
        console.error('Error clearing favorites from legacy DB:', error);
      }
    }
  }, [auth.session, favorites, persistNamesIfChanged]);

  const exportFavorites = useCallback(() => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tryhard_favorites.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [favorites]);

  const importFavorites = useCallback(async (jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) throw new Error('Invalid format');

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
  }, [addFavorite, isFavorite]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isLoading,
      storageMode,
      syncError,
      addFavorite,
      removeFavorite,
      isFavorite,
      getFavorites,
      clearFavorites,
      exportFavorites,
      importFavorites,
      refreshFavorites: loadFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

function makeFavoriteRecord(input = {}) {
  const name = cleanString(input.name);
  const nameKey = input.nameKey || normalizeSavedNameKey(name);
  return {
    id: input.id || input.savedNameId || nameKey,
    savedNameId: input.id || input.savedNameId || null,
    nameId: nameKey.replace(/\s+/g, '_'),
    name,
    category: input.category || 'General',
    gameType: input.sourceLabel || input.gameType || input.category || 'General',
    gender: input.gender || 'Neutral',
    addedDate: input.createdAt || input.addedDate || new Date().toISOString(),
    updatedAt: input.updatedAt,
    sourcePath: input.sourcePath || '',
    keyword: input.keyword || '',
    copyCount: Number(input.copyCount || 0),
    rating: input.rating || 5,
  };
}

function isFavoriteName(favorites, normalizedId) {
  if (!normalizedId) return false;
  return favorites.some((fav) => favoriteRecordKey(fav) === normalizedId);
}

function favoriteRecordKey(fav) {
  return normalizeSavedNameKey(fav?.name || fav?.nameId || fav?.id);
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function uniqNames(names) {
  const byKey = new Map();
  for (const name of names || []) {
    const clean = cleanString(name);
    const key = normalizeSavedNameKey(clean);
    if (clean && key && !byKey.has(key)) byKey.set(key, clean);
  }
  return [...byKey.values()];
}

function namesSignature(names) {
  return uniqNames(names).map((name) => normalizeSavedNameKey(name)).sort().join('\n');
}
