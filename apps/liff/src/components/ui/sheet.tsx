import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * NON-MODAL sticky bottom card. It hosts the selection drawer, so it must never trap
 * focus or lock scrolling: the user keeps scrolling and tapping the grid while it is
 * up. If you need a modal, use <Modal> — never build this on Radix Dialog.
 */
export function Sheet({ open = true, elevation = 'sheet', className, children }: {
  open?: boolean; elevation?: 'sheet' | 'sticky-bar'; className?: string; children: ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-nav-safe z-drawer" aria-hidden={!open}>
      {/* The gutter lives inside the clamp, so the card lines up with the page content. */}
      <div className="mx-auto w-full max-w-liff px-gutter-mobile">
        <div
          className={cn(
            'pointer-events-auto rounded-xl bg-surface-container-lowest p-space-md transition-transform',
            elevation === 'sheet' ? 'shadow-sheet' : 'shadow-sticky-bar',
            open ? 'translate-y-0' : 'translate-y-[120%]',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
