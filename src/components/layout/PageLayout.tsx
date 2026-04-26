import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Extra bottom padding for pages with bottom nav */
  withBottomNav?: boolean;
}

export default function PageLayout({ children, withBottomNav = true }: Props) {
  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{
        paddingBottom: withBottomNav ? 'calc(4rem + env(safe-area-inset-bottom))' : undefined,
      }}
    >
      {children}
    </main>
  );
}
