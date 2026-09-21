import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/Icon';
import { COURTS } from '@/data/fixtures';
import type { Booking } from '@/data/types';
import { rangeLabel } from '@/features/booking/selection';
import { thb } from '@/lib/money';
import { thaiDateLong } from '@/lib/thaiDate';

const STATUS: Record<Booking['status'], { label: string; tone: 'success' | 'peak' | 'neutral' | 'error'; accent: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', tone: 'success', accent: 'bg-success' },
  pending_payment: { label: 'รอชำระที่หน้าร้าน', tone: 'peak', accent: 'bg-secondary' },
  completed: { label: 'เสร็จสิ้น', tone: 'neutral', accent: 'bg-outline' },
  cancelled: { label: 'ยกเลิกแล้ว', tone: 'error', accent: 'bg-error' },
  expired: { label: 'หมดอายุ', tone: 'neutral', accent: 'bg-outline' },
};

export function BookingCard({ booking, onCancel }: { booking: Booking; onCancel?: () => void }) {
  const court = COURTS.find((c) => c.id === booking.courtIds[0]);
  const status = STATUS[booking.status];
  const past = booking.status === 'completed' || booking.status === 'cancelled';

  return (
    <Card variant="accent" accentColor={status.accent} className="pl-space-md">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="min-w-0">
          <p className="font-label-lg text-label-lg text-primary">{court?.name}</p>
          <p className="font-body-sm text-body-sm text-muted-foreground">{thaiDateLong(booking.date)}</p>
        </div>
        <Badge tone={status.tone} dot={!past}>{status.label}</Badge>
      </div>

      <p className="slot-time mt-space-xs flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
        <Icon name="schedule" size={16} className="text-muted-foreground" />
        {rangeLabel(booking.startMinutes / 60, booking.endMinutes / 60)}
      </p>

      <div className="mt-space-sm flex items-center justify-between">
        <span className="booking-ref font-body-sm text-body-sm text-muted-foreground">{booking.ref}</span>
        <span className="price font-label-lg text-label-lg text-primary">{thb(booking.total)}</span>
      </div>

      {onCancel && !past && (
        <Button variant="ghost" className="mt-space-xs px-0" onClick={onCancel}>
          ยกเลิกการจอง
        </Button>
      )}
    </Card>
  );
}
