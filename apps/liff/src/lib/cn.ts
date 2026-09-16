/** Joins class names, skipping falsy values. Deliberately not tailwind-merge (Plan 01 §4.5). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
