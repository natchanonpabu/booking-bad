# Plan 01 — Frontend-Only Booking Demo
**Winner Court (วินเนอร์ คอร์ท) · the court-booking flow, end to end, on a phone, with no backend**

| | |
|---|---|
| **Status** | **Built** at `apps/liff/` (branch `frontend-demo`). Approved 2026-09-15 (Revision 4); scope cut 2026-09-18 (Revision 5); reconciled with the code 2026-10-06 (Revision 7). Open: a static host, and the gaps listed in §11. |
| **Owner** | 1 developer (React/TS). A second person is useful for the device pass on Day 15 and nowhere else. |
| **Duration** | Planned at 16 working days, then ~13 after Revision 5 (§10). Built 2026-09-16 → 2026-09-30. |
| **Depends on** | Nothing. No backend, no accounts, no vendor, no venue signature. |
| **Blocks** | Plans 03–04 (foundations, real booking). Plan 01's `types.ts` is their API contract. |
| **Source precedence** | mockup markup > `booking-screens.json` > `ds.md` > `register.md` > `prd.md` (last, and it loses every conflict). |

---

## Revision 7 — reconciled with the shipped code (2026-10-06)

The body of this plan now describes `apps/liff/` as built, not as first proposed. Where the build did less than the plan asked, the gap is written next to the plan's text — not deleted — so it stays visible.

- **Code blocks in §4.5, §4.6, §5.1, §5.2, §6.1, §6.3, §6.4 and §6.6 are the committed files.** The differences were small except in `api.ts`, whose `confirmPayment` became `confirmBooking` (§6.6).
- **§4.7 is the real tree**: package-by-feature, kebab-case, pages as folders. `apps/liff/README.md` holds the same tree under a test.
- **§7–§9 are rewritten as built**, with a "Not built" list per screen. The state machine is `features/booking/selection.ts` (pure) plus a hook; there are 21 tests, not 19 (§8.7).
- **§11 is a status checklist**: `[x]` holds in the code, `[ ]` does not yet, struck items were cut.
- **§12–§13 follow the shipped flow**: grid → review → counter booking → success → `/bookings`. No QR, no LINE, no `DemoBar`.
- Revisions 2–6 below are left as written. They are the record of how each decision was reached.

**Gaps this reconciliation found** (in §8–§11, repeated here so they are not lost): the grid's retry button does not refetch; Back from review does not restore the selection; `Escape`, `Ctrl+Home/End` and `Shift+↑/↓` are not wired; the booking-ref counter restarts on reload and can repeat a ref; seeded upcoming bookings do not block their slots; `/bookings` reads `data/db` directly; the `modal-drawer` gate checks a path that moved.

---

## Revision 6 — shadcn/ui adopted (2026-09-20)

Revision 3 rejected shadcn/ui. The owner asked for it anyway, so it was tested instead of argued about, and **the rejection was overstated.** What the test actually found:

| Claim in Revision 3 | What happened when it was run |
|---|---|
| "The shadcn CLI favours Tailwind v4" | `init` **succeeds** on our pinned 3.4.17 — validates the config, writes `components.json`, updates the CSS |
| "It blocks adoption" | The build failed on one thing: `text-foreground` did not exist. Adding shadcn's token names to `tailwind.config.js` fixed it in minutes |
| — (not previously tested) | The **current** registry (`shadcn@4`, style `radix-nova`) emits Tailwind v4 syntax — `ring-3`, `has-data-*`, `in-data-*`, `aria-invalid:*`, `not-aria-*`. Compiled against 3.4.17 those produce **nothing**, silently: no focus-ring width, no invalid-field styling |
| — | **`shadcn@2.1.8` emits clean Tailwind 3 components** — `focus-visible:ring-1`, `h-9`, `[&_svg]:size-4`, importing `@radix-ui/react-slot` and `cva` only |

**Decision: adopt shadcn from the 2.x (Tailwind 3) registry.** `components.json` is committed so the CLI keeps working. Base components are `button`, `card`, `badge`, `input`, `label`, `radio-group`, `skeleton`, `separator`.

