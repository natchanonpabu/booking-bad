# Winner Court — Information Architecture & User Flow Map

*Derived from 53 folders in `documents/stitch/` (48 coded screens + 2 design-spec folders + 4 photo assets) reconciled against `documents/prd.md`.*

---

## 1. Folder → Screen Identity Decoder

### 1.1 Opaque folder names resolved

| Folder | Real screen identity | PRD ref |
|---|---|---|
| `_1` | Booking Grid — **Default / nothing selected** (6 courts × time blocks) | Screen 58 |
| `2.` | Booking Grid — **2-hour consecutive selection**, Court 3 19:00–21:00, ฿440 | Screen 56 |
| `_2` | Booking Grid — **Fully booked day** + alternate-day recommendation (Capybara Pose 3) | Screen 57 |
| `_3` | **My Bookings** — Active & History (populated) | Screen 48 |
| `100` | **Gang Settlement Complete — 100% collected** (in-app) | Screen 43 |
| `line` | **Booking Success / Share-to-LINE** (NOT a Flex preview despite the name) | Screen 49 |
| `winner_court_1` | **Court Profile & Amenities** (venue landing) | Screen 52 |
| `winner_court_2` | **Booking Review & Checkout** (step 1 of 3) | Screen 50 |
| `empty_state` | **My Bookings — Empty State** (0 bookings, Capybara Pose 1) | Screen 47 |
| `candy` | Alternate design direction spec (`DESIGN.md` only — hot pink "Joyful Pop"; **not part of this product**) | — |
| `honey_oat_navy_court` | The **design-token source of truth** (`DESIGN.md`, M3 token YAML + component rules) | — |

### 1.2 Full inventory by module

**Module 0 — Design System & Assets**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `badminton_component_sheet_honey_oat_navy_court` | Component sheet "ทิศทางที่ 2" (slots, buttons, badges, sticky bar, booking card) | Desktop spec page | 59 |
| `capybara_pose_1_idle_with_racket` | Mascot Pose 1 — idle (empty states) | SVG 160×160 | Img 60 |
| `capybara_pose_2_cheering_with_racket` | Mascot Pose 2 — victory (success screens) | SVG 160×160 | Img 61 |
| `capybara_pose_3_sleeping` | Mascot Pose 3 — sleeping (fully booked / closed) | SVG 160×160 | Img 62 |
| `capybara_pose_4_24px_circle_icon` | Mascot Pose 4 — 24px avatar badge | SVG 64×64 | Img 63 |
| `honey_oat_navy_court` | Design-system token spec | Markdown | — |
| `candy` | Rejected/alternate direction | Markdown | — |
| `clean_spacious_badminton_court_lounge_…` | Stock photo — lounge/rest area | PNG | — |
| `indoor_badminton_facility_showing_multiple_…` | Stock photo — multi-court hall | PNG | — |
| `realistic_high_quality_indoor_badminton_court_with_green_…` | Stock photo — green rubber court | PNG | — |
| `realistic_high_quality_thai_young_handsome_male_badminton_player_celebrating` | Stock photo — celebrating player (Ken) | PNG | — |

**Module 1 — Booking Flow**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `winner_court_1` | Court Profile & Amenities | LIFF | 52 |
| `_1` | Booking Grid: Default | LIFF | 58 |
| `2.` | Booking Grid: 2-Hour Selection | LIFF | 56 |
| `_2` | Booking Grid: Fully Booked & Alternative | LIFF | 57 |
| `winner_court_2` | Booking Confirmation / Review Sheet (1 of 3) | LIFF | 50 |
| `promptpay_qr` | PromptPay QR Checkout (2 of 3) | LIFF | 51 |
| `line` | Booking Success + Share to LINE (3 of 3) | LIFF | 49 |

**Module 2 — Booking Management**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `_3` | My Bookings: Active & History | LIFF | 48 |
| `empty_state` | My Bookings: Empty State | LIFF | 47 |

**Module 3 — Gang Split Bill**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `split_bill_line_share` | Split Bill Calculator & Settings (organizer, 3/5 paid) | LIFF | 46 |
| `line_line_chat_bubble_preview` | **Flex preview**: Bill Request Card | Flex-in-chat sim | 45 |
| `member_slip_upload_verification` | Member Slip Upload & AI Verification (4/5) | LIFF modal | 44 |
| `100` | Gang Settlement Complete 100% (5/5) | LIFF | 43 |
| `line_100_line_flex_message_closed` | **Flex preview**: 100% Paid / Bill Closed Card | Flex-in-chat sim | 42 |

**Module 4 — Smart IoT Check-in**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `30_pre_match_notification` | Pre-Match 30-Minute Alert & Readiness Hub (Court 4 duel) | LIFF in chat lobby | 16 |
| `check_in_pass_qr_code` | Check-in Pass & QR (Court **3**, 5-person gang) | LIFF | 41 |
| `4_full_screen_court_light_qr_pass` | Full-Screen Court **4** Light QR Pass + backup PIN | LIFF | 15 |
| `4_court_light_turned_on_feedback` | Court 4 Light ON — **dark celebration takeover** | LIFF (dark) | 14/40 |
| `court_light_activated_feedback` | Court 3 Check-in Success — **light bottom sheet** | LIFF modal | 40 (variant) |

