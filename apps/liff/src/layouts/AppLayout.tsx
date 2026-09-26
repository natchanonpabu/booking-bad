import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';
import { NAV_HIDDEN_PREFIXES } from './navConfig';

export function AppLayout() {
  const { pathname } = useLocation();
  const showNav = !NAV_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      <AppHeader />
      <main
        className={cn(
          'liff-column px-gutter-mobile pt-[calc(4rem+env(safe-area-inset-top,0px))]',
          showNav ? 'pb-[calc(6rem+env(safe-area-inset-bottom,0px))]' : 'pb-space-xl',
        )}
      >
        <Outlet />
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
