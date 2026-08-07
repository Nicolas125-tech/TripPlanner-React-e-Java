import React from 'react';

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

export default CategoryPill;
