import { now } from '@/lib/clock';
import { buildGrid } from './availability';
import { nextBookingRef } from './booking-ref';
import { COURTS, RATE_RULES, USER, VENUE } from './fixtures';
import { quote } from './rates';
import { getState, setState, sweepHolds } from './db';
import type {
  AvailabilityBlock, Booking, ISODate, PaymentMethodId, SelectionRange,
} from './types';

/** Deliberate latency: every screen is forced to have somewhere to put a loading
    state. `?fast=1` compresses it so a rehearsal has no dead air. */
const FAST = typeof window !== 'undefined' && new URLSearchParams(location.search).has('fast');
const lag = <T,>(value: T, ms = 120 + Math.random() * 230): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), FAST ? 30 : ms));

const hoursOf = (sel: SelectionRange) => ({
  startMinutes: sel.startHour * 60,
  endMinutes: sel.endHour * 60,
});

const isFree = (date: ISODate, courtId: string, startHour: number, endHour: number, ignoreId?: string) =>
  !getState().blocks.some(
    (b) =>
      b.date === date &&
      b.courtId === courtId &&
      b.id !== ignoreId &&
      (b.kind !== 'held' || (b.expiresAt ?? 0) > now()) &&
      startHour * 60 < b.endMinutes &&
      endHour * 60 > b.startMinutes,
  );

export class SlotTakenError extends Error {
  constructor() {
    super('SLOT_TAKEN');
    this.name = 'SlotTakenError';
  }
}

export const api = {
  getVenue: () => lag({ venue: VENUE, courts: COURTS, rates: RATE_RULES }),
  getUser: () => lag(USER),

  getAvailability: (date: ISODate, ownHoldId?: string) => {
    sweepHolds();
    return lag(buildGrid(date, COURTS, getState().blocks, { ownHoldId }));
  },

  getQuote: (sel: SelectionRange) => {
    const { startMinutes, endMinutes } = hoursOf(sel);
    return lag(quote(sel.date, startMinutes, endMinutes));
  },

  getBookings: () => {
    sweepHolds();
    return lag(getState().bookings);
  },

  getBooking: (ref: string) =>
    lag(getState().bookings.find((b) => b.ref === ref) ?? null),

  /** Unused by the demo after Revision 5 (nothing waits between choosing and
      confirming). Kept because Plan 04 needs a server-side hold, and the shape is
      already right: one block per court, matching the per-court exclusion constraint. */
  createHold: (sel: SelectionRange) => {
    const holdId = `hold_${Math.round(now())}`;
    for (const courtId of sel.courtIds) {
      if (!isFree(sel.date, courtId, sel.startHour, sel.endHour)) throw new SlotTakenError();
    }
    const { startMinutes, endMinutes } = hoursOf(sel);
    const blocks: AvailabilityBlock[] = sel.courtIds.map((courtId, i) => ({
      id: i === 0 ? holdId : `${holdId}_${i}`,
      venueId: VENUE.id,
      courtId,
      date: sel.date,
      startMinutes,
      endMinutes,
      kind: 'held',
      expiresAt: now() + VENUE.holdMinutes * 60_000,
    }));
    setState((s) => ({ ...s, blocks: [...s.blocks, ...blocks] }));
    return lag({ holdId, expiresAt: blocks[0]!.expiresAt! });
  },

  releaseHold: (holdId: string) => {
    setState((s) => ({
      ...s,
      blocks: s.blocks.filter((b) => b.id !== holdId && !b.id.startsWith(`${holdId}_`)),
    }));
    return lag(true);
  },

  /** Creates the booking. `method` defaults to paying at the counter, which is what
      v1 does; `holdId` is optional because the demo books straight from the review
      screen with nothing held in between. */
  confirmBooking: (
    sel: SelectionRange,
    contactPhone: string,
    method: PaymentMethodId = 'counter',
    holdId = '',
  ) => {
    for (const courtId of sel.courtIds) {
      if (!isFree(sel.date, courtId, sel.startHour, sel.endHour, holdId)) throw new SlotTakenError();
    }
    const { startMinutes, endMinutes } = hoursOf(sel);
    const q = quote(sel.date, startMinutes, endMinutes);
    const paid = method === 'promptpay';
    const booking: Booking = {
      id: `bkg_${Math.round(now())}`,
      ref: nextBookingRef(VENUE.id, sel.date),
      venueId: VENUE.id,
      courtIds: sel.courtIds,
      userId: USER.id,
      date: sel.date,
      startMinutes,
      endMinutes,
      status: paid ? 'confirmed' : 'pending_payment',
      lines: q.lines,
      total: q.total,
      paymentMethod: method,
      paymentStatus: paid ? 'paid' : 'unpaid',
      paidAt: paid ? now() : null,
      contactPhone,
      headcountHint: '',
      createdAt: now(),
      holdExpiresAt: null,
    };
    const heldByThisFlow = (id: string) =>
      // `holdId` is empty in the demo, and `''.startsWith('')` is true for EVERY block —
      // which silently turned maintenance windows into bookings. Guard it explicitly.
      holdId !== '' && (id === holdId || id.startsWith(`${holdId}_`));

    setState((s) => {
      const converted = s.blocks.map((b) =>
        heldByThisFlow(b.id)
          ? { ...b, kind: 'booked' as const, expiresAt: undefined, bookingId: booking.id }
          : b,
      );
      const alreadyBlocked = converted.some((b) => b.bookingId === booking.id);
      // With no hold to convert, the booking inserts its own blocks — one per court,
      // matching the per-court exclusion constraint Plan 03 puts in the database.
      const inserted: AvailabilityBlock[] = alreadyBlocked
        ? []
        : sel.courtIds.map((courtId, i) => ({
          id: `${booking.id}_${i}`,
          venueId: VENUE.id,
          courtId,
          date: sel.date,
          startMinutes,
          endMinutes,
          kind: 'booked',
          bookingId: booking.id,
        }));
      return { blocks: [...converted, ...inserted], bookings: [booking, ...s.bookings] };
    });
    return lag(booking, 900);
  },

  cancelBooking: (id: string) => {
    setState((s) => ({
      blocks: s.blocks.filter((b) => b.bookingId !== id),
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)),
    }));
    return lag(true);
  },
};
