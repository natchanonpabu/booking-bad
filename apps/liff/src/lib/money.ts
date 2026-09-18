// ONE currency convention, written down once, because `฿440` and `฿440.00` were
// drifting apart across the mockups by accident.
//
// THE RULE. Every rate is a whole baht, so every price the customer browses renders
// with NO decimals: grids, drawers, breakdowns, tickets and CTA labels call thb().
// The ONE exception is an amount being transferred: a Thai bank app shows two
// decimals, so that call site uses payAmount() and prints the ฿ itself.
//
// Inputs are SATANG (ADR-001 §4.4). Formatting goes through Intl.NumberFormat, never
// `(s/100).toLocaleString()`, which prints ฿440.50 as "฿440.5". If a fractional amount
// ever appears (a fee, a refund), thb() shows two decimals rather than rounding it away.
import type { Satang } from '@/data/types';

const THB_WHOLE = new Intl.NumberFormat('th-TH',
  { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const THB_EXACT = new Intl.NumberFormat('th-TH',
  { style: 'currency', currency: 'THB', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TWO_DP = new Intl.NumberFormat('th-TH',
  { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const thb = (s: Satang): string =>
  (s % 100 === 0 ? THB_WHOLE : THB_EXACT).format(s / 100);   // satang(44_000) → "฿440"

export const payAmount = (s: Satang): string => TWO_DP.format(s / 100);   // → "440.00"
