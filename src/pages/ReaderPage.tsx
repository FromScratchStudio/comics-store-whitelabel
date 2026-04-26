import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { X, List } from 'lucide-react';
import { useComic, useChapter } from '../hooks/useComic';
import { storageService } from '../services/storage';
import ImageViewer from '../components/viewer/ImageViewer';
import HtmlViewer from '../components/viewer/HtmlViewer';
import type { ChapterRef } from '../types/comics';

// Lazy-load the heavy PDF viewer (pulls in pdfjs-dist ~1 MB)
const PdfViewer = lazy(() => import('../components/viewer/PdfViewer'));

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: '#000' }}>
      <div
        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

export default function ReaderPage() {
  const { comicId = '', chapterId = '' } = useParams<{ comicId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { comic, loading: comicLoading } = useComic(comicId);
  const [showChapters, setShowChapters] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const chapter = comic?.chapters.find((c) => c.id === chapterId) ?? null;
  const { manifest, loading: chapterLoading, error: chapterError } = useChapter(chapter);

  const savedProgress = storageService.getProgress(comicId, chapterId);

  useEffect(() => {
    const timer = setTimeout(() => setControlsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [controlsVisible]);

  const handleTap = useCallback(() => {
    setControlsVisible((v) => !v);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      storageService.saveProgress({ comicId, chapterId, page, updatedAt: Date.now() });
    },
    [comicId, chapterId],
  );

  const handleScrollChange = useCallback(
    (scroll: number) => {
      storageService.saveProgress({ comicId, chapterId, scroll, updatedAt: Date.now() });
    },
    [comicId, chapterId],
  );

  const resolveUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${import.meta.env.BASE_URL ?? '/'}${url.startsWith('/') ? url.slice(1) : url}`;
  };

  const isLoading = comicLoading || chapterLoading;

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: '#000' }}
      onClick={handleTap}
    >
      {/* Overlay header */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 safe-top transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
          opacity: controlsVisible ? 1 : 0,
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to={`/comic/${comicId}`}
          className="p-2 rounded-full"
          style={{ color: '#fff' }}
          aria-label="Close reader"
        >
          <X size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: '#fff' }}>
            {comic?.title ?? '…'}
          </p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {chapter?.title ?? chapterId}
          </p>
        </div>
        <button
          onClick={() => setShowChapters(true)}
          className="p-2 rounded-full"
          style={{ color: '#fff' }}
          aria-label="Chapter list"
        >
          <List size={22} />
        </button>
      </div>

      {/* Loading */}
      {isLoading && <Spinner />}

      {/* Error */}
      {!isLoading && chapterError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <span className="text-5xl">⚠️</span>
          <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            {chapterError}
          </p>
          <Link to={`/comic/${comicId}`} style={{ color: 'var(--color-accent)' }}>
            ← Back to comic
          </Link>
        </div>
      )}

      {/* Viewer */}
      {!isLoading && !chapterError && manifest && comic && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {comic.mode === 'images' && manifest.pages && (
            <ImageViewer
              pages={manifest.pages}
              initialPage={savedProgress?.page ?? 0}
              onPageChange={handlePageChange}
            />
          )}

          {comic.mode === 'pdf' && manifest.src && (
            <Suspense fallback={<Spinner />}>
              <PdfViewer
                src={resolveUrl(manifest.src)}
                initialPage={savedProgress?.page ?? 0}
                onPageChange={handlePageChange}
              />
            </Suspense>
          )}

          {comic.mode === 'html' && manifest.src && (
            <HtmlViewer src={resolveUrl(manifest.src)} onScroll={handleScrollChange} />
          )}
        </div>
      )}

      {/* Chapter list drawer */}
      {showChapters && (
        <div
          className="absolute inset-0 z-[60] flex"
          onClick={() => setShowChapters(false)}
        >
          <div className="flex-1" />
          <div
            className="w-80 max-w-full h-full flex flex-col safe-top safe-bottom"
            style={{ background: 'var(--color-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>Chapters</h3>
              <button onClick={() => setShowChapters(false)} style={{ color: 'var(--color-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto py-2">
              {comic?.chapters.map((ch: ChapterRef) => (
                <li key={ch.id}>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                    style={{
                      background: ch.id === chapterId ? 'rgba(233,69,96,0.15)' : 'transparent',
                    }}
                    onClick={() => {
                      setShowChapters(false);
                      navigate(`/comic/${comicId}/read/${ch.id}`);
                    }}
                  >
                    <span
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: ch.id === chapterId ? 'var(--color-accent)' : 'var(--color-surface-2)',
                        color: ch.id === chapterId ? '#fff' : 'var(--color-muted)',
                      }}
                    >
                      {ch.number}
                    </span>
                    <span className="flex-1 text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {ch.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
