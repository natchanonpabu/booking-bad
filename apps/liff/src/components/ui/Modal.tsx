import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

/**
 * The one Radix primitive in the project (Plan 01 §4.5). It buys focus trapping,
 * focus restore, Escape, outside-click and inert siblings — none of which appear in
 * any of the 48 mockups. Content carries its own max-w-liff because the portal
 * renders into document.body and escapes .liff-column.
 *
 * Radix marks the rest of the page aria-hidden instead of setting aria-modal on the
 * dialog; that is deliberate on their side and is what the tests assert.
 */
export function Modal({ open, onOpenChange, title, description, trigger, children, actions }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Pass the element that opens the modal. Radix then returns focus to it on close;
      without a trigger it cannot know where focus came from. */
  trigger?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-nav bg-primary/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-nav mx-auto w-full max-w-liff rounded-t-xl bg-surface-container-lowest p-space-lg pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-sheet">
          <div className="flex items-start justify-between gap-space-sm">
            <Dialog.Title className="font-headline-sm text-headline-sm text-primary">{title}</Dialog.Title>
            <Dialog.Close aria-label="ปิด" className="grid size-11 shrink-0 place-items-center rounded-full text-on-surface-variant">
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
              {description}
            </Dialog.Description>
          )}
          {children}
          {actions && <div className="mt-space-lg flex gap-space-sm">{actions}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
