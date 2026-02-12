// src/components/SearchBar.jsx
import React from 'react';
import { MapPin, Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSearch, onKeyDown }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg flex gap-2 p-3">
      <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-lg">
        <MapPin className="text-gray-400 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Busque por cidade (Ex: Dubai, Londres, Singapura...)" 
          className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <button 
        onClick={onSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        <Search size={20} /> Buscar
      </button>
    </div>
  );
};

export default SearchBar;
