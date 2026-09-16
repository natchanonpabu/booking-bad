# Winner Court — What To Do Next, Before Writing Any Feature Code

## The answer, in one paragraph

**On Monday morning of week 1, before any meeting about courts, colours or screens, send four emails and start one clock that nobody has started: sign a real pilot venue.** Everything else in this document is downstream of that. The twelve schema conflicts (C1–C12) and the 78 rows of the Decision Register feel like the urgent work because they are legible — but D01–D07, D16, D19, D22, D35 and D50 are not decisions at all, they are *facts about a building*, and answering them internally is exactly how you manufacture a fifth rate card with a founder's signature on it. Meanwhile four things run on external clocks measured in weeks and only start when someone sends an email: the acquirer's merchant KYC, the slip-verification vendor's answer to a question nobody has asked (**can any Thai API verify a PromptPay transfer whose *recipient* is a private individual's account you do not own?** — if the answer is no, Module 3 as drawn in `member_slip_upload_verification` and `split_bill_line_share` is an architecture dead end, not a design gap), the combined fintech/PDPA legal memo, and the pilot venue agreement itself. Four hours of work on day 1 buys three weeks of calendar. Then you spend those three weeks doing the work that costs nothing to do while you wait: closing the register against real venue facts, building the engineering harness that makes those answers checkable in CI, and running the whole product by hand for two real gangs with real money so the missing screens are *observed* rather than guessed. Four weeks. Development starts Monday of week 5.

---

## Ground rules that make the rest of this work

Adopt these on day 1, in the first commit, or the plan degrades into a standing meeting.

1. **Supersession rule.** `docs/decisions/` supersedes both `prd.md` and every mockup. Where the 48 mockups agree with each other and disagree with the PRD, the mockups win and the PRD is amended. Where a signed Venue Facts sheet disagrees with either, the venue wins.
2. **A decision that does not name a `table.column` is not closed — it was a discussion.** Every register row terminates in a value in `packages/fixtures/seed.ts`, a column in `migrations/0001_core.sql`, or a deleted file.
3. **Three-working-day timebox.** Any open decision past three days is closed by the named decider choosing *the option that deletes the most schema*.
4. **Change the PRD status line in the same commit as the first closed decision.** `Ready for Implementation (Production Design Complete)` → `Visual Design Direction Approved — Specification and Data Model Pending`. While that sentence stands it keeps authorising someone to start porting screens whose numbers disagree.
5. **`documents/stitch/` is frozen, read-only reference from commit 1.** Do not fix the typo, the palettes or the invalid classes in place across 23–44 files. Fix them once, on the way out, in `packages/tokens` and `navConfig.ts`.
6. **Write down the budget and the deadline.** They appear nowhere in this project (D71). Every parallel track below is re-costed against 1–3 actual people; if there is only one developer, §"If you only have one dev" says what slips.

Deciders: **F** founder · **VO** venue owner · **P** product · **E** engineering · **L** legal.

---

## Day 1 — four emails, four hours, three weeks of calendar

Owner: **F**. Do these before the first standup.

| # | Email | The exact question | Why it cannot wait |
|---|---|---|---|
| 1 | SlipOK, EasySlip, KBank & SCB developer portals | *"Can your API verify a PromptPay transfer whose **recipient** is a private individual's phone-linked account that we do not own or control? If yes, what registration must that individual complete, and what is the per-check price?"* Log the answer verbatim with contact name and date. | Every Thai slip-verify product I know of scopes verification to a **registered receiving account**. If that holds, D24/D26/D28 and the six-value `slip.verification_status` enum are all wasted work, and Module 3 needs re-architecting, not redesigning. |
| 2 | One licensed acquirer — 2C2P, Omise or GB Prime (D17) | Merchant application + written fee quote (per-transaction, settlement time, KYC doc list, onboarding lead time in weeks). | KYC for a Thai juristic person is 2–6 weeks. It is free to start and it gates the only real PromptPay QR you will ever generate. Do **not** go direct to SCB/KBank Open API — three KYC onboardings for one QR. |
| 3 | One Thai fintech-**and-data** lawyer — a single two-page brief, two questions | (a) If we never receive funds but mark a booking paid from an acquirer webhook, are we in scope for BOT payment-business licensing? (b) If we algorithmically declare that gang member X paid organiser Y, are we in scope, and is pushing *"ปาล์ม ยังไม่ได้โอน ฿120"* into a LINE group a PDPA disclosure requiring that member's consent? | Combine fintech and PDPA into **one** engagement — two separate opinions is real cash on an unstated budget. **This is not a gate on development.** The money-boundary answer is already known: *"Winner Court never holds, transfers, or settles funds."* Adopt it as an architectural constraint on day 1 and buy the opinion to attach to a venue contract. |
| 4 | Target pilot venue | A written 3-month pilot agreement: use of courts and lighting circuit, electrician access, fee arrangement, defined end date, one staff member trained. | D01–D07 are unanswerable without a real owner in the room. So is the IoT insurance question — it needs a counterparty. So does the whole business memo. |

---

## Start these on day 1 in parallel — engineering, zero product dependencies

None of the following depends on a single answer from C1–C12 or the Decision Register. Owner: **E1** (+ **E2** where noted).

**Hour one — the decaying asset.** All 56 distinct `lh3.googleusercontent.com/aida/…` URLs currently return HTTP 200. They are ephemeral Stitch generation URLs and 136 references across 44 files depend on them.

```
grep -roh 'https://lh3\.googleusercontent\.com/aida[^"'\'' )]*' documents/stitch | sort -u
```
→ 56 URLs → `packages/assets/reference/<sha1>.<ext>` + `manifest.json` mapping url → local file → referencing screens → the identity it stood in for. Classify every one as **reshoot** (venue photography), **runtime** (`liff.getProfile().pictureUrl` — never store player avatars), or **mascot-vector**. **No AI-generated raster reaches the ship path.** In the same pass strip every `data-alt` containing a raw generation prompt (`30_pre_match_notification` still carries *"A portrait photograph of Ken, a Thai young male badminton player…"*) and convert `data-alt` → real `alt` — today **no image in the product has an accessible name**.

**Day 1 afternoon → day 3 — repo and stack ADR.** `git init`; commit `documents/` untouched. pnpm workspace, but **only the packages that earn their place before the cut line is signed**: `apps/liff` (Vite 5 + React 18 + TS strict), `apps/api` (Fastify, Node 22), `packages/tokens`, `packages/ui`, `packages/flex`, `packages/liff-adapter`, `packages/fixtures`. Not nine packages, not `apps/admin` yet, not eight CI gates.

