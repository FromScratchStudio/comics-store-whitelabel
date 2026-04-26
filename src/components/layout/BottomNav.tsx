import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Heart, Search, Home } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/browse', icon: BookOpen, label: 'Browse' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Heart, label: 'Library' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
         style={{ background: 'var(--color-surface)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <ul className="flex items-stretch max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-3 px-2 transition-colors"
                style={{ color: active ? 'var(--color-accent)' : 'var(--color-muted)' }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
