import { describe, expect, it } from 'vitest';
import { buildGrid, type DayGrid } from '@/data/availability';
import { COURTS, VENUE } from '@/data/fixtures';
import { quote } from '@/data/rates';
import { addDays, today } from '@/lib/clock';
import { satang, type AvailabilityBlock, type ISODate, type Selection } from '@/data/types';
import { assertInvariants, reconcile, tap, type TapContext } from './selection';

/** A far-future weekday, so nothing is `past` and weekday pricing applies. */
const weekday = (): ISODate => {
  let d = addDays(today(), 7);
  for (let i = 0; i < 7; i += 1) {
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (dow >= 1 && dow <= 5) return d;
    d = addDays(d, 1);
  }
  throw new Error('unreachable');
};
const weekend = (): ISODate => {
  let d = addDays(today(), 7);
  for (let i = 0; i < 7; i += 1) {
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (dow === 0 || dow === 6) return d;
    d = addDays(d, 1);
  }
  throw new Error('unreachable');
};

/** The §8.7 grid fixture: c6@09–11 maintenance, c1@20 booked, everything else free.
    The plan writes this block as c1@20–22, which also swallows 21:00 and leaves its own
    test 13 — "tap c1@21 where c1@20 is booked" — with nothing free to tap. One hour is
    what that test needs, and one hour is what makes the gap case reachable at all. */
const blocksFor = (date: ISODate): AvailabilityBlock[] => [
  { id: 'm1', venueId: 'v_winner', courtId: 'c6', date, startMinutes: 9 * 60, endMinutes: 11 * 60, kind: 'maintenance' },
  { id: 'b1', venueId: 'v_winner', courtId: 'c1', date, startMinutes: 20 * 60, endMinutes: 21 * 60, kind: 'booked' },
];

const ctxFor = (date: ISODate): TapContext => ({
  grid: buildGrid(date, COURTS, blocksFor(date)),
  courts: COURTS,
});

const DATE = weekday();
const ctx = ctxFor(DATE);
const none: Selection = { kind: 'none' };

/** Applies taps in order and asserts the invariants after every single step. */
function play(steps: Array<[string, number]>, context: TapContext = ctx) {
  let selection: Selection = none;
  let last = tap(selection, 'c3', 19, context);
  for (const [courtId, hour] of steps) {
    last = tap(selection, courtId, hour, context);
    selection = last.selection;
    assertInvariants(selection, context);
  }
  return { selection, result: last };
}

const asRange = (s: Selection) => {
  if (s.kind !== 'range') throw new Error('expected a range');
  return s;
};
const totalOf = (s: Selection) => {
  const r = asRange(s);
  return quote(r.date, r.startHour * 60, r.endHour * 60).total;
};

