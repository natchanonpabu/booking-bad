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

- Stack: Vite 6 · React 19 · TypeScript 5.7 · React Router 6 (hash) · Tailwind **3.4.17, pinned**
- Design tokens: `tailwind.config.js` is the single source of colours, type and radii.
- Icons: Material Symbols Outlined, committed under `src/components/icons/` (Apache-2.0, see
  `LICENSE-material-symbols.txt`), used through the typed `<Icon name="…" />`.
- Fonts: self-hosted via `@fontsource` — never load Google Fonts from a CDN.
- Photos in `public/venue/` and mascots in `public/mascot/` are converted from
  `documents/stitch/`; the photos are AI-generated sample imagery for the demo only.
