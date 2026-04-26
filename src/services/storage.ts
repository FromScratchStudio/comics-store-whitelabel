import type { Library, ReadingProgress } from '../types/comics';

const STORAGE_KEY = 'comics_library';

const DEFAULT_LIBRARY: Library = {
  favourites: [],
  progress: {},
  recents: [],
};

function load(): Library {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_LIBRARY };
    return { ...DEFAULT_LIBRARY, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LIBRARY };
  }
}

function save(library: Library): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch {
    // Storage quota exceeded – silently ignore
  }
}

export const storageService = {
  getLibrary(): Library {
    return load();
  },

  isFavourite(comicId: string): boolean {
    return load().favourites.includes(comicId);
  },

  toggleFavourite(comicId: string): boolean {
    const lib = load();
    const idx = lib.favourites.indexOf(comicId);
    if (idx === -1) {
      lib.favourites.push(comicId);
    } else {
      lib.favourites.splice(idx, 1);
    }
    save(lib);
    return lib.favourites.includes(comicId);
  },

  saveProgress(progress: ReadingProgress): void {
    const lib = load();
    const key = `${progress.comicId}/${progress.chapterId}`;
    lib.progress[key] = { ...progress, updatedAt: Date.now() };
    save(lib);
  },

  getProgress(comicId: string, chapterId: string): ReadingProgress | undefined {
    const lib = load();
    return lib.progress[`${comicId}/${chapterId}`];
  },

  addRecent(comicId: string): void {
    const lib = load();
    lib.recents = [comicId, ...lib.recents.filter((id) => id !== comicId)].slice(0, 20);
    save(lib);
  },

  getRecents(): string[] {
    return load().recents;
  },
};
