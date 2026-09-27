import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/app/routes';

const ROOT = fileURLToPath(new URL('.', import.meta.url));

/** react-router matches the table in app/routes.tsx; the folders under src/routes are
    only a convention. These tests are what makes the convention hold — move a page
    without touching the table, or add a path without its folder, and one of them fails.

    The mapping, in both directions:
      null                → home/
      '*'                 → not-found/
      'book/success/:ref' → book/success/$ref/    (':param' as '$param') */
const folderFor = (path: string | null): string => {
  if (path === null) return 'home';
  if (path === '*') return 'not-found';
  return path.split('/').map((s) => (s.startsWith(':') ? `$${s.slice(1)}` : s)).join('/');
};

/** A route folder's page is its index.tsx, so an import reads as the URL —
    '@/routes/book/review'. Nothing here asserts that name: the table imports the folder,
    so a page not called index.tsx fails to resolve and takes the build with it, which is
    a louder failure than a test. What this collects instead is *every* non-test .tsx
    directly in the folder, so a second one fails here rather than quietly sitting at
    route level where a component does not belong. */
const pagesIn = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
    : [];

/** Every folder under src/routes that holds a page, components/ subtrees aside. */
const pageFolders = (dir = ROOT): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (!e.isDirectory() || e.name === 'components') return [];
    const sub = join(dir, e.name);
    return [...(pagesIn(sub).length ? [relative(ROOT, sub)] : []), ...pageFolders(sub)];
  });

describe('src/routes mirrors the route table', () => {
  it('gives every declared route a folder holding exactly one page', () => {
    const wrong = ROUTES.map((r) => {
      const folder = folderFor(r.path);
      const found = pagesIn(join(ROOT, folder));
      if (!existsSync(join(ROOT, folder))) return `${folder}/ — ไม่มีโฟลเดอร์`;
      if (found.length !== 1) return `${folder}/ — เจอ page ${found.length} ไฟล์: ${found.join(', ')}`;
      return null;
    }).filter(Boolean);
    expect(wrong).toEqual([]);
  });

  it('leaves no page that no route points at', () => {
    const declared = ROUTES.map((r) => folderFor(r.path));
    expect(pageFolders().filter((f) => !declared.includes(f))).toEqual([]);
  });

  it('declares each path once', () => {
    const paths = ROUTES.map((r) => String(r.path));
    expect(new Set(paths).size).toBe(paths.length);
  });
});

