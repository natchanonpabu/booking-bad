# Plan 00 — Roadmap

**Winner Court · วินเนอร์ คอร์ท** — badminton court booking + social platform for LINE LIFF.

Status of this document: **living index.** It names every plan, the order they run in, and what each one is waiting for. It is not itself a plan — it holds no build instructions. Each numbered plan in `documents/plans/` does that.

---

## 1. Where this project actually is

`prd.md` says **"Ready for Implementation (Production Design Complete)."** That sentence is wrong, and it is the most expensive sentence in the repository, because while it stands it keeps authorising someone to start porting screens whose numbers disagree with each other.

What exists is 48 Google Stitch mockups of genuinely high visual quality and a PRD written around them. What the audit found underneath: roughly **20–25% of a shippable product** — the data model and business rules about 10% resolved, API and IoT contracts 0%, auth/legal 0%, and the owner-facing product (half the stated B2B business model) **0 screens**. The deliverable carries a contradictory data model (12 courts vs 6, 17:00–23:00 vs 09:00–22:00, five different booking-reference formats, two incompatible match-scoring universes), **five palettes** where the design spec declares one, and **zero** auth, loading, error or empty states outside a single hand-drawn empty screen. There is no repository, no `package.json`, and no line of application code.

None of that makes the work bad. It makes it **visual design direction, not a specification** — and the job of these plans is to convert one into the other without discarding the part that is good.

**Action tied to this section:** in the same commit as the first closed decision, change the PRD status line to `Visual Design Direction Approved — Specification and Data Model Pending`.

---

## 2. The supersession rule

Adopt this on day 1, in the first commit. It is what stops the same argument being had four times.

1. **`documents/plans/` and `documents/audit/register.md` supersede `prd.md` and every mockup.** Where a plan and the PRD disagree, the plan wins.
2. **Where the 48 mockups agree with each other and disagree with the PRD, the mockups win** and the PRD is amended. Six courts, not twelve. 09:00–22:00, not 17:00–23:00.
3. **Where a signed `venue-facts.md` disagrees with either, the venue wins.** These are facts about a building, not opinions.
4. **`documents/stitch/` is frozen, read-only reference from commit 1.** Do not fix the typo (`จองคอร์ด` → `จองคอร์ท`), the palettes or the invalid Tailwind classes in place across 23–44 files. Fix each once, on the way out, in the token package and in `navConfig.ts`.
5. **A decision that does not name a value in a fixture, a column in a migration, or a deleted file is not closed — it was a discussion.**

---

## 3. The sequence of plans

| # | Plan | Delivers | Depends on | Rough size |
|---|---|---|---|---|
| **00** | **Roadmap** (this file) | Order, supersession rule, open questions | — | — |
| **01** | **Frontend booking demo** ✅ *approved 2026-09-15* | The 9 booking mockups clickable end-to-end on a phone; production-grade tokens, slot-selection state machine + tests, typed fixture, booking-ref generator | Nothing | **16 working days, 1 dev** · Gate 1 (clickable) day 9 |
| **02** | **Pre-development decisions & external clocks** | Signed venue facts, register closed, v1 cut line signed, four external clocks started (venue, PSP/prepay, legal, slip vendor) | A founder with a calendar and a real venue | **~4 weeks calendar, ~2 person-weeks** · runs **in parallel with 01** |
| **03** | **Foundations: repo, tokens package, schema** | pnpm workspace, stack ADR, `packages/tokens` promoted out of Plan 01, `0001_core.sql` with the exclusion constraint, fixture-as-specification | 02 (venue facts) | 1.5–2 weeks |
| **04** | **Real booking** | LIFF auth + ID-token verification, availability view, server-side hold, confirm; Plan 01's UI rewired to a real API; `MockLiff` and webhook replay harness | 01, 03 | 3–4 weeks |
| **05** | **Money** | Whichever of prepay-via-acquirer *or* book-online/pay-at-counter the venue actually wants; receipt; refund path | 02 (the prepay answer + KYC), 04 | 1.5–3 weeks — **the range is the whole point** |
| **06** | **Owner ops surface** | Exactly four screens: today's board, 15-second walk-in entry, mark paid/refunded/no-show, block a court for maintenance | 04 | 1.5–2 weeks |
| **07** | **The missing screens & the legal pages** | Home dashboard, booking detail, cancel/refund confirm + status, receipt, LIFF-outside-LINE fallback, consent, ToS, privacy — plus loading/error/empty states across every flow | 02 (legal), 03; needs a **named designer** | 2–3 weeks |
| **08** | **v1 launch & pilot instrumentation** | Error tracking, DB backup/restore, missed-webhook reconciliation, the one pilot metric, go-live | 04–07 | 1 week |
| **09** | **Split bill** *(contingent)* | Bill creation, per-person tracking, aggregate-only LINE card | 02 Spike 1 returning **yes**; 08 | 3–4 weeks |
| **10** | **IoT check-in** *(contingent)* | Inverted-QR authorisation, MQTT, fail-open relay, two courts | 02 clamp meter clearing its threshold; 08 | 3–4 weeks + procurement |
| **11** | **v2 modules** | Scoring, insights, duels, leaderboard | 02 gang audit returning **yes**; a shipped v1 | Not estimated |

