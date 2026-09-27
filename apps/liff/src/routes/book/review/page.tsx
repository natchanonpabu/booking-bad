import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PriceBreakdown } from '@/routes/book/components/price-breakdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/toast';
import { useBookingFlow } from '@/app/providers/booking-flow-provider';
import { api, SlotTakenError } from '@/data/api';
import { COURTS, VENUE } from '@/data/fixtures';
import { quote as computeQuote } from '@/data/rates';
import { rangeLabel } from '@/features/booking/selection';
import { thaiDateLong } from '@/lib/thai-date';
import { cn } from '@/lib/utils';

const PHONE_OK = /^0[0-9]{8,9}$/;

export default function BookingReview() {
  const navigate = useNavigate();
  const { state, dispatch } = useBookingFlow();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const draft = state.draft;

  // Landing here without a selection means a refresh or a stray link, not a bug.
  useEffect(() => { if (!draft) navigate('/book', { replace: true }); }, [draft, navigate]);
  if (!draft) return null;

  const court = COURTS.find((c) => c.id === draft.courtIds[0]);
  const quote = computeQuote(draft.date, draft.startHour * 60, draft.endHour * 60);
  const phoneDigits = state.contactPhone.replace(/[^0-9]/g, '');
  const phoneValid = PHONE_OK.test(phoneDigits);

  const confirm = async () => {
    setTouched(true);
    if (!phoneValid) return;
    setSubmitting(true);
    try {
      const booking = await api.confirmBooking(draft, phoneDigits, state.method);
      dispatch({ type: 'reset' });
      navigate(`/book/success/${booking.ref}`, { replace: true });
    } catch (error) {
      setSubmitting(false);
      if (error instanceof SlotTakenError) {
        toast.show('ช่วงเวลานี้เพิ่งถูกจองไปครับ กรุณาเลือกใหม่', { tone: 'error', assertive: true });
        navigate('/book', { replace: true });
        return;
      }
      toast.show('บันทึกไม่สำเร็จ ลองอีกครั้งครับ', { tone: 'error', assertive: true });
    }
  };

  return (
    <div className="py-space-md">
      <div className="mb-space-md flex items-center gap-space-xs">
        <button
          type="button"
          aria-label="ย้อนกลับ"
          onClick={() => navigate(-1)}
          className="grid size-12 place-items-center rounded-full text-primary"
        >
          <Icon name="arrow_back_ios_new" size={20} />
        </button>
        <div>
          <h1 className="font-headline-sm text-headline-sm text-primary">ยืนยันข้อมูลการจอง</h1>
          <p className="font-body-sm text-body-sm text-muted-foreground">ขั้นตอน 1 จาก 2</p>
        </div>
      </div>

      <Card variant="accent" accentColor="bg-primary-container">
        <p className="font-headline-sm text-headline-sm text-primary">{court?.longLabel}</p>
        <div className="mt-space-sm space-y-1">
          <p className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
            <Icon name="calendar_today" size={18} className="text-muted-foreground" />
            {thaiDateLong(draft.date)}
          </p>
          <p className="slot-time flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
            <Icon name="schedule" size={18} className="text-muted-foreground" />
            {rangeLabel(draft.startHour, draft.endHour)} ({draft.endHour - draft.startHour} ชั่วโมง)
          </p>
          <p className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface">
            <Icon name="stadium" size={18} className="text-muted-foreground" />
            {VENUE.displayName}
          </p>
        </div>
      </Card>

      <Card className="mt-space-md">
        <p className="mb-space-sm font-label-lg text-label-lg text-primary">รายละเอียดค่าบริการ</p>
        <PriceBreakdown lines={quote.lines} total={quote.total} />
      </Card>

      <Card className="mt-space-md">
        <Label htmlFor="phone" className="font-label-lg text-label-lg text-primary">
          เบอร์โทรติดต่อ
        </Label>
        <p className="mb-space-xs font-body-sm text-body-sm text-muted-foreground">
          สนามใช้ติดต่อกลับกรณีมีการเปลี่ยนแปลง
        </p>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="08X-XXX-XXXX"
          value={state.contactPhone}
          onChange={(e) => dispatch({ type: 'phone', value: e.target.value })}
          onBlur={() => setTouched(true)}
          aria-invalid={touched && !phoneValid}
          aria-describedby="phone-error"
          className={cn('text-body-lg', touched && !phoneValid && 'border-error')}
        />
        {touched && !phoneValid && (
          <p id="phone-error" className="mt-1 font-body-sm text-body-sm text-error">
            กรุณากรอกเบอร์โทรให้ครบ 9–10 หลัก
          </p>
        )}
      </Card>

      <Card className="mt-space-md">
        <p className="mb-space-sm font-label-lg text-label-lg text-primary">วิธีชำระเงิน</p>
        <RadioGroup
          value={state.method}
          onValueChange={(value) => dispatch({ type: 'method', value: value as 'counter' })}
          aria-label="วิธีชำระเงิน"
        >
          <label className="flex min-h-touch items-start gap-space-sm rounded-xl border border-primary-container bg-surface-container-low p-space-sm">
            <RadioGroupItem value="counter" id="pay-counter" className="mt-1" />
            <span>
              <span className="block font-label-lg text-label-lg text-on-surface">ชำระที่หน้าร้าน</span>
              <span className="block font-body-sm text-body-sm text-muted-foreground">
                จ่ายเงินสดหรือโอนที่เคาน์เตอร์ตอนมาถึงสนาม
              </span>
            </span>
          </label>
        </RadioGroup>
        <p className="mt-space-sm flex items-start gap-space-xs font-body-sm text-body-sm text-muted-foreground">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          ยกเลิกฟรีถ้าแจ้งก่อนเริ่มเล่นมากกว่า {VENUE.cancellationHours} ชั่วโมง
        </p>
      </Card>

      <div className="mt-space-lg">
        <Button fullWidth size="lg" loading={submitting} onClick={confirm} trailingIcon="check_circle">
          ยืนยันการจอง
        </Button>
      </div>
    </div>
  );
}
