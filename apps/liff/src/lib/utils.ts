import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * shadcn's `cn`, taught about this design system.
 *
 * Why the config is not optional: our type scale uses `text-label-lg`, `text-body-md`
 * and friends, and our colours use `text-on-primary`, `text-on-surface-variant`. Stock
 * tailwind-merge knows neither, guesses that both are the same kind of class, and drops
 * the earlier one — which is how every primary button rendered navy text on a navy fill
 * the first time these components were wired up. Failure was silent: no error, no test,
 * just invisible labels.
 *
 * `tailwind-merge` stays on the v2 line; v3 targets Tailwind 4 (see scripts/gate.mjs).
 */
const FONT_SIZES = [
  'display-lg', 'display-lg-mobile',
  'headline-lg', 'headline-md', 'headline-sm',
  'body-lg', 'body-md', 'body-sm',
  'label-lg', 'label-md', 'label-sm',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZES] }],
      'font-family': [{ font: [...FONT_SIZES] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
