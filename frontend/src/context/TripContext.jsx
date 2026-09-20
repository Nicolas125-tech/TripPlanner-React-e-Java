import { createContext, useContext, useMemo } from 'react';
import { useTripUser } from '../hooks/useTripUser';
import { useTripBookings } from '../hooks/useTripBookings';
import { useTripFavorites } from '../hooks/useTripFavorites';
import { useTripSearch } from '../hooks/useTripSearch';

// Criar contexto
const TripContext = createContext();

// Provider
export const TripProvider = ({ children }) => {
  const { user, login, logout, updateUser } = useTripUser();
  const { myTrips, bookTrip, updateMyTrips } = useTripBookings();
  const { favorites, toggleFavorite, updateFavorites } = useTripFavorites();
  const { destinations, loading, error, searchDestinations } = useTripSearch();

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
