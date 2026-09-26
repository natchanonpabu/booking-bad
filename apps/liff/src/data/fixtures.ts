import type {
  Amenity, AvailabilityBlock, Booking, Court, ISODate, QuoteLine, RateRule, User, Venue,
} from './types';
import { satang } from './types';
import { addDays, defaultDemoDate, now } from '@/lib/clock';

/* ── Day offsets. Everything is relative; nothing is a calendar literal. ────── */
export const BASE: ISODate = defaultDemoDate();
export const D = {
  canonical: BASE,                 // the bookable day — คอร์ท 3 @ 19:00 is FREE here
  next:      addDays(BASE, 1),
  busy:      addDays(BASE, 2),
  soldOut:   addDays(BASE, 3),     // drives `_2`
  alternate: addDays(BASE, 4),     // the day `_2` recommends
} as const;

/* RECONCILIATION: `_2` renders the same Friday as fully booked that `2.` books
   คอร์ท 3 at 19:00–21:00 on. Both cannot be true. The canonical spine wins: the
   default day stays bookable, and BASE+3 is the sold-out day. */

/* ── Venue ─────────────────────────────────────────────────────────────────── */
const AMENITIES: Amenity[] = [
  { icon: 'local_parking', title: 'ที่จอดรถ 30 คัน',   detail: 'จอดฟรีในร่ม' },
  { icon: 'ac_unit',       title: 'แอร์ & พัดลมยักษ์', detail: 'ระบายอากาศดี' },
  { icon: 'shower',        title: 'ห้องอาบน้ำสะอาด',   detail: 'พร้อมเครื่องทำน้ำอุ่น' },
  { icon: 'storefront',    title: 'เครื่องดื่ม & ช็อป', detail: 'ลูกแบด & อุปกรณ์' },
  { icon: 'build',         title: 'บริการขึ้นเอ็น',     detail: 'ช่างมาตรฐาน' },
  { icon: 'wifi',          title: 'ฟรี Wi-Fi แรงสูง',   detail: 'มีจุดชาร์จมือถือ' },
];

export const VENUE: Venue = {
  id: 'v_winner',
  name: 'วินเนอร์ คอร์ท',
  nameEn: 'Winner Court',
  displayName: 'วินเนอร์ คอร์ท (Winner Court)',
  // Decision 9: SAMPLE identity. None of these may match a real company, phone line or
  // LINE account — this demo is shown to real venue owners on their own phones, where
  // a `tel:` link dials and a LINE link opens. Replace per venue in Plan 02/03.
  legalName: 'บริษัท ตัวอย่าง จำกัด (ข้อมูลสาธิต)',
  taxId: '0000000000000',
  addressTh: 'ซอยรามคำแหง 24 แยก 14 แขวงหัวหมาก บางกะปิ กรุงเทพฯ 10240',
  // D07: the mockups ship THREE numbers (021234567 / 0812345678 / 081-234-5678)
  // and reuse one of them as the USER's emergency-contact field. One venue number.
  phone: '020000000',
  phoneDisplay: '02-000-0000',
  mapsUrl: 'https://maps.google.com/?q=Winner+Court+Badminton+Ramkhamhaeng',
  lineOaUrl: '',                 // no real OA in the demo; nothing links to it
  timezone: 'Asia/Bangkok',
  openHoursLabel: 'เปิดบริการ 09:00 - 22:00',
  openMinutes: 9 * 60,
  closeMinutes: 22 * 60,
  slotMinutes: 60,
  minBookingHours: 1,
  maxBookingHours: 3,
  bookingDaysAhead: 14,
  holdMinutes: 15,
  cancellationHours: 3,
  photos: [
    { src: '/venue/court-1.webp', alt: 'ภายในสนามวินเนอร์ คอร์ท มองเห็นคอร์ทแบดมินตัน 6 คอร์ทเรียงกัน' },
    { src: '/venue/court-2.webp', alt: 'โซนพักผ่อนและร้านขายอุปกรณ์แบดมินตันของวินเนอร์ คอร์ท' },
    { src: '/venue/court-3.webp', alt: 'คอร์ทพื้นยางเกรด BWF พร้อมไฟส่องสว่างและเครื่องปรับอากาศ' },
  ],
  amenities: AMENITIES,
};

/* ── Courts — D06 resolution (§3.5 #8). Marked `assumed` until the venue confirms.
   `_1`'s ยางเขียว / ยางน้ำเงิน scheme appears in one file and contradicts every
   other; dropped. The AC-vs-fan split is the distinction customers actually choose
   on, and it makes the matrix header carry information instead of repeating itself. */
