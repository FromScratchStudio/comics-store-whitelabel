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
    let cancelled = false;
    catalogService
      .getComic(comicId)
      .then((c) => {
        if (cancelled) return;
        if (c) {
          setComic(c);
          setError(null);
          storageService.addRecent(comicId);
        } else {
          setError('Comic not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Error');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [comicId]);

  return { comic, loading, error };
}

interface UseChapterResult {
  manifest: ChapterManifest | null;
  loading: boolean;
  error: string | null;
}

interface ChapterState {
  manifest: ChapterManifest | null;
  error: string | null;
  /** The manifestUrl this result was loaded for (null = not yet loaded) */
  loadedFor: string | null;
}

export function useChapter(chapter: ChapterRef | null): UseChapterResult {
  const [state, setState] = useState<ChapterState>({
    manifest: null,
    error: null,
    loadedFor: null,
  });

  const load = useCallback((ch: ChapterRef, cancelled: { current: boolean }) => {
    catalogService
      .getChapterManifest(ch.manifestUrl)
      .then((m) => {
        if (cancelled.current) return;
        setState({ manifest: m, error: null, loadedFor: ch.manifestUrl });
      })
      .catch((err) => {
        if (cancelled.current) return;
        setState({
          manifest: null,
          error: err instanceof Error ? err.message : 'Failed to load chapter',
          loadedFor: ch.manifestUrl,
        });
      });
  }, []);

  useEffect(() => {
    if (!chapter) return;
    const cancelled = { current: false };
    load(chapter, cancelled);
    return () => {
      cancelled.current = true;
    };
  }, [chapter, load]);

  // Derive loading: a chapter is in-flight when we have one but haven't loaded it yet
  const loading =
    chapter !== null &&
    state.loadedFor !== chapter.manifestUrl &&
    state.error === null;

  return {
    manifest: state.loadedFor === chapter?.manifestUrl ? state.manifest : null,
    loading,
    error: state.loadedFor === chapter?.manifestUrl ? state.error : null,
  };
}
