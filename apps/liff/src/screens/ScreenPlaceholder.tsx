import { Link } from 'react-router-dom';
import { Icon, type IconName } from '@/components/ui/Icon';

interface ScreenPlaceholderProps {
  title: string;
  icon: IconName;
  /** Which Plan 01 day builds this screen (§10). */
  day: string;
  /** Source mockup folder(s) under documents/stitch/. */
  mockup: string;
}

/** Day 1–2 scaffold only: proves routing, shell, tokens, fonts and icons. Each screen
    replaces this with its real build on the day named. */
export function ScreenPlaceholder({ title, icon, day, mockup }: ScreenPlaceholderProps) {
  return (
    <section aria-labelledby="screen-title" className="py-space-lg">
      <h1 id="screen-title" className="font-headline-md text-headline-md text-primary">
        {title}
      </h1>
      <div className="mt-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-card">
        <div className="flex items-start gap-space-sm">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-container text-on-primary">
            <Icon name={icon} />
          </span>
          <div>
            <p className="font-label-lg text-label-lg text-on-surface">หน้านี้ยังไม่ได้สร้าง</p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              จะสร้างใน Plan 01 วันที่ {day} · อ้างอิง mockup <code>{mockup}</code>
            </p>
          </div>
        </div>
      </div>
      <Link
        to="/book"
        className="mt-space-md inline-flex min-h-touch items-center gap-space-xs rounded-xl bg-primary px-space-md font-label-lg text-label-lg text-on-primary active:scale-98"
      >
        ไปหน้าจองคอร์ท
        <Icon name="arrow_forward" size={20} />
      </Link>
    </section>
  );
}
