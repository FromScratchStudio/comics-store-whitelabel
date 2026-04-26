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

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catalog = await catalogService.getCatalog();
      setComics(catalog.comics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { comics, loading, error, refetch: fetch };
}
