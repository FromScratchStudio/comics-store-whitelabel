import { useState } from 'react';
import { useComics } from '../hooks/useComics';
import ComicGrid from '../components/gallery/ComicGrid';
import Header from '../components/layout/Header';
import PageLayout from '../components/layout/PageLayout';
import type { ComicMode } from '../types/comics';

const GENRES = ['All', 'Sci-Fi', 'Cyberpunk', 'Fantasy', 'Adventure', 'Thriller'];
const MODES: { label: string; value: ComicMode | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'images' },
  { label: 'PDF', value: 'pdf' },
  { label: 'HTML', value: 'html' },
];

export default function BrowsePage() {
  const { comics, loading, error } = useComics();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMode, setSelectedMode] = useState<ComicMode | 'all'>('all');

  const filtered = comics.filter((c) => {
    const genreMatch = selectedGenre === 'All' || (c.genres ?? []).includes(selectedGenre);
    const modeMatch = selectedMode === 'all' || c.mode === selectedMode;
    return genreMatch && modeMatch;
  });

  return (
    <>
      <Header title="Browse" />
      <PageLayout>
        {/* Mode filter */}
        <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide">
          {MODES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedMode(value)}
              className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: selectedMode === value ? 'var(--color-accent)' : 'var(--color-surface-2)',
                color: selectedMode === value ? '#fff' : 'var(--color-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className="shrink-0 text-xs font-medium px-3 py-1 rounded-full border transition-colors"
              style={{
                borderColor: selectedGenre === genre ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                color: selectedGenre === genre ? 'var(--color-accent)' : 'var(--color-muted)',
                background: 'transparent',
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="px-4 pb-2 text-xs" style={{ color: 'var(--color-muted)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.length > 0 ? (
              <ComicGrid comics={filtered} />
            ) : (
              <div className="flex flex-col items-center gap-2 py-16">
                <span className="text-4xl">🔍</span>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  No comics match these filters
                </p>
              </div>
            )}
          </>
        )}
      </PageLayout>
    </>
  );
}