**Token names stay ours** (owner's call). The M3 set is what 38 generated mockup configs use, so `tailwind.config.js` *adds* the names shadcn needs — `background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `*-foreground` — pointing at our palette. `primary` and `secondary` keep our meaning; a pasted component that says `bg-secondary` is rewritten to our surface tokens, because ours is a dark brown for peak pricing, not a muted button.

**Three things deliberately not taken from shadcn:** `lucide-react` (no racket, tennis, badminton or shuttlecock glyph — `sports_tennis` is our main tab), `sonner` (§8.6 needs two live regions at different politeness levels), and the Geist font (no Thai). `scripts/gate.mjs` fails the build if any of them reappears.

**One trap, worth the sentence.** shadcn's `cn` uses `tailwind-merge`, which knew neither our type scale nor our colour names, decided `text-on-primary` and `text-label-lg` were the same kind of class, and dropped the first. Every primary button rendered navy text on a navy fill — no error, no failing test, just invisible labels. `src/lib/utils.ts` now extends tailwind-merge with our `font-size` group, and `utils.test.ts` locks it. **`tailwind-merge` is pinned to v2**; v3 targets Tailwind 4 and would mis-merge the same way.

---

## Revision 5 — demo scope cut to the sales pitch (2026-09-18)

The owner decided the demo has **one job: selling the idea to a venue owner.** It does not take money and it is not wired to LINE. Three cuts follow, and they are cuts of *work*, not of the pitch — the beat that sells this product is the grid, not the QR.

| Cut | Why | What goes |
|---|---|---|
| **The payment screen** | v1 is book-online / pay-at-the-counter (§Revision 4, D19′), so a PromptPay screen demos a flow that will not ship | `/book/pay`, `/qr-demo`, `/book/expired`, `QrPanel`, `HoldBanner`, the 15-minute hold countdown, the `qrcode` dependency |
| **The LINE integration** | No LIFF app, no LINE Login, no channel — the demo opens in an ordinary mobile browser | The Day-15 LIFF spike, `ShareToLine`, `OutsideLineNotice`, `liff.state` handling |
| **The hold** | With nothing to wait for between choosing and confirming, a hold has no user-visible job in the demo | The countdown, the expiry chain, and the expired screen. `api.createHold` stays in the code, unused, because Plan 04 needs it |

**The booking flow becomes three screens:** grid → review → success. Confirming creates the booking immediately as *rอชำระที่หน้าร้าน* (`paymentMethod: 'counter'`, `status: 'pending_payment'`), which is exactly what v1 will do.

**Duration: 16 → ~13 working days.** Days 1–4 are done, so **~9 remain**. Gate 1 (clickable end to end on a phone) moves from Day 9 to **Day 8**.

**Still true, and still needed before the demo is shown on someone else's phone:** somewhere to host the built files, or a laptop on the same wifi. That is not a LINE account and not a paid service.

---

## Revision 4 — approved (2026-09-15)

The owner answered the open questions. These are now decisions, not proposals:

| # | Question | Decision |
|---|---|---|
| 1 | ADR-001 §4.4 amendments | **Money is `Satang`** (integer satang, branded type), `Quote.quoteToken` and `AvailabilityBlock.venueId` are added **in this plan** (§6.1, §6.3, §6.4, `money.ts`). The LINE-OA friendship gate is **deferred to Plan 04** — the demo sends no LINE messages, and the success screen already shows the booking reference and venue phone. |
| 2 | §0 spine — demo first, harden second | Approved |
| 3 | 16 working days, Gate 1 on Day 9 | Approved |
| 4 | Weekday peak (D04′) | **17:00–21:00**; 21:00–22:00 is back to ฿180 |
| 5 | Pay at the counter (D19′) | **Kept** |
| 6 | "แจ้งเตือนเมื่อมีคิวว่าง" toggle on a sold-out day (D23′) | **Kept** (records a preference only) |
| 7 | Bottom tabs (D61′) | **Two rendered**: จองคอร์ท, ประวัติจอง |
| 8 | Venue data | **Fictional sample venue**: 6 courts, ฿180/฿220, 09:00–22:00 |
| 9 | Company name, tax ID and contact details | **Obviously fake placeholders**, so nothing in a demo shown to a real owner matches a real company, phone line or LINE account (§6.3) |
| 10 | Where the code lives | **Same repository as the documents.** The demo is built at `booking/apps/liff/` (§4.7) — the path ADR-001 §4.3 already expects, so Plan 03 adds `apps/api` beside it without moving files |

**Consistency fix made with this revision:** the hold is **15 minutes**, not 10, matching ADR-001 §3.3 (a real PromptPay payment — save QR, open the bank app, scan from gallery, PIN, OTP — routinely takes longer than 10).

---

## Revision 3 — components and icons (2026-09-15)

Decided after testing shadcn/ui against this plan's constraints. Details and evidence in **§4.5**.

1. **shadcn/ui is not adopted.** No `npx shadcn init`, no `components.json`, no `cva`, `tailwind-merge`, `sonner`, `lucide-react`. Every component except one stays hand-written with the project's own tokens.
2. **One Radix primitive is adopted: `@radix-ui/react-dialog`** (plus `@radix-ui/react-slot`, which ships inside it, for `Button asChild`). It backs a new **`Modal`** component (§7 #9a) used by every genuinely modal surface.
3. **`Sheet` and `SelectionDrawer` are explicitly non-modal** and must never be built on Dialog — doing so traps focus away from the grid and breaks the core interaction.
4. **A hand-written `useRovingFocus` hook** backs `DateStrip`, `SegmentedTabs` and `PaymentMethodCard`. Radix Tabs/RadioGroup are ruled out because they drop disabled items from arrow-key order (§4.5).
5. **Icons are Material Symbols copied from [shadcn.io/icons](https://www.shadcn.io/icons)** into `src/components/icons/`, one committed file per glyph, wrapped by the typed `Icon.tsx`. Same icon family as the approved mockups, so no screen changes. The in-scope mockups use **69 distinct glyphs**, not ~50 — the full checklist is in §4.5.
6. **Duration unchanged at 16 days.** Days 12–13 now concentrate on `CourtMatrix`; modal accessibility is inherited rather than retrofitted. Gates grow from six greps to eight (§11.2).

---

## Revision note — revised against `01-critique.md`

This is **revision 2**, edited in place against the expert review in `documents/plans/01-critique.md`, whose findings are treated as authoritative. If you read revision 1, these are the material changes:

1. **Duration 11 → 16 working days; Gate 1 Day 5 → Day 9.** The old estimate was roughly 2× short on Days 1, 2, 4 and 5. The arithmetic is in §10; the reasoning for extending the schedule rather than cutting the scope is §10.1. **The state-machine days are still protected** — they are now Days 5–6.
2. **The grid is `role="grid"`, not a plain `<table>` + roving tabindex** (§3.5 #5, §8.6). Cells carry `aria-selected`, never `aria-pressed`, and the container carries `lang="th"`.
3. **`Selection` is one type, in whole hours, and carries `courtIds: CourtId[]`** (§6.1, §8.1). One court renders in the UI; multi-court survives in the contract. `Booking.courtId` becomes `Booking.courtIds` for the same reason.
4. **Seven code defects fixed in place** (§6, §11.3): timezone-broken `addDays`/`dayOfWeek`, two incompatible `Selection` types, `Venue`'s literal policy types, `quote()` ignoring `slotMinutes`, the missing `fee` line on seeded bookings, the `฿440` vs `฿440.00` convention, and the `.tsx`-only hex gate.
5. **The state machine is completed** (§8.2, §8.4): `closed` (R0), own-hold exclusion from the availability projection and the exact moment `createHold` fires, the wall clock crossing an hour boundary, the `Shift+↑`/`Shift+↓` contradiction and the clamp at 22:00, `minBookingHours > 1`, and taps during `quoting` / `loading` / `error`.
6. **New §12.4 — the five questions that end the meeting**, with prepared one-line Thai answers: multi-court (เหมาคอร์ท), ก๊วนประจำ, walk-ins and phone bookings, commission-vs-subscription and whose account PromptPay settles into, and the owner-side view.
7. **Thai typography is specified** (§5.1) — a line-height floor of 1.5–1.6 at every size used at 11–14px, and a single stated source of Buddhist-era years in `thaiDate.ts`.
8. **LINE/LIFF realities** (§3.5 #3, §4.8, §9): `liff.shareTargetPicker()` replaces `line.me/R/share?text=` on the in-LIFF path and is tested on **Day 1**; the hash-route claim is downgraded to an assumption to verify; 16px inputs; an `@supports` fallback for `backdrop-blur`; every `fixed` element gets its own inner clamp; the cell width becomes a token.
9. **Cut**: the icon sprite codegen, the 250 ms quote debounce, five of the six query flags, the `:root` palette mirror, the 15 s hold sweeper. **Added**: a 2-hour non-blocking LIFF spike, ~20 lines of instrumentation, `localStorage` + explicit reset, and the save-QR-to-gallery affordance.
10. **The demo script no longer depends on a weekday** (§12), the live rate edit moved from a laptop into `DemoBar`, and it is budgeted at **8–12 minutes**, not four.

---

## 0. The one decision this plan makes before any other

Two versions of this plan were drafted. One was a **5.5-day minimal slice** — get a clickable story in front of a venue owner by Friday, cut everything that is not the ฿440 narrative. One was a **20.5-day foundation-first build** — establish the token package, the typed component library, the fixture-as-contract and the interaction model properly, because this is the only moment anyone will pay for that.

They are not two drafts of one document. They are the two honest ends of a real tradeoff, and picking neither is how you get a 20-day build that is still not demoable.

**This plan takes the minimal-slice spine and grafts the foundation-first definition of done onto exactly four files.**

The order is the minimal slice's: *demo first, harden second.* The reason is not speed. It is `critique.md` #1 — nobody has yet asked the pilot venue **"how do you take money today, and do you actually want prepayment?"** If the answer is "cash at the desk, always," then the PromptPay screen is decoration and half a foundation-first build was spent on an assumption. A demo you can put in a venue owner's hands in week 1 is the cheapest instrument available for finding that out. Build the foundation *after* the thing that can prove the foundation is pointed at the right product.

The definition of done is the foundation-first one, but scoped to four artifacts:

| Built to production quality — will not be rewritten | Built to demo quality — expected to be replaced |
|---|---|
| `tailwind.config.js` + `index.css` — the token package (§5) | Every screen's layout and copy above the component layer |
| `src/features/booking/selection.ts` (the state machine) + its unit tests (§8) | `db.ts` and the fixture contents |
| `src/data/types.ts` + `rates.ts` + `booking-ref.ts` (§6) | `clock.ts`'s demo scaffolding (`defaultDemoDate`, `advance`) |
| `CourtMatrix` / `SlotCell` accessibility semantics (§8.6) | Every `features/*/pages/*/index.tsx` — treat as scaffolding around the components |

**Where the line falls, and why it falls there.** Those four survive because they encode *decisions*, not pixels. The state machine is thirteen behavioural rules that a backend will have to re-validate and that no mockup prototypes; getting them wrong later means re-litigating them with a customer in the room. The tokens are the only reconciliation of 48 divergent inline Tailwind configs that will ever be done. The types are the API contract — Plan 02's first task is to make a server return exactly `Booking`. The grid a11y is the one thing in this product that is genuinely hard to retrofit, because it changes the DOM shape of the core component. Everything else is markup, and markup is cheap to redo once the data underneath it is right.

Concretely, the eight substantive disagreements between the two drafts are resolved in §3 (peak window, frozen vs live clock, router, nav tab count, grid construct vs scroll panes, `disabled` vs `aria-disabled`, which loading states get built, court metadata). Each is decided, not averaged.

**What that actually costs, stated honestly.** Revision 1 priced this spine at 11 days with a Day 5 gate. That was wrong by roughly a factor of two on the four days that matter, and the review in `01-critique.md` shows the arithmetic. Grafting a foundation-first definition of done onto four artifacts does not make those four artifacts cheap — it makes them *few*. The correct number is **16 days with Gate 1 on Day 9**, and §10.1 explains why that is a better answer than keeping Day 5 and cutting until it fits. This is still not the 20.5-day foundation-first build: what is missing from it is screen chrome, six loading states, and the five screens the mockups already draw well enough to port.

---

## 1. Purpose and the done condition

### Purpose

Turn nine static HTML mockups — which contradict each other on price, colour semantics, court surfaces, phone numbers, booking-reference format and the very number of rows in the grid — into one internally consistent, clickable booking flow that runs on a phone with no backend, and that produces four files the real product will be built on top of.

The demo has three jobs, in priority order:

1. **Sell.** A venue owner opens a link on their own phone, books คอร์ท 3 for Friday 19:00–21:00 at ฿440, and understands within ninety seconds what they would be buying.
2. **Reconcile.** The mockups currently ship 6 booking-reference formats, 3 venue phone numbers, 4 prices for one hour of court time, and two grids that invert each other's colour semantics. The demo cannot render two prices, so building it forces every one of those to be settled. §3 is the output.
3. **Found.** Produce the token package, the state machine, the type contract and the accessible grid that Plan 02 inherits on day one.

### Done condition

> **A venue owner, handed an unlocked phone with a link and no explanation, books คอร์ท 3 on a Friday evening for 19:00–21:00 at ฿440 — grid → review → confirmation → "การจองของฉัน" — without being told what to tap; nothing on any screen contradicts anything on any other screen; and `selection.ts`, `types.ts`, `rates.ts` and `tailwind.config.js` are merged as-is into Plan 02 without edits.**

*Revision 5 removed the PromptPay step from this sentence: the booking ends at รอชำระที่หน้าร้าน.*

Both clauses are required. The first alone gets a throwaway. The second alone gets a library nobody has validated.

---

## 2. Scope

### 2.1 In — nine mockups, nine routes

`_1`, `2.` and `_2` are three states of one screen. `_3` and `empty_state` are two states of one screen. The mockups split them into separate files; the code must not.

| Route | Screen (TH) | Mockup folder(s) | State discriminator |
|---|---|---|---|
| `/` | โปรไฟล์สนาม | `winner_court_1` | — |
| `/book` | จองคอร์ทแบดมินตัน | `_1`, `2.`, `_2` | `selection.kind` · `day.soldOut` |
| `/book/review` | ยืนยันข้อมูลการจอง (1/3) | `winner_court_2` | `payment.method` |
| `/book/success/:ref` | จองคอร์ทสำเร็จ (2/2) | `line` | `payment.status` |
| `/bookings` | การจองของฉัน | `_3`, `empty_state` | `bookings.length` |
| `*` | ไม่พบหน้านี้ | ⟪none — invented⟫ | — |

*(Revision 5 removed `/book/pay`, `/qr-demo` and `/book/expired` — see the table at the top of this file. Six routes remain: five screens plus the catch-all.)*

### 2.2 Out — named, so nobody has to ask

**Out of this plan entirely:** split bill (`split_bill_line_share`), scoreboard and match universe (`match_scoreboard`, `4_court_4_live_scoreboard`, `30_*`), duels (`duel_lobby_match_center`, `rematch_*`, `match_challenge_sheet`), leaderboard, player cards, insights, member slip upload, IoT / court lights / check-in QR (`4_court_light_*`, `check_in_pass_qr_code`), all 13 LINE Flex previews, the owner console, and the `candy/` theme (an orphan with no HTML and a palette in 0 of 48 files — do not read it as an alternative brand direction).

**Out within the booking flow, deliberately cut:**

| Cut | Cost saved | Why |
|---|---|---|
| The `4.8 (142 รีวิว)` capsule on S1 | 0.25 d | Fabricated social proof with no capture mechanism anywhere in the product. A venue owner asks where the 142 reviews came from and the demo stops being about booking. Replaced by a `verified` pill `สนามพาร์ทเนอร์`. (D08) |
| Card-payment tab on S6 | 0.25 d | No screen behind it, no provider (D17 open). Rendered as a disabled `เร็ว ๆ นี้` chip so the pitch can still mention it. |
| `_3`'s receipt viewer, QR-เข้าคอร์ท sheet, policy card | 0.5 d | Three dead ends; each becomes a `เร็ว ๆ นี้` sheet. |
| **The icon sprite codegen** (`build-icons.mjs`, SVGO, generated union, `-fill` axis) | 0.5 d | Material Symbols components copied from shadcn.io and registered in a typed `Icon.tsx` give the identical "a typo is a TS error" guarantee and the identical offline behaviour, with no build script to maintain. See §4.5. |
| **The 250 ms fake quote debounce** | 0.1 d | It made the demo's best interaction (step 5, *ราคารวมขึ้นเองเลย*) feel slower than it is. The `quoting` state stays in the code path for Plan 02; the delay is **0** in Plan 01 (§8.5). |
| **Five of the six query flags** (`?fast ?error ?conflict ?fail ?reset`) | 0.2 d | Six URL parameters to remember under stage pressure is a failure mode. `?demo=1` is now the only query parameter in the app; every other switch is a `DemoBar` control (§4.9). |
| **The `:root` custom-property mirror of the full palette** | 0.2 d | Its stated consumers — canvas, inline SVG, Flex-JSON tooling — do not exist in Plan 01. Only the seven custom properties something actually reads survive (§5.2). |
| Offline banner, stale-data banner, S1/S8/S9 skeletons | 0.5 d | See §3 NEW-2 — three loading states are built, six are not. |
| Long-press and drag-to-select on the grid | 1.5 d | Tap-to-extend covers the whole interaction. Stated here so nobody assumes it. |
| Dark mode | — | 38 mockup configs declare `darkMode:'class'` and authored **zero** `dark:` variants. Dead config; do not resurrect (D55). |

**Kept against instinct, both deliberate overrides of `register.md`:**

- **Cash at the counter** (overrides D19, which cuts it from v1). Per `critique.md` #1, this may be the product most Thai venues actually want, and a venue owner asks about it inside the first thirty seconds. Cost is one radio option and one status variant — `_3` already contains the `รอชำระเงิน` card design for exactly this. It is not a new screen.
- **The waitlist toggle on the sold-out day** (D23 cuts the waitlist feature). One persisted boolean. It is the strongest "this would get my business" signal in the flow. Scope-honest label: it records intent, it queues nothing.
- **Save the QR to the photo gallery** (revision 1 cut this as "40 lines to make a file nobody in the demo saves"). That was backwards. On a phone-only flow **nobody scans their own screen**: the Thai muscle memory is save the QR → open SCB / K PLUS / Krungthai → *สแกนจากคลังภาพ*. It is the single thing a venue owner checks, because it is how their existing customers already pay them. Built as an `<img>` (long-press → *บันทึกรูปภาพ* works on iOS Safari, Android Chrome and inside LINE) plus an explicit `บันทึก QR ลงรูปภาพ` button. See §9 S6.

**Two things added by revision 2, both cheap and both load-bearing:**

- **~20 lines of instrumentation** (`lib/instrument.ts`, §4.9). The demo's stated first job is to *learn* (§12 step 3: "watch them, do not coach") and revision 1's only instrument was one person's memory.
- **A 2-hour, non-blocking LIFF spike** on the last day (§10, Day 16). The largest unknown in this product is whether the flow survives `liff.init()`, the login redirect round-trip and `shareTargetPicker`. Discovering that in Plan 04 with a backend also in flight is the expensive version.

> **As built (2026-10-06).** Revision 5 cut the QR, the card chip, the save-to-gallery affordance and the LIFF spike. Of the rest: the `สนามพาร์ทเนอร์` pill, the `เร็ว ๆ นี้` sheets, the waitlist toggle, the instrumentation and `DemoBar` were not built; the quote debounce shipped at 250 ms, not 0 (§8.5); `?fast=1` is the only query parameter the app reads; loading skeletons were built on `/book`, `/book/success`, `/bookings` and the `/` availability card. Cash at the counter is now the *only* method, not one of two. §7–§9 list what shipped.

---

## 3. Decisions this demo settles

Every row below is settled **by the act of building** — the demo cannot render two prices, so it forces an answer. Each is a data or config edit to revert, which is why settling now is cheap. Output was planned for a `DECISIONS.md`, which was not written; this section and the Appendix are the record, and they feed back into `register.md`.

### 3.1 Venue facts and pricing

| ID | Question | Answer for Plan 01 | Why cheap to settle now |
|---|---|---|---|
| **D01** | How many courts? | **6.** PRD says 12; all 48 mockups say 6; `คอร์ท 7`–`คอร์ท 12` → 0 hits. | `COURTS[]` array length. Grid width is `courts.length`, never `6`. |
| **D02** | Bookable hours and block size? | **09:00–22:00, 1-hour blocks, 13 continuous rows.** `_1` silently omits the 12:00, 14:00 and 16:00 rows while claiming a continuous day. | Two integers in `VENUE`. Rows are generated by a loop, never typed. |
| **D03** | Rate card? | **฿180 standard / ฿220 peak.** Two tiers only. ฿160 (`2.`), ฿200 (`empty_state`) and ฿360-per-2h (`_3`, arithmetically impossible at any peak rate) are deleted. | Three rows of `RATE_RULES`. |
| **D04′** | When is peak? | **17:00–21:00 weekdays; weekends peak all day. 21:00–22:00 returns to ฿180.** *Deviates from D04 (17:00–22:00) — see §3.5.* | One integer: `r_peak_wd.endMinutes`. |
| **D05** | Prices: code or data? | **Data.** `RateRule[]` with a day bitmask, an hour window and a priority. Nothing hardcodes ฿180 or ฿220 anywhere. | This *is* the cheap option. It also gives the demo its best moment (§12 step 11). |
| **D06** | Court surfaces and climate? | **One table, six rows** (§6.3). Court 3 = ยาง BWF + แอร์; Courts 5–6 = พัดลม. Court 3 alone appears as ยางเขียว / ปาร์เกต์ / พื้นยาง BWF / พื้นยางเกรด BWF across four files. Marked `assumed` until the venue confirms. | A fixture table. Confirming it is a one-line edit per court. |
| **D07** | Venue master record? | **One `VENUE` object.** One phone: `02-000-0000` / `tel:020000000` (a sample number, decision 9). The mockups ship three numbers, and reuse one of them as the *user's* emergency contact field. | Six call affordances read one field. |
| **D08** | Ratings and reviews in v1? | **No.** Capsule cut. | Deleting is free. |
| **D09** | Booking reference format? | **`WC-YYMM-NNNN`**, per-venue-per-month running sequence. Six competing schemes live in the mockups. Not random: a 4-char base32 suffix is a ~1.05M space and `critique.md` #14 shows the "zero collisions in 1M draws" criterion is unpassable there. | 12 lines in `booking-ref.ts`. Becomes a Postgres sequence per `(venue_id, yymm)`. |

### 3.2 Booking rules

| ID | Question | Answer for Plan 01 | Why cheap to settle now |
|---|---|---|---|
| **D15** | How long is a slot held? | **15 minutes** (ADR-001 §3.3), seeded from `VENUE.holdMinutes`, counted from a wall-clock deadline. Not the mockup's `9:42` seed, not `_3`'s `15 นาที` chip. *As built: the hold left the flow with Revision 5; `VENUE.holdMinutes` and `api.createHold` remain for Plan 04.* | One integer. Copy interpolates it. |
| **D16** | Cancellation window? | **3 hours**, 100% refund. Mockups say 3 in two places; only the PRD says 4. | One integer, interpolated into two copy strings. No screen types the number. |
| **D19′** | Payment methods in v1? | **PromptPay + cash at counter.** *Overrides D19 (online only) per `critique.md` #1.* Card is a disabled `เร็ว ๆ นี้` chip. *As built: counter only, after Revision 5 — one radio option, selected by default.* | One extra radio, one extra `BookingStatus` variant. |
| **D21** | Max hours, contiguity, how far ahead? | **1–3 contiguous hours, 14 days ahead.** Contiguity is not enforced by a rule — it is unrepresentable in the `Selection` type (§8.1). The hour count is `venue.minBookingHours`/`maxBookingHours`, read as data, not as `1` and `3` (§8.2 R14). | Two fields on `VENUE`; the type does the rest. |
| **D23′** | Waitlist? | **Toggle in the demo, feature stays cut.** Stores intent in `localStorage`, queues nothing, and says so. *As built: not built.* | One boolean. |
| **NEW-1** | Slot taken while the user is deciding? | Build the conflict path: a modal on `/book/review`, triggerable from `DemoBar`. **This is why the hold is created at the *review* CTA and not at the *grid* CTA** — see §8.4. *As built: `api.confirmBooking` throws `SlotTakenError` and the review screen shows an assertive toast and returns to the grid; no modal, no trigger.* | The single most likely real-world failure of this flow; ~30 lines now, a re-architecture later. |
| **NEW-4** | Is the hour you are standing in still sellable? | **No. The hour containing `now` is `past`; the first sellable hour is `currentHour + 1`.** A venue that sells 19:00–20:00 at 19:35 for ฿220 gets a phone call, not a booking. Flagged `assumed` — it is a venue decision, and a real one. | One comparison in `availability.ts`; §8.4's clock rule reads it. |
| **NEW-5** | Six courts on one screen, or a legible price in each cell? | **Six on one screen: the cell width is a token, `--wc-slot-w`, set to 62px.** 6 × 62 + a 56px time axis = 428px, inside the 430px LIFF clamp, so the whole venue fits a 390px phone with no horizontal scroll. Revision 1's 95px cells were 634px wide — half the venue permanently off-screen, worse inside LINE. Decide the final value **with the owner in the room**; reverting to 95px + scroll is one token. *As built: the matrix is `min-w-[336px]`; all six courts fit with no horizontal scroll.* | One token, one line in `CourtMatrix`. |
| **NEW-6** | Can a customer take two courts for the same two hours? | **Not in Plan 01's UI — but it is representable in the type.** `Selection.courtIds` is an array; the grid writes exactly one entry and the drawer renders one court. A ก๊วน of 8–12 routinely takes 2–3 courts, `_2`'s own contact card asks `ต้องการจัดก๊วนด่วน หรือเหมาคอร์ท?`, and this is the most likely question at §12 step 5. Deciding it now is free; deciding it after `types.ts` is Plan 02's API contract is not. | An array instead of a scalar in the one file that is not allowed to change later (§6.1). |

### 3.3 Design system

| ID | Question | Answer for Plan 01 | Why cheap to settle now |
|---|---|---|---|
| **D51/D52** | Which palette, and the untokenised green? | The **M3 set that 38/48 files share byte-identically**, plus `success: #606C38` (153 raw occurrences across 26 files, no token) and `line: #06C755` (36 occurrences). `tertiary` is `#131a00`, near-black — never a success fill; that is why "ชำระแล้ว" badges render black today. | `ds.md` already did the reconciliation. This plan compiles it once. |
| **D53** | Booked vs maintenance colours? | **Booked = neutral grey + 45° hatch. Maintenance = `error-container` + dot grid.** `_1` and `2.` render these exactly inverted. Booked is the normal condition of a popular court on a Friday; it must not scream. Red belongs on the exception. *Corrects `ds.md`'s draft, which had maintenance grey.* | Two Tailwind plugin utilities. The pattern, not the hue, carries the meaning. |
| **D54** | Radius scale? | The **compressed shipped scale** — `rounded-lg` is **8px**, not the 16px `DESIGN.md` prose claims. | Config values. |
| **D55** | Dark mode? | **No.** `darkMode` omitted from the config entirely. | Not building it is free; leaving dead config in is not. |
| **D57′** | Accessibility bar? | **WCAG 2.1 AA on the booking flow**, with five items CI-gated (§11.2). `focus-visible` appears **0 times in 48 files**; `user-scalable=no` in 38. | Retrofitting a11y into the grid means changing its DOM shape. Doing it once, now, is the only cheap moment. |
| **D59** | Nav tabs? | **One `layouts/nav-config.ts`.** Four entries declared, **two rendered** (`จองคอร์ท`, `ประวัติจอง`). Typo `จองคอร์ด` → `จองคอร์ท` fixed at source (23 of 48 files). Active state derived from the router, never from a `DOMContentLoaded` script. | See D61′. |
| **D61′** | The two tabs that lead nowhere? | **Not rendered in Plan 01**, but present in `nav-config.ts` with `enabled: false`. A greyed tab in a sales demo invites a question about unscoped work. | Restoring them is flipping one boolean. |
| **NEW-2** | Which loading/error states get built? | **Three: grid skeleton, grid error + retry, payment "กำลังตรวจสอบยอดเงิน…".** Not six others. *As built: grid skeleton and grid error built (the error is unreachable while the fake API never rejects); the payment state left with Revision 5; skeletons were also added on `/book/success`, `/bookings` and `/`.* | See §3.5. |
| **NEW-3** | Fonts and icons? | Self-hosted `@fontsource` subsets (Thai + Latin). Icons: **Material Symbols Outlined copied from shadcn.io/icons** into `src/components/icons/`, committed, behind a typed `Icon.tsx`. Not the webfont, not lucide, no runtime icon package. | See §4.4–4.5. The mockups were approved with Material Symbols; changing family is a redesign, not a dependency swap. |
| **NEW-8** | shadcn/ui for base components? | **No.** One Radix primitive — `@radix-ui/react-dialog` — for `Modal`; everything else hand-written on the M3 tokens, with a shared `useRovingFocus` hook. *As built: superseded by Revision 6 — shadcn adopted from the 2.x registry (§4.5).* | See §4.5. It is a `package.json` decision on Day 1; after 30 components have been styled against it, it is not. |
| **NEW-7** | Type scale for Thai? | **A line-height floor of 1.5–1.6 at every size ≤ 16px.** The M3 scale the mockups inherited is a Latin ratio set (11px/14px, 12px/16px) applied to a script that stacks สระ + วรรณยุกต์ above the x-height and descends below it. At 1.27–1.33 those clip in Noto Sans Thai — in the grid, the legend and the chips, which are exactly the sizes this product lives at. | Twelve `lineHeight` values in `tailwind.config.js` (§5.1). Nothing else changes. |

### 3.4 Copy fixes applied at source

`จองคอร์ด` → `จองคอร์ท` · `รอบ 4` (unexplained; collides with `คอร์ท 3` on the same screen) → deleted · `จองคอร์ทสำเร็จ (รอบ 4/3)` → `จองคอร์ทสำเร็จ` · `09:42 น.` → `09:42` (it is a duration, not 9:42 in the morning) · `คัดลอกเลขบัญชี` → `คัดลอกเลขผู้เสียภาษี` (the handler copies the tax ID; the label said account number) · `คุณต้นและเดอะแก๊ง` → `{user.displayName}` (a persona leak in production copy) · `รวมภาษีมูลค่าเพิ่มแล้ว` → removed (asserts VAT with no tax line, and the venue's VAT position is unknown — D74) · `จองทันที` → `ไปต่อที่ชำระเงิน` (the button does not book anything) · `ว่าง 8 คอร์ท` → computed slot count (impossible at a 6-court venue) · `ส่งการ์ด` → `ส่งรายละเอียดนัด` (the share path sends plain text; Flex is not built — §4.8).

### 3.5 The eight places the two draft plans disagreed — resolved

| # | Disagreement | Resolution | Reasoning |
|---|---|---|---|
| 1 | **Peak = 17:00–21:00 or 17:00–22:00?** | **17:00–21:00.** | Both grids price the 21:00 row at ฿180; only `winner_court_1`'s rate-card *copy* says 17:00–22:00. Two grids beat one rate card, no third tier is needed, and it makes the mixed-rate case (20:00–22:00 = ฿400) reachable — which is where the pricing engine earns its keep. Deviates from D04; if the venue says otherwise it is `r_peak_wd.endMinutes`, one line. |
| 2 | **Freeze the demo date, or use the real clock?** | **Real clock, relative day offsets.** | The frozen-date argument was that ฿440 needs a weekday evening. It does not: 19:00–21:00 is peak on **all seven days**, because weekends are peak all day. So the canonical spine survives free. Against freezing: a demo shown in three months displays last year's date, and a venue owner reads that as "this is old." One piece of scaffolding is kept — `defaultDemoDate()` opens the grid on tomorrow when the local clock is already past 18:00, so the 19:00 story never lands in the past (§6.2). |
| 3 | **Hash or browser router?** | **`createHashRouter`.** | Works on any static host with no rewrite config — a Netlify drop, GitHub Pages, `python -m http.server` on a laptop at the venue, or a `file://` copy. A history-mode 404 on a deep link mid-pitch is unrecoverable in the room. One line to switch later. **Assumption to verify, not a fact:** revision 1 asserted that "LIFF appends its own query params and a hash route survives them." `liff.state` redirect handling and fragment routes have a history of interacting badly, and nobody here has tested it. It is checked on **Day 1** from a real LINE chat (§10) and again in the Day 16 spike; if it does not hold, the answer is a `liff.state` unwrapper in the router before any route matches, which is what Plan 04 does anyway. |
| 4 | **Two nav tabs, three, or four?** | **Two rendered, four declared.** | See D61′. |
| 5 | **Two synced scroll panes, or a real table?** | **A `<table>` carrying `role="grid"`** (§8.6) — `role="row"` / `role="columnheader"` / `role="rowheader"` / `role="gridcell"` with `aria-rowindex` and `aria-colindex`, `border-separate; border-spacing: 0`, sticky `<thead>` and sticky first column, and **one** scroll container. *As built: one `div role="grid"` with ARIA rows, headers and indices instead of a `<table>`; the matrix fits the column, so there is no sticky header or axis and no scroll container (§8.6).* | The two-pane approach requires a scroll listener mirroring `scrollLeft`, which drifts, and it gives cells *no* row/column header association — a screen-reader user hears "เต็มแล้ว" with no idea which court or hour. A table gives that association for free and deletes the listener. **But a plain data table is the wrong construct here:** in browse mode VoiceOver and NVDA *intercept* the arrow keys for their own table navigation, so §8.6's key table never fires for the exact user it was written for. `role="grid"` is the one construct that keeps the header association *and* switches AT to application semantics. **Three implementation facts revision 1 did not acknowledge, all of which cost time** (which is why Day 2 is now a spike, §10): `position: sticky` fails inside any ancestor with `overflow: hidden` — both mockup matrix cards have it, 5 occurrences in `2.` and 3 in `_1`; `border-collapse: collapse` drops borders on sticky cells, so `border-separate` + `border-spacing: 0` is mandatory; and a sticky `<thead>` and a sticky first column **cannot live in two different scroll containers** — page-scroll for one and `overflow-x-auto` for the other means one element must stick to two things, which is impossible. The matrix therefore owns a single `overflow: auto` box that scrolls in both axes, with its own height budget (§9). |
| 6 | **`disabled` or `aria-disabled` on booked cells?** | **`aria-disabled="true"`, never `disabled`.** | `disabled` removes the cell from the tab order. With a roving-tabindex grid, that means a screen-reader user arrowing down a column silently *skips* the booked hours and cannot tell a full evening from an empty one. Today `_1` renders booked cells as bare `<div>`s (not focusable, not announced) and `2.` renders them as fully-enabled `<button>`s with no disabled semantics at all — both wrong, in opposite directions. |
| 7 | **Build loading/error states, or set latency to zero?** | **Build three, cut six.** *As built: the latency is real (§6.6); the grid skeleton and error were built, plus skeletons on three more screens (§9).* | `api.ts` returns Promises with 120–350 ms of deliberate latency, so the seam is real. But only the states that are part of the *story* get built: the grid skeleton (the first thing anyone sees), the grid error + retry (the only recoverable failure), and payment verification (the beat where the venue owner is watching for the confirmation). Offline banners, stale-data footers and skeletons on the profile and bookings screens are cut — they are plumbing, and plumbing that nobody in the room will look at is the cheapest thing to defer. |
| 8 | **Court metadata table?** | **The AC-vs-fan split** (§6.3): Court 3 = ยาง BWF + แอร์, Court 4 = ปาร์เกต์, Courts 5–6 = พัดลม. | The most operationally meaningful distinction a customer chooses on, and it makes the grid header row carry information rather than repeat itself. Court 3's BWF label is what four screens already depend on. Flagged `assumed` pending D06. |

---

## 4. Stack

### 4.1 Vite 6 + React 19 + TypeScript 5.7

The hard part of this demo is one stateful component: a 6×13 matrix with contiguous multi-hour selection on a single court, live rate-boundary-aware price accumulation, and a drawer that reads that selection. The mockups fake it by rewriting `className` strings, and `_1`'s handler has a real bug — deselecting a peak cell restores the olive `#606C38` instead of `text-secondary`. A component model with typed props is what makes that logic reviewable, and it is the one piece of code that must survive to the real build unchanged.

**Rejected, with reasons specific to this project:**

- **Next.js** — a LIFF endpoint is a static URL in a webview. There is no server in Plan 01 by constraint, so App Router and route handlers are dead weight, and worse, they invite someone to "just add an API route," which breaks the frontend-only boundary that makes this plan cheap.
- **Astro** — islands optimise for mostly-static pages. Seven of nine screens are stateful. We would hydrate nearly everything.
- **SvelteKit / Vue** — no technical objection; rejected on hiring. This repo becomes the reference implementation for a 1–3 person team that will need to hire in Bangkok.
- **Keep the mockups as HTML + Alpine** — the tempting one, since they already are HTML. It reproduces exactly what the audit found: 48 files each re-declaring the design system, 5 nav models, 2 inverted colour semantics, 0 shared components. The brief says "a foundation, not a throwaway."

### 4.2 Routing, state, and the data seam

**React Router 6, `createHashRouter`** (§3.5 #3).

**No state library.** Two mechanisms, each doing one job:

- **Flow state** — the in-progress selection (`draft`), contact phone and payment method. Created on `/book`, read by three screens, must survive a refresh mid-pitch. → `useReducer` + Context in `app/providers/booking-flow-provider.tsx`, mirrored to `localStorage` under `wc.flow.v1`. ~60 lines. *(The hold deadline and `ownHoldId` left with Revision 5.)*
- **"Server" state** — venue, courts, rate rules, availability blocks, bookings. Read by six screens, mutated by checkout and by hold expiry. → a module store with `useSyncExternalStore` in `data/db.ts`, persisted under `wc.db.v1`. ~70 lines, zero deps, no tearing.

**Rejected:** Redux Toolkit (ceremony for ~200 lines of state). Zustand/Jotai (genuinely fine — rejected only because `useSyncExternalStore` ships with React and does the identical job here). **TanStack Query** — it is a *server cache*, and there is no server; adopting it means writing query keys and invalidation rules against a synchronous object literal, which teaches the codebase nothing true. But `data/api.ts` is an async facade with real latency precisely so Query can be dropped in later without touching a screen.

**MSW is rejected** for the same shape of reason, plus one worse: it puts a service worker inside the LINE in-app webview — a real registration/scope/update failure surface — for zero benefit while there is no network code. Revisit when `api.ts` issues real requests; it is the right tool *then*.

**`localStorage`, not `sessionStorage`** *(reversed in revision 2)*. Revision 1 chose session scope so "a second person opening the same link gets clean canonical state." That benefit is already delivered by an explicit reset, and the cost is the failure that actually matters in the room: **LINE can spawn a fresh webview when the chat is reopened**, and a new webview is a new session — so the presenter who backgrounds LINE to answer a message loses the in-progress booking mid-pitch. Losing state you were mid-way through is a far worse demo failure than a second person seeing a booking the first person made. So: `localStorage`, namespaced `wc.*` (`wc.db.v1` for the store, `wc.flow.v1` for the flow). *The planned `รีเซ็ตข้อมูลสาธิต` control was not built: `resetDb()` exists and only the tests call it, so before handing the phone on, clear the site data.* Every read and write is wrapped in try/catch and falls back to memory-only, because some webviews and private modes throw on access (§15 #10).

### 4.3 Tailwind pinned to **3.4.17** — not v4

1. **The mockups contain v4-only class names that are currently silent no-ops, and those no-ops are what the approved screenshots show.** `shadow-xs` appears **56×** across 12 files, `backdrop-blur-xs` 5×, `shadow-2xs` 8×. Under v3 they render flat and unblurred. Upgrading to v4 makes them *start working*, silently changing the design everyone signed off on. We alias them explicitly (§5.1) at values matched to the screenshots, so each one is a human decision later.
2. **v4 renamed the default shadow scale by one step** — v4's `shadow-sm` ≈ v3's `shadow-xs`. The corpus uses `shadow-sm` **468×**; it is the workhorse of every card, chip and pill. Porting to v4 shifts the entire elevation language one notch lighter across every screen.
3. **v4 deletes `tailwind.config.js` in favour of CSS-first `@theme`.** `ds.md`'s reconciled JS config has never been compiled once. Rewriting it into a different syntax before its first compile is gratuitous risk on the artifact we most need to be correct.
4. **v4 requires Safari 16.4+ / Chrome 111+** for `@property` and `color-mix()`. The LINE in-app webview on older Android handsets in Thailand is exactly the population this ships to.

Revisit v4 when the real product starts, as a deliberate migration with visual diffing — never as a side effect of `npm create`.

### 4.4 Fonts — self-hosted `@fontsource` subsets

**Do not `<link>` fonts.googleapis.com.** 15 of 44 mockup files never load Noto Sans Thai at all, so Thai falls back to the system face and the "identical baseline metrics" the design system claims was never true. Self-hosting makes the font a build artifact that cannot be forgotten per-file. It also removes two DNS + TLS round trips before any Thai glyph paints, inside a webview, on a Thai mobile network — and Thai has no reliable metric-matched system fallback, so that is a visible reflow on every cold open. PDPA hygiene is a bonus: no viewer IP handed to Google.

```ts
// src/styles/fonts.ts — imported once from main.tsx
import '@fontsource-variable/noto-sans-thai/wght.css';  // variable 400–700; unicode-range subsets
import '@fontsource-variable/inter/wght.css';           // body/label + tabular figures
import '@fontsource/noto-sans/latin-400.css';           // headline/display
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/noto-sans/latin-700.css';
```

*Corrected on setup (2026-09-15): the `-variable` packages ship per-axis files (`wght.css`), not per-subset files — `thai.css` and `latin.css` do not exist. `wght.css` declares every subset behind `unicode-range`, so the browser still downloads only the Thai and Latin files a page uses.* ≈78 KB woff2 actually fetched, fingerprinted and long-cached by Vite. *No font preload shipped:* Vite fingerprints the woff2 files, so a hand-written `<link rel="preload">` in `index.html` would point at a name that changes every build. Add one through a Vite plugin if the device pass shows a Thai reflow on cold open.

### 4.5 Components and icons — shadcn 2.x on our tokens, Material Symbols from shadcn.io

#### Components: shadcn/ui from the Tailwind 3 registry (Revision 6)

*Revision 3 rejected shadcn/ui; Revision 6 tested it and adopted it from the 2.x registry. This subsection describes what shipped. The evidence for both calls is in those two revisions at the top of this file.*

| Primitive in `src/components/ui/` | Origin | Built on |
|---|---|---|
| `button` · `card` · `badge` · `input` · `label` · `radio-group` · `separator` · `skeleton` | `shadcn@2.1.8` (Tailwind 3 output), adapted: variants rewritten to our tokens, 48px minimum targets | `cva`, `tailwind-merge` v2, and `@radix-ui/react-slot` / `-label` / `-radio-group` / `-separator` where shadcn uses them |
| `modal` | Ours | `@radix-ui/react-dialog` — focus trap, focus restore, Escape, outside-click, inert siblings |
| `sheet` | Ours | Plain `div`. **Non-modal on purpose** |
| `toast` · `spinner` · `copy-button` · `empty-state` · `segmented-tabs` · `icon` | Ours | `segmented-tabs` uses `lib/use-roving-focus.ts` |

`components.json` is committed so the shadcn CLI keeps working against `tailwind.config.js` and `src/styles/index.css`. `src/lib/utils.ts` extends `tailwind-merge` with our `font-size` group (see Revision 6 for why that matters).

**Rules for everyone writing components:**

- **Add from the 2.x registry only** (`npx shadcn@2.1.8 add …`). The current registry emits Tailwind v4 classes that compile to nothing against 3.4.17, silently. After pasting, rewrite `bg-secondary`/`text-secondary-foreground` to our surface tokens — `secondary` here is the peak-price brown.
- **`tailwind-merge` stays on v2; `sonner` and `lucide-react` never enter `package.json`.** `scripts/gate.mjs` fails the build on any of the three (§11.2).
- **`Sheet` and `SelectionDrawer` are non-modal.** No focus trap, no scroll lock, never built on Dialog. The user keeps scrolling and tapping the grid while the drawer is up. shadcn's own `Sheet` *is* a Dialog, which is why `shadcn add sheet` would silently break the core interaction.
- **Radix Tabs is not used**, because it drops disabled items from arrow-key order (`focusable: !disabled`) and `DateStrip` has past days that must stay reachable. `DateStrip` and `SegmentedTabs` use the hand-written `useRovingFocus`. Radix `RadioGroup` is used on `/book/review`, where no option is ever disabled.
- **`Dialog.Portal` renders into `document.body` and escapes `.liff-column`.** `Modal`'s content wrapper carries its own `max-w-liff mx-auto`, the same rule as every other `fixed` element.
- **Escape hatch for old Android WebViews:** Radix only locks body scroll inside `Dialog.Overlay`. If that fights `overscroll-behavior` in the LINE webview, render a plain backdrop `<div>` instead of `Dialog.Overlay`. The focus trap, inert siblings and focus restore all remain.

#### Icons: Material Symbols from shadcn.io, copied in

The mockups use **Material Symbols Outlined** everywhere, and the approved screenshots show that icon family. The icons therefore come from the **Material Symbols** collection on [shadcn.io/icons](https://www.shadcn.io/icons) (15,862 icons, Apache 2.0).

**Why not lucide**, the shadcn/ui default: `lucide-react` 1.24.0 has no racket, tennis, badminton or shuttlecock glyph — the only filename matching those words is `brackets`. `sports_tennis` is the most-used icon in the in-scope mockups (15 of 180 uses) and is the icon of the `จองคอร์ท` tab. Switching family would change every signed-off screen.

**How icons get into the repo:**

1. Open the icon on shadcn.io (Material Symbols set, **Outlined** style — not Rounded or Sharp), copy the React component, and paste it into `src/components/icons/<glyph-name>.tsx`, named after the Material Symbols glyph in kebab-case (`sports-tennis.tsx`, `sports-tennis-fill.tsx`). Export it from `components/icons/index.ts`.
2. Normalise each file on paste: `fill="currentColor"`, no hard-coded `width`/`height`, spread `SVGProps<SVGSVGElement>`, `aria-hidden` by default.
3. Register it once in `components/ui/icon.tsx` (excerpt of the committed file):

```tsx
// src/components/ui/icon.tsx
import type { ComponentType, SVGProps } from 'react';
import * as I from '@/components/icons';

type Glyph = ComponentType<SVGProps<SVGSVGElement>>;

const ICONS = {
  home: { outline: I.Home },
  sports_tennis: { outline: I.SportsTennis, fill: I.SportsTennisFill },
  event_available: { outline: I.EventAvailable, fill: I.EventAvailableFill },
  // … one entry per glyph in the checklist below
} as const;

export type IconName = keyof typeof ICONS;   // a typo is a TypeScript error
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
export type IconSize = 14 | 16 | 18 | 20 | 24 | 28 | 32 | 36;

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: IconSize;
  /** Use the filled glyph when one exists (e.g. the active bottom-nav tab). */
  filled?: boolean;
  /** Give the icon an accessible name. Without it the icon is decorative. */
  label?: string;
};

export function Icon({ name, size = 24, filled = false, label, ...rest }: IconProps) {
  const entry: { outline: Glyph; fill?: Glyph } = ICONS[name];
  const Glyph = filled && entry.fill ? entry.fill : entry.outline;
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label, 'aria-hidden': false }
    : { 'aria-hidden': true };
  return <Glyph width={size} height={size} {...a11y} {...rest} />;
}
```

4. Commit the files. **No icon package is installed and nothing is fetched at runtime or in CI.**

**About the shadcn.io CLI:** its registry (`https://www.shadcn.io/r/…`) returns `401 — "Token required for all downloads"`. Copying from the website needs no account. If someone uses a personal token to speed up Day 1, the token stays on their machine and never enters the repo, CI or `.env.example`. Because the generated files are committed, nobody else ever needs it.

**Licence:** add `src/components/icons/LICENSE-material-symbols.txt` (Apache 2.0) and credit Material Symbols in `README.md`.

**The glyph checklist — 69 icons used by the nine in-scope mockups** (counted from their markup):

| Group | Icons |
|---|---|
| Shell & nav | `home` · `sports_tennis` ⬤ · `event_available` ⬤ · `sell` · `badge` · `arrow_back_ios_new` · `chevron_left` · `chevron_right` · `close` |
| Grid & dates | `calendar_month` · `calendar_today` · `event` · `schedule` · `timelapse` · `timer` · `hourglass_top` · `bolt` · `local_fire_department` · `build` · `touch_app` · `ads_click` · `wb_sunny` · `nightlight` |
| Status & feedback | `check_circle` ⬤ · `check` · `verified` · `verified_user` · `domain_verification` · `shield` · `info` · `lightbulb` · `star` ⬤ *(cut, see below)* · `stars` · `notifications_active` · `refresh` · `replay` |
| Payment & ticket | `payments` · `account_balance_wallet` · `credit_card` · `qr_code_2` · `receipt_long` · `confirmation_number` · `list_alt` · `content_copy` · `download` · `send` · `storefront` |
| Venue & amenities | `stadium` · `sports_score` · `sports_and_outdoors` · `location_on` · `map` · `near_me` · `call` · `phone` · `support_agent` · `ac_unit` · `mode_fan` · `shower` · `local_cafe` · `local_parking` · `wifi` · `handyman` · `apps` |
| People & sharing | `person` · `group` · `groups` · `chat` · `arrow_forward` |

⬤ = also needs the **filled** variant. `check_circle` and `star` are filled in the mockups. `sports_tennis` and `event_available` are filled when their nav tab is active (the mockups toggle `FILL 1` with a script).

**Can be skipped for Plan 01:** `star` — it only appears in the `4.8 (142 รีวิว)` capsule, which §2.2 cuts. `sell` and `badge` belong to the two nav tabs that are declared but hidden (D61′); copy them anyway, so enabling a tab later stays a one-boolean change.

**Done on Day 1.** Every glyph in the checklist exists in the shadcn.io set and is committed, along with the four filled variants, as plain inline SVG with no runtime import. `components/ui/icon.test.ts` checks that all 69 glyphs are registered and that filled variants exist exactly where the UI uses them.

### 4.6 `package.json`

```json
{
  "name": "winner-court-liff",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=20.11"
  },
  "packageManager": "pnpm@10.9.0",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host",
    "test": "vitest run",
    "lint": "eslint src --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "gate": "node scripts/gate.mjs",
    "check": "pnpm gate && pnpm typecheck && pnpm lint && pnpm test && pnpm build"
  },
  "dependencies": {
    "@fontsource-variable/inter": "5.3.0",
    "@fontsource-variable/noto-sans-thai": "5.3.0",
    "@fontsource/noto-sans": "5.3.0",
    "@radix-ui/react-dialog": "1.1.23",
    "@radix-ui/react-label": "2.1.7",
    "@radix-ui/react-radio-group": "1.3.8",
    "@radix-ui/react-separator": "1.1.7",
    "@radix-ui/react-slot": "1.3.3",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-router-dom": "6.30.6",
    "tailwind-merge": "2.6.0"
  },
  "devDependencies": {
    "@eslint/js": "9.39.5",
    "@testing-library/dom": "10.4.2",
    "@testing-library/jest-dom": "6.9.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.1",
    "@types/node": "22.20.3",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@vitejs/plugin-react": "4.7.0",
    "autoprefixer": "10.6.1",
    "eslint": "9.39.5",
    "eslint-plugin-react-hooks": "5.2.0",
    "globals": "15.15.0",
    "jsdom": "25.0.1",
    "postcss": "8.5.28",
    "tailwindcss": "3.4.17",
    "typescript": "5.7.3",
    "typescript-eslint": "8.70.0",
    "vite": "6.4.3",
    "vitest": "4.1.11"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild"
    ]
  }
}
```

This is `apps/liff/package.json` as committed. Every version is exact, and `tailwindcss` must stay exact — never put a `^` on it.

**Package manager: pnpm** (2026-09-18, owner's decision). `packageManager: pnpm@10.9.0` is pinned, `pnpm-lock.yaml` is committed, and there is no `package-lock.json` — one lockfile, or two machines drift. `esbuild` is listed under `pnpm.onlyBuiltDependencies` because pnpm 10 blocks install scripts by default. Every command in this document is `pnpm x`; `pnpm check` runs gate → typecheck → lint → test → build.

How it got here from the block this section first proposed:

- **Vitest 4.1.11**, not 2.x: 2.x/3.x carry advisory GHSA-82fw-gwwq-j7x9, and 4.x is the first to support Vite 6 without a second Vite copy.
- **ESLint 9 + typescript-eslint + react-hooks** added, because the `lint` script had no linter. **`@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event` and `jsdom`** added for the component tests.
- **`class-variance-authority`, `clsx`, `tailwind-merge` v2 and four more Radix packages** (`label`, `radio-group`, `separator`, alongside `dialog` and `slot`) arrived with shadcn in Revision 6 (§4.5).
- `build` is `tsc --noEmit && vite build`, and `check` chains every gate.

**Fourteen runtime dependencies**, none of them an icon package — icons are committed source files (§4.5).

**Open item:** React Router 6 carries two moderate advisories (open redirect via backslash in `<Link>`/`useNavigate`; SSR `deserializeErrors`) that are fixed only in v7. Neither is reachable in this demo — no navigation target comes from user input and there is no SSR — so v6 stays for Plan 01; the router already opts in to every v7 future flag, and the upgrade belongs to Plan 03.

### 4.7 File tree

The tree as built. `apps/liff/README.md` carries the same `src/` tree and `testing/readme-tree.test.ts` fails when the two disagree, so the README is the copy to trust if this one drifts. The folder rules and their reasons are `apps/liff/DESIGN.md` §6.

```
booking/                          ← ONE repository (decision 10): documents and code together
├─ README.md                     entry point and reading order
├─ documents/                    PRD · stitch mockups · audit · plans — read-only reference
└─ apps/liff/                    ← Plan 01 is built here (the path ADR-001 §4.3 expects)
   ├─ index.html                  lang="th", zoomable viewport meta, favicons from public/brand/
   ├─ package.json                exact pins (§4.6)
   ├─ pnpm-lock.yaml
   ├─ tailwind.config.js          THE token package (§5.1) — most important file in the repo
   ├─ postcss.config.js
   ├─ components.json             shadcn CLI config (§4.5)
   ├─ eslint.config.js
   ├─ vite.config.ts              react plugin, base:'./' for portable static hosting, @ → src, vitest config
   ├─ tsconfig.json               strict, noUncheckedIndexedAccess, @/* path alias
   ├─ .nvmrc                      22
   ├─ README.md                   how to run · the src/ tree · "where does X go"
   ├─ DESIGN.md                   tokens, components, §6 folder rules
   │
   ├─ scripts/
   │  └─ gate.mjs                 the defect gates (§11.2) — pure Node, ~1s, first step of `pnpm check`
   │
   ├─ public/
   │  ├─ brand/                   favicon-32 · favicon-180 · icon-512 · logo-mark (PNG)
   │  ├─ mascot/                  capybara-idle · -cheer · -sleep · -avatar (.webp, generated artwork)
   │  └─ venue/                   court-1 · court-2 · court-3 (.webp, AI-generated sample photos)
   │
   └─ src/
      ├─ main.tsx
      ├─ app/                     the wiring
      │  ├─ routes.tsx            THE route table — the only list of URLs (data, so tests can read it)
      │  ├─ router.tsx            createHashRouter over ROUTES, every v7 future flag on
      │  ├─ pages/
      │  │  ├─ catalog/           /__catalog — every primitive in every state
      │  │  └─ not-found/         *
      │  ├─ providers/
      │  │  ├─ app-providers.tsx
      │  │  └─ booking-flow-provider.tsx   useReducer for selection · contact phone · method
      │  ├─ booking-flow.test.tsx  the whole flow through the real route table
      │  └─ a11y.test.tsx
      │
      ├─ features/                package by feature; a feature never imports another feature
      │  ├─ features.test.ts      enforces the import rules and the route ↔ folder binding
      │  ├─ booking/
      │  │  ├─ selection.ts       ← THE STATE MACHINE (§8). Pure function, no React.
      │  │  ├─ selection.test.ts
      │  │  ├─ components/
      │  │  │  └─ price-breakdown.tsx      shared by more than one booking page
      │  │  └─ pages/             a page = a folder = one line in app/routes.tsx
      │  │     ├─ booking-grid/   /book
      │  │     │  ├─ index.tsx
      │  │     │  ├─ booking-grid.test.tsx
      │  │     │  ├─ hooks/use-slot-selection.ts   React state + toasts around selection.ts
      │  │     │  └─ components/  court-matrix · slot-cell · date-strip · legend-bar · selection-drawer
      │  │     ├─ booking-review/ /book/review
      │  │     ├─ booking-success/ /book/success/:ref
      │  │     └─ my-bookings/    /bookings
      │  │        └─ components/  booking-card
      │  └─ venue/
      │     └─ pages/court-profile/   /
      │        └─ components/     photo-carousel · rate-card · amenity-grid
      │
      ├─ components/              shared by the whole app
      │  ├─ icons/                one file per Material Symbols glyph (§4.5) + index.ts + LICENSE
      │  └─ ui/                   badge · button · card · input · label · radio-group · separator ·
      │                           skeleton (shadcn, adapted) · modal · sheet (non-modal) · toast ·
      │                           spinner · copy-button · empty-state · segmented-tabs · icon
      │
      ├─ data/                    ← the contract. Survives to Plan 02.
      │  ├─ types.ts              all domain types = the future API DTOs (§6.1)
      │  ├─ fixtures.ts           venue · 6 courts · 3 rate rules · user · blocks · 3 bookings (§6.3)
      │  ├─ rates.ts              ruleFor / priceForHour / quote — rates are DATA (§6.4)
      │  ├─ availability.ts       buildGrid() and the slot counts
      │  ├─ booking-ref.ts        WC-YYMM-NNNN sequence (§6.5)
      │  ├─ db.ts                 module store + useSyncExternalStore + localStorage (`wc.db.v1`)
      │  └─ api.ts                async facade with deliberate latency — THE seam (§6.6)
      │
      ├─ layouts/                 app chrome
      │  ├─ app-layout.tsx        <Outlet> + header + bottom nav + .liff-column
      │  ├─ app-header.tsx
      │  ├─ bottom-nav.tsx
      │  └─ nav-config.ts         THE nav source of truth (D59) — 4 declared, 2 enabled
      │
      ├─ lib/                     no domain knowledge
      │  ├─ utils.ts              cn() = clsx + tailwind-merge extended with our type scale
      │  ├─ clock.ts              now() · today() · defaultDemoDate() · advance()
      │  ├─ thai-date.ts          BE year, Thai weekday/month
      │  ├─ money.ts              thb(satang(44_000)) → "฿440" · payAmount(…) → "440.00"
      │  ├─ asset.ts              public/ paths that survive base:'./'
      │  └─ use-roving-focus.ts   1-D roving tabindex that keeps disabled items reachable (§4.5)
      │
      ├─ styles/
      │  ├─ index.css             @tailwind + global focus-visible + tabular figures (§5.2)
      │  └─ fonts.ts              @fontsource imports (§4.4)
      │
      └─ testing/                 helpers for tests, not shipped
         ├─ render-app.tsx
         └─ readme-tree.test.ts   fails when apps/liff/README.md's tree and src/ disagree
```

**What the planned tree had that was never built.** Revision 5 cut `platform/` (`liff.ts`, `mockLiff.ts`), `demo/` (`DemoBar`, `FixtureBadge`), `Payment.tsx`, `HoldExpired.tsx`, `PaymentMethodCard`, `BookingTicket`, `AvailabilityBanner`, `StepHeader`, `OutsideLineNotice` and `useCountdown.ts`; `cn.ts` became shadcn's `lib/utils.ts`; `DECISIONS.md` was not written (§3 and the Appendix are the record). What was built moved from `screens/` + `components/booking/` to package-by-feature, and every file under `src/` is kebab-case.
**71 source and test files plus 73 icon files (the outlined glyphs and their filled variants), all under `apps/liff/`. One `src/`.** There is **no workspace yet**: run every `pnpm` command inside `apps/liff/`, and point the static host's root directory at it. Plan 03 adds `pnpm-workspace.yaml` at `booking/` and `apps/api/` beside this folder — no file moves, and no history import. `critique.md` #12 is right: seven workspace packages for one SPA is ceremony for a team of two.

---

## 5. Design tokens

Adapted from `ds.md` §6 with six corrections, each flagged inline.

> **The blocks in §5.1 and §5.2 are the committed files**, copied in on 2026-10-06. Compared with what this section first proposed, they add three things: the NEW-7 Thai line-height floor (`body-md` 22px, `body-sm` 18px, `label-lg` 22px, `label-md` 18px, `label-sm` 17px); the shadcn compatibility names from Revision 6 (`foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `*-foreground`), each pointing at an existing M3 colour; and revision 2's removal of the `:root` palette mirror, so `index.css` reads colours through `theme()` and holds no hex. If a block and its file disagree, the file is right.

### 5.1 `tailwind.config.js`

```js
// tailwind.config.js — Winner Court design system, booking-demo cut.
// Derived from the 38 byte-identical generated configs (ds.md §1.1), plus the two
// tokens the product cannot function without, plus explicit aliases for the v4-only
// class names the mockups ship, so the port renders what the screenshots show.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // darkMode intentionally omitted. 38 files declared darkMode:'class' and authored
  // ZERO dark: variants. Dead config — do not resurrect until dark is designed (D55).
  theme: {
    extend: {
      colors: {
        /* ---- shadcn compatibility layer ----
           shadcn's components are written against these names. Ours stay authoritative
           (the 38 generated mockup configs use the M3 set), so this layer only ADDS the
           names shadcn needs and points them at our palette. Two notes:
             · `primary` and `secondary` already exist here and keep OUR meaning. A copied
               component that says `bg-secondary` therefore renders our dark brown, which
               is wrong for a muted button — those two class names are rewritten to our
               surface tokens when a component is pasted in (see src/components/ui).
             · No `*-foreground` name collides with anything, so they are plain aliases. */
        'primary-foreground': '#ffffff',       // = on-primary
        background: '#fbf9f5',                 // = surface
        foreground: '#1b1c1a',                 // = on-surface
        card: '#ffffff',                       // = surface-container-lowest
        'card-foreground': '#1b1c1a',
        popover: '#ffffff',
        'popover-foreground': '#1b1c1a',
        muted: '#efeeea',                      // = surface-container
        'muted-foreground': '#44474d',         // = on-surface-variant
        accent: '#eae8e4',                     // = surface-container-high (hover surface)
        'accent-foreground': '#1b1c1a',
        destructive: '#ba1a1a',                // = error
        'destructive-foreground': '#ffffff',
        input: '#c5c6cd',                      // = outline-variant
        ring: '#fdbd77',                       // = secondary-container, the focus ring

        /* ---- PRIMARY / NAVY ---- */
        primary: '#07182e',                 // headings, primary CTA fill (near-black)
        'on-primary': '#ffffff',
        'primary-container': '#1d2d44',     // THE brand navy: hero cards, selected slots
        'on-primary-container': '#8595b0',
        'primary-fixed': '#d5e3ff',
        'primary-fixed-dim': '#b7c7e5',
        'on-primary-fixed': '#0b1c32',
        'on-primary-fixed-variant': '#384760',

        /* ---- SECONDARY / HONEY-OAT ---- */
        secondary: '#835418',               // peak prices, accent icons (reads dark brown)
        'on-secondary': '#ffffff',
        'secondary-container': '#fdbd77',   // the visible "honey": peak pills, hold banner
        'on-secondary-container': '#784a0d',
        'secondary-fixed': '#ffdcbb',
        'secondary-fixed-dim': '#faba75',
        'on-secondary-fixed': '#2b1700',
        'on-secondary-fixed-variant': '#673d00',

        /* ---- TERTIARY / DEEP OLIVE ----
           WARNING: `tertiary` is near-BLACK (#131a00). Never use it as a success fill.
           That is why "ชำระแล้ว" badges render black in the mockups. Use `success`. */
        tertiary: '#131a00',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#263003',
        'on-tertiary-container': '#8c9960', // 3.07:1 on white — ≥18px ONLY
        'tertiary-fixed': '#dbe9a9',        // availability chips
        'tertiary-fixed-dim': '#bfcd8f',
        'on-tertiary-fixed': '#171e00',
        'on-tertiary-fixed-variant': '#404b1b',

        /* ---- SUCCESS (NEW) ----
           Formalises #606C38: 153 raw occurrences across 26 files, no token.
           Does all "available / confirmed / paid / open" work. 5.68:1 on white. */
        success: '#606c38',
        'on-success': '#ffffff',
        'success-container': '#dbe9a9',
        'on-success-container': '#2f3a12',

        /* ---- ERROR ---- */
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        /* ---- SURFACES ---- */
        surface: '#fbf9f5',
        background: '#fbf9f5',
        'surface-dim': '#dbdad6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3ef',
        'surface-container': '#efeeea',
        'surface-container-high': '#eae8e4',
        'surface-container-highest': '#e4e2de',
        'surface-variant': '#e4e2de',
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#44474d',
        outline: '#75777e',                 // 4.47:1 — borders / ≥18px text only
        'outline-variant': '#c5c6cd',
        border: '#c5c6cd',                     // shadcn's `border-border`
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f0ed',

        /* ---- LINE BRAND (NEW) — 36 raw occurrences across 21 files.
           CORRECTION 1 vs ds.md: white on #06C755 is 2.26:1 and FAILS AA.
           Button hard-codes text-primary-container on bg-line (7.89:1).
           `line-a11y` exists only for cases that must keep white text. */
        line: { DEFAULT: '#06c755', hover: '#05b34c', a11y: '#04803a' },
      },

      /* ---- RADII ---- the shipped compressed scale (D54).
         NOTE rounded-lg is 8px here, NOT the 16px DESIGN.md prose claims.
         2xl/3xl left at Tailwind defaults, as shipped. */
      borderRadius: {
        DEFAULT: '0.25rem', // 4px
        lg: '0.5rem',       // 8px — slot chips, icon tiles, inner blocks
        xl: '0.75rem',      // 12px — CARDS, CTAs, inputs (the workhorse)
        full: '9999px',
      },

      spacing: {
        'space-2xs': '0.25rem', 'space-xs': '0.5rem', 'space-sm': '0.75rem',
        'space-md': '1rem',     'space-lg': '1.5rem', 'space-xl': '2rem',
        'space-2xl': '3rem',    'space-3xl': '4rem',
        'gutter-mobile': '1rem',
        // CORRECTION 2: `margin-mobile` deliberately dropped. It was 1rem, identical
        // to gutter-mobile, and the two were used interchangeably in ~50 places.
        // One name. If you see px-margin-mobile in ported markup, change it.
      },

      /* ---- TYPOGRAPHY ---- house convention: family and size are SEPARATE scales
         sharing a key, so every element carries both:
             class="font-headline-sm text-headline-sm"
         Noto Sans Thai is chained into EVERY stack — 15 files omitted it entirely. */
      fontFamily: {
        'display-lg':  ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-lg': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-md': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-sm': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-lg':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-md':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-sm':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-lg':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-md':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-sm':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        sans:          ['Noto Sans Thai Variable', 'Noto Sans', 'sans-serif'],
      },
      // NEW-7 Thai line-height floor: every size <= 16px has line-height >= 1.5, because
      // Thai stacks vowels + tone marks above the x-height and descends below it.
      fontSize: {
        'display-lg':        ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg':       ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md':       ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm':       ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg':           ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md':           ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':           ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg':          ['14px', { lineHeight: '22px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md':          ['12px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm':          ['11px', { lineHeight: '17px', letterSpacing: '0.03em', fontWeight: '500' }],
      },

      /* ---- ELEVATION ---- DESIGN.md's three specified levels appear ZERO times in
         code. These are what the product actually ships, plus (CORRECTION 3) explicit
         aliases for the v4-only names so ported markup matches the screenshots. */
      boxShadow: {
        'xs':  '0 1px 2px rgba(29,45,68,0.06)',            // v4 name → 56 silent no-ops
        '2xs': '0 1px 1px rgba(29,45,68,0.04)',            // v4 name → 8 silent no-ops
        'app-header': '0 1px 8px rgba(0,0,0,0.04)',        // 28 uses — de-facto token
        'app-nav':    '0 -2px 12px rgba(29,45,68,0.06)',   // 25 uses — de-facto token
        'card':        '0 2px 12px rgba(29,45,68,0.04)',
        'card-raised': '0 4px 20px -4px rgba(29,45,68,0.07)',
        'sheet':       '0 12px 36px rgba(29,45,68,0.18)',
        'sticky-bar':  '0 -4px 20px rgba(29,45,68,0.08)',
      },
      backdropBlur: { xs: '2px' },   // v4 name → 5 silent no-ops

      // CORRECTION 4: scale-98 is used 4× and is not on Tailwind's scale.
      // Add it rather than lose the press feedback.
      scale: { '98': '.98' },

      minHeight: { touch: '48px' },
      minWidth:  { touch: '44px' },
      maxWidth:  { liff: '430px' },  // clamp the column; most mockups forgot this
      height:    { 'app-bar': '4rem', 'app-nav': '4rem' },
      zIndex:    { header: '50', nav: '50', drawer: '40', 'grid-head': '20' },
    },
  },

  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        // Applied in 6 files, DEFINED IN 1. Worked only by accident, via a global
        // ::-webkit-scrollbar rule. Define it properly.
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top, 0px)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
        // Several mockup sticky bars sit at bare `bottom-16` over an h-16 nav with no
        // pb-safe, and collide on notched devices. Always use this instead.
        '.bottom-nav-safe': { bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' },

        /* ---- SLOT PATTERNS — settles D53 ----
           CORRECTION 5 vs ds.md: `_1` renders booked=RED / maintenance=grey and `2.`
           renders exactly the inverse. Canon: BOOKED = neutral grey + 45° hatch (a
           normal, expected, non-alarming state); MAINTENANCE = error-container + dot
           grid (an exception the venue must fix). ds.md's draft had maintenance grey.
           The PATTERN, not the colour, carries the meaning — this is the non-colour-only
           encoding the design system advertises and production dropped. */
        '.pattern-booked': {
          backgroundColor: theme('colors.surface-container-high'),
          backgroundImage:
            'repeating-linear-gradient(45deg,#d6d3cd 0,#d6d3cd 1.5px,transparent 1.5px,transparent 7px)',
        },
        '.pattern-maintenance': {
          backgroundColor: theme('colors.error-container'),
          backgroundImage: 'radial-gradient(rgba(147,0,10,.32) 1.2px, transparent 1.2px)',
          backgroundSize: '7px 7px',
        },
        // The legend swatches must show the same encoding at 16px.
        '.swatch-booked': {
          backgroundColor: theme('colors.surface-container-high'),
          backgroundImage:
            'repeating-linear-gradient(45deg,#c9c5bd 0,#c9c5bd 1.5px,transparent 1.5px,transparent 5px)',
        },
        '.swatch-maintenance': {
          backgroundColor: theme('colors.error-container'),
          backgroundImage: 'radial-gradient(rgba(147,0,10,.4) 1px, transparent 1px)',
          backgroundSize: '5px 5px',
        },
      });

      addComponents({
        // DESIGN.md: "Focus ring: 2px Honey Oat with 2px offset."
        // Implemented in 0 of 48 files. The global default lives in index.css;
        // this class is the opt-in for elements needing a different offset.
        '.focus-ring': {
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.secondary-container')}`,
            outlineOffset: '2px',
          },
        },
      });
    },
  ],
};
```

> **CORRECTION 6 (not code).** Tailwind 3.4 already ships `tabular-nums`; `ds.md`'s proposed `.font-num` utility is unnecessary. The real gap is that `tabular-nums` appears **1 time in 48 files** while every price column, time axis and countdown needs it. Handled structurally in `index.css` below so nobody has to remember.
>
> Also: do **not** add a `0.2` spacing step to make `py-0.2` work (47 occurrences, 24 files). It was always a typo. Search-and-replace `py-0.2` → `py-0.5` during the port, and gate it in CI (§11.2).

### 5.2 `src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Colours come from tailwind.config.js via theme() — no hex values live here.
   (Revision 2 cut the :root palette mirror: it had no consumer.) */

@layer base {
  :root {
    color-scheme: light;
    --wc-liff-max-w: theme('maxWidth.liff');
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: theme('colors.surface');
    color: theme('colors.on-surface');
    font-family: theme('fontFamily.sans');
    overscroll-behavior-y: none;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
  }

  /* iOS Safari zooms the page on focus when an input is under 16px and never zooms back
     — the side effect of allowing pinch-zoom again (Plan 01 revision 2). */
  input, select, textarea { font-size: 16px; }

  /* Tabular figures for prices, times and countdowns, structurally. */
  time, [data-numeric], .price, .total, .countdown, .booking-ref, .slot-time {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum' 1;
  }

  /* THE focus ring (0 occurrences of focus-visible across the 48 mockups).
     :where() keeps specificity at 0 so any component can override it. */
  :where(a, button, input, select, textarea, summary, [tabindex]:not([tabindex='-1'])):focus-visible {
    outline: 2px solid theme('colors.secondary-container');
    outline-offset: 2px;
    border-radius: theme('borderRadius.DEFAULT');
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  /* The LIFF column clamp. Every `fixed` element needs its own inner clamp as well,
     because `fixed` positions against the viewport, not this column. */
  .liff-column { width: 100%; max-width: var(--wc-liff-max-w); margin-inline: auto; }
}
```

---

## 6. Fixture data

Every rendered datum in §9 binds to a field below. This is the load-bearing half of the plan: `types.ts` is the API contract Plan 02 implements.

### 6.1 `src/data/types.ts`

```ts
/** ISO date, no time, venue-local. e.g. '2026-09-11' */
export type ISODate = string & { readonly __iso: unique symbol };
/** Minutes from midnight, venue-local. 09:00 → 540. */
export type Minutes = number;
export type CourtId = string;
/** Money is integer SATANG (1 baht = 100 satang), never a float baht (ADR-001 §4.4).
    The brand makes `satang(440.5)` impossible to construct silently: it throws.
    ฿440 is `satang(44_000)`. Render only through lib/money.ts. */
export type Satang = number & { readonly __satang: unique symbol };
export const satang = (n: number): Satang => {
  if (!Number.isInteger(n)) throw new Error(`satang must be an integer: ${n}`);
  return n as Satang;
};

export type CourtSurface = 'rubber' | 'rubber_bwf' | 'parquet';
export type CourtClimate = 'air' | 'fan';

export interface Venue {
  id: string;
  name: string;                 // 'วินเนอร์ คอร์ท'
  nameEn: string;               // 'Winner Court'
  displayName: string;          // 'วินเนอร์ คอร์ท (Winner Court)'
  legalName: string;            // sample: 'บริษัท ตัวอย่าง จำกัด (ข้อมูลสาธิต)'
  taxId: string;
  addressTh: string;
  phone: string;                // digits only — the ONE venue number (D07)
  phoneDisplay: string;         // sample: '02-000-0000'
  mapsUrl: string;
  lineOaUrl: string;
  /** IANA zone every ISODate and Minutes on this venue is expressed in.
      'Asia/Bangkok' here. Its absence is what let a runtime-local date bug into
      clock.ts (§6.2); a venue's calendar is never the runtime's calendar. */
  timezone: string;
  /** Rendered in the app header. Derived once here so no screen re-types it. */
  openHoursLabel: string;       // 'เปิดบริการ 09:00 - 22:00'
  openMinutes: Minutes;         // 540  = 09:00   (D02)
  closeMinutes: Minutes;        // 1320 = 22:00
  // Policy, not identity: `number`, never a literal type. A second venue on 90-minute
  // blocks or a 7-day window must be typeable without editing this file — types.ts
  // merges into Plan 02 unedited (§1).
  slotMinutes: number;          // 60
  minBookingHours: number;      // 1  (D21)
  maxBookingHours: number;      // 3
  bookingDaysAhead: number;     // 14
  holdMinutes: number;          // 15 (D15, ADR-001 §3.3)
  cancellationHours: number;    // 3  (D16)
  photos: { src: string; alt: string }[];
  amenities: Amenity[];
}

export interface Amenity { icon: string; title: string; detail: string }

export interface Court {
  id: CourtId;
  venueId: string;
  number: number;               // 1..6 (D01)
  name: string;                 // 'คอร์ท 3'
  surface: CourtSurface;
  climate: CourtClimate;
  gridSubtitle: string;         // 'ยาง BWF / แอร์'   — the 2-line matrix header
  longLabel: string;            // 'คอร์ท 3 (พื้นยางเกรด BWF)' — review + ticket
  isPopular: boolean;
}

/** Rates are DATA, not constants (D05). Highest priority wins on overlap. */
export interface RateRule {
  id: string;
  venueId: string;
  label: string;                // 'ช่วงพีคเย็น (จ.–ศ.)'
  /** Bitmask. Sun=1 Mon=2 Tue=4 Wed=8 Thu=16 Fri=32 Sat=64. */
  dayMask: number;
  startMinutes: Minutes;
  endMinutes: Minutes;
  pricePerHour: Satang;
  isPeak: boolean;
  priority: number;
}

export type BlockKind = 'booked' | 'maintenance' | 'held';

/** One reason a court-hour is unavailable. The backend returns exactly this shape. */
export interface AvailabilityBlock {
  id: string;
  venueId: string;              // every table carries venue_id from migration 1 (ADR-001, D66)
  courtId: CourtId;
  date: ISODate;
  startMinutes: Minutes;
  endMinutes: Minutes;
  kind: BlockKind;
  expiresAt?: number;           // set for kind==='held' — epoch ms
  bookingId?: string;
  note?: string;                // 'ซ่อมบำรุงพื้นสนาม'
}

export type SlotStatus =
  | 'available' | 'booked' | 'maintenance' | 'past' | 'closed';

export interface Slot {
  courtId: CourtId;
  startMinutes: Minutes;
  status: SlotStatus;
  price: Satang;
  isPeak: boolean;
}

/** THE selection type — declared here, once. §8.1 imports it and never redeclares it.
    Units are WHOLE HOURS (`endHour` EXCLUSIVE): the grid's only unit is an hour, so
    minutes cannot enter a selection and disagree with it. `courtIds` is an array
    (NEW-6) — Plan 01's grid writes exactly one entry, the contract already carries
    เหมาคอร์ท. Contiguity and the single run are guaranteed by the shape, not by a
    rule (§8.1): there is no field in which to put a hole. */
export type Selection =
  | { kind: 'none' }
  | {
      kind: 'range';
      date: ISODate;
      courtIds: CourtId[];      // length 1 in Plan 01's UI; the type allows more
      startHour: number;        // 9..21
      endHour: number;          // EXCLUSIVE
    };

/** The narrowed branch, for anything that cannot accept an empty selection. */
export type SelectionRange = Extract<Selection, { kind: 'range' }>;

export interface QuoteLine {
  rateRuleId: string;
  label: string;                // 'ค่าคอร์ทช่วงพีค (฿220 × 2 ชม.)'
  hours: number;
  unitPrice: Satang;
  amount: Satang;
  isPeak: boolean;
  tag?: string;                 // 'ฟรีช่วงเปิดตัว'
}

export type RateMix = 'standard' | 'peak' | 'mixed';

export interface Quote {
  lines: QuoteLine[];
  total: Satang;
  /** Opaque. In Plan 04 the server signs it so `POST /holds` can reject a total the
      client computed or edited. In Plan 01 it is an unsigned echo of the inputs —
      present so the shape, and every call site that forwards it, already exists. */
  quoteToken: string;
  hours: number;
  rateMix: RateMix;
  currency: 'THB';
}

export type PaymentMethodId = 'promptpay' | 'counter';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid';
export type BookingStatus =
  | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  ref: string;                  // 'WC-2609-0042' (D09)
  venueId: string;
  courtIds: CourtId[];      // array for the same reason Selection is (§3 NEW-6)
  userId: string;
  date: ISODate;
  startMinutes: Minutes;
  endMinutes: Minutes;
  status: BookingStatus;
  lines: QuoteLine[];           // the SAME array the drawer and the review render
  total: Satang;
  paymentMethod: PaymentMethodId | null;
  paymentStatus: PaymentStatus;
  paidAt: number | null;
  contactPhone: string;
  headcountHint: string;        // 'ก๊วน 4-6 คน'
  createdAt: number;
  holdExpiresAt: number | null;
}

export interface User {
  id: string;
  lineUserId: string;
  displayName: string;          // 'คุณต้น'
  fullName: string;             // 'คุณต้น (Ton Jiraphat)'
  lineId: string;               // '@ton_badminton'
  pictureUrl: string;
  phone: string;                // the USER's number — deliberately NOT the venue's
}
```

`Booking.lines` is the point of the whole type file: one `quote()` produces the `QuoteLine[]` that the drawer renders, the review breakdown renders, and `api.confirmBooking` stores on the booking. As built, each of the three calls `quote()` itself with the same inputs, so the arrays are identical by construction; in Plan 04 the server computes it once and the client renders what it returns.

The one field `types.ts` gained after approval is `Venue.openHoursLabel`, so the header stops re-typing the opening hours.

### 6.2 `src/lib/clock.ts` — real clock, demo-safe

```ts
import type { ISODate } from '@/data/types';

/** Bangkok is a fixed +07:00 with no DST, so this arithmetic is exact. */
const TZ_OFFSET_MS = 7 * 3_600_000;

let offsetMs = 0;                            // DemoBar fast-forward only
export const now = (): number => Date.now() + offsetMs;
export const advance = (ms: number) => { offsetMs += ms; };

export function toISODate(d: Date): ISODate {
  return new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10) as ISODate;
}
export const today = (): ISODate => toISODate(new Date(now()));

// Both work on a shifted-UTC instant, exactly like toISODate above, and read only
// UTC components. A venue-local calendar date must never be routed through the
// runtime's own zone: on a UTC CI runner `.setDate()`/`.getDay()` would shift the
// day by one and silently mis-price the weekend peak.
export function addDays(iso: ISODate, n: number): ISODate {
  const d = new Date(`${iso}T00:00:00Z`);                   // venue-local midnight, read as UTC
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10) as ISODate;
}
export const dayOfWeek = (iso: ISODate): number =>          // 0 = Sunday
  new Date(`${iso}T00:00:00Z`).getUTCDay();

export const currentHour = (): number =>
  new Date(now() + TZ_OFFSET_MS).getUTCHours();

/**
 * The date the grid opens on. Real clock — but if it is already past 18:00 locally,
 * open on tomorrow so the canonical 19:00–21:00 story is never in the past.
 * This is the ONLY piece of demo-clock scaffolding in the app. It is deleted the
 * moment there is real availability data.
 */
export function defaultDemoDate(): ISODate {
  return currentHour() >= 18 ? addDays(today(), 1) : today();
}
```

> **Why not freeze the date.** Freezing to 24 พ.ค. 2567 keeps the numbers stable but shows a venue owner a date from the past, which reads as a stale prototype. It is unnecessary here: 19:00–21:00 is peak **every day of the week** (weekends are peak all day), so ฿440 reproduces on any date. The only thing the weekday changes is daytime pricing — and demonstrating that Saturday morning costs ฿220 instead of ฿180 is a feature of the pitch, not a bug (§12 step 11).

### 6.3 `src/data/fixtures.ts`

```ts
import type {
  Amenity, AvailabilityBlock, Booking, Court, ISODate, QuoteLine, RateRule, User, Venue,
} from './types';
import { satang } from './types';
import { addDays, defaultDemoDate, now } from '@/lib/clock';

/* ── Day offsets. Everything is relative; nothing is a calendar literal. ────── */
export const BASE: ISODate = defaultDemoDate();
export const D = {
  canonical: BASE,                 // the bookable day — คอร์ท 3 @ 19:00 is FREE here
  next:      addDays(BASE, 1),
  busy:      addDays(BASE, 2),
  soldOut:   addDays(BASE, 3),     // drives `_2`
  alternate: addDays(BASE, 4),     // the day `_2` recommends
} as const;

/* RECONCILIATION: `_2` renders the same Friday as fully booked that `2.` books
   คอร์ท 3 at 19:00–21:00 on. Both cannot be true. The canonical spine wins: the
   default day stays bookable, and BASE+3 is the sold-out day. */

/* ── Venue ─────────────────────────────────────────────────────────────────── */
const AMENITIES: Amenity[] = [
  { icon: 'local_parking', title: 'ที่จอดรถ 30 คัน',   detail: 'จอดฟรีในร่ม' },
  { icon: 'ac_unit',       title: 'แอร์ & พัดลมยักษ์', detail: 'ระบายอากาศดี' },
  { icon: 'shower',        title: 'ห้องอาบน้ำสะอาด',   detail: 'พร้อมเครื่องทำน้ำอุ่น' },
  { icon: 'storefront',    title: 'เครื่องดื่ม & ช็อป', detail: 'ลูกแบด & อุปกรณ์' },
  { icon: 'build',         title: 'บริการขึ้นเอ็น',     detail: 'ช่างมาตรฐาน' },
  { icon: 'wifi',          title: 'ฟรี Wi-Fi แรงสูง',   detail: 'มีจุดชาร์จมือถือ' },
];

export const VENUE: Venue = {
  id: 'v_winner',
  name: 'วินเนอร์ คอร์ท',
  nameEn: 'Winner Court',
  displayName: 'วินเนอร์ คอร์ท (Winner Court)',
  // Decision 9: SAMPLE identity. None of these may match a real company, phone line or
  // LINE account — this demo is shown to real venue owners on their own phones, where
  // a `tel:` link dials and a LINE link opens. Replace per venue in Plan 02/03.
  legalName: 'บริษัท ตัวอย่าง จำกัด (ข้อมูลสาธิต)',
  taxId: '0000000000000',
  addressTh: 'ซอยรามคำแหง 24 แยก 14 แขวงหัวหมาก บางกะปิ กรุงเทพฯ 10240',
  // D07: the mockups ship THREE numbers (021234567 / 0812345678 / 081-234-5678)
  // and reuse one of them as the USER's emergency-contact field. One venue number.
  phone: '020000000',
  phoneDisplay: '02-000-0000',
  mapsUrl: 'https://maps.google.com/?q=Winner+Court+Badminton+Ramkhamhaeng',
  lineOaUrl: '',                 // no real OA in the demo; nothing links to it
  timezone: 'Asia/Bangkok',
  openHoursLabel: 'เปิดบริการ 09:00 - 22:00',
  openMinutes: 9 * 60,
  closeMinutes: 22 * 60,
  slotMinutes: 60,
  minBookingHours: 1,
  maxBookingHours: 3,
  bookingDaysAhead: 14,
  holdMinutes: 15,
  cancellationHours: 3,
  photos: [
    { src: '/venue/court-1.webp', alt: 'ภายในสนามวินเนอร์ คอร์ท มองเห็นคอร์ทแบดมินตัน 6 คอร์ทเรียงกัน' },
    { src: '/venue/court-2.webp', alt: 'โซนพักผ่อนและร้านขายอุปกรณ์แบดมินตันของวินเนอร์ คอร์ท' },
    { src: '/venue/court-3.webp', alt: 'คอร์ทพื้นยางเกรด BWF พร้อมไฟส่องสว่างและเครื่องปรับอากาศ' },
  ],
  amenities: AMENITIES,
};

/* ── Courts — D06 resolution (§3.5 #8). Marked `assumed` until the venue confirms.
   `_1`'s ยางเขียว / ยางน้ำเงิน scheme appears in one file and contradicts every
   other; dropped. The AC-vs-fan split is the distinction customers actually choose
   on, and it makes the matrix header carry information instead of repeating itself. */
export const COURTS: Court[] = [
  { id: 'c1', venueId: 'v_winner', number: 1, name: 'คอร์ท 1', surface: 'rubber',
    climate: 'air', gridSubtitle: 'ยาง / แอร์',      longLabel: 'คอร์ท 1 (พื้นยาง • แอร์)',      isPopular: false },
  { id: 'c2', venueId: 'v_winner', number: 2, name: 'คอร์ท 2', surface: 'rubber',
    climate: 'air', gridSubtitle: 'ยาง / แอร์',      longLabel: 'คอร์ท 2 (พื้นยาง • แอร์)',      isPopular: false },
  { id: 'c3', venueId: 'v_winner', number: 3, name: 'คอร์ท 3', surface: 'rubber_bwf',
    climate: 'air', gridSubtitle: 'ยาง BWF / แอร์',  longLabel: 'คอร์ท 3 (พื้นยางเกรด BWF)',     isPopular: true  },
  { id: 'c4', venueId: 'v_winner', number: 4, name: 'คอร์ท 4', surface: 'parquet',
    climate: 'air', gridSubtitle: 'ปาร์เกต์ / แอร์', longLabel: 'คอร์ท 4 (พื้นปาร์เกต์)',        isPopular: false },
  { id: 'c5', venueId: 'v_winner', number: 5, name: 'คอร์ท 5', surface: 'rubber',
    climate: 'fan', gridSubtitle: 'ยาง / พัดลม',     longLabel: 'คอร์ท 5 (พื้นยาง • พัดลม)',     isPopular: false },
  { id: 'c6', venueId: 'v_winner', number: 6, name: 'คอร์ท 6', surface: 'rubber',
    climate: 'fan', gridSubtitle: 'ยาง / พัดลม',     longLabel: 'คอร์ท 6 (พื้นยาง • พัดลม)',     isPopular: false },
];

/* ── Rate rules — D03, D04′, D05 ─────────────────────────────────────────────
   Kills ฿160 (`2.`), ฿200 (`empty_state`) and the ฿360-per-2h row in `_3`.
   A base rule plus two peak overrides expresses "21:00 falls back to ฿180" for
   free, with no third tier. */
const MON_FRI = 0b0111110;  // 62
const WEEKEND = 0b1000001;  // 65

export const RATE_RULES: RateRule[] = [
  { id: 'r_base', venueId: 'v_winner', label: 'อัตราปกติ',
    dayMask: 0b1111111, startMinutes: 9 * 60, endMinutes: 22 * 60,
    pricePerHour: satang(18_000), isPeak: false, priority: 0 },
  { id: 'r_peak_wd', venueId: 'v_winner', label: 'ช่วงพีคเย็น (จ.–ศ.)',
    dayMask: MON_FRI, startMinutes: 17 * 60, endMinutes: 21 * 60,   // ← D04′
    pricePerHour: satang(22_000), isPeak: true, priority: 10 },
  { id: 'r_peak_we', venueId: 'v_winner', label: 'เสาร์–อาทิตย์ (พีคทั้งวัน)',
    dayMask: WEEKEND, startMinutes: 9 * 60, endMinutes: 22 * 60,
    pricePerHour: satang(22_000), isPeak: true, priority: 10 },
];

/* ── User ──────────────────────────────────────────────────────────────────── */
export const USER: User = {
  id: 'u_ton',
  lineUserId: 'Udemo0000000000000000000000000001',
  displayName: 'คุณต้น',
  fullName: 'คุณต้น (Ton Jiraphat)',
  lineId: '@ton_badminton',
  pictureUrl: '/mascot/capybara-avatar.webp',
  phone: '089-111-2345',      // deliberately NOT the venue number
};

/* ── Availability blocks, authored by DAY OFFSET ───────────────────────────── */
const b = (
  id: string, courtId: string, date: ISODate, startHour: number, hours: number,
  kind: AvailabilityBlock['kind'], note?: string,
): AvailabilityBlock => ({
  id, venueId: 'v_winner', courtId, date,
  startMinutes: startHour * 60,
  endMinutes: (startHour + hours) * 60,
  kind, note,
});

/** The canonical day. คอร์ท 3 @ 19:00–21:00 is DELIBERATELY FREE, and the evening
    is busy enough that the free pair reads as scarce rather than as an empty venue. */
const CANONICAL: AvailabilityBlock[] = [
  b('bk01', 'c3', D.canonical,  9, 1, 'booked'),
  b('bk02', 'c3', D.canonical, 11, 1, 'booked'),
  b('bk03', 'c2', D.canonical, 15, 1, 'booked'),
  b('bk04', 'c5', D.canonical, 15, 1, 'booked'),
  b('bk05', 'c2', D.canonical, 17, 2, 'booked'),
  b('bk06', 'c4', D.canonical, 17, 2, 'booked'),
  b('bk07', 'c1', D.canonical, 18, 1, 'booked'),
  b('bk08', 'c5', D.canonical, 18, 1, 'booked'),
  b('bk09', 'c6', D.canonical, 19, 1, 'booked'),
  b('bk10', 'c1', D.canonical, 20, 2, 'booked'),
  b('bk11', 'c4', D.canonical, 21, 1, 'booked'),
  // Maintenance stays where `2.` puts it: Court 6, 09:00–11:00.
  b('mt01', 'c6', D.canonical,  9, 2, 'maintenance', 'ซ่อมบำรุงพื้นสนาม'),
];

const NEXT: AvailabilityBlock[] = [
  b('bk20', 'c1', D.next, 10, 2, 'booked'),
  b('bk21', 'c3', D.next, 14, 2, 'booked'),
  b('bk22', 'c4', D.next, 18, 2, 'booked'),
  b('bk23', 'c5', D.next, 19, 3, 'booked'),
];
const BUSY: AvailabilityBlock[] = [
  b('bk30', 'c2', D.busy, 11, 2, 'booked'),
  b('bk31', 'c6', D.busy, 17, 2, 'booked'),
  b('bk32', 'c1', D.busy, 19, 2, 'booked'),
  b('bk33', 'c3', D.busy, 19, 2, 'booked'),
  b('bk34', 'c4', D.busy, 19, 2, 'booked'),
];
/** Every court, every hour. GENERATED, never typed out. Drives `_2`. */
const SOLD_OUT: AvailabilityBlock[] = COURTS.flatMap((c) =>
  Array.from({ length: 13 }, (_, i) =>
    b(`full-${c.id}-${9 + i}`, c.id, D.soldOut, 9 + i, 1, 'booked')),
);
/** The alternate day `_2` recommends. Must look genuinely open. */
const ALTERNATE: AvailabilityBlock[] = [
  b('bk40', 'c1', D.alternate, 18, 2, 'booked'),
  b('bk41', 'c4', D.alternate, 20, 1, 'booked'),
];

export const AVAILABILITY_BLOCKS: AvailabilityBlock[] =
  [...CANONICAL, ...NEXT, ...BUSY, ...SOLD_OUT, ...ALTERNATE];

/* ── Seed bookings — drive `_3` before you book anything ───────────────────── */
const at = (iso: ISODate, h: number) =>
  new Date(`${iso}T${String(h).padStart(2, '0')}:00:00+07:00`).getTime();

/* Mirrors quote() exactly, fee line included (§6.4). Without it a seeded card and a
   card booked during the demo disagree about ค่าบริการระบบจอง — visible the moment
   the owner puts two bookings side by side on `_3`. */
const PEAK_2H = (): QuoteLine[] => ([
  {
    rateRuleId: 'r_peak_wd', label: 'ค่าคอร์ทช่วงพีค (฿220 × 2 ชม.)',
    hours: 2, unitPrice: satang(22_000), amount: satang(44_000), isPeak: true,
  },
  {
    rateRuleId: 'fee', label: 'ค่าบริการระบบจอง', hours: 0,
    unitPrice: satang(0), amount: satang(0), isPeak: false, tag: 'ฟรีช่วงเปิดตัว',
  },
]);

/** Seed refs are derived from their own date so they always match D09's YYMM. */
const seedRef = (d: ISODate, n: number) =>
  `WC-${d.slice(2, 4)}${d.slice(5, 7)}-${String(n).padStart(4, '0')}`;

export const SEED_BOOKINGS: Booking[] = [
  { // upcoming, confirmed — the hero card on `_3`
    id: 'bkg_0041', ref: seedRef(D.next, 41),
    venueId: 'v_winner', courtIds: ['c3'], userId: 'u_ton',
    date: D.next, startMinutes: 19 * 60, endMinutes: 21 * 60,
    status: 'confirmed', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'promptpay', paymentStatus: 'paid', paidAt: now() - 86_400_000,
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 4-6 คน',
    createdAt: now() - 86_400_000, holdExpiresAt: null,
  },
  { // upcoming, awaiting counter payment — proves the cash path has a home
    id: 'bkg_0039', ref: seedRef(addDays(BASE, 5), 39),
    venueId: 'v_winner', courtIds: ['c1'], userId: 'u_ton',
    date: addDays(BASE, 5), startMinutes: 18 * 60, endMinutes: 20 * 60,
    status: 'pending_payment', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'counter', paymentStatus: 'unpaid', paidAt: null,
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 4 คน',
    createdAt: now() - 3_600_000, holdExpiresAt: null,
  },
  { // completed, last week — drives the "ที่ผ่านมา" tab. ฿440 = 2 × ฿220, NOT
    // `_3`'s ฿360, which was 2 × ฿180 charged during peak hours.
    id: 'bkg_0012', ref: seedRef(addDays(BASE, -7), 12),
    venueId: 'v_winner', courtIds: ['c2'], userId: 'u_ton',
    date: addDays(BASE, -7), startMinutes: 19 * 60, endMinutes: 21 * 60,
    status: 'completed', lines: PEAK_2H(), total: satang(44_000),
    paymentMethod: 'promptpay', paymentStatus: 'paid', paidAt: at(addDays(BASE, -8), 21),
    contactPhone: '089-111-2345', headcountHint: 'ก๊วน 5 คน',
    createdAt: at(addDays(BASE, -8), 21), holdExpiresAt: null,
  },
];

/** Seeded so the first booking made during a demo is WC-YYMM-0042. */
export const REF_SEQUENCE_SEED = 41;
```

### 6.4 `src/data/rates.ts`

```ts
import type { ISODate, Minutes, Quote, QuoteLine, RateMix, RateRule, Satang, Venue } from './types';
import { satang } from './types';
import { thb } from '@/lib/money';
import { dayOfWeek } from '@/lib/clock';
import { RATE_RULES, VENUE } from './fixtures';

export function ruleFor(date: ISODate, startMinutes: Minutes, rules = RATE_RULES): RateRule {
  const bit = 1 << dayOfWeek(date);
  const match = rules
    .filter(r => (r.dayMask & bit) !== 0
              && startMinutes >= r.startMinutes
              && startMinutes <  r.endMinutes)
    .sort((a, b) => b.priority - a.priority)[0];
  if (!match) throw new Error(`No rate rule for ${date} @ ${startMinutes}`);
  return match;
}

export const priceForHour = (d: ISODate, m: Minutes): Satang => ruleFor(d, m).pricePerHour;
export const isPeakHour  = (d: ISODate, m: Minutes): boolean => ruleFor(d, m).isPeak;

/** Groups consecutive hours by rate rule, so a range that crosses a rate boundary
    renders as two line items instead of one wrong average. */
export function quote(
  date: ISODate, startMinutes: Minutes, endMinutes: Minutes, venue: Venue = VENUE,
): Quote {
  // Step by venue.slotMinutes, never by a literal 60: the demo script invites the
  // owner to name their own policy, and a venue selling 90-minute blocks must price
  // correctly without editing this file. Rates stay ฿/hour; a slot bills a fraction.
  const step = venue.slotMinutes;
  const slotHours = step / 60;
  const lines: QuoteLine[] = [];
  for (let m = startMinutes; m < endMinutes; m += step) {
    const r = ruleFor(date, m);
    const last = lines[lines.length - 1];
    if (last && last.rateRuleId === r.id) {
      last.hours += slotHours;
      last.amount = satang(last.amount + Math.round(r.pricePerHour * slotHours));
    } else {
      lines.push({
        rateRuleId: r.id, isPeak: r.isPeak, unitPrice: r.pricePerHour,
        hours: slotHours, amount: satang(Math.round(r.pricePerHour * slotHours)), label: '',
      });
    }
  }
  for (const l of lines) {
    l.label = `ค่าคอร์ท${l.isPeak ? 'ช่วงพีค' : 'ช่วงปกติ'} (${thb(l.unitPrice)} × ${l.hours} ชม.)`;
  }
  const total = satang(lines.reduce((sum, l) => sum + l.amount, 0));
  const hours = (endMinutes - startMinutes) / 60;
  // Guard added during Day 3 (the plan's block indexes lines[0] directly, which is
  // both a strict-TS error and a real crash if startMinutes === endMinutes).
  const first = lines[0];
  if (!first) throw new Error(`Empty quote for ${date} ${startMinutes}-${endMinutes}`);
  const rateMix: RateMix = lines.length > 1 ? 'mixed' : first.isPeak ? 'peak' : 'standard';

  return {
    lines: [...lines, {
      rateRuleId: 'fee', label: 'ค่าบริการระบบจอง', hours: 0,
      unitPrice: satang(0), amount: satang(0), isPeak: false, tag: 'ฟรีช่วงเปิดตัว',
    }],
    total, hours, rateMix, currency: 'THB',
    // Unsigned in Plan 01 (see Quote.quoteToken). Plan 04 replaces this with a server signature.
    quoteToken: `demo:${date}:${startMinutes}-${endMinutes}:${total}`,
  };
}
```

**Worked examples on a weekday** (these are the unit-test fixtures):

| Range | Grouping | Total | Drawer rate chip |
|---|---|---|---|
| 19:00–21:00 | ฿220 × 2 | **฿440** ← the canonical spine | `ช่วงพีค` |
| 10:00–12:00 | ฿180 × 2 | ฿360 | *(none)* |
| 16:00–18:00 | ฿180 × 1 + ฿220 × 1 | **฿400** | `ปกติ + พีค` |
| 16:00–19:00 | ฿180 × 1 + ฿220 × 2 | ฿620 | `ปกติ + พีค` |
| 20:00–22:00 | ฿220 × 1 + ฿180 × 1 | **฿400** | `พีค + ปกติ` |

On Saturday or Sunday every hour is `r_peak_we`, so 10:00–12:00 = **฿440**. That contrast is the visible payoff of rates-as-data, and it is the last beat of the demo script.

### 6.5 `src/data/booking-ref.ts`

```ts
import type { ISODate } from './types';
import { REF_SEQUENCE_SEED } from './fixtures';

const seq: Record<string, number> = {};

/**
 * WC-YYMM-NNNN, per-venue-per-month running sequence (D09).
 * NOT random: a 4-char base32 suffix is a ~1.05M space, and `critique.md` #14 shows
 * the "zero collisions over 1,000,000 draws" exit criterion is unpassable there.
 * YYMM already implies a monthly counter, and 10,000/month is ample for six courts.
 * In the real product this is a Postgres sequence per (venue_id, yymm).
 */
export function nextBookingRef(venueId: string, date: ISODate): string {
  const yymm = date.slice(2, 4) + date.slice(5, 7);   // '2609'
  const key = `${venueId}:${yymm}`;
  const n = (seq[key] ?? REF_SEQUENCE_SEED) + 1;
  seq[key] = n;
  if (n > 9999) throw new Error(`Ref sequence exhausted for ${key}`);
  return `WC-${yymm}-${String(n).padStart(4, '0')}`;
}
```

### 6.6 `src/data/api.ts` — the seam

Screens are meant to talk to `api`, never to `db`, so swapping to real `fetch()` or TanStack Query touches only this file. **One exception shipped:** `/bookings` reads the list through `useDb()` from `data/db.ts`, so a cancellation re-renders without a refetch. Plan 04 has to replace that subscription along with `api.ts`.

```ts
import { now } from '@/lib/clock';
import { buildGrid } from './availability';
import { nextBookingRef } from './booking-ref';
import { COURTS, RATE_RULES, USER, VENUE } from './fixtures';
import { quote } from './rates';
import { getState, setState, sweepHolds } from './db';
import type {
  AvailabilityBlock, Booking, ISODate, PaymentMethodId, SelectionRange,
} from './types';

/** Deliberate latency: every screen is forced to have somewhere to put a loading
    state. `?fast=1` compresses it so a rehearsal has no dead air. */
const FAST = typeof window !== 'undefined' && new URLSearchParams(location.search).has('fast');
const lag = <T,>(value: T, ms = 120 + Math.random() * 230): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), FAST ? 30 : ms));

