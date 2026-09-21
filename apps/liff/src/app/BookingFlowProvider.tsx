import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { PaymentMethodId, SelectionRange } from '@/data/types';

/** What the user has chosen but not yet booked. Lives above the router so it survives
    Back from the review screen, and is mirrored to localStorage so a backgrounded
    webview does not lose a half-finished booking mid-pitch. */
interface FlowState {
  draft: SelectionRange | null;
  contactPhone: string;
  method: PaymentMethodId;
}

type FlowAction =
  | { type: 'select'; draft: SelectionRange }
  | { type: 'phone'; value: string }
  | { type: 'method'; value: PaymentMethodId }
  | { type: 'reset' };

const KEY = 'wc.flow.v1';
const initial: FlowState = { draft: null, contactPhone: '', method: 'counter' };

function load(): FlowState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...initial, ...(JSON.parse(raw) as Partial<FlowState>) } : initial;
  } catch {
    return initial;
  }
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'select': return { ...state, draft: action.draft };
    case 'phone': return { ...state, contactPhone: action.value };
    case 'method': return { ...state, method: action.value };
    case 'reset': return initial;
  }
}

const FlowContext = createContext<{ state: FlowState; dispatch: (a: FlowAction) => void } | null>(null);

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* memory only */ }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useBookingFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useBookingFlow must be used inside <BookingFlowProvider>');
  return ctx;
}
