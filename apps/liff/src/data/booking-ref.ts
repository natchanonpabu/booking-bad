import type { ISODate } from './types';
import { REF_SEQUENCE_SEED } from './fixtures';

const seq: Record<string, number> = {};

/**
 * WC-YYMM-NNNN, per-venue-per-month running sequence (D09).
 * NOT random: a 4-char base32 suffix is a ~1.05M space, and `critique.md` #14 shows
 * the "zero collisions over 1,000,000 draws" exit criterion is unpassable there.
 * YYMM already implies a monthly counter, and 10,000/month is ample for six courts.
 * In the real product this is a Postgres sequence per (venue_id, yymm).
 */
export function nextBookingRef(venueId: string, date: ISODate): string {
  const yymm = date.slice(2, 4) + date.slice(5, 7);   // '2609'
  const key = `${venueId}:${yymm}`;
  const n = (seq[key] ?? REF_SEQUENCE_SEED) + 1;
  seq[key] = n;
  if (n > 9999) throw new Error(`Ref sequence exhausted for ${key}`);
  return `WC-${yymm}-${String(n).padStart(4, '0')}`;
}
