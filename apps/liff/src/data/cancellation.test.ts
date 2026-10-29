import { describe, expect, it } from 'vitest';
import { cancellationOutcome, creditDeadline, startsAt } from './cancellation';
import { satang, type Booking } from './types';

const VENUE = { cancellationHours: 24, creditExpiryDays: 30 };
const HOUR = 3_600_000;

const booking = (over: Partial<Booking> = {}): Booking => ({
  id: 'b1', ref: 'WC-2610-0001', venueId: 'v', courtIds: ['c1'], userId: 'u',
  date: '2026-10-30' as Booking['date'], startMinutes: 18 * 60, endMinutes: 20 * 60,
  status: 'confirmed', lines: [], total: satang(40_000),
  paymentMethod: 'promptpay', paymentStatus: 'paid', paidAt: 0,
  contactPhone: '0891112345', headcountHint: '', createdAt: 0, holdExpiresAt: null,
  ...over,
});

describe('cancellationOutcome', () => {
  const start = startsAt(booking());

  it('reads the start time in Bangkok time', () => {
    expect(new Date(start).toISOString()).toBe('2026-10-30T11:00:00.000Z'); // 18:00 +07:00
  });

  it('gives credit at once at 25 hours when paid, equal to what was paid, expiring in 30 days', () => {
    const at = start - 25 * HOUR;
    expect(cancellationOutcome(booking(), at, VENUE)).toEqual({
      kind: 'credit_now', amount: satang(40_000), expiresAt: at + 30 * 24 * HOUR,
    });
  });

  it('still gives credit exactly at the 24 hour line', () => {
    expect(cancellationOutcome(booking(), creditDeadline(booking(), VENUE), VENUE).kind).toBe('credit_now');
  });

  it('waits for a rebooking when paid and inside 24 hours', () => {
    expect(cancellationOutcome(booking(), start - 23 * HOUR, VENUE))
      .toEqual({ kind: 'credit_if_resold', amount: satang(40_000) });
  });

  it('gives nothing when it was never paid, at any time before the start', () => {
    const unpaid = booking({ paymentStatus: 'unpaid', paymentMethod: 'counter', status: 'pending_payment' });
    expect(cancellationOutcome(unpaid, start - 48 * HOUR, VENUE)).toEqual({ kind: 'none', reason: 'unpaid' });
    expect(cancellationOutcome(unpaid, start - 1 * HOUR, VENUE)).toEqual({ kind: 'none', reason: 'unpaid' });
  });

  it('refuses once the booking has started', () => {
    expect(cancellationOutcome(booking(), start, VENUE)).toEqual({ kind: 'not_allowed' });
    expect(cancellationOutcome(booking(), start + HOUR, VENUE)).toEqual({ kind: 'not_allowed' });
  });
});
