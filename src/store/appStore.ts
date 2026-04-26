import { create } from 'zustand';
import type { Comic, Catalog } from '../types/comics';
import type { Library } from '../types/comics';
import { catalogService } from '../services/catalog';
import { storageService } from '../services/storage';

interface AppState {
  // Catalog
  catalog: Catalog | null;
  catalogLoading: boolean;
  catalogError: string | null;

  // Library (favourites, progress, recents)
  library: Library;

  // Actions
  loadCatalog: () => Promise<void>;
  getFeatured: () => Comic[];
  getRecentComics: () => Comic[];
  toggleFavourite: (comicId: string) => void;
  refreshLibrary: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  catalog: null,
  catalogLoading: false,
  catalogError: null,
  library: storageService.getLibrary(),

  async loadCatalog() {
    if (get().catalog || get().catalogLoading) return;
    set({ catalogLoading: true, catalogError: null });
    try {
      const catalog = await catalogService.getCatalog();
      set({ catalog, catalogLoading: false });
    } catch (err) {
      set({
        catalogError: err instanceof Error ? err.message : 'Failed to load catalog',
        catalogLoading: false,
      });
    }
  },

  getFeatured() {
    const { catalog } = get();
    if (!catalog) return [];
    return catalog.comics.filter((c) => c.featured);
  },

  getRecentComics() {
    const { catalog, library } = get();
    if (!catalog) return [];
    return library.recents
      .map((id) => catalog.comics.find((c) => c.id === id))
      .filter((c): c is Comic => c !== undefined);
  },

  toggleFavourite(comicId: string) {
    storageService.toggleFavourite(comicId);
    set({ library: storageService.getLibrary() });
  },

  refreshLibrary() {
    set({ library: storageService.getLibrary() });
  },
}));
