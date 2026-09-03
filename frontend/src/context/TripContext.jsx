import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { debounce } from '../utils/debounce';


// Criar contexto
const TripContext = createContext();

// Provider
export const TripProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('trip_user')) || null);
  const [myTrips, setMyTrips] = useState(() => JSON.parse(sessionStorage.getItem('trip_bookings')) || []);
  const [favorites, setFavorites] = useState(() => new Set(JSON.parse(sessionStorage.getItem('trip_favorites')) || []));

  // Persistência sessionStorage
  // ⚡ Bolt Performance Optimization:
  // Wrapped sessionStorage writes in individual debounced functions.
  // Using setTimeout directly inside context update functions still queues multiple
  // macro-tasks on rapid state updates, causing redundant JSON serialization and I/O.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUserStorage = useCallback(
    debounce((value) => sessionStorage.setItem('trip_user', JSON.stringify(value)), 300),
    []
  );

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    debouncedUserStorage(newUser);
  }, [debouncedUserStorage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedBookingsStorage = useCallback(
    debounce((value) => sessionStorage.setItem('trip_bookings', JSON.stringify(value)), 300),
    []
  );

  const updateMyTrips = useCallback((trips) => {
    setMyTrips(trips);
    debouncedBookingsStorage(trips);
  }, [debouncedBookingsStorage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFavoritesStorage = useCallback(
    debounce((value) => sessionStorage.setItem('trip_favorites', JSON.stringify(Array.from(value))), 300),
    []
  );

  const updateFavorites = useCallback((favs) => {
    setFavorites(favs);
    debouncedFavoritesStorage(favs);
  }, [debouncedFavoritesStorage]);

  const abortControllerRef = useRef(null);

  // Busca de destinos
  const searchDestinations = useCallback(async (query) => {
    // ⚡ Bolt Performance Optimization:
    // Abort previous pending requests to prevent race conditions and free up client bandwidth.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = query 
        ? `${baseUrl}/api/trips/search?query=${encodeURIComponent(query)}`
        : `${baseUrl}/api/trips`;
      
      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error('Erro ao buscar destinos');
      
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Silently exit if request was intentionally aborted
      }
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false);
      }
    }
  }, []);

  // Toggle favorito
  const toggleFavorite = useCallback((id) => {
    // ⚡ Bolt Performance Optimization:
    // Using Set for favorites to enable O(1) lookups and modifications
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    updateFavorites(newFavorites);
  }, [favorites, updateFavorites]);

  // Login
  const login = useCallback((name, email) => {
    const userData = {
      name: name || "Visitante",
      email: email || "guest@tripplanner.com",
      avatar: `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff`
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
