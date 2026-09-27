import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
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

