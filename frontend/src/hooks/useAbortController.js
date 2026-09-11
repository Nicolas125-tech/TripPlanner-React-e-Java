import { useRef, useCallback, useEffect } from 'react';

export const useAbortController = () => {
  const abortControllerRef = useRef(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const getNewController = useCallback(() => {
    abort();
    const newController = new AbortController();
    abortControllerRef.current = newController;
    return newController;
  }, [abort]);

  const isCurrentController = useCallback((controller) => {
    return abortControllerRef.current === controller;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    getNewController,
    abort,
    isCurrentController,
  };
};
