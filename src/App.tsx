import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ComicDetailPage from './pages/ComicDetailPage';
import ReaderPage from './pages/ReaderPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-dvh" style={{ background: 'var(--color-bg)' }}>
        <Routes>
          {/* Reader is full-screen – no bottom nav */}
          <Route path="/comic/:comicId/read/:chapterId" element={<ReaderPage />} />

          {/* Main shell – bottom nav visible */}
          <Route
            path="*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/comic/:comicId" element={<ComicDetailPage />} />
                </Routes>
                <BottomNav />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