const hoursOf = (sel: SelectionRange) => ({
  startMinutes: sel.startHour * 60,
  endMinutes: sel.endHour * 60,
});

const isFree = (date: ISODate, courtId: string, startHour: number, endHour: number, ignoreId?: string) =>
  !getState().blocks.some(
    (b) =>
      b.date === date &&
      b.courtId === courtId &&
      b.id !== ignoreId &&
      (b.kind !== 'held' || (b.expiresAt ?? 0) > now()) &&
      startHour * 60 < b.endMinutes &&
      endHour * 60 > b.startMinutes,
  );

export class SlotTakenError extends Error {
  constructor() {
    super('SLOT_TAKEN');
    this.name = 'SlotTakenError';
  }
}

export const api = {
  getVenue: () => lag({ venue: VENUE, courts: COURTS, rates: RATE_RULES }),
  getUser: () => lag(USER),

  getAvailability: (date: ISODate, ownHoldId?: string) => {
    sweepHolds();
    return lag(buildGrid(date, COURTS, getState().blocks, { ownHoldId }));
  },

  getQuote: (sel: SelectionRange) => {
    const { startMinutes, endMinutes } = hoursOf(sel);
    return lag(quote(sel.date, startMinutes, endMinutes));
  },

  getBookings: () => {
    sweepHolds();
    return lag(getState().bookings);
  },

  getBooking: (ref: string) =>
    lag(getState().bookings.find((b) => b.ref === ref) ?? null),

  /** Unused by the demo after Revision 5 (nothing waits between choosing and
      confirming). Kept because Plan 04 needs a server-side hold, and the shape is
      already right: one block per court, matching the per-court exclusion constraint. */
  createHold: (sel: SelectionRange) => {
    const holdId = `hold_${Math.round(now())}`;
    for (const courtId of sel.courtIds) {
      if (!isFree(sel.date, courtId, sel.startHour, sel.endHour)) throw new SlotTakenError();
    }
    const { startMinutes, endMinutes } = hoursOf(sel);
    const blocks: AvailabilityBlock[] = sel.courtIds.map((courtId, i) => ({
      id: i === 0 ? holdId : `${holdId}_${i}`,
      venueId: VENUE.id,
      courtId,
      date: sel.date,
      startMinutes,
      endMinutes,
      kind: 'held',
      expiresAt: now() + VENUE.holdMinutes * 60_000,
    }));
    setState((s) => ({ ...s, blocks: [...s.blocks, ...blocks] }));
    return lag({ holdId, expiresAt: blocks[0]!.expiresAt! });
  },

  releaseHold: (holdId: string) => {
    setState((s) => ({
      ...s,
      blocks: s.blocks.filter((b) => b.id !== holdId && !b.id.startsWith(`${holdId}_`)),
    }));
    return lag(true);
  },

  /** Creates the booking. `method` defaults to paying at the counter, which is what
      v1 does; `holdId` is optional because the demo books straight from the review
      screen with nothing held in between. */
  confirmBooking: (
    sel: SelectionRange,
    contactPhone: string,
    method: PaymentMethodId = 'counter',
    holdId = '',
  ) => {
    for (const courtId of sel.courtIds) {
      if (!isFree(sel.date, courtId, sel.startHour, sel.endHour, holdId)) throw new SlotTakenError();
    }
    const { startMinutes, endMinutes } = hoursOf(sel);
    const q = quote(sel.date, startMinutes, endMinutes);
    const paid = method === 'promptpay';
    const booking: Booking = {
      id: `bkg_${Math.round(now())}`,
      ref: nextBookingRef(VENUE.id, sel.date),
      venueId: VENUE.id,
      courtIds: sel.courtIds,
      userId: USER.id,
      date: sel.date,
      startMinutes,
      endMinutes,
      status: paid ? 'confirmed' : 'pending_payment',
      lines: q.lines,
      total: q.total,
      paymentMethod: method,
      paymentStatus: paid ? 'paid' : 'unpaid',
      paidAt: paid ? now() : null,
      contactPhone,
      headcountHint: '',
      createdAt: now(),
      holdExpiresAt: null,
    };
    const heldByThisFlow = (id: string) =>
      // `holdId` is empty in the demo, and `''.startsWith('')` is true for EVERY block —
      // which silently turned maintenance windows into bookings. Guard it explicitly.
      holdId !== '' && (id === holdId || id.startsWith(`${holdId}_`));

    setState((s) => {
      const converted = s.blocks.map((b) =>
        heldByThisFlow(b.id)
          ? { ...b, kind: 'booked' as const, expiresAt: undefined, bookingId: booking.id }
          : b,
      );
      const alreadyBlocked = converted.some((b) => b.bookingId === booking.id);
      // With no hold to convert, the booking inserts its own blocks — one per court,
      // matching the per-court exclusion constraint Plan 03 puts in the database.
      const inserted: AvailabilityBlock[] = alreadyBlocked
        ? []
        : sel.courtIds.map((courtId, i) => ({
          id: `${booking.id}_${i}`,
          venueId: VENUE.id,
          courtId,
          date: sel.date,
          startMinutes,
          endMinutes,
          kind: 'booked',
          bookingId: booking.id,
        }));
      return { blocks: [...converted, ...inserted], bookings: [booking, ...s.bookings] };
    });
    return lag(booking, 900);
  },

  cancelBooking: (id: string) => {
    setState((s) => ({
      blocks: s.blocks.filter((b) => b.bookingId !== id),
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)),
    }));
    return lag(true);
  },
};
```

Deliberate latency (120–350 ms) exists so every screen is *forced* to have somewhere to put a loading state. The audit found zero loading states in 48 files, and they are always retrofitted badly. `confirmBooking` gets the longest lag (900 ms), because confirming is the beat the venue owner watches. `?fast=1` compresses every lag to 30 ms so a rehearsal has no dead air.

What changed from the sketch this section first carried:

- **`confirmPayment` became `confirmBooking(sel, contactPhone, method = 'counter', holdId = '')`.** Revision 5 removed the hold from the flow, so the review screen books directly, and with no hold to convert the booking inserts its own `booked` blocks — one per court, matching the per-court exclusion constraint Plan 03 puts in the database. A slot that is no longer free throws `SlotTakenError`.
- **`getQuote` and `getBooking(ref)` were added.** `getQuote` exists for Plan 04's server-authoritative quote; nothing calls it yet (the screens call `quote()` from `rates.ts`).
- **`createHold` / `releaseHold` stay, unused**, because Plan 04 needs a server-side hold and the shape is already right. The hold length comes from `VENUE.holdMinutes` (15), not a literal 10.
- **`sweepHolds()` runs on every availability and bookings read.** There is no 15 s interval: with no holds in the flow, the sweep is cosmetic, and the booking path re-checks freedom itself.

---

## 7. Component inventory, as built

**Keep** = ships into the real product roughly as-is. **Adapt** = shape survives, internals change when a real API lands. Paths are relative to `apps/liff/src/`.

### Tier 0 — primitives (`components/ui/`)

| # | Component | File | As built | Fate |
|---|---|---|---|---|
| 1 | `Icon` | `icon.tsx` | `name: IconName; size?: 14\|16\|18\|20\|24\|28\|32\|36; filled?; label?`. 69 glyphs, 4 with a filled variant (§4.5). Decorative by default (`aria-hidden`); `label` promotes it to `role="img"` | Keep |
| 2 | `Button` | `button.tsx` | shadcn, adapted. Variants `primary`·`tonal`·`ghost`·`outline`·`line`·`danger`; sizes `md`·`lg`·`icon`; `leadingIcon`, `trailingIcon`, `loading` (spinner + `aria-busy`), `fullWidth`, `asChild`; `active:scale-98`. **`line` hard-codes `text-primary-container`** — white on `#06C755` is 2.26:1. With `asChild` the icon props are ignored | Keep |
| 3 | `Card` | `card.tsx` | shadcn, adapted. `variant: 'base'\|'raised'\|'inset'\|'accent'; accentColor?` — accent = 6px full-height left bar | Keep |
| 4 | `Badge` *(planned as `Pill`)* | `badge.tsx` | `tone: 'success'\|'peak'\|'error'\|'neutral'\|'info'\|'line'; dot?; pulse?; icon?` | Keep |
| 5 | `Spinner` | `spinner.tsx` | `size?; label?` | Keep |
| 6 | `Toast` + `useToast()` | `toast.tsx` | Tones `neutral`·`success`·`error`; 3.2 s. Two global regions, polite and assertive. **Replaces the mockups' blocking `alert()`** | Keep |
| 7 | `CopyButton` | `copy-button.tsx` | idle ⇄ copied (2 s) → toast. Clipboard API with a read-only-textarea fallback | Keep |
| 8 | `SegmentedTabs` | `segmented-tabs.tsx` | `role="tablist"` + `aria-selected`, arrow keys via `useRovingFocus`. Its `aria-controls` points at panel ids that `/bookings` does not render yet | Keep |
| 9 | `Sheet` | `sheet.tsx` | `fixed bottom-nav-safe`, `pointer-events-none` wrapper / `auto` card. ⚠️ **Non-modal: no focus trap, no scroll lock, never built on Dialog** — it hosts `SelectionDrawer` | Keep |
| 9a | `Modal` | `modal.tsx` | **Built on `@radix-ui/react-dialog`**: focus trap, focus restore, Escape, outside-click, inert siblings. `open; onOpenChange; title; description?; trigger?; actions?`. Content wrapper carries `max-w-liff mx-auto`. Used by the cancel confirmation on `/bookings` | Keep |
| 10 | `EmptyState` | `empty-state.tsx` | `mascot: 'idle'\|'sleep'\|'cheer'`, headline, body, actions. Drives sold-out and the empty `/bookings` tabs | Keep |
| — | `Input` · `Label` · `RadioGroup` · `Separator` · `Skeleton` | shadcn files of the same names | Added with Revision 6 (§4.5) | Keep |

