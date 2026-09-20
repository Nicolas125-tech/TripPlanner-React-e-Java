import { useState, useCallback, useRef } from 'react';
import { useAbortController } from './useAbortController';

export const useTripSearch = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getNewController, isCurrentController } = useAbortController();
  const searchCache = useRef(new Map());

  const searchDestinations = useCallback(async (query) => {
    const normalizedTerm = query ? query.trim() : "";
    const cacheKey = normalizedTerm.toLowerCase() || 'ALL';
    const abortController = getNewController();

    if (searchCache.current.has(cacheKey)) {
      setDestinations(searchCache.current.get(cacheKey));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const url = normalizedTerm
        ? `${baseUrl}/api/trips/search?query=${encodeURIComponent(normalizedTerm)}`
        : `${baseUrl}/api/trips`;

      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error('Erro ao buscar destinos');

      const data = await res.json();

      searchCache.current.set(cacheKey, data);
      setDestinations(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Silently exit if request was intentionally aborted
      }
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      if (isCurrentController(abortController)) {
        setLoading(false);
      }
    }
  }, [getNewController, isCurrentController]);

  return { destinations, loading, error, searchDestinations };
};