describe('tap() — the §8.2 decision table', () => {
  it('1 · first tap selects one hour', () => {
    const { selection, result } = play([['c3', 19]]);
    expect(result.rule).toBe('R4');
    expect(asRange(selection)).toMatchObject({ courtIds: ['c3'], startHour: 19, endHour: 20 });
    expect(totalOf(selection)).toBe(satang(22_000));
  });

  it('2 · a second, adjacent tap extends to the canonical ฿440 spine', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20]]);
    expect(result.rule).toBe('R10');
    expect(asRange(selection)).toMatchObject({ startHour: 19, endHour: 21 });
    const q = quote(DATE, 19 * 60, 21 * 60);
    expect(q.total).toBe(satang(44_000));
    expect(q.rateMix).toBe('peak');
    expect(q.lines.filter((l) => l.rateRuleId !== 'fee')).toHaveLength(1);
  });

  it('3 · tapping the only selected hour clears it (R6)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 19]]);
    expect(result.rule).toBe('R6');
    expect(selection.kind).toBe('none');
  });

  it('4 · tapping the first hour of a range shrinks from the top (R7)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c3', 19]]);
    expect(result.rule).toBe('R7');
    expect(asRange(selection)).toMatchObject({ startHour: 20, endHour: 21 });
  });

  it('5 · tapping the last hour shrinks from the bottom (R8)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c3', 20]]);
    expect(result.rule).toBe('R8');
    expect(asRange(selection)).toMatchObject({ startHour: 19, endHour: 20 });
  });

  it('6 · the interior of a three-hour range collapses (R9)', () => {
    const { selection, result } = play([['c3', 18], ['c3', 19], ['c3', 20], ['c3', 19]]);
    expect(result.rule).toBe('R9');
    expect(asRange(selection)).toMatchObject({ startHour: 19, endHour: 20 });
  });

  it('7 · extends downwards one hour at a time (R10)', () => {
    const { selection } = play([['c3', 19], ['c3', 20], ['c3', 21]]);
    expect(asRange(selection)).toMatchObject({ startHour: 19, endHour: 22 });
  });

  it('8 · refuses a fourth hour and says why (R12)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c3', 21], ['c3', 18]]);
    expect(result.rule).toBe('R12');
    expect(result.feedback).toEqual({ tone: 'assertive', message: 'จองต่อเนื่องได้สูงสุด 3 ชั่วโมง' });
    expect(asRange(selection)).toMatchObject({ startHour: 19, endHour: 22 });
  });

  it('9 · a gap restarts rather than filling hours nobody chose (R13)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c3', 9]]);
    expect(result.rule).toBe('R13');
    expect(asRange(selection)).toMatchObject({ startHour: 9, endHour: 10 });
  });

  it('10 · another court switches instead of erroring (R5)', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c1', 19]]);
    expect(result.rule).toBe('R5');
    expect(result.feedback?.message).toBe('เปลี่ยนเป็นคอร์ท 1 แล้ว');
    expect(asRange(selection)).toMatchObject({ courtIds: ['c1'], startHour: 19, endHour: 20 });
  });

  it('11 · a maintenance cell is refused (R2)', () => {
    const result = tap(none, 'c6', 9, ctx);
    expect(result.rule).toBe('R2');
    expect(result.selection.kind).toBe('none');
    expect(result.feedback).toEqual({ tone: 'assertive', message: 'คอร์ทนี้ปิดปรับปรุงในช่วงเวลานี้' });
  });

  it('12 · a booked cell is refused (R1)', () => {
    const result = tap(none, 'c1', 20, ctx);
    expect(result.rule).toBe('R1');
    expect(result.feedback).toEqual({ tone: 'assertive', message: 'ช่วงเวลานี้ถูกจองแล้ว' });
  });

  it('13 · extension never jumps a blocked cell — it restarts instead', () => {
    // Same court, with c1@20 booked in between: 19:00 selected, tap 21:00.
    // The plan labels this R13 while also tapping a different court, where R5 always
    // wins first; the rule it means to exercise only fires within one court.
    const { selection, result } = play([['c1', 19], ['c1', 21]]);
    expect(result.rule).toBe('R13');
    expect(asRange(selection)).toMatchObject({ courtIds: ['c1'], startHour: 21, endHour: 22 });
    // The blocked hour itself stays unreachable from either side.
    expect(tap(selection, 'c1', 20, ctx).rule).toBe('R1');
  });

  it('13b · tapping another court always switches first, whatever the gap', () => {
    const { selection, result } = play([['c3', 19], ['c3', 20], ['c1', 21]]);
    expect(result.rule).toBe('R5');
    expect(asRange(selection)).toMatchObject({ courtIds: ['c1'], startHour: 21, endHour: 22 });
  });

  it('14 · a range crossing into peak prices as two lines', () => {
    const { selection } = play([['c3', 16], ['c3', 17]]);
    const q = quote(asRange(selection).date, 16 * 60, 18 * 60);
    expect(q.total).toBe(satang(40_000));
    expect(q.rateMix).toBe('mixed');
    expect(q.lines.filter((l) => l.rateRuleId !== 'fee')).toHaveLength(2);
  });

  it('15 · a range leaving peak prices as two lines', () => {
    const q = quote(DATE, 20 * 60, 22 * 60);
    expect(q.total).toBe(satang(40_000));
    expect(q.lines.filter((l) => l.rateRuleId !== 'fee')).toHaveLength(2);
  });

  it('16 · a Saturday morning is peak all day', () => {
    const q = quote(weekend(), 10 * 60, 12 * 60);
    expect(q.total).toBe(satang(44_000));
    expect(q.lines.filter((l) => l.rateRuleId !== 'fee')).toHaveLength(1);
  });
});

describe('transitions that are not taps (§8.4)', () => {
  it('17 · changing the date always clears the selection', () => {
    const { selection } = play([['c3', 19], ['c3', 20]]);
    const tomorrow = ctxFor(addDays(DATE, 1));
    expect(reconcile(selection, tomorrow.grid)?.selection.kind).toBe('none');
  });

  it('18 · a refetch that took a selected hour clears it, loudly', () => {
    const { selection } = play([['c3', 19], ['c3', 20]]);
    const taken: DayGrid = buildGrid(DATE, COURTS, [
      ...blocksFor(DATE),
      { id: 'b2', venueId: 'v_winner', courtId: 'c3', date: DATE, startMinutes: 20 * 60, endMinutes: 21 * 60, kind: 'booked' },
    ]);
    const out = reconcile(selection, taken);
    expect(out?.selection.kind).toBe('none');
    expect(out?.feedback).toEqual({
      tone: 'assertive',
      message: 'ช่วงเวลาที่เลือกไว้เพิ่งถูกจองไปครับ กรุณาเลือกใหม่',
    });
  });

  it('a selection that is still free survives a refetch untouched', () => {
    const { selection } = play([['c3', 19], ['c3', 20]]);
    expect(reconcile(selection, ctx.grid)).toBeNull();
  });
});

describe('19 · property test — invariants hold after every step of 2,000 sequences', () => {
  it('never reaches a state with a gap, a zero-length range or an unavailable hour', () => {
    // Deterministic PRNG: a failing seed is reproducible, unlike Math.random().
    let seed = 20_260_920;
    const rand = (n: number) => {
      seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
      return seed % n;
    };
    const courtIds = COURTS.map((c) => c.id);
    let selection: Selection = none;

    for (let i = 0; i < 2_000; i += 1) {
      const courtId = courtIds[rand(courtIds.length)]!;
      const hour = ctx.grid.hours[rand(ctx.grid.hours.length)]!;
      selection = tap(selection, courtId, hour, ctx).selection;
      assertInvariants(selection, ctx);
      if (selection.kind === 'range') {
        const hours = selection.endHour - selection.startHour;
        expect(hours).toBeGreaterThanOrEqual(VENUE.minBookingHours);
        expect(hours).toBeLessThanOrEqual(VENUE.maxBookingHours);
      }
    }
  });
});
