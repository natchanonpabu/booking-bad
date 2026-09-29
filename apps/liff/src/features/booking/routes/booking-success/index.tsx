import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PriceBreakdown } from '@/features/booking/components/price-breakdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/data/api';
import { COURTS, VENUE } from '@/data/fixtures';
import type { Booking } from '@/data/types';
import { rangeLabel } from '@/features/booking/selection';
import { thaiDateLong } from '@/lib/thai-date';
import { asset } from '@/lib/asset';

export default function BookingSuccess() {
  const { ref = '' } = useParams();
  const [booking, setBooking] = useState<Booking | null | 'missing'>(null);

  useEffect(() => {
    api.getBooking(ref).then((b) => setBooking(b ?? 'missing'));
  }, [ref]);

  if (booking === null) {
    return (
      <div className="space-y-space-md py-space-lg">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (booking === 'missing') {
    return (
      <EmptyState
        mascot="idle"
        headline="ไม่พบการจองนี้"
        body="ลิงก์อาจหมดอายุ หรือเปิดจากเครื่องอื่น"
        primaryAction={
          <Button fullWidth asChild>
            <Link to="/book">กลับไปหน้าจองคอร์ท</Link>
          </Button>
        }
      />
    );
  }

  const court = COURTS.find((c) => c.id === booking.courtIds[0]);
  const startHour = booking.startMinutes / 60;
  const endHour = booking.endMinutes / 60;

  return (
    <div className="py-space-lg">
      <div className="flex flex-col items-center text-center">
        <img src={asset('mascot/capybara-cheer.webp')} alt="คาปิบาร่าชูแร็กเกตดีใจ" width={120} height={120} className="size-30" />
        <h1 className="mt-space-sm font-headline-md text-headline-md text-primary">จองคอร์ทสำเร็จแล้วครับ</h1>
        <p className="mt-1 font-body-md text-body-md text-muted-foreground">
          ล็อกคอร์ทเรียบร้อย เจอกันที่สนามครับ
        </p>
        <Badge tone="peak" dot className="mt-space-sm">รอชำระที่หน้าร้าน</Badge>
      </div>

      {/* The ticket: this screen IS the receipt — no LINE message is sent (Revision 5). */}
      <Card variant="raised" className="mt-space-lg overflow-hidden p-0">
        <div className="bg-primary-container p-space-md text-on-primary">
          <p className="font-label-sm text-label-sm text-on-primary-container">หมายเลขการจอง</p>
          <p className="booking-ref font-headline-md text-headline-md">{booking.ref}</p>
        </div>
        <div className="space-y-space-sm p-space-md">
          <Row icon="stadium" label="สนาม / คอร์ท" value={`${VENUE.name} · ${court?.name ?? ''}`} />
          <Row icon="calendar_today" label="วันที่เล่น" value={thaiDateLong(booking.date)} />
          <Row icon="schedule" label="เวลา" value={rangeLabel(startHour, endHour)} />
          <Row icon="person" label="เบอร์ติดต่อ" value={booking.contactPhone} />
        </div>
        <div className="border-t border-outline-variant/60 p-space-md">
          <PriceBreakdown lines={booking.lines} total={booking.total} />
          <p className="mt-space-sm flex items-start gap-space-xs font-body-sm text-body-sm text-muted-foreground">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            ชำระเงินที่เคาน์เตอร์เมื่อมาถึงสนาม แจ้งหมายเลขการจองกับพนักงานได้เลย
          </p>
        </div>
      </Card>

      <div className="mt-space-md flex flex-col gap-space-xs">
        <CopyButton
          variant="outline"
          fullWidth
          text={booking.ref}
          label="คัดลอกหมายเลขการจอง"
        />
        <Button fullWidth variant="tonal" asChild>
          <Link to="/bookings">ดูการจองของฉัน</Link>
        </Button>
        <Button fullWidth variant="ghost" asChild>
          <Link to="/book">จองคอร์ทอีกครั้ง</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: 'stadium' | 'calendar_today' | 'schedule' | 'person'; label: string; value: string }) {
  return (
    <div className="flex items-start gap-space-sm">
      <Icon name={icon} size={18} className="mt-0.5 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="font-body-sm text-body-sm text-muted-foreground">{label}</p>
        <p className="font-label-lg text-label-lg text-on-surface">{value}</p>
      </div>
    </div>
  );
}
