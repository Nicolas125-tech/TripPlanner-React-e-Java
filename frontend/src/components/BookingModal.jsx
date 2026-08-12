import React from 'react';
import Modal from './Modal';

const BookingForm = ({ onConfirm }) => {
  const [bookingData, setBookingData] = React.useState({ dateStart: '', dateEnd: '', guests: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateStart" className="text-sm">Ida</label>
          <input
            id="dateStart"
            type="date"
            required
            className="w-full border p-2 rounded"
            onChange={e => setBookingData({...bookingData, dateStart: e.target.value})}
          />
        </div>
        <div>
          <label htmlFor="dateEnd" className="text-sm">Volta</label>
          <input
            id="dateEnd"
            type="date"
            required
            className="w-full border p-2 rounded"
            onChange={e => setBookingData({...bookingData, dateEnd: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label htmlFor="guests" className="text-sm">Hóspedes</label>
        <input
          id="guests"
          type="number"
          min="1"
          className="w-full border p-2 rounded"
          value={bookingData.guests}
          onChange={e => setBookingData({...bookingData, guests: Number(e.target.value)})}
        />
      </div>
      <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">Confirmar Pagamento</button>
    </form>
  );
};

const BookingModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Reserva">
      <BookingForm onConfirm={onConfirm} />
    </Modal>
  );
};

export default BookingModal;
