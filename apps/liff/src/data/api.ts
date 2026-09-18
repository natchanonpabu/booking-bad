import { now } from '@/lib/clock';
import { buildGrid } from './availability';
import { nextBookingRef } from './bookingRef';
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

  /** Holds every court in the selection. One block per court — the exclusion
      constraint in Plan 03 is per court, so the shapes already match. */
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

  /** Turns a hold into a booking. The longest lag in the app: this is the
      "waiting for the bank" beat of the pitch. */
  confirmBooking: (
    holdId: string,
    sel: SelectionRange,
    contactPhone: string,
    method: PaymentMethodId,
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
    setState((s) => ({
      // The hold becomes the booking's block: same court-hours, no gap in between.
      blocks: s.blocks.map((b) =>
        b.id === holdId || b.id.startsWith(`${holdId}_`)
          ? { ...b, kind: 'booked' as const, expiresAt: undefined, bookingId: booking.id }
          : b,
      ),
      bookings: [booking, ...s.bookings],
    }));
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
