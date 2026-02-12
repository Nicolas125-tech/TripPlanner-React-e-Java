// src/components/Navbar.jsx
import React from 'react';
import { Plane, LogOut } from 'lucide-react';
import { useTrips } from '../context/TripContext';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user, logout: handleLogout } = useTrips();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onTabChange('home')}
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Plane className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold">
            Trip<span className="text-blue-600">Planner</span>
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          {[
            { id: 'home', label: 'Explorar' },
            { id: 'my-trips', label: 'Minhas Viagens' },
            { id: 'favorites', label: 'Favoritos' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)} 
              className={`text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold hidden sm:block">{user.name}</span>
              <img 
                src={user.avatar} 
                className="w-8 h-8 rounded-full" 
                alt={user.name}
              />
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onTabChange('login')}
              className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