Plans **03–11 are outlines below, not plans.** Each gets written as a full document when the plan before it is approved — writing Plan 06 today would be writing it against assumptions Plan 02 is in the middle of destroying.

---

## 4. Why Plan 01 goes first, in parallel with Plan 02

This is the one sequencing choice in the roadmap that looks wrong at a glance, so it is argued explicitly.

The honest reading of the pre-development draft (`documents/audit/predevelopment-draft.md`) is that **weeks 2–4 of it are development, relabelled** — schema, tokens, ten components, the LIFF adapter, a walking skeleton. Its own critique says so (#5). And its root dependency — a signed venue — runs on someone else's calendar. So the question is not *"should we wait?"* but *"what can we build during the wait that survives every answer?"*

Plan 01 is that work, and it is safe for three specific reasons:

1. **It settles only cheap decisions.** Tokens, the booked/maintenance chip inversion, one nav model, the slot-selection rules, the reference format. None of these are facts about a building; all are already unanimous across the mockups or are pure engineering calls. Plan 01 does not touch the expensive ones — prepayment, tenancy, the owner console, PDPA.
2. **Reversal is cheap by construction.** Rates, hours, court count and the peak window live in `data/rates.ts` as **data, not constants** (D05). If the venue signs and says eight courts, 08:00–23:00, ฿250 peak, that is a fixture edit, not a rebuild. Plan 01 flags its four deviations from the register (D04′, D19′, D23′, D61′) at its own foot precisely so a reversal is a one-line diff against a named row.
3. **It produces the foundation regardless of outcome.** Four artifacts are built to production quality and carried into Plan 03 unchanged: `tailwind.config.js`, `useSlotSelection.ts` + its 19 tests, `data/types.ts` / `rates.ts` / `bookingRef.ts`, and the `CourtMatrix` / `SlotCell` accessibility semantics. Everything in `screens/` is openly labelled scaffolding. There is no scenario in which Plan 02's answers make a correct token set or a tested state machine worthless.

And it buys something Plan 02 cannot buy on its own: **a thing to put in front of a venue owner.** Plan 02's hardest task is getting a signature from someone who has been pitched court-booking systems before. Walking in with a phone that books a court beats walking in with a PDF. Plan 01's Gate 1 lands on day 9 — inside the same fortnight as the first venue conversations, and the shell is openable from a real LINE chat from day 2.

**What this parallelism is not:** it is not permission to start Plan 04. The moment the demo needs a database, it is waiting on Plan 02.

---

## 5. Outlines of the later plans

**02 · Pre-development decisions & external clocks.** Four emails on the first morning, before any meeting about courts or colours: the slip-verification vendors (*can any Thai API verify a PromptPay transfer whose recipient is a private individual's account you do not own?*), one licensed acquirer for a merchant application and fee quote, one Thai fintech-**and**-PDPA lawyer on a single two-page brief, and the target pilot venue. These start clocks measured in weeks and cost four hours. Then the work that costs nothing while you wait: sit at the venue's front desk for one full 19:00–21:00 peak evening and write the requirements document that does not exist; produce a signed `documents/venue-facts.md` answering D01–D07, D16, D19, D22; **ask the venue the question the whole plan hangs on — "ทุกวันนี้เก็บเงินยังไง แล้วอยากให้ลูกค้าจ่ายล่วงหน้าจริงหรือเปล่า?"** — because if the answer is "pay at the counter," Plan 05 halves and the acquirer KYC leaves the critical path entirely; check on day **0** whether a registered juristic person even exists (KYC cannot start without one, and Thai company registration is itself 2–4 weeks); pitch 6–10 venues, not one; run a small concierge pilot by hand (LINE OA + a Google Sheet + the venue's printed QR) so the missing screens are *observed* rather than guessed; audit six gang organisers to decide Modules 5–7 on evidence; install a ฿1,500 clamp meter with its decision rule written **before** the measurement; and sign a one-page v1 cut line with a budget and a launch date, both of which appear nowhere today (D71). Exit is **six hard gates**, not a forty-item checklist that will never all be true on the same Friday.

**03 · Foundations.** The repository already exists — Plan 01 ran `git init` in `booking/` and built `apps/liff/` there — so this plan adds the small workspace around it — `apps/liff`, `apps/api`, `packages/shared` — not nine packages of monorepo ceremony for a team of two. Stack ADR with reasons: Vite SPA over Next.js (`liff.init()` resolves only in the browser), Fastify on Cloud Run with `min-instances=1` over Lambda (it must hold MQTT and server-side timers), Tailwind **v3.4 pinned, no v4 migration**. Plan 01's token config is promoted to `packages/tokens` as a preset plus `--wc-*` custom properties, self-hosting Noto Sans Thai. Then `migrations/0001_core.sql`, whose single most important line is the `EXCLUDE USING gist` constraint that makes double-booking impossible **at the database level** — three separate code paths insert bookings and application guards will not survive all three. All money is `bigint` satang. Availability is a **view**, never a materialised slot table. `venue_id` on every table from the first migration even though the owner surface is four screens. Rates and hours are rows in `rate_rule` and `venue_config`, which is what makes the 10-vs-15-minute hold and 3-vs-4-hour cancellation conflicts evaporate rather than needing to be won.

**04 · Real booking.** The walking skeleton, then the flow: LIFF init → server-side ID-token verification → availability from a real DB → hold with server-side expiry → confirm. Plan 01's screens keep their components and lose their `setTimeout`s. Three pieces of harness earn their keep and are built here — `MockLiff` behind a `VITE_LIFF_MODE` flag (this moves ~90% of development into Chrome with HMR, a 3× loop-speed multiplier for a team this size), the LINE webhook **raw-body** capture registered ahead of Fastify's JSON parser (the #1 day-one bug on every LINE integration), and captured real webhook payloads with a signed replay command. `liff.state` is handled in the router before any route is written. Then break it three ways on purpose: let the hold expire while payment is in flight, deliver the webhook twice, and — the one the draft omits — **never deliver it at all**, which is the failure that puts a paid customer at a court the system shows as free.

**05 · Money.** Deliberately unestimatable until Plan 02 answers one question. If the venue wants prepayment: acquirer integration, a real EMVCo PromptPay payload with a correct CRC16 rendered by a real QR library (every "QR" in all 48 mockups is a decorative SVG that encodes nothing and would not scan), webhook idempotency, refunds. If the venue is happy with book-online/pay-at-counter: a deposit or nothing at all, and this plan is a week. Either way the money-boundary sentence is an architectural constraint adopted now and printed verbatim in the ToS and the checkout copy: **"Winner Court never holds, transfers, or settles funds."**

**06 · Owner ops surface.** Four screens, not a B2B console. A 6-court Bangkok venue on a Friday night cannot run without walk-ins and cash, and if a booking can be paid in cash then a human must be able to mark it paid — which is why cutting cash *and* deferring the owner screens simultaneously produces a system no venue can operate for a single day (D65). Today's board, 15-second walk-in entry, mark paid/refunded/no-show, block a court for maintenance. Analytics, payout reconciliation, multi-venue switcher, staff roles and white-label theming are v2. Time the front desk with a stopwatch during peak **before** designing it, so "faster than the whiteboard" is a number.

**07 · The missing screens & the legal pages.** The largest unstaffed workstream in the project and the one most likely to destroy its single strongest asset. v1 as scoped needs roughly 15 net-new screens that exist in none of the 48 files: home dashboard (D60 — every mockup starts mid-journey and a LIFF cold-open has nowhere to land), booking detail (D62 — `_3` has no entry point to anything, and every button on it is dead), cancel + refund confirm + refund status, receipt (D74), LIFF-opened-outside-LINE fallback (D11), consent, ToS, privacy policy — **a LINE OA cannot go live without a privacy policy URL, so three of these are v1-blocking regardless of what the lawyer says** — plus loading, error and empty states across every flow. Shipping fifteen developer-drawn screens beside eight Stitch-quality ones is how the visual quality gets thrown away. **Name who draws them and budget it before this plan is written.**

**08 · v1 launch & pilot instrumentation.** Three cheap absences, all currently missing: error tracking (in a LINE webview a client-side exception is otherwise invisible forever), a Postgres backup/restore plan for the only copy of a venue's Friday-night bookings, and the analytics to measure the one pilot metric — *"30 online bookings completed and paid at the pilot venue within 4 weeks of launch"* — which is worth more than all five of the PRD's unmeasurable KPIs. Also the LINE push policy, which follows from a number nobody has multiplied: pushes-per-booking × per-message overage against ~฿40–80 of margin on a ฿440 booking (D76). Default: every v1 message is user-initiated via `shareTargetPicker` (free) except booking confirmation and the T−30 reminder.

**09 · Split bill** *(contingent on Plan 02's Spike 1).* The product's stated wedge, and the module most likely not to be physically possible as drawn. Every Thai slip-verification product scopes verification to a **registered receiving account**; the mockups verify transfers into an organiser's personal PromptPay. If no vendor will do that, D24/D26/D28 and the six-value verification enum are void, and the written fallback — organiser self-registers their receiving account, or the venue collects per person, or it becomes an honour-system tracker with the word *"ตรวจสอบแล้ว"* deleted from the UI — is chosen before code, not after. Whatever survives, the group card shows **aggregate progress only** (*"4/5 จ่ายแล้ว"*): publishing a named individual's unpaid ฿120 into their friends' LINE group is a PDPA disclosure, and LINE cannot edit a sent message, so the "updates automatically" promise in two mockups is copy that has to be deleted, not backlogged (D29, D30).

**10 · IoT check-in** *(contingent on the clamp meter).* D37's own recommendation is that this does not ship in v1. It becomes a plan only if wasted lighting clears the threshold written down in advance. If it does, the architecture is already decided and it makes the security model free rather than expensive: **a static printed QR on each court pole encoding only `venue_id + court_id`, scanned inside an already-authenticated LIFF session, with the server checking whether this `line_user_id` holds a confirmed booking for that court in that window before publishing MQTT.** That deletes the pole scanner from the BOM, the rotating tokens, the permanent PIN `4389` currently broadcast in plaintext by a `navigator.share`, and the second unauthenticated "Cloud Trigger" override. Non-negotiable: the relay **fails open** — the failure that costs the venue money is lights stuck on overnight — and certified commercial relays with a licensed install, two courts, after the simulator passes. The PIN and the Cloud Trigger button get deleted from the mockups now, whether or not this plan is ever written.

**11 · v2 modules.** Scoring, insights, duels, leaderboard — 24 of the 48 mockups, and the least ready 24. Building the retention layer of a product that cannot yet take a booking is the failure mode this whole roadmap is sequenced against. Gated on the gang audit: if ≥4 of 6 organisers keep no record and cannot name last week's winner, these are cut on evidence rather than taste. One thing is recorded now even though the module is cut, so v2 does not re-litigate it and a second parallel schema is never created: the two match universes are **one** universe, resolved by a per-format deuce flag on `match.format` (D40) — not by the 21-point-cap argument, which does not hold.

---

## 6. Open questions that block later plans

Summary only. The authoritative list is **`documents/audit/register.md`** — 72 rows, D01–D78, each with conflicting evidence, a recommended answer, a decider and a severity. Do not re-derive these in a standup.

| Question | Register rows | Blocks |
|---|---|---|
| **Does the pilot venue want prepayment at all, or is pay-at-counter fine?** The single cheapest question in the project; it halves or doubles Plan 05 | D17, D19, D73 | **05**, and the shape of 04 |
| Is there a registered juristic person? KYC cannot start without one | — (critique #2) | **05** |
| Venue facts: courts, hours, rate card, peak window to the minute, cancellation window, VAT status | D01–D07, D16, D22, D74 | **03**, and reverts Plan 01's fixture |
| Can any Thai API verify a P2P slip into an account we do not own? | D24, D26, D28 | **09** — and possibly the business |
| Does the owner console ship in v1? Largest single scope swing in the project | D65 | **06** |
| Multi-tenant from day one? (`venue_id` everywhere — retrofitting tenancy is a rewrite) | D66 | **03** |
| PDPA: named payment status in a group chat; slip retention in days; who is the data controller — venue or platform? | D30, D72, D75 | **07**, **09**, and a clause in the pilot contract |
| Are the 13 LINE Flex previews specifications or mood boards? | D64 | Every Flex estimate |
| What does LINE messaging actually cost per booking? | D76 | **08** |
| Home screen and booking detail — both blockers, neither designed | D60, D62 | **07** |
| Team, budget, deadline — stated nowhere | D71 | **Everything** |
| Do gangs keep scores today? | D69, D70 | **11** |

**Three-working-day timebox:** any open decision past three days is closed by the named decider choosing *the option that deletes the most schema*.

---

## 7. How to use these documents

- **Building something?** Read the plan for it in `documents/plans/`, and only that plan. Each is self-contained by design.
- **Need a fact — a price, an hour, a court count?** `documents/audit/register.md` first, then `venue-facts.md` once it exists. Never `prd.md`.
- **Wondering why a decision went the way it did?** The plan that made it says so at the point of decision. Plan 01's §3.5 carries its eight contested calls with reasoning; its appendix lists every mockup contradiction it resolves.
- **Deviating from the register?** Flag it at the foot of your plan with the row ID and a prime mark (Plan 01 has four: D04′, D19′, D23′, D61′). A deviation that is written down is a decision; one that is not is a bug.
- **Opening a mockup?** `documents/stitch/` is frozen reference. Read it, do not edit it.
- **`prd.md`** is kept for its vision sections and its problem statement, which are good. Every number in it is superseded.

### Where the audit artifacts live

`documents/audit/` — the evidence base behind everything above. All of it is analysis, not authority; where it disagrees with a plan, the plan wins.

| File | What it is |
|---|---|
| `register.md` | **The canonical decision register.** 72 rows, D01–D78, each with a recommended answer |
| `ds.md` | As-built design system: the real token set, the two missing tokens (`success #606C38`, `line #06C755`), invalid classes, a11y audit, a ready `tailwind.config.js` |
| `ia.md` | Information architecture, the end-to-end flows, the missing screens, the duplicate pairs |
| `model.md` | Data-model reconstruction and the twelve schema conflicts C1–C12 |
| `gaps.md` | What is drawn but backed by nothing |
| `booking-screens.json` | Structured extraction of the 9 booking-flow mockups — the source of Plan 01's fixture |
| `predevelopment-draft.md` | The 4-week pre-development draft. **Source material for Plan 02, not itself authoritative** |
| `predevelopment-draft-critique.md` | 20 corrections to that draft. **Where the two disagree, the critique wins** |

---

## 8. Status

| Plan | State |
|---|---|
| 00 Roadmap | This document — living |
| 01 Frontend booking demo | **Approved 2026-09-15.** Built at `booking/apps/liff/`. `documents/plans/01-frontend-booking-demo.md` |
| 02 Pre-development decisions | Outlined here. Should start the same week as 01 |
| 03–11 | Outlined here only. Written when the plan before is approved |

**Next action:** approve or amend Plan 01, and — independently of that decision — send Plan 02's four emails.