`docs/adr/001-stack.md` with reasons, not the PRD's "Next.js **or** Vite / Lambda **or** Cloud Run":
- **Vite SPA, not Next.js** — `liff.init()` resolves only in the browser, so every route would be `'use client'`; you'd get a Vite app plus an extra runtime, a second secret surface, and RSC/router caching fighting the LINE in-app webview's aggressive cache.
- **Fastify on Cloud Run, `min-instances=1`, not Lambda** — the process must hold a persistent MQTT client, WebSocket fan-out, and the server-side `end−5min` warning and `auto_off@end` timers (D34). Lambda cannot.
- **Tailwind v3.4, pinned. Do not migrate to v4.** Half the dead classes (`shadow-xs` ×56, `shadow-2xs`, `backdrop-blur-xs`, `rounded-2xs`) are v4 *names*, which makes upgrading look like the fix. The config's compressed radius scale (D54) and dual family/size scale are v3 semantics throughout. The migration is a week you do not have.

`docker-compose.yml`: postgres:16, redis:7, eclipse-mosquitto:2.

**Days 3–5 — tokens (D51, D52, D53, D54, D57).** `packages/tokens` emits a Tailwind preset + `--wc-*` CSS custom properties. Adopt the M3 YAML set that 38/48 files already consume byte-identically. **Add the two tokens the codebase actually needs and does not have:** `success: #606C38` (148 hardcoded occurrences across 25 files — the most-used colour in the product, with no token, which is why PAID badges render near-black against `tertiary: #131a00`) and `line: #06C755` (36 occurrences) with `line-a11y: #04803a`. Fold the six divergent chat wallpapers and five header bars into one each. Ship the plugin: `.no-scrollbar`, `.font-num` (tabular-nums), `.pattern-booked` / `.pattern-maintenance`, and a global `:focus-visible` ring — `focus-visible` appears **0 times in 48 files**. Correct the viewport meta (38 files ship `user-scalable=no`, a WCAG 1.4.4 failure). Self-host Inter / Noto Sans / **Noto Sans Thai** — 15 files never load the Thai face while rendering ~95% Thai copy.

**Days 3–5 (parallel, E2) — the LIFF environment and `MockLiff`.** This is the single highest-leverage piece of infrastructure in the project. `grep -i liff` across all 48 files returns exactly **one** hit — an `aria-label` string. Every "share to LINE" in the deliverable is a `setTimeout` that swaps its own button label.
- Three LIFF apps (dev/staging/prod — the endpoint URL is a per-app property). One Messaging API channel per developer; they are free and cheaper than building a webhook fan-out.
- **Named** `cloudflared` tunnels per dev, not free ngrok — ngrok reassigns the hostname on every restart and you'd edit the LINE console daily.
- `packages/liff-adapter`: one interface (`init`, `isInClient`, `getProfile`, `getIDToken`, `shareTargetPicker`, `openWindow`, `scanCodeV2`, `getContext`), two implementations behind `VITE_LIFF_MODE=real|mock`. `MockLiff` returns a fixture user and a signed fake ID token the local API accepts. **This moves ~90% of development into Chrome with HMR** instead of a phone in hand per hot reload — a 3× loop-speed multiplier for a team this size.
- Handle `liff.state` in the router **before writing any route** — LINE strips and re-appends query strings as `?liff.state=`. Unit test: `/?liff.state=%2Fbill%3Fid%3D123` resolves to the bill route with `id=123`.
- Design and write the **LIFF-opened-outside-LINE fallback screen**. It exists in none of the 48 files, and every one of them assumes a resolved `userId` (D11).

---

## The workstreams

### W1 — Sign the venue and take ground truth from it (F · week 1, closes day 5)
**Why here:** it is the root dependency. Without a real counterparty, D01–D07 produce founder-invented numbers, and W7's schema freeze inherits them as fact.

