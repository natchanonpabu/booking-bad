import type { ISODate } from './types';
import { REF_SEQUENCE_SEED } from './fixtures';
import { getState } from './db';

/**
 * WC-YYMM-NNNN, per-venue-per-month running sequence (D09).
 * NOT random: a 4-char base32 suffix is a ~1.05M space, and `critique.md` #14 shows
 * the "zero collisions over 1,000,000 draws" exit criterion is unpassable there.
 * YYMM already implies a monthly counter, and 10,000/month is ample for six courts.
 * In the real product this is a Postgres sequence per (venue_id, yymm).
 *
 * The counter is derived from the persisted bookings rather than held in memory, so a
 * reload cannot rewind it. Cancelled bookings stay in the list, so their refs are never
 * handed out twice.
 */
export function nextBookingRef(venueId: string, date: ISODate): string {
  const yymm = date.slice(2, 4) + date.slice(5, 7);   // '2609'
  const prefix = `WC-${yymm}-`;
  const highest = getState().bookings
    .filter((b) => b.venueId === venueId && b.ref.startsWith(prefix))
    .reduce((max, b) => Math.max(max, Number(b.ref.slice(prefix.length)) || 0), REF_SEQUENCE_SEED);
  const n = highest + 1;
  if (n > 9999) throw new Error(`Ref sequence exhausted for ${venueId}:${yymm}`);
  return `${prefix}${String(n).padStart(4, '0')}`;
}
