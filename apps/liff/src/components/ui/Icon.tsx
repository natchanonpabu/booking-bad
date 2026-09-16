import type { ComponentType, SVGProps } from 'react';
import * as I from '@/components/icons';

type Glyph = ComponentType<SVGProps<SVGSVGElement>>;

/** Every icon the booking flow uses — Material Symbols Outlined, committed as source
    (Plan 01 §4.5). Add a glyph: paste its component into components/icons/, export it
    from index.ts, add one line here. `fill` exists only where the UI needs it. */
const ICONS = {
  home: { outline: I.Home },
  sports_tennis: { outline: I.SportsTennis, fill: I.SportsTennisFill },
  event_available: { outline: I.EventAvailable, fill: I.EventAvailableFill },
  sell: { outline: I.Sell },
  badge: { outline: I.Badge },
  arrow_back_ios_new: { outline: I.ArrowBackIosNew },
  chevron_left: { outline: I.ChevronLeft },
  chevron_right: { outline: I.ChevronRight },
  close: { outline: I.Close },
  calendar_month: { outline: I.CalendarMonth },
  calendar_today: { outline: I.CalendarToday },
  event: { outline: I.Event },
  schedule: { outline: I.Schedule },
  timelapse: { outline: I.Timelapse },
  timer: { outline: I.Timer },
  hourglass_top: { outline: I.HourglassTop },
  bolt: { outline: I.Bolt },
  local_fire_department: { outline: I.LocalFireDepartment },
  build: { outline: I.Build },
  touch_app: { outline: I.TouchApp },
  ads_click: { outline: I.AdsClick },
  wb_sunny: { outline: I.WbSunny },
  nightlight: { outline: I.Nightlight },
  check_circle: { outline: I.CheckCircle, fill: I.CheckCircleFill },
  check: { outline: I.Check },
  verified: { outline: I.Verified },
  verified_user: { outline: I.VerifiedUser },
  domain_verification: { outline: I.DomainVerification },
  shield: { outline: I.Shield },
  info: { outline: I.Info },
  lightbulb: { outline: I.Lightbulb },
  star: { outline: I.Star, fill: I.StarFill },
  stars: { outline: I.Stars },
  notifications_active: { outline: I.NotificationsActive },
  refresh: { outline: I.Refresh },
  replay: { outline: I.Replay },
  payments: { outline: I.Payments },
  account_balance_wallet: { outline: I.AccountBalanceWallet },
  credit_card: { outline: I.CreditCard },
  qr_code_2: { outline: I.QrCode2 },
  receipt_long: { outline: I.ReceiptLong },
  confirmation_number: { outline: I.ConfirmationNumber },
  list_alt: { outline: I.ListAlt },
  content_copy: { outline: I.ContentCopy },
  download: { outline: I.Download },
  send: { outline: I.Send },
  storefront: { outline: I.Storefront },
  stadium: { outline: I.Stadium },
  sports_score: { outline: I.SportsScore },
  sports_and_outdoors: { outline: I.SportsAndOutdoors },
  location_on: { outline: I.LocationOn },
  map: { outline: I.Map },
  near_me: { outline: I.NearMe },
  call: { outline: I.Call },
  phone: { outline: I.Phone },
  support_agent: { outline: I.SupportAgent },
  ac_unit: { outline: I.AcUnit },
  mode_fan: { outline: I.ModeFan },
  shower: { outline: I.Shower },
  local_cafe: { outline: I.LocalCafe },
  local_parking: { outline: I.LocalParking },
  wifi: { outline: I.Wifi },
  handyman: { outline: I.Handyman },
  apps: { outline: I.Apps },
  person: { outline: I.Person },
  group: { outline: I.Group },
  groups: { outline: I.Groups },
  chat: { outline: I.Chat },
  arrow_forward: { outline: I.ArrowForward },
} satisfies Record<string, { outline: Glyph; fill?: Glyph }>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
export type IconSize = 16 | 18 | 20 | 24 | 28 | 32 | 36;

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: IconSize;
  /** Use the filled glyph when one exists (e.g. the active bottom-nav tab). */
  filled?: boolean;
  /** Give the icon an accessible name. Without it the icon is decorative. */
  label?: string;
};

export function hasFilled(name: IconName): boolean {
  return 'fill' in ICONS[name];
}

export function Icon({ name, size = 24, filled = false, label, ...rest }: IconProps) {
  const entry: { outline: Glyph; fill?: Glyph } = ICONS[name];
  const Glyph = filled && entry.fill ? entry.fill : entry.outline;
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label, 'aria-hidden': false }
    : { 'aria-hidden': true };
  return <Glyph width={size} height={size} {...a11y} {...rest} />;
}
