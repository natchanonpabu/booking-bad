import type { DayGrid } from '@/data/availability';
import { VENUE } from '@/data/fixtures';
import type { Court, CourtId, Selection, SelectionRange, Venue } from '@/data/types';

/**
 * The core interaction of the whole product, as a pure function. No React, no DOM:
 * the rules are testable on their own, and the hook around them only adds toasts,
 * a debounce and state (Plan 01 §8).
 *
 * A discontinuous selection is unrepresentable by construction — one court, one start,
 * one end — so "hours must be contiguous" needs no enforcement code anywhere.
 */

export type RuleId =
  | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7'
  | 'R8' | 'R9' | 'R10' | 'R11' | 'R12' | 'R13';

export type Feedback =
  /** Interrupts a screen reader. Rejections only. */
  | { tone: 'assertive'; message: string }
  /** Announced politely, after the selection has changed. */
  | { tone: 'polite'; message: string }
  | null;

export interface TapContext {
  grid: DayGrid;
  courts: Court[];
  venue?: Venue;
}

export interface TapResult {
  selection: Selection;
  feedback: Feedback;
  /** Which row of the §8.2 table fired. Tests assert on this; the UI ignores it. */
  rule: RuleId;
}

const pad = (h: number) => String(h).padStart(2, '0');
export const hourLabel = (h: number) => `${pad(h)}:00`;
export const rangeLabel = (start: number, end: number) => `${pad(start)}:00 - ${pad(end)}:00 น.`;

const range = (date: SelectionRange['date'], courtId: CourtId, startHour: number, endHour: number): SelectionRange =>
  ({ kind: 'range', date, courtIds: [courtId], startHour, endHour });

const statusOf = (grid: DayGrid, courtId: CourtId, hour: number) =>
  grid.slots[courtId]?.[hour]?.status;

/** Invariants 1–4 (§8.1). Dev-only: in production a violated invariant is a bug that
    has already happened, and throwing in a venue owner's hands helps nobody. */
export function assertInvariants(selection: Selection, ctx: TapContext): void {
  if (selection.kind !== 'range') return;
  const venue = ctx.venue ?? VENUE;
  const { startHour, endHour, courtIds } = selection;
  const hours = endHour - startHour;
  if (!(endHour > startHour)) throw new Error(`invariant 1: ${startHour}-${endHour}`);
  if (hours < venue.minBookingHours || hours > venue.maxBookingHours) {
    throw new Error(`invariant 2: ${hours}h outside ${venue.minBookingHours}-${venue.maxBookingHours}`);
  }
  if (courtIds.length !== 1) throw new Error(`invariant 4: ${courtIds.length} courts`);
  for (const courtId of courtIds) {
    for (let h = startHour; h < endHour; h += 1) {
      if (statusOf(ctx.grid, courtId, h) !== 'available') {
        throw new Error(`invariant 3: ${courtId}@${h} is ${statusOf(ctx.grid, courtId, h)}`);
      }
    }
  }
}

