// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ text = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
