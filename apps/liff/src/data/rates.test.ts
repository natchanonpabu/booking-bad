import { describe, expect, it } from 'vitest';
import { addDays, today } from '@/lib/clock';
import { thb } from '@/lib/money';
import { satang, type ISODate } from './types';
import { quote, ruleFor } from './rates';

/** The worked examples in Plan 01 §6.4 are the fixtures. Dates are derived, not typed,
    so the suite passes on any day and under TZ=UTC (the clock bug the audit found). */
const nextWeekday = (): ISODate => {
  let d = today();
  for (let i = 0; i < 7; i += 1) {
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (dow >= 1 && dow <= 5) return d;
    d = addDays(d, 1);
  }
  throw new Error('unreachable');
};
const nextWeekend = (): ISODate => {
  let d = today();
  for (let i = 0; i < 7; i += 1) {
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (dow === 0 || dow === 6) return d;
    d = addDays(d, 1);
  }
  throw new Error('unreachable');
};

describe('quote() on a weekday', () => {
  const wd = nextWeekday();
  const cases: Array<[string, number, number, number, number]> = [
    // label,            start, end, total satang, court line count
    ['19:00–21:00 · the canonical spine', 19, 21, 44_000, 1],
    ['10:00–12:00 · standard', 10, 12, 36_000, 1],
    ['16:00–18:00 · crosses into peak', 16, 18, 40_000, 2],
    ['16:00–19:00 · one standard, two peak', 16, 19, 62_000, 2],
    ['20:00–22:00 · peak then back to standard', 20, 22, 40_000, 2],
  ];
  it.each(cases)('%s', (_label, start, end, total, lineCount) => {
    const q = quote(wd, start * 60, end * 60);
    expect(q.total).toBe(satang(total));
    expect(q.lines.filter((l) => l.rateRuleId !== 'fee')).toHaveLength(lineCount);
    expect(q.hours).toBe(end - start);
  });

  it('labels a mixed range as mixed and a single rule by its peak flag', () => {
    expect(quote(wd, 16 * 60, 18 * 60).rateMix).toBe('mixed');
    expect(quote(wd, 19 * 60, 21 * 60).rateMix).toBe('peak');
    expect(quote(wd, 10 * 60, 12 * 60).rateMix).toBe('standard');
  });

  it('always appends the free booking-fee line, so seeded and new bookings match', () => {
    const fee = quote(wd, 19 * 60, 21 * 60).lines.at(-1);
    expect(fee?.rateRuleId).toBe('fee');
    expect(fee?.amount).toBe(satang(0));
  });

  it('carries a quote token built from its own inputs', () => {
    expect(quote(wd, 19 * 60, 21 * 60).quoteToken).toBe(`demo:${wd}:1140-1260:44000`);
  });
});

describe('quote() at the weekend', () => {
  it('prices a Saturday morning at the peak rate — the last beat of the demo', () => {
    expect(quote(nextWeekend(), 10 * 60, 12 * 60).total).toBe(satang(44_000));
  });
});

describe('ruleFor()', () => {
  it('lets the highest-priority rule win, so 21:00 falls back to ฿180 (D04′)', () => {
    const wd = nextWeekday();
    expect(ruleFor(wd, 20 * 60).id).toBe('r_peak_wd');
    expect(ruleFor(wd, 21 * 60).id).toBe('r_base');
  });

  it('throws rather than guessing outside opening hours', () => {
    expect(() => ruleFor(nextWeekday(), 8 * 60)).toThrow(/No rate rule/);
  });
});

describe('money', () => {
  it('shows whole baht without decimals and keeps satang when they exist', () => {
    expect(thb(satang(44_000))).toBe('฿440');
    expect(thb(satang(44_050))).toBe('฿440.50');
  });

  it('refuses to construct a fractional satang', () => {
    expect(() => satang(440.5)).toThrow(/integer/);
  });
});
