import { useState, useCallback } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { useDebouncedStorage } from './useDebouncedStorage';

export const useTripBookings = () => {
  const [myTrips, setMyTrips] = useState(() => secureStorage.getItem('trip_bookings') || []);
  const debouncedBookingsStorage = useDebouncedStorage('trip_bookings');

  const updateMyTrips = useCallback((trips) => {
    setMyTrips(trips);
    debouncedBookingsStorage(trips);
  }, [debouncedBookingsStorage]);

  const bookTrip = useCallback((trip, bookingData) => {
    const newTrip = {
      ...trip,
      bookingId: Date.now(),
      ...bookingData,
      totalPrice: trip.price * bookingData.guests,
      status: 'Confirmado'
    };
    updateMyTrips([...myTrips, newTrip]);
    return newTrip;
  }, [myTrips, updateMyTrips]);

  return { myTrips, bookTrip, updateMyTrips };
};
