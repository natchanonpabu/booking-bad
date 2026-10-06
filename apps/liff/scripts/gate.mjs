#!/usr/bin/env node
// Plan 01 §11.2 + §11.3 — defect gates. Each line targets a defect class that exists in
// the Stitch mockups and gets re-imported by porting their markup. Runs in ~1s; exits
// non-zero on any hit. Pure Node, no grep, so it behaves the same on every machine.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const src = walk(join(root, 'src'));
const read = (p) => readFileSync(p, 'utf8');

const gates = [
  { id: 'data-alt', why: 'not an attribute — gives images no accessible name',
    files: src, test: (l) => l.includes('data-' + 'alt') },
  { id: 'zoom-lock', why: 'maximum-scale / user-scalable blocks pinch-zoom (WCAG 1.4.4)',
    files: [...src, join(root, 'index.html')], test: (l) => /user-scalable|maximum-scale/.test(l) },
  { id: 'py-0.2', why: 'not a Tailwind step — always a typo for py-0.5',
    files: src, test: (l) => /\bpy-0\.2\b/.test(l) },
  { id: 'chord-typo', why: '“book a musical chord” — must be จองคอร์ท',
    files: src, test: (l) => l.includes('จองคอร์' + 'ด') },
  { id: 'remote-image', why: 'expiring Stitch image URL',
    files: src, test: (l) => l.includes('lh3.googleusercontent') },
  { id: 'outline-none', why: 'removes focus with no focus-visible replacement',
    files: src.filter((p) => p.endsWith('.tsx')),
    test: (l) => l.includes('outline-none') && !l.includes('focus-visible') },
  { id: 'wrong-deps', why: 'sonner replaces our two-live-region Toast; lucide has no racket glyph (Plan 01 §4.5)',
    files: [join(root, 'package.json')],
    test: (l) => /"(sonner|lucide-react)"/.test(l) },
  { id: 'tailwind-merge-v3', why: 'tailwind-merge v3 targets Tailwind 4 and mis-merges against our pinned 3.4.17',
    files: [join(root, 'package.json')],
    test: (l) => /"tailwind-merge":\s*"(?!\^?2\.)/.test(l) },
  { id: 'modal-drawer', why: 'Sheet and SelectionDrawer must stay non-modal (Plan 01 §4.5)',
    files: ['src/components/ui/sheet.tsx', 'src/features/booking/pages/booking-grid/components/selection-drawer.tsx']
      .map((p) => join(root, p)),
    test: (l) => l.includes('react-dialog') },
  { id: 'db-direct', why: 'the store is the demo\'s server — UI reads go through api.ts so Plan 04 can swap them for fetches',
    files: src.filter((p) => /\.(ts|tsx)$/.test(p)
      && !relative(join(root, 'src'), p).startsWith('data')
      && !/\.test\.tsx?$/.test(p) && !p.includes('testing')),
    test: (l) => /from '(@\/data\/db|\.{1,2}\/.*\/db)'/.test(l) },
  { id: 'raw-hex', why: 'colours come from tailwind.config.js only (§11.3)',
    files: src.filter((p) => /\.(ts|tsx)$/.test(p) && !p.includes(`${join('components', 'icons')}`)),
    test: (l) => /#[0-9a-fA-F]{6}\b/.test(l) },
];

let failures = 0;
for (const gate of gates) {
  const hits = [];
  for (const file of gate.files) {
    // A gate pointed at a moved file used to pass silently (modal-drawer did, for weeks).
    if (!existsSync(file)) { hits.push(`${relative(root, file)}: file not found — update the gate`); continue; }
    read(file).split('\n').forEach((line, i) => {
      if (gate.test(line)) hits.push(`${relative(root, file)}:${i + 1}: ${line.trim()}`);
    });
  }
  if (hits.length) {
    failures += hits.length;
    console.error(`✗ ${gate.id} — ${gate.why}\n  ${hits.join('\n  ')}`);
  } else {
    console.log(`✓ ${gate.id}`);
  }
}
if (failures) {
  console.error(`\ngate: ${failures} violation(s)`);
  process.exit(1);
}
console.log('\ngate: all clear');
