/**
 * Supported comic viewer modes
 *  - "images"  → ordered list of image URLs described in a JSON manifest
 *  - "pdf"     → a single PDF file rendered via pdf.js
 *  - "html"    → an HTML page embedded in a sandboxed iframe
 */
export type ComicMode = 'images' | 'pdf' | 'html';

/** A single page entry inside an image-list chapter manifest */
export interface ComicPage {
  /** Relative or absolute URL of the page image */
  url: string;
  /** Alt text / aria-label */
  alt?: string;
  /** Natural width in pixels (optional, helps layout before load) */
  width?: number;
  /** Natural height in pixels */
  height?: number;
}

/**
 * Chapter manifest – the JSON file loaded dynamically when a reader opens a chapter.
 * For "images" mode this is the full page list.
 * For "pdf" and "html" modes only `src` is required.
 */
export interface ChapterManifest {
  id: string;
  title: string;
  /** Mode-specific source:
   *  images → not used (pages array is used)
   *  pdf    → path to the PDF file
   *  html   → path to the HTML file or an absolute URL
   */
  src?: string;
  pages?: ComicPage[];
}

/** Lightweight chapter reference stored in the catalog */
export interface ChapterRef {
  id: string;
  title: string;
  /** Path to the chapter manifest JSON (for images/pdf/html modes) */
  manifestUrl: string;
  /** Chapter number for display */
  number: number;
  /** Optional cover thumbnail */
  cover?: string;
  /** Publication date ISO string */
  date?: string;
  /** Whether this chapter is free / unlocked */
  free?: boolean;
}

/** Full comic entry from the catalog */
export interface Comic {
  id: string;
  title: string;
  description: string;
  /** Viewer mode that applies to ALL chapters of this comic */
  mode: ComicMode;
  /** Cover image URL */
  cover: string;
  /** Author(s) */
  authors?: string[];
  /** Genre tags */
  genres?: string[];
  /** Publication year */
  year?: number;
  /** Language code, e.g. "en", "fr" */
  language?: string;
  chapters: ChapterRef[];
  /** Whether the comic is featured in the hero banner */
  featured?: boolean;
}

/** Root catalog file – list of all comics */
export interface Catalog {
  version: string;
  comics: Comic[];
}

/** Persisted reading progress for a single chapter */
export interface ReadingProgress {
  comicId: string;
  chapterId: string;
  /** Last page index (0-based) for images mode */
  page?: number;
  /** Scroll position (0–1) for html/pdf modes */
  scroll?: number;
  /** Unix timestamp of last read */
  updatedAt: number;
}

/** Shape of the persisted library data */
export interface Library {
  /** Set of comic IDs marked as favourites */
  favourites: string[];
  /** Map of "comicId/chapterId" → progress */
  progress: Record<string, ReadingProgress>;
  /** Recently opened comic IDs (most recent first) */
  recents: string[];
}
