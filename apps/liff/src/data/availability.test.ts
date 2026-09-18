import { describe, expect, it } from 'vitest';
import { addDays, today } from '@/lib/clock';
import { buildGrid, countAvailableSlots, isDayFull, openingHours } from './availability';
import { AVAILABILITY_BLOCKS, COURTS, D } from './fixtures';

const grid = (date = D.canonical, ownHoldId?: string) =>
  buildGrid(date, COURTS, AVAILABILITY_BLOCKS, { ownHoldId });

describe('buildGrid()', () => {
  it('renders 13 continuous hours × 6 courts — no skipped rows (D01, D02)', () => {
    const g = grid();
    expect(openingHours()).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
    expect(g.hours).toHaveLength(13);
    expect(Object.keys(g.slots)).toHaveLength(6);
  });

  it('keeps the canonical story bookable: คอร์ท 3 at 19:00–21:00 is free', () => {
    const g = grid();
    expect(g.slots.c3?.[19]?.status).toBe('available');
    expect(g.slots.c3?.[20]?.status).toBe('available');
  });

  it('separates maintenance from booked, because they mean different things', () => {
    const g = grid();
    expect(g.slots.c6?.[9]?.status).toBe('maintenance');
    expect(g.slots.c6?.[19]?.status).toBe('booked');
  });

  it('marks an unsold hour on a past date as past rather than available', () => {
    const g = grid(addDays(today(), -1));
    expect(g.slots.c3?.[19]?.status).toBe('past');
  });

  it('keeps showing ปิดปรับปรุง once the hour has gone by, so the legend stays honest', () => {
    // The seeded maintenance window is 09:00–11:00, i.e. already past during most
    // demos. It must still read as maintenance, not as a generic past hour.
    expect(grid().slots.c6?.[9]?.status).toBe('maintenance');
  });

  it('hides the user’s own hold, so it never reads as someone else’s booking', () => {
    const withHold = [
      ...AVAILABILITY_BLOCKS,
      {
        id: 'hold_x', venueId: 'v_winner', courtId: 'c3', date: D.canonical,
        startMinutes: 19 * 60, endMinutes: 21 * 60, kind: 'held' as const,
        expiresAt: Number.MAX_SAFE_INTEGER,
      },
    ];
    expect(buildGrid(D.canonical, COURTS, withHold).slots.c3?.[19]?.status).toBe('booked');
    expect(
      buildGrid(D.canonical, COURTS, withHold, { ownHoldId: 'hold_x' }).slots.c3?.[19]?.status,
    ).toBe('available');
  });

  it('prices every slot and flags the peak hours', () => {
    const g = grid();
    expect(g.slots.c3?.[19]?.price).toBeGreaterThan(0);
    expect(g.slots.c3?.[19]?.isPeak).toBe(true);
  });
});

describe('sold-out day (drives the alternate-day screen)', () => {
  it('has zero free slots', () => {
    const g = grid(D.soldOut);
    expect(countAvailableSlots(g)).toBe(0);
    expect(isDayFull(g)).toBe(true);
  });

  it('is the only seeded day that is full', () => {
    expect(isDayFull(grid(D.alternate))).toBe(false);
  });
});
