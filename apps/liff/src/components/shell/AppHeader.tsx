import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { VENUE } from '@/data/fixtures';
import { asset } from '@/lib/asset';

export function AppHeader() {
  return (
    // Solid surface by default; frosted only where backdrop-filter is supported, so old
    // Android WebViews never render text over scrolling content (Plan 01 revision 2).
    <header className="fixed inset-x-0 top-0 z-header bg-surface pt-safe shadow-app-header supports-[backdrop-filter]:bg-surface/80 supports-[backdrop-filter]:backdrop-blur-xl">
      <div className="mx-auto flex h-app-bar max-w-liff items-center gap-space-sm px-gutter-mobile">
        <Link
          to="/"
          aria-label="หน้าแรก"
          className="grid size-12 shrink-0 place-items-center rounded-full text-primary transition-transform active:scale-98"
        >
          <Icon name="home" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-headline-sm text-headline-sm text-primary">
            {VENUE.displayName}
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2 font-label-sm text-label-sm text-on-surface-variant">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {VENUE.openHoursLabel}
          </p>
        </div>
        <img
          src={asset('mascot/capybara-avatar.svg')}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full"
        />
      </div>
    </header>
  );
}
