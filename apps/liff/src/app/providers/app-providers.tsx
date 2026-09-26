import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { BookingFlowProvider } from './booking-flow-provider';

/** Every context that wraps the whole app, in one place, so `main.tsx` stays a mount
    and adding the next provider (LIFF profile, theme) is one line here — not a nested
    edit in the entry file. Order matters: the flow provider may raise a toast. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <BookingFlowProvider>{children}</BookingFlowProvider>
    </ToastProvider>
  );
}
