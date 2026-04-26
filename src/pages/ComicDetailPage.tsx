import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, BookOpen } from 'lucide-react';
import { useComic } from '../hooks/useComic';
import { useAppStore } from '../store/appStore';
import Header from '../components/layout/Header';
import PageLayout from '../components/layout/PageLayout';
import type { ChapterRef } from '../types/comics';

const MODE_ICON: Record<string, string> = {
  images: '🖼️',
  pdf: '📄',
  html: '🌐',
};

export default function ComicDetailPage() {
  const { comicId } = useParams<{ comicId: string }>();
  const { comic, loading, error } = useComic(comicId ?? '');
  const toggleFavourite = useAppStore((s) => s.toggleFavourite);
  const library = useAppStore((s) => s.library);
  const [imgError, setImgError] = useState(false);

  const isFav = comic ? library.favourites.includes(comic.id) : false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-6">
        <span className="text-5xl">😕</span>
        <p className="text-center" style={{ color: 'var(--color-muted)' }}>
          {error ?? 'Comic not found'}
        </p>
        <Link to="/" style={{ color: 'var(--color-accent)' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header
        title={comic.title}
        showBack
        backTo="/"
        actions={
          <button
            onClick={() => toggleFavourite(comic.id)}
            aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
            className="p-2 rounded-full"
          >
            <Heart
              size={22}
              fill={isFav ? 'var(--color-accent)' : 'none'}
              style={{ color: 'var(--color-accent)' }}
            />
          </button>
        }
      />
      <PageLayout>
        {/* Hero */}
        <div className="relative h-52 overflow-hidden">
          {!imgError ? (
            <img
              src={comic.cover}
              alt={comic.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
            >
              📚
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--color-bg) 0%, rgba(15,15,26,0.4) 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Meta */}
        <div className="px-4 pb-4">
          <h1 className="text-2xl font-bold mt-2 mb-1" style={{ color: 'var(--color-text)' }}>
            {comic.title}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              {MODE_ICON[comic.mode]} {comic.mode.toUpperCase()}
            </span>
            {comic.genres?.map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-muted)' }}
              >
                {g}
              </span>
            ))}
          </div>

          {comic.authors && (
            <p className="text-sm mb-2" style={{ color: 'var(--color-muted)' }}>
              By {comic.authors.join(', ')}
              {comic.year ? ` · ${comic.year}` : ''}
            </p>
          )}

          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {comic.description}
          </p>
        </div>

        {/* Chapters */}
        <div className="px-4 pb-8">
          <h2 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>
            <BookOpen size={16} className="inline mr-2" />
            Chapters ({comic.chapters.length})
          </h2>
          <ul className="flex flex-col gap-2">
            {comic.chapters.map((ch: ChapterRef) => (
              <li key={ch.id}>
                <Link
                  to={`/comic/${comic.id}/read/${ch.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ background: 'var(--color-surface-2)' }}
                >
                  {/* Chapter number */}
                  <span
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-surface)', color: 'var(--color-accent)' }}
                  >
                    {ch.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {ch.title}
                    </p>
                    {ch.date && (
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {new Date(ch.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {ch.free && (
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(89,214,100,0.2)', color: '#4cd66a' }}
                    >
                      Free
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageLayout>
    </>
  );
}
