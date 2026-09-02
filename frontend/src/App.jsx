import SearchBar from "./components/SearchBar";
import React, { useState, useEffect } from 'react';
import { secureStorage } from './utils/secureStorage';
import { Plane, Map as MapIcon, Sun, Mountain, Building } from 'lucide-react';
import TripCard from './components/TripCard';
import MyTripCard from './components/MyTripCard';

// ⚡ Bolt Performance Optimization:
// Code-split Modals using React.lazy to reduce the initial JavaScript bundle size.
// Since these modals are hidden on load, dynamically importing them defers fetching
// their respective chunks (~3.9kB combined) until the user actually interacts with them,
// improving Time to Interactive (TTI) and saving bandwidth.
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const BookingModal = React.lazy(() => import('./components/BookingModal'));
const DetailsModal = React.lazy(() => import('./components/DetailsModal'));
import { mockDestinations } from './utils/fallbackData';
import { debounce } from './utils/debounce';

// --- COMPONENTES AUXILIARES ---

// ⚡ Bolt Performance Optimization:
// Wrapped CategoryPill in React.memo to prevent unnecessary O(N) re-renders
// when unrelated state (like modals or tabs) changes in the parent App.jsx.
const CategoryPill = React.memo(function CategoryPill({ icon, label, active, onClick }) {
  const handleClick = React.useCallback(() => {
    onClick(label);
  }, [label, onClick]);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
        active
        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
});



// --- COMPONENTES DE FORMULÁRIO (Para evitar re-render do App) ---


// --- APP PRINCIPAL ---


