import { useEffect } from 'react';
import { useComics } from '../hooks/useComics';
import { useAppStore } from '../store/appStore';
import FeaturedBanner from '../components/gallery/FeaturedBanner';
import ComicGrid from '../components/gallery/ComicGrid';
import Header from '../components/layout/Header';
import PageLayout from '../components/layout/PageLayout';

export default function HomePage() {
  const { comics, loading, error } = useComics();
  const loadCatalog = useAppStore((s) => s.loadCatalog);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const featured = comics.filter((c) => c.featured);
  const recent = comics.slice(0, 4);

  return (
    <>
      <Header title="Comics Store" />
      <PageLayout>
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
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {featured.length > 0 && <FeaturedBanner comics={featured} />}

            <section className="mt-2">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h2 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
                  All Comics
                </h2>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  {comics.length} titles
                </span>
              </div>
              <ComicGrid comics={recent} />
            </section>
          </>
        )}
      </PageLayout>
    </>
  );
}
