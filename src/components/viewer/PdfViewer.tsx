import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure pdf.js worker – use the bundled worker from pdfjs-dist
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props {
  src: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PdfViewer({ src, initialPage = 0, onPageChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage + 1); // pdf.js is 1-indexed
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  // Load PDF
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadTask = getDocument(src);
    loadTask.promise
      .then((doc) => {
        setPdf(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        setLoading(false);
      });

    return () => {
      loadTask.destroy().catch(() => {});
    };
  }, [src]);

  // Render page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    // Cancel previous render
    renderTaskRef.current?.cancel();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    pdf.getPage(currentPage).then((page) => {
      if (cancelled) return;

      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const task = page.render({ canvas: canvas, canvasContext: ctx, viewport });
      renderTaskRef.current = task;

      task.promise
        .then(() => {
          onPageChange?.(currentPage - 1);
        })
        .catch(() => {
          // Render was cancelled – ignore
        });
    });

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [pdf, currentPage, scale, onPageChange]);

  const goTo = (page: number) => {
    const clamped = Math.max(1, Math.min(numPages, page));
    setCurrentPage(clamped);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#000' }}>
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6" style={{ background: '#000' }}>
        <span className="text-4xl">⚠️</span>
        <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>
          {error}
        </p>
        <p className="text-center text-xs" style={{ color: 'var(--color-muted)' }}>
          PDF source: <code className="break-all">{src}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
      {/* Scrollable canvas area */}
      <div className="flex-1 overflow-auto flex justify-center p-4 scrollbar-hide">
        <canvas ref={canvasRef} className="max-w-full shadow-2xl" />
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-between px-4 py-3 gap-2 shrink-0"
        style={{ background: 'rgba(0,0,0,0.85)' }}
      >
        <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous">
          <ChevronLeft size={24} style={{ color: currentPage === 1 ? 'var(--color-muted)' : 'var(--color-text)' }} />
        </button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {currentPage} / {numPages}
          </span>
          <div className="w-full max-w-xs h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(currentPage / numPages) * 100}%`, background: 'var(--color-accent)' }}
            />
          </div>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            aria-label="Zoom out"
            className="p-1.5 rounded-full"
            style={{ color: 'var(--color-text)' }}
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(4, s + 0.25))}
            aria-label="Zoom in"
            className="p-1.5 rounded-full"
            style={{ color: 'var(--color-text)' }}
          >
            <ZoomIn size={18} />
          </button>
        </div>

        <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === numPages} aria-label="Next">
          <ChevronRight
            size={24}
            style={{ color: currentPage === numPages ? 'var(--color-muted)' : 'var(--color-text)' }}
          />
        </button>
      </div>
    </div>
  );
}
