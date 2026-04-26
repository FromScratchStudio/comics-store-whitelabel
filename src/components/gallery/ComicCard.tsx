import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comic } from '../../types/comics';

interface Props {
  comic: Comic;
}

const MODE_BADGE: Record<string, string> = {
  images: 'Images',
  pdf: 'PDF',
  html: 'HTML',
};

export default function ComicCard({ comic }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/comic/${comic.id}`}
      className="group flex flex-col rounded-xl overflow-hidden transition-transform active:scale-95"
      style={{ background: 'var(--color-surface-2)' }}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
        {!imgError ? (
          <img
            src={comic.cover}
            alt={comic.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
          >
            📚
          </div>
        )}
        {/* Mode badge */}
        <span
          className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {MODE_BADGE[comic.mode] ?? comic.mode}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--color-text)' }}>
          {comic.title}
        </h3>
        {comic.authors && comic.authors.length > 0 && (
          <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
            {comic.authors.join(', ')}
          </p>
        )}
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {comic.chapters.length} chapter{comic.chapters.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}
