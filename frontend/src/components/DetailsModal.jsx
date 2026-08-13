import React from 'react';
import Modal from './Modal';

const DetailsModal = ({ isOpen, onClose, destination, user, onBookingClick, onAuthClick }) => {
  if (!destination) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={destination.city}>
      <div>
        <img src={destination.imageUrl || destination.image} className="w-full h-56 object-cover rounded-lg mb-4" alt="" />
        <p className="text-gray-600 mb-4">{destination.description}</p>
        <div className="flex gap-2 mb-6">
          {destination.amenities?.map((am, i) => (
            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
              {am}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            if (!user) {
              onClose();
              onAuthClick();
              return;
            }
            onClose();
            onBookingClick();
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          Reservar Agora
        </button>
      </div>
    </Modal>
  );
};

export default React.memo(DetailsModal);
