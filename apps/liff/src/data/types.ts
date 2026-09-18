/** ISO date, no time, venue-local. e.g. '2026-09-11' */
export type ISODate = string & { readonly __iso: unique symbol };
/** Minutes from midnight, venue-local. 09:00 → 540. */
export type Minutes = number;
export type CourtId = string;
/** Money is integer SATANG (1 baht = 100 satang), never a float baht (ADR-001 §4.4).
    The brand makes `satang(440.5)` impossible to construct silently: it throws.
    ฿440 is `satang(44_000)`. Render only through lib/money.ts. */
export type Satang = number & { readonly __satang: unique symbol };
export const satang = (n: number): Satang => {
  if (!Number.isInteger(n)) throw new Error(`satang must be an integer: ${n}`);
  return n as Satang;
};

export type CourtSurface = 'rubber' | 'rubber_bwf' | 'parquet';
export type CourtClimate = 'air' | 'fan';

export interface Venue {
  id: string;
  name: string;                 // 'วินเนอร์ คอร์ท'
  nameEn: string;               // 'Winner Court'
  displayName: string;          // 'วินเนอร์ คอร์ท (Winner Court)'
  legalName: string;            // sample: 'บริษัท ตัวอย่าง จำกัด (ข้อมูลสาธิต)'
  taxId: string;
  addressTh: string;
  phone: string;                // digits only — the ONE venue number (D07)
  phoneDisplay: string;         // sample: '02-000-0000'
  mapsUrl: string;
  lineOaUrl: string;
  /** IANA zone every ISODate and Minutes on this venue is expressed in.
      'Asia/Bangkok' here. Its absence is what let a runtime-local date bug into
      clock.ts (§6.2); a venue's calendar is never the runtime's calendar. */
  timezone: string;
  openMinutes: Minutes;         // 540  = 09:00   (D02)
  closeMinutes: Minutes;        // 1320 = 22:00
  // Policy, not identity: `number`, never a literal type. A second venue on 90-minute
  // blocks or a 7-day window must be typeable without editing this file — types.ts
  // merges into Plan 02 unedited (§1).
  slotMinutes: number;          // 60
  minBookingHours: number;      // 1  (D21)
  maxBookingHours: number;      // 3
  bookingDaysAhead: number;     // 14
  holdMinutes: number;          // 15 (D15, ADR-001 §3.3)
  cancellationHours: number;    // 3  (D16)
  photos: { src: string; alt: string }[];
  amenities: Amenity[];
}

export interface Amenity { icon: string; title: string; detail: string }

export interface Court {
  id: CourtId;
  venueId: string;
  number: number;               // 1..6 (D01)
  name: string;                 // 'คอร์ท 3'
  surface: CourtSurface;
  climate: CourtClimate;
  gridSubtitle: string;         // 'ยาง BWF / แอร์'   — the 2-line matrix header
  longLabel: string;            // 'คอร์ท 3 (พื้นยางเกรด BWF)' — review + ticket
  isPopular: boolean;
}

/** Rates are DATA, not constants (D05). Highest priority wins on overlap. */
export interface RateRule {
  id: string;
  venueId: string;
  label: string;                // 'ช่วงพีคเย็น (จ.–ศ.)'
  /** Bitmask. Sun=1 Mon=2 Tue=4 Wed=8 Thu=16 Fri=32 Sat=64. */
  dayMask: number;
  startMinutes: Minutes;
  endMinutes: Minutes;
  pricePerHour: Satang;
  isPeak: boolean;
  priority: number;
}

export type BlockKind = 'booked' | 'maintenance' | 'held';

/** One reason a court-hour is unavailable. The backend returns exactly this shape. */
export interface AvailabilityBlock {
  id: string;
  venueId: string;              // every table carries venue_id from migration 1 (ADR-001, D66)
  courtId: CourtId;
  date: ISODate;
  startMinutes: Minutes;
  endMinutes: Minutes;
  kind: BlockKind;
  expiresAt?: number;           // set for kind==='held' — epoch ms
  bookingId?: string;
  note?: string;                // 'ซ่อมบำรุงพื้นสนาม'
}

export type SlotStatus =
  | 'available' | 'booked' | 'maintenance' | 'past' | 'closed';

export interface Slot {
  courtId: CourtId;
  startMinutes: Minutes;
  status: SlotStatus;
  price: Satang;
  isPeak: boolean;
}

/** THE selection type — declared here, once. §8.1 imports it and never redeclares it.
    Units are WHOLE HOURS (`endHour` EXCLUSIVE): the grid's only unit is an hour, so
    minutes cannot enter a selection and disagree with it. `courtIds` is an array
    (NEW-6) — Plan 01's grid writes exactly one entry, the contract already carries
    เหมาคอร์ท. Contiguity and the single run are guaranteed by the shape, not by a
    rule (§8.1): there is no field in which to put a hole. */
export type Selection =
  | { kind: 'none' }
  | {
      kind: 'range';
      date: ISODate;
      courtIds: CourtId[];      // length 1 in Plan 01's UI; the type allows more
      startHour: number;        // 9..21
      endHour: number;          // EXCLUSIVE
    };

/** The narrowed branch, for anything that cannot accept an empty selection. */
export type SelectionRange = Extract<Selection, { kind: 'range' }>;

export interface QuoteLine {
  rateRuleId: string;
  label: string;                // 'ค่าคอร์ทช่วงพีค (฿220 × 2 ชม.)'
  hours: number;
  unitPrice: Satang;
  amount: Satang;
  isPeak: boolean;
  tag?: string;                 // 'ฟรีช่วงเปิดตัว'
}

export type RateMix = 'standard' | 'peak' | 'mixed';

export interface Quote {
  lines: QuoteLine[];
  total: Satang;
  /** Opaque. In Plan 04 the server signs it so `POST /holds` can reject a total the
      client computed or edited. In Plan 01 it is an unsigned echo of the inputs —
      present so the shape, and every call site that forwards it, already exists. */
  quoteToken: string;
  hours: number;
  rateMix: RateMix;
  currency: 'THB';
}

export type PaymentMethodId = 'promptpay' | 'counter';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid';
export type BookingStatus =
  | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  ref: string;                  // 'WC-2609-0042' (D09)
  venueId: string;
  courtIds: CourtId[];      // array for the same reason Selection is (§3 NEW-6)
  userId: string;
  date: ISODate;
  startMinutes: Minutes;
  endMinutes: Minutes;
  status: BookingStatus;
  lines: QuoteLine[];           // the SAME array the drawer and the review render
  total: Satang;
  paymentMethod: PaymentMethodId | null;
  paymentStatus: PaymentStatus;
  paidAt: number | null;
  contactPhone: string;
  headcountHint: string;        // 'ก๊วน 4-6 คน'
  createdAt: number;
  holdExpiresAt: number | null;
}

export interface User {
  id: string;
  lineUserId: string;
  displayName: string;          // 'คุณต้น'
  fullName: string;             // 'คุณต้น (Ton Jiraphat)'
  lineId: string;               // '@ton_badminton'
  pictureUrl: string;
  phone: string;                // the USER's number — deliberately NOT the venue's
}
