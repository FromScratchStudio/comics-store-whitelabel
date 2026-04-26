import { useState, useEffect, useCallback } from 'react';
import type { Comic, ChapterRef, ChapterManifest } from '../types/comics';
import { catalogService } from '../services/catalog';
import { storageService } from '../services/storage';

interface UseComicResult {
  comic: Comic | null;
  loading: boolean;
  error: string | null;
}

export function useComic(comicId: string): UseComicResult {
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    catalogService
      .getComic(comicId)
      .then((c) => {
        if (c) {
          setComic(c);
          storageService.addRecent(comicId);
        } else {
          setError('Comic not found');
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, [comicId]);

  return { comic, loading, error };
}

interface UseChapterResult {
  manifest: ChapterManifest | null;
  loading: boolean;
  error: string | null;
}

export function useChapter(chapter: ChapterRef | null): UseChapterResult {
  const [manifest, setManifest] = useState<ChapterManifest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (ch: ChapterRef) => {
    setLoading(true);
    setError(null);
    setManifest(null);
    try {
      const m = await catalogService.getChapterManifest(ch.manifestUrl);
      setManifest(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (chapter) load(chapter);
  }, [chapter, load]);

  return { manifest, loading, error };
}
