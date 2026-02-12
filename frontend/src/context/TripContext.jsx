import React, { createContext, useContext, useState, useCallback } from 'react';

// Criar contexto
const TripContext = createContext();

// Provider
export const TripProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('trip_user')) || null);
  const [myTrips, setMyTrips] = useState(() => JSON.parse(localStorage.getItem('trip_bookings')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('trip_favorites')) || []);

  // Persistência localStorage
  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    localStorage.setItem('trip_user', JSON.stringify(newUser));
  }, []);

  const updateMyTrips = useCallback((trips) => {
    setMyTrips(trips);
    localStorage.setItem('trip_bookings', JSON.stringify(trips));
  }, []);

  const updateFavorites = useCallback((favs) => {
    setFavorites(favs);
    localStorage.setItem('trip_favorites', JSON.stringify(favs));
  }, []);

  // Busca de destinos
  const searchDestinations = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = query 
        ? `http://localhost:8080/api/trips/search?query=${encodeURIComponent(query)}` 
        : 'http://localhost:8080/api/trips';
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar destinos');
      
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle favorito
  const toggleFavorite = useCallback((id) => {
    if (favorites.includes(id)) {
      updateFavorites(favorites.filter(favId => favId !== id));
    } else {
      updateFavorites([...favorites, id]);
    }
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

  const value = {
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
  };

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
