import { useState, useCallback, useEffect, useRef } from 'react';
import type { ComicPage } from '../../types/comics';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  pages: ComicPage[];
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function ImageViewer({ pages, initialPage = 0, onPageChange }: Props) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loaded, setLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const goTo = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, page));
      setCurrentPage(clamped);
      setLoaded(false);
      onPageChange?.(clamped);
    },
    [pages.length, onPageChange],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentPage + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(currentPage - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goTo(currentPage + 1);
      else goTo(currentPage - 1);
    }
    setTouchStart(null);
  };

  const page = pages[currentPage];
  if (!page) return null;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#000' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Page image */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
            />
          </div>
        )}
        <img
          ref={imgRef}
          key={page.url}
          src={page.url}
          alt={page.alt ?? `Page ${currentPage + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          draggable={false}
        />

        {/* Tap zones */}
        <button
          className="absolute left-0 inset-y-0 w-1/3"
          onClick={() => goTo(currentPage - 1)}
          aria-label="Previous page"
          style={{ opacity: 0 }}
        />
        <button
          className="absolute right-0 inset-y-0 w-1/3"
          onClick={() => goTo(currentPage + 1)}
          aria-label="Next page"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Bottom controls */}
      <div
        className="flex items-center justify-between px-4 py-3 gap-3"
        style={{ background: 'rgba(0,0,0,0.85)' }}
      >
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-full transition-opacity"
          style={{
            color: 'var(--color-text)',
            opacity: currentPage === 0 ? 0.3 : 1,
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Page counter */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {currentPage + 1} / {pages.length}
          </span>
          {/* Progress bar */}
          <div className="w-full max-w-xs h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((currentPage + 1) / pages.length) * 100}%`,
                background: 'var(--color-accent)',
              }}
            />
          </div>
        </div>

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === pages.length - 1}
          className="p-2 rounded-full transition-opacity"
          style={{
            color: 'var(--color-text)',
            opacity: currentPage === pages.length - 1 ? 0.3 : 1,
          }}
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