### Tier 1 — shell (`layouts/`)

| # | Component | As built | Fate |
|---|---|---|---|
| 11 | `AppHeader` (`app-header.tsx`) | `pt-safe`, solid `bg-surface` (frosted only under `supports-[backdrop-filter]`), 48px home button, venue name over a `bg-success` dot + `VENUE.openHoursLabel`, local avatar. The dot is **static**, not derived from the clock | Keep |
| 12 | `BottomNav` (`bottom-nav.tsx`) | Renders `nav-config.ts`. `NavLink`, so `aria-current="page"` comes from the router; active tab bold with the filled glyph | Keep |
| 14 | `AppLayout` *(planned as `AppShell`)* (`app-layout.tsx`) | `<Outlet/>` + `.liff-column` + header/nav padding that includes the safe-area insets; nav hidden on `NAV_HIDDEN_PREFIXES` (`/book/success`) | Keep |

### Tier 2 — the booking domain (`features/`)

| # | Component | File | As built | Fate |
|---|---|---|---|---|
| 16 | `SlotCell` | `booking/pages/booking-grid/components/slot-cell.tsx` | A `<button role="gridcell">` with `aria-disabled` (never `disabled`), `aria-selected`, and a Thai name from `slotLabel()`. `edge: 'none'\|'single'\|'top'\|'middle'\|'bottom'` draws the merged multi-hour block — rounded ends and a 4px connector — so no separate `SelectionBridge` exists | **Keep — highest-value component in the repo** |
| 18 | `CourtMatrix` | `…/booking-grid/components/court-matrix.tsx` | A `div role="grid"` with `aria-rowcount`/`aria-colcount`, `role="row"`/`columnheader`/`rowheader`, `aria-rowindex`/`aria-colindex`, `lang="th"`. `min-w-[336px]`, so six courts fit the 430px column with no sticky header and no horizontal scroll. Peak rows tinted. Roving tabindex (§8.6) | **Keep** |
| 19 | `LegendBar` | `…/booking-grid/components/legend-bar.tsx` | `{standard, peak}` price strings. Keys: `ว่าง ฿180` · bolt `ช่วงพีค ฿220` · `เต็มแล้ว` (hatch) · `ปิดปรับปรุง` (dot grid) | Keep |
| 20 | `DateStrip` | `…/booking-grid/components/date-strip.tsx` | `role="radiogroup"` of `role="radio"` days, arrow keys via `useRovingFocus`. 14 days; today reads `วันนี้`; a sold-out day reads `เต็ม` | Keep |
| 21 | `SelectionDrawer` | `…/booking-grid/components/selection-drawer.tsx` | Inside a non-modal `Sheet`. States: none (`ยังไม่ได้เลือกคอร์ท` / `แตะช่องว่างในตารางเพื่อเลือกเวลา`, CTA disabled) · quoting (skeleton total) · selected (court, time, hours, total, `ช่วงพีค` or `ปกติ + พีค`). Buttons `ล้าง` and `จองทันที`. Owns an sr-only polite live region | Keep |
| 22 | `PriceBreakdown` | `booking/components/price-breakdown.tsx` | Iterates `QuoteLine[]`, so a mixed range renders two rows, plus the free fee line | Keep |
| 27 | `BookingCard` | `booking/pages/my-bookings/components/booking-card.tsx` | `{booking, onCancel?}`. One layout; the badge comes from the status: `ยืนยันแล้ว` · `รอชำระที่หน้าร้าน` · `เสร็จสิ้น` · `ยกเลิกแล้ว` · `หมดอายุ` | Keep |
| 28 | `RateCard` | `venue/pages/court-profile/components/rate-card.tsx` | Rows rendered from `RATE_RULES` — no hard-coded prices (D05) | Keep |
| 30 | `PhotoCarousel` | `…/court-profile/components/photo-carousel.tsx` | `snap-x snap-mandatory`, dots, `1 / 3`. Every slide has a real Thai `alt` | Keep |
| 31 | `AmenityGrid` | `…/court-profile/components/amenity-grid.tsx` | 2 columns, 6 tiles | Keep |

