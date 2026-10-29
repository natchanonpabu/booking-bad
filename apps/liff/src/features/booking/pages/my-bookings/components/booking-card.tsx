import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { COURTS } from '@/data/fixtures';
import type { Booking } from '@/data/types';
import { BOOKING_STATUS } from '@/features/booking/status';
import { rangeLabel } from '@/features/booking/selection';
import { thb } from '@/lib/money';
import { thaiDateLong } from '@/lib/thai-date';

export function BookingCard({ booking, onCancel }: { booking: Booking; onCancel?: () => void }) {
  const court = COURTS.find((c) => c.id === booking.courtIds[0]);
  const status = BOOKING_STATUS[booking.status];
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

      <div className="mt-space-xs flex items-center justify-between">
        <Button variant="ghost" className="px-0" asChild>
          <Link to={`/bookings/${booking.ref}`} aria-label={`ดูรายละเอียดการจอง ${booking.ref}`}>
            ดูรายละเอียด
            <Icon name="chevron_right" size={18} />
          </Link>
        </Button>
        {onCancel && !past && (
          <Button variant="ghost" className="px-0" onClick={onCancel}>
            ยกเลิกการจอง
          </Button>
        )}
      </div>
    </Card>
  );
}
