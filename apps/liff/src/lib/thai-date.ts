import type { ISODate } from '@/data/types';

/** Buddhist-era dates in Thai. `th-TH-u-ca-buddhist` already returns BE years — never
    add 543 on top of it, or 2569 becomes 3112. Dates are read as venue-local. */
const asDate = (iso: ISODate) => new Date(`${iso}T00:00:00+07:00`);

const fmt = (iso: ISODate, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { timeZone: 'Asia/Bangkok', ...options }).format(asDate(iso));

/** 'ศ.' */
export const thaiDayShort = (iso: ISODate) => fmt(iso, { weekday: 'short' });
/** 'ก.ย.' */
export const thaiMonthShort = (iso: ISODate) => fmt(iso, { month: 'short' });
/** 'พฤ. 29 ต.ค. 18:00' — an instant (epoch ms) in venue time. */
export const thaiDateTime = (ms: number) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    timeZone: 'Asia/Bangkok', weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(ms));

/** '28 พ.ย. 2569' — an instant (epoch ms) in venue time, date only. */
export const thaiDateOnly = (ms: number) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(ms));

/** 'ศุกร์ 24 ก.ย. 2569' */
export const thaiDateLong = (iso: ISODate) =>
  fmt(iso, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
