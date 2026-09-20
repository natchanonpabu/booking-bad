import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet } from '@/components/ui/Sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { thb } from '@/lib/money';
import type { Quote } from '@/data/types';

interface SelectionDrawerProps {
  courtName: string | null;
  timeLabel: string;
  hours: number;
  quote: Quote | null;
  quoting: boolean;
  canContinue: boolean;
  announcement: string;
  onClear: () => void;
  onContinue: () => void;
}

/** The sticky summary. Non-modal by construction: the grid stays scrollable and
    tappable underneath, which is the whole interaction (DESIGN.md §6). */
export function SelectionDrawer({
  courtName, timeLabel, hours, quote, quoting, canContinue, announcement, onClear, onContinue,
}: SelectionDrawerProps) {
  const empty = !courtName;

  return (
    <Sheet>
      {/* The polite half of the two live regions: what is selected and what it costs. */}
      <p className="sr-only" aria-live="polite">{announcement}</p>

      {empty ? (
        <div className="flex items-center gap-space-sm">
          <div className="flex-1">
            <p className="font-label-lg text-label-lg text-primary">ยังไม่ได้เลือกคอร์ท</p>
            <p className="font-body-sm text-body-sm text-muted-foreground">
              แตะช่องว่างในตารางเพื่อเลือกเวลา
            </p>
          </div>
          <Button disabled trailingIcon="arrow_forward">จองทันที</Button>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-space-sm">
            <div className="min-w-0">
              <p className="font-label-lg text-label-lg text-primary">
                {courtName} · {hours} ชั่วโมง
              </p>
              <p className="slot-time font-body-sm text-body-sm text-muted-foreground">{timeLabel}</p>
            </div>
            <div className="text-right">
              {quoting || !quote ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <>
                  <p className="total font-headline-sm text-headline-sm text-primary">{thb(quote.total)}</p>
                  {quote.rateMix !== 'standard' && (
                    <Badge tone="peak" icon="bolt">
                      {quote.rateMix === 'mixed' ? 'ปกติ + พีค' : 'ช่วงพีค'}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-space-sm flex gap-space-xs">
            <Button variant="ghost" onClick={onClear}>ล้าง</Button>
            <Button fullWidth disabled={!canContinue} trailingIcon="arrow_forward" onClick={onContinue}>
              จองทันที
            </Button>
          </div>
        </>
      )}
    </Sheet>
  );
}
