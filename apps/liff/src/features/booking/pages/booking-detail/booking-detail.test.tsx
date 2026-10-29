// @vitest-environment jsdom
import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderAt } from '@/testing/render-app';
import { resetDb } from '@/data/db';
import { SEED_BOOKINGS } from '@/data/fixtures';

afterEach(() => { cleanup(); resetDb(); localStorage.clear(); });

const unpaid = SEED_BOOKINGS.find((b) => b.paymentStatus === 'unpaid')!;
const paid = SEED_BOOKINGS.find((b) => b.status === 'confirmed')!;
const done = SEED_BOOKINGS.find((b) => b.status === 'completed')!;

describe('booking detail', () => {
  it('shows an unpaid counter booking with what to do next', async () => {
    renderAt(`/bookings/${unpaid.ref}`);
    expect(await screen.findByRole('heading', { name: 'รายละเอียดการจอง' })).toBeInTheDocument();
    expect(screen.getAllByText('รอชำระที่หน้าร้าน').length).toBeGreaterThan(0);
    expect(screen.getByText(unpaid.ref)).toBeInTheDocument();
    expect(screen.getByText(/ยังไม่ได้ชำระเงิน ยกเลิกได้โดยไม่มีค่าใช้จ่าย/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /โทรหาสนาม/ })).toHaveAttribute('href', expect.stringMatching(/^tel:/));
  });

  it('says "not found" for a ref that does not exist, with a way back', async () => {
    renderAt('/bookings/WC-0000-9999');
    expect(await screen.findByText('ไม่พบการจองนี้')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'กลับไปการจองของฉัน' })).toHaveAttribute('href', '/bookings');
  });

  it('a finished booking has no cancel button', async () => {
    renderAt(`/bookings/${done.ref}`);
    await screen.findByRole('heading', { name: 'รายละเอียดการจอง' });
    expect(screen.queryByRole('button', { name: 'ยกเลิกการจอง' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'จองคอร์ทอีกครั้ง' })).toBeInTheDocument();
  });

  it('cancelling a paid booking more than 24 hours ahead previews, then records, the credit', async () => {
    const user = userEvent.setup();
    renderAt(`/bookings/${paid.ref}`);
    await screen.findByRole('heading', { name: 'รายละเอียดการจอง' });

    await user.click(screen.getByRole('button', { name: 'ยกเลิกการจอง' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/รับเครดิต ฿440/)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'ยืนยันยกเลิก' }));
    await waitFor(() => expect(screen.getAllByText('ยกเลิกแล้ว').length).toBeGreaterThan(0), { timeout: 3000 });
    // Said twice on purpose: in the toast and in the policy card.
    expect(screen.getAllByText(/ได้เครดิต ฿440/).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'ยกเลิกการจอง' })).not.toBeInTheDocument();
  });

  it('keeps the booking when the customer backs out of the modal', async () => {
    const user = userEvent.setup();
    renderAt(`/bookings/${unpaid.ref}`);
    await screen.findByRole('heading', { name: 'รายละเอียดการจอง' });
    await user.click(screen.getByRole('button', { name: 'ยกเลิกการจอง' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'ไม่ยกเลิก' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getAllByText('รอชำระที่หน้าร้าน').length).toBeGreaterThan(0);
  });

  it('is reachable from the card in My Bookings', async () => {
    const user = userEvent.setup();
    renderAt('/bookings');
    await screen.findByText(unpaid.ref, {}, { timeout: 3000 });
    await user.click(screen.getByRole('link', { name: `ดูรายละเอียดการจอง ${unpaid.ref}` }));
    expect(await screen.findByRole('heading', { name: 'รายละเอียดการจอง' })).toBeInTheDocument();
  });
});
