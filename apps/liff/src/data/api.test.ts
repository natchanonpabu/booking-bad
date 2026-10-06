import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { api, SlotTakenError } from './api';
import { nextBookingRef } from './booking-ref';
import { getState, resetDb } from './db';
import { D, SEED_BOOKINGS } from './fixtures';
import type { ISODate, SelectionRange } from './types';

beforeEach(() => resetDb());
afterEach(() => resetDb());

const sel = (courtId: string, date: ISODate, startHour: number, endHour: number): SelectionRange =>
  ({ kind: 'range', date, courtIds: [courtId], startHour, endHour });

describe('booking refs', () => {
  it('continue from the stored bookings, so a reload cannot hand out a duplicate', () => {
    const first = nextBookingRef('v_winner', D.canonical);
    expect(first).toMatch(/-0042$/);
    // Simulate "booked, then reloaded": the booking persists, the module state is gone.
    getState().bookings.push({ ...SEED_BOOKINGS[0]!, id: 'x', ref: first });
    expect(nextBookingRef('v_winner', D.canonical)).toMatch(/-0043$/);
  });

  it('never reuse the ref of a cancelled booking', async () => {
    const booking = await api.confirmBooking(sel('c3', D.canonical, 19, 21), '0891112345');
    await api.cancelBooking(booking.id);
    expect(nextBookingRef('v_winner', D.canonical)).not.toBe(booking.ref);
  });
});

describe('seeded bookings', () => {
  it('block their court — the grid cannot sell a slot a booking card already owns', async () => {
    const seeded = SEED_BOOKINGS.find((b) => b.status === 'confirmed')!;
    const start = seeded.startMinutes / 60;
    await expect(
      Promise.resolve().then(() =>
        api.confirmBooking(sel(seeded.courtIds[0]!, seeded.date, start, start + 1), '0891112345')),
    ).rejects.toBeInstanceOf(SlotTakenError);
  });

  it('release the court again when cancelled', async () => {
    const seeded = SEED_BOOKINGS.find((b) => b.status === 'confirmed')!;
    await api.cancelBooking(seeded.id);
    const start = seeded.startMinutes / 60;
    await expect(
      api.confirmBooking(sel(seeded.courtIds[0]!, seeded.date, start, start + 1), '0891112345'),
    ).resolves.toBeDefined();
  });
});
