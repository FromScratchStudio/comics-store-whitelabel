import ComicCard from './ComicCard';
import type { Comic } from '../../types/comics';

interface Props {
  comics: Comic[];
  columns?: 2 | 3;
}

export default function ComicGrid({ comics, columns = 2 }: Props) {
  return (
    <div
      className="grid gap-4 p-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {comics.map((comic) => (
        <ComicCard key={comic.id} comic={comic} />
      ))}
    </div>
  );
}
