# Winner Court

A court-booking product for a badminton venue. Two things live here:

| | |
|---|---|
| **[apps/liff/](apps/liff/README.md)** | the code. **Start here** — it has the setup commands and the current `src/` tree. |
| **[documents/](documents/)** | why it is built this way, written before the code. The argument, not the map. |

New to the repo:

```bash
cd apps/liff
pnpm install
pnpm dev      # http://localhost:5173, and on your LAN IP so you can open it on a phone
pnpm check    # gate → typecheck → lint → test → build. Green before you push.
```

Then read, in this order:

1. [apps/liff/README.md](apps/liff/README.md) — the tree, and where a new route or component goes
2. [apps/liff/DESIGN.md](apps/liff/DESIGN.md) — tokens, components, and §6 for the folder rules and why
3. [documents/prd.md](documents/prd.md) — what the product is for
4. [documents/plans/01-frontend-booking-demo.md](documents/plans/01-frontend-booking-demo.md) — the plan this demo implements. Long, and dated: where it and the code disagree, **the code is right**.

The conventions that can be checked are checked, so `pnpm test` is the fastest way to
learn them. It fails on a cross-feature import, a page reaching into another page's
components, a route with no folder, a `<Route>` re-declared in a test, and a `src/`
directory missing from the README tree.