/** The §8.2 decision table. Evaluation is strictly R1 → R13; first match wins. */
export function tap(current: Selection, courtId: CourtId, hour: number, ctx: TapContext): TapResult {
  const venue = ctx.venue ?? VENUE;
  const max = venue.maxBookingHours;
  const status = statusOf(ctx.grid, courtId, hour);
  const fresh = (rule: RuleId, feedback: Feedback): TapResult => ({
    selection: range(ctx.grid.date, courtId, hour, hour + 1), feedback, rule,
  });

  // R1–R3 — the cell cannot be sold. Nothing changes, and the reason is announced.
  if (status === 'booked') return { selection: current, rule: 'R1', feedback: { tone: 'assertive', message: 'ช่วงเวลานี้ถูกจองแล้ว' } };
  if (status === 'maintenance') return { selection: current, rule: 'R2', feedback: { tone: 'assertive', message: 'คอร์ทนี้ปิดปรับปรุงในช่วงเวลานี้' } };
  if (status === 'past') return { selection: current, rule: 'R3', feedback: { tone: 'assertive', message: 'เวลานี้ผ่านไปแล้ว' } };
  if (status !== 'available') return { selection: current, rule: 'R3', feedback: { tone: 'assertive', message: 'เวลานี้เลือกไม่ได้' } };

  // R4 — first tap.
  if (current.kind === 'none') {
    return fresh('R4', { tone: 'polite', message: `เลือก ${rangeLabel(hour, hour + 1)}` });
  }

  const { startHour, endHour } = current;
  const hours = endHour - startHour;

  // R5 — a different court. Switching is what the user meant (§8.3).
  if (!current.courtIds.includes(courtId)) {
    const number = ctx.courts.find((c) => c.id === courtId)?.number;
    return fresh('R5', { tone: 'polite', message: `เปลี่ยนเป็นคอร์ท ${number ?? '?'} แล้ว` });
  }

  // R6/R7 — tapping the first hour: clear a 1-hour selection, otherwise shrink from the top.
  if (hour === startHour) {
    if (hours === 1) {
      return { selection: { kind: 'none' }, rule: 'R6', feedback: { tone: 'polite', message: 'ยกเลิกการเลือกแล้ว' } };
    }
    const next = range(current.date, courtId, hour + 1, endHour);
    return { selection: next, rule: 'R7', feedback: { tone: 'polite', message: `เลือก ${rangeLabel(next.startHour, next.endHour)}` } };
  }

  // R8 — tapping the last hour of a multi-hour range shrinks from the bottom.
  if (hour === endHour - 1 && hours > 1) {
    const next = range(current.date, courtId, startHour, hour);
    return { selection: next, rule: 'R8', feedback: { tone: 'polite', message: `เลือก ${rangeLabel(next.startHour, next.endHour)}` } };
  }

  // R9 — the interior of a 3-hour range collapses. Every tap must do something visible.
  if (hour > startHour && hour < endHour - 1) {
    return fresh('R9', { tone: 'polite', message: `เลือกใหม่เป็น ${hourLabel(hour)} - ${hourLabel(hour + 1)}` });
  }

  const adjacentBelow = hour === endHour;
  const adjacentAbove = hour === startHour - 1;

  // R12 — adjacent but already at the cap.
  if ((adjacentBelow || adjacentAbove) && hours >= max) {
    return { selection: current, rule: 'R12', feedback: { tone: 'assertive', message: `จองต่อเนื่องได้สูงสุด ${max} ชั่วโมง` } };
  }

  // R10/R11 — extend by exactly one hour. Cannot jump a blocked cell: R1–R3 already
  // returned for anything unavailable, and a gap falls through to R13.
  if (adjacentBelow) {
    const next = range(current.date, courtId, startHour, hour + 1);
    return { selection: next, rule: 'R10', feedback: { tone: 'polite', message: `เลือก ${rangeLabel(next.startHour, next.endHour)}` } };
  }
  if (adjacentAbove) {
    const next = range(current.date, courtId, hour, endHour);
    return { selection: next, rule: 'R11', feedback: { tone: 'polite', message: `เลือก ${rangeLabel(next.startHour, next.endHour)}` } };
  }

  // R13 — a gap. Restart rather than filling hours the user never chose (§8.3).
  return fresh('R13', {
    tone: 'assertive',
    message: `เลือกได้เฉพาะชั่วโมงติดกัน — เริ่มเลือกใหม่ที่ ${hourLabel(hour)}`,
  });
}

/** Grid refetch (§8.4): a selection that is no longer buyable is dropped, loudly. */
export function reconcile(current: Selection, grid: DayGrid): TapResult | null {
  if (current.kind !== 'range') return null;
  if (current.date !== grid.date) {
    return { selection: { kind: 'none' }, rule: 'R6', feedback: null };
  }
  const stillFree = current.courtIds.every((courtId) => {
    for (let h = current.startHour; h < current.endHour; h += 1) {
      if (statusOf(grid, courtId, h) !== 'available') return false;
    }
    return true;
  });
  if (stillFree) return null;
  return {
    selection: { kind: 'none' },
    rule: 'R1',
    feedback: { tone: 'assertive', message: 'ช่วงเวลาที่เลือกไว้เพิ่งถูกจองไปครับ กรุณาเลือกใหม่' },
  };
}
