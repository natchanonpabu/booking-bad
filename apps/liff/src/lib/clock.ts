import type { ISODate } from '@/data/types';

/** Bangkok is a fixed +07:00 with no DST, so this arithmetic is exact. */
const TZ_OFFSET_MS = 7 * 3_600_000;

let offsetMs = 0;                            // DemoBar fast-forward only
export const now = (): number => Date.now() + offsetMs;
export const advance = (ms: number) => { offsetMs += ms; };

export function toISODate(d: Date): ISODate {
  return new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10) as ISODate;
}
export const today = (): ISODate => toISODate(new Date(now()));

// Both work on a shifted-UTC instant, exactly like toISODate above, and read only
// UTC components. A venue-local calendar date must never be routed through the
// runtime's own zone: on a UTC CI runner `.setDate()`/`.getDay()` would shift the
// day by one and silently mis-price the weekend peak.
export function addDays(iso: ISODate, n: number): ISODate {
  const d = new Date(`${iso}T00:00:00Z`);                   // venue-local midnight, read as UTC
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10) as ISODate;
}
export const dayOfWeek = (iso: ISODate): number =>          // 0 = Sunday
  new Date(`${iso}T00:00:00Z`).getUTCDay();

export const currentHour = (): number =>
  new Date(now() + TZ_OFFSET_MS).getUTCHours();

/**
 * The date the grid opens on. Real clock — but if it is already past 18:00 locally,
 * open on tomorrow so the canonical 19:00–21:00 story is never in the past.
 * This is the ONLY piece of demo-clock scaffolding in the app. It is deleted the
 * moment there is real availability data.
 */
export function defaultDemoDate(): ISODate {
  return currentHour() >= 18 ? addDays(today(), 1) : today();
}
