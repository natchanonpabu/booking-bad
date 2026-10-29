import type { Booking } from '@/data/types';

/** One label and tone per booking status, shared by the list card and the detail page
    so the same booking never reads differently on two screens. The label always says
    the state in words — the colour alone never carries it (DESIGN.md §2.4). */
export const BOOKING_STATUS: Record<
  Booking['status'],
  { label: string; tone: 'success' | 'peak' | 'neutral' | 'error'; accent: string }
> = {
  confirmed: { label: 'ยืนยันแล้ว', tone: 'success', accent: 'bg-success' },
  pending_payment: { label: 'รอชำระที่หน้าร้าน', tone: 'peak', accent: 'bg-secondary' },
  completed: { label: 'เสร็จสิ้น', tone: 'neutral', accent: 'bg-outline' },
  cancelled: { label: 'ยกเลิกแล้ว', tone: 'error', accent: 'bg-error' },
  expired: { label: 'หมดอายุ', tone: 'neutral', accent: 'bg-outline' },
};

/** A booking that can still be cancelled: not yet over, not already cancelled. */
export const isActiveBooking = (b: Booking): boolean =>
  b.status === 'confirmed' || b.status === 'pending_payment';
