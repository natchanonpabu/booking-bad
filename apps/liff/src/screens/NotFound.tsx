import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      mascot="idle"
      headline="ไม่พบหน้านี้"
      body="ลิงก์อาจพิมพ์ผิดหรือถูกย้ายไปแล้ว"
      primaryAction={
        <Button fullWidth asChild>
          <Link to="/book">ไปหน้าจองคอร์ท</Link>
        </Button>
      }
    />
  );
}
