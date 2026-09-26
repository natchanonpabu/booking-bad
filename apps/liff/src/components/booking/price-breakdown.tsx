import { Separator } from '@/components/ui/separator';
import { thb } from '@/lib/money';
import type { QuoteLine, Satang } from '@/data/types';

/** One QuoteLine[] is computed once and rendered here, on the ticket, and stored on the
    booking — a range crossing the peak boundary shows two rows without extra code. */
export function PriceBreakdown({ lines, total }: { lines: QuoteLine[]; total: Satang }) {
  return (
    <div>
      {lines.map((line) => (
        <p key={line.rateRuleId} className="flex justify-between gap-space-sm py-0.5 font-body-md text-body-md">
          <span className="text-muted-foreground">{line.label}</span>
          <span className={line.tag ? 'text-success' : 'price text-on-surface'}>
            {line.tag ?? thb(line.amount)}
          </span>
        </p>
      ))}
      <Separator className="my-space-sm" />
      <p className="flex items-baseline justify-between">
        <span className="font-label-lg text-label-lg text-on-surface">ยอดรวม</span>
        <span className="total font-headline-sm text-headline-sm text-primary">{thb(total)}</span>
      </p>
    </div>
  );
}
