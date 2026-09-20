import { secureStorage } from '../utils/secureStorage';
import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { useDebouncedStorage } from '../hooks/useDebouncedStorage';
import { useAbortController } from '../hooks/useAbortController';

// Criar contexto
const TripContext = createContext();

// Provider
export const TripProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => secureStorage.getItem('trip_user') || null);
  const [myTrips, setMyTrips] = useState(() => secureStorage.getItem('trip_bookings') || []);
  const [favorites, setFavorites] = useState(() => secureStorage.getItem('trip_favorites') || []);

  // Persistência sessionStorage
  // ⚡ Bolt Performance Optimization:
  // Wrapped sessionStorage writes in individual debounced functions.
  // Using setTimeout directly inside context update functions still queues multiple
  // macro-tasks on rapid state updates, causing redundant JSON serialization and I/O.
  const debouncedUserStorage = useDebouncedStorage('trip_user');

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    debouncedUserStorage(newUser);
  }, [debouncedUserStorage]);

  const debouncedBookingsStorage = useDebouncedStorage('trip_bookings');

  const updateMyTrips = useCallback((trips) => {
    setMyTrips(trips);
    debouncedBookingsStorage(trips);
  }, [debouncedBookingsStorage]);

  const debouncedFavoritesStorage = useDebouncedStorage('trip_favorites');

  const updateFavorites = useCallback((favs) => {
    setFavorites(favs);
    debouncedFavoritesStorage(favs);
  }, [debouncedFavoritesStorage]);

  const { getNewController, isCurrentController } = useAbortController();

  // ⚡ Bolt Performance Optimization:
  // Added a local cache (searchCache) for API responses.
  const searchCache = useRef(new Map());

  // Busca de destinos
  const searchDestinations = useCallback(async (query) => {
    // ⚡ Bolt Performance Optimization:
    // Normalized the search term (trimmed whitespace and lowercased) before generating the cache key.
    // This dramatically increases cache hit rates by treating equivalent searches (like "Paris", "paris", and " Paris ")
    // as identical, avoiding unnecessary API requests and subsequent React re-renders.
    const normalizedTerm = query ? query.trim() : "";
    const cacheKey = normalizedTerm.toLowerCase() || 'ALL';

    // ⚡ Bolt Performance Optimization:
    // Abort previous pending requests to prevent race conditions and free up client bandwidth.
    const abortController = getNewController();

    if (searchCache.current.has(cacheKey)) {
      setDestinations(searchCache.current.get(cacheKey));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = normalizedTerm
        ? `${baseUrl}/api/trips/search?query=${encodeURIComponent(normalizedTerm)}`
        : `${baseUrl}/api/trips`;
      
      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error('Erro ao buscar destinos');
      
      const data = await res.json();

      searchCache.current.set(cacheKey, data);
      setDestinations(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Silently exit if request was intentionally aborted
      }
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      if (isCurrentController(abortController)) {
        setLoading(false);
      }
    }
  }, [getNewController, isCurrentController]);

  // Toggle favorito
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

  // Login
  const login = useCallback((name, email) => {
    const userData = {
      name: name || "Visitante",
      email: email || "guest@tripplanner.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Visitante")}&background=2563eb&color=fff`
    };
    updateUser(userData);
    return userData;
  }, [updateUser]);

  // Logout
  const logout = useCallback(() => {
    updateUser(null);
  }, [updateUser]);

  // Reservar viagem
  const bookTrip = useCallback((trip, bookingData) => {
    const newTrip = {
      ...trip,
      bookingId: Date.now(),
      ...bookingData,
      totalPrice: trip.price * bookingData.guests,
      status: 'Confirmado'
    };
    updateMyTrips([...myTrips, newTrip]);
    return newTrip;
  }, [myTrips, updateMyTrips]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped the context value in `useMemo` to prevent unnecessary re-renders.
  // Previously, the `value` object was recreated on every render of TripProvider,
  // causing all consuming components to re-render even if the specific state they
  // needed hadn't changed. Now, the context value is only recreated when one of its
  // dependencies changes.
  const value = useMemo(() => ({
    // Estado
    destinations,
    loading,
    error,
    user,
    myTrips,
    favorites,
    
    // Ações
    searchDestinations,
    toggleFavorite,
    login,
    logout,
    bookTrip,
    updateMyTrips
  }), [
    destinations,
    loading,
    error,
    user,
    myTrips,
    favorites,
    searchDestinations,
    toggleFavorite,
    login,
    logout,
    bookTrip,
    updateMyTrips
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

// Hook customizado
export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips deve ser usado dentro de TripProvider');
  }
  return context;
};
