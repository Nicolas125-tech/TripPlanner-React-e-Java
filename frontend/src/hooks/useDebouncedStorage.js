import { useCallback, useMemo } from 'react';
import { debounce } from '../utils/debounce';
import { secureStorage } from '../utils/secureStorage';

/**
 * Hook to return a debounced function for setting an item in secureStorage.
 * @param {string} key The storage key.
 * @param {number} delay The debounce delay in milliseconds (default 300).
 * @param {boolean} [transformToArray=false] Whether to convert a Set (or iterable) to an array before storage.
 * @returns {Function} The debounced function.
 */
export function useDebouncedStorage(key, delay = 300, transformToArray = false) {
  // Use useMemo to hold the debounced function so we don't recreate it on every render
  const debouncedFunc = useMemo(() =>
    debounce((value) => {
      const storedValue = transformToArray ? Array.from(value) : value;
      secureStorage.setItem(key, storedValue);
    }, delay)
  , [key, delay, transformToArray]);

  // Expose the debounced function securely wrapped in useCallback
  return useCallback((value) => {
    debouncedFunc(value);
  }, [debouncedFunc]);
}