**Module 5 — Match Scoring & Post-Match**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `4_court_4_live_scoreboard` | Court 4 Live Scoreboard — **singles duel** Ken vs Mind #WC-DUEL43 | LIFF | 12/39 |
| `match_scoreboard` | Court 3 Live Scoreboard — **doubles**, Team A vs Team B | LIFF | *unlisted* |
| `line_live_score_flex_message` | **Flex preview**: Live Score broadcast (Court 3 doubles) | Flex-in-chat sim | 38 |
| `30_4_court_4_victory_summary` | Post-Match Victory Summary — Ken 30-28 Mind | LIFF | 9/37 |
| `post_match_victory_card` | Post-Match Victory Card — **doubles**, Team B 2-1 | LIFF (390px frame) | *unlisted* |
| `line_post_match_duel_victory_flex` | **Flex preview**: Duel Victory Card | Flex-in-chat sim | 7/36 |
| `flex_message_line_post_match_summary_flex` | **Flex preview**: Doubles Summary Card | Flex-in-chat sim | *unlisted* |

**Module 6 — Insights, Stats & Gamification**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `match_insights_wc_duel43` | Match Insights & 58-Point Replay (singles duel) | LIFF | 5/35 |
| `match_insights_point_replay` | Match Insights & Point Replay (**doubles**, Court 3) | LIFF | *unlisted* |
| `line_match_insights_flex_message` | **Flex preview**: Match Insights Card | Flex-in-chat sim | 3/54/56 |
| `player_career_stats` | Player Profile & Career Stats — **น้องมายด์ (Mind)**, not Ken | LIFF | 34 |
| `line_player_card_flex_message` | **Flex preview**: Player Card | Flex-in-chat sim | 33 |
| `leaderboard_ranking` | Gang Leaderboard & Ranking (weekly, 8 players) | LIFF (device frame) | 32 |
| `line_flex_message_leaderboard_flex` | **Flex preview**: Weekly Leaderboard | Flex-in-chat sim | 30 |

**Module 7 — Duels, Rematches, History**

