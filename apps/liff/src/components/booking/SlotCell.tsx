import { Icon } from '@/components/ui/Icon';
import { thb } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { Slot, SlotStatus } from '@/data/types';

const STATUS_CLASS: Record<SlotStatus, string> = {
  available: 'bg-card hover:bg-accent',
  booked: 'pattern-booked text-muted-foreground',
  maintenance: 'pattern-maintenance text-on-error-container',
  past: 'bg-muted text-muted-foreground opacity-60',
  closed: 'bg-muted text-muted-foreground opacity-60',
};

const STATUS_LABEL: Record<SlotStatus, string> = {
  available: 'ว่าง',
  booked: 'ถูกจองแล้ว',
  maintenance: 'ปิดปรับปรุง',
  past: 'เลยเวลาแล้ว',
  closed: 'นอกเวลาทำการ',
};

/** Announced name, built from data — never scraped from the cell's text, which is only
    a price and would read as "180 baht" with no court and no time (DESIGN.md §6). */
export function slotLabel(courtName: string, slot: Slot, selected: boolean): string {
  const from = Math.floor(slot.startMinutes / 60);
  const time = `เวลา ${String(from).padStart(2, '0')}:00 ถึง ${String(from + 1).padStart(2, '0')}:00`;
  if (slot.status !== 'available') return `${courtName} ${time} ${STATUS_LABEL[slot.status]}`;
  const peak = slot.isPeak ? ' ช่วงพีค' : '';
  const price = ` ราคา ${slot.price / 100} บาท`;
  return `${courtName} ${time} ว่าง${peak}${price}${selected ? ' เลือกอยู่' : ''}`;
}

export interface SlotCellProps {
  /** 1-based column, counting the time axis as column 1. */
  colIndex: number;
  slot: Slot;
  courtName: string;
  selected: boolean;
  /** Where this cell sits inside a multi-hour selection, for the merged look. */
  edge: 'none' | 'single' | 'top' | 'middle' | 'bottom';
  focusable: boolean;
  onTap: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  cellRef: (el: HTMLButtonElement | null) => void;
}

export function SlotCell({
  slot, courtName, selected, edge, focusable, colIndex, onTap, onKeyDown, cellRef,
}: SlotCellProps) {
  const blocked = slot.status !== 'available';
  const radius =
    edge === 'top' ? 'rounded-t-lg rounded-b-none'
      : edge === 'middle' ? 'rounded-none'
        : edge === 'bottom' ? 'rounded-b-lg rounded-t-none'
          : 'rounded-lg';

  return (
    <button
      ref={cellRef}
      type="button"
      role="gridcell"
      aria-colindex={colIndex}
      aria-label={slotLabel(courtName, slot, selected)}
      aria-selected={selected}
      // Never `disabled`: a screen-reader user must be able to arrow onto a booked hour
      // and hear why it is unavailable, instead of silently skipping a full evening.
      aria-disabled={blocked || undefined}
      tabIndex={focusable ? 0 : -1}
      onClick={onTap}
      onKeyDown={onKeyDown}
      className={cn(
        'relative flex h-11 w-full flex-col items-center justify-center border border-outline-variant/60 transition-colors',
        radius,
        selected ? 'border-primary-container bg-primary-container text-on-primary' : STATUS_CLASS[slot.status],
        // The rows are 4px apart; without this the block looks like separate chips.
        selected && (edge === 'top' || edge === 'middle') &&
          'after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:bg-primary-container after:content-[""]',
        blocked && 'cursor-not-allowed',
      )}
    >
      {selected ? (
        // Every selected hour keeps its price. An earlier version showed the tick on the
        // first cell and left the rest blank, which read as a broken cell rather than a
        // two-hour selection — the exact thing this screen has to make obvious.
        <>
          {(edge === 'single' || edge === 'top') && <Icon name="check_circle" size={14} filled />}
          <span className="price font-label-md text-label-md">{thb(slot.price)}</span>
        </>
      ) : slot.status === 'available' ? (
        <span className={cn('price font-label-md text-label-md', slot.isPeak ? 'text-secondary' : 'text-success')}>
          {thb(slot.price)}
        </span>
      ) : (
        <Icon
          name={slot.status === 'maintenance' ? 'build' : slot.status === 'booked' ? 'close' : 'schedule'}
          size={16}
        />
      )}
    </button>
  );
}
