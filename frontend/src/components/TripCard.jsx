// src/components/TripCard.jsx
import React from 'react';
import { Heart, Star } from 'lucide-react';

const TripCard = ({ trip, isFavorite, onFavoriteClick, onDetailsClick }) => {
  return (
    <div 
      onClick={onDetailsClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative h-56">
        <img 
          src={trip.imageUrl || trip.image} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={trip.city}
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold flex gap-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" /> 
          {trip.rating?.toFixed(1)}
        </div>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onFavoriteClick(trip.id); 
          }} 
          className="absolute top-4 left-4 p-2 rounded-full bg-white/30 hover:bg-white text-white hover:text-red-500 transition-colors"
        >
          <Heart 
            size={18} 
            className={isFavorite ? "fill-red-500 text-red-500" : ""} 
          />
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{trip.city}</h3>
        <p className="text-gray-500 text-sm mb-4">{trip.country}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">R$ {Math.round(trip.price)}</span>
          <button className="text-blue-600 text-sm font-bold hover:underline">Ver Detalhes</button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
