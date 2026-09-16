# Winner Court — Design Deliverable Critique & Readiness Audit

**Audited:** `documents/prd.md` + all 54 folders under `documents/stitch/` (48 `code.html` artifacts, 52 `screen.png`, 2 `DESIGN.md`)
**Verdict up front:** This is a strong, unusually thorough **visual exploration**. It is not "Ready for Implementation," and calling it that is the single most dangerous line in the PRD.

---

## 1. Auditing the PRD's own claims

### "Status: Ready for Implementation (Production Design Complete)" — **False**

Three hard, machine-verified disqualifiers:

| PRD claim | Reality across all 48 `code.html` |
|---|---|
| "Courts 1–12" (Module 1) | `grep "คอร์ท 7"` … `"คอร์ท 12"` → **0 hits, all six court numbers, all 48 files.** Every grid (`_1`, `2.`, `winner_court_1`) ships exactly 6 courts. |
| "1-hour time blocks (17:00–23:00)" | `grep "23:00"` → **0 hits in the entire set.** All 23 files that state hours say `09:00 - 22:00`. The bookable window in the design is 13 hours earlier and 1 hour shorter than spec. |
| "260 THB/hr" | `grep "260"` returns only SVG coordinates and a `setTimeout(2600)`. **The PRD's only stated price appears nowhere as a price.** The mockups ship ฿160 (`2.`), ฿180 (`_1`, `winner_court_1`), ฿200 (`empty_state`), ฿220 (peak, everywhere), and ฿110/person (`rematch_accepted_locked`). |
| Booking reference `#WC-202410-B84` | `grep "WC-202410"` → **0 hits.** Actual refs in circulation: `#WN-2405-8839` (`_3`, `line`), `#WN-2405-3` (`split_bill_line_share`, `check_in_pass_qr_code`, `line_100_...`), `WN-2024-C03` (`court_light_activated_feedback`), `#WC-88429` (`line_player_card_flex_message`), `#WC-DUEL31/35/39/41/42/43`. **Six incompatible ID schemes.** |
| Color tokens `court-green #2e7d32/#10b981`, `boba-amber #d97706/#f59e0b` | court-green: **0 files.** boba-amber: **1 file** (`4_court_light_turned_on_feedback`, and only because it uses stock Tailwind `amber-500`). The real success color is a hardcoded `#606C38` literal in **25 files**. |
| "LINE LIFF SDK v2.22+" integration | `grep -i liff` → **1 file**, and it is an `aria-label="Close LIFF window"` string in `member_slip_upload_verification`. **The SDK is loaded nowhere. `liff.shareTargetPicker` is called nowhere.** Every "share to LINE" button in the product is a `setTimeout` that swaps its own label. |

### "29+ high-fidelity production screens" — **numerically true, materially misleading**

48 HTML files clears 29. But strip it down:

- **−4** are mascot SVGs (`capybara_pose_1..4`), not screens — and each has a render bug (see §5).
- **−1** is a component sheet (`badminton_component_sheet_honey_oat_navy_court`) whose own header reads **"รอบที่ 1 … ทิศทางที่ 2"** ("Round 1 … Direction 2"). This is a pitch option, not a locked system. A rejected competing direction (`candy/DESIGN.md`, hot pink #e040a0) is still sitting in the deliverable folder.
- **−~16** are LINE Flex *previews* that cannot be built as Flex Messages (see §4).
- **−~10** are duplicates of screens that already exist, with conflicting data:

| Function | Screen A | Screen B | Conflict |
|---|---|---|---|
| Live scoreboard | `4_court_4_live_scoreboard` (Court 4, singles, 30pt, no deuce) | `match_scoreboard` (Court 3, doubles, 21pt, multi-set) | Incompatible data models; PRD specs only the first |
| Match insights | `match_insights_wc_duel43` (Ken/Mind singles) | `match_insights_point_replay` (Court 3 doubles) | Two different matches for one PRD screen |
| Victory summary | `30_4_court_4_victory_summary` | `post_match_victory_card` | Singles vs doubles, unlisted in PRD |
| Victory Flex | `line_post_match_duel_victory_flex` | `flex_message_line_post_match_summary_flex` | Two cards for PRD "Screen 7/36" |
| Light-on feedback | `4_court_light_turned_on_feedback` (dark neon, Court 4, 22°C) | `court_light_activated_feedback` (light sheet, Court 3, 23°C) | Different theme, court, party, session length |

**Honest count: ~20–24 distinct, non-duplicated product screens.** That is still a lot of work — but it is a *comp set*, not a production design system.

### Interactivity reality check

35 of 48 files contain a `<script>`. Not one implements product state.

- **No booking grid anywhere selects a slot and prices it.** `_1` toggles a cell's CSS class but never enables the CTA (the button ships with a literal `disabled` attribute). `2.` — the file whose entire purpose is "2-Hour Consecutive Selection" — has **zero selection JS**; the two navy cells and the ฿440 total are hardcoded HTML. The core interaction of the entire product is not prototyped end to end in any file.
- **`grep 'type="file"'` → 0 hits.** `member_slip_upload_verification` is the AI-OCR slip screen and it **has no upload control at all** — no file input, no camera button, no drop target. It only renders the post-upload success state.
- `split_bill_line_share`'s primary CTA (`#btnShareLine`, "แชร์สรุปยอดเข้ากลุ่ม LINE") has **no event listener bound**. The most important button on the split-bill screen is dead.
- `post_match_victory_card`, `4_court_light_turned_on_feedback`, and `court_light_activated_feedback` contain no JavaScript whatsoever.

---

## 2. Cross-mockup inconsistencies

These are not nitpicks. Every one of them is a data-model decision that has been made twice, differently, and will surface as a bug on day one.

### 2.1 The same booking, three ways

Court 3, Fri 24 May, 19:00–21:00, ฿440 is the spine of the whole demo. It does not reconcile:

| Fact | `_1` | `2.` | `_3` | `winner_court_2` | `check_in_pass_qr_code` | `court_light_activated_feedback` |
|---|---|---|---|---|---|---|
| Court 3 surface | ยางเขียว (green rubber) | **ปาร์เกต์** (parquet) | พื้นยาง BWF • แอร์ | พื้นยางเกรด BWF | พื้นยางมาตรฐาน BWF | **ไม้ปาร์เกต์พรีเมียม** |
| Standard rate | ฿180 | **฿160** | — | — | — | — |
| Booking ref | — | — | `#WN-2405-8839` | absent | `#WN-2405-3` | `WN-2024-C03` |

Court 4 is equally split: ยางน้ำเงิน (`_1`) vs ปาร์เกต์ (`2.`) vs พื้นยาง (`_3`) vs ยางเกรด A (`30_4_court_4_victory_summary`) vs สนามยางเข้ม (`line_post_match_duel_victory_flex`) vs พื้นยางสังเคราะห์ (`30_pre_match_notification`).

### 2.2 Semantic colors are inverted between sibling grids

In `_1`: **booked = red** `error-container`, **maintenance = gray**.
In `2.`: **booked = gray**, **maintenance = red** `error-container`.

Same product, same component, opposite color code. Whichever ships, the other is a user-safety bug in a grid the PRD explicitly flags as accessibility-critical.

### 2.3 The split bill contradicts itself across four screens

Same ฿600 / 5 people / ฿120 bill:

| Screen | Progress | นนท์ paid at | บอส paid at | ปาล์ม slip |
|---|---|---|---|---|
| `split_bill_line_share` | 3/5 | **21:05** | **21:12** | รอโอน |
| `member_slip_upload_verification` | 4/5 | — | — | **K PLUS 18:42** |
| `line_line_chat_bubble_preview` | "3 of 5" but **names only 2 payers + 2 pending = 4** | — | — | — |
| `100/` | 5/5 | **18:35** | **18:40** | **PromptPay 18:42** |

`split_bill_line_share` has members transferring **after** a 19:00–21:00 session; `100/` has them transferring **before** it. Same match. And `line_line_chat_bubble_preview` says the group has **6 members** while the bill splits **5 ways** — the PRD says **6 players @ 120 THB**, which would make the bill ฿720, not ฿600.

`split_bill_line_share` also hardcodes `paidCount = 3` inside `updateCalculations()`, so picking "8 คน" renders "3 / 8 จ่ายแล้ว" above five static member rows, and rewrites the paid pills to claim members transferred ฿75 when they actually sent ฿120.

### 2.4 Impossible / self-contradicting numbers

- `_2` promises Saturday **18:00–21:00** free in its body copy, then the recommendation card immediately below offers **18:00–20:00**. It also advertises **"ว่าง 8 คอร์ท"** at a venue that has **6 courts**.
- `winner_court_1` headline says **"เหลือคอร์ทว่างอีก 5 ช่วงเวลา"** (5 *time slots*) but the two rows below total 3 + 2 = 5 *courts* across 2 time bands. `empty_state` repeats "เหลือ 5 ช่วงเวลา" and renders **3** chips.
- `match_scoreboard` shows **"เกมที่ 2/5"** (best of 5) in the meta strip and **"แมตช์ 2 ใน 3 เซต"** (best of 3) in the Set Summary. It flags **"แมตช์พอยต์"** at 18-19 in a 21-point set where the other team leads 1–0 on sets — winning would only *level* the match.
- `30_4_court_4_victory_summary` shows H2H **"3 - 3 (เสมอกันแล้ว!)"** with the sub-line "จากเดิมแพ้ 2 ชนะ 3" — a 3-2 prior record plus a win is 4-2, not 3-3.
- `player_career_stats` claims Mind has a **"Current Streak 5 แมตช์ติด"** while listing a **loss on 10 พ.ค.** two rows below, and omits `#WC-DUEL43` (which she also lost) entirely.

### 2.5 Timeline collisions

`line_match_insights_flex_message` posts the *finished* insights card into the LINE group at **21:07 น.** `match_insights_wc_duel43` says the championship point was played at **21:42 น.** The bot ships the analysis 35 minutes before the match ends.

`line_100_line_flex_message_closed` closes the bill at **18:56**, before a 19:00–21:00 session.

### 2.6 Duel challenger/defender roles flip

In `duel_lobby_match_center`, Ken's side is **ทีมคุณ** and Mind's is **ทีมผู้ท้าชิง** (challenger). In `match_challenge_sheet`, `line_match_challenge_flex_message`, and `duel_accepted_match_locked`, Ken's side is the **ทีมผู้ท้าชิง** and Mind's is **ทีมแชมป์เก่า**. Then `duel_accepted_match_locked` labels **both** teams "(คุณ)" — Ken on the left *and* Mind on the right.

Ken's win rate is **60%** in `duel_lobby_match_center` (consistent with 12W-8L), **52%** in `match_challenge_sheet`, and **52%** in `past_duels_history` — where the same career is 20 duels / 12W while `leaderboard_ranking` records him at 46/88 / 52% with no level chip at all.

Mind's role title is **Smash Master** (`duel_lobby`), **Frontcourt Master** (`match_challenge_sheet`), **Net Master • Smash** (`duel_accepted_match_locked`), **Frontcourt S** (`leaderboard_ranking`), and **Frontcourt Tactician (S Class)** (`line_player_card_flex_message`) — none of which are the PRD's specified tiers (Smash Master / Net Magician / Consistent Wall).

### 2.7 EXP economy specified three ways

| Source | Win | Loss |
|---|---|---|
| `leaderboard_ranking` (published rules) | +50 (+85 w/ 3rd-set deuce) | +20 |
| `past_duels_history`, `duel_accepted_match_locked` | +100 | +20 |
| `rematch_challenge_sheet`, `rematch_accepted_locked` | +150 | +30 |

`past_duels_history` then claims a career total of **+1,420 EXP** which reconciles with none of them (12×100 + 8×20 = 1,360).

### 2.8 One phone number, four identities

`081-234-5678` is simultaneously: the **venue hotline** (`winner_court_1`, `empty_state`, `promptpay_qr`), the **organizer's personal PromptPay** (`split_bill_line_share`, `member_slip_upload_verification`, `line_line_chat_bubble_preview`), and the **user's own emergency contact**, pre-filled into the checkout form (`winner_court_2`). Meanwhile `_2` uses `021234567` and `_3` uses `0812345678` for "the venue."

### 2.9 Three navigation models, in two languages

| Files | Tabs |
|---|---|
| Most booking/split/stat screens | จองคอร์ด / ประวัติจอง / อัตราค่าบริการ / สมาชิก |
| `duel_lobby_match_center`, `past_duels_history`, `rematch_challenge_sheet` | จองคอร์ท / ท้าดวล / อันดับก๊วน / สมาชิกก๊วน |
| `30_pre_match_notification`, `line_rematch_accepted_flex` | **Chat / Duels / Courts / Squad** (English) |
| `line_match_insights_flex_message` | **Group / Slots / Stats / Split** (English) |

**`จองคอร์ด` is a typo — it means "book a *chord*"** (should be `จองคอร์ท`). It ships in **23 of 48 files**, and in most of them `aria-current="page"` is stuck on it even on a leaderboard or Flex-preview screen. Several screens (`_3`, `empty_state`) then have a `DOMContentLoaded` script that visually highlights a *different* tab, so the announced page and the highlighted tab permanently disagree.

Neither nav model has a tab for the scoreboard, stats, or duels in the first variant — meaning `player_career_stats`, `match_scoreboard`, and `leaderboard_ranking` are unreachable from their own chrome.

### 2.10 Design system: four mutually incompatible palettes

1. **PRD §3**: primary `#1d2d44`, court-green `#2e7d32`/`#10b981`, boba-amber `#d97706`/`#f59e0b`
2. **`honey_oat_navy_court/DESIGN.md` YAML front-matter** (what 40+ files actually consume): primary `#07182e`, `#1d2d44` demoted to *container*, secondary `#835418`, tertiary `#131a00`
3. **`honey_oat_navy_court/DESIGN.md` prose, same file, line 149+**: Secondary `#DDA15E`, Tertiary `#606C38`, Background `#FDFBF7` — contradicting its own front-matter
4. **`post_match_victory_card`**: bespoke `brand.*` palette, honey `#E59866`, olive `#4A6B48`, Plus Jakarta Sans
5. **`line_flex_message_duel_accepted_flex`**: another bespoke set, gold `#D4A373`, green `#2D6A4F`
6. **`leaderboard_ranking`**: yet another, honey `#E6A15C`, olive `#416D54`
7. **`4_court_light_turned_on_feedback`**: abandons the token config entirely for a dark neon amber/emerald theme that DESIGN.md explicitly forbids ("avoids aggressive, hyper-neon esports aesthetics… avoids synthetic neon glows")

Three creams claim to be the background: `#fbf9f5` (YAML), `#FDFBF7` (prose), `#F8F6F0` (component sheet body). The component sheet's *own swatch tray* prints `#FDFBF7` while its body renders `#F8F6F0`.

---

## 3. Missing screens and states — what a real build needs and does not have

**Zero coverage** (`grep` across all 48 files: `login`, `เข้าสู่ระบบ`, `ลงทะเบียน`, `onboarding`, `เจ้าของ` → **0 hits each**):

**Authentication & identity**
- LINE Login / LIFF init, consent screen, profile-permission grant
- First-run onboarding, gang creation, gang invite/join
- Account linking failure, LIFF-opened-outside-LINE fallback (every screen assumes an in-LINE context and a resolved `userId`)

**System states — near-total absence**
- **No loading state anywhere.** No skeletons, no spinners on data fetch. All 48 screens render fully-populated hardcoded data.
- **No error states.** No failed payment, no expired hold (`promptpay_qr`'s countdown freezes at `00:00` and clears the interval — the CTA stays enabled and nothing happens), no OCR failure, no amount mismatch, no wrong-recipient slip, no network error, no offline.
- `member_slip_upload_verification` explicitly ships only the OCR *success* state, though the PRD requires validating "transaction reference, recipient account, and amount." Every failure path is undesigned.
- **No empty states** except `empty_state` (My Bookings). No empty leaderboard, no empty duel history, no first-match-ever scoreboard.
- **No permission-denied states** (camera for QR, clipboard, notifications).

**Commercial / operational flows**
- **Cancellation and refund**: `ยกเลิก` appears as a button label in 4 files; there is no confirm dialog, no refund calculation, no refund status, no partial-refund policy screen. `คืนเงิน` appears twice, both as static policy prose. And the policy itself conflicts: PRD says **4 hours**, `_3` and `winner_court_2` both say **3 hours**.
- **Reschedule / modify booking** — referenced ("ขอเลื่อนเวลา", "เปลี่ยนเวลา ›") in `match_challenge_sheet` and `line_match_challenge_flex_message`, designed nowhere.
- **No-show / late-arrival handling** — completely absent despite being the operational reality of court booking.
- **Waitlist** — `_2` has a toggle that flips a label client-side; there is no waitlist queue, position, or notification design.
- **Receipts / tax invoice** — "ดูใบเสร็จ" buttons in `_3`, no receipt screen. `winner_court_2` asserts **"รวมภาษีมูลค่าเพิ่มแล้ว"** (VAT included) with no tax line and no VAT registration shown — a real compliance exposure in Thailand.

**B2B — the entire owner product is missing**
The PRD names **Owner Somchai** as one of three personas ("12 courts", "high electricity bills", "front-desk bottlenecks", "manual slot scheduling errors") and positions the product as **"B2B SaaS / White-label."**

**There are zero owner-facing screens.** No admin console, no slot/inventory editor, no blocked-hours/maintenance scheduler, no walk-in booking, no revenue dashboard, no payout reconciliation, no IoT device health monitor, no staff login, no roles/permissions, no multi-venue switcher, no white-label theming UI. All 48 files are single-venue, player-facing, "วินเนอร์ คอร์ท" hardcoded.

Half the stated business model has no design at all.

---

## 4. LINE Flex Messages: ~16 screens that cannot be built as designed

This is the largest single implementation risk and it is not flagged anywhere in the PRD.

LINE Flex Message JSON supports only `box`, `text`, `image`, `icon`, `button`, `separator`, `filler`, `span`, `video`, with a constrained property set. It supports **no** CSS animation, **no** gradients, **no** `backdrop-blur`, **no** box-shadow, **no** arbitrary CSS grid, **no** negative-margin overlap, **no** hover state, **no** icon fonts, **no** percentage-width progress bars except via nested filler boxes.

Every Flex preview in the set uses forbidden features:

| File | Unbuildable constructs |
|---|---|
| `line_live_score_flex_message` | 11-column CSS grid, `animate-ping`, `animate-bounce`, `backdrop-blur`, opacity-modified fills, hover states |
| `line_match_insights_flex_message` | four percentage split-bars, `animate-pulse`, absolutely-positioned 130px opacity-10 watermark, Material Symbols icon font, `truncate`, `<strong>` inside `<p>` |
| `line_100_line_flex_message_closed` | `bg-gradient-to-b`, `shadow-2xl`, radial blur discs, `rounded-2xl overflow-hidden`, flex-wrap chip cloud |
| `line_rematch_challenge_flex_message` | gradient CTA, blurred orbs, dashed SVG court watermark |
| `line_rematch_accepted_flex` | gradients, negative-margin overlapping reaction chips (which are LINE *client* UI, not message content) |
| `line_flex_message_duel_accepted_flex` | gradients, overlapping avatar stacks, `-space-x-2.5` |

Flex button labels are **single-line and truncate**. `line_live_score_flex_message`'s primary button ("เปิดดูกระดานคะแนนสดเต็มจอ (Live Scoreboard)") already wraps to two lines in the mock and will be clipped in production. `flex_message_line_post_match_summary_flex` has the same problem on both CTAs.

**These 16 files are illustrations of what a message might feel like, not specifications.** Budget a separate design pass to author real Flex JSON, and expect the shipped bubbles to look materially flatter. `line_100_line_flex_message_closed` even invents a **"LINE Flex Message Verified"** footer badge — LINE has no such badge; that is fabricated trust signalling and should be deleted.

Separately: `member_slip_upload_verification` is specced as a **LIFF modal** (it opens with a close ✕) yet renders the app-wide 4-tab bottom nav underneath its own sticky action bar — two stacked bottom bars and an architecturally wrong container.

---

## 5. Legal, financial and safety risk

### 5.1 Payment slip OCR — the highest-liability area, least designed

The PRD's Module 3 relies on "AI Slip Verification" of a **user-uploaded JPEG**. Bank slip images are trivially forged and widely templated. The design set makes this worse:

- `member_slip_upload_verification` has **no upload control** and ships **only the success state**. There is no mismatch, no duplicate-slip, no forged-slip, no wrong-recipient, no manual-review-queue design.
- It displays `รหัสอ้างอิง: 01414318428174` and `ตรงตามเงื่อนไข` ("meets the conditions") as an authoritative verdict, with no dispute path and no organizer override.
- **A gang member marked "paid" on a forged slip means the organizer eats the loss.** There is no design for who bears that risk, no audit trail UI, no reversal.

**Required before build:** use Thai bank slip **verification APIs** (SCB / KBank / the Thai QR slip-verify endpoint) that confirm the transaction against the *bank*, not OCR of a picture. Treat OCR as a pre-fill hint only. Design the failure and dispute states. Add duplicate-reference detection.

### 5.2 PromptPay — regulatory exposure

Two different money flows are conflated and neither is designed correctly:

1. **Venue payment** (`promptpay_qr`): the QR is a **hand-drawn decorative SVG** — it encodes nothing and would not scan. The PRD's "dynamic PromptPay QR with unique checksum" (an EMVCo payload) is not represented anywhere in the set. The countdown seeds at `9:42`, not 10:00, and has no expiry behaviour. The copy button labelled **"คัดลอกเลขบัญชี"** actually copies the **Tax ID** — wrong data under a wrong label, on a payment screen. The banner promises **"ไม่ต้องส่งสลิป"** (auto-confirm) while the primary CTA is a manual **"แจ้งว่าชำระเงินแล้ว"** — the screen contradicts itself about whether payment is automatic.
2. **Peer-to-peer split** (`split_bill_line_share`): members transfer to the organizer's *personal* PromptPay. The PRD requires "Input organizer's PromptPay phone/account" — the screen is **display-only with no edit affordance anywhere in the set.**

**If Winner Court ever routes funds itself rather than pointing at a static QR, that is money transmission and requires a BOT-licensed PSP.** The clean answer is: use a licensed acquirer (2C2P, Omise, GB Prime) for venue payment; keep the split bill strictly peer-to-peer with the platform never touching funds; and make that boundary explicit in the UI and the ToS. Neither is currently designed.

`winner_court_2` also introduces **"ชำระเงินสดที่เคาน์เตอร์"** (cash at counter) — a payment path the PRD never mentions, which breaks the webhook auto-confirmation model and the "<3 minute conversion" KPI, and which requires a counter-side reconciliation screen that does not exist.

### 5.3 IoT relay safety — unauthenticated light control

`4_full_screen_court_light_qr_pass` ships **two** unauthenticated paths to energise an 800W lighting relay:

1. A **permanent 4-digit backup PIN (`4389`)** printed on screen, and a **Share button that broadcasts it in plain text into a LINE group** (`navigator.share({text: '... รหัสสำรอง: 4389'})`). Anyone in that chat can turn on Court 4's lights without a booking, forever.
2. A **"Cloud Trigger"** button that fires the relay over the internet from any client — a second override the PRD never specifies.

Meanwhile the "secure dynamic QR that refreshes every 60 s" is a **static hand-drawn SVG**; only the countdown text animates. The QR never changes.

Physical-world consequences: energised lighting circuits, electricity cost, and — if the same relay pattern extends to AC or doors — access control. **Requirements:** signed, short-TTL, single-use tokens bound to `bookingId + courtId`; server-side authorisation on every relay command; rate limiting; per-device audit log; hardware interlock so a court cannot be energised outside a booked window; and a designed failure state when the relay does not ACK (currently: none — `4_court_light_turned_on_feedback` renders success unconditionally with no JS at all).

Also note the PRD specifies **500 lux**; the mockups invent **"800W LED"** across `4_full_screen_court_light_qr_pass` and `4_court_light_turned_on_feedback`. Watts are not lux. And `30_pre_match_notification` fabricates telemetry the PRD never mentions — **"ลมปิด 0.0 m/s"** wind sensors and AC temperature readouts (which themselves drift: 22°C / 23°C / 24°C across three screens for the same product).

### 5.4 Personal data in LINE (PDPA)

- **No consent screen, no privacy policy, no ToS** exists in any of the 48 files.
- `winner_court_2` collects an emergency phone number with **no consent checkbox, no validation, no `maxlength`, no `pattern`** — and pre-fills it with the venue's own hotline.
- Split-bill screens broadcast **real names, payment status, bank names, and transfer timestamps** into a group chat (`100/`: "นนท์ มือตบ • 18:35 น. • สลิป KBank"). Financial status of named individuals, pushed to a group, is sensitive personal data under PDPA. There is no design for opting out of that disclosure.
- `100/` displays the organizer's **legal name — นายจิรภัทร สุขสมบูรณ์** — alongside a bank amount. `member_slip_upload_verification` shows the same legal name to every gang member.
- **44 of 48 files** hotlink images from `lh3.googleusercontent.com/aida/…`. These are ephemeral Google Stitch generation URLs. They will 404, they leak every viewer's IP to Google on render, and several carry the **raw AI generation prompt left in a `data-alt` attribute** — e.g. `30_pre_match_notification`: *"A portrait photograph of Ken, a Thai young male badminton player smiling warmly in athletic navy jersey…"*. Those must be stripped before anything ships.
- Widespread use of `data-alt` **instead of `alt`** (`_3`, `winner_court_2`, `member_slip_upload_verification`, `line_post_match_duel_victory_flex`, `line_flex_message_leaderboard_flex`, `line_player_card_flex_message`) means **no image in the product has an accessible name.**

---

## 6. The biggest unknowns a developer hits on day one

Ranked by how hard they block work:

1. **What is the actual venue configuration?** 6 courts or 12? 09:00–22:00 or 17:00–23:00? Which courts are rubber, which are parquet, which have AC? Every mockup answers differently and nothing is authoritative. You cannot write the `courts` table.
2. **What is the pricing model?** ฿160 / ฿180 / ฿200 / ฿220 / ฿260 / ฿110-per-person all appear. Is peak 17:00–21:00 (`_1`, `2.`) or 17:00–22:00 (`winner_court_1`)? Weekend surcharge? `_3` bills a past 18:00–20:00 peak session at ฿360 (2 × ฿180) — a third, undocumented rate card. You cannot write the pricing engine.
3. **What is the booking reference format?** Six schemes in the set, none matching the PRD. This leaks into the QR payload, the LINE message, the receipt, and support workflows.
4. **Who is the identity provider and what is the session model?** LINE Login? What happens when LIFF opens outside LINE? What is the account-linking story for a phone-number-based walk-in? Nothing designed, nothing specced.
5. **Which payment rails, exactly?** No PSP named. No webhook contract. No idempotency design. No reconciliation screen. The PRD says "SCB / KBank Open API / Thai QR standard" — three different integrations with three different onboarding timelines and different KYC requirements.
6. **What does the IoT hardware actually accept?** MQTT topic structure, auth model, ACK semantics, timeout, and failure behaviour are all unspecified. Is the relay a real product or a Raspberry Pi someone will build? Lead time on hardware is the long pole and it is not scoped.
7. **Singles or doubles?** Module 5 specs a singles 30-point duel with deuce detection. `4_court_4_live_scoreboard` explicitly says **"ไม่ดิวซ์"** (no deuce) and its JS just caps at 30. `match_scoreboard` implements 21-point doubles with multi-set. `post_match_victory_card` implements best-of-3 with a 22-20 tiebreak — a third format the PRD does not define. There is no Undo button anywhere, though the PRD requires one, and `-1` does not roll back the rally-log row it created.
8. **Is there an owner product in v1 or not?** This determines whether you build a multi-tenant schema on day one or paint yourself into a single-venue corner. Zero design input exists.
9. **Which design system is canonical?** PRD tokens, DESIGN.md front-matter, DESIGN.md prose, and three bespoke per-file palettes. Someone must pick one before the first component is written. Note the mockups' Tailwind config also overrides radii (`xl = 0.75rem`) in a way that contradicts DESIGN.md's stated 16px card / 12px control radii, so "just use the config" is not a safe shortcut.
10. **Are the Flex Messages a deliverable or a mood board?** ~16 files hinge on this. If they are treated as specs, the LINE integration slips badly.

### Code-level defects to fix during port (not exhaustive)

- `py-0.2` — not a valid Tailwind class — appears in **24 of 48 files**. Silently drops padding.
- `shadow-xs`, `shadow-2xs`, `backdrop-blur-xs`, `rounded-2xs`, `w-18` are Tailwind **v4** names used against the **v3** CDN. All no-ops. `w-18` in `leaderboard_ranking` unsizes the rank-1 podium avatar, which balloons to ~100px next to its 56px siblings — visible in the render.
- `line_rematch_accepted_flex` uses `bg-surface-lowest` **12+ times**; the token is `surface-container-lowest`. Every one compiles to nothing — metric tiles, chat bubbles and reaction chips all lose their white fill in the render.
- `member_slip_upload_verification`: `class="… p- space-sm rounded-lg"` — a stray space splits the padding utility; the slip row renders flush to the card edge. Its 32px avatar circles contain full Thai names, which overflow into an illegible smear.
- `_1`: the deselect branch always restores `text-[#606C38]`, so deselecting a peak ฿220 cell leaves it green.
- `_1`: the grid **skips 12:00, 14:00 and 16:00 rows entirely** — it is not a continuous 09:00–22:00 schedule despite the header claiming one.
- `2.`: `setTimeout(250)` then `window.scrollTo({top: 360})` fights the user if they are already scrolling.
- `capybara_pose_2_cheering_with_racket`: the racket frame is at `cy=-5` inside a `0 0 160 160` viewBox — **the racket head is clipped off the artboard** at the focal point of the victory illustration. `capybara_pose_1` draws the racket shaft **over the eye and ear**. `capybara_pose_3`'s scarf renders as a detached navy wedge floating on the capybara's back. All four "mascot suite" SVGs are saved as `.html`, have hardcoded `width`/`height`, no `role="img"`/`<title>`, no `currentColor`, and — critically — **are referenced by zero product screens.** All 44 mascot-bearing screens use the expiring Google raster placeholders instead. The vector suite is orphaned.
- Booked/maintenance cells in `_1` and `2.` are focusable `<button>`s or `<div>`s with no `disabled`/`aria-disabled`. `2.`'s sticky court header is a separate scroll pane, not a table header — column association is visual only.
- `30_pre_match_notification`, `match_insights_wc_duel43`, `line_match_insights_flex_message`, `duel_lobby_match_center`, `match_challenge_sheet`, `line_match_challenge_flex_message` and `4_full_screen_court_light_qr_pass` **never load Noto Sans Thai** despite ~95% Thai copy. Thai falls back to the system font, breaking the bilingual baseline DESIGN.md requires. `4_full_screen_court_light_qr_pass` is also `<html lang="en">` with an English-only title on an all-Thai screen.
- Thai copy errors to fix: `จองคอร์ด` → `จองคอร์ท` (23 files); `มุมคอร์ด` (`30_4_court_4_victory_summary`); `คอร์ด 3` (`line_match_challenge_flex_message`, `player_career_stats`); `เหลือ 1 ชม. 59 น.` should be `นาที` (`court_light_activated_feedback`); `09:42 น.` used as an mm:ss duration (`promptpay_qr`); `ความเร็วชัตเตอร์บอล` = "shutter ball speed" (`line_post_match_duel_victory_flex`); `6 (เสีย 적)` — a **Korean character** inside a Thai string (`match_insights_wc_duel43`); `แดรี่เบรก` (`line_live_score_flex_message`).
- `30_4_court_4_victory_summary`'s app bar title reads **"Pass Scanner"** — a leftover from the check-in screen. `match_insights_wc_duel43`'s H1 is the literal folder name of a *different* screen. `line_post_match_duel_victory_flex`'s fixed footer says **"แชร์บัตรคอร์ทไปยังกลุ่ม / ส่งบัตรเช็คอิน"** — pasted from the check-in screen onto a victory card.
- Persona/mock-data leakage into production copy: `_2` addresses **"คุณต้นและเดอะแก๊ง"** in body text; `4_court_4_live_scoreboard` hardcodes the PRD's "Rally of the Match: 38 shots" example as a **tappable chip**; the 38-shot rally is copy-pasted into 6+ unrelated matches.

---

## 7. Blunt verdict

### What percentage of a real product does this document?

| Layer | Coverage |
|---|---|
| Visual language / brand direction | **75%** — genuinely good, but forked across 4+ palettes and self-contradicting inside its own DESIGN.md |
| Happy-path player UX, screen by screen | **65%** — thorough and thoughtful, but duplicated and internally inconsistent |
| Complete UX incl. loading / error / empty / offline / edge cases | **~15%** |
| Data model & business rules (prices, courts, hours, refs, scoring, EXP) | **~10%** — actively contradictory, not merely absent |
| Backend / API / webhook / IoT contracts | **0%** — one paragraph of stack names in the PRD |
| Auth, onboarding, consent, legal | **0%** |
| B2B owner / admin / multi-venue product | **0%** — despite being half the stated business model |
| Working interactive prototype | **~5%** — cosmetic JS only; the core booking interaction is not prototyped anywhere |

**Weighted honest figure: this documents roughly 20–25% of a shippable product.** It is a very good *pitch deck in HTML* — probably 4–6 weeks of design work — that has been mislabelled as an engineering-ready spec. Handing it to a dev team as-is will produce 3–4 weeks of contradictory decisions being litigated in standup, followed by a rewrite of the design system.

**The PRD's status line should read: "Visual Design Direction Approved — Specification and Data Model Pending."**

### The realistic first implementation slice

**Do not start by porting screens.** Start by killing ambiguity.

**Sprint 0 (1 week, no code):** Produce a single canonical spec sheet answering: court count and IDs, opening hours, the complete rate card (base/peak/weekend/holiday), the one booking-reference format, the one design token set, and the one bottom-nav IA. Publish it and delete every mockup that contradicts it. Retire one of each duplicated pair (`match_scoreboard` vs `4_court_4_live_scoreboard`, the two insights screens, the two victory screens, the two light-on screens). Strip all `data-alt` prompt text and download or replace all 44 hotlinked Google images with local assets. Fix the `จองคอร์ด` typo at the source.

**Slice 1 — "Book and pay, one venue" (6–8 weeks):**
- LINE Login + LIFF init + consent screen *(new — must be designed)*
- Court profile (`winner_court_1`) — remove the phantom "5 ช่วงเวลา", fix the Maps link to a real place URL
- Booking grid (`_1` + `2.` merged into one real, stateful component with genuine consecutive-hour selection, live pricing, and a continuous hour axis) — plus loading, error and fully-booked states (`_2` reworked to show the *disabled grid*, not to hide it)
- Checkout (`winner_court_2`) — cut the cash-at-counter path from v1, add phone validation, add a real consent checkbox, resolve 3h vs 4h cancellation
- PromptPay via a **licensed PSP** with a real EMVCo payload, a genuine 10-minute server-side hold, and designed expiry/failure states *(new)*
- Success + LINE share (`line`) — using the **actual LIFF SDK**, with a real Flex Message JSON template, not `line.me/R/share?text=`
- My Bookings active + empty (`_3`, `empty_state`) — with a working **cancel + refund flow** *(new)*
- Owner-side minimum: a slot/inventory editor and a bookings list, or the venue cannot operate *(entirely new)*

**Explicitly out of Slice 1:** split bill, IoT check-in, scoreboard, duels, leaderboard, all Flex previews beyond booking confirmation. Those are Modules 3–7 and depend on a data model that does not exist yet.

**Slice 2:** Split bill — but only after committing to bank-API slip verification rather than image OCR, and after designing every failure path.

**Slice 3:** IoT — hardware lead time makes this the long pole; scope the security model (signed short-TTL tokens, server-side authz, hardware interlock) *before* ordering relays, and delete the static backup PIN and Cloud Trigger from the design entirely.

**Modules 5–7 (scoreboard, insights, duels, leaderboard) are a v2 product.** They are the most-designed part of this set — roughly 24 of the 48 files — and the least ready: three scoring formats, three EXP economies, no deuce logic, no undo, and a character continuity that does not survive contact with itself. Building them first would be optimising the retention layer of a product that cannot yet take a booking.