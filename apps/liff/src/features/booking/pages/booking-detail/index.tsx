import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PriceBreakdown } from '@/features/booking/components/price-breakdown';
import { BOOKING_STATUS, isActiveBooking } from '@/features/booking/status';
import { cancelledToast, cancelPreview } from '@/features/booking/cancel-copy';
import { rangeLabel } from '@/features/booking/selection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { api } from '@/data/api';
import { cancellationOutcome, creditDeadline, startsAt } from '@/data/cancellation';
import { COURTS, VENUE } from '@/data/fixtures';
import type { Booking, CancellationOutcome } from '@/data/types';
import { now } from '@/lib/clock';
import { thb } from '@/lib/money';
import { thaiDateLong, thaiDateOnly, thaiDateTime } from '@/lib/thai-date';

type Load = { state: 'loading' } | { state: 'missing' } | { state: 'error' } | { state: 'ready'; booking: Booking };

export default function BookingDetail() {
  const { ref = '' } = useParams();
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const fetchBooking = useCallback(() => {
    api.getBooking(ref)
      .then((b) => setLoad(b ? { state: 'ready', booking: b } : { state: 'missing' }))
      .catch(() => setLoad({ state: 'error' }));
  }, [ref]);

  useEffect(() => {
    setLoad({ state: 'loading' });
    fetchBooking();
  }, [fetchBooking]);

  if (load.state === 'loading') {
    return (
      <div className="space-y-space-md py-space-md">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  // One screen for "no such ref" and "not yours": it must never reveal that a ref exists.
  if (load.state === 'missing') {
    return (
      <EmptyState
        mascot="idle"
        headline="ไม่พบการจองนี้"
        body="ลิงก์อาจไม่ถูกต้อง หรือเปิดจากบัญชีอื่น"
        primaryAction={
          <Button fullWidth asChild>
            <Link to="/bookings">กลับไปการจองของฉัน</Link>
          </Button>
        }
      />
    );
  }

  if (load.state === 'error') {
    return (
      <EmptyState
        mascot="idle"
        headline="โหลดข้อมูลไม่สำเร็จ"
        body="ตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง"
        primaryAction={<Button fullWidth leadingIcon="refresh" onClick={fetchBooking}>ลองอีกครั้ง</Button>}
      />
    );
  }

  const { booking } = load;
  const court = COURTS.find((c) => c.id === booking.courtIds[0]);
  const status = BOOKING_STATUS[booking.status];
  const started = now() >= startsAt(booking);
  const canCancel = isActiveBooking(booking) && !started;
  const preview = cancellationOutcome(booking, now(), VENUE);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      const outcome = await api.cancelBooking(booking.id);
      toast.show(cancelledToast(outcome), { tone: outcome.kind === 'not_allowed' ? 'neutral' : 'success' });
      setConfirming(false);
      fetchBooking();
    } catch {
      // The modal stays open and the booking is untouched, so the customer can try again.
      toast.show('ยกเลิกไม่สำเร็จ กรุณาลองอีกครั้ง', { tone: 'error', assertive: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-space-md">
      <Button variant="ghost" className="-ml-space-xs px-space-xs" asChild>
        <Link to="/bookings">
          <Icon name="arrow_back_ios_new" size={16} />
          การจองของฉัน
        </Link>
      </Button>

      <div className="mt-space-xs flex flex-wrap items-center gap-space-xs">
        <h1 className="font-headline-md text-headline-md text-primary">รายละเอียดการจอง</h1>
        <Badge tone={status.tone} dot={isActiveBooking(booking)}>{status.label}</Badge>
      </div>
      <p className="mt-1 font-body-md text-body-md text-muted-foreground">{statusNote(booking)}</p>

      <Card variant="raised" className="mt-space-md overflow-hidden p-0">
        <div className="bg-primary-container p-space-md text-on-primary">
          <p className="font-label-sm text-label-sm text-on-primary-container">หมายเลขการจอง</p>
          <p className="booking-ref font-headline-md text-headline-md">{booking.ref}</p>
        </div>
        <div className="space-y-space-sm p-space-md">
          <Row icon="stadium" label="สนาม / คอร์ท" value={`${VENUE.name} · ${court?.name ?? ''}`} />
          <Row icon="calendar_today" label="วันที่เล่น" value={thaiDateLong(booking.date)} />
          <Row icon="schedule" label="เวลา" value={rangeLabel(booking.startMinutes / 60, booking.endMinutes / 60)} />
          <Row icon="person" label="เบอร์ติดต่อ" value={booking.contactPhone} />
        </div>
        <div className="border-t border-outline-variant/60 p-space-sm">
          <CopyButton variant="ghost" fullWidth text={booking.ref} label="คัดลอกหมายเลขการจอง" />
        </div>
      </Card>

      <Card className="mt-space-md">
        <p className="font-label-lg text-label-lg text-primary">{VENUE.displayName}</p>
        <p className="mt-1 font-body-md text-body-md text-muted-foreground">{VENUE.addressTh}</p>
        <div className="mt-space-sm flex gap-space-sm">
          <Button variant="outline" fullWidth leadingIcon="location_on" asChild>
            <a href={VENUE.mapsUrl} target="_blank" rel="noopener noreferrer">แผนที่</a>
          </Button>
          <Button variant="outline" fullWidth leadingIcon="call" asChild>
            <a href={`tel:${VENUE.phone}`} aria-label={`โทรหาสนาม ${VENUE.phoneDisplay}`}>โทรหาสนาม</a>
          </Button>
        </div>
      </Card>

      <Card className="mt-space-md">
        <h2 className="mb-space-xs font-headline-sm text-headline-sm text-primary">ค่าใช้จ่าย</h2>
        <PriceBreakdown lines={booking.lines} total={booking.total} />
        <p className="mt-space-sm flex items-start gap-space-xs font-body-sm text-body-sm text-muted-foreground">
          <Icon name="payments" size={16} className="mt-0.5 shrink-0" />
          {paymentNote(booking)}
        </p>
      </Card>

      <Card variant="inset" className="mt-space-md">
        <h2 className="mb-space-xs font-label-lg text-label-lg text-primary">นโยบายยกเลิก</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {policyNote(booking, canCancel, preview)}
        </p>
      </Card>

      <div className="mt-space-lg flex flex-col gap-space-xs">
        {canCancel ? (
          <>
            <Button variant="primary" fullWidth asChild>
              <Link to="/book">จองคอร์ทอีกครั้ง</Link>
            </Button>
            <Modal
              open={confirming}
              onOpenChange={setConfirming}
              title="ยกเลิกการจองนี้?"
              description={cancelPreview(preview)}
              trigger={<Button variant="outline" fullWidth>ยกเลิกการจอง</Button>}
              actions={
                <>
                  <Button variant="ghost" fullWidth onClick={() => setConfirming(false)}>ไม่ยกเลิก</Button>
                  <Button variant="danger" fullWidth loading={busy} onClick={confirmCancel}>ยืนยันยกเลิก</Button>
                </>
              }
            />
          </>
        ) : (
          <Button fullWidth asChild>
            <Link to="/book">{booking.status === 'completed' ? 'จองคอร์ทอีกครั้ง' : 'จองคอร์ทใหม่'}</Link>
          </Button>
        )}
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

/** The line under the title: what to DO next for a live booking, what happened otherwise. */
function statusNote(b: Booking): string {
  switch (b.status) {
    case 'pending_payment':
      return `ชำระ ${thb(b.total)} ที่เคาน์เตอร์ก่อนเล่น แจ้งหมายเลขการจองกับพนักงาน`;
    case 'confirmed':
      return b.paidAt ? `ชำระแล้วเมื่อ ${thaiDateTime(b.paidAt)}` : 'ยืนยันการจองแล้ว';
    case 'completed':
      return 'เล่นเสร็จแล้ว ขอบคุณที่มาใช้บริการครับ';
    case 'cancelled':
      return b.cancelledAt ? `ยกเลิกเมื่อ ${thaiDateTime(b.cancelledAt)}` : 'การจองนี้ถูกยกเลิกแล้ว';
    case 'expired':
      return 'หมดเวลาถือคอร์ท คอร์ทถูกปล่อยกลับแล้ว';
  }
}

function paymentNote(b: Booking): string {
  if (b.paymentStatus === 'paid') return 'ชำระเงินแล้ว';
  return 'วิธีชำระ: ชำระที่หน้าร้าน (เงินสดหรือโอนที่เคาน์เตอร์)';
}

function policyNote(b: Booking, canCancel: boolean, preview: CancellationOutcome): string {
  if (b.status === 'cancelled') {
    const o = b.creditOutcome;
    if (!o || o.kind === 'none') return 'การจองนี้ไม่มีเครดิต';
    if (o.kind === 'credit_now') return `ได้เครดิต ${thb(o.amount)} ใช้จองใหม่ได้ถึง ${thaiDateOnly(o.expiresAt)}`;
    if (o.kind === 'credit_if_resold') return 'รอมีคนจองช่วงนี้ต่อ เพื่อรับเครดิตคืน';
    return '';
  }
  if (!canCancel) return 'การจองนี้ไม่สามารถยกเลิกได้แล้ว';
  switch (preview.kind) {
    case 'credit_now':
      return `ยกเลิกได้ถึง ${thaiDateTime(creditDeadline(b, VENUE))} เพื่อรับเครดิต ${thb(preview.amount)} ใช้จองใหม่ภายใน ${VENUE.creditExpiryDays} วัน`;
    case 'credit_if_resold':
      return 'เลยเวลารับเครดิตทันทีแล้ว ยังยกเลิกได้ ถ้ามีคนจองช่วงนี้ต่อ คุณจะได้เครดิตคืน';
    case 'none':
      return 'ยังไม่ได้ชำระเงิน ยกเลิกได้โดยไม่มีค่าใช้จ่าย';
    case 'not_allowed':
      return 'การจองนี้เริ่มไปแล้ว';
  }
}
