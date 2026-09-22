import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { thb } from '@/lib/money';
import type { RateRule } from '@/data/types';

const DAY_LABEL: Record<number, string> = { 62: 'จันทร์ – ศุกร์', 65: 'เสาร์ – อาทิตย์', 127: 'ทุกวัน' };
const hhmm = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:00`;

/** Rendered from RATE_RULES, so changing a price is a data edit — never a code edit.
    This is the point the demo makes out loud at the venue (DESIGN.md §8). */
export function RateCard({ rules }: { rules: RateRule[] }) {
  const ordered = [...rules].sort((a, b) => a.priority - b.priority || a.startMinutes - b.startMinutes);

  return (
    <Card>
      <p className="mb-space-sm font-label-lg text-label-lg text-primary">อัตราค่าบริการ</p>
      <div className="space-y-space-xs">
        {ordered.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between gap-space-sm">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface">
                {rule.label}
                {rule.isPeak && <Badge tone="peak" icon="bolt">พีค</Badge>}
              </p>
              <p className="slot-time font-body-sm text-body-sm text-muted-foreground">
                {DAY_LABEL[rule.dayMask] ?? 'ทุกวัน'} · {hhmm(rule.startMinutes)} – {hhmm(rule.endMinutes)}
              </p>
            </div>
            <p className="price shrink-0 font-label-lg text-label-lg text-primary">
              {thb(rule.pricePerHour)}<span className="font-body-sm text-body-sm text-muted-foreground"> / ชม.</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
