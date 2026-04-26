import { useState, useEffect, useCallback } from 'react';
import type { Comic } from '../types/comics';
import { catalogService } from '../services/catalog';

interface UseComicsResult {
  comics: Comic[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useComics(): UseComicsResult {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doFetch = useCallback((cancelled: { current: boolean }) => {
    catalogService
      .getCatalog()
      .then((catalog) => {
        if (!cancelled.current) {
          setComics(catalog.comics);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled.current) {
          setError(err instanceof Error ? err.message : 'Failed to load comics');
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    const cancelled = { current: false };
    doFetch(cancelled);
    return () => {
      cancelled.current = true;
    };
  }, [doFetch]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const cancelled = { current: false };
    doFetch(cancelled);
  }, [doFetch]);

  return { comics, loading, error, refetch };
}
