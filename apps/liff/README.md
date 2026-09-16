# Winner Court — booking demo (frontend only)

The LIFF web app for Plan 01 (`documents/plans/01-frontend-booking-demo.md`). No backend:
data is fixtures, payment and LINE are simulated.

```bash
npm ci          # use the committed lockfile
npm run dev     # http://localhost:5173  (also on your LAN IP for phone testing)
npm run check   # gate → typecheck → lint → test → build
```

- Stack: Vite 6 · React 19 · TypeScript 5.7 · React Router 6 (hash) · Tailwind **3.4.17, pinned**
- Design tokens: `tailwind.config.js` is the single source of colours, type and radii.
- Icons: Material Symbols Outlined, committed under `src/components/icons/` (Apache-2.0, see
  `LICENSE-material-symbols.txt`), used through the typed `<Icon name="…" />`.
- Fonts: self-hosted via `@fontsource` — never load Google Fonts from a CDN.
- Photos in `public/venue/` and mascots in `public/mascot/` are converted from
  `documents/stitch/`; the photos are AI-generated sample imagery for the demo only.