export const COURTS: Court[] = [
  { id: 'c1', venueId: 'v_winner', number: 1, name: 'คอร์ท 1', surface: 'rubber',
    climate: 'air', gridSubtitle: 'ยาง / แอร์',      longLabel: 'คอร์ท 1 (พื้นยาง • แอร์)',      isPopular: false },
  { id: 'c2', venueId: 'v_winner', number: 2, name: 'คอร์ท 2', surface: 'rubber',
    climate: 'air', gridSubtitle: 'ยาง / แอร์',      longLabel: 'คอร์ท 2 (พื้นยาง • แอร์)',      isPopular: false },
  { id: 'c3', venueId: 'v_winner', number: 3, name: 'คอร์ท 3', surface: 'rubber_bwf',
    climate: 'air', gridSubtitle: 'ยาง BWF / แอร์',  longLabel: 'คอร์ท 3 (พื้นยางเกรด BWF)',     isPopular: true  },
  { id: 'c4', venueId: 'v_winner', number: 4, name: 'คอร์ท 4', surface: 'parquet',
    climate: 'air', gridSubtitle: 'ปาร์เกต์ / แอร์', longLabel: 'คอร์ท 4 (พื้นปาร์เกต์)',        isPopular: false },
  { id: 'c5', venueId: 'v_winner', number: 5, name: 'คอร์ท 5', surface: 'rubber',
    climate: 'fan', gridSubtitle: 'ยาง / พัดลม',     longLabel: 'คอร์ท 5 (พื้นยาง • พัดลม)',     isPopular: false },
  { id: 'c6', venueId: 'v_winner', number: 6, name: 'คอร์ท 6', surface: 'rubber',
    climate: 'fan', gridSubtitle: 'ยาง / พัดลม',     longLabel: 'คอร์ท 6 (พื้นยาง • พัดลม)',     isPopular: false },
];

/* ── Rate rules — D03, D04′, D05 ─────────────────────────────────────────────
   Kills ฿160 (`2.`), ฿200 (`empty_state`) and the ฿360-per-2h row in `_3`.
   A base rule plus two peak overrides expresses "21:00 falls back to ฿180" for
   free, with no third tier. */
const MON_FRI = 0b0111110;  // 62
const WEEKEND = 0b1000001;  // 65

export const RATE_RULES: RateRule[] = [
  { id: 'r_base', venueId: 'v_winner', label: 'อัตราปกติ',
    dayMask: 0b1111111, startMinutes: 9 * 60, endMinutes: 22 * 60,
    pricePerHour: satang(18_000), isPeak: false, priority: 0 },
  { id: 'r_peak_wd', venueId: 'v_winner', label: 'ช่วงพีคเย็น (จ.–ศ.)',
    dayMask: MON_FRI, startMinutes: 17 * 60, endMinutes: 21 * 60,   // ← D04′
    pricePerHour: satang(22_000), isPeak: true, priority: 10 },
  { id: 'r_peak_we', venueId: 'v_winner', label: 'เสาร์–อาทิตย์ (พีคทั้งวัน)',
    dayMask: WEEKEND, startMinutes: 9 * 60, endMinutes: 22 * 60,
    pricePerHour: satang(22_000), isPeak: true, priority: 10 },
];

/* ── User ──────────────────────────────────────────────────────────────────── */
export const USER: User = {
  id: 'u_ton',
  lineUserId: 'Udemo0000000000000000000000000001',
  displayName: 'คุณต้น',
  fullName: 'คุณต้น (Ton Jiraphat)',
  lineId: '@ton_badminton',
  pictureUrl: '/mascot/capybara-avatar.webp',
  phone: '089-111-2345',      // deliberately NOT the venue number
};

/* ── Availability blocks, authored by DAY OFFSET ───────────────────────────── */
const b = (
  id: string, courtId: string, date: ISODate, startHour: number, hours: number,
  kind: AvailabilityBlock['kind'], note?: string,
): AvailabilityBlock => ({
  id, venueId: 'v_winner', courtId, date,
  startMinutes: startHour * 60,
  endMinutes: (startHour + hours) * 60,
  kind, note,
});

/** The canonical day. คอร์ท 3 @ 19:00–21:00 is DELIBERATELY FREE, and the evening
    is busy enough that the free pair reads as scarce rather than as an empty venue. */
const CANONICAL: AvailabilityBlock[] = [
  b('bk01', 'c3', D.canonical,  9, 1, 'booked'),
  b('bk02', 'c3', D.canonical, 11, 1, 'booked'),
  b('bk03', 'c2', D.canonical, 15, 1, 'booked'),
  b('bk04', 'c5', D.canonical, 15, 1, 'booked'),
  b('bk05', 'c2', D.canonical, 17, 2, 'booked'),
  b('bk06', 'c4', D.canonical, 17, 2, 'booked'),
  b('bk07', 'c1', D.canonical, 18, 1, 'booked'),
  b('bk08', 'c5', D.canonical, 18, 1, 'booked'),
  b('bk09', 'c6', D.canonical, 19, 1, 'booked'),
  b('bk10', 'c1', D.canonical, 20, 2, 'booked'),
  b('bk11', 'c4', D.canonical, 21, 1, 'booked'),
  // Maintenance stays where `2.` puts it: Court 6, 09:00–11:00.
  b('mt01', 'c6', D.canonical,  9, 2, 'maintenance', 'ซ่อมบำรุงพื้นสนาม'),
];