### Planned and not built

| Planned | Why it is absent | What stands in its place |
|---|---|---|
| `StepHeader` (#13) | Only one screen has a step | Inline back button + `ขั้นตอน 1 จาก 2` on `/book/review` |
| `OutsideLineNotice` (#15), `ShareToLine` (#32) | LINE integration cut, Revision 5 | — |
| `SelectionBridge` (#17) | Folded into `SlotCell`'s `edge` | — |
| `PaymentMethodCard` (#23) | One payment method after Revision 5 | shadcn `RadioGroup` with one option |
| `HoldBanner` (#24), `QrPanel` (#25) | Payment screen cut, Revision 5 | — |
| `BookingTicket` (#26) | Inline on the success screen | — |
| `AvailabilityBanner` (#29) | Inline on the court profile | A green-accent `Card` |
| `DemoBar` (#33), `FixtureBadge` (#34) | Not built | `?fast=1` is the only demo switch (§6.6) |

---

## 8. The slot-selection state machine

**This is the heart of the demo and it is prototyped nowhere.** `2.` is hardcoded markup with zero selection JS. `_1` toggles a CSS class per cell with no range logic, no price accumulation, no drawer update, and a CTA that is `disabled` in the markup and never enabled. Everything in this section is net-new, and it is the file most likely to survive verbatim into the real product.

It is split in two:

- **`src/features/booking/selection.ts`** — the rules as pure functions: `tap()`, `reconcile()` (§8.4), `assertInvariants()`, `hourLabel`, `rangeLabel`. No React, no DOM. `tap()` returns the new selection, the feedback to announce, and which rule fired. Unit-tested in `selection.test.ts` (§8.7).
- **`src/features/booking/pages/booking-grid/hooks/use-slot-selection.ts`** — the React hook around it: holds the state, sends feedback to the toasts and the drawer's live region, and computes the quote (§8.5).

### 8.1 Model

```ts
import type { Selection, SelectionRange } from '@/data/types';
// Selection is defined ONCE, in §6.1, and imported here — never redeclared:
//     { kind: 'none' }
//   | { kind: 'range'; date: ISODate; courtIds: CourtId[]; startHour; endHour }
// Whole hours, endHour EXCLUSIVE, courtIds length 1 in this UI (§6.1, NEW-6).
```

**Invariants**, re-validated server-side in the real build (D21). `assertInvariants()` checks them; as built it runs only inside the tests (the property test calls it after every step), not in the dev app:

1. `endHour > startHour`
2. `minBookingHours ≤ endHour − startHour ≤ maxBookingHours` (1…3)
3. every `h ∈ [startHour, endHour)` has `grid[c][h].status === 'available'` for every `c ∈ courtIds`
4. `courtIds.length === 1` in Plan 01's UI, exactly one contiguous run

**Invariant 4 is the design.** A discontinuous selection is *unrepresentable by construction* — there is no field in which to put a hole. This is why the "hours must be contiguous" rule needs no enforcement code anywhere: the only mutations are ±1 at a boundary or a reset to a fresh 1-hour range. There is no reachable state with a gap, so there is nothing to validate, nothing to test for, and no path by which a future refactor reintroduces it.

Derived, memoised:

```ts
hours     = endHour - startHour                      // S.kind === 'range' only
quote     = quote(date, startHour*60, endHour*60)   // → QuoteLine[] grouped by rate rule
total     = quote.total
rateMix   = quote.rateMix                            // 'standard' | 'peak' | 'mixed'
timeLabel = `${pad(startHour)}:00 - ${pad(endHour)}:00 น.`
```

### 8.2 `tap(courtId, hour)` — the complete decision table

Let `S` = current selection, `c` = tapped court, `h` = tapped hour, `st` = `grid[c][h].status`, `MAX` = `venue.maxBookingHours` (3). `S = {c, h, h+1}` is shorthand for `{ kind: 'range', date, courtIds: [c], startHour: h, endHour: h + 1 }`. **Evaluation is strictly R1 → R13; first match wins.**

| # | Condition | Result | Feedback |
|---|---|---|---|
| **R1** | `st === 'booked'` | no change | assertive toast **`ช่วงเวลานี้ถูกจองแล้ว`** |
| **R2** | `st === 'maintenance'` | no change | assertive toast **`คอร์ทนี้ปิดปรับปรุงในช่วงเวลานี้`** |
| **R3** | `st === 'past'` | no change | assertive toast **`เวลานี้ผ่านไปแล้ว`** |
| **R4** | `S.kind === 'none'` | `S = {c, h, h+1}` | drawer slides up; polite announce |
| **R5** | `!S.courtIds.includes(c)` | **`S = {c, h, h+1}`** — switch court | polite announce **`เปลี่ยนเป็นคอร์ท {n} แล้ว`** |
| **R6** | same court · `h === S.startHour` · `hours === 1` | `S = none` | drawer slides down; announce `ยกเลิกการเลือกแล้ว` |
| **R7** | same court · `h === S.startHour` · `hours > 1` | `S.startHour = h + 1` (shrink from top) | polite announce |
| **R8** | same court · `h === S.endHour - 1` · `hours > 1` | `S.endHour = h` (shrink from bottom) | polite announce |
| **R9** | same court · `S.startHour < h < S.endHour - 1` (interior of a 3-hour range) | **collapse: `S = {c, h, h+1}`** | polite announce **`เลือกใหม่เป็น {HH}:00 - {HH+1}:00`** |
| **R10** | same court · `h === S.endHour` · `hours < MAX` | **extend down: `S.endHour = h + 1`** | polite announce |
| **R11** | same court · `h === S.startHour - 1` · `hours < MAX` | **extend up: `S.startHour = h`** | polite announce |
| **R12** | same court · adjacent (`h === S.endHour` or `h === S.startHour - 1`) · `hours === MAX` | **no change** | assertive toast **`จองต่อเนื่องได้สูงสุด 3 ชั่วโมง`** |
| **R13** | same court · not adjacent and not inside (a gap of ≥1 hour, empty or blocked) | **restart: `S = {c, h, h+1}`** | assertive toast **`เลือกได้เฉพาะชั่วโมงติดกัน — เริ่มเลือกใหม่ที่ {HH}:00`** |

**Feedback as built.** "Polite announce" goes to the drawer's sr-only live region only; "assertive toast" is a visible toast in the assertive region. R4, R7, R8, R10 and R11 announce `เลือก {HH}:00 - {HH}:00 น.`. R12 is checked before R10/R11 (`hours >= MAX`), which is the same table. Any other status — in practice `closed` — falls into the R3 row with `เวลานี้เลือกไม่ได้`.

### 8.3 Why these three rules are the way they are

These are the three a reviewer will argue with, so the reasoning is written down rather than defended in a meeting.

- **R5 switches courts instead of erroring.** Users comparing courts tap around freely. Forcing "clear, then re-tap" costs a tap and reads as a bug; a confirmation dialog for a fully reversible action is worse. Switching is what the user meant.
- **R9 collapses instead of ignoring.** Every tap must do something visible. Ignoring the middle cell of a 3-hour range makes the grid feel dead, and "dead" is indistinguishable from "broken" in a demo. Collapsing is predictable and exactly one tap from undone.
- **R13 restarts instead of gap-filling.** Auto-filling the gap would book hours the user never chose — and the gap may contain a booked or maintenance cell, so the fill could also be impossible. Silently spending someone's money on a slot they did not pick is the worst outcome available here.

Two consequences worth stating so nobody re-derives them:

- **Extension can never jump a blocked cell.** R10/R11 only fire when the tapped cell is `available` (R1–R3 have already returned otherwise), and they extend by exactly one hour. Tapping the cell *after* a booked cell is a gap, so it falls to R13.
- **`ล้าง` is the only way to reach `none` other than R6** (and the date change below). There is no implicit clear. *`Escape` was planned and is not implemented.*

### 8.4 Transitions that are not taps

| Trigger | Effect |
|---|---|
| `ล้าง` button | `S = none` *(`Escape` planned, not implemented)* |
| date pill or calendar change | `S = none`, **always** — even if the identical court and hours are free on the new date |
| grid refetch | `reconcile()`: if any selected hour is no longer `available`, `S = none` + assertive toast **`ช่วงเวลาที่เลือกไว้เพิ่งถูกจองไปครับ กรุณาเลือกใหม่`**. As built the only refetch is a date change; there is no focus-regain refetch and no sweep interval |
| navigate to `/book/review` | freeze `S` into the flow reducer as `draft` (persisted under `wc.flow.v1`) |
| Back from review | **planned:** restore `S` and scroll `startHour` into view. **As built:** the grid remounts on `defaultDemoDate()` with `S = none` |
| ~~hold expiry~~ | *(cut, Revision 5 — no hold in the demo)* |

**Out of scope, stated explicitly:** long-press, drag-to-select, multi-court selection, cross-midnight ranges, sub-hour granularity.

### 8.5 Quote debounce

Every selection change kicks a **250 ms** debounced `quote()` in the hook. While it is in flight, `quoting = true`: the total renders as a skeleton bar and the CTA is disabled.

This is theatre in Plan 01 — the computation is synchronous and instant. It is kept because in the real product the quote is server-authoritative (D21, closing the "client computed a different total" hole), and the loading state costs nothing now versus a retrofit later. *(Revision 2 proposed zeroing this delay; the build kept 250 ms.)* It is also the only place in the app where the CTA-enable rule gets interesting:

> **The CTA enables iff `selection.kind === 'range' && !quoting && grid !== null`.** When the grid fails to load, the drawer is not rendered at all. That is the entire rule, and it is the rule `_1` never implements.

### 8.6 Keyboard and screen reader

**Structure.** `role="grid"` on a `div` (§3.5 #5 chose a `<table>` carrying the role; the build uses ARIA roles throughout instead): `aria-label="ตารางเวลาว่างของแต่ละคอร์ท"`, `aria-rowcount`/`aria-colcount`, a `role="columnheader"` per court, a `role="rowheader"` per hour, and each cell a `<button role="gridcell">` with `aria-rowindex`/`aria-colindex`. The grid carries `lang="th"`.

**Roving tabindex.** The grid is **one** tab stop. The focused cell has `tabindex="0"`, every other cell `tabindex="-1"`. The initial target is คอร์ท 1 @ 09:00.

| Key | Action | Built |
|---|---|---|
| `↑` `↓` | move one hour; stops at 09:00 / 21:00 | ✅ |
| `←` `→` | move one court; stops at คอร์ท 1 / คอร์ท 6 | ✅ (no explicit scroll; native `focus()` does it) |
| `Home` / `End` | first / last court in the row | ✅ |
| `PageUp` / `PageDown` | 09:00 / 21:00 in the same court | ✅ |
| `Enter` / `Space` | `tap()` — the §8.2 table verbatim | ✅ (native button click) |
| `Ctrl+Home` / `Ctrl+End` | คอร์ท 1 @ 09:00 / คอร์ท 6 @ 21:00 | ❌ behaves like `Home` / `End` |
| `Shift+↓` / `Shift+↑` | extend or shrink the range | ❌ moves focus only |
| `Escape` | `S = none` | ❌ |
| `Tab` | leaves the grid → the drawer's `ล้าง`, then the CTA | ✅ |

Focus is **never** moved programmatically by a tap.

**Accessible names** come from `slotLabel(courtName, slot, selected)` in `slot-cell.tsx` — never scraped from DOM text, which contains only `฿180` and announces as "180 baht" with no context.

| Status | Announced name |
|---|---|
| available, standard | `คอร์ท 3 เวลา 15:00 ถึง 16:00 ว่าง ราคา 180 บาท` |
| available, peak | `คอร์ท 3 เวลา 19:00 ถึง 20:00 ว่าง ช่วงพีค ราคา 220 บาท` |
| selected | as above + `เลือกอยู่`, plus `aria-selected="true"` |
| booked | `คอร์ท 3 เวลา 19:00 ถึง 20:00 ถูกจองแล้ว` + `aria-disabled="true"` |
| maintenance | `คอร์ท 6 เวลา 09:00 ถึง 10:00 ปิดปรับปรุง` + `aria-disabled="true"` |
| past | `คอร์ท 1 เวลา 09:00 ถึง 10:00 เลยเวลาแล้ว` + `aria-disabled="true"` |
| closed | `… นอกเวลาทำการ` + `aria-disabled="true"` |

**Three live regions:**

- The toast provider's two global regions, polite and assertive — R1/R2/R3/R12/R13 rejections and the "slot taken" refetch case go to the assertive one.
- An sr-only `aria-live="polite"` region in the drawer, which reads the tap feedback (`เลือก 19:00 - 21:00 น.`, `ยกเลิกการเลือกแล้ว`). The hook also builds a fuller summary with court and total (`เลือก คอร์ท 3 เวลา 19:00 - 21:00 น. รวม 2 ชั่วโมง ยอดรวม ฿440`), but nothing renders it yet.

Polite announcements are debounced 300 ms so a held arrow key does not flood the buffer.

**Non-colour encoding (D53).** Booked = 45° hatch + a `close` glyph. Maintenance = dot grid + a `build` glyph. Past = 60% opacity + a `schedule` glyph. Selected = navy fill + a `check_circle` glyph on the top cell of the range. Peak = a `bolt` glyph in the time axis, not just a tint. *The planned literal word `เลือกแล้ว` in selected cells was not built.*

### 8.7 Unit tests — `selection.test.ts`

The rules are tested as pure functions in `src/features/booking/selection.test.ts`, headless, with no React. Grid fixture: 6 courts × 13 hours on a weekday at least seven days ahead, with `c3@19` and `c3@20` free, `c6@09`–`c6@11` maintenance, and `c1@20` booked for one hour.

| # | Test | Expects |
|---|---|---|
| 1 | tap `c3@19` from none | `{c3, 19, 20}`, total ฿220 |
| 2 | tap `c3@19` then `c3@20` | `{c3, 19, 21}`, total **฿440**, `rateMix: 'peak'`, one quote line |
| 3 | tap `c3@19` twice | `none` (R6) |
| 4 | 19–21 then tap `c3@19` | `{c3, 20, 21}` (R7) |
| 5 | 19–21 then tap `c3@20` | `{c3, 19, 20}` (R8) |
| 6 | 18–21 then tap `c3@19` | `{c3, 19, 20}` (R9 collapse) |
| 7 | 19–21 then tap `c3@21` | `{c3, 19, 22}` (R10) |
| 8 | 19–22 then tap `c3@18` | unchanged; max-hours rejection (R12) |
| 9 | 19–21 then tap `c3@09` | `{c3, 9, 10}` (R13 restart) |
| 10 | 19–21 then tap `c1@19` | `{c1, 19, 20}` (R5 switch) |
| 11 | tap `c6@09` (maintenance) | unchanged; R2 |
| 12 | tap `c1@20` (booked) | unchanged; R1 |
| 13 | `c1@19`, then tap `c1@21` across the booked `c1@20` | `{c1, 21, 22}` — R13, not an extension across a blocked cell |
| 13b | 19–21 on `c3`, then tap `c1@21` | R5 (a different court is a switch, not a gap) |
| 14 | select 16–18 on a weekday | two quote lines, ฿180 + ฿220 = **฿400**, `rateMix: 'mixed'` |
| 15 | select 20–22 on a weekday | two lines, ฿220 + ฿180 = ฿400 |
| 16 | select 10–12 on a Saturday | one line, ฿220 × 2 = **฿440** |
| 17 | change date with a live selection | `none` |
| 18 | refetch where a selected hour became booked | `none` + assertive toast |
| — | refetch where the selection is still free | selection survives |
| 19 | property test: **one seeded run of 2,000 random taps** | `assertInvariants()` holds after **every** step |

**21 tests.** Test 19 is the one that matters: it is why invariant 4 can be trusted as a claim rather than an intention. The generator is seeded (`20_260_920`), so a failure reproduces.

---

## 9. Screen-by-screen, as built

Each screen below says what shipped. Where the plan asked for more than was built, it is listed under **Not built**, so the gap is visible instead of silently dropped.

Shared chrome, applied identically to every screen (`layouts/`):

- **Header** `pt-safe`, solid `bg-surface` (frosted only under `supports-[backdrop-filter]`), `shadow-app-header`, `z-header` — 48×48 home button, `venue.displayName` over a `bg-success` dot + `เปิดบริการ 09:00 - 22:00` (`VENUE.openHoursLabel`), 32px local avatar.
- **Bottom nav** `pb-safe shadow-app-nav` — two tabs from `nav-config.ts` (`sports_tennis จองคอร์ท` → `/book`, `event_available ประวัติจอง` → `/bookings`); active = `text-primary font-bold` + `aria-current="page"` + filled glyph, derived from the router. Hidden on `/book/success`.
- `main` sits inside `.liff-column`, padded for the header, the nav and the safe-area insets.
- **Viewport:** `width=device-width, initial-scale=1, viewport-fit=cover`. **`maximum-scale` and `user-scalable=no` are gone** (present in 38 of 48 mockups; WCAG 1.4.4 failure) and gated (§11.2).
- All `animate-ping` / `-pulse` / `-bounce` are killed under `prefers-reduced-motion` globally.
- URLs are hash routes (`/#/book`).

### S2/S3/S4 · `/book` — the booking grid (`features/booking/pages/booking-grid/`)

Top to bottom: `จองคอร์ทแบดมินตัน` + `{วันที่} · ว่าง {n} ช่วงเวลา` → 14-day `DateStrip` → `LegendBar` → `CourtMatrix` → `SelectionDrawer`. The grid opens on `defaultDemoDate()` (tomorrow after 18:00).

**Cells:** `available` = white + `฿180` in `text-success` (or `฿220` in `text-secondary` when peak); `selected` = `bg-primary-container` + price, with `check_circle` on the top cell and the cells merged into one block; `booked` = `.pattern-booked` + `close` glyph; `maintenance` = `.pattern-maintenance` + `build` glyph; `past` = 60% opacity + `schedule` glyph. Column headers are the court number over `gridSubtitle`.

Defects in the source that the build fixes:

- **All 13 rows render.** `_1` silently omits 12:00, 14:00 and 16:00. Rows come from `openingHours()`, never typed as markup — R10/R11/R13 depend on `h±1` being a real row.
- **`_1`'s full-width `เริ่มช่วงเวลาพีค` divider band is gone.** It broke the 1:1 row↔hour mapping arrow keys depend on. A row tint plus the `bolt` glyph carry the message.
- **The `★` on the Court 3 header is gone.** It read as "selected". (`isPopular` is in the data and not rendered.)
- **Peak is honey, not olive.** Peak = `secondary`; success = `success`. Never crossed.
- **Six courts fit one screen** (NEW-5): the matrix is `min-w-[336px]`, so a 390px phone shows every court with no horizontal scroll and no sticky header to fight.

**States built:**

- idle · selected · **past hours** (on today, every row ≤ the current hour).
- **loading** — eight skeleton bars, `aria-busy`, `aria-label="กำลังโหลดตาราง"`.
- **error** — `โหลดตารางไม่สำเร็จ` / `ลองใหม่อีกครั้งได้เลยครับ` / `ลองอีกครั้ง`; the drawer is hidden. *Unreachable in the demo (the fake API never rejects), and the retry button does not refetch yet: it sets the date to the value it already has.*
- **sold out (`_2`)** — `EmptyState` with the sleeping capybara, `วันนี้คอร์ทเต็มทุกช่วงเวลาแล้วครับ` / `ลองดูวันถัดไปไหมครับ ยังมีช่วงค่ำว่างอยู่`, and one button `ดูวัน{วันถัดไป}` that moves to the next day (BASE+4, the open alternate day). The drawer is hidden.

The CTA reads **`จองทันที`** in every state. *The plan asked for `ไปต่อที่ชำระเงิน`; with no payment screen after Revision 5, the review screen is the next step and the button does not book anything yet — the label is a known mismatch to settle.*

**Not built:** the `6 คอร์ทยางมาตรฐาน` chip, the calendar button and native date input, the month row and the `ช่วงพีค 17:00-21:00` chip; the `กำลังเลือก` legend key; the `เลือกแล้ว` word and time range inside selected cells; auto-scroll to the first non-past row; `?error=grid`; on the sold-out day, the recommendation card with `เลือกช่องนี้`, the free count in the CTA, the waitlist toggle (D23′) and the collapsed greyed grid; `countAvailableCourts()` and its dev assertion.

### S5 · `/book/review` — ยืนยันข้อมูลการจอง (`features/booking/pages/booking-review/`)

Guard: no `draft` in the flow state (deep link, reload after clear) → redirect to `/book` with `replace`. *The planned toast `กรุณาเลือกช่วงเวลาก่อนครับ` was not built.*

Back button (`ย้อนกลับ`) + `ยืนยันข้อมูลการจอง` / `ขั้นตอน 1 จาก 2` → summary card (`court.longLabel`, date, `{เวลา} ({n} ชั่วโมง)`, venue name) → `รายละเอียดค่าบริการ` (`PriceBreakdown`) → contact card → payment card → `ยืนยันการจอง`.

- **The phone field ships empty.** The mockup prefilled `081-234-5678` — *the venue's own hotline* — into the user's field. Label `เบอร์โทรติดต่อ`, helper `สนามใช้ติดต่อกลับกรณีมีการเปลี่ยนแปลง`, placeholder `08X-XXX-XXXX`, 16px. Validation strips every non-digit, then `^0[0-9]{8,9}$`. Invalid after blur or submit → `border-error` + `กรุณากรอกเบอร์โทรให้ครบ 9–10 หลัก` + `aria-invalid`. The CTA stays enabled and validates on press.
- **Payment is one option** (Revision 5): a `RadioGroup` labelled `วิธีชำระเงิน` with `ชำระที่หน้าร้าน` / `จ่ายเงินสดหรือโอนที่เคาน์เตอร์ตอนมาถึงสนาม`, selected by default.
- Cancellation line `ยกเลิกฟรีถ้าแจ้งก่อนเริ่มเล่นมากกว่า {venue.cancellationHours} ชั่วโมง` — the number is never typed.
- **`รอบ 4` and `รวมภาษีมูลค่าเพิ่มแล้ว` are gone** (D74).

**States:** default · submitting (spinner in the CTA) · validation error · **slot taken while deciding** — `api.confirmBooking` throws `SlotTakenError`, the screen shows the assertive toast `ช่วงเวลานี้เพิ่งถูกจองไปครับ กรุณาเลือกใหม่` and returns to `/book`. Any other failure toasts `บันทึกไม่สำเร็จ ลองอีกครั้งครับ`. The booking is created `pending_payment` / `unpaid` / `counter`.

**Not built:** the climate pill and thumbnail; the conflict *modal* and `?conflict=1` (NEW-1 shipped as the toast above); the price inside the CTA label; a sticky total drawer; disabling the inputs while submitting.

### ~~S6 · `/book/pay`~~ — **cut in Revision 5.** The section below is kept only as the spec to restore from if prepayment ever ships.

#### (archived) ชำระเงิน (2/3)

Guard: requires a hold with `expiresAt`. Absent → redirect to `/book`.

`HoldBanner` seeded at **15:00** from `venue.holdMinutes`, counted from an absolute deadline so it survives a refresh mid-demo. The `น.` suffix is dropped — `09:42 น.` reads as *9:42 in the morning*, not a duration.

```ts
// src/lib/useCountdown.ts — the mockup decrements a counter with setInterval and
// freezes at 00:00 with no consequence. setInterval in a backgrounded webview is
// throttled to ≥1/s and often frozen entirely, so a user who tabs away for three
// minutes returns to a timer that lost three minutes. Compute from wall clock.
const left = Math.max(0, expiresAt - now());
// tick every 250ms so mm:ss never visibly stalls; re-tick on visibilitychange.
```

```ts
// src/lib/money.ts — ONE currency convention, written down once, because `฿440`
// and `฿440.00` were drifting apart across the mockups by accident.
//
// THE RULE. Every rate in RATE_RULES is a whole baht, so every price the customer
// browses is rendered with NO decimals: grids, lists, drawers, breakdowns, tickets
// and CTA labels all call thb() → `฿440`. `฿440.00` in a grid reads as a foreign
// price tag. The ONE exception is the amount being transferred: a Thai bank app
// shows the figure to two decimals, so the PromptPay hero calls payAmount() →
// `440.00` and prints the ฿ itself. Matching the bank's own formatting removes the
// last moment of doubt before someone confirms a transfer.
//
// Inputs are SATANG (ADR-001 §4.4). Formatting goes through Intl.NumberFormat, never
// `(s/100).toLocaleString()`, which prints ฿440.50 as "฿440.5". If a fractional amount
// ever appears (a fee, a refund), thb() shows two decimals rather than rounding it away.
import type { Satang } from '@/data/types';

const THB_WHOLE = new Intl.NumberFormat('th-TH',
  { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const THB_EXACT = new Intl.NumberFormat('th-TH',
  { style: 'currency', currency: 'THB', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TWO_DP = new Intl.NumberFormat('th-TH',
  { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const thb = (s: Satang): string =>
  (s % 100 === 0 ? THB_WHOLE : THB_EXACT).format(s / 100);   // satang(44_000) → "฿440"
export const payAmount = (s: Satang): string => TWO_DP.format(s / 100);   // → "440.00"

// Unit tests (money.test.ts): thb(satang(44_000)) === '฿440'; thb(satang(44_050)) ===
// '฿440.50'; payAmount(satang(44_000)) === '440.00'. Run them once in CI with TZ=UTC and
// once with a non-Thai default locale, so an ICU difference fails a test, not a demo.

// Both render in `tabular-nums`. payAmount() has exactly one call site in the app
// (the PromptPay hero, S6 below); a second one is a bug, not a style choice.
```

Hero card: context pill → `฿` + `payAmount(satang(44_000))` = **`฿440.00`**, the only two-decimal figure in the product → **a real, scannable QR encoding the absolute `/qr-demo` URL** (never a `:ref`-bearing success link — §2.1), rendered as an `<img>` so long-press → *บันทึกรูปภาพ* works, with an explicit `บันทึก QR ลงรูปภาพ` button beside it → beneficiary block (`venue.legalName`, `venue.taxId`) → `content_copy คัดลอกเลขผู้เสียภาษี` (label corrected — the mockup says `คัดลอกเลขบัญชี` while its handler copies the tax ID: wrong data under the wrong label).

**Delete the `PromptPay QR` / `บัตรเครดิต / เดบิต` tab strip** — card has no screen and no provider. Replace with a static `qr_code_2 พร้อมเพย์ (PromptPay)` label plus a disabled `บัตรเครดิต · เร็ว ๆ นี้` chip.

**The primary CTA is demoted.** The mockup's `แจ้งว่าชำระเงินแล้ว / ตรวจสอบยอด` sits directly under a banner promising automatic confirmation with no slip — the two contradict each other. Resolution: the banner's promise is the primary path (an auto-confirm fires on a 6 s timer, `?fast=1` → 1.5 s, so the presenter can simply wait), and the CTA becomes secondary, relabelled `ตรวจสอบยอดเงินอีกครั้ง`. Also: **make the CTA block actually sticky** — the mockup comments it `<!-- Sticky Bottom CTA Section -->` and then does not position it.

**States:** `holding` · `verifying` (waiting banner → spinner + `กำลังตรวจสอบยอดเงิน…`, QR dimmed to 40%, 1.6 s) · **`expiring`** (<60 s: banner `bg-error-container`, timer `text-error` + 1 s pulse, helper `เหลือเวลาไม่ถึง 1 นาที กรุณาโอนให้เรียบร้อยครับ`) · **`expired`** (→ `/book/expired`) · **`failed`** (`ยังไม่พบยอดเงินเข้า`, `?fail=1`) · `paid` → S7.

**`/book/expired`** — sleeping capybara at 128px, `หมดเวลาจองชั่วคราวแล้ว`, `คอร์ทถูกปล่อยกลับสู่ระบบแล้ว กรุณาเลือกช่วงเวลาใหม่อีกครั้งครับ`, primary `กลับไปเลือกเวลาใหม่` → the grid on the same date with the same court scrolled into view. The hold is released and availability invalidated on entry.

### S7 · `/book/success/:ref` — จองคอร์ทสำเร็จ (`features/booking/pages/booking-success/`)

Folder in the mockups is named `line`; it is **not** a LINE chat preview.

Skeleton while loading → cheering capybara → `จองคอร์ทสำเร็จแล้วครับ` / `ล็อกคอร์ทเรียบร้อย เจอกันที่สนามครับ` → badge `รอชำระที่หน้าร้าน` → ticket card (`หมายเลขการจอง` + ref; rows `สนาม / คอร์ท`, `วันที่เล่น`, `เวลา`, `เบอร์ติดต่อ`; `PriceBreakdown`; `ชำระเงินที่เคาน์เตอร์เมื่อมาถึงสนาม แจ้งหมายเลขการจองกับพนักงานได้เลย`) → `คัดลอกหมายเลขการจอง` (`CopyButton`) → `ดูการจองของฉัน` · `จองคอร์ทอีกครั้ง`.

`จองคอร์ทสำเร็จ (รอบ 4/3)` → `จองคอร์ทสำเร็จแล้วครับ`. The booking is written to the store by `api.confirmBooking` before this screen opens, which is what makes `/bookings` populate.

**States:** loaded · unknown `:ref` (`ไม่พบการจองนี้` / `ลิงก์อาจหมดอายุ หรือเปิดจากเครื่องอื่น` / `กลับไปหน้าจองคอร์ท`).

**Not built:** LINE share and its `shareText` template (cut, Revision 5); the Google Calendar and maps buttons; the rules card; the entry-QR tag. The status badge is fixed to the counter path, because that is the only path.

### S8/S9 · `/bookings` — การจองของฉัน (`features/booking/pages/my-bookings/`)

`การจองของฉัน` / `ตรวจสอบคอร์ทและประวัติการลงสนาม` → `SegmentedTabs` `กำลังจะถึง` / `ที่ผ่านมา` with **computed** counts (the mockup's badge said 5 while the panel rendered 3) → `BookingCard` list, or an `EmptyState` per tab.

- Past prices come from `booking.total` as stored; the mockup's ฿360 for a peak session is gone.
- `ยกเลิก` opens a real `Modal`: `ยกเลิกการจองนี้?` / `คอร์ทจะถูกปล่อยกลับสู่ระบบทันที และยกเลิกแล้วไม่สามารถกู้คืนได้` / `ไม่ยกเลิก` · `ยืนยันยกเลิก` → toast `ยกเลิกการจองแล้ว คอร์ทถูกปล่อยกลับสู่ระบบ`. Cancelling sets the status to `cancelled` (the card moves to `ที่ผ่านมา`) and frees the court's blocks. No `alert()` anywhere.
- Empty upcoming tab: idle capybara, `ยังไม่มีนัดตีแบดเลยครับ` / `รวมก๊วนเพื่อนแล้วมาเลือกล็อกคอร์ทกันเลย`, link `ค้นหาและจองคอร์ททันที` → `/book`. Empty past tab: `ยังไม่มีประวัติการจอง`. An empty upcoming tab with a populated past tab falls out of the per-tab empty state.

**States built:** loading (two skeleton bars) · populated · empty per tab.

**Not built:** hero/compact card variants, the copy button on cards, the live countdown chip (no hold); the today-availability launcher with pre-selecting slot chips; the trust badge, the consult card and the `refresh` button; the 3-hour rule in the cancel dialog and the cancel-window-passed state.

The list is read through `useDb()` from `data/db.ts`, not through `api` (§6.6).

### S1 · `/` — โปรไฟล์สนาม (`features/venue/pages/court-profile/`)

Carousel (3 local WebPs, `snap-x`, dots, `1 / 3`) → `วินเนอร์ คอร์ท (Winner Court)` + `เปิดอยู่` badge → address, `6 คอร์ท · เปิดทุกวัน 09:00 – 22:00` → `แผนที่` (the pinned `?q=` URL, not the bare `maps.google.com` the mockup ships) and the venue phone `02-000-0000` (`tel:020000000`) → **availability card** → `RateCard` → `AmenityGrid` → sticky CTA `จองคอร์ทเลย` → `/book`.

The availability card is the screen's job. Its number is `countAvailableSlots()` on the same day and grid `/book` opens on, **never a literal 5**, so it always equals the free cells on the grid: `วันนี้ว่างอีก {n} ช่วงเวลา`, then `ช่วงค่ำ 19:00 – 22:00 ยังเหลือ {n} คอร์ท` or `ช่วงค่ำเต็มแล้ว ลองดูช่วงบ่ายได้ครับ`. A skeleton holds its place while loading. It is a green-accent card, not the planned navy banner, and it is not tappable.

The rate card renders from `RATE_RULES`, so it reads `อัตราปกติ` · `ทุกวัน · 09:00 – 22:00` · `฿180 / ชม.`, `ช่วงพีคเย็น (จ.–ศ.)` · `จันทร์ – ศุกร์ · 17:00 – 21:00` · `฿220 / ชม.` (was 17:00–22:00 in the mockup), and a weekend row. The `4.8 (142 รีวิว)` capsule is cut (D08).

**Not built:** the `สนามพาร์ทเนอร์` pill; the venue-closed state (the badge is always `เปิดอยู่`); image `onError` fallback; tappable band rows. After 18:00 the card shows tomorrow's count under a label that still says `วันนี้`.

---

## 10. Milestones — 16 days, one developer

> **Status (2026-10-06): this is the schedule as planned, kept as the record of how the work was priced.** Revision 5 removed Day 9's `/book/pay`, Day 14's hold-expiry chain, `DemoBar`, `FixtureBadge`, `OutsideLineNotice` and the instrumentation, and Day 15's LIFF spike. What shipped is described in §7–§9, and §11 marks each acceptance item against the code. Names below are the planned ones: `useSlotSelection.ts` shipped as `features/booking/selection.ts` + the hook, `Icon.tsx` as `components/ui/icon.tsx`, `bookingRef.ts` as `booking-ref.ts`, and the quote debounce was kept at 250 ms rather than zeroed (§8.5).

Each day has a *done when* that is observable, not a feeling.

Revision 1 priced this at 11 days with Gate 1 on Day 5. `01-critique.md` showed that was roughly 2× short on four of those days: the scaffold day, the data+primitives day, the grid-components day and the checkout day. The table below is the corrected arithmetic. Two things paid for part of the increase — the icon sprite codegen is cut in favour of Material Symbols components copied from shadcn.io behind a typed `Icon.tsx` (§4.5), and the fake quote debounce is zeroed — so the delta is 5 days, not 9. Revision 3 (Radix Dialog, `useRovingFocus`) does not change the total: it adds about half a day on Days 3–4 and removes about the same from Days 12–13.

| Day | Work | Done when |
|---|---|---|
| **1–2** | `git init` in `booking/` and commit `documents/` untouched first; scaffold `apps/liff/` with `pnpm create vite` and align every version to §4.6; pin Tailwind 3.4.17, write `tailwind.config.js` + `index.css` (§5) incl. the Thai line-height floor and the 16px input rule, `@fontsource` imports, copy the 69 Material Symbols icons from shadcn.io into `components/icons/` and register them in `Icon.tsx` (§4.5 checklist), `cn`, `AppShell`, `AppHeader`, `BottomNav`, `navConfig.ts`, `router.tsx` with six empty routes, each `fixed` element given its own inner `max-w-liff mx-auto`. Convert the 4 mascot `code.html` → `.svg`; convert 3 stitch PNGs → WebP. **Open the deployed shell from a real LINE chat today** — not on Day 15. | Every route renders shell + nav; `aria-current` is correct on both tabs; the active tab shows the filled icon; `pnpm gate` passes; `sports_tennis`, `calendar_month` and `qr_code_2` match the mockup screenshots at 24px; the shell renders correctly inside the LINE in-app webview with no `backdrop-filter` fallback gap. |
| **3–4** | `data/types.ts`, `fixtures.ts`, `rates.ts`, `availability.ts`, `bookingRef.ts`, `db.ts` (localStorage), `api.ts`, `clock.ts` (all arithmetic in shifted-UTC). Primitives: `Button` (with `asChild`) `Card` `Pill` `Spinner` `Toast` `CopyButton` `Sheet` (non-modal) `Modal` (Radix Dialog) `SegmentedTabs` `EmptyState`, plus `lib/useRovingFocus.ts`. | `quote()` returns `total === satang(44_000)` (renders `฿440`) for a weekday 19:00–21:00 and `satang(40_000)` for 16:00–18:00, proven by a test that passes with the machine clock set to UTC. `satang(440.5)` throws. A scratch route renders every primitive variant. `Modal` traps focus, closes on Escape and returns focus to its trigger; `useRovingFocus` reaches a disabled item with the arrow keys. |
| **5–6** | **`useSlotSelection.ts` + all tests (§8.7).** Headless. No JSX these two days. | `pnpm test` green, including the 2,000-sequence property test and the rules for `closed`, own-hold, and the hour-boundary crossing. **These days are protected — do not compress them.** |
| **7–8** | `SlotCell`, `SelectionBridge`, `CourtMatrix` (`role="grid"` with `aria-rowindex`/`aria-colindex`, sticky header + axis, `border-separate`), `LegendBar`, `DateStrip`, `SelectionDrawer`. Wire to `api.getAvailability`. Cell width is a token; decide the 6-courts-on-one-screen question with a real device in hand. | Tapping `c3@19` then `c3@20` shows the merged navy block and `฿440` in the drawer, on a real phone. On an iPhone SE inside LINE, the 19:00 row, the 20:00 row and the drawer are visible simultaneously. |
| **9** | `/book/review` (guard, breakdown, 16px phone field, radiogroup) → `/book/pay` (QR → `/qr-demo`, save-to-gallery affordance, hold banner, verifying) → `/book/success/:ref` (ticket, share, store write). Happy path only, rough edges allowed. | **GATE 1 — end to end on a phone.** Grid → review → QR → success → the booking appears in `/bookings`. If this slips, cut S1 (Day 11) before cutting anything else. |
| **10** | `/bookings` populated + empty + `BookingCard` variants + cancel sheet. Sold-out state on `/book` incl. the collapsed greyed grid and the waitlist toggle. | The tab counts match the rendered cards; cancelling removes a booking and the toast is inline, not `alert()`. |
| **11** | `/` court profile: carousel, availability banner (computed counts), `RateCard` from rules, amenities, sticky CTA. | The banner number equals the number of free cells on the grid for the same day. Verified by counting. |
| **12–13** | **A11y pass — concentrated on `CourtMatrix`.** Modal accessibility is inherited from Radix and was checked on Days 3–4; the time goes to what no library provides: `role="grid"` semantics and the full key table, `aria-selected` (not `aria-pressed`), `aria-disabled` on blocked cells, `lang="th"` on the grid, `slotLabel()`, both live regions, focus rings everywhere, `alt` on every image, contrast fixes (LINE green, peak-on-white, disabled CTA), `lang="en"` on Latin fragments. | Full flow completed with keyboard only. VoiceOver with the Thai voice installed announces court, time, peak and price on the matrix. axe DevTools: 0 serious/critical on all nine routes, `/qr-demo` included — it is the one route a stranger's phone opens. |
| **14** | Hold expiry chain (`expiring` → `expired` → `/book/expired`), counter-payment variant end to end, conflict modal (built on `Modal`, so it arrives already accessible; re-run axe on `/book/review`), grid skeleton + error + retry, `DemoBar` (all demo flags and the live rate editor folded into it), `FixtureBadge`, `OutsideLineNotice`, the ~20 lines of `localStorage` instrumentation. | The hold reaches 00:00 unattended and lands on `/book/expired` with the slot released. The cash path produces a `pending_payment` booking visible in `/bookings`. The rate editor changes prices from the phone, with no laptop. |
| **15** | **Device pass.** iOS Safari, Android Chrome, and the LINE in-app webview (open the link from a LINE chat). Scan the QR with **three** different phones. 200% zoom, Reduce Motion, Larger Text, airplane mode after first load. Plus the **2-hour non-blocking LIFF spike**: a real LIFF app ID pointed at the static host, `liff.init()` behind `?liff=1`, and `shareTargetPicker` — log what happens, fix nothing. | **GATE 2 — §11 acceptance checklist fully green.** The LIFF spike result is written down, whatever it says. |
| **16** | `README.md`, `DECISIONS.md` (every §3 row + the file that would change it), demo rehearsal end to end twice with a stopwatch, buffer. | Someone who has never seen the app runs §12 unaided in 8–12 minutes. |

**Gates.** Gate 1 (Day 9) is the one that matters: if the flow is not clickable end to end on a phone by the close of Day 9, the plan is off-track and the response is to cut scope (S1, then the sold-out state), never to extend Days 5–6. Gate 2 (Day 15) is the ship gate.

**Why extend rather than cut to hold Day 5.** Cutting to fit meant webfont icons, four primitives, two drifting scroll panes instead of one grid, and a11y deferred to a follow-up that would never be funded. Three of those four land in the files §14 lists as *surviving into the real build* — so the saving would be borrowed from Plan 02 at interest. The one genuine saving, the sprite codegen, is taken.

**If there are two developers:** Dev A takes Days 5–9 and 14 (the state machine and the flow); Dev B takes Days 1–4, 10–11 (tokens, primitives, the two list screens). Days 12–13 and 15 are shared. That compresses to roughly 10 working days, not 8 — the state machine does not parallelise.

---

## 11. Acceptance checklist — status against the code (2026-10-06)

`[x]` = holds in the code. `[ ]` = does not hold yet, with what is missing. ~~Struck~~ = cut by Revision 5. Items that need a real phone or a screen reader are marked *(device pass)* — the code supports them, but nobody has recorded a pass.

### 11.1 Functional

- [ ] Cold open on `/` renders in under 2 s on a mid-range Android over 4G with no layout shift after the fonts land. *(device pass)*
- [x] The availability number on `/` equals the count of free cells on `/book` for the same day.
- [x] `/book` renders **13 rows** × **6 courts** = 78 cells, every row present, none skipped.
- [x] Tapping `c3@19` then `c3@20` produces one merged navy block and **฿440**.
- [x] All 13 state-machine rules behave as §8.2 (21 unit tests, §8.7).
- [x] Selecting 16:00–18:00 on a weekday shows **two** price lines totalling **฿400** (plus the free fee line).
- [x] Selecting 10:00–12:00 on a Saturday shows **฿440**.
- [x] Attempting a 4th hour shows the max-hours toast and does not extend.
- [x] Changing the date clears the selection.
- [x] The CTA is disabled with nothing selected and enabled with a valid range once the 250 ms quote lands.
- [x] The review screen's phone field is empty on arrival and rejects `12345`.
- ~~Selecting cash-at-counter changes the CTA label and skips the QR screen.~~ Counter is the only method.
- ~~The QR scans on three different phones and opens `/qr-demo`.~~
- ~~`บันทึก QR ลงรูปภาพ` puts the QR in the photo gallery.~~
- ~~The hold counts down from 15:00 and lands on `/book/expired`.~~
- [x] A booking made in the demo appears in `/bookings` with the right ref, court, time and total.
- [x] Cancelling a booking takes it out of `กำลังจะถึง` (status `cancelled`, shown under `ที่ผ่านมา`) and shows an inline toast, not `alert()`.
- [ ] `?reset=1` restores canonical state. *`resetDb()` exists; nothing calls it outside tests. Clearing site data is the only reset today.* A fresh browser does see the seeded fixture.
- [x] Every price on every screen is ฿180 or ฿220 per hour. **No ฿160, no ฿200, no ฿360.**
- [x] Every booking reference matches `^WC-\d{4}-\d{4}$`. *But the sequence lives in memory, so after a reload the next ref restarts at `…-0042` and can repeat one already in `localStorage`.*
- [x] Every phone number displayed for the venue is the sample `02-000-0000`; no real-looking company name, tax ID or LINE link appears anywhere (decision 9).
- [ ] Cancellation copy says **3 ชั่วโมง** on both screens that mention it. *Only `/book/review` mentions it; the cancel dialog does not.*
- [ ] Court 3 is described identically on the grid, the review, the ticket and `/bookings`. *Grid: `3` / `ยาง BWF / แอร์`; review: `คอร์ท 3 (พื้นยางเกรด BWF)`; success and bookings: `คอร์ท 3`.*
- [ ] Seeded bookings block their own slots. *The two upcoming seeds (`c3` 19–21 on `D.next`, `c1` 18–20 on BASE+5) have no availability block, so the grid shows those hours free.*

### 11.2 Accessibility — the gates plus the manual pass

`scripts/gate.mjs` is pure Node (no grep, same on every machine), runs in ~1 s, and is the first step of `pnpm check`. It has ten gates:

| Gate | Fails on |
|---|---|
| `data-alt` | `data-alt` in `src` — not an attribute; gives images no name |
| `zoom-lock` | `user-scalable` / `maximum-scale` in `src` or `index.html` |
| `py-0.2` | `py-0.2` in `src` — 47 occurrences in the mockups, always a typo |
| `chord-typo` | `จองคอร์ด` in `src` — "book a musical chord" |
| `remote-image` | `lh3.googleusercontent` in `src` — 136 refs that will 404 |
| `outline-none` | `outline-none` in a `.tsx` line with no `focus-visible` |
| `wrong-deps` | `sonner` or `lucide-react` in `package.json` |
| `tailwind-merge-v3` | any `tailwind-merge` that is not 2.x |
| `modal-drawer` | `react-dialog` in `sheet.tsx` or `selection-drawer.tsx` — they must stay non-modal |
| `raw-hex` | a 6-digit hex in any `.ts`/`.tsx` outside `components/icons/` (§11.3) |

*Known gap:* `modal-drawer` still lists `src/components/booking/selection-drawer.tsx`, which moved to `features/booking/pages/booking-grid/components/`. The missing path is filtered out silently, so today the gate checks `sheet.tsx` only.

Manual, before the demo is shown *(device pass unless noted)*:

- [ ] Tab through `/book` end to end — every interactive element shows the honey focus ring; the grid is one tab stop.
- [x] Arrow keys move within the grid; booked cells **are** reachable and announce `ถูกจองแล้ว`. *(code)*
- [ ] VoiceOver on a cell announces `คอร์ท 3 เวลา 19:00 ถึง 20:00 ว่าง ช่วงพีค ราคา 220 บาท`.
- [ ] Selecting announces via the polite live region; a rejection announces via the assertive one.
- [ ] Pinch-zoom to 200% on every screen: no horizontal page scroll.
- [ ] iOS Reduce Motion: no ping, pulse or bounce anywhere.
- [ ] iOS Larger Text at max: no clipped Thai; ฿440 still fits.
- [ ] Airplane mode after first load: fonts, icons, mascots and photos all render.
- [ ] Contrast spot-check: LINE CTA, peak price on white, the maintenance cell, the disabled CTA.
- [ ] axe DevTools on all six routes: **0 serious/critical**. *`app/a11y.test.tsx` checks in CI that every screen has one `h1` and named images and controls, that the grid is one tab stop with arrow-key movement, and that a booking can be made by keyboard alone. It does not run axe.*
- [ ] Every touch target ≥ 48×48 CSS px, including date pills and the copy button.
- [ ] Open the cancel modal with the keyboard: focus moves inside, Tab cannot leave it, Escape closes it, focus returns to the trigger. *`/bookings` does not pass `trigger` to `Modal`, which DESIGN.md §6 says focus return needs.* While `SelectionDrawer` is open, the grid still scrolls and accepts taps.

### 11.3 Foundation

- [x] `selection.test.ts` — 21 tests green, including the property test.
- [x] Zero raw hex in `src/**/*.{ts,tsx}` outside `tailwind.config.js` and `components/icons/` — enforced by the `raw-hex` gate. (`index.html` carries one, `theme-color`, and is not gated.)
- [ ] `RATE_RULES` is the only place ฿180 and ฿220 appear. *The seeded bookings in `fixtures.ts` repeat ฿220 in their quote lines, and the grid passes the 19:00 price to `LegendBar` as its peak example.*
- [x] `nav-config.ts` is the only place a nav label appears.
- [x] `venue.phone` is the only place a venue phone number appears.
- [ ] Every screen imports from `data/api`, never from `data/db`. *`/bookings` reads through `useDb()` (§6.6).*
- [ ] ~~`DECISIONS.md` records every §3 row.~~ Not written; §3 and the Appendix of this plan are the record.
- [x] Every file in `components/icons/` uses `currentColor`, has no fixed `width`/`height`, and imports nothing at runtime; `LICENSE-material-symbols.txt` is present.

---

## 12. The demo script

Eight to twelve minutes. Rehearse it twice with a stopwatch. **Hand them the phone at step 3 and do not take it back.**

Setup: open the link on an unlocked phone, with `?fast=1` if you are pressed for time. Clear the site data beforehand if anyone has booked on that phone before — there is no reset control yet (§11.1).

| # | You do | You say (Thai) |
|---|---|---|
| 1 | Open `/` and hold the phone up. Let the availability card land. | "นี่คือหน้าสนามของพี่ที่ลูกค้าเห็นตอนกดจากไลน์ครับ" |
| 2 | Point at the availability card. | "ตรงนี้อัปเดตสดครับ วันนี้เหลือกี่ช่วง ลูกค้าเห็นเลย ไม่ต้องทักมาถาม" |
| 3 | **Hand them the phone.** Say nothing else. | "ลองจองคอร์ท 3 ทุ่มนึงถึงสามทุ่มดูครับ" |
| 4 | Watch them. Do not coach. They tap `จองคอร์ทเลย`. | *(silence)* |
| 5 | They tap `คอร์ท 3` at 19:00, then 20:00. Let them see the merge. | "เห็นไหมครับ สองช่องต่อกันเป็นก้อนเดียว ราคารวมขึ้นเองเลย ฿440" |
| 6 | They tap `จองทันที`. | "ทุกอย่างสรุปให้แล้ว ค่าคอร์ทช่วงพีค 220 คูณสอง ไม่มีค่าธรรมเนียม" |
| 7 | **Point at `ชำระที่หน้าร้าน` and stop.** This is the question the whole demo exists to ask. | "ตอนนี้ลูกค้าจองแล้วมาจ่ายที่เคาน์เตอร์ครับ — ทุกวันนี้พี่รับเงินยังไงครับ? อยากให้ลูกค้าจ่ายล่วงหน้าไหม?" |
| 8 | **Listen. Write the answer down.** | *(their answer decides Plan 05)* |
| 9 | They type a phone number and tap `ยืนยันการจอง`. | "ไม่ต้องรอแอดมินกดยืนยัน คอร์ทล็อกให้ทันที" |
| 10 | Success screen. Point at the booking number. | "ลูกค้าได้เลขจองไว้แจ้งพนักงานตอนมาถึงครับ" |
| 11 | Tap `ดูการจองของฉัน`. | "ลูกค้าย้อนดูได้เอง ยกเลิกเองได้ ไม่ต้องถามหน้าร้าน" |
| 12 | Go back to the grid, tap the day marked `เต็ม`. | "แล้วถ้าวันไหนเต็ม ระบบไม่ปล่อยให้ลูกค้าหลุดไปครับ — พาไปดูวันถัดไปให้เลย" |
| 13 | Swipe the date strip to **Saturday**, point at the daytime prices. | "ตรงนี้คือเรทวันหยุดครับ พีคทั้งวัน" |
| 14 | **The close.** Ask for their rates and peak hours. | "ราคาและช่วงพีคของพี่คือเท่าไหร่ครับ? ตัวเลขพวกนี้เป็นข้อมูล แก้ได้โดยไม่ต้องเขียนโปรแกรมใหม่ครับ" |

**Beats that carry the pitch:** step 3 (they do it unaided — if they need coaching, that is the finding), step 5 (the merge, which is the one interaction nothing else in the market does well), step 7 (the question `critique.md` #1 says nobody has asked), step 13 (rates-as-data, which is what a multi-venue product is worth).

*Dropped with what was not built:* the QR scan and auto-confirm (Revision 5), the LINE share (Revision 5), the waitlist toggle, and the live rate edit in `DemoBar`. Step 14 makes the rates-as-data point in words; editing `RATE_RULES` live needs a laptop.

**Things to volunteer before they ask.** Every one of them, unprompted — see §13.

---

## 13. What is faked, and the honest caveat for each

Say these out loud. A demo that oversells gets caught in the first five minutes of the second meeting, and the whole relationship is priced off that moment.

| Faked | How | Say this (Thai) |
|---|---|---|
| Backend | `db.ts` in memory + `localStorage`, behind `api.ts` | "ตอนนี้ข้อมูลอยู่ในเครื่องครับ ยังไม่มีเซิร์ฟเวอร์ ของจริงจะบันทึกไว้ที่ระบบกลาง" |
| The venue's data | Fixture: 6 courts, ฿180/฿220, พีค 17:00–21:00 | "ตัวเลขพวกนี้ผมสมมติมาก่อนครับ ของจริงใช้ของสนามพี่ทั้งหมด" |
| Availability | Seeded blocks; nobody else is booking | "ตารางนี้เป็นตัวอย่างครับ ของจริงจะอัปเดตตามคิวจริงแบบสด" |
| Payment | None. Every booking is pay-at-the-counter | "ตอนนี้ยังไม่มีการจ่ายเงินในระบบครับ ลูกค้ามาจ่ายที่หน้าร้าน ถ้าพี่อยากให้จ่ายล่วงหน้า เป็นขั้นต่อไป" |
| Locking the court | The booking blocks the slot, but only on this phone | "การล็อกคอร์ทเป็นของจริงในเครื่องนี้ครับ ของจริงจะล็อกทั้งระบบ ไม่มีใครแย่งได้" |
| LINE login | No login at all; the demo opens in a normal browser | "ของจริงลูกค้าจะล็อกอินด้วยไลน์ครับ ตอนนี้ผมข้ามขั้นนี้ไปก่อน" |
| The mascot and photos | Local assets, AI-generated | "รูปกับมาสคอตเปลี่ยนเป็นของสนามพี่ได้ครับ" |
| Cancel | Frees the court and marks the booking cancelled; no money involved | "ยกเลิกแล้วคอร์ทว่างกลับเข้าระบบทันทีครับ" |

**What is deliberately absent, and why it matters:** there is no QR of any kind. Revision 5 cut the payment screen, so the demo never shows a code that a banking app could parse. If prepayment comes back (Plan 05), the archived S6 in §9 is the spec, and the QR must still never be a valid-looking EMVCo/PromptPay payload aimed at a merchant ID we do not control.

---

## 14. What survives, what is thrown away

### Survives into the real build, unchanged

| Artifact | Why it survives |
|---|---|
| `tailwind.config.js` + `index.css` | The only reconciliation of 48 divergent inline configs that will ever be done. Settles D51, D52, D53, D54, D55 by compiling them once. |
| `features/booking/selection.ts` + its 21 tests | 13 behavioural rules the backend must re-validate and no mockup prototypes. Pure functions, zero UI dependencies. (The hook around it, `use-slot-selection.ts`, is Adapt: its quote call becomes a request.) |
| `data/types.ts` | **This is Plan 02's API contract.** Plan 02's first task is a server that returns exactly `Booking`, `Slot`, `AvailabilityBlock`, `Quote`. |
| `rates.ts` + `booking-ref.ts` | Pure functions with no I/O. `quote()` moves to the server verbatim; `nextBookingRef` becomes a Postgres sequence with the same format. |
| `components/ui/*` (16 primitives: 8 adapted from shadcn, 8 ours, incl. `Modal`) + `lib/use-roving-focus.ts` | Typed, token-driven, a11y-correct. Nothing in them knows about booking. `Modal` keeps its Radix Dialog core. |
| `SlotCell` + `CourtMatrix` a11y semantics | `role="grid"` with row/column indices, `aria-disabled`, `aria-selected`, roving tabindex, `slotLabel()`, separate polite and assertive regions. The hardest thing here to retrofit. |
| `layouts/nav-config.ts` | Settles D59/D61 and kills five competing nav models. |
| `components/ui/icon.tsx` + `components/icons/` + the self-hosted font setup | Committed source that cannot be forgotten per-file, unlike the CDN links 15 mockups omitted. Adding an icon later is one paste and one line. |

### Thrown away

`db.ts` and its `localStorage` layer, plus the one `useDb()` read in `/bookings` (replaced by a real API), the fixture *contents* (the shapes stay, the data becomes the venue's), `clock.ts`'s `defaultDemoDate()` and `advance()`, and roughly 60% of the `features/*/pages/*/index.tsx` markup once real loading, error and permission states arrive. `DECISIONS.md` was never written; §3 and the Appendix of this plan carry the ~25 closed `register.md` rows instead.

**Estimated discard: ~12% of files, ~25% of lines.** Everything discarded is data or scaffolding. Nothing discarded encodes a decision.

### What Plan 02 gets on day one

A compiled design system; a working, tested interaction model for the hardest screen in the product; a typed API contract to build a server against; four screens' worth of components; and ~25 settled decisions that would otherwise be argued in sprint planning.

---

## 15. Risks

*Status 2026-10-06: risks #1, #2 (the share and `navigator.share` part), #6 and #7 concern features Revision 5 cut and are moot; #3 and #4 were mitigated (the state machine is tested, the gate runs first in `pnpm check`); #13 was overtaken by Revision 6 — shadcn is adopted, and the gate now blocks only `sonner`, `lucide-react` and `tailwind-merge` v3 (with the `modal-drawer` path gap noted in §11.2).*

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **The QR does not scan** on the venue owner's phone. Kills the most physical moment of the pitch. | Med | High | Test on **three** phones on Day 15 — iOS Camera, Android Camera, and the LINE in-app scanner. `errorCorrectionLevel: 'H'` so the centre mascot token does not break it. Keep a printed fallback in your bag. |
| 2 | **The LINE in-app webview breaks something** only found on Day 15. | Med | High | Open the link from a real LINE chat on Days 1–2 (empty shell) and again on Day 9 (Gate 1), not only on Day 15. The known hazards are `100dvh`, `env(safe-area-inset-*)`, and `navigator.share`. |
| 3 | **The state machine takes longer than two days.** It is 13 rules and 19 tests. | Med | High | Days 5–6 are protected and headless — no UI, no styling, nothing to yak-shave. If it slips, cut S1 (Day 11) and the sold-out state, never Days 5–6. The whole demo rests on this file. |
| 4 | **The dev ports the mockup HTML instead of building components**, and re-imports all 48 files' defects. | High | High | `scripts/gate.mjs` runs from **Day 1**, before any screen exists, so the first violation fails immediately rather than after 40 files. §11.3's "zero raw hex in `src/`" check is the backstop. |
| 5 | **The venue owner asks a question the demo cannot answer** — multi-venue, memberships, walk-ins, the owner's own screen. | High | Med | §13's caveat table plus one prepared sentence: *"อันนั้นอยู่ในเฟสถัดไปครับ วันนี้ผมอยากให้พี่ดูเรื่องจองคอร์ทก่อน"*. Write down every question; they are Plan 03's scope. |
| 6 | **The answer to step 7 is "cash only, no prepayment"** and half the payment work was pointless. | Med | Med | This is a *feature* of the plan, not a failure — it is exactly why the demo comes before the foundation. The cost exposed is ~1.5 days (`/book/pay` + QR). The cash path is already built and already the fallback. |
| 7 | **`?demo=1` or `FixtureBadge` is left on** in a shared link and looks unfinished. | Med | Low | Both are off by default and query-gated. Add to the Day 11 rehearsal checklist. |
| 8 | **Thai text overflows** at large system font sizes, especially `เลือกได้เฉพาะชั่วโมงติดกัน` in a toast and `฿440` in the drawer. | Med | Low | Days 12–13 test at iOS max text size. Toasts are 2-line-tolerant by design; the drawer total is `tabular-nums` and never wraps. |
| 9 | **A stakeholder reads the 20.5-day foundation-first plan and asks why this one is shorter.** | Med | Med | §0 answers it directly: the four load-bearing files are built to the same standard; what was cut is screen chrome and six loading states, and the order was reversed so an unvalidated assumption cannot consume three weeks. |
| 10 | **`localStorage` is unavailable** (private mode, some webviews), and every write throws. | Low | Med | Every read and write is wrapped in try/catch and falls back to memory-only. Covered by the Day 15 device pass. |
| 11 | **Court/rate fixtures turn out wrong** after the venue interview, and the demo has to be re-shot. | Med | Low | This is a one-file edit by construction (D05, D06). It is the cheapest thing in the plan to be wrong about — and demonstrating that in front of the owner is step 15. |
| 12 | **Scope creep from the other 39 mockups** — "can you just add the scoreboard?" | High | Med | §2.2 names every out-of-scope folder explicitly. The answer is a date, not a no: *"อยู่ในแผนถัดไปครับ"*. |
| 13 | **Someone reaches for `npx shadcn add`** — especially `sheet` or `toast` — and pulls in `tailwind-merge` v3 or turns the drawer modal. | Med | High | §4.5 rules, and two §11.2 gates that fail on the packages and on a Dialog import in `Sheet`/`SelectionDrawer`. |
| 14 | **shadcn.io changes format or naming, or requires a token for copying**, on Day 1. | Low | Low | Only Day 1 touches the site, and the result is committed. Fallback: paste the same glyphs from Google's Material Symbols SVG source. |

---

## Appendix — every mockup contradiction this plan resolves

Each row goes back to `register.md`. (`DECISIONS.md` was not written; this table is the record.)

| # | Conflict | Resolution | Register ref |
|---|---|---|---|
| 1 | Booked = red / maintenance = grey (`_1`) vs exactly inverted (`2.`) | Booked = grey + 45° hatch; maintenance = `error-container` + dot grid. *Corrects `ds.md`'s draft.* | D53 |
| 2 | ฿160 (`2.`) / ฿180 (`_1`) / ฿200 (`empty_state`) / ฿360-per-2h (`_3`) | ฿180 standard, ฿220 peak, everywhere, from rate-rule data | D03, D05 |
| 3 | Peak 17:00–21:00 (both grids) vs 17:00–22:00 (`winner_court_1` rate card) | **17:00–21:00**; 21:00–22:00 returns to ฿180. Deviates from D04 | D04′ |
| 4 | `_1` skips the 12:00, 14:00 and 16:00 rows | 13 continuous rows, generated by a loop | D02 |
| 5 | The same Friday is both bookable (`2.`) and fully booked (`_2`) | The default day stays bookable; BASE+3 is the sold-out day; the alternate points at BASE+4 | new |
| 6 | `_2` claims `ว่าง 8 คอร์ท` at a 6-court venue | Count free **slots**, not courts (`countAvailableSlots`). *The planned dev assertion was not built.* | D01 |
| 7 | Court 3 is ยางเขียว / ปาร์เกต์ / ยาง BWF / ยางเกรด BWF across 4 files | One court table; Court 3 = ยาง BWF + แอร์. Marked `assumed` | D06 |
| 8 | Three venue phone numbers, one of which is prefilled as the *user's* contact | One `venue.phone`; the user's number is different and the field ships empty | D07 |
| 9 | Six booking-reference formats | `WC-YYMM-NNNN`, per-venue-per-month sequence | D09 |
| 10 | Hold: 10 min (PRD) vs `15 นาที` (`_3`) vs a `9:42` seed (`promptpay_qr`) | 15 minutes in `VENUE.holdMinutes` (ADR-001 §3.3). *The hold left the demo with Revision 5; `api.createHold` keeps the shape for Plan 04.* | D15 |
| 11 | Cancellation 3 hr (mockups, twice, in user-facing copy) vs 4 hr (PRD) | 3 hours, interpolated from one constant | D16 |
| 12 | Five nav models; `จองคอร์ด` in 23 files | One `nav-config.ts`; `จองคอร์ท`; two tabs rendered, four declared | D59, D61′ |
| 13 | `_2`'s body says 18:00–21:00, its own card says 18:00–20:00 | *Moot as built:* the sold-out screen offers only the next day, with no time window | new |
| 14 | `คัดลอกเลขบัญชี` whose handler copies the tax ID | *Moot:* the payment screen that carried it was cut (Revision 5) | D18 |
| 15 | Two legends for the same grid; two labels for the same CTA | One `LegendBar`; one CTA label, `จองทันที`, in every state | new |
| 16 | `#606C38` (the success olive) used for the peak chip and `bolt` icon in `2.` | Peak is honey (`secondary`); success is olive (`success`). Never crossed | D52 |
| 17 | `รวมภาษีมูลค่าเพิ่มแล้ว` with no tax line | Claim removed pending the venue's VAT position | D74 |
| 18 | `จองคอร์ทสำเร็จ (รอบ 4/3)` and an unexplained `รอบ 4` pill | Both deleted | new |
| 19 | 136 remote `lh3.googleusercontent.com` refs and `data-alt` in place of `alt` | Local assets; real Thai `alt` on every image; `data-alt` CI-gated | D56 |
| 20 | `user-scalable=no` in 38 files; `focus-visible` in 0 | Zoom permitted everywhere; a global focus ring; both CI-gated | D57′ |

---

**Approved 2026-09-15:** the §0 spine decision, the four D-row deviations (**D04′** peak window 17:00–21:00, **D19′** cash kept, **D23′** waitlist toggle kept, **D61′** two tabs), and the 16-day estimate with its Day 9 gate. Full record in Revision 4.
