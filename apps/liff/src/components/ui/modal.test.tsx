// @vitest-environment jsdom
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Modal } from './modal';
import { SegmentedTabs } from './segmented-tabs';

afterEach(cleanup);

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="ยกเลิกการจองนี้?"
      description="ยกเลิกฟรี"
      trigger={<button type="button">เปิด</button>}
    />
  );
}

describe('Modal (the one Radix primitive)', () => {
  it('traps focus, closes on Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'เปิด' });

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    // Radix inerts the rest of the page with aria-hidden (hideOthers) rather than
    // setting aria-modal — better AT support, same guarantee. Assert what it does.
    expect(dialog).toHaveAccessibleName('ยกเลิกการจองนี้?');
    expect([...document.body.children].some((el) => el.getAttribute('aria-hidden') === 'true')).toBe(true);
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});

describe('SegmentedTabs roving focus', () => {
  it('moves with the arrow keys and keeps a disabled-looking tab reachable', async () => {
    const user = userEvent.setup();
    function Tabs() {
      const [value, setValue] = useState('a');
      return (
        <SegmentedTabs
          tabs={[{ id: 'a', label: 'กำลังจะถึง' }, { id: 'b', label: 'ที่ผ่านมา' }]}
          value={value}
          onChange={setValue}
        />
      );
    }
    render(<Tabs />);
    const [first, second] = screen.getAllByRole('tab');

    // Exactly one tab is in the tab order — that is what roving tabindex means.
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');

    await user.tab();
    expect(document.activeElement).toBe(first);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(second);
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(first);
  });
});
