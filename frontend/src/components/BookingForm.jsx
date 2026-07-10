import React, { useState } from 'react';

// ⚡ Bolt Performance Optimization:
// Moved `bookingData` state out of App.jsx into this dedicated BookingForm component.
// Previously, every keystroke in the booking form updated App.jsx's state,
// causing a full re-render of the entire application tree (including all TripCards).
// By localizing the state here, typing in the form only re-renders this tiny component,
// significantly improving performance.
const BookingForm = ({ onSubmit }) => {
  const [bookingData, setBookingData] = useState({ dateStart: '', dateEnd: '', guests: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookingData);
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
            value={bookingData.dateStart}
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
            value={bookingData.dateEnd}
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
      <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
        Confirmar Pagamento
      </button>
    </form>
  );
};

export default BookingForm;
