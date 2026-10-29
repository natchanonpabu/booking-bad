import type { CancellationOutcome } from '@/data/types';
import { thb } from '@/lib/money';
import { thaiDateOnly } from '@/lib/thai-date';

/** What the confirm modal tells the customer BEFORE they commit. The same outcome is
    then recorded by the API, so the promise and the result cannot drift apart. */
export function cancelPreview(outcome: CancellationOutcome): string {
  switch (outcome.kind) {
    case 'credit_now':
      return `ยกเลิกการจองนี้ และรับเครดิต ${thb(outcome.amount)} ใช้จองใหม่ได้ถึง ${thaiDateOnly(outcome.expiresAt)}`;
    case 'credit_if_resold':
      return 'ยกเลิกการจองนี้ ถ้ามีคนจองช่วงนี้ต่อและชำระแล้ว คุณจะได้เครดิตคืน ถ้าไม่มี จะไม่ได้เครดิต';
    case 'none':
      return 'ยกเลิกการจองนี้ คอร์ทจะถูกปล่อยกลับสู่ระบบทันที';
    case 'not_allowed':
      return 'การจองนี้เริ่มไปแล้ว ยกเลิกไม่ได้';
  }
}

/** The toast after the API has answered. */
export function cancelledToast(outcome: CancellationOutcome): string {
  switch (outcome.kind) {
    case 'credit_now':
      return `ยกเลิกแล้ว ได้เครดิต ${thb(outcome.amount)}`;
    case 'credit_if_resold':
      return 'ยกเลิกแล้ว ถ้ามีคนจองต่อ จะได้เครดิตคืน';
    case 'none':
      return 'ยกเลิกการจองแล้ว คอร์ทถูกปล่อยกลับสู่ระบบ';
    case 'not_allowed':
      return 'ยกเลิกไม่ได้ การจองนี้เริ่มไปแล้ว';
  }
}
