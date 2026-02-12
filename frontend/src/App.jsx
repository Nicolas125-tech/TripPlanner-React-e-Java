import React, { useState, useEffect } from 'react';
import { 
  Plane, MapPin, Calendar, Search, Star, CheckCircle, User, 
  Menu, X, ArrowRight, Heart, Users, Wifi, Coffee, Map as MapIcon, 
  LogOut, Shield, CreditCard, Sun, Mountain, Building, Clock
} from 'lucide-react';

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

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- DADOS DE FALLBACK (Caso o Java não esteja rodando) ---
const mockDestinations = [
  { id: 1, city: "Paris", country: "França", price: 4500, rating: 4.8, category: "Cidade", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", description: "A Cidade Luz espera por você.", amenities: ["Wi-Fi", "Café"], reviews: 1240 },
  { id: 2, city: "Tóquio", country: "Japão", price: 6200, rating: 4.9, category: "Cidade", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800", description: "Futuro e tradição.", amenities: ["Spa", "Academia"], reviews: 850 },
  { id: 3, city: "Rio de Janeiro", country: "Brasil", price: 1800, rating: 4.7, category: "Praia", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800", description: "Cidade Maravilhosa.", amenities: ["Piscina", "Mar"], reviews: 3200 }
];

// --- APP PRINCIPAL ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState("");
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
  const [bookingData, setBookingData] = useState({ dateStart: '', dateEnd: '', guests: 1 });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Buscar dados da API JAVA
  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      // Se tiver termo, busca específico. Se não, busca tudo.
      const url = searchTerm 
        ? `http://localhost:8080/api/trips/search?query=${encodeURIComponent(searchTerm)}` 
        : 'http://localhost:8080/api/trips';
      
      const res = await fetch(url);
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setDestinations(mockDestinations);
      // Fallback mantém os dados atuais
    } finally {
      setLoading(false);
    }
  };

  // Carregamento inicial
  useEffect(() => {
    performSearch("");
  }, []);

  useEffect(() => localStorage.setItem('trip_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('trip_bookings', JSON.stringify(myTrips)), [myTrips]);
  useEffect(() => localStorage.setItem('trip_favorites', JSON.stringify(favorites)), [favorites]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { name: authForm.name || "Visitante", email: authForm.email, avatar: `https://ui-avatars.com/api/?name=${authForm.name}&background=2563eb&color=fff` };
    setUser(userData);
    setShowAuthModal(false);
    showNotification(`Bem-vindo, ${userData.name}!`);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      showNotification("Removido dos favoritos");
    } else {
      setFavorites([...favorites, id]);
      showNotification("Adicionado aos favoritos ❤️");
    }
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    const newTrip = {
      ...selectedDestination,
      bookingId: Date.now(),
      ...bookingData,
      totalPrice: selectedDestination.price * bookingData.guests,
      status: 'Confirmado'
    };
    setMyTrips([...myTrips, newTrip]);
    setShowBookingModal(false);
    setActiveTab('my-trips');
    showNotification("Viagem reservada com sucesso! ✈️");
  };

  const filteredDestinations = destinations.filter(d => {
    const matchesCategory = categoryFilter === "Todos" || d.category === categoryFilter;
    return matchesCategory;
  });

  const favoritesList = destinations.filter(d => favorites.includes(d.id));

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
            {['home', 'my-trips', 'favorites'].map(tab => (
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
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg flex gap-2 p-3">
                <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="text" 
                    placeholder="Busque por cidade (Ex: Dubai, Londres, Singapura...)" 
                    className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch(search)}
                  />
                </div>
                <button 
                  onClick={() => performSearch(search)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Search size={20} /> Buscar
                </button>
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4">
              <div className="flex gap-4 overflow-x-auto pb-6 mb-4">
                {[
                  { label: "Todos", icon: <MapIcon size={16} /> },
                  { label: "Praia", icon: <Sun size={16} /> },
                  { label: "Cidade", icon: <Building size={16} /> },
                  { label: "Montanha", icon: <Mountain size={16} /> }
                ].map(cat => <CategoryPill key={cat.label} {...cat} active={categoryFilter === cat.label} onClick={() => setCategoryFilter(cat.label)} />)}
              </div>

              {loading ? <div className="text-center py-10">Carregando destinos...</div> : (
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredDestinations.map(dest => (
                    <div key={dest.id} onClick={() => { setSelectedDestination(dest); setShowDetailsModal(true); }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                      <div className="relative h-56">
                        <img src={dest.imageUrl || dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {dest.rating}</div>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(dest.id); }} className="absolute top-4 left-4 p-2 rounded-full bg-white/30 hover:bg-white text-white hover:text-red-500 transition-colors">
                          <Heart size={18} className={favorites.includes(dest.id) ? "fill-red-500 text-red-500" : ""} />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold">{dest.city}</h3>
                        <p className="text-gray-500 text-sm mb-4">{dest.country}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">R$ {dest.price}</span>
                          <button className="text-blue-600 text-sm font-bold">Ver Detalhes</button>
                        </div>
                      </div>
                    </div>
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
                {favoritesList.map(dest => (
                  <div key={dest.id} onClick={() => { setSelectedDestination(dest); setShowDetailsModal(true); }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div className="relative h-56">
                      <img src={dest.imageUrl || dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg text-xs font-bold flex gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {dest.rating}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold">{dest.city}</h3>
                      <p className="text-gray-500 text-sm mb-4">{dest.country}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">R$ {dest.price}</span>
                        <button className="text-blue-600 text-sm font-bold">Ver Detalhes</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS (Login, Booking, Details) */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Acesse sua conta">
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Nome" className="w-full border p-2 rounded" onChange={e => setAuthForm({...authForm, name: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={e => setAuthForm({...authForm, email: e.target.value})} />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Entrar</button>
        </form>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title={selectedDestination?.city}>
        {selectedDestination && (
          <div>
            <img src={selectedDestination.imageUrl || selectedDestination.image} className="w-full h-56 object-cover rounded-lg mb-4" alt="" />
            <p className="text-gray-600 mb-4">{selectedDestination.description}</p>
            <div className="flex gap-2 mb-6">
              {selectedDestination.amenities?.map((am, i) => <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">{am}</span>)}
            </div>
            <button onClick={() => { 
              if(!user) { setShowDetailsModal(false); setShowAuthModal(true); return; }
              setShowDetailsModal(false); setShowBookingModal(true); 
            }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Reservar Agora</button>
          </div>
        )}
      </Modal>

      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Confirmar Reserva">
        <form onSubmit={confirmBooking} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm">Ida</label><input type="date" required className="w-full border p-2 rounded" onChange={e => setBookingData({...bookingData, dateStart: e.target.value})} /></div>
            <div><label className="text-sm">Volta</label><input type="date" required className="w-full border p-2 rounded" onChange={e => setBookingData({...bookingData, dateEnd: e.target.value})} /></div>
          </div>
          <div><label className="text-sm">Hóspedes</label><input type="number" min="1" className="w-full border p-2 rounded" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: Number(e.target.value)})} /></div>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">Confirmar Pagamento</button>
        </form>
      </Modal>

      {notification && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full animate-bounce z-50">{notification}</div>}
    </div>
  );
};

export default App;
