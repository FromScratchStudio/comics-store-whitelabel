import { useComics } from '../hooks/useComics';
import { useAppStore } from '../store/appStore';
import ComicGrid from '../components/gallery/ComicGrid';
import Header from '../components/layout/Header';
import PageLayout from '../components/layout/PageLayout';

export default function LibraryPage() {
  const { comics } = useComics();
  const library = useAppStore((s) => s.library);

  const favourites = comics.filter((c) => library.favourites.includes(c.id));
  const recents = library.recents
    .map((id) => comics.find((c) => c.id === id))
    .filter(Boolean)
    .slice(0, 10) as typeof comics;

  return (
    <>
      <Header title="My Library" />
      <PageLayout>
        {/* Favourites */}
        <section className="pt-4">
          <h2 className="px-4 pb-2 font-bold text-base" style={{ color: 'var(--color-text)' }}>
            ❤️ Favourites
          </h2>
          {favourites.length === 0 ? (
            <p className="px-4 pb-4 text-sm" style={{ color: 'var(--color-muted)' }}>
              No favourites yet — tap the heart on a comic to save it here.
            </p>
          ) : (
            <ComicGrid comics={favourites} />
          )}
        </section>

        {/* Recently read */}
        <section className="pt-2">
          <h2 className="px-4 pb-2 font-bold text-base" style={{ color: 'var(--color-text)' }}>
            🕐 Recently Read
          </h2>
          {recents.length === 0 ? (
            <p className="px-4 pb-4 text-sm" style={{ color: 'var(--color-muted)' }}>
              Start reading to see your history here.
            </p>
          ) : (
            <ComicGrid comics={recents} />
          )}
        </section>
      </PageLayout>
    </>
  );
}
