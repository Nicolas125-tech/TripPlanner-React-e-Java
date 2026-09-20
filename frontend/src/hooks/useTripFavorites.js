import { useState, useCallback } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { useDebouncedStorage } from './useDebouncedStorage';

export const useTripFavorites = () => {
  const [favorites, setFavorites] = useState(() => secureStorage.getItem('trip_favorites') || []);
  const debouncedFavoritesStorage = useDebouncedStorage('trip_favorites');

  const updateFavorites = useCallback((favs) => {
    setFavorites(favs);
    debouncedFavoritesStorage(favs);
  }, [debouncedFavoritesStorage]);

  const toggleFavorite = useCallback((id) => {
    const newFavorites = [...favorites];
    const index = newFavorites.indexOf(id);
    if (index > -1) {
      newFavorites.splice(index, 1);
    } else {
      newFavorites.push(id);
    }
    updateFavorites(newFavorites);
  }, [favorites, updateFavorites]);

  return { favorites, toggleFavorite, updateFavorites };
};
