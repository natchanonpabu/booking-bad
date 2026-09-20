import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'success' | 'error';
interface Toast { id: number; message: string; tone: Tone; assertive: boolean }

interface ToastApi {
  /** `assertive` interrupts a screen reader — use it for rejections only. */
  show: (message: string, opts?: { tone?: Tone; assertive?: boolean }) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONES: Record<Tone, string> = {
  neutral: 'bg-inverse-surface text-inverse-on-surface',
  success: 'bg-success text-on-success',
  error: 'bg-error text-on-error',
};

/** Replaces the mockups' blocking `alert()`. Two live regions, because a polite
    summary and an interrupting rejection are different announcements (§8.6). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const show = useCallback<ToastApi['show']>((message, opts = {}) => {
    const toast: Toast = {
      id: nextId.current++, message, tone: opts.tone ?? 'neutral', assertive: opts.assertive ?? false,
    };
    setToasts((t) => [...t, toast]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== toast.id)), 3200);
  }, []);

  const api = useMemo(() => ({ show }), [show]);
  const render = (assertive: boolean) => toasts.filter((t) => t.assertive === assertive);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-drawer flex flex-col items-center gap-space-xs p-space-md pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        {([false, true] as const).map((assertive) => (
          <div
            key={String(assertive)}
            role="status"
            aria-live={assertive ? 'assertive' : 'polite'}
            className="flex w-full max-w-liff flex-col items-center gap-space-xs"
          >
            {render(assertive).map((t) => (
              <p key={t.id} className={cn('rounded-xl px-space-md py-space-sm font-body-md text-body-md shadow-sheet', TONES[t.tone])}>
                {t.message}
              </p>
            ))}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
