import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('.', import.meta.url));

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });

const FEATURES = readdirSync(ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

/** The one rule that makes a feature folder worth the nesting: a feature is a leaf.
    Anything two features both need moves up to data/, lib/ or components/ — it does not
    get reached for sideways. Without this the folders are decoration and the import
    graph is still a ball of yarn. */
describe('features are independent', () => {
  it('has the features this app is sliced into', () => {
    expect(FEATURES).toEqual(['booking', 'venue']);
  });

  it.each(FEATURES)('%s does not import another feature', (self) => {
    const offenders = walk(join(ROOT, self)).flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/from '@\/features\/([^/']+)/g)]
        .filter((m) => m[1] !== self)
        .map((m) => `${relative(ROOT, file)} → features/${m[1]}`),
    );
    expect(offenders).toEqual([]);
  });

  it('keeps each feature reachable only through app/ or its own tree', () => {
    // data/, lib/, components/ and layouts/ are shared by both features, so none of them
    // may depend on one — that is what "shared" has to mean for it to stay shared.
    const shared = ['data', 'lib', 'components', 'layouts'].flatMap((d) =>
      walk(join(ROOT, '..', d)),
    );
    const offenders = shared.filter((f) => /from '@\/features\//.test(readFileSync(f, 'utf8')));
    expect(offenders.map((f) => relative(join(ROOT, '..'), f))).toEqual([]);
  });
});

/** Per-page colocation only means something if a page's components/ is private to it.
    The moment a second page imports one, the file belongs to the feature, not the page,
    and has to move up to features/<f>/components — the way price-breakdown did once
    review and success both wanted it. */
describe('a page owns its components', () => {
  const pageDirs = FEATURES.flatMap((f) => {
    const routes = join(ROOT, f, 'pages');
    return readdirSync(routes, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => join(routes, e.name));
  });

  it('has the pages this app is sliced into', () => {
    expect(pageDirs.map((d) => relative(ROOT, d)).sort()).toEqual([
      'booking/pages/booking-grid',
      'booking/pages/booking-review',
      'booking/pages/booking-success',
      'booking/pages/my-bookings',
      'venue/pages/court-profile',
    ]);
  });

  it.each(pageDirs.map((d) => [relative(ROOT, d), d] as const))(
    '%s keeps its own components to itself',
    (_label, pageDir) => {
      const owned = walk(pageDir).filter((f) => f.includes(`${sep}components${sep}`));
      const outsiders = FEATURES.flatMap((f) => walk(join(ROOT, f)))
        .concat(walk(join(ROOT, '..', 'app')))
        .filter((f) => !f.startsWith(pageDir + sep));
      const offenders = outsiders.flatMap((f) => {
        const body = readFileSync(f, 'utf8');
        return owned
          .filter((o) => body.includes(basename(o).replace(/\.tsx?$/, '')))
          .filter((o) => new RegExp(`from '[^']*/${basename(o).replace(/\.tsx?$/, '')}'`).test(body))
          .map((o) => `${relative(ROOT, f)} → ${relative(pageDir, o)}`);
      });
      expect(offenders).toEqual([]);
    },
  );
});

/** app/pages holds the screens no feature owns — a 404, the /__catalog sheet. They are
    pages, so they are shaped like pages: a folder whose page is index.tsx. Getting this
    wrong once is what prompted the rule; `pages` is the word everywhere, and `routes.tsx`
    is the table, which is also why the folder cannot be called routes/. */
describe('every page in the app has the same shape', () => {
  const pageDirs = [
    ...FEATURES.flatMap((f) =>
      readdirSync(join(ROOT, f, 'pages'), { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => join(ROOT, f, 'pages', e.name)),
    ),
    ...readdirSync(join(ROOT, '..', 'app', 'pages'), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => join(ROOT, '..', 'app', 'pages', e.name)),
  ];

  it('finds a page folder for every route in the table', () => {
    expect(pageDirs).toHaveLength(7);
  });

  it.each(pageDirs.map((d) => [relative(join(ROOT, '..'), d), d] as const))(
    '%s is a folder whose page is index.tsx',
    (_label, dir) => {
      const top = readdirSync(dir).filter((f) => /\.tsx$/.test(f) && !f.endsWith('.test.tsx'));
      expect(top).toEqual(['index.tsx']);
    },
  );

  it('leaves no page as a bare file beside the folders', () => {
    const strays = [
      ...FEATURES.map((f) => join(ROOT, f, 'pages')),
      join(ROOT, '..', 'app', 'pages'),
    ].flatMap((d) =>
      readdirSync(d, { withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => relative(join(ROOT, '..'), join(d, e.name))),
    );
    expect(strays).toEqual([]);
  });
});