- Sit at the front desk for one full evening session, 19:00–21:00 peak. Write two pages: how a walk-in is taken, what happens on a no-show, how a cancellation refund is actually handled today, who turns the lights on, what breaks. **This is the requirements document that does not exist.**
- Produce and get signed `documents/venue-facts.md` (Thai, owner's signature): exact court count and IDs (**D01** — 6, not the PRD's 12); surface enum and AC per court (**D06** — Court 3 currently has five different surfaces across five mockups); opening/closing time per day-of-week (**D02** — 09:00–22:00, not 17:00–23:00); the complete rate card grid with the peak window **defined to the minute** (**D03/D04** — peak is 17:00–21:00 in `_1` and `2.` but 17:00–22:00 in `winner_court_1`); cancellation window and refund % (**D16** — mockups say 3h, PRD says 4h); no-show policy; VAT registration status and Tax ID (**D74** — `winner_court_2` asserts *รวมภาษีมูลค่าเพิ่มแล้ว* with no VAT line); real hotline, real PromptPay, real Maps place URL (**D07** — `081-234-5678` currently serves as venue hotline, organiser PromptPay *and* the user's pre-filled emergency contact simultaneously).
- **Ask the owner-console scoping question verbatim and record the answer:** *"ถ้าเราทำระบบให้ แต่ไม่มีหน้าจอสำหรับเจ้าของเลย — คุณใช้ไวท์บอร์ดรับ walk-in เหมือนเดิม เราดูแลเฉพาะการจองออนไลน์ — คุณจะยังทดลองใช้ไหม?"* This is the largest single scope swing in the project (**D65**). Do not assume it.
- Get the lighting fixture spec sheet and the electricity tariff. Without a tariff and a baseline, the PRD's *"15–22% reduction"* is unfalsifiable forever.

**If no venue signs by day 19:** every venue fact in the register is stamped `assumed — venue-unconfirmed` and the schema freeze proceeds on assumptions that are *labelled as assumptions*. That is survivable. Silently treating Stitch's six courts as fact is not.

---

### W2 — The business memo: one paying customer, one revenue line, a budget, a deadline (F · days 2–3, 2 days)
**Why here:** it is a load-bearing *engineering* question, not a business question for later. It decides whether the owner console is v1-blocking, whether cash-at-counter must exist, and whether `venue_id` goes on every table.

- One page. Pick exactly one: (A) venue SaaS — venue pays ฿X/month; (B) marketplace take-rate; (C) free gang tool, no v1 revenue. **Recommended: (A), flat monthly per venue, 0% commission, free for players (D67).** Thai venues resist per-booking commission; a predictable monthly fee sells.
- Produce **our** rate card — what a venue pays *us*. Three tiers max, real THB figures. It exists nowhere in the deliverable and **you cannot sign a pilot with a blank price.** Price-test it out loud in every venue conversation and record the objection verbatim; three owners saying *"฿3,000 แพงไป"* is data, silence is not.
- Set a checkable v1 revenue target: *"3 venues × ฿2,500/month signed by [date]."* If that cannot cover the team, model (A) is disproven and you rewrite the memo rather than starting development.
- **Write down the budget and the launch date.** Signed, dated.

**The cash coupling, decided deliberately and not by a cut list:** three of the four candidate plans cut cash-at-counter (`winner_court_2`) on the grounds that it bypasses the payment webhook. A 6-court Bangkok venue on a Friday night cannot run without it, and if a booking can be paid in cash then *a human must be able to mark it paid* — which makes an owner surface non-optional. **Recommendation: keep cash, and scope the owner surface to exactly four screens** (today's board, 15-second walk-in entry, mark paid/refunded/no-show, block a court for maintenance). That is 1.5–2 weeks of build, not the 6–8 weeks of a B2B SaaS console. Analytics, payout reconciliation, multi-venue switcher, staff roles and white-label theming are **v2** (D65, D66). Cutting cash *and* deferring the console simultaneously produces a system no venue can operate for a single day.

---

### W3 — The concierge pilot: run the whole product by hand, zero code, for the entire window (P · starts day 2, runs weeks 1–4)
**Why here:** it is the highest information-per-baht item available and it runs entirely in parallel by construction. Its output is the artifact nobody has: an **observed** missing-screens list.

- A LINE OA + one Google Sheet (three tabs: availability, bookings, bills) + the venue's printed PromptPay QR. Setup: half a day, ฿0.
- Two real gangs book their weekly session through the OA for three consecutive weeks, with real money. A human replies within five minutes, checks the sheet, confirms, takes payment.
- For every split bill, the human posts a hand-made summary into the gang chat and marks people paid as slips arrive. Record per bill: time-to-first-payment, time-to-100%, nudges sent, **slips you could not verify by eye**.
- **Log every decision the human had to make that no mockup covers** — a cancellation, a late arrival, a no-show, a wrong amount, a double payment, a 7th player added after the bill was posted. Each one is a missing screen. This list feeds W8's unhappy-path seed rows with real cases instead of invented ones.
- Success bar, written before you start: ≥6 bookings completed, ≥4 bills settled to 100% with real money, ≥1 gang asking unprompted to book week 4. Failure bar, equally explicit: if gangs revert to phoning the venue, or median time-to-100% is already under 2 hours with no tooling, the split-bill wedge is weaker than assumed.

---

### W4 — Gang audit: make the Modules 5–7 cut on evidence (P · week 1, 6 organisers, 1 week)
**Why here:** cutting 24 of 48 files on an engineer's taste does not survive week six when the leaderboard comes back up. Cutting them on recorded artifacts does.

Do **not** ask *"would you use a leaderboard?"*. Ask, of six real gang organisers who are not friends of the team:
- *"ตอนนี้เก็บสกอร์ไว้ที่ไหน ขอดูหน่อย"* — record what they show you: a notes app, a photo of a whiteboard, or nothing.
- *"สัปดาห์ที่แล้วใครชนะบ้าง"* — record whether they can answer at all.
- *"ขอดูสลิปล่าสุดที่มีคนส่งมาให้หน่อย"* — is the amount legible? the recipient? could you spot a forgery by eye? This is the direct evidence for or against D24.
- *"จองคอร์ทยังไง — คอร์ทเดิม เวลาเดิม ทุกสัปดาห์รึเปล่า?"* — if ≥4 of 6 say yes, "จองซ้ำเหมือนสัปดาห์ที่แล้ว" is one button, and three of the seven booking mockups are solving a problem those gangs do not have.

**If ≥4 of 6 keep no record and cannot name last week's winner, Modules 5–7 are cut on evidence.**

Also: two days of **incumbent scan** (P). Six named live Thai sports-booking products, with pricing and screenshots, and one written answer: *does any of them do split bill inside LINE?* If one does, the wedge is gone. If none does, that sentence is the strongest line in the pitch. And ask at every venue visited: *"มีคนมาขายระบบจองคอร์ทให้ไหม ใครบ้าง แล้วทำไมไม่ใช้?"* — the reasons they rejected the last vendor are the reasons they will reject you.

---

### W5 — LINE feasibility and the push cost model (E1 · week 1, 3 days)
**Why here:** it is the highest-value engineering output of week 1 because it can retroactively cut features that survived the day-3 scope decision, and it costs a spreadsheet plus a free simulator.

- **The cost model, first.** `line_live_score_flex_message` advertises *"อัปเดตล่าสุดทุก 15 วินาที"*. A 52-minute match is **~208 metered pushes × every member of the group**, against roughly ฿40–80 of margin on a ฿440 booking. Nobody has multiplied those two numbers. Build the spreadsheet: LINE OA plan tiers × per-message overage × pushes per booking × average group size 5–8, versus gross margin. **Publish the break-even push count per booking** (D76).
- **Then write the push policy, and it follows from the number.** Default: **every v1 LINE message is user-initiated via `liff.shareTargetPicker` (free), except exactly two automated pushes — booking confirmation and the T−30 reminder.** Live-score broadcast, weekly leaderboard cron, and per-payment bill-progress cards are cut.
- Resolve **D29** as an engineering fact: LINE cannot edit a sent message, so the group card cannot *"อัปเดตยอด… ทันทีอัตโนมัติ"* as `member_slip_upload_verification` and `split_bill_line_share` both claim. The card is a **static snapshot with a LIFF deep link**; exactly one replacement card is pushed, at 100%. Encode the debounce as a `UNIQUE` constraint on `line_message (entity_id, template, milestone)` so a retry cannot bypass it. **Remove the false promise from the copy, not just from the backlog.**
- Confirm the platform prerequisites nobody has checked: is the OA verified; does `shareTargetPicker` need specific channel config; **must the bot be a member of the gang's group for any push to work, and what is the real user journey to get it there?** A bot that cannot join the group makes half of Module 3 undeliverable.

---

### W6 — PDPA position and the three missing legal screens (L + P · weeks 2–3)
**Why here:** it is aimed squarely at the product's core mechanic, not at a compliance footnote. `grep login / เข้าสู่ระบบ / ลงทะเบียน` → **0 hits each** across 48 files.

- `100/` publishes the organiser's **legal name** (นายจิรภัทร สุขสมบูรณ์) beside a bank amount, and pushes named individuals' payment status, bank names and transfer timestamps into a group chat (*"นนท์ มือตบ • 18:35 น. • สลิป KBank"*).
- **Design the default now, before the opinion returns (D30):** the group card shows **aggregate progress only** — *"4/5 จ่ายแล้ว"*. First names and paid/unpaid live only inside the LIFF page, visible to people on the bill. Never legal names, never bank names, never per-person timestamps. Explicit consent at bill creation.
- Set a **retention rule in days** for slip images (D75) and put the deletion job in the schema plan. These are uploaded bank documents with account numbers and legal names.
- Write and design the three screens that exist nowhere: LINE Login/LIFF consent, privacy policy, ToS (D72). **A LINE OA cannot go live without a privacy policy URL** — these are v1-blocking regardless of what the lawyer says.
- The money-boundary sentence goes into the ToS, the checkout screen copy and the split-bill screen copy, verbatim: *"Winner Court never holds, transfers, or settles funds."*

---

### W7 — Close the register into a schema (P + E1 · week 2, 5 days)
**Why here:** it can only start once W1 delivers real venue facts. Everything in it terminates in a value, not a paragraph.

The decision register ships alongside this plan; do not restate it. What week 2 does is convert it into `docs/decisions/D0xx.md` files and then into columns. The four highest-leverage closures:

- **D09/D10 — one reference format.** `WC-YYMM-NNNN` for bookings, `DUEL-…` in a separate namespace, and passes carry **no user-visible ID** (they render the booking ref). This kills five of six live schemes (`#WN-2405-8839`, `#WN-2405-3`, `WN-2024-C03`, `#WC-88429`, `#WC-DUEL43`, plus the PRD's `#WC-202410-B84` which appears in zero files). It matters because the reference leaks simultaneously into the grid UI, a Flex card sitting permanently in a group chat, the QR payload, the bank-webhook matcher, and a possible Thai tax document. Choose it inside a controller in slice 1 and you will re-choose it four more times.
- **D38/D40/D41 — the two match universes are one universe.** A standard **BWF 21-point set with deuce and a hard cap at 30** is the *only* rule that produces the 30-28 scoreline already printed in `30_4_court_4_victory_summary` (28-28 → 29-28 → 30-28 is a legal win by two; the cap binds only at 29-29). One rule set explains both supposedly irreconcilable screens and deletes an entire parallel schema. **Record this even though Modules 5–7 are cut**, so v2 does not re-litigate it and the second schema is never created. Structure: `match` → exactly 2 × `match_side` → 1–2 × `match_participant`, with a check constraint keyed on `match.format`. Model 2v2 first — 2v2→1v1 is a subset, 1v1→2v2 is a rewrite.
- **D45/D46 — one append-only `exp_ledger`, zero stored totals.** `UPDATE` and `DELETE` revoked at the role level. `exp_total`, `level`, `wins`, `losses`, `win_rate_pct`, `current_streak` are views or generated columns. Any total stored as a column is wrong the day it is written — which is exactly why the displayed `+1,420` career total in `past_duels_history` reconciles with none of the three published EXP rate cards.
- **D31/D32/D33 — invert the QR direction.** This is the highest-value single technical decision available and it makes the security model *free* rather than expensive. Today `4_full_screen_court_light_qr_pass` prints a permanent PIN `4389`, ships a `navigator.share({text:'… รหัสสำรอง: 4389'})` that broadcasts it in plaintext into a LINE group, and adds a second unauthenticated "Cloud Trigger" internet override — two paths for anyone in that chat to energise an 800W lighting relay forever, with no booking. **Replacement: a static printed QR on each court pole encoding only `venue_id + court_id`. The player's phone scans it inside an already-authenticated LIFF session. The server checks whether THIS `line_user_id` holds a confirmed booking for THAT court in THIS window, then publishes MQTT.** This deletes the pole-scanner device from the BOM (no vendor, no quote, no lead time), deletes rotating-token infrastructure, deletes the PIN, deletes Cloud Trigger, and makes authorisation server-side by construction. A non-booker who scans the pole gets a 403 and no lights. Verify: `grep -rn '4389' documents/stitch` → 0.

**Schema hygiene that is not negotiable:**
- All money is `bigint` satang, `*_satang` naming, with a CI grep that fails any `numeric`/`decimal` money column. Pick THB floats during checkout and every split-bill rounding bug for the next year traces back to it.
- **The single most important line in the codebase**, on `booking`:
  ```sql
  EXCLUDE USING gist (court_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
    WHERE (status IN ('held','confirmed','checked_in','completed'))
  ```
  Double-booking must be impossible *at the database level* because three separate paths insert bookings — the LIFF client, duel-accept, and the counter walk-in — and application-level guards will not survive all three.
- **Availability is a VIEW** over `booking × rate_rule × venue_config`. Reject a materialized `court_slot` table *in writing* so it is not re-proposed in month two: 6 courts × 13 hours × 90 days is 7,020 rows of duplicated truth that drifts the instant a rate rule changes.
- **Rates and rules are data, not constants** (D05). `rate_rule` as three rows with an acceptance test that it reproduces the canonical ฿440 booking as 2h × ฿220. `venue_config` columns for `opens_at`, `closes_at`, `hold_minutes`, `cancellation_hours`, `timezone`, `reference_prefix`. The 10-vs-15 minute hold (D15) and 3-vs-4 hour cancellation (D16) conflicts **evaporate the moment they stop being constants**.
- `venue_id` on every table from the first migration, even though the owner surface is four screens. Retrofitting tenancy is the most expensive schema change you can be asked to make (D66).
- **`light_session.ends_at = booking.ends_at`, and there is no `duration_min` column.** The 60-vs-120-minute conflict between `4_court_light_turned_on_feedback` and `court_light_activated_feedback` is an artifact of storing a derived value; delete the column and the conflict cannot exist (D34).

---

### W8 — Fixture-as-specification and the reconciliation harness (E1 + P · weeks 2–3)
**Why here:** "we are ready to build" must be a CI check, not a standup opinion.

- `packages/fixtures/seed.ts` is where product's answers **land as values**. `pnpm test:contract` asserts every register field it depends on is non-null. **That test failing IS the objective "not ready to build" signal**, and it lives in CI where it cannot be talked past.
- The canonical spine, in one monotonic timeline that never deviates: bill created 17:40, transfers 18:35 / 18:40 / 18:42, bill closed 18:56, session 19:00–21:00. Today `line_100_line_flex_message_closed` closes the bill at 18:56 *before* a 19:00 session, `split_bill_line_share` timestamps the same two transfers at 21:05/21:12, and `line_match_insights_flex_message` posts finished insights at 21:07 for a match ending 21:42.
- **Seed the unhappy paths FIRST.** All 48 mockups are happy-path; seeding failure states is what forces the missing screens into visibility instead of leaving them for week 8. Required rows: a fully-booked date (drives `_2`), a court in maintenance, a past date, a booking in `pending_payment` with 30 seconds of hold left, an already-expired hold, a cancelled-and-refunded booking, a bill at 3/5 with one **REJECTED** slip, a device with a stale heartbeat.
- `scripts/reconcile.js`: grep every currency figure, court number, time string and reference out of the surviving mockups, diff against the fixture, print a `file:line` mismatch list, **exit non-zero**, run in CI. Known starting set: `_1` prices standard hours ฿180 while `2.` prices them ฿160; `_2` advertises *ว่าง 8 คอร์ท* at a 6-court venue; `winner_court_1` and `empty_state` both say *เหลือ 5 ช่วงเวลา* and render 3 chips; `line_line_chat_bubble_preview` says "3 of 5" while naming 4 people in a 6-member gang. **A fixture that cannot render a kept screen means a decision was wrong, not that the screen was.**
- `TZ=Asia/Bangkok`; store `timestamptz`, but model booking inventory as `play_date date` + local start time — a court booking is a local calendar day, not a UTC instant. `formatThaiDate()` unit-tested for Buddhist Era (`2024-05-24` → `วันศุกร์ที่ 24 พ.ค. 2567`) so BE arithmetic never appears inside a component.

---

### W9 — The local harness that keeps external dependencies off the critical path (E1 · week 3, 4 days)
**Why here:** three external systems gate development — the PSP (blocked on KYC), LINE webhooks (needs a phone and a tunnel), the relay (blocked on hardware). Each is a day's work to fake, and each has failure modes with **zero design coverage today**.

- **Fix the raw-body trap before writing the webhook handler.** LINE signs with HMAC-SHA256 over the **raw** body and Fastify's JSON parser destroys it. Register `rawBody` capture ahead of the parser. This is the #1 day-one bug on every LINE integration.
- Capture real webhook payloads once from a phone into `fixtures/line-webhooks/*.json` for `follow`, `unfollow`, `join`, `leave`, `memberJoined`, `postback`, `message.image` (the mockups' *"โอนแล้วส่งรูปสลิปเข้าห้องแชทนี้ได้เลย"* implies a second slip-ingestion path the LIFF modal does not cover). Then `pnpm webhook:replay <event>` POSTs with a correctly computed signature. **After this, ~95% of webhook work needs no phone.**
- `tools/fake-psp` with a **genuine server-side 10-minute hold** — today `promptpay_qr`'s countdown seeds at 9:42, freezes at 00:00, and leaves the CTA enabled with no handler.
- **Generate a real EMVCo PromptPay payload with a correct CRC16 and render it with a real QR library from day one.** Every "QR" in all 48 files is a decorative hand-drawn SVG that encodes nothing and would not scan.
- `tools/fake-relay` on local Mosquitto, subscribing to `wc/v1/venue/+/court/+/light/cmd`, with injectable faults (ACK latency, no-ACK timeout, device offline, `RELAY_FAULT`, overcurrent). **This makes the entire IoT flow developable with zero hardware and makes the undesigned failure states testable** — `4_court_light_turned_on_feedback` contains no JavaScript at all and renders success unconditionally.
- **The order of operations for hardware is: simulator passes → then order, for TWO courts, not six.** Ordering before the simulator proves the software path buys nothing and commits money to a module the clamp meter may legitimately cancel.

---

### W10 — Components 1–10 and the design freeze (E2 · weeks 2–3)
**Why here:** it is a hard dependency of the walking skeleton and the first component written, and it is three days of hygiene, not a crisis — 38 of 48 files already ship a byte-identical token config. Run it in week 1–2 alongside the external clocks, not serialized behind two legal opinions.

Extract exactly ten, all Slice-1 blocking: `AppShell`, `Button`, `Card`/`HeroNavyCard`/`InsetPanel`, `StatusPill`, `SlotChip`, `CourtTimeMatrix`, `DateStrip`, `StickyBookingDrawer`, `Toast`+`CopyButton`, `BottomSheet`. Rendered in one `/__catalog` route (not Storybook), viewable on a phone through the tunnel. **Stop at 10.** `TicketCard`, `QrPanel`, `CountdownChip`, `StatTile`, `MemberRow` are platform for a scope that does not exist yet.

- **Ship `AppShell` with the nav model injected as a data prop from a single `navConfig.ts` on day 1.** Five competing bottom-nav models are in circulation (D59); the IA decision is not engineering's to make, but it must not block. This makes it a one-file change instead of a 34-file rewrite. Fix `จองคอร์ด` → `จองคอร์ท` there, once, not across 23 files.
- **Settle the booked/maintenance inversion in `SlotChip` now (D53).** `_1` has booked = red, maintenance = grey; `2.` has it exactly inverted. **Booked = neutral grey + 45° hatch; maintenance = `error-container` + dot grid.** Booked is the common case and should not scream red; red belongs on the exception. Restore the non-colour pattern encoding that both design documents advertise as the accessibility guarantee and that only the component sheet implements. Render `<button disabled aria-disabled>` — today booked cells are `<div>`s, focusable and unannounced.
- `BottomSheet` gets `role="dialog"`, `aria-modal`, a focus trap and Escape on the first commit — `grep 'role="dialog"'` across 48 files returns **0**, and `member_slip_upload_verification` renders the app's bottom nav *underneath* its own sticky modal bar.
- Fix white-on-`#06C755` at **2.26:1** on the primary share CTA across 19+ screens.
- Rehabilitate the four mascot SVGs: rename `.html` → `.svg`, fix pose 2's racket head clipped off the artboard at `cy=-5` (at the exact focal point of the victory illustration), pose 1's racket-over-eye, pose 3's floating scarf; `role="img"` + `<title>`; dedupe shared geometry into a `<symbol>`. Commission **pose 5, defeat/consolation** — only winner states exist anywhere in the set.

**Four CI gates, aimed at named defect classes — not eight generic ones:**
1. `eslint-plugin-tailwindcss` `no-custom-classname: error` — kills `py-0.2` (47× / 24 files, silently no vertical padding on half the badges), `shadow-xs` (56×), `bg-surface-lowest` (12× — transparent tiles), `w-18`, `border-1.5`, `active:scale-98` at commit time.
2. `no-raw-hex` outside `packages/tokens` — **the only mechanism that stops a sixth palette appearing.**
3. `no-remote-assets` — the 136 hotlinks and the **unpinned** `<script src="https://cdn.tailwindcss.com">` in all 44 files.
4. Thai copy lint — fails on `จองคอร์ด`, `มุมคอร์ด`, `คอร์ด`, and stray Hangul/CJK inside a Thai string (`match_insights_wc_duel43` contains a Korean `적`).

Plus `no-secrets-in-bundle`: Vite inlines every `VITE_*` into the client. Only `VITE_LIFF_ID`, `VITE_API_BASE`, `VITE_LIFF_MODE`, `VITE_ASSET_CDN` are permitted; `LINE_CHANNEL_SECRET`, `PSP_SECRET_KEY`, `DATABASE_URL`, `QR_TOKEN_HMAC_KEY` are server-only.

---

### W11 — IoT: measure before you commit, and never gate on an insurer (E1 + VO · weeks 1–4, ~4 hours of work)
- **Day 2: install a ฿1,500 clamp meter or logging smart plug on the pilot venue's court lighting.** Two weeks of measurement. **Write the decision rule before the measurement, so it cannot be argued after:** wasted lighting outside booked hours **< ฿5,000/month → IoT is cut from v1 and v2** (no venue pays for a ฿50k install with a three-year payback); **> ฿20,000/month → it becomes the lead pitch and gets its own project.** This is the cheapest available resolution of the PRD's only quantified owner ROI claim, which is otherwise an unfalsifiable promise to the B2B customer.
- **Get a licensed Thai electrician's signed one-page load calculation** for the venue's *actual* fixtures. The mockups say "800W LED", the PRD says "500 lux" — different units, and neither is a load spec (D36). **This is obtainable and it is what actually governs the fire risk.**
- **Send the insurer/landlord a notification letter and log it. Do not gate on a reply.** A Thai SME insurer will not answer that in writing on a two-week timescale, and a plan that waits behind a letter that never arrives is a plan that never ships.
- **Prove the relay fails OPEN.** Kill the server mid-session and confirm the contactor releases via a device-side deadman/TTL. Server-side timers only for `auto_off@end` and the `end−5min` warning. **The failure mode that costs the venue money is lights stuck on overnight.**
- **Buy certified commercial MQTT relays** (Shelly Pro, Sonoff industrial or equivalent) with a licensed install and a physical interlock — do not hand-build ESP32 boards (D35). Certification and liability, not firmware, is what you are buying. Two courts. After the simulator passes.

---

### W12 — The v1 cut line, signed (F · day 3, 2 days)
One page, signed and dated, so it can be pointed at in week six when the leaderboard comes back up.

**v1 ships:** LINE login + consent · court profile · booking grid with real stateful multi-hour selection · checkout (PromptPay + cash) · confirmation + user-initiated LINE share · My Bookings + **booking detail** · cancel + refund · the four-screen owner ops surface. Nothing else.
**v1.5:** split bill (contingent on the vendor answer) · IoT check-in (contingent on the clamp meter).
**v2:** scoring, insights, duels, leaderboard.

Set the pilot success metric as a number, before any code: *"30 online bookings completed and paid at the pilot venue within 4 weeks of launch."* The PRD's five KPIs — 80% conversion, <1.2s relay latency, 65% share rate, 15–22% energy reduction — are unmeasurable on day one and three of them belong to modules being cut.

---

## The four spikes

| Spike | What it proves or disproves | Timebox | Kill condition |
|---|---|---|---|
| **1. Slip verification** — buy ฿20 of credit with whichever vendor answers yes; make three real PromptPay transfers between two personal accounts; call verify with (a) a genuine slip, (b) the same slip twice, (c) the right amount to the **wrong recipient**. | Whether Module 3 as drawn is *physically possible*. **Pass condition: the API distinguishes all three without human review.** | 3 days of work, up to 2 weeks calendar waiting on replies. Starts day 1. | If no vendor will verify a transfer into an account you do not control, D24/D26/D28 are void. Fall back, in writing, to: organiser self-registers their receiving account, OR the venue collects per-person, OR split bill is an honour-system tracker with **no verification claim anywhere in the UI** — and the word *"ตรวจสอบแล้ว"* is deleted. **This must never gate the v1 booking build.** |
| **2. Flex JSON** — author **four** real bubbles (`booking_shared`, `bill_request`, `bill_closed_100`, `waitlist_slot_free`), render in the free LINE Flex Simulator, screenshot each **beside its mockup**, circulate to design. | Whether the 13 Flex previews are specifications or mood boards (D64). Flex JSON supports only box/text/image/icon/button/separator/filler/span/video — no gradients, no `backdrop-blur`, no `animate-ping`, no `shadow-2xl`, no CSS grid, no negative-margin overlap, no icon fonts, no percentage bars except nested fillers. **Every one of the 13 uses forbidden features.** | 3 days, week 1. **Author four, not thirteen** — nine of the thirteen belong to Modules 5–7, which are being cut. | Whatever it shows, the founder acknowledges the visual downgrade **in writing** now, not in week 8 when design capacity is gone. Also verify button-label truncation empirically: `line_live_score_flex_message`'s *"เปิดดูกระดานคะแนนสดเต็มจอ (Live Scoreboard)"* already wraps in the mock and Flex buttons are single-line. Delete the fabricated **"LINE Flex Message Verified"** badge from `line_100_line_flex_message_closed` — LINE has no such badge; it is invented trust signalling on a payment card. |
| **3. Relay auth + fail-open** — run the inverted-QR flow end to end against `tools/fake-relay` first; then one bench unit. Test: broker unreachable, Wi-Fi down mid-session, device rebooted, two scans in five seconds, ACK never received, **server killed mid-session**. | That authorisation is server-side by construction and that the contactor **releases** when the server disappears. Measure and record median scan-to-ACK against the PRD's <1.2s. | 2 days simulated, 2 days bench, week 3. | If the relay does not fail open, IoT does not ship at any price. |
| **4. Walking skeleton** — real LINE app, real phone, **real mobile data**: LIFF init → server-side ID-token verification → list slots from a real DB → hold with server-side expiry → PSP sandbox intent → **a real scannable EMVCo PromptPay QR** → sandbox webhook flips booking to `confirmed` → one real Flex push into a real group → MQTT publish, relay clicks. Then break it **three ways on purpose**: let the hold expire while payment is in flight; deliver the webhook twice; send the command with the device powered off. | That all the pieces *compose*. The failure mode this catches costs a month: the PSP sandbox works, LIFF works, MQTT works, and then the LINE webview won't open the 3DS page, or ID-token verification fails behind the gateway, or the hold and the webhook race. | 5 days, week 4. **This is the go/no-go gate.** | If any of the three deliberate breakages produces a wrong booking state, the schema plan is wrong and W7 reopens. **Keep the code.** With 1–3 people the knowledge and the harness are not separable; the discipline that stops you building the product on a spike is the token package and the adapter interface, not deletion. |

**Plus one measurement, not a spike:** the clamp meter (W11), with its decision rule written in advance.

---

## The four-week calendar

| | **Founder / Product** | **Eng 1 (backend/platform)** | **Eng 2 (frontend/design)** |
|---|---|---|---|
| **W1 Mon** | **The four emails.** Then draft the business memo. | **Hour one: harvest 56 assets.** `git init`, freeze `documents/`, workspace scaffold, stack ADR. | Tokens package: M3 set + `success` + `line`, Thai fonts, viewport fix. |
| **W1 Tue–Wed** | Install the clamp meter. Stand up the concierge pilot (LINE OA + Sheet + printed QR). Recruit 6 organisers + 2 pilot gangs. Incumbent scan. | `docker-compose`, `.env.example`, secrets rule. **Flex spike (4 bubbles).** | Three LIFF apps, per-dev channels, named tunnels, **`packages/liff-adapter` + `MockLiff`**, `liff.state` router + test, outside-LINE fallback screen. |
| **W1 Thu–Fri** | **Sign the v1 cut line (day 3).** Venue site visit: full evening at the front desk, Venue Facts sheet, the owner-console question, the tariff and fixture sheet. First 3 gang audits. | **Push cost model + push policy published.** D29 resolved and the false copy removed. | On-device round trip: real `getProfile()`, real `shareTargetPicker` into a real group. Components 1–5. |
| **W2** | Close the register against the venue facts. Physically delete the losing duplicates. Change the PRD status line. Remaining 3 gang audits. Second venue visits with the price stated out loud. Pilot week 1 runs. | `migrations/0001_core.sql`: the exclusion constraint, satang money, `rate_rule` as data, availability as a view, `venue_id` everywhere. Reference generator + 1M-draw collision test. | Components 6–10, `SlotChip` inversion settled, `/__catalog`, four CI gates green. Mascot rehabilitation. Five owner-console wireframes + **stopwatch "before" timings at the front desk during peak.** |
| **W3** | PDPA position + aggregate-only group card redesign. ToS / privacy / consent screens drafted. Pilot week 2. | `fixtures/canonical.json` + **unhappy paths first**. `scripts/reconcile.js` driven to exit 0. `pnpm test:contract` green. Webhook raw-body + replay. fake-psp, fake-relay, real EMVCo QR. | Booking-detail screen designed (the single hardest break in the set — `_3` has **no split-bill entry point at all**). Port the grid to real components against the fixture. |
| **W4** | Pilot week 3 read-out: six numbers. Clamp-meter read-out against the pre-written rule. **Close the pilot agreement (day 19).** | **Walking skeleton + three deliberate breakages, on a real phone.** Relay bench + fail-open. Hardware ordered for 2 courts, or IoT formally deferred. | Owner ops surface wireframes → components. Flex bubbles posted into the two pilot gang chats; **count distinct taps and LIFF opens.** |
| **W4 Fri** | **THE GATE.** One meeting, one page. | | |

---

## What to delete or defer *today*

**Delete from the repository — not archive. An archived folder gets ported by mistake in week 6.**

- **`documents/stitch/candy/`** — a rejected hot-pink "Joyful Pop" direction (`#e040a0`, DM Sans) that ships in **0 of 48 files** and directly contradicts the Honey Oat spec's own rule against "aggressive, hyper-neon esports aesthetics". Leaving it is an active hazard: the next contributor reads it as a live brand option.
- **The losing half of every hard duplicate pair:** `4_court_light_turned_on_feedback` (abandons the token config entirely for a dark neon amber/emerald theme the design spec explicitly forbids — keep `court_light_activated_feedback`); `4_court_4_live_scoreboard` (keep `match_scoreboard`); `30_4_court_4_victory_summary` (keep `post_match_victory_card`); `match_insights_wc_duel43` (keep `match_insights_point_replay`); and one of the two victory Flex cards. Rename `past_duels_history`, which is *titled* "Duels Match Center" and collides with `duel_lobby_match_center`.
- **The PIN `4389`, its `navigator.share` handler, and the Cloud Trigger button** from `4_full_screen_court_light_qr_pass`. Not secured — **deleted**, regardless of whether IoT ships.
- **The fabricated "LINE Flex Message Verified" badge** in `line_100_line_flex_message_closed`.
- **The orphan `capybara_pose_*.html` files** as shipped artifacts — they move into `packages/ui/mascot` as fixed `.svg`s or they go.

**Move to `_archived_v2/` — the 24 Modules 5–7 folders,** once W4's gang audit returns: `4_court_4_live_scoreboard`, `match_scoreboard`, `line_live_score_flex_message`, `30_4_court_4_victory_summary`, `post_match_victory_card`, `line_post_match_duel_victory_flex`, `flex_message_line_post_match_summary_flex`, `match_insights_wc_duel43`, `match_insights_point_replay`, `line_match_insights_flex_message`, `player_career_stats`, `line_player_card_flex_message`, `leaderboard_ranking`, `line_flex_message_leaderboard_flex`, `duel_lobby_match_center`, `match_challenge_sheet`, `line_match_challenge_flex_message`, `duel_accepted_match_locked`, `line_flex_message_duel_accepted_flex`, `past_duels_history`, `rematch_challenge_sheet`, `line_rematch_challenge_flex_message`, `rematch_accepted_locked`, `line_rematch_accepted_flex`. Verify `ls documents/stitch | wc -l` drops by 24+.

**Delete from `prd.md` in the same commit as the first closed decision:** "12 courts" and "Courts 1–12" (§2, §4); "17:00–23:00"; "260 THB/hr"; `#WC-202410-B84`; "500 lux"; "50+ parking spaces"; the tier titles *Smash Master / Net Magician / Consistent Wall*; the "racket rentals, advance shuttlecock tubes" line in Module 2 (D20); and the five KPIs. **Every one of those appears in zero of the 48 files.** Leaving contradictory prose in place guarantees a developer finds it in month two.

**Cut features rendered as real but backed by nothing (D70)** — sixteen of them, each a table, a screen set and an integration: reviews & ratings (4.8 ★ / 142 รีวิว), waitlist, partner-finder board, per-point video replay and Court 4 Cam, auto-camera photos, court climate/wind telemetry (*"ลมปิด 0.0 m/s"*), calories (~48,200 kcal) and peak smash speed (284 km/h — there is no radar), the 24-badge collection (18 of which are undefined), PDF export, draft challenges, counter-offer negotiation, scouting reports, spectator reactions and share-EXP bonuses, in-app drink ordering, Coach Capybara AI verdicts, and card payment. **Delete the affordances from the surviving mockups so they stop reading as committed scope.**

**Cut before anyone proposes them:** Framer Motion (the mockups' entire motion vocabulary is `active:scale-95` and opacity toasts — that is CSS; 40KB in a LINE webview before the first feature is unearned weight); the Material Symbols webfont (subset the 182 glyphs actually used into a sprite); `darkMode:'class'` (declared in 38 files with **zero** `dark:` variants authored); and the Tailwind v4 migration.

**Defer, explicitly:** white-label theming and the multi-venue switcher — but keep `venue_id` on every table. Shipping the "B2B SaaS / White-label" claim before any owner surface exists is selling something with zero design behind it.

---

## Exit criteria — the checklist that means "we may now write the first feature ticket"

**Facts and decisions**
- [ ] `documents/venue-facts.md` exists, signed by the pilot venue owner, with every mandatory field filled — or every venue-derived value in the register is stamped `assumed — venue-unconfirmed`.
- [ ] `docs/decisions/INDEX.md` shows every Tier-0/1/2 row **closed**, each naming at least one concrete `table.column` and carrying a decider and a date. Any row closed without a schema impact is reopened — it was a discussion.
- [ ] `prd.md`'s status line reads `Visual Design Direction Approved — Specification and Data Model Pending`, and `grep` for `12 courts`, `17:00`, `260`, `WC-202410`, `500 lux`, `Smash Master` in `prd.md` all return **0**.
- [ ] A one-page business memo names exactly one paying customer and one revenue line in THB, **with a budget figure and a launch date**, signed and dated.
- [ ] A founder-signed one-page v1 scope statement exists, naming Modules 5–7 as v2, with the M5–7 cut backed by the recorded answers of six gang organisers.

**Schema**
- [ ] `migrations/0001_core.sql` runs clean against an empty Postgres, is idempotent, and creates **no table whose governing decision is still open**. Table count under 16.
- [ ] A test proves two overlapping confirmed bookings on one court raise `exclusion_violation` — not caught in a controller.
- [ ] `fixtures/canonical.json` loads with no manual edits and these assert: `booking.total_satang = 44000`; `bill.per_person_satang = 12000`; the availability view returns 6 courts × 13 rows for the canonical date; the reference matches `^WC-\d{4}-[0-9A-HJKMNP-TV-Z]{4,5}$` with zero collisions over 1,000,000 draws.
- [ ] A hold past `hold_expires_at` disappears from the availability view **without a cron**.
- [ ] `grep` of the migration for stored `win_rate_pct`, `exp_total`, `per_person`, `paid_count`, `duration_min` returns **nothing** — all are views or generated columns. `checkin_pass` has no `backup_pin` column.
- [ ] `scripts/reconcile.js` exits **0** across every kept mockup. `pnpm test:contract` is green and the commit that made it pass is signed off by product.

**Engineering**
- [ ] A clean `git clone` reaches a running, seeded stack in under 5 minutes with **no LINE account and no external service**: `pnpm i && docker compose up -d && pnpm db:seed && pnpm dev`.
- [ ] On a real phone, in the real LINE app: the dev LIFF URL resolves `liff.getProfile()` to the tester's real name and picture, and `shareTargetPicker` delivers the `booking_shared` bubble into a real group.
- [ ] `pnpm webhook:replay <event>` returns 200 for all six inbound event types with a correct signature and **401 when tampered**.
- [ ] A screen recording exists of the walking skeleton end to end on mobile data, **plus three recordings of the deliberate failures behaving correctly**. Two numbers recorded: median scan-to-ACK, and grid-tap to paid-confirmation.
- [ ] A live PSP-sandbox PromptPay QR has been **scanned successfully by a real Thai banking app**, and the resulting webhook flipped a booking row to `confirmed`.
- [ ] `grep -r` across `apps/**` returns 0 for each of: `lh3.googleusercontent.com`, `cdn.tailwindcss.com`, `fonts.googleapis.com`, `data-alt`, `จองคอร์ด`, `py-0.2`, `shadow-xs`, `bg-surface-lowest`, `4389`. `grep -rE '#[0-9a-fA-F]{3,8}' apps/*/src` returns 0.
- [ ] The built `apps/liff/dist` contains no channel secret, access token, PSP key or HMAC key.
- [ ] `/__catalog` renders components 1–10 in every state, passes axe with 0 criticals, shows a visible focus ring on every interactive element, and no page blocks pinch-zoom.

**External and legal**
- [ ] A written answer, with a **named vendor contact and a date**, to the P2P slip-verification question — and if it is no, a signed decision on which fallback the split bill becomes.
- [ ] The money-boundary sentence is adopted, and appears verbatim in the ToS draft, the checkout copy and the split-bill copy. The lawyer's memo is commissioned (it need not have returned).
- [ ] A written PDPA position on publishing named payment status to a group, and the group bill card redesigned to **aggregate progress only**. A retention rule in days for slip images, with a deletion job in the schema plan.
- [ ] ToS, privacy policy and LINE Login consent exist as drafted files.
- [ ] A break-even LINE push count per booking is published, and the push policy naming exactly which two messages are automated is written down.
- [ ] Four Flex bubbles render in the Simulator, screenshots circulated beside their mockups, and the founder has acknowledged the degradation in writing. The remaining previews are labelled "mood board, not spec" in `prd.md` §5 and `ia.md` §3.
- [ ] A licensed electrician's signed load calculation exists; the insurer notification is sent and logged; hardware for **two** courts is ordered with a confirmed date, **or IoT is formally deferred in writing and the plan does not slip**.
- [ ] Concierge pilot read-out with six numbers, and a signed pilot agreement with a numeric success metric — or a written statement that eight venues declined, with three objections quoted verbatim.

**The readability test**
- [ ] One person who attended **none** of the decision meetings can read `docs/decisions/` and `migrations/0001_core.sql` and answer, unaided: *how many courts, what hours, what does an hour cost on a Saturday, what does a booking reference look like, who holds the money, and what happens when a payment hold expires.*

---

## If you only have one dev

Every parallel track above is re-costed honestly: at **1 developer**, weeks 1–4 become weeks 1–6, and in this order — asset harvest and repo (day 1), tokens + `MockLiff` (week 1), Flex spike (week 2), schema + fixture + reconcile (weeks 3–4), harness (week 5), walking skeleton (week 6). **What slips:** components 6–10, the owner-console wireframes, and the mascot rehabilitation. **What does not slip, at any headcount:** the day-1 emails, the concierge pilot (it is founder/product work, not engineering), the clamp meter, and the walking skeleton. Drop the bench relay to week 6 and accept the slip — but never drop the skeleton.

---

## The bottom line

**Four weeks, with development responsibly starting Monday of week 5** — three if the venue signs in week 1 and you accept the split-bill vendor answer arriving mid-build, six if there is only one developer. That is not a delay. It is the part of the work that was skipped, and `prd.md`'s "Status: Ready for Implementation (Production Design Complete)" is the sentence hiding it. Roughly ฿50,000–100,000 of external spend sits inside those four weeks — the combined legal memo, PSP KYC document prep, the electrician's load calculation, two courts of certified relay hardware, a ฿1,500 clamp meter, ฿20 of slip-API credit, a LINE OA plan, and whatever the pilot venue wants. **Get the quotes and write the number down before you commit to it**, because nobody in this project has yet written down what they can afford to lose.

If you skip this and start porting screens on Monday, the audit's prediction is the conservative version of what happens: three to four weeks of contradictory decisions litigated in standup, followed by a rewrite — with the reference format already sitting permanently in customers' LINE chat history, prices as floats, no tenancy column, and a schema built on six courts that Google Stitch drew rather than six courts that exist. That is the recoverable version. The unrecoverable versions are the ones this plan is actually sequenced against: a BOT finding, a PDPA complaint from a named person whose unpaid ฿120 was broadcast to their friends, and an electrical incident on Court 4 in a building you do not own. **The mockups are the most replaceable artifact in this room — one designer regenerates them in weeks. Those three are not.**