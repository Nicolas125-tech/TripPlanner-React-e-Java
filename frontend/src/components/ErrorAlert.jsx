// src/components/ErrorAlert.jsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 max-w-md z-40 animate-in">
      <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
      <div className="flex-1">
        <h3 className="font-semibold text-red-900">Erro</h3>
        <p className="text-red-700 text-sm mt-1">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-red-600 hover:text-red-900"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ErrorAlert;
