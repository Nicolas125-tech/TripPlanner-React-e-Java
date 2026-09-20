import { useState, useCallback } from 'react';
import { secureStorage } from '../utils/secureStorage';
import { useDebouncedStorage } from './useDebouncedStorage';

export const useTripUser = () => {
  const [user, setUser] = useState(() => secureStorage.getItem('trip_user') || null);
  const debouncedUserStorage = useDebouncedStorage('trip_user');

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    debouncedUserStorage(newUser);
  }, [debouncedUserStorage]);

  const login = useCallback((name, email) => {
    const userData = {
      name: name || "Visitante",
      email: email || "guest@tripplanner.com",
      avatar: `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff`
    };
    updateUser(userData);
    return userData;
  }, [updateUser]);

  const logout = useCallback(() => {
    updateUser(null);
  }, [updateUser]);

  return { user, login, logout, updateUser };
};
