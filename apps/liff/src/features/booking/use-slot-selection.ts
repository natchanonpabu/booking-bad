import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DayGrid } from '@/data/availability';
import { VENUE } from '@/data/fixtures';
import { quote as computeQuote } from '@/data/rates';
import type { Court, CourtId, Quote, Selection } from '@/data/types';
import { useToast } from '@/components/ui/toast';
import { rangeLabel, reconcile, tap as applyTap, type Feedback } from './selection';
import { thb } from '@/lib/money';

/** The React skin over the pure rules in selection.ts: state, toasts, the debounced
    quote and the one sentence the drawer announces politely (Plan 01 §8.5, §8.6). */
export function useSlotSelection({ grid, courts }: { grid: DayGrid | null; courts: Court[] }) {
  const [selection, setSelection] = useState<Selection>({ kind: 'none' });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const toast = useToast();
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [announcement, setAnnouncement] = useState('');

  const say = useCallback((feedback: Feedback) => {
    if (!feedback) return;
    if (feedback.tone === 'assertive') {
      toast.show(feedback.message, { tone: 'error', assertive: true });
      return;
    }
    // Politely announced through the drawer's live region, debounced so a held
    // Shift+↓ does not flood the screen-reader buffer.
    clearTimeout(announceTimer.current);
    announceTimer.current = setTimeout(() => setAnnouncement(feedback.message), 300);
  }, [toast]);

  const tap = useCallback((courtId: CourtId, hour: number) => {
    if (!grid) return;
    setSelection((current) => {
      const result = applyTap(current, courtId, hour, { grid, courts });
      say(result.feedback);
      return result.selection;
    });
  }, [grid, courts, say]);

  const clear = useCallback(() => {
    setSelection({ kind: 'none' });
    say({ tone: 'polite', message: 'ยกเลิกการเลือกแล้ว' });
  }, [say]);

  // A refetch, a date change or a slot taken elsewhere drops a selection that can no
  // longer be bought — and says so, rather than failing at the review screen.
  useEffect(() => {
    if (!grid) return;
    setSelection((current) => {
      const out = reconcile(current, grid);
      if (!out) return current;
      say(out.feedback);
      return out.selection;
    });
  }, [grid, say]);

  // Debounced so the shape matches Plan 04, where the quote is server-authoritative.
  useEffect(() => {
    if (selection.kind !== 'range') {
      setQuote(null);
      setQuoting(false);
      return;
    }
    setQuoting(true);
    const { date, startHour, endHour } = selection;
    const timer = setTimeout(() => {
      setQuote(computeQuote(date, startHour * 60, endHour * 60));
      setQuoting(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [selection]);

  useEffect(() => () => clearTimeout(announceTimer.current), []);

  const derived = useMemo(() => {
    if (selection.kind !== 'range') {
      return { hours: 0, timeLabel: '', courtId: null as CourtId | null, summary: 'ยังไม่ได้เลือกคอร์ท' };
    }
    const courtId = selection.courtIds[0]!;
    const court = courts.find((c) => c.id === courtId);
    const hours = selection.endHour - selection.startHour;
    const timeLabel = rangeLabel(selection.startHour, selection.endHour);
    return {
      hours,
      timeLabel,
      courtId,
      summary: quote
        ? `เลือก ${court?.name ?? ''} เวลา ${timeLabel} รวม ${hours} ชั่วโมง ยอดรวม ${thb(quote.total)}`
        : `เลือก ${court?.name ?? ''} เวลา ${timeLabel}`,
    };
  }, [selection, courts, quote]);

  return {
    selection,
    quote,
    quoting,
    /** The CTA enables iff there is a range, no quote in flight and a grid to trust. */
    canContinue: selection.kind === 'range' && !quoting && grid !== null,
    maxHours: VENUE.maxBookingHours,
    announcement,
    tap,
    clear,
    ...derived,
  };
}
