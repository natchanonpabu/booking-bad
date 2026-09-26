import { useRovingFocus } from '@/lib/use-roving-focus';
import { thaiDayShort, thaiMonthShort } from '@/lib/thai-date';
import { cn } from '@/lib/utils';
import type { ISODate } from '@/data/types';

export interface DateOption {
  date: ISODate;
  isToday: boolean;
  soldOut: boolean;
  past: boolean;
}

/** Horizontal date picker. Built on our own roving focus, not Radix Tabs: Radix drops
    disabled items out of the arrow-key order, and past days must stay reachable. */
export function DateStrip({ days, value, onChange }: {
  days: DateOption[];
  value: ISODate;
  onChange: (date: ISODate) => void;
}) {
  const roving = useRovingFocus(days.length, Math.max(0, days.findIndex((d) => d.date === value)));

  return (
    <div
      role="radiogroup"
      aria-label="เลือกวันที่"
      className="-mx-gutter-mobile flex gap-space-xs overflow-x-auto px-gutter-mobile pb-1 no-scrollbar"
    >
      {days.map((day, index) => {
        const selected = day.date === value;
        const dayNumber = Number(day.date.slice(8, 10));
        return (
          <button
            key={day.date}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={day.past || undefined}
            onClick={() => !day.past && onChange(day.date)}
            className={cn(
              'flex min-h-touch w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border transition-colors',
              selected
                ? 'border-primary-container bg-primary-container text-on-primary'
                : 'border-outline-variant/60 bg-card text-on-surface',
              day.past && 'opacity-40',
            )}
            {...roving.itemProps(index)}
          >
            <span className="font-label-sm text-label-sm">
              {day.isToday ? 'วันนี้' : thaiDayShort(day.date)}
            </span>
            <span className="font-label-lg text-label-lg">{dayNumber}</span>
            <span className={cn('font-label-sm text-label-sm', selected ? 'text-on-primary-container' : 'text-muted-foreground')}>
              {day.soldOut ? 'เต็ม' : thaiMonthShort(day.date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
