import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('..', import.meta.url));
const README = join(SRC, '..', 'README.md');

const dirs = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => [join(dir, e.name), ...dirs(join(dir, e.name))]);

/** Real directories, as 'src/a/b/' — sorted the way a reader walks the tree. */
const actual = ['src/', ...dirs(SRC).map((d) => `src/${relative(SRC, d)}/`)].sort();

/** The paths the README's tree block claims, rebuilt from its indentation. Anything after
    two or more spaces on a line is an annotation and is ignored, so the prose stays free. */
function documented(): string[] {
  const block = readFileSync(README, 'utf8').match(
    /<!-- tree:start -->\n```\n([\s\S]*?)```\n<!-- tree:end -->/,
  );
  if (!block?.[1]) throw new Error('README.md has no <!-- tree:start --> block');
  const stack: string[] = [];
  return block[1]
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const depth = (line.match(/^ */)?.[0].length ?? 0) / 2;
      const name = line.trim().split(/\s{2,}/)[0]!;
      stack.length = depth;
      stack.push(name);
      return stack.join('');
    })
    .sort();
}

describe('README.md documents the real tree', () => {
  it('lists every directory under src, and no others', () => {
    // A mismatch prints both sides; the block to paste is in the received value.
    expect(documented()).toEqual(actual);
  });

  it('only ever claims directories', () => {
    expect(documented().filter((p) => !p.endsWith('/'))).toEqual([]);
  });
});
