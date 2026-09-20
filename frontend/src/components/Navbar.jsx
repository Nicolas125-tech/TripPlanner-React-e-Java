import React, { memo } from 'react';
import { Plane } from 'lucide-react';

const NAV_TABS = ['home', 'my-trips', 'favorites'];

const Navbar = ({ activeTab, setActiveTab, user, handleLogout, openAuthModal }) => {
  return (
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
  );
};

export default memo(Navbar);
