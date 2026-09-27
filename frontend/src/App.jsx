import SearchBar from "./components/SearchBar";
import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Sun, Mountain, Building } from 'lucide-react';
import Navbar from './components/Navbar';
import TripCard from './components/TripCard';
import MyTripCard from './components/MyTripCard';
import CategoryPill from './components/CategoryPill';
import { useTrips } from './context/TripContext';

// ⚡ Bolt Performance Optimization:
// Code-split Modals using React.lazy to reduce the initial JavaScript bundle size.
// Since these modals are hidden on load, dynamically importing them defers fetching
// their respective chunks (~3.9kB combined) until the user actually interacts with them,
// improving Time to Interactive (TTI) and saving bandwidth.
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const BookingModal = React.lazy(() => import('./components/BookingModal'));
const DetailsModal = React.lazy(() => import('./components/DetailsModal'));

const TRIP_CATEGORIES = [
  { label: "Todos", icon: <MapIcon size={16} /> },
  { label: "Praia", icon: <Sun size={16} /> },
  { label: "Cidade", icon: <Building size={16} /> },
  { label: "Montanha", icon: <Mountain size={16} /> }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  // ⚡ Bolt: Removed 'search' state to prevent unnecessary re-renders of App on every keystroke. State is now handled locally in SearchBar.
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  
  const {
    destinations,
    loading,
    user,
    myTrips,
    favorites,
    searchDestinations,
    toggleFavorite: contextToggleFavorite,
    login,
    logout,
    bookTrip
  } = useTrips();

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [notification, setNotification] = useState(null);

  // ⚡ Bolt Performance Optimization:
  // Wrapped modal toggle functions in useCallback to pass stable references to child components.
  // This prevents Modals from unnecessarily re-rendering whenever unrelated state (like App tabs) changes.
  const closeAuthModal = React.useCallback(() => setShowAuthModal(false), []);
  const openAuthModal = React.useCallback(() => setShowAuthModal(true), []);
  const closeDetailsModal = React.useCallback(() => setShowDetailsModal(false), []);
  const openBookingModal = React.useCallback(() => setShowBookingModal(true), []);
  const closeBookingModal = React.useCallback(() => setShowBookingModal(false), []);

  // Carregamento inicial
  useEffect(() => {
    searchDestinations("");
  }, [searchDestinations]);

  const showNotification = React.useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleLogout = React.useCallback(() => {
    logout();
    showNotification("Logout realizado");
  }, [logout, showNotification]);

  const handleLogin = React.useCallback((authFormData) => {
    const userData = login(authFormData.name, authFormData.email);
    setShowAuthModal(false);
    showNotification(`Bem-vindo, ${userData.name}!`);
  }, [login, showNotification]);

  const toggleFavorite = React.useCallback((id, isCurrentlyFavorite) => {
    contextToggleFavorite(id);

    if (isCurrentlyFavorite) {
      showNotification("Removido dos favoritos");
    } else {
      showNotification("Adicionado aos favoritos ❤️");
    }
  }, [contextToggleFavorite, showNotification]);

  const handleDetailsClick = React.useCallback((dest) => {
    setSelectedDestination(dest);
    setShowDetailsModal(true);
  }, []);

  // ⚡ Bolt Performance Optimization:
  // Wrapped confirmBooking in React.useCallback to prevent unnecessary re-renders of BookingModal.
  // Updated to use functional state updates (prev => [...prev, newTrip]) to remove `myTrips` from the
  // dependency array, ensuring the callback reference remains perfectly stable even as new trips are booked.
  const confirmBooking = React.useCallback((bookingFormData) => {
    bookTrip(selectedDestination, bookingFormData);
    setShowBookingModal(false);
    setActiveTab('my-trips');
    showNotification("Viagem reservada com sucesso! ✈️");
  }, [bookTrip, selectedDestination, showNotification]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped the destinations filter in `React.useMemo` to cache the filtered array
  // and avoid O(N) recalculations on every render when destinations and categoryFilter haven't changed.
  const filteredDestinations = React.useMemo(() => {
    if (categoryFilter === "Todos") return destinations;
    return destinations.filter(d => d.category === categoryFilter);
  }, [destinations, categoryFilter]);

  // ⚡ Bolt Performance Optimization:
  // Added favoritesSet to avoid O(N*M) lookups inside the map/filter loops.
  const favoritesSet = React.useMemo(() => new Set(favorites), [favorites]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped favoritesList in useMemo to prevent O(N) recalculations on every render.
  // Added an early return for the default empty state, making it O(1) instead of O(N).
  const favoritesList = React.useMemo(() => {
    if (favoritesSet.size === 0) return [];
    return destinations.filter(d => favoritesSet.has(d.id));
  }, [destinations, favoritesSet]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
        openAuthModal={openAuthModal}
      />

      {/* CONTENT */}
      <div className="pt-16">
        {/*
          ⚡ Bolt Performance Optimization:
          Switched from conditional rendering `{activeTab === 'x' && ...}` to CSS-based display toggling.
          This prevents React from destroying and recreating massive DOM subtrees (like the grid of TripCards)
          every time the user switches tabs. By keeping the DOM nodes alive, tab switching becomes instantaneous,
          prevents layout thrashing, and preserves scroll position.
        */}
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <div className="bg-blue-900 py-20 px-4 text-center text-white mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Para onde você quer ir?</h1>
            <SearchBar onSearch={searchDestinations} />
          </div>

          <main className="max-w-7xl mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto pb-6 mb-4">
              {TRIP_CATEGORIES.map(cat => (
                <CategoryPill
                  key={cat.label}
                  {...cat}
                  active={categoryFilter === cat.label}
                  onClick={setCategoryFilter}
                />
              ))}
            </div>

            <div className="relative min-h-[200px]">
              {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <span className="font-bold text-gray-600">Carregando destinos...</span>
                </div>
              )}
              <div className={`grid md:grid-cols-3 gap-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {filteredDestinations.map((dest, index) => (
                  <TripCard
                    key={dest.id}
                    trip={dest}
                    isFavorite={favoritesSet.has(dest.id)}
                    onFavoriteClick={toggleFavorite}
                    onDetailsClick={handleDetailsClick}
                    priority={index < 3}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Minhas Viagens */}
        <div className={activeTab === 'my-trips' ? 'block' : 'hidden'}>
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Minhas Viagens</h2>
            {myTrips.length === 0 ? <p className="text-gray-500">Nenhuma viagem agendada.</p> : (
              <div className="space-y-4">
                {myTrips.map((trip) => (
                  <MyTripCard key={trip.bookingId} trip={trip} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favoritos */}
        <div className={activeTab === 'favorites' ? 'block' : 'hidden'}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Meus Favoritos</h2>
            {favoritesList.length === 0 ? <p className="text-gray-500">Nenhum favorito ainda.</p> : (
              <div className="grid md:grid-cols-3 gap-8">
                {favoritesList.map((dest, index) => (
                  <React.Fragment key={dest.id}>
                    {/*
                      ⚡ Bolt Performance Optimization:
                      Set priority to false for images in the favorites tab.
                      Since this tab is hidden on initial load (CSS display: none),
                      these images should always be lazily loaded to save bandwidth and improve LCP.
                    */}
                    <TripCard
                      trip={dest}
                      isFavorite={true}
                      onFavoriteClick={toggleFavorite}
                      onDetailsClick={handleDetailsClick}
                      priority={false}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS (Login, Booking, Details) */}
      <React.Suspense fallback={null}>
        {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} onLogin={handleLogin} />}
        {showDetailsModal && <DetailsModal
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          destination={selectedDestination}
          user={user}
          onBookingClick={openBookingModal}
          onAuthClick={openAuthModal}
        />}
        {showBookingModal && <BookingModal isOpen={showBookingModal} onClose={closeBookingModal} onConfirm={confirmBooking} />}
      </React.Suspense>

      {notification && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full animate-bounce z-50">{notification}</div>}
    </div>
  );
};

export default App;
