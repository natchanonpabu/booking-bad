import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon, ICON_NAMES } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import { Sheet } from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { quote } from '@/data/rates';
import { D } from '@/data/fixtures';
import { thb, payAmount } from '@/lib/money';

/** Scratch route (Plan 01 §7): every primitive in every state, on one page, so a
    device pass can check them all at once. Not linked from the app. */
export default function Catalog() {
  const [tab, setTab] = useState('a');
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const toast = useToast();
  const q = quote(D.canonical, 19 * 60, 21 * 60);

  return (
    <div className="space-y-space-lg py-space-lg">
      <h1 className="font-headline-md text-headline-md text-primary">Component catalog</h1>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Button</h2>
        <div className="flex flex-wrap gap-space-xs">
          <Button>จองทันที</Button>
          <Button variant="tonal">ดูรายละเอียด</Button>
          <Button variant="ghost">ยกเลิก</Button>
          <Button variant="line" leadingIcon="send">แชร์เข้า LINE</Button>
          <Button variant="danger">ยกเลิกการจอง</Button>
          <Button loading>กำลังบันทึก</Button>
          <Button disabled>ปิดใช้งาน</Button>
          <Button size="lg" fullWidth trailingIcon="arrow_forward">ไปต่อ</Button>
        </div>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Badge</h2>
        <div className="flex flex-wrap gap-space-xs">
          <Badge tone="success" dot>ยืนยันแล้ว</Badge>
          <Badge tone="peak" icon="bolt">ช่วงพีค</Badge>
          <Badge tone="error" dot pulse>รอชำระเงิน</Badge>
          <Badge tone="neutral">ที่ผ่านมา</Badge>
          <Badge tone="info" icon="info">ข้อมูลสาธิต</Badge>
          <Badge tone="line" icon="chat">LINE</Badge>
        </div>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Card · ราคา</h2>
        <Card variant="accent" accentColor="bg-success">
          <p className="font-label-lg text-label-lg">คอร์ท 3 · 19:00–21:00</p>
          {q.lines.map((line) => (
            <p key={line.rateRuleId} className="flex justify-between font-body-md text-body-md text-on-surface-variant">
              <span>{line.label}</span>
              <span className="price">{line.tag ?? thb(line.amount)}</span>
            </p>
          ))}
          <p className="mt-space-xs flex justify-between font-headline-sm text-headline-sm text-primary">
            <span>รวม</span><span className="total">{thb(q.total)}</span>
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">ยอดโอน {payAmount(q.total)}</p>
        </Card>
        <div className="grid grid-cols-3 gap-space-xs">
          <Card variant="base"><p className="font-body-sm text-body-sm">base</p></Card>
          <Card variant="raised"><p className="font-body-sm text-body-sm">raised</p></Card>
          <Card variant="inset"><p className="font-body-sm text-body-sm">inset</p></Card>
        </div>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Tabs · Spinner · Copy · Toast</h2>
        <SegmentedTabs
          tabs={[{ id: 'a', label: 'กำลังจะถึง', count: 2 }, { id: 'b', label: 'ที่ผ่านมา', count: 5 }]}
          value={tab}
          onChange={setTab}
        />
        <div className="flex flex-wrap items-center gap-space-md">
          <Spinner label="กำลังโหลด" />
          <CopyButton text="WC-2609-0042" label="คัดลอกรหัสจอง" />
          <Button variant="tonal" onClick={() => toast.show('บันทึกแล้ว', { tone: 'success' })}>Toast polite</Button>
          <Button variant="tonal" onClick={() => toast.show('เลือกได้เฉพาะชั่วโมงติดกัน', { tone: 'error', assertive: true })}>
            Toast assertive
          </Button>
        </div>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Modal (Radix) · Sheet (non-modal)</h2>
        <div className="flex gap-space-xs">
          <Button variant="tonal" onClick={() => setSheet((s) => !s)}>สลับ Sheet</Button>
        </div>
        <Modal
          open={modal}
          onOpenChange={setModal}
          trigger={<Button variant="tonal">เปิด Modal</Button>}
          title="ยกเลิกการจองนี้?"
          description="ยกเลิกฟรีถ้าเหลือเวลามากกว่า 3 ชั่วโมงก่อนเริ่มเล่น"
          actions={<>
            <Button variant="ghost" fullWidth onClick={() => setModal(false)}>ไม่ยกเลิก</Button>
            <Button variant="danger" fullWidth onClick={() => setModal(false)}>ยืนยันยกเลิก</Button>
          </>}
        />
        <Sheet open={sheet}>
          <p className="font-label-lg text-label-lg text-primary">คอร์ท 3 · 2 ชั่วโมง</p>
          <p className="total font-headline-md text-headline-md text-primary">{thb(q.total)}</p>
          <Button fullWidth className="mt-space-sm" trailingIcon="arrow_forward">ไปต่อที่ชำระเงิน</Button>
        </Sheet>
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">EmptyState</h2>
        <EmptyState
          mascot="sleep"
          badge={<Badge tone="error" dot>เต็มทุกช่วงเวลา</Badge>}
          headline="วันนี้คอร์ทเต็มแล้วครับ"
          body="ลองดูวันพรุ่งนี้ไหมครับ ยังมีช่วงค่ำว่างอยู่"
          primaryAction={<Button fullWidth>ดูวันถัดไป</Button>}
        />
      </section>

      <section className="space-y-space-sm">
        <h2 className="font-label-lg text-label-lg text-on-surface-variant">Icon · {ICON_NAMES.length} glyphs</h2>
        <div className="flex flex-wrap gap-space-sm text-primary">
          {ICON_NAMES.map((name) => <Icon key={name} name={name} />)}
        </div>
      </section>
    </div>
  );
}
