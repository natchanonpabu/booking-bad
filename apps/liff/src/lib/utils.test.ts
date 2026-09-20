import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn()', () => {
  it('keeps a text colour and a text size together — they are different class groups', () => {
    // The regression this file exists for: stock tailwind-merge drops `text-on-primary`
    // when `text-label-lg` follows it, and the button renders navy on navy.
    expect(cn('bg-primary text-on-primary', 'text-label-lg')).toContain('text-on-primary');
    expect(cn('bg-primary text-on-primary', 'text-label-lg')).toContain('text-label-lg');
  });

  it('still lets a later colour win over an earlier one', () => {
    expect(cn('text-on-primary', 'text-error')).toBe('text-error');
  });

  it('still lets a later size win over an earlier one', () => {
    expect(cn('text-body-md', 'text-headline-sm')).toBe('text-headline-sm');
  });

  it('merges conflicting backgrounds, which is the reason to use it at all', () => {
    expect(cn('bg-primary', 'bg-error')).toBe('bg-error');
  });
});