const NEXT: AvailabilityBlock[] = [
  b('bk20', 'c1', D.next, 10, 2, 'booked'),
  b('bk21', 'c3', D.next, 14, 2, 'booked'),
  b('bk22', 'c4', D.next, 18, 2, 'booked'),
  b('bk23', 'c5', D.next, 19, 3, 'booked'),
];
const BUSY: AvailabilityBlock[] = [
  b('bk30', 'c2', D.busy, 11, 2, 'booked'),
  b('bk31', 'c6', D.busy, 17, 2, 'booked'),
  b('bk32', 'c1', D.busy, 19, 2, 'booked'),
  b('bk33', 'c3', D.busy, 19, 2, 'booked'),
  b('bk34', 'c4', D.busy, 19, 2, 'booked'),
];
/** Every court, every hour. GENERATED, never typed out. Drives `_2`. */
const SOLD_OUT: AvailabilityBlock[] = COURTS.flatMap((c) =>
  Array.from({ length: 13 }, (_, i) =>
    b(`full-${c.id}-${9 + i}`, c.id, D.soldOut, 9 + i, 1, 'booked')),
);
/** The alternate day `_2` recommends. Must look genuinely open. */
const ALTERNATE: AvailabilityBlock[] = [
  b('bk40', 'c1', D.alternate, 18, 2, 'booked'),
  b('bk41', 'c4', D.alternate, 20, 1, 'booked'),
];

export const AVAILABILITY_BLOCKS: AvailabilityBlock[] =
  [...CANONICAL, ...NEXT, ...BUSY, ...SOLD_OUT, ...ALTERNATE];

/* ── Seed bookings — drive `_3` before you book anything ───────────────────── */
const at = (iso: ISODate, h: number) =>
  new Date(`${iso}T${String(h).padStart(2, '0')}:00:00+07:00`).getTime();

/* Mirrors quote() exactly, fee line included (§6.4). Without it a seeded card and a
   card booked during the demo disagree about ค่าบริการระบบจอง — visible the moment
   the owner puts two bookings side by side on `_3`. */
const PEAK_2H = (): QuoteLine[] => ([
  {
    rateRuleId: 'r_peak_wd', label: 'ค่าคอร์ทช่วงพีค (฿220 × 2 ชม.)',
    hours: 2, unitPrice: satang(22_000), amount: satang(44_000), isPeak: true,
  },
  {
    rateRuleId: 'fee', label: 'ค่าบริการระบบจอง', hours: 0,
    unitPrice: satang(0), amount: satang(0), isPeak: false, tag: 'ฟรีช่วงเปิดตัว',
  },
]);

/** Seed refs are derived from their own date so they always match D09's YYMM. */
const seedRef = (d: ISODate, n: number) =>
  `WC-${d.slice(2, 4)}${d.slice(5, 7)}-${String(n).padStart(4, '0')}`;

export const SEED_BOOKINGS: Booking[] = [
  { // upcoming, confirmed — the hero card on `_3`
    id: 'bkg_0041', ref: seedRef(D.next, 41),
    venueId: 'v_winner', courtIds: ['c3'], userId: 'u_ton',
    date: D.next, startMinutes: 19 * 60, endMinutes: 21 * 60,
    status: 'confirmed', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'promptpay', paymentStatus: 'paid', paidAt: now() - 86_400_000,
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 4-6 คน',
    createdAt: now() - 86_400_000, holdExpiresAt: null,
  },
  { // upcoming, awaiting counter payment — proves the cash path has a home
    id: 'bkg_0039', ref: seedRef(addDays(BASE, 5), 39),
    venueId: 'v_winner', courtIds: ['c1'], userId: 'u_ton',
    date: addDays(BASE, 5), startMinutes: 18 * 60, endMinutes: 20 * 60,
    status: 'pending_payment', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'counter', paymentStatus: 'unpaid', paidAt: null,
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 4 คน',
    createdAt: now() - 3_600_000, holdExpiresAt: null,
  },
  { // completed, last week — drives the "ที่ผ่านมา" tab. ฿440 = 2 × ฿220, NOT
    // `_3`'s ฿360, which was 2 × ฿180 charged during peak hours.
    id: 'bkg_0012', ref: seedRef(addDays(BASE, -7), 12),
    venueId: 'v_winner', courtIds: ['c2'], userId: 'u_ton',
    date: addDays(BASE, -7), startMinutes: 19 * 60, endMinutes: 21 * 60,
    status: 'completed', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'promptpay', paymentStatus: 'paid', paidAt: at(addDays(BASE, -8), 21),
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 5 คน',
    createdAt: at(addDays(BASE, -8), 21), holdExpiresAt: null,
  },
];

/** Seeded so the first booking made during a demo is WC-YYMM-0042. */
export const REF_SEQUENCE_SEED = 41;
