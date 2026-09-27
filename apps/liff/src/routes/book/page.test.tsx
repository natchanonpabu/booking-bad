// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import BookingGrid from './page';
import { BookingFlowProvider } from '@/app/providers/booking-flow-provider';
import { ToastProvider } from '@/components/ui/toast';
import { resetDb } from '@/data/db';

afterEach(() => { cleanup(); resetDb(); localStorage.clear(); });

const renderGrid = () =>
  render(
    <MemoryRouter>
      <ToastProvider>
        <BookingFlowProvider><BookingGrid /></BookingFlowProvider>
      </ToastProvider>
    </MemoryRouter>,
  );

const cell = (court: string, hour: number) =>
  screen.getByRole('gridcell', { name: new RegExp(`^คอร์ท ${court} เวลา ${String(hour).padStart(2, '0')}:00`) });

describe('/book — the screen the whole demo rests on', () => {
  it('draws 6 courts × 13 hours once availability arrives', async () => {
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    await waitFor(() => expect(screen.getAllByRole('gridcell').length).toBe(78));
    expect(screen.getAllByRole('columnheader')).toHaveLength(6);
  });

  it('selecting 19:00 then 20:00 on court 3 shows ฿440 and enables the CTA', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });

    expect(screen.getByRole('button', { name: /จองทันที/ })).toBeDisabled();

    await user.click(cell('3', 19));
    await user.click(cell('3', 20));

    // The drawer is the only place a total is rendered.
    await waitFor(() => expect(screen.getByText('฿440')).toBeInTheDocument(), { timeout: 3000 });
    expect(screen.getByText(/คอร์ท 3 · 2 ชั่วโมง/)).toBeInTheDocument();
    expect(screen.getByText('19:00 - 21:00 น.')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /จองทันที/ })).toBeEnabled());
  });

  it('refuses a booked hour out loud, and changes nothing', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });

    // Court 3 at 09:00 is booked in the canonical fixture.
    const booked = cell('3', 9);
    expect(booked).toHaveAttribute('aria-disabled', 'true');
    await user.click(booked);

    expect(await screen.findByText('ช่วงเวลานี้ถูกจองแล้ว')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /จองทันที/ })).toBeDisabled();
  });

  it('a blocked hour is still reachable with the keyboard — it just says why', async () => {
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    const booked = cell('3', 9);
    // Never `disabled`: that would drop it out of the tab and arrow order entirely.
    expect(booked).not.toHaveAttribute('disabled');
    expect(booked.getAttribute('aria-label')).toMatch(/ถูกจองแล้ว/);
  });

  it('shows every selected hour as selected, with its price — not one tick and a blank', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    await user.click(cell('3', 19));
    await user.click(cell('3', 20));

    const selected = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(2);
    // The second cell rendered empty before this test existed, which read as a broken
    // cell rather than a two-hour booking.
    for (const c of selected) expect(c.textContent).toMatch(/฿\d/);
  });

  it('clearing empties the drawer', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    await user.click(cell('3', 19));
    await waitFor(() => expect(screen.getByText(/คอร์ท 3 · 1 ชั่วโมง/)).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'ล้าง' }));
    expect(await screen.findByText('ยังไม่ได้เลือกคอร์ท')).toBeInTheDocument();
  });

  it('shows the sleeping capybara on a fully booked day', async () => {
    const user = userEvent.setup();
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    // Found by its label, not by index: the seeded sold-out day is three days after
    // the demo's opening date, which is tomorrow once it is past 18:00.
    const soldOutPill = screen.getAllByRole('radio').find((pill) => within(pill).queryByText('เต็ม'));
    expect(soldOutPill).toBeDefined();
    await user.click(soldOutPill!);
    expect(
      await screen.findByText('วันนี้คอร์ทเต็มทุกช่วงเวลาแล้วครับ', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });
});
