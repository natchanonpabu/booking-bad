import type { ISODate, Minutes, Quote, QuoteLine, RateMix, RateRule, Satang, Venue } from './types';
import { satang } from './types';
import { thb } from '@/lib/money';
import { dayOfWeek } from '@/lib/clock';
import { RATE_RULES, VENUE } from './fixtures';

export function ruleFor(date: ISODate, startMinutes: Minutes, rules = RATE_RULES): RateRule {
  const bit = 1 << dayOfWeek(date);
  const match = rules
    .filter(r => (r.dayMask & bit) !== 0
              && startMinutes >= r.startMinutes
              && startMinutes <  r.endMinutes)
    .sort((a, b) => b.priority - a.priority)[0];
  if (!match) throw new Error(`No rate rule for ${date} @ ${startMinutes}`);
  return match;
}

export const priceForHour = (d: ISODate, m: Minutes): Satang => ruleFor(d, m).pricePerHour;
export const isPeakHour  = (d: ISODate, m: Minutes): boolean => ruleFor(d, m).isPeak;

/** Groups consecutive hours by rate rule, so a range that crosses a rate boundary
    renders as two line items instead of one wrong average. */
export function quote(
  date: ISODate, startMinutes: Minutes, endMinutes: Minutes, venue: Venue = VENUE,
): Quote {
  // Step by venue.slotMinutes, never by a literal 60: the demo script invites the
  // owner to name their own policy, and a venue selling 90-minute blocks must price
  // correctly without editing this file. Rates stay ฿/hour; a slot bills a fraction.
  const step = venue.slotMinutes;
  const slotHours = step / 60;
  const lines: QuoteLine[] = [];
  for (let m = startMinutes; m < endMinutes; m += step) {
    const r = ruleFor(date, m);
    const last = lines[lines.length - 1];
    if (last && last.rateRuleId === r.id) {
      last.hours += slotHours;
      last.amount = satang(last.amount + Math.round(r.pricePerHour * slotHours));
    } else {
      lines.push({
        rateRuleId: r.id, isPeak: r.isPeak, unitPrice: r.pricePerHour,
        hours: slotHours, amount: satang(Math.round(r.pricePerHour * slotHours)), label: '',
      });
    }
  }
  for (const l of lines) {
    l.label = `ค่าคอร์ท${l.isPeak ? 'ช่วงพีค' : 'ช่วงปกติ'} (${thb(l.unitPrice)} × ${l.hours} ชม.)`;
  }
  const total = satang(lines.reduce((sum, l) => sum + l.amount, 0));
  const hours = (endMinutes - startMinutes) / 60;
  // Guard added during Day 3 (the plan's block indexes lines[0] directly, which is
  // both a strict-TS error and a real crash if startMinutes === endMinutes).
  const first = lines[0];
  if (!first) throw new Error(`Empty quote for ${date} ${startMinutes}-${endMinutes}`);
  const rateMix: RateMix = lines.length > 1 ? 'mixed' : first.isPeak ? 'peak' : 'standard';

  return {
    lines: [...lines, {
      rateRuleId: 'fee', label: 'ค่าบริการระบบจอง', hours: 0,
      unitPrice: satang(0), amount: satang(0), isPeak: false, tag: 'ฟรีช่วงเปิดตัว',
    }],
    total, hours, rateMix, currency: 'THB',
    // Unsigned in Plan 01 (see Quote.quoteToken). Plan 04 replaces this with a server signature.
    quoteToken: `demo:${date}:${startMinutes}-${endMinutes}:${total}`,
  };
}
