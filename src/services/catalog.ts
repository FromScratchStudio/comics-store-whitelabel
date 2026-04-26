import type { Catalog, Comic, ChapterManifest } from '../types/comics';

const BASE = import.meta.env.BASE_URL ?? '/';

function resolveUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return `${BASE}${url.startsWith('/') ? url.slice(1) : url}`;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(resolveUrl(url));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const catalogService = {
  /**
   * Load the main catalog. The catalog.json lives at /public/data/catalog.json
   * and is served as a static asset.
   */
  async getCatalog(): Promise<Catalog> {
    return fetchJSON<Catalog>('data/catalog.json');
  },

  /**
   * Find a single comic by id. Fetches the full catalog if necessary.
   */
  async getComic(id: string): Promise<Comic | undefined> {
    const catalog = await this.getCatalog();
    return catalog.comics.find((c) => c.id === id);
  },

  /**
   * Load a chapter manifest JSON. The URL comes from ChapterRef.manifestUrl.
   */
  async getChapterManifest(manifestUrl: string): Promise<ChapterManifest> {
    return fetchJSON<ChapterManifest>(manifestUrl);
  },
};
