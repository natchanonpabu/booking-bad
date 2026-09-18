import { useCallback, useRef, useState } from 'react';

/**
 * One-dimensional roving tabindex. Hand-written on purpose: Radix's roving focus
 * filters items by `focusable: !disabled`, which drops disabled entries out of the
 * arrow-key order — exactly the defect this project rejects for booked slots and past
 * dates (Plan 01 §4.5). Here every item stays reachable; only activation is blocked.
 */
export function useRovingFocus(count: number, initial = 0) {
  const [active, setActive] = useState(initial);
  const items = useRef<Array<HTMLElement | null>>([]);

  const register = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      items.current[index] = el;
    },
    [],
  );

  const focus = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(count - 1, index));
    setActive(clamped);
    items.current[clamped]?.focus();
  }, [count]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const keys: Record<string, number> = {
        ArrowRight: index + 1,
        ArrowDown: index + 1,
        ArrowLeft: index - 1,
        ArrowUp: index - 1,
        Home: 0,
        End: count - 1,
      };
      const next = keys[event.key];
      if (next === undefined) return;
      event.preventDefault();
      focus(next);
    },
    [count, focus],
  );

  /** Spread onto each item: only the active one is in the tab order. */
  const itemProps = (index: number) => ({
    ref: register(index),
    tabIndex: index === active ? 0 : -1,
    onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, index),
    onFocus: () => setActive(index),
  });

  return { active, setActive: focus, itemProps };
}
