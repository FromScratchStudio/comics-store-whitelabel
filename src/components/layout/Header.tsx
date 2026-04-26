import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  showBack?: boolean;
  backTo?: string;
  actions?: ReactNode;
}

export default function Header({ title, showBack = false, backTo = '/', actions }: Props) {
  return (
    <header
      className="sticky top-0 z-40 safe-top flex items-center gap-3 px-4 py-3"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {showBack && (
        <Link
          to={backTo}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
          style={{ color: 'var(--color-text)' }}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </Link>
      )}
      <h1 className="flex-1 text-lg font-bold truncate" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
