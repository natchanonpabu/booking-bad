import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AmenityGrid } from '@/components/booking/AmenityGrid';
import { PhotoCarousel } from '@/components/booking/PhotoCarousel';
import { RateCard } from '@/components/booking/RateCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/Icon';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/data/api';
import { countAvailableSlots, type DayGrid } from '@/data/availability';
import { COURTS, RATE_RULES, VENUE } from '@/data/fixtures';
import { defaultDemoDate } from '@/lib/clock';
import { thaiDateLong } from '@/lib/thaiDate';

export default function CourtProfile() {
  const [grid, setGrid] = useState<DayGrid | null>(null);
  const date = defaultDemoDate();

  useEffect(() => {
    let live = true;
    api.getAvailability(date).then((next) => { if (live) setGrid(next); });
    return () => { live = false; };
  }, [date]);

  // Counted from the same grid the booking screen renders — never a decorative number.
  const freeCount = grid ? countAvailableSlots(grid) : null;
  const eveningFree = grid
    ? COURTS.filter((c) => [19, 20, 21].some((h) => grid.slots[c.id]?.[h]?.status === 'available')).length
    : null;

  return (
    <div className="pb-space-2xl pt-space-md">
      <PhotoCarousel slides={VENUE.photos} />

      <div className="mt-space-md">
        <div className="flex items-start justify-between gap-space-sm">
          <h1 className="font-headline-md text-headline-md text-primary">{VENUE.displayName}</h1>
          <Badge tone="success" dot>เปิดอยู่</Badge>
        </div>
        <p className="mt-1 flex items-start gap-space-xs font-body-md text-body-md text-muted-foreground">
          <Icon name="location_on" size={18} className="mt-0.5 shrink-0" />
          {VENUE.addressTh}
        </p>
        <p className="mt-space-xs flex items-center gap-space-xs font-body-md text-body-md text-muted-foreground">
          <Icon name="sports_tennis" size={18} />
          {COURTS.length} คอร์ท · เปิดทุกวัน 09:00 – 22:00
        </p>
      </div>

      <div className="mt-space-sm flex gap-space-xs">
        <Button variant="outline" fullWidth asChild>
          <a href={VENUE.mapsUrl} target="_blank" rel="noreferrer">
            <Icon name="map" size={20} />
            แผนที่
          </a>
        </Button>
        <Button variant="outline" fullWidth asChild>
          <a href={`tel:${VENUE.phone}`}>
            <Icon name="call" size={20} />
            {VENUE.phoneDisplay}
          </a>
        </Button>
      </div>

      {/* Today's availability, as the reason to keep reading. */}
      <Card variant="accent" accentColor="bg-success" className="mt-space-md">
        <p className="font-label-sm text-label-sm text-muted-foreground">{thaiDateLong(date)}</p>
        {freeCount === null ? (
          <Skeleton className="mt-1 h-7 w-40" />
        ) : (
          <>
            <p className="font-headline-sm text-headline-sm text-primary">
              วันนี้ว่างอีก {freeCount} ช่วงเวลา
            </p>
            <p className="font-body-md text-body-md text-muted-foreground">
              {eveningFree
                ? `ช่วงค่ำ 19:00 – 22:00 ยังเหลือ ${eveningFree} คอร์ท`
                : 'ช่วงค่ำเต็มแล้ว ลองดูช่วงบ่ายได้ครับ'}
            </p>
          </>
        )}
      </Card>

      <div className="mt-space-md">
        <RateCard rules={RATE_RULES} />
      </div>

      <div className="mt-space-md">
        <p className="mb-space-xs font-label-lg text-label-lg text-primary">สิ่งอำนวยความสะดวก</p>
        <AmenityGrid items={VENUE.amenities} />
      </div>

      {/* Sticky, because this is the only thing the screen wants the user to do. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-nav-safe z-drawer px-gutter-mobile">
        <div className="pointer-events-auto mx-auto w-full max-w-liff">
          <Button size="lg" fullWidth asChild className="shadow-sheet">
            <Link to="/book">
              จองคอร์ทเลย
              <Icon name="arrow_forward" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
