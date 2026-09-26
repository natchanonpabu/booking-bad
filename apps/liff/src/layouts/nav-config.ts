import type { IconName } from '@/components/ui/icon';

export interface NavItem {
  id: 'book' | 'bookings' | 'rates' | 'member';
  label: string;
  icon: IconName;
  to: string;
  /** D61′: declared but not rendered in Plan 01. Enabling a tab is flipping this. */
  enabled: boolean;
}

/** THE nav source of truth (D59). The only place a nav label may appear. */
export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'book', label: 'จองคอร์ท', icon: 'sports_tennis', to: '/book', enabled: true },
  { id: 'bookings', label: 'ประวัติจอง', icon: 'event_available', to: '/bookings', enabled: true },
  { id: 'rates', label: 'อัตราค่าบริการ', icon: 'sell', to: '/rates', enabled: false },
  { id: 'member', label: 'สมาชิก', icon: 'badge', to: '/member', enabled: false },
];

export const ENABLED_NAV = NAV_ITEMS.filter((item) => item.enabled);

/** Routes rendered without the bottom nav (Plan 01 §7 #14). */
export const NAV_HIDDEN_PREFIXES: readonly string[] = ['/book/success'];
