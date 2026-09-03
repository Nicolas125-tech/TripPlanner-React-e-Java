import React, { memo } from 'react';

// ⚡ Bolt Performance Optimization:
// Extracted the inline 'Minhas Viagens' item into its own component and wrapped it in React.memo.
// This prevents O(N) re-renders of the entire booked trips list when the parent App component
// re-renders due to unrelated state changes (like switching tabs or updating global context).
const MyTripCard = ({ trip }) => {
  return (
    <div className="bg-white p-4 rounded-xl border flex gap-4">
      <img src={trip.imageUrl || trip.image} className="w-24 h-24 object-cover rounded-lg" alt={trip.city} />
      <div>
        <h3 className="font-bold">{trip.city}</h3>
        <p className="text-sm text-gray-500">Status: {trip.status}</p>
        <p className="text-sm text-gray-500">Ida: {trip.dateStart} | Volta: {trip.dateEnd}</p>
        <p className="font-bold text-blue-600 mt-2">Total: R$ {trip.totalPrice}</p>
      </div>
    </div>
  );
};

export default memo(MyTripCard);