| Folder | Identity | Surface | PRD |
|---|---|---|---|
| `duel_lobby_match_center` | Duel Lobby & Match Center + partner finder | LIFF | 25 |
| `match_challenge_sheet` | Match Challenge Sheet (compose, #WC-DUEL42) | LIFF sheet | 29 |
| `line_match_challenge_flex_message` | **Flex preview**: Match Challenge Card (pending) | Flex-in-chat sim | 28 |
| `duel_accepted_match_locked` | Duel Accepted & Match Locked (#WC-DUEL42) | LIFF (device frame) | 27 |
| `line_flex_message_duel_accepted_flex` | **Flex preview**: Duel Accepted Card | Flex-in-chat sim | 26 |
| `past_duels_history` | Past Duels History (career archive) | LIFF | 24 |
| `rematch_challenge_sheet` | Rematch Challenge Sheet (#WC-DUEL39 → new duel) | LIFF | 22 |
| `line_rematch_challenge_flex_message` | **Flex preview**: Rematch Challenge Card (pending) | Flex-in-chat sim | 21 |
| `rematch_accepted_locked` | Rematch Accepted & Court Locked (#WC-DUEL43) | LIFF | 19 |
| `line_rematch_accepted_flex` | **Flex preview**: Rematch Accepted / MATCH LOCKED | Flex-in-chat sim | 18 |

**Totals:** 48 coded screens = 30 in-app LIFF + 13 LINE Flex previews + 1 component sheet + 4 mascot vectors.

---

## 2. End-to-End User Journeys

Legend: `folder` = the mockup that exists · **⟪MISSING⟫** = no mockup exists for this required step · ⚡ = the link is drawn but has no handler (dead in the prototype).

### Flow A — Book a court → pay → confirm

| # | Step | Folder | Trigger / CTA |
|---|---|---|---|
| 0 | Open LIFF from LINE OA, auth + profile link | **⟪MISSING⟫** | — |
| 0b | Venue list / search (multi-venue B2B) | **⟪MISSING⟫** | — |
| 1 | Court profile, rates, amenities, live availability teaser | `winner_court_1` | "ดูตารางเวลาว่างวันนี้ทันที" / sticky "จองคอร์ทเลย →" ⚡ (`data-path=court-reserve`) |
| 2 | Grid, nothing selected; pick a date pill, tap an empty cell | `_1` | "จองทันที" (disabled until selection) |
| 2-alt | Date is 100% full → sleeping capybara + next-day recommendation + waitlist toggle | `_2` | "ดูตารางวันเสาร์ 25 พ.ค." ⚡ / "เปิดแจ้งเตือน…" ✅ |
| 3 | Two consecutive peak hours merged, sticky drawer shows ฿440 | `2.` | "ไปต่อที่ชำระเงิน" ⚡ |
| 4 | Review sheet (step 1/3): court, slot, itemized fee, LINE profile, emergency phone, payment-method radio | `winner_court_2` | "ดำเนินการชำระเงิน (฿440)" ⚡ |
| 4-alt | Cash-at-counter path selected → CTA becomes "ยืนยันการจองคอร์ท" | `winner_court_2` | **⟪MISSING⟫** downstream confirmation screen |
| 5 | PromptPay QR (step 2/3), hold countdown, save QR, copy account | `promptpay_qr` | "แจ้งว่าชำระเงินแล้ว / ตรวจสอบยอด" ⚡ |
| 5-alt | Card / debit tab | **⟪MISSING⟫** | tab exists, no screen |
| 5-fail | Hold expired / payment failed / webhook timeout | **⟪MISSING⟫** | countdown just freezes at 00:00 |
| 6 | Success (step 3/3): ticket card, ref `#WN-2405-8839`, calendar + maps deep links | `line` | ✅ copy summary; ✅ `line.me/R/share?text=` (plain text, **not** Flex) |
| 7 | Booking now appears in management hub | `_3` (populated) / `empty_state` (if none) | — |

**Flow-A step contract breaks:** `_1` prices standard hours ฿180, `2.` prices them ฿160; `_1` calls every court rubber, `2.` calls courts 3–4 parquet, `_3` calls Court 3 "พื้นยาง BWF"; booked/maintenance color semantics are **inverted** between `_1` and `2.`; `2.`'s selection is hardcoded markup with zero selection JS, so step 2→3 has no working state model.

---

### Flow B — Split the bill → members pay → settle 100%

| # | Step | Folder | Trigger / CTA |
|---|---|---|---|
| 0 | From a paid booking, "split this bill" | **⟪MISSING⟫** — `_3` has no split-bill entry point at all | — |
| 1 | Organizer calculator: imports ฿440 court + ฿160 shuttles, headcount stepper, per-person ฿120, PromptPay display, tracker 3/5, nudge buttons | `split_bill_line_share` | "แชร์สรุปยอดเข้ากลุ่ม LINE" — **dead, no listener at all**; only "คัดลอกข้อความสรุป" works |
| 1b | Enter / edit the organizer's own PromptPay account | **⟪MISSING⟫** (PRD Module 3 requires it; screen is display-only) | — |
| 2 | Preview the Flex bill card before sending | `line_line_chat_bubble_preview` | "ส่งเข้ากลุ่ม LINE ทันที" (toast only) |
| 3 | **Card lands in gang chat**; member taps "แจ้งโอนเงิน / เช็กยอดอัปเดต" | (inside `line_line_chat_bubble_preview`) ⚡ | → opens member LIFF modal |
| 4 | Member picks their name, views PromptPay/QR, slip OCR result, submits | `member_slip_upload_verification` | "ยืนยันแจ้งโอนเงิน (฿120)" ✅ (simulated 1.2 s) |
| 4b | Actually pick/capture the slip image | **⟪MISSING⟫** — no `<input type=file>`, no camera; "เปลี่ยนรูป" is inert | — |
| 4-fail | OCR failure / wrong amount / wrong recipient / duplicate slip | **⟪MISSING⟫** (PRD explicitly requires this validation) | — |
| 5 | Tracker advances 3/5 → 4/5 → 5/5; organizer sees completion | `100` | "แชร์การ์ดปิดบิลเข้ากลุ่ม LINE" (fake 2.4 s label swap) |
| 6 | Celebratory closed-bill card in chat | `line_100_line_flex_message_closed` | "แชร์การ์ดปิดบิลเข้ากลุ่ม LINE ทันที" (simulated) |
| 7 | Handoff to check-in | → `check_in_pass_qr_code` | "เปิด QR โค้ดสำหรับเช็คอินคอร์ท 3" ⚡ |

**Flow-B state contract:** the three progress snapshots are 3/5 (`split_bill_line_share`) → 4/5 (`member_slip_upload_verification`) → 5/5 (`100`, `line_100_…`). Plausible as a sequence, but the member ledgers do **not** reconcile: `split_bill_line_share` timestamps นนท์ 21:05 / บอส 21:12 (after the 19:00–21:00 session) while `100` timestamps them 18:35 / 18:40 (before it); ปาล์ม's slip is "K PLUS" in `member_slip_upload_verification` and "PromptPay" in `100`; `line_line_chat_bubble_preview` says 3/5 paid but names only 2 payers.

---

### Flow C — Arrive → QR check-in → lights on → play

| # | Step | Folder | Trigger / CTA |
|---|---|---|---|
| 1 | T-30 push lands in gang chat: countdown to auto-light, readiness checklist, wager, H2H | `30_pre_match_notification` | "เปิด QR Code เต็มจอพร้อมสแกน" ✅ (loading fake) / "เปิด QR Code เช็คอินเข้าคอร์ท 4 ทันที" ⚡ |
| 1b | PRD gate: pass unlocks only 15 min before start | **⟪MISSING⟫** — `check_in_pass_qr_code` shows the QR unconditionally 4 h out | — |
| 2 | Boarding-pass style digital ticket: rotating QR, amenity activation list, floor plan modal | `check_in_pass_qr_code` | "บันทึกบัตรลงรูปภาพ" / "แชร์เข้ากลุ่ม LINE ก๊วน" / "ดูผังคอร์ท" — all toast-only |
| 3 | Full-screen pole-scan pass with laser reticle + 4-digit backup PIN + Cloud Trigger fallback | `4_full_screen_court_light_qr_pass` | "กดเปิดไฟฉุกเฉินผ่านเน็ต (Cloud Trigger)" ✅ (simulated relay) |
| 3-fail | Scan failed / invalid or expired QR / relay unreachable | **⟪MISSING⟫** | — |
| 4a | Success — **dark takeover**, Court 4, 800W LED, AC 22 °C, duel context | `4_court_light_turned_on_feedback` | "เข้าสู่กระดานนับคะแนนสด" — inert (`javascript:void(0)`) |
| 4b | Success — **light bottom sheet**, Court 3, gang context, IoT device grid, member chips | `court_light_activated_feedback` | "เข้าสู่หน้าจอควบคุมแมตช์ & สกอร์บอร์ด" ⚡ |
| 5 | 60-min countdown, 5-min pre-turnoff warning, session end / lights off | **⟪MISSING⟫** — countdowns are static text everywhere | — |
| 6 | Play | → `4_court_4_live_scoreboard` or `match_scoreboard` | — |

**Flow-C break:** steps 2 and 4b are **Court 3 / 5-person gang / 19:00–21:00**, steps 1, 3 and 4a are **Court 4 / Ken-vs-Mind duel / 20:00–21:00**. The chain cannot be walked without switching scenarios mid-flow. Four ID schemes appear across five screens: `#WN-2405-3`, `WN-2024-C03`, `#43-AUTO`, `#WC-DUEL43`.

---

### Flow D — Score a match → post-match card → share to LINE

**Track D1 — Singles duel (Ken vs Mind, Court 4, #WC-DUEL43) — the PRD-canonical track**

1. `4_court_4_live_scoreboard` — ±1 per player, shot tagging, rally log, "🟢 ส่งผลสดเข้ากลุ่ม LINE" ⚡, "บันทึกจบแมตช์ (Finish)" ⚡
2. **⟪MISSING⟫** — no Live Score Flex preview exists for this duel (the only one, `line_live_score_flex_message`, is the *doubles* match)
3. `30_4_court_4_victory_summary` — winner hero, wager settled, 4 H2H metrics, rank climb → "แชร์การ์ดผลชนะเข้ากลุ่ม LINE" ✅ (fake 700 ms)
4. `line_post_match_duel_victory_flex` — victory card in chat; in-card "ท้าดวลนัดต่อไป / ล้างตาซ้ำ" is the rematch entry point ⚡
5. `match_insights_wc_duel43` — 58-point momentum chart, coach verdict, 4 key-point replays, auto-camera photo → "แชร์สถิติและคลิปรีเพลย์เข้ากลุ่ม LINE" ⚡
6. `line_match_insights_flex_message` — insights card in chat → "เปิดดูกราฟ & รีเพลย์ 58 ช็อตเต็มจอ" ⚡ back into step 5
7. Archive → `past_duels_history`; profile EXP → `player_career_stats`

**Track D2 — Doubles gang match (Court 3, Team A vs Team B) — not in the PRD**

1. `match_scoreboard` — team ±1, quick tags, set summary, bench queue → "ส่งผลสดเข้ากลุ่ม LINE" ⚡
2. `line_live_score_flex_message` — live score card in chat (18-19, Set 2) → "เปิดดูกระดานคะแนนสดเต็มจอ" ⚡
3. `post_match_victory_card` — Team B 2-1 comeback, MVP มายด์, set table, +85 EXP → "ส่งการ์ดสรุปผลเข้ากลุ่ม LINE ทันที" ⚡ (**zero JS in this file**)
4. `flex_message_line_post_match_summary_flex` — doubles summary card preview → "ส่งการ์ดสรุปผลเข้ากลุ่ม LINE ทันที" ✅ (toast)
5. `match_insights_point_replay` — doubles insights, momentum SVG, 4-player stat cards, zone split
6. **⟪MISSING⟫** — no Flex preview for doubles insights

**Missing across both tracks:** match setup (choose format/players/teams before scoring), undo, deuce confirmation, end-match confirmation, abandoned/interrupted match, defeat-side victory screen (only winner states exist).

---

### Flow E — Challenge a duel → accept → play → rematch

**E1. Fresh challenge (#WC-DUEL42, doubles)**

1. `duel_lobby_match_center` — Ken's ladder profile, locked match, 2 pending challenges, partner board → "สร้างคำท้า" (fires an `alert()` placeholder, does **not** open the sheet)
2. **⟪MISSING⟫** — opponent picker / player search
3. `match_challenge_sheet` — mode tabs, format, roster, court slot, wager, editable trash-talk message → "ส่งเทียบท้าดวลเข้าแชท LINE น้องมายด์" ⚡
4. `line_match_challenge_flex_message` — pending card in chat with countdown "ตอบรับใน 5 ชม. 48 น."; recipient's in-card buttons: **Accept** ⚡ / **เสนอเวลาอื่น** ⚡ / rules link ⚡
5. Accept → `duel_accepted_match_locked` (in-app confirmation, roster frozen, deposit paid, "ดูบัตรเช็คอิน →" ⚡)
6. Simultaneously → `line_flex_message_duel_accepted_flex` (chat card flips to **MATCH LOCKED**, bot posts court-lock notice, CTAs to scoreboard + QR check-in)
7. **⟪MISSING⟫** — decline / counter-offer / reschedule negotiation / expired-challenge screens
8. → Flow C (check-in) → Flow D (scoring)

**E2. Rematch ("ท้าล้างตา", #WC-DUEL39 loss → new duel, singles)**

1. Entry: `30_4_court_4_victory_summary` (loser side), or `past_duels_history` card action "ขอท้าล้างตา (Rematch)" ⚡, or `line_post_match_duel_victory_flex` in-card "ท้าดวลนัดต่อไป / ล้างตาซ้ำ" ⚡
2. `rematch_challenge_sheet` — revenge recap of the 28-30 loss, format radios, court slot, 2× stakes, banter textarea → "ยืนยันส่งเทียบท้าล้างตา" ✅ (label swap only; **never routes onward**)
3. `line_rematch_challenge_flex_message` — pending rematch card in chat, 11h48m expiry, reactions, bot "3 คนรอชมสด"
4. Accept → `rematch_accepted_locked` (in-app: Court 4 locked, ฿110/person deposit, light code `#43-AUTO-LIGHT`, calendar sync)
5. Simultaneously → `line_rematch_accepted_flex` (chat card flips to MATCH LOCKED, light code `#43-AUTO`, bot schedules a T-30 reminder)
6. → `30_pre_match_notification` (T-30) → Flow C → Flow D
7. Archive → `past_duels_history`

**PRD conflict:** Module 7 specifies "instant **1-tap** Rematch Challenge from the match summary"; `rematch_challenge_sheet` is a 7-section long-scroll form.

---

### Flow F — Leaderboard & stats browsing

| # | Step | Folder | Notes |
|---|---|---|---|
| 1 | Weekly gang leaderboard, 8 players, MVP prize, Top-3 podium, EXP rules | `leaderboard_ranking` | timeframe toggle (Weekly/S4/All-time) and 4 metric chips are **inert — zero JS in the file** |
| 2 | Share standings to chat | `line_flex_message_leaderboard_flex` | "ส่งการ์ดอันดับเข้าห้องแชท LINE ทันที" ✅ (simulated, +20 EXP incentive) |
| 3 | Tap a player row → their profile | **⟪MISSING⟫** — rows are not tappable | — |
| 4 | Player profile & career stats (level, EXP bar, 4 KPIs, 5 skill bars, coach analysis, 4 badges, last 3 matches) | `player_career_stats` | profiles **Mind**, not Ken as the PRD specifies |
| 5 | Share player card | `line_player_card_flex_message` | green send button has **no handler** |
| 6 | Full badge gallery (18/24) | **⟪MISSING⟫** — link is dead | — |
| 7 | Duel archive with filters, search, sort, career wager ledger | `past_duels_history` | search / sort / filter pills all inert; only 4 of 20 duels render, no pagination |
| 8 | Drill into a match | `match_insights_wc_duel43` / `match_insights_point_replay` | no navigation path from either the profile or the history cards |
| 9 | Duel ladder & pending challenges | `duel_lobby_match_center` | — |

---

## 3. Flex Message Emission Map

Which in-app action emits which LINE Flex card, and which in-app screen is its twin.

| # | Flex preview folder | Emitted by (app action) | In-app twin | Recipient's in-card CTAs → where they should land |
|---|---|---|---|---|
| 1 | `line_line_chat_bubble_preview` (Bill Request) | `split_bill_line_share` → "แชร์สรุปยอดเข้ากลุ่ม LINE" | `split_bill_line_share` | "แจ้งโอนเงิน" → `member_slip_upload_verification`; "ดูแผนที่" → ⟪missing⟫ |
| 2 | `line_100_line_flex_message_closed` (Bill Closed 100%) | `100` → "แชร์การ์ดปิดบิลเข้ากลุ่ม LINE" (PRD says this should fire **automatically** at 100%) | `100` | "เปิด QR เช็คอินคอร์ท 3" → `check_in_pass_qr_code`; "ดูแผนที่" → ⟪missing⟫; "ดูสลิป (5 ใบ)" → ⟪missing⟫ |
| 3 | `line_live_score_flex_message` (Live Score) | `match_scoreboard` → "ส่งผลสดเข้ากลุ่ม LINE (Live Score Sync)" | `match_scoreboard` | "กระดานคะแนนสดเต็มจอ" → `match_scoreboard`; "Set History" → ⟪missing⟫ |
| 4 | `line_post_match_duel_victory_flex` (Duel Victory) | `30_4_court_4_victory_summary` → "แชร์การ์ดผลชนะเข้ากลุ่ม LINE (Post-match Flex)" | `30_4_court_4_victory_summary` | "ดูสถิติละเอียด" → `match_insights_wc_duel43`; "ท้าดวลนัดต่อไป" → `rematch_challenge_sheet` |
| 5 | `flex_message_line_post_match_summary_flex` (Doubles Summary) | `post_match_victory_card` → "ส่งการ์ดสรุปผลเข้ากลุ่ม LINE ทันที" | `post_match_victory_card` | "Match Insights" → `match_insights_point_replay`; "ท้าแข่งรีแมตช์" → `match_challenge_sheet`; "สลับคู่เซตถัดไป" → ⟪missing⟫ |
| 6 | `line_match_insights_flex_message` (Match Insights) | `match_insights_wc_duel43` → "แชร์สถิติและคลิปรีเพลย์เข้ากลุ่ม LINE" | `match_insights_wc_duel43` | "กราฟ & รีเพลย์เต็มจอ" → `match_insights_wc_duel43`; "จองคอร์ท 4" → `_1` |
| 7 | `line_player_card_flex_message` (Player Card) | `player_career_stats` → "แชร์การ์ดโปรไฟล์เข้ากลุ่ม LINE (Player Card)" | `player_career_stats` | "ท้าดวล / ชวนลงคู่" → `match_challenge_sheet`; "Full Profile" → `player_career_stats` |
| 8 | `line_flex_message_leaderboard_flex` (Weekly Leaderboard) | `leaderboard_ranking` → "แชร์ตารางอันดับก๊วนเข้าห้องแชท LINE"; PRD also requires an **auto-push every Sunday night** | `leaderboard_ranking` | "จองคอร์ทเปิดศึกไต่อันดับ" → `_1`; "Full Leaderboard" → `leaderboard_ranking` |
| 9 | `line_match_challenge_flex_message` (Challenge — pending) | `match_challenge_sheet` → "ส่งเทียบท้าดวลเข้าแชท LINE" | `match_challenge_sheet` | Accept → `duel_accepted_match_locked`; "เสนอเวลาอื่น" → ⟪missing⟫ |
| 10 | `line_flex_message_duel_accepted_flex` (Challenge — accepted) | Opponent taps Accept on #9 (card mutates in place) | `duel_accepted_match_locked` | "Live Scoreboard" → `4_court_4_live_scoreboard`; "QR เช็คอิน" → `4_full_screen_court_light_qr_pass` |
| 11 | `line_rematch_challenge_flex_message` (Rematch — pending) | `rematch_challenge_sheet` → "ยืนยันส่งเทียบท้าล้างตา" | `rematch_challenge_sheet` | Accept → `rematch_accepted_locked`; "ขอปรับกติกา" / "ขอเลื่อนเวลา" → ⟪missing⟫ |
| 12 | `line_rematch_accepted_flex` (Rematch — accepted) | Opponent taps Accept on #11 | `rematch_accepted_locked` | "Live Scoreboard" → `4_court_4_live_scoreboard`; "QR เช็คอิน" → `4_full_screen_court_light_qr_pass` |
| 13 | `line` (Booking Success — **not** a Flex preview) | `promptpay_qr` → payment confirmed | — | uses `line.me/R/share?text=` **plain text**, though the CTA subtitle promises "ส่งการ์ด" |

**Flex previews that exist with no emitting app screen:** none.
**App screens that emit no Flex preview (gaps):** `4_court_4_live_scoreboard` (its "Live Sync" has no card), `match_insights_point_replay` (no doubles-insights card), `_2` waitlist notification, `check_in_pass_qr_code` "แชร์เข้ากลุ่ม LINE ก๊วน", `30_pre_match_notification` bot reminder card (referenced by `line_rematch_accepted_flex` bot copy but never designed).

**Cross-cutting Flex feasibility risk:** every Flex preview is built with CSS gradients, `backdrop-blur`, `animate-ping`/`animate-bounce`, arbitrary CSS grids, opacity-modified tokens, negative-margin overlaps, `shadow-2xl` and Material Symbols icon fonts. LINE Flex JSON supports **none** of these (box/text/image/icon/button/separator/filler only, no animation, no blur, no grid). All 13 will degrade materially when translated to real Flex JSON — this is the single largest implementation risk in the set and should be scoped before build.

---

## 4. Missing Screens Required for Each Flow to Actually Work

### 4.1 Cross-cutting / platform (blocks every flow)

- **LIFF init, LINE login/consent, profile linking, first-run permission prompts**
- **Onboarding / home dashboard** — there is no root screen; every flow starts mid-journey
- **Venue list / search / map** — the PRD sells a white-label B2B product but only one venue (Winner Court) exists anywhere
- **Loading, skeleton, empty, error, offline, retry states** — only one empty state exists (`empty_state`)
- **Notification settings, help/support, ToS & privacy, language switch, account/profile settings** (`tune` button on `player_career_stats` is dead)
- **The two bottom-nav destinations that ship in the nav bar but have no screen:** "อัตราค่าบริการ" (rate card, `data-path=court-rates`) and "สมาชิก / member-card" (membership)
- **Gang model entirely absent:** create a gang, join/invite, roster management, roles, gang settings — yet "สมาชิกก๊วน" is a nav tab and every screen assumes a gang exists

### 4.2 Flow A — Booking & payment

- Date-picker calendar modal (the `calendar_month` button on `_1` is decorative)
- Working slot-selection state machine (multi-hour range, extend/clear, price accumulation) — `2.` is entirely hardcoded
- Add-ons: racket rental, shuttlecock tubes, guest count — **PRD Module 2 explicitly requires an itemized breakdown of these**; `winner_court_2` shows court fee + ฿0 platform fee only
- Promo code / member discount
- **Payment processing / pending-webhook state**
- **Payment failed / hold expired / court released** — the `promptpay_qr` timer freezes at 00:00 with no handling
- **Card / debit checkout** — a tab exists on `promptpay_qr`, no screen behind it
- **Cash-at-counter confirmation** — a whole payment path offered on `winner_court_2` with no downstream screen (and it breaks the automated-webhook KPI)
- Receipt / tax invoice ("ดูใบเสร็จ" on `_3` is dead)

### 4.3 Flow A′ — Booking management

- **Booking detail screen** (cards on `_3` are not tappable)
- **Cancel booking → confirm → refund status** (`_3` has a "ยกเลิกการจอง" button with no destination; policy states 3 h, PRD states 4 h)
- **Reschedule / change slot**
- Repeat-booking flow ("จองซ้ำ" / "จองเวลานี้อีกครั้ง" are dead)
- Past-bookings pagination (`_3` claims 5 past bookings, renders 3)

### 4.4 Flow B — Split bill

- **Entry point from a booking to "create a split bill"** — the single hardest break in the whole set
- Organizer PromptPay account entry/edit (PRD requires input; the screen is read-only)
- Slip **camera / file picker** (no `<input type="file">` anywhere)
- **OCR failure, amount mismatch, wrong-recipient, duplicate-slip** states
- Nudge/reminder confirmation, overdue member state
- Uneven split / per-member custom amount / refund of overpayment
- Slip evidence gallery ("ดูหลักฐานสลิปทั้งหมด (5 ใบ)" is dead)
- PDF export ("ส่งออกบิล PDF" is dead)

### 4.5 Flow C — IoT check-in

- **15-minute pass-unlock gate** (PRD requirement, unimplemented)
- **Scan failed / QR expired / invalid pass / relay unreachable**
- Genuine full-screen high-brightness inverted-contrast mode — `4_full_screen_court_light_qr_pass` is an ordinary scrolling page with five cards under the QR; the brightness control only fires a toast
- **Live 60-minute countdown, 5-minute pre-turnoff warning, session-ended / lights-off screen** (PRD Module 4; every timer in the set is static text)
- Extend session / add time
- Staff / counter override + kiosk view
- Real dynamic QR renderer — every "QR" in the set is a hand-drawn SVG or a Material icon in a box

### 4.6 Flow D — Scoring

- **Match setup**: pick format (21 vs 30, singles vs doubles), assign players/teams, choose court, start match
- **Undo** (PRD Module 5 requires it; only "−1" exists, and it does not roll back the rally-log row it created)
- **Deuce detection UI** — `4_court_4_live_scoreboard` explicitly states "ไม่ดิวซ์" and has no 2-point-margin logic, contradicting the PRD and its own Module 6 example ("30 : 28 Deuce x2")
- End-match confirmation, abandoned/interrupted match, correction after finish
- **Defeat / consolation post-match screen** (only winner states designed; also no defeated-capybara mascot pose)
- Doubles Live Score Flex for the duel track / doubles Insights Flex

### 4.7 Flow E — Duels

- Opponent picker / player directory / search
- **Decline, counter-offer, reschedule negotiation** (buttons exist on `line_match_challenge_flex_message` and `line_rematch_challenge_flex_message`, nothing behind them)
- Expired / withdrawn / cancelled challenge states
- Calendar sync confirmation (PRD says accepting "locks both schedules into calendar"; only `rematch_accepted_locked` even has the button)
- Scouting report ("ดูการวิเคราะห์จุดอ่อนจุดแข็งก่อนแข่ง" is a dead link)
- Co-op / partner-invite mode — the tab exists on `match_challenge_sheet` and renders identical content
- Partner-finder detail & join confirmation (`duel_lobby_match_center`'s board has no destination)

### 4.8 Flow F — Stats & leaderboard

- Season / all-time leaderboard views (toggle is inert)
- Player directory + tappable rows into profiles
- Badge gallery (18/24) and badge-earned notification
- Ken's own career-stats screen (PRD Screen 34 specifies **Ken**; only Mind's exists)
- Metric-filtered leaderboard views (Win% / matches / MVP chips are inert)
- Match-insights entry points from the profile and from `past_duels_history`

### 4.9 Admin / Owner console — **entirely absent**

The PRD names "Owner Somchai" as a primary persona and calls the product B2B SaaS / white-label, but **zero owner-facing screens exist**. At minimum required:

- Owner dashboard (today's occupancy, revenue, energy)
- Court & slot management, block-out / maintenance scheduling
- Pricing & peak-rule editor (the mockups ship three conflicting rate cards)
- Walk-in / phone booking entry, front-desk check-in override
- Payment reconciliation & payout, refund approval
- IoT device health, per-court light control, manual override
- Occupancy & electricity-savings reports (the 15–22 % KPI has no surface)
- Staff accounts & permissions, multi-venue switcher

---

## 5. Duplicate & Near-Duplicate Mockups

### 5.1 Hard duplicates — same PRD slot, incompatible content (must be reconciled or one retired)

| Pair | Conflict |
|---|---|
| `4_court_light_turned_on_feedback` ↔ `court_light_activated_feedback` | Both are PRD Screen 40 "Court Light Turned ON". Court **4** vs **3**; duel vs 5-person gang; 60-min vs 2-hour session; AC 22 °C vs 23 °C; dark neon takeover vs light bottom sheet; different CTA sets; the dark one abandons the entire design token config and uses stock amber/emerald/slate. |
| `4_court_4_live_scoreboard` ↔ `match_scoreboard` | Two live scoreboards with incompatible data models: player-vs-player 30-point single set (no deuce) vs team-vs-team multi-set 21-point. Different chrome (no bottom nav vs bottom nav). |
| `30_4_court_4_victory_summary` ↔ `post_match_victory_card` | Two post-match victory screens: singles duel vs doubles best-of-3. The doubles one also uses a completely different `brand.*` palette + Plus Jakarta Sans. |
| `line_post_match_duel_victory_flex` ↔ `flex_message_line_post_match_summary_flex` | Two competing Victory-Flex designs for PRD Screens 7/36, with opposite framing conventions (full-screen fake chat vs app-header + preview banner + fake chat + bottom nav). |
| `match_insights_wc_duel43` ↔ `match_insights_point_replay` | Two "Match Insights & Replay" screens (PRD Screens 5/35): 58-point singles duel vs 42-point doubles set. |
| `duel_lobby_match_center` ↔ `past_duels_history` | Different PRD screens (25 vs 24) but `past_duels_history` is **titled** "Duels Match Center" — a name collision that will read as the same destination. |

### 5.2 Near-duplicates — intentional in-app ↔ Flex twins (keep both, keep in sync)

| In-app | Flex twin | Shared payload |
|---|---|---|
| `100` | `line_100_line_flex_message_closed` | Court 3, 19:00–21:00, ฿600 / ฿120 × 5, `#WN-2405-3` |
| `split_bill_line_share` | `line_line_chat_bubble_preview` | same ฿440 + ฿160 = ฿600 bill, PromptPay 081-234-5678 |
| `duel_accepted_match_locked` | `line_flex_message_duel_accepted_flex` | `#WC-DUEL42`, Fri 31 May 19:00–20:00, Court 3 |
| `rematch_accepted_locked` | `line_rematch_accepted_flex` | `#WC-DUEL43`, Fri 31 May 20:00–21:00, Court 4 (light code differs: `#43-AUTO-LIGHT` vs `#43-AUTO`) |
| `match_challenge_sheet` | `line_match_challenge_flex_message` | Ken's composed message is byte-identical in both |
| `rematch_challenge_sheet` | `line_rematch_challenge_flex_message` | same, for the rematch |
| `match_scoreboard` | `line_live_score_flex_message` | 18-19, set 1 21-17, "1 ชม. 38 น." copied verbatim |
| `leaderboard_ranking` | `line_flex_message_leaderboard_flex` | all six EXP figures match exactly |
| `player_career_stats` | `line_player_card_flex_message` | Lv.28, 69 %, 98/142, 5-win streak |
| `post_match_victory_card` | `flex_message_line_post_match_summary_flex` | identical doubles match down to the 38-shot rally |
| `_3` | `empty_state` | populated vs empty variant of My Bookings |

### 5.3 Copy-paste shells (should be one component, not two files)

- `line_flex_message_leaderboard_flex` and `line_player_card_flex_message` share their entire app-header + preview-bar + LINE-chrome + bottom-nav scaffolding, differing only in wallpaper hex and bubble contents.
- All four `line_*challenge*`/`*accepted*` duel Flex previews share ~80 % of their card anatomy and should collapse into one parameterised component with a `pending | accepted` state prop.
- `capybara_pose_1` and `capybara_pose_2` share byte-identical ground shadow, foot ellipses and body dome — should be one `<symbol>`.

### 5.4 Scenario fork (an IA-level duplication, not a file duplication)

The set contains **two parallel match universes** that never reconcile:

- **Universe 1 (PRD-canonical):** Ken vs น้องมายด์, singles, 30 points, Court 4, `#WC-DUEL43`, boba wager, 52 min, 58 points, 38-shot rally at 28-28.
- **Universe 2 (unlisted in the PRD):** ก๊วนวันศุกร์ doubles, ต้น & นนท์ vs ปาล์ม & มายด์, best-of-3 to 21, Court 3, MVP มายด์, 48 min, 42 points.

`player_career_stats` compounds this: Mind's "current streak 5 wins" contradicts her own listed loss on 10 พ.ค., and `#WC-DUEL43` (which she lost to Ken) appears in neither her streak nor her match history.

---

## 6. Structural IA Problems to Resolve Before Build

1. **Five competing bottom-navigation models** across 48 screens:
   - **A** `จองคอร์ด / ประวัติจอง / อัตราค่าบริการ / สมาชิก` — ~20 screens (booking, split bill, check-in, doubles track, stats previews)
   - **B** `จองคอร์ท / ท้าดวล / อันดับก๊วน / สมาชิกก๊วน` — `duel_lobby_match_center`, `rematch_challenge_sheet`, `past_duels_history`
   - **B′** variants: `…/ อันดับก๊วน / โปรไฟล์` (`leaderboard_ranking`), `…/ ก๊วนของฉัน / โปรไฟล์` (`line_rematch_challenge_flex_message`), `…/ สมาชิก` (`line_match_challenge_flex_message`)
   - **C** English `Chat / Duels / Courts / Squad` (`30_pre_match_notification`, `line_rematch_accepted_flex`) and `Group / Slots / Stats / Split` (`line_match_insights_flex_message`)
   - **D** No nav at all — every Court-4 duel screen, both accepted-duel screens, both singles insights/victory screens
   A single IA must be chosen; models A and B share only one destination, and neither exposes the scoring, duel or stats modules that most of the product consists of.
2. **`aria-current="page"` is wrong on ~12 screens** — it sits on `จองคอร์ด` on scoreboards, leaderboards, profiles and Flex previews; on `_3` and `empty_state` the markup and the runtime JS actively disagree.
3. **Nav typo `จองคอร์ด` (chord) for `จองคอร์ท` (court)** ships in ~20 files.
4. **Three conflicting rate cards** (฿160 / ฿180 / ฿200 / ฿220 / ฿360-for-2h) against a PRD that specifies 260 THB/hr; **four booking-ID schemes** (`#WN-2405-8839`, `#WN-2405-3`, `WN-2024-C03`, `#WC-DUEL4x`) against a PRD that specifies `#WC-202410-B84`; **three venue phone numbers**; **two cancellation windows** (3 h in mockups, 4 h in PRD); **court surfaces contradict per court across screens**.
5. **Four competing colour palettes** all claiming the name "Honey Oat & Navy Court": the `honey_oat_navy_court/DESIGN.md` M3 tokens (used by most screens), the DESIGN.md prose hexes (`#DDA15E`/`#606C38`, used by the component sheet and mascots), the PRD tokens (`#2e7d32`/`#d97706`, used **nowhere**), and bespoke `brand.*` sets in `post_match_victory_card`, `leaderboard_ranking`, `duel_accepted_match_locked` and `line_flex_message_duel_accepted_flex`.
6. **The mascot vector suite is orphaned** — all four `capybara_pose_*` SVGs are referenced by **zero** screens; 44 screens hotlink expiring `lh3.googleusercontent.com/aida/…` raster placeholders instead, frequently reusing one image for three different identities (user avatar / coach / bot).
7. **The component sheet covers none of the components the product actually needs** — no progress bar, countdown timer, QR pass, scoreboard, Flex-card spec, chat bubble or bottom-nav spec, so no screen can cite it as a source of truth.