import { describe, expect, it } from 'vitest';
import { ICON_NAMES, hasFilled } from './icon';

describe('Icon registry', () => {
  it('registers all 69 glyphs used by the nine booking mockups (Plan 01 §4.5)', () => {
    expect(ICON_NAMES).toHaveLength(69);
  });

  it('has filled variants exactly where the UI needs them', () => {
    expect(ICON_NAMES.filter(hasFilled).sort()).toEqual(
      ['check_circle', 'event_available', 'sports_tennis', 'star'],
    );
  });
});
