// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

// ⚡ Bolt Performance Optimization:
// Moved `search` state from App.jsx down to SearchBar.jsx.
// Previously, every keystroke in the input triggered a state update in App.jsx,
// causing a re-render of the entire component tree, including the heavy list of TripCards.
// By holding the input state locally in SearchBar, we isolate these frequent re-renders
// to just this small component, significantly improving responsiveness and overall performance.
const SearchBar = ({ onSearch }) => {
  const [localSearch, setLocalSearch] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(localSearch);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg flex gap-2 p-3">
      <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-lg">
        <MapPin className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          aria-label="Buscar por cidade"
          placeholder="Busque por cidade (Ex: Dubai, Londres, Singapura...)" 
          className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button 
        onClick={() => onSearch(localSearch)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        <Search size={20} /> Buscar
      </button>
    </div>
  );
};

export default SearchBar;
