import { currentHour, today } from '@/lib/clock';
import { isPeakHour, priceForHour } from './rates';
import type { AvailabilityBlock, Court, ISODate, Slot, SlotStatus, Venue } from './types';
import { VENUE } from './fixtures';

/** The grid the booking screen renders: one row per hour, one column per court. */
export interface DayGrid {
  date: ISODate;
  /** Hour-of-day for every row, e.g. 9..21 for a 09:00–22:00 venue. */
  hours: number[];
  /** slots[courtId][hour] — every court-hour in the venue's opening window. */
  slots: Record<string, Record<number, Slot>>;
}

const overlaps = (block: AvailabilityBlock, hour: number): boolean =>
  hour * 60 < block.endMinutes && (hour + 1) * 60 > block.startMinutes;

export function openingHours(venue: Venue = VENUE): number[] {
  const step = venue.slotMinutes / 60;
  const out: number[] = [];
  for (let h = venue.openMinutes / 60; h + step <= venue.closeMinutes / 60; h += step) out.push(h);
  return out;
}

/**
 * Projects blocks onto the opening window. `ownHoldId` is excluded so a user's own
 * hold never renders as someone else's booking — the rule that stops "your slot was
 * just taken" firing on the user who is holding it (Plan 01 §8.4).
 */
export function buildGrid(
  date: ISODate,
  courts: Court[],
  blocks: AvailabilityBlock[],
  opts: { ownHoldId?: string; venue?: Venue } = {},
): DayGrid {
  const venue = opts.venue ?? VENUE;
  const hours = openingHours(venue);
  const forDay = blocks.filter((b) => b.date === date && b.id !== opts.ownHoldId);
  const isToday = date === today();
  const nowHour = currentHour();

  const slots: DayGrid['slots'] = {};
  for (const court of courts) {
    const row: Record<number, Slot> = {};
    for (const hour of hours) {
      const block = forDay.find((b) => b.courtId === court.id && overlaps(b, hour));
      // The court's real state wins over the clock: both are unbookable, but
      // "ปิดปรับปรุง" is the more informative label, and letting `past` overwrite it
      // would make that legend key vanish from the grid halfway through the day.
      // `past` therefore only applies to hours that would otherwise be for sale.
      let status: SlotStatus = 'available';
      if (block) status = block.kind === 'maintenance' ? 'maintenance' : 'booked';
      else if (date < today() || (isToday && hour <= nowHour)) status = 'past';
      row[hour] = {
        courtId: court.id,
        startMinutes: hour * 60,
        status,
        price: priceForHour(date, hour * 60),
        isPeak: isPeakHour(date, hour * 60),
      };
    }
    slots[court.id] = row;
  }
  return { date, hours, slots };
}

export const countAvailableSlots = (grid: DayGrid): number =>
  Object.values(grid.slots)
    .flatMap((row) => Object.values(row))
    .filter((slot) => slot.status === 'available').length;

export const isDayFull = (grid: DayGrid): boolean => countAvailableSlots(grid) === 0;
