import { describe, expect, it } from 'vitest';
import { ENABLED_NAV, NAV_ITEMS } from './navConfig';

describe('navConfig (D59, D61′)', () => {
  it('declares four tabs and renders exactly two', () => {
    expect(NAV_ITEMS).toHaveLength(4);
    expect(ENABLED_NAV.map((i) => [i.label, i.to])).toEqual([
      ['จองคอร์ท', '/book'],
      ['ประวัติจอง', '/bookings'],
    ]);
  });

  it('never ships the "book a chord" typo from 23 of the mockups', () => {
    const typo = 'จองคอร์' + 'ด';
    expect(NAV_ITEMS.some((i) => i.label.includes(typo))).toBe(false);
  });
});
