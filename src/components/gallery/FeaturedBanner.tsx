import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Comic } from '../../types/comics';

interface Props {
  comics: Comic[];
}

export default function FeaturedBanner({ comics }: Props) {
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (comics.length === 0) return null;

  const current = comics[idx];

  const scrollTo = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(comics.length - 1, newIdx));
    setIdx(clamped);
    scrollRef.current?.children[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      {/* Hero image */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={current.cover}
          alt={current.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.3) 60%, transparent 100%)' }}
        />

        {/* Nav arrows */}
        {comics.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(idx - 1)}
              disabled={idx === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', opacity: idx === 0 ? 0.3 : 1 }}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollTo(idx + 1)}
              disabled={idx === comics.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', opacity: idx === comics.length - 1 ? 0.3 : 1 }}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
            Featured
          </p>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#fff' }}>{current.title}</h2>
          <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {current.description}
          </p>
          <Link
            to={`/comic/${current.id}`}
            className="inline-block text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            Read Now
          </Link>
        </div>
      </div>

      {/* Dots */}
      {comics.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2">
          {comics.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                background: i === idx ? 'var(--color-accent)' : 'var(--color-muted)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
