# Winner Court — booking demo (frontend only)

The booking demo for Plan 01 (`documents/plans/01-frontend-booking-demo.md`). It exists to
show a venue owner what the product does, so it runs entirely on fixtures: no backend, no
payment screen, and no LINE integration (Revision 5). Booking a court ends at
*รอชำระที่หน้าร้าน*, which is what v1 will do.

This project uses **pnpm** (pinned in `packageManager`). Do not use npm here — a second
lockfile is how two machines quietly end up on different versions.

```bash
pnpm install     # honours the committed pnpm-lock.yaml
pnpm dev         # http://localhost:5173  (also on your LAN IP, for testing on a phone)
pnpm check       # gate → typecheck → lint → test → build
pnpm build && pnpm preview   # the static bundle, as a venue owner would see it
```

## Where things live

<!-- tree:start -->
```
src/
  app/                              the wiring; routes.tsx is the only list of URLs
    pages/                          screens no feature owns
      catalog/                      /__catalog — every primitive in every state
      not-found/
    providers/                      every context that wraps the app
  features/                         package by feature; a feature never imports a feature
    booking/
      components/                   shared by more than one booking page
      pages/
        booking-grid/               a page = a folder = one line in app/routes.tsx
          components/               private to this page
          hooks/
        booking-review/
        booking-success/
        my-bookings/
          components/
    venue/
      pages/
        court-profile/
          components/
  components/                       shared by the whole app
    icons/                          one file per Material Symbols glyph
    ui/                             shadcn primitives, adapted to our tokens
  data/                             the fixtures and the fake API — the Plan 02 seam
  layouts/                          app chrome: header, bottom nav, safe areas
  lib/                              money, dates, cn — no domain knowledge
  styles/
  testing/                          helpers for tests, not shipped
```
<!-- tree:end -->

`testing/readme-tree.test.ts` compares that tree to the real directories, so it fails
rather than rots. Add a folder and the failure message prints the block to paste.

### Adding something

| You are adding | It goes |
|---|---|
| A route | a line in `app/routes.tsx`, plus `<feature>/pages/<page>/index.tsx` — or `app/pages/` if no feature owns it |
| A component one page uses | that page's `components/` |
| A component two pages in one feature use | `features/<feature>/components/` |
| A component two features use | `components/ui/` |
| A glyph | `components/icons/`, then one line in `components/ui/icon.tsx` |
| A nav tab | flip `enabled` in `layouts/nav-config.ts` — nowhere else |
| A price, a date rule, a fixture | `data/` — never inline in a component |

Conventions, and the reasons for them, are in `DESIGN.md` §6. The ones that can be
checked are checked: `pnpm test` fails on a cross-feature import, a page reaching into
another page's components, a route with no folder, or a `<Route>` re-declared in a test.

### Reading the planning documents

`documents/` is the record of how this was decided, written before the code. It is not a
map of the code: `documents/plans/01-frontend-booking-demo.md` §4.4 sketches a `src/`
tree that was never built as drawn — `platform/`, `demo/`, `Payment.tsx` and eight other
entries were cut, and everything else has since moved. **This README is the current tree;
the plan is the argument.**

- Stack: Vite 6 · React 19 · TypeScript 5.7 · React Router 6 (hash) · Tailwind **3.4.17, pinned**
- Design tokens: `tailwind.config.js` is the single source of colours, type and radii.
- Icons: Material Symbols Outlined, committed under `src/components/icons/` (Apache-2.0, see
  `LICENSE-material-symbols.txt`), used through the typed `<Icon name="…" />`.
- Fonts: self-hosted via `@fontsource` — never load Google Fonts from a CDN.
- Photos in `public/venue/` and mascots in `public/mascot/` are converted from
  `documents/stitch/`; the photos are AI-generated sample imagery for the demo only.
