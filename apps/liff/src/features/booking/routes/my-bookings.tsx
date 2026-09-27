import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingCard } from '@/features/booking/components/booking-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { api } from '@/data/api';
import { useDb } from '@/data/db';
import { today } from '@/lib/clock';
import type { Booking } from '@/data/types';

export default function MyBookings() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const toast = useToast();

  // Read through the store so the list updates the moment a booking is cancelled.
  const bookings = useDb((s) => s.bookings);

  useEffect(() => { api.getBookings().then(() => setLoading(false)); }, []);

  const { upcoming, past } = useMemo(() => {
    const now = today();
    return {
      upcoming: bookings.filter((b) => b.date >= now && b.status !== 'cancelled' && b.status !== 'completed'),
      past: bookings.filter((b) => b.date < now || b.status === 'cancelled' || b.status === 'completed'),
    };
  }, [bookings]);

  const list = tab === 'upcoming' ? upcoming : past;

  const confirmCancel = async () => {
    if (!cancelling) return;
    await api.cancelBooking(cancelling.id);
    toast.show('ยกเลิกการจองแล้ว คอร์ทถูกปล่อยกลับสู่ระบบ', { tone: 'success' });
    setCancelling(null);
  };

  return (
    <div className="py-space-md">
      <h1 className="font-headline-md text-headline-md text-primary">การจองของฉัน</h1>
      <p className="mb-space-md font-body-md text-body-md text-muted-foreground">
        ตรวจสอบคอร์ทและประวัติการลงสนาม
      </p>

      <SegmentedTabs
        tabs={[
          { id: 'upcoming', label: 'กำลังจะถึง', count: upcoming.length },
          { id: 'past', label: 'ที่ผ่านมา', count: past.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-space-md space-y-space-sm">
        {loading ? (
          Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : list.length === 0 ? (
          <EmptyState
            mascot="idle"
            headline={tab === 'upcoming' ? 'ยังไม่มีนัดตีแบดเลยครับ' : 'ยังไม่มีประวัติการจอง'}
            body={tab === 'upcoming' ? 'รวมก๊วนเพื่อนแล้วมาเลือกล็อกคอร์ทกันเลย' : undefined}
            primaryAction={
              tab === 'upcoming' ? (
                <Button fullWidth asChild>
                  <Link to="/book">
                    <Icon name="sports_tennis" size={20} />
                    ค้นหาและจองคอร์ททันที
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          list.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={tab === 'upcoming' ? () => setCancelling(booking) : undefined}
            />
          ))
        )}
      </div>

      <Modal
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
        title="ยกเลิกการจองนี้?"
        description="คอร์ทจะถูกปล่อยกลับสู่ระบบทันที และยกเลิกแล้วไม่สามารถกู้คืนได้"
        actions={
          <>
            <Button variant="ghost" fullWidth onClick={() => setCancelling(null)}>ไม่ยกเลิก</Button>
            <Button variant="danger" fullWidth onClick={confirmCancel}>ยืนยันยกเลิก</Button>
          </>
        }
      />
    </div>
  );
}