const NAV_TABS = ['home', 'my-trips', 'favorites'];

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
  
  // Dados
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persistence
  const [user, setUser] = useState(() => secureStorage.getItem('trip_user') || null);
  const [myTrips, setMyTrips] = useState(() => secureStorage.getItem('trip_bookings') || []);
  const [favorites, setFavorites] = useState(() => new Set(secureStorage.getItem('trip_favorites') || []));
  
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


  // ⚡ Bolt Performance Optimization:
  // Added a local cache (searchCache) for API responses.
  // This avoids redundant network requests for identical searches (e.g., clearing the search bar or typing a previously searched term).
  // It provides instant (0ms) results for cached queries, reducing server load and drastically improving perceived frontend responsiveness.
  const searchCache = React.useRef(new Map());

  // Buscar dados da API JAVA
  // ⚡ Bolt Performance Optimization:
  // Wrapped performSearch in useCallback to prevent it from being recreated on every render.
  // This ensures that the reference to performSearch is stable, preventing unnecessary re-renders
  // of children components (like SearchBar) that receive it as a prop.
  const performSearch = React.useCallback(async (searchTerm) => {
    // ⚡ Bolt Performance Optimization:
    // Normalized the search term (trimmed whitespace and lowercased) before generating the cache key.
    // This dramatically increases cache hit rates by treating equivalent searches (like "Paris", "paris", and " Paris ")
    // as identical, avoiding unnecessary API requests and subsequent React re-renders.
    const normalizedTerm = searchTerm ? searchTerm.trim() : "";
    const cacheKey = normalizedTerm.toLowerCase() || 'ALL';

    if (searchCache.current.has(cacheKey)) {
      setDestinations(searchCache.current.get(cacheKey));
      return;
    }

    setLoading(true);
    try {
      // Se tiver termo, busca específico. Se não, busca tudo.
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = normalizedTerm
        ? `${baseUrl}/api/trips/search?query=${encodeURIComponent(normalizedTerm)}`
        : `${baseUrl}/api/trips`;
      
      const res = await fetch(url);
      const data = await res.json();

      searchCache.current.set(cacheKey, data);
      setDestinations(data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setDestinations(mockDestinations);
      // Fallback mantém os dados atuais
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregamento inicial
  useEffect(() => {
    performSearch("");
  }, [performSearch]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped sessionStorage I/O and JSON.stringify in debounced callbacks.
  // This prevents expensive serialization and main thread blocking during rapid state updates.
  // Each key gets its own debounced instance to prevent them from cancelling each other out.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUserStorage = React.useCallback(
    debounce((value) => secureStorage.setItem('trip_user', value), 300),
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedBookingsStorage = React.useCallback(
    debounce((value) => secureStorage.setItem('trip_bookings', value), 300),
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFavoritesStorage = React.useCallback(
    debounce((value) => secureStorage.setItem('trip_favorites', Array.from(value)), 300),
    []
  );

  useEffect(() => debouncedUserStorage(user), [user, debouncedUserStorage]);
  useEffect(() => debouncedBookingsStorage(myTrips), [myTrips, debouncedBookingsStorage]);
  useEffect(() => debouncedFavoritesStorage(favorites), [favorites, debouncedFavoritesStorage]);

  const showNotification = React.useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleLogout = React.useCallback(() => {
    setUser(null);
    showNotification("Logout realizado");
  }, [showNotification]);

  const handleLogin = React.useCallback((authFormData) => {
    const userData = {
      name: authFormData.name || "Visitante",
      email: authFormData.email,
      avatar: `https://ui-avatars.com/api/?name=${authFormData.name}&background=2563eb&color=fff`
    };
    setUser(userData);
    setShowAuthModal(false);
    showNotification(`Bem-vindo, ${userData.name}!`);
  }, [showNotification]);

  const toggleFavorite = React.useCallback((id, isCurrentlyFavorite) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });

    if (isCurrentlyFavorite) {
      showNotification("Removido dos favoritos");
    } else {
      showNotification("Adicionado aos favoritos ❤️");
    }
  }, [showNotification]);

  const handleDetailsClick = React.useCallback((dest) => {
    setSelectedDestination(dest);
    setShowDetailsModal(true);
  }, []);

  // ⚡ Bolt Performance Optimization:
  // Wrapped confirmBooking in React.useCallback to prevent unnecessary re-renders of BookingModal.
  // Updated to use functional state updates (prev => [...prev, newTrip]) to remove `myTrips` from the
  // dependency array, ensuring the callback reference remains perfectly stable even as new trips are booked.
  const confirmBooking = React.useCallback((bookingFormData) => {
    const newTrip = {
      ...selectedDestination,
      bookingId: Date.now(),
      ...bookingFormData,
      totalPrice: selectedDestination.price * bookingFormData.guests,
      status: 'Confirmado'
    };
    setMyTrips(prev => [...prev, newTrip]);
    setShowBookingModal(false);
    setActiveTab('my-trips');
    showNotification("Viagem reservada com sucesso! ✈️");
  }, [selectedDestination, showNotification]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped the destinations filter in `React.useMemo` to cache the filtered array
  // and avoid O(N) recalculations on every render when destinations and categoryFilter haven't changed.
  const filteredDestinations = React.useMemo(() => {
    if (categoryFilter === "Todos") return destinations;
    return destinations.filter(d => d.category === categoryFilter);
  }, [destinations, categoryFilter]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped favoritesList in useMemo to prevent O(N) recalculations on every render.
  // Added an early return for the default empty state, making it O(1) instead of O(N).
  const favoritesList = React.useMemo(() => {
    if (favorites.size === 0) return [];
    return destinations.filter(d => favorites.has(d.id));
  }, [destinations, favorites]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-600 p-2 rounded-lg"><Plane className="text-white w-6 h-6" /></div>
            <span className="text-xl font-bold">Trip<span className="text-blue-600">Planner</span></span>
          </div>
          <div className="hidden md:flex space-x-8">
            {NAV_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-medium ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab === 'home' ? 'Explorar' : tab === 'my-trips' ? 'Minhas Viagens' : 'Favoritos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold hidden sm:block">{user.name}</span>
                <img src={user.avatar} className="w-8 h-8 rounded-full cursor-pointer" alt={`${user.name}'s avatar`} onClick={handleLogout} />
              </div>
            ) : (
              <button onClick={openAuthModal} className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold">Entrar</button>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="pt-16">
        {activeTab === 'home' && (
          <>
            <div className="bg-blue-900 py-20 px-4 text-center text-white mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Para onde você quer ir?</h1>
              <SearchBar onSearch={performSearch} />
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
                      isFavorite={favorites.has(dest.id)}
                      onFavoriteClick={toggleFavorite}
                      onDetailsClick={handleDetailsClick}
                      priority={index < 3}
                    />
                  ))}
                </div>
              </div>
            </main>
          </>
        )}

        {/* Minhas Viagens */}
        {activeTab === 'my-trips' && (
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
        )}

        {/* Favoritos */}
        {activeTab === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Meus Favoritos</h2>
            {favoritesList.length === 0 ? <p className="text-gray-500">Nenhum favorito ainda.</p> : (
              <div className="grid md:grid-cols-3 gap-8">
                {favoritesList.map((dest, index) => (
                  <TripCard
                    key={dest.id}
                    trip={dest}
                    isFavorite={true}
                    onFavoriteClick={toggleFavorite}
                    onDetailsClick={handleDetailsClick}
                    priority={index < 3}
                  />
                ))}
              </div>
            )}
          </div>
        )}
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
