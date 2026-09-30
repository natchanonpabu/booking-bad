import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourtMatrix } from './components/court-matrix';
import { DateStrip, type DateOption } from './components/date-strip';
import { LegendBar } from './components/legend-bar';
import { SelectionDrawer } from './components/selection-drawer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/data/api';
import { countAvailableSlots, isDayFull, type DayGrid } from '@/data/availability';
import { COURTS, D, VENUE } from '@/data/fixtures';
import { priceForHour } from '@/data/rates';
import type { ISODate } from '@/data/types';
import { useBookingFlow } from '@/app/providers/booking-flow-provider';
import { useSlotSelection } from './hooks/use-slot-selection';
import { addDays, defaultDemoDate, today } from '@/lib/clock';
import { thb } from '@/lib/money';
import { thaiDateLong } from '@/lib/thai-date';

const DAY_COUNT = 14;

export default function BookingGrid() {
  const navigate = useNavigate();
  const { dispatch } = useBookingFlow();
  const [date, setDate] = useState<ISODate>(defaultDemoDate());
  const [grid, setGrid] = useState<DayGrid | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    setGrid(null);
    setError(false);
    api.getAvailability(date)
      .then((next) => { if (live) setGrid(next); })
      .catch(() => { if (live) setError(true); });
    return () => { live = false; };
  }, [date]);

  const selection = useSlotSelection({ grid, courts: COURTS });

  const days: DateOption[] = useMemo(() => {
    const start = today();
    return Array.from({ length: DAY_COUNT }, (_, i) => {
      const d = addDays(start, i);
      return { date: d, isToday: i === 0, soldOut: d === D.soldOut, past: false };
    });
  }, []);

  const freeCount = grid ? countAvailableSlots(grid) : 0;
  const soldOut = grid ? isDayFull(grid) : false;

  return (
    <div className="py-space-md">
      <header className="mb-space-sm">
        <h1 className="font-headline-md text-headline-md text-primary">จองคอร์ทแบดมินตัน</h1>
        <p className="font-body-md text-body-md text-muted-foreground">
          {thaiDateLong(date)} · {grid ? `ว่าง ${freeCount} ช่วงเวลา` : 'กำลังโหลด…'}
        </p>
      </header>

      <DateStrip days={days} value={date} onChange={setDate} />

      <div className="mt-space-sm">
        <LegendBar
          standard={thb(priceForHour(date, VENUE.openMinutes))}
          peak={thb(priceForHour(date, 19 * 60))}
        />
      </div>

      {error ? (
        <div className="mt-space-lg rounded-xl bg-card p-space-lg text-center shadow-card">
          <p className="font-label-lg text-label-lg text-primary">โหลดตารางไม่สำเร็จ</p>
          <p className="mt-1 font-body-md text-body-md text-muted-foreground">
            ลองใหม่อีกครั้งได้เลยครับ
          </p>
          <Button className="mt-space-md" leadingIcon="refresh" onClick={() => setDate(date)}>
            ลองอีกครั้ง
          </Button>
        </div>
      ) : !grid ? (
        <div className="mt-space-sm space-y-1" aria-busy="true" aria-label="กำลังโหลดตาราง">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : soldOut ? (
        <EmptyState
          mascot="sleep"
          headline="วันนี้คอร์ทเต็มทุกช่วงเวลาแล้วครับ"
          body="ลองดูวันถัดไปไหมครับ ยังมีช่วงค่ำว่างอยู่"
          primaryAction={
            <Button fullWidth trailingIcon="arrow_forward" onClick={() => setDate(addDays(date, 1))}>
              ดูวัน{thaiDateLong(addDays(date, 1))}
            </Button>
          }
        />
      ) : (
        <div className="mt-space-sm">
          <CourtMatrix grid={grid} courts={COURTS} selection={selection.selection} onTap={selection.tap} />
        </div>
      )}

      {!soldOut && !error && (
        <SelectionDrawer
          courtName={selection.courtId ? COURTS.find((c) => c.id === selection.courtId)?.name ?? null : null}
          timeLabel={selection.timeLabel}
          hours={selection.hours}
          quote={selection.quote}
          quoting={selection.quoting}
          canContinue={selection.canContinue}
          announcement={selection.announcement}
          onClear={selection.clear}
          onContinue={() => {
            if (selection.selection.kind !== 'range') return;
            dispatch({ type: 'select', draft: selection.selection });
            navigate('/book/review');
          }}
        />
      )}
    </div>
  );
}
