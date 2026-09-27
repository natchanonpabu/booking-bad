import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/app/routes';

const ROOT = fileURLToPath(new URL('.', import.meta.url));

/** react-router matches the table in app/router.tsx; the folders under src/routes are
    only a convention. These tests are what makes the convention hold — move a page
    without touching the table, or add a path without its folder, and one of them fails.

    The mapping, in both directions:
      null              → home/            (the index route)
      '*'               → not-found/        (the catch-all)
      'book/success/:ref' → book/success/[ref]/   (':param' as '[param]', like Next) */
const folderFor = (path: string | null): string => {
  if (path === null) return 'home';
  if (path === '*') return 'not-found';
  return path.split('/').map((s) => (s.startsWith(':') ? `[${s.slice(1)}]` : s)).join('/');
};

/** Every directory under src/routes that holds a page.tsx. */
const pageFolders = (dir = ROOT): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory()) return [];
    const sub = join(dir, e.name);
    return [
      ...(existsSync(join(sub, 'page.tsx')) ? [relative(ROOT, sub)] : []),
      ...pageFolders(sub),
    ];
  });

describe('src/routes mirrors the route table', () => {
  it('gives every declared route a folder with a page.tsx', () => {
    const missing = ROUTES
      .map((r) => folderFor(r.path))
      .filter((f) => !existsSync(join(ROOT, f, 'page.tsx')))
      .map((f) => `src/routes/${f}/page.tsx`);
    expect(missing).toEqual([]);
  });

  it('leaves no page.tsx that no route points at', () => {
    const declared = ROUTES.map((r) => folderFor(r.path));
    const orphans = pageFolders().filter((f) => !declared.includes(f));
    expect(orphans).toEqual([]);
  });

  it('declares each path once', () => {
    const paths = ROUTES.map((r) => String(r.path));
    expect(new Set(paths).size).toBe(paths.length);
  });
});
