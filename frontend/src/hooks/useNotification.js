// src/hooks/useNotification.js
import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, closeNotification };
};

export default useNotification;
