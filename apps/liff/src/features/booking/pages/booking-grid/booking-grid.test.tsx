// @vitest-environment jsdom
import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import BookingGrid from './';
import { BookingFlowProvider } from '@/app/providers/booking-flow-provider';
import { ToastProvider } from '@/components/ui/toast';
import { api } from '@/data/api';
import { resetDb } from '@/data/db';
import { defaultDemoDate } from '@/lib/clock';

afterEach(() => { cleanup(); resetDb(); localStorage.clear(); vi.restoreAllMocks(); });

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

  it('retry after a failed load actually refetches', async () => {
    const user = userEvent.setup();
    const real = api.getAvailability;
    const spy = vi.spyOn(api, 'getAvailability').mockRejectedValueOnce(new Error('offline'));
    renderGrid();
    await user.click(await screen.findByRole('button', { name: 'ลองอีกครั้ง' }));
    await screen.findByRole('grid', {}, { timeout: 3000 });
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
    expect(api.getAvailability).toBe(real);
  });

  it('Back from review restores the draft: same day, same hours, CTA enabled', async () => {
    localStorage.setItem('wc.flow.v1', JSON.stringify({
      draft: { kind: 'range', date: defaultDemoDate(), courtIds: ['c3'], startHour: 19, endHour: 21 },
    }));
    renderGrid();
    await screen.findByRole('grid', {}, { timeout: 3000 });
    expect(await screen.findByText('19:00 - 21:00 น.')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /จองทันที/ })).toBeEnabled());
  });

  describe('keyboard', () => {
    it('Shift+↓ extends one hour at a time and Shift+↑ shrinks from the bottom', async () => {
      const user = userEvent.setup();
      renderGrid();
      await screen.findByRole('grid', {}, { timeout: 3000 });
      cell('3', 19).focus();
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      await waitFor(() => expect(screen.getByText(/คอร์ท 3 · 1 ชั่วโมง/)).toBeInTheDocument());
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      await waitFor(() => expect(screen.getByText(/คอร์ท 3 · 2 ชั่วโมง/)).toBeInTheDocument());
      expect(cell('3', 20)).toHaveFocus();
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
      await waitFor(() => expect(screen.getByText(/คอร์ท 3 · 1 ชั่วโมง/)).toBeInTheDocument());
    });

    it('Escape clears the selection', async () => {
      const user = userEvent.setup();
      renderGrid();
      await screen.findByRole('grid', {}, { timeout: 3000 });
      await user.click(cell('3', 19));
      await waitFor(() => expect(screen.getByText(/คอร์ท 3 · 1 ชั่วโมง/)).toBeInTheDocument());
      await user.keyboard('{Escape}');
      expect(await screen.findByText('ยังไม่ได้เลือกคอร์ท')).toBeInTheDocument();
    });

    it('Ctrl+Home and Ctrl+End jump to the first and last cell of the grid', async () => {
      const user = userEvent.setup();
      renderGrid();
      await screen.findByRole('grid', {}, { timeout: 3000 });
      cell('3', 14).focus();
      await user.keyboard('{Control>}{End}{/Control}');
      expect(cell('6', 21)).toHaveFocus();
      await user.keyboard('{Control>}{Home}{/Control}');
      expect(cell('1', 9)).toHaveFocus();
    });
  });
});
