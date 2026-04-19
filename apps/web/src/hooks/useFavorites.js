import { useContext } from 'react';
import { FavoritesContext } from '@/contexts/FavoritesContext.jsx';

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context.favorites;
};

export const useFavoritesCount = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesCount must be used within a FavoritesProvider');
  }
  return context.favorites.length;
};

export const useAddFavorite = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useAddFavorite must be used within a FavoritesProvider');
  }
  return context.addFavorite;
};

export const useRemoveFavorite = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useRemoveFavorite must be used within a FavoritesProvider');
  }
  return context.removeFavorite;
};

export const useIsFavorite = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useIsFavorite must be used within a FavoritesProvider');
  }
  return context.isFavorite;
};

export const useExportFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useExportFavorites must be used within a FavoritesProvider');
  }
  return context.exportFavorites;
};

export const useImportFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useImportFavorites must be used within a FavoritesProvider');
  }
  return context.importFavorites;
};

export const useClearFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useClearFavorites must be used within a FavoritesProvider');
  }
  return context.clearFavorites;
};