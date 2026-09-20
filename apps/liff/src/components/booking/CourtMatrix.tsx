import { useRef } from 'react';
import type { DayGrid } from '@/data/availability';
import type { Court, Selection } from '@/data/types';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { SlotCell } from './SlotCell';

interface CourtMatrixProps {
  grid: DayGrid;
  courts: Court[];
  selection: Selection;
  onTap: (courtId: string, hour: number) => void;
}

/**
 * The 6 × 13 booking matrix. `role="grid"` rather than a plain table: in browse mode a
 * screen reader intercepts the arrow keys of a data table, so the key map below would
 * never reach the user it was written for (DESIGN.md §6, Plan 01 §3.5 #5).
 */
export function CourtMatrix({ grid, courts, selection, onTap }: CourtMatrixProps) {
  const focus = useRef({ court: 0, hour: 0 });
  const cells = useRef(new Map<string, HTMLButtonElement | null>());
  const key = (c: number, h: number) => `${c}:${h}`;

  const move = (courtIndex: number, hourIndex: number) => {
    const c = Math.max(0, Math.min(courts.length - 1, courtIndex));
    const h = Math.max(0, Math.min(grid.hours.length - 1, hourIndex));
    focus.current = { court: c, hour: h };
    cells.current.get(key(c, h))?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, c: number, h: number) => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [c, h - 1], ArrowDown: [c, h + 1],
      ArrowLeft: [c - 1, h], ArrowRight: [c + 1, h],
      Home: [0, h], End: [courts.length - 1, h],
      PageUp: [c, 0], PageDown: [c, grid.hours.length - 1],
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    move(next[0], next[1]);
  };

  const selected = selection.kind === 'range' ? selection : null;
  const edgeFor = (courtId: string, hour: number) => {
    if (!selected || !selected.courtIds.includes(courtId)) return 'none' as const;
    if (hour < selected.startHour || hour >= selected.endHour) return 'none' as const;
    const span = selected.endHour - selected.startHour;
    if (span === 1) return 'single' as const;
    if (hour === selected.startHour) return 'top' as const;
    if (hour === selected.endHour - 1) return 'bottom' as const;
    return 'middle' as const;
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      {/* Sized so all six courts fit a 430px column: a venue owner wants to see their
          whole venue at once, and a horizontal scroll hides half of it in the pitch. */}
      <div role="grid" aria-label="ตารางเวลาว่างของแต่ละคอร์ท" lang="th" className="min-w-[336px]">
        {/* Not sticky: the page scrolls as one, so a sticky header sits 64px down the
            viewport and covers the 09:00 row at the top of the grid. */}
        <div role="row" className="flex gap-1 pb-1">
          <div className="w-12 shrink-0" />
          {courts.map((court) => (
            <div
              key={court.id}
              role="columnheader"
              className="flex min-w-0 flex-1 flex-col items-center rounded-lg bg-muted px-0.5 py-1"
            >
              <span className="font-label-lg text-label-lg text-primary">{court.number}</span>
              <span className="w-full truncate text-center font-label-sm text-label-sm text-muted-foreground">{court.gridSubtitle}</span>
            </div>
          ))}
        </div>

        {grid.hours.map((hour, hourIndex) => {
          const peak = courts.some((c) => grid.slots[c.id]?.[hour]?.isPeak);
          return (
            <div role="row" key={hour} className={cn('flex gap-1 py-0.5', peak && 'bg-secondary-container/10')}>
              <div
                role="rowheader"
                className="slot-time flex w-12 shrink-0 items-center justify-end gap-0.5 pr-1 font-label-sm text-label-sm text-muted-foreground"
              >
                {peak && <Icon name="bolt" size={14} className="text-secondary" />}
                {String(hour).padStart(2, '0')}:00
              </div>
              {courts.map((court, courtIndex) => {
                const slot = grid.slots[court.id]?.[hour];
                if (!slot) return <div key={court.id} className="min-w-0 flex-1" />;
                const isFocusTarget = focus.current.court === courtIndex && focus.current.hour === hourIndex;
                return (
                  <div key={court.id} className="min-w-0 flex-1">
                    <SlotCell
                      slot={slot}
                      courtName={court.name}
                      selected={edgeFor(court.id, hour) !== 'none'}
                      edge={edgeFor(court.id, hour)}
                      focusable={isFocusTarget}
                      cellRef={(el) => cells.current.set(key(courtIndex, hourIndex), el)}
                      onTap={() => {
                        focus.current = { court: courtIndex, hour: hourIndex };
                        onTap(court.id, hour);
                      }}
                      onKeyDown={(e) => onKeyDown(e, courtIndex, hourIndex)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
