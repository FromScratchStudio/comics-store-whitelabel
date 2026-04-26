import { useState } from 'react';
import { useComics } from '../hooks/useComics';
import ComicGrid from '../components/gallery/ComicGrid';
import Header from '../components/layout/Header';
import PageLayout from '../components/layout/PageLayout';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { comics } = useComics();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = q.length < 2
    ? []
    : comics.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.authors ?? []).some((a) => a.toLowerCase().includes(q)) ||
          (c.genres ?? []).some((g) => g.toLowerCase().includes(q)),
      );

  return (
    <>
      <Header title="Search" />
      <PageLayout>
        <div className="px-4 pt-4 pb-2">
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <Search size={18} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, authors, genres…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--color-text)' }}
              autoFocus
            />
          </div>
        </div>

        {q.length < 2 && (
          <div className="flex flex-col items-center gap-2 py-16">
            <span className="text-4xl">🔍</span>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Type at least 2 characters to search
            </p>
          </div>
        )}

        {q.length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16">
            <span className="text-4xl">😕</span>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              No results for "{query}"
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="px-4 pb-2 text-xs" style={{ color: 'var(--color-muted)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <ComicGrid comics={results} />
          </>
        )}
      </PageLayout>
    </>
  );
}
