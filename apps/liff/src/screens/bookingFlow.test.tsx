// @vitest-environment jsdom
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import BookingGrid from './BookingGrid';
import BookingReview from './BookingReview';
import BookingSuccess from './BookingSuccess';
import MyBookings from './MyBookings';
import { BookingFlowProvider } from '@/app/providers/BookingFlowProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { resetDb } from '@/data/db';

afterEach(() => { cleanup(); resetDb(); localStorage.clear(); });

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={['/book']}>
      <ToastProvider>
        <BookingFlowProvider>
          <Routes>
            <Route path="/book" element={<BookingGrid />} />
            <Route path="/book/review" element={<BookingReview />} />
            <Route path="/book/success/:ref" element={<BookingSuccess />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </BookingFlowProvider>
      </ToastProvider>
    </MemoryRouter>,
  );

const cell = (court: string, hour: number) =>
  screen.getByRole('gridcell', { name: new RegExp(`^คอร์ท ${court} เวลา ${String(hour).padStart(2, '0')}:00`) });

describe('the whole booking flow, as a venue owner would click it', () => {
  it('grid → review → success → my bookings', async () => {
    const user = userEvent.setup();
    renderApp();

    // 1. Pick two peak hours on court 3.
    await screen.findByRole('grid', {}, { timeout: 3000 });
    await user.click(cell('3', 19));
    await user.click(cell('3', 20));
    await waitFor(() => expect(screen.getByText('฿440')).toBeInTheDocument(), { timeout: 3000 });

    // 2. Continue to the review screen.
    await user.click(screen.getByRole('button', { name: /จองทันที/ }));
    expect(await screen.findByText('ยืนยันข้อมูลการจอง')).toBeInTheDocument();
    expect(screen.getByText('19:00 - 21:00 น. (2 ชั่วโมง)')).toBeInTheDocument();
    expect(screen.getByText('ยอดรวม')).toBeInTheDocument();

    // 3. The phone number is required, and says so before it blocks anything.
    await user.click(screen.getByRole('button', { name: /ยืนยันการจอง/ }));
    expect(await screen.findByText('กรุณากรอกเบอร์โทรให้ครบ 9–10 หลัก')).toBeInTheDocument();

    await user.type(screen.getByLabelText('เบอร์โทรติดต่อ'), '0891112345');
    await user.click(screen.getByRole('button', { name: /ยืนยันการจอง/ }));

    // 4. The ticket, with a reference in the agreed format.
    expect(await screen.findByText('จองคอร์ทสำเร็จแล้วครับ', {}, { timeout: 4000 })).toBeInTheDocument();
    const ref = screen.getByText(/^WC-\d{4}-\d{4}$/);
    expect(ref).toBeInTheDocument();
    expect(screen.getByText('รอชำระที่หน้าร้าน')).toBeInTheDocument();

    // 5. And it is in My Bookings.
    await user.click(screen.getByRole('link', { name: 'ดูการจองของฉัน' }));
    expect(await screen.findByText('การจองของฉัน')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(ref.textContent!)).toBeInTheDocument(), { timeout: 3000 });
  });

  it('the slot it just booked is no longer free on the grid', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    await user.click(cell('3', 19));
    // The CTA stays disabled until the quote lands (§8.5). Waiting on the price text
    // would match every ฿220 cell in the grid, so wait on the button itself.
    await waitFor(
      () => expect(screen.getByRole('button', { name: /จองทันที/ })).toBeEnabled(),
      { timeout: 3000 },
    );
    await user.click(screen.getByRole('button', { name: /จองทันที/ }));
    await screen.findByText('ยืนยันข้อมูลการจอง');
    await user.type(screen.getByLabelText('เบอร์โทรติดต่อ'), '0891112345');
    await user.click(screen.getByRole('button', { name: /ยืนยันการจอง/ }));
    await screen.findByText('จองคอร์ทสำเร็จแล้วครับ', {}, { timeout: 4000 });

    await user.click(screen.getByRole('link', { name: 'จองคอร์ทอีกครั้ง' }));
    await screen.findByRole('grid', {}, { timeout: 3000 });
    expect(cell('3', 19)).toHaveAttribute('aria-disabled', 'true');
  });
});
