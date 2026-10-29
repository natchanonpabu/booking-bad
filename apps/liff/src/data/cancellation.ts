import type { Booking, CancellationOutcome, Venue } from './types';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

/** The instant a booking starts. Venue calendars are fixed +07:00 (see lib/clock.ts). */
export const startsAt = (b: Pick<Booking, 'date' | 'startMinutes'>): number =>
  new Date(`${b.date}T00:00:00+07:00`).getTime() + b.startMinutes * 60_000;

/** The last instant a cancellation still earns credit at once. */
export const creditDeadline = (
  b: Pick<Booking, 'date' | 'startMinutes'>,
  venue: Pick<Venue, 'cancellationHours'>,
): number => startsAt(b) - venue.cancellationHours * HOUR_MS;

/**
 * What cancelling `b` at `at` would earn (spec-booking-detail.md §6.2). Pure, so the
 * confirm modal can preview exactly what the API will then record.
 *
 *  · started                      → not allowed
 *  · not paid (pay at the desk)   → nothing to convert, no credit
 *  · paid, at/before the deadline → credit now, equal to what was paid
 *  · paid, after the deadline     → credit only if someone books the slot afterwards
 */
export function cancellationOutcome(
  b: Booking,
  at: number,
  venue: Pick<Venue, 'cancellationHours' | 'creditExpiryDays'>,
): CancellationOutcome {
  if (at >= startsAt(b)) return { kind: 'not_allowed' };
  if (b.paymentStatus !== 'paid') return { kind: 'none', reason: 'unpaid' };
  if (at <= creditDeadline(b, venue)) {
    return { kind: 'credit_now', amount: b.total, expiresAt: at + venue.creditExpiryDays * DAY_MS };
  }
  return { kind: 'credit_if_resold', amount: b.total };
}
