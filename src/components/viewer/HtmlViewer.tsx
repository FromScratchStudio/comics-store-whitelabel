import { useRef, useState } from 'react';

interface Props {
  src: string;
  onScroll?: (progress: number) => void;
}

export default function HtmlViewer({ src, onScroll }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [prevSrc, setPrevSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset loading/error state when src changes (derived state from props pattern)
  if (prevSrc !== src) {
    setPrevSrc(src);
    setLoading(true);
    setError(false);
  }

  const handleLoad = () => {
    setLoading(false);

    // Inject scroll tracking into the iframe
    try {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.addEventListener('scroll', () => {
        const scrollEl = doc.documentElement;
        const progress =
          scrollEl.scrollHeight > scrollEl.clientHeight
            ? scrollEl.scrollTop / (scrollEl.scrollHeight - scrollEl.clientHeight)
            : 0;
        onScroll?.(progress);
      });
    } catch {
      // Cross-origin – cannot attach scroll listener; ignore
    }
  };

  return (
    <div className="relative flex-1 flex flex-col" style={{ background: '#000' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: '#000' }}>
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
          />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 z-10">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm text-center" style={{ color: 'var(--color-muted)' }}>
            Unable to load the HTML comic.
          </p>
          <p className="text-xs break-all" style={{ color: 'var(--color-muted)' }}>
            {src}
          </p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src}
        title="HTML Comic Reader"
        className="flex-1 w-full border-0"
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.2s' }}
        onLoad={handleLoad}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        sandbox="allow-same-origin allow-scripts"
        allow="autoplay"
      />
    </div>
  );
}
