import { useSyncExternalStore } from 'react';
import { now } from '@/lib/clock';
import { AVAILABILITY_BLOCKS, SEED_BOOKINGS } from './fixtures';
import type { AvailabilityBlock, Booking } from './types';

/** The demo's whole "server". Plan 04 replaces every read with a fetch (Plan 01 §14). */
export interface DbState {
  blocks: AvailabilityBlock[];
  bookings: Booking[];
}

const KEY = 'wc.db.v1';

const seed = (): DbState => ({
  blocks: [...AVAILABILITY_BLOCKS],
  bookings: [...SEED_BOOKINGS],
});

function load(): DbState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Partial<DbState>;
    if (!Array.isArray(parsed.blocks) || !Array.isArray(parsed.bookings)) return seed();
    return { blocks: parsed.blocks, bookings: parsed.bookings };
  } catch {
    // Private mode and some webviews throw on access — memory-only is a fine demo.
    return seed();
  }
}

let state: DbState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* memory-only fallback */
  }
}

export const getState = (): DbState => state;

export function setState(next: (prev: DbState) => DbState) {
  state = next(state);
  persist();
  listeners.forEach((l) => l());
}

export function resetDb() {
  state = seed();
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useDb = <T,>(select: (s: DbState) => T): T =>
  useSyncExternalStore(subscribe, () => select(state), () => select(state));

/** Cosmetic only: correctness never depends on it (the booking path re-checks). */
export function sweepHolds() {
  const t = now();
  const live = state.blocks.filter((b) => b.kind !== 'held' || (b.expiresAt ?? 0) > t);
  if (live.length !== state.blocks.length) setState((s) => ({ ...s, blocks: live }));
}
