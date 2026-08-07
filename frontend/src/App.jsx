import SearchBar from "./components/SearchBar";
import React, { useState, useEffect } from 'react';
import { 
  Plane, MapPin, Calendar, Search, Star, CheckCircle, User, 
  X, ArrowRight, Users, Wifi, Coffee, Map as MapIcon,
  LogOut, Shield, CreditCard, Sun, Mountain, Building, Clock
} from 'lucide-react';
import TripCard from './components/TripCard';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import DetailsModal from './components/DetailsModal';

// --- COMPONENTES AUXILIARES ---

const CategoryPill = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
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


// --- DADOS DE FALLBACK (Caso o Java não esteja rodando) ---
const mockDestinations = [
  { id: 1, city: "Paris", country: "França", price: 4500, rating: 4.8, category: "Cidade", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", description: "A Cidade Luz espera por você.", amenities: ["Wi-Fi", "Café"], reviews: 1240 },
  { id: 2, city: "Tóquio", country: "Japão", price: 6200, rating: 4.9, category: "Cidade", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800", description: "Futuro e tradição.", amenities: ["Spa", "Academia"], reviews: 850 },
  { id: 3, city: "Rio de Janeiro", country: "Brasil", price: 1800, rating: 4.7, category: "Praia", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800", description: "Cidade Maravilhosa.", amenities: ["Piscina", "Mar"], reviews: 3200 }
];

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
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('trip_user')) || null);
  const [myTrips, setMyTrips] = useState(() => JSON.parse(localStorage.getItem('trip_bookings')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('trip_favorites')) || []);
  
  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [notification, setNotification] = useState(null);

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
      const url = normalizedTerm
        ? `http://localhost:8080/api/trips/search?query=${encodeURIComponent(normalizedTerm)}`
        : 'http://localhost:8080/api/trips';
      
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

  useEffect(() => localStorage.setItem('trip_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('trip_bookings', JSON.stringify(myTrips)), [myTrips]);
  useEffect(() => localStorage.setItem('trip_favorites', JSON.stringify(favorites)), [favorites]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (authFormData) => {
    const userData = { name: authFormData.name || "Visitante", email: authFormData.email, avatar: `https://ui-avatars.com/api/?name=${authFormData.name}&background=2563eb&color=fff` };
    setUser(userData);
    setShowAuthModal(false);
    showNotification(`Bem-vindo, ${userData.name}!`);
  };

  const toggleFavorite = React.useCallback((id, isCurrentlyFavorite) => {
    setFavorites(prevFavorites => {
      const isFav = prevFavorites.includes(id);
      return isFav ? prevFavorites.filter(favId => favId !== id) : [...prevFavorites, id];
    });

    if (isCurrentlyFavorite) {
      showNotification("Removido dos favoritos");
    } else {
      showNotification("Adicionado aos favoritos ❤️");
    }
  }, []);

  const handleDetailsClick = React.useCallback((dest) => {
    setSelectedDestination(dest);
    setShowDetailsModal(true);
  }, []);

  const confirmBooking = (bookingFormData) => {
    const newTrip = {
      ...selectedDestination,
      bookingId: Date.now(),
      ...bookingFormData,
      totalPrice: selectedDestination.price * bookingFormData.guests,
      status: 'Confirmado'
    };
    setMyTrips([...myTrips, newTrip]);
    setShowBookingModal(false);
    setActiveTab('my-trips');
    showNotification("Viagem reservada com sucesso! ✈️");
  };

  // ⚡ Bolt Performance Optimization:
  // Wrapped the destinations filter in `React.useMemo` to cache the filtered array
  // and avoid O(N) recalculations on every render when destinations and categoryFilter haven't changed.
  const filteredDestinations = React.useMemo(() => {
    if (categoryFilter === "Todos") return destinations;
    return destinations.filter(d => d.category === categoryFilter);
  }, [destinations, categoryFilter]);

  // ⚡ Bolt Performance Optimization:
  // Converted the 'favorites' array to a Set to enable O(1) lookups during rendering.
  // Previously, Array.includes() caused an O(N) lookup for every item in the list,
  // resulting in O(N*M) time complexity. Using a Set reduces this to O(N).
  const favoriteSet = React.useMemo(() => new Set(favorites), [favorites]);

  // ⚡ Bolt Performance Optimization:
  // Wrapped favoritesList in useMemo to prevent O(N) recalculations on every render.
  // Added an early return for the default empty state, making it O(1) instead of O(N).
  const favoritesList = React.useMemo(() => {
    if (favoriteSet.size === 0) return [];
    return destinations.filter(d => favoriteSet.has(d.id));
  }, [destinations, favoriteSet]);

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
                <img src={user.avatar} className="w-8 h-8 rounded-full cursor-pointer" alt="" onClick={() => {setUser(null); showNotification("Logout realizado");}} />
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold">Entrar</button>
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
                {TRIP_CATEGORIES.map(cat => <CategoryPill key={cat.label} {...cat} active={categoryFilter === cat.label} onClick={() => setCategoryFilter(cat.label)} />)}
              </div>

              {loading ? <div className="text-center py-10">Carregando destinos...</div> : (
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredDestinations.map((dest, index) => (
                    <TripCard
                      key={dest.id}
                      trip={dest}
                      isFavorite={favoriteSet.has(dest.id)}
                      onFavoriteClick={toggleFavorite}
                      onDetailsClick={handleDetailsClick}
                      priority={index < 3}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        {/* Minhas Viagens */}
        {activeTab === 'my-trips' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Minhas Viagens</h2>
            {myTrips.length === 0 ? <p className="text-gray-500">Nenhuma viagem agendada.</p> : (
              <div className="space-y-4">
                {myTrips.map((trip, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border flex gap-4">
                    <img src={trip.imageUrl || trip.image} className="w-24 h-24 object-cover rounded-lg" alt="" />
                    <div>
                      <h3 className="font-bold">{trip.city}</h3>
                      <p className="text-sm text-gray-500">Status: {trip.status}</p>
                      <p className="text-sm text-gray-500">Ida: {trip.dateStart} | Volta: {trip.dateEnd}</p>
                      <p className="font-bold text-blue-600 mt-2">Total: R$ {trip.totalPrice}</p>
                    </div>
                  </div>
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
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        destination={selectedDestination}
        user={user}
        onBookingClick={() => setShowBookingModal(true)}
        onAuthClick={() => setShowAuthModal(true)}
      />
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} onConfirm={confirmBooking} />

      {notification && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full animate-bounce z-50">{notification}</div>}
    </div>
  );
};

export default App;
