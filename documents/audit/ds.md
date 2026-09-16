Verified against source. Here is the report.

---

# Winner Court — Design System Report (as-built)

**Corpus audited:** 48 `code.html` files + 2 `DESIGN.md` files across 54 folders in `/documents/stitch/`.
**Method:** every claim below was grepped/counted against the actual markup, not inferred from the extraction.

---

## 0. Executive summary — the one thing to know

There are **five competing colour systems** in this repository claiming to be the same brand. Only one of them actually ships at scale:

| System | Where it lives | Files | Verdict |
|---|---|---|---|
| **M3 generated tokens** (`primary #07182e`, `secondary #835418`, `secondary-container #fdbd77`) | `DESIGN.md` YAML front-matter → inlined `tailwind.config` | **38 / 48** | ✅ **This is the real system.** Byte-identical across all 38. |
| **DESIGN.md prose palette** (`#DDA15E`, `#606C38`, `#748CAB`, `#E0A899`, `#FDFBF7`) | `DESIGN.md` body text + component sheet | 7 (4 are mascot SVGs) | ❌ Mostly fiction — see §1.3 |
| **PRD palette** (`#d97706`, `#f59e0b`, `#2e7d32`, `#10b981`) | PRD only | 0–3 incidental | ❌ Never shipped |
| **Bespoke `brand.*` forks** | 4 files, 4 mutually different | 4 | ⚠️ Must be reconciled or retired |
| **Candy** (`#e040a0` hot pink, DM Sans) | `candy/DESIGN.md` only | **0** | 🗑️ Orphan — see §5 |

**The single most important discrepancy:** `#606C38` (Olive Meadow) is the most-used hardcoded colour in the entire codebase — **148 utility-class occurrences across 25 files** — and it has **no token**. It is the de-facto "available / confirmed / paid / success" colour, and every screen re-types the literal. The M3 config ships **no success-green token at all**; its `tertiary` is `#131a00` (near-black olive), which is why several screens render "PAID" badges as black.

---

## 1. Token set: specified vs. as-built

### 1.1 Colour — the shipping token set (38 files, zero variance)

Verified identical in all 38 files. `primary`, `secondary`, `tertiary`, `surface` returned exactly one value each across the whole corpus.

| Token | Hex | Real role in the markup |
|---|---|---|
| `primary` | `#07182e` | Headings, primary CTA fill, active nav. **Near-black, not brand navy.** |
| `on-primary` | `#ffffff` | |
| `primary-container` | `#1d2d44` | **The actual brand navy.** Hero cards, selected slots, LINE Flex headers, icon tiles. |
| `on-primary-container` | `#8595b0` | Muted copy on navy |
| `primary-fixed` | `#d5e3ff` | Light-blue avatar/badge fills |
| `primary-fixed-dim` / `inverse-primary` | `#b7c7e5` | Names on navy, chat wallpaper tint |
| `on-primary-fixed` | `#0b1c32` | |
| `on-primary-fixed-variant` | `#384760` | |
| `secondary` | `#835418` | **Renders dark brown, not "honey."** Peak-hour prices, accent icons, progress fills |
| `on-secondary` | `#ffffff` | |
| `secondary-container` | `#fdbd77` | Peak pills, countdown chips, "recommended" badges |
| `on-secondary-container` | `#784a0d` | |
| `secondary-fixed` | `#ffdcbb` | Tonal secondary buttons, wager strips |
| `secondary-fixed-dim` | `#faba75` | Hover on the above |
| `on-secondary-fixed` | `#2b1700` | |
| `on-secondary-fixed-variant` | `#673d00` | |
| `tertiary` | `#131a00` | ⚠️ Near-black. Misused as a "success" fill → paid badges read black |
| `on-tertiary` | `#ffffff` | |
| `tertiary-container` | `#263003` | Verified pills |
| `on-tertiary-container` | `#8c9960` | Olive small text — **3.07:1 on white, fails AA** |
| `tertiary-fixed` | `#dbe9a9` | Availability chips, MATCH LOCKED pills |
| `tertiary-fixed-dim` | `#bfcd8f` | Pulse dots |
| `on-tertiary-fixed` | `#171e00` | |
| `on-tertiary-fixed-variant` | `#404b1b` | |
| `error` | `#ba1a1a` | |
| `on-error` | `#ffffff` | |
| `error-container` | `#ffdad6` | Booked/maintenance cells, deuce pills |
| `on-error-container` | `#93000a` | |
| `surface` / `background` / `surface-bright` | `#fbf9f5` | Page canvas |
| `surface-dim` | `#dbdad6` | |
| `surface-container-lowest` | `#ffffff` | Cards, slot chips |
| `surface-container-low` | `#f5f3ef` | Inset panels, legends, time axis |
| `surface-container` | `#efeeea` | Tab tracks, chips |
| `surface-container-high` | `#eae8e4` | Matrix headers, secondary buttons, status chips |
| `surface-container-highest` / `surface-variant` | `#e4e2de` | Progress tracks, disabled |
| `on-surface` | `#1b1c1a` | |
| `on-surface-variant` | `#44474d` | Body-secondary |
| `outline` | `#75777e` | **4.47:1 on white — marginal AA fail** |
| `outline-variant` | `#c5c6cd` | Hairlines, dashed tear lines |
| `inverse-surface` / `inverse-on-surface` | `#30312e` / `#f2f0ed` | Toasts |
| `surface-tint` | `#4f5f79` | Rarely used |

### 1.2 Colours used in production that have NO token (the real gap)

| Hex | Occurrences | Files | Role | Should become |
|---|---|---|---|---|
| **`#606C38`** | **148** | **25** | available / confirmed / paid / open-status dot / win pill | `success` (+ container/on- pair) |
| **`#06C755`** | **36** | **21** | LINE brand green CTA | `line` (+ `line-hover #05b34c`) |
| `#1d2d44` (as arbitrary) | 43 | many | redundant hardcoding of `primary-container` | delete; use the token |
| `#DDA15E` | 16 | 7 (4 = mascots) | DESIGN.md "Honey Oat" | see §1.3 |
| `#16A34A` | 6 | 2 | ad-hoc success green (copy-confirm) | fold into `success` |
| `#849eb2`, `#8C9DAC`, `#798e9f`, `#8499B1`, `#8BA2B5`, `#849ebc` | ~12 | 6 | **six different LINE chat wallpapers** | one `line-chat-bg` token |
| `#202E38`, `#203248`, `#2C3E50`, `#2b3a4a`, `#708b9f` | ~10 | 5 | **five different LINE chat header bars** | one `line-chat-bar` token |
| `#D1D5DB`, `#64748B`, `#6B7280` | ~17 | 6 | stock Tailwind greys leaking in | map to `outline-variant` / `on-surface-variant` |

### 1.3 DESIGN.md prose palette — mostly did not ship

Grep results for the five named colours in the DESIGN.md prose:

| DESIGN.md prose name | Hex | Files containing it | Product screens containing it |
|---|---|---|---|
| Secondary — Honey Oat | `#DDA15E` | 7 | **3** (`player_career_stats`, `line_player_card_flex_message`, `line_flex_message_leaderboard_flex`) |
| Tertiary — Olive Meadow | `#606C38` | **25** | 24 — ✅ the one survivor, but **untokenized** |
| Support — Slate Blue | `#748CAB` | 5 | **1** |
| Support — Dusty Rose | `#E0A899` | **1** | **0** — component sheet only |
| Neutral BG — Warm Cream | `#FDFBF7` | 2 | **0** — production uses `#fbf9f5` |

**Verdict:** DESIGN.md's prose §Colors describes a system that was never built. The YAML front-matter is what the generator consumed and what shipped. Four of five named colours are effectively decoration on a spec document.

### 1.4 "DESIGN.md says `#DDA15E` but PRD says `#d97706` — which wins in code?"

**Neither.** Code uses `secondary-container: #fdbd77`.

```
#DDA15E  (DESIGN.md prose)  →   7 files, 4 of them mascot SVGs
#d97706  (PRD boba-amber)   →   1 file  (as brand.amber in a bespoke fork)
#f59e0b  (PRD boba-amber-2) →   3 files (incidental stock Tailwind amber-500)
#fdbd77  (M3 config)        →  38 files ← WINS
```

Same for green:

```
#2e7d32  (PRD court-green)  →  0 files
#10b981  (PRD court-green)  →  0 files
#606C38  (DESIGN.md olive)  → 25 files ← WINS, as a raw literal
```

**Rule of thumb for the team: the YAML front-matter won; both prose specs lost.**

### 1.5 Typography

**Specified (DESIGN.md YAML — faithfully reproduced in all 38 configs):**

| Style | Family | Size / LH | Weight | Tracking |
|---|---|---|---|---|
| `display-lg` | Noto Sans | 40 / 48 | 700 | −0.02em |
| `display-lg-mobile` | Noto Sans | 32 / 40 | 700 | −0.01em |
| `headline-lg` | Noto Sans | 28 / 36 | 600 | −0.01em |
| `headline-md` | Noto Sans | 22 / 28 | 600 | — |
| `headline-sm` | Noto Sans | 18 / 24 | 600 | — |
| `body-lg` | Inter | 16 / 24 | 400 | — |
| `body-md` | Inter | 14 / 20 | 400 | — |
| `body-sm` | Inter | 12 / 16 | 400 | — |
| `label-lg` | Inter | 14 / 20 | 600 | 0.01em |
| `label-md` | Inter | 12 / 16 | 600 | 0.02em |
| `label-sm` | Inter | 11 / 14 | 500 | 0.03em |

Note the unusual generated pattern: **font family and font size are separate scales with the same key**, so every element carries both — `class="font-headline-sm text-headline-sm"`. That is the house convention, used consistently.

**As-built discrepancies:**

1. **15 of 44 Tailwind files never load Noto Sans Thai.** They request only Inter + Noto Sans while rendering 100% Thai copy, so Thai falls back to the system font — breaking DESIGN.md's stated "identical baseline metrics" requirement. Affected: `30_4_court_4_victory_summary`, `30_pre_match_notification`, `4_court_4_live_scoreboard`, `4_full_screen_court_light_qr_pass`, `duel_lobby_match_center`, `line_match_challenge_flex_message`, `line_match_insights_flex_message`, `line_post_match_duel_victory_flex`, `line_rematch_accepted_flex`, `line_rematch_challenge_flex_message`, `match_challenge_sheet`, `match_insights_wc_duel43`, `past_duels_history`, `rematch_accepted_locked`, `rematch_challenge_sheet`.

2. **Tabular figures are effectively unimplemented.** DESIGN.md: *"Numbers in court schedules, 24-hour time slots, and THB currency displays **must** default to tabular figures."* Actual: `tabular-nums` appears **1 time** in 48 files; `font-variant-numeric` **0 times**; `font-feature-settings:"tnum"` only in the component sheet's `.font-num`. Every price column and time axis in the booking grid is proportional.

3. **Off-scale sizes are rampant.** `text-[9px]`, `[10px]`, `[11px]`, `[13px]`, `[15px]`, `[22px]`, `[64px]` used freely alongside the named scale.

4. Two files inject **Plus Jakarta Sans** as a `display` face (`post_match_victory_card`, `leaderboard_ranking`) — not in the system.

### 1.6 Radii — spec and code disagree by one step

| Key | DESIGN.md YAML | **Shipped config** | Tailwind fallback if unset | Uses |
|---|---|---|---|---|
| `sm` | 0.25rem | *not overridden* | 0.125rem | 1 |
| `DEFAULT` | 0.5rem | **0.25rem** | — | 128 |
| `md` | 0.75rem | *not overridden* | 0.375rem | 23 |
| `lg` | 1rem | **0.5rem** | — | 426 |
| `xl` | 1.5rem | **0.75rem** | — | **439** |
| `2xl` | — | *not overridden* | **1rem** | 94 |
| `full` | 9999px | **9999px** | — | **985** |

The generated config **compressed every step**. Consequence: DESIGN.md's prose says *"Cards, Court Matrix Containers, Panels: 16px border radius (`rounded-lg`)"* — but `rounded-lg` in code is **8px**. Cards that read as 16px in the design intent are actually built with `rounded-xl` (12px) or `rounded-2xl` (16px, only because it falls through to the Tailwind default). **The prose radius guidance is unusable against this config.**

**Effective as-built radius language:** `rounded-full` for all pills/avatars → `rounded-xl` (12px) for cards, CTAs, inputs → `rounded-lg` (8px) for slot chips, icon tiles, inner blocks → `rounded-2xl` (16px) for elevated sheets, LINE Flex bubbles, chat bubbles.

### 1.7 Spacing

Specified and shipped identically in all 38 configs:

```
space-2xs .25rem | space-xs .5rem | space-sm .75rem | space-md 1rem
space-lg 1.5rem  | space-xl 2rem  | space-2xl 3rem  | space-3xl 4rem
gutter-mobile 1rem | gutter-desktop 1.5rem
margin-mobile 1rem | margin-tablet 2rem | margin-desktop 3rem
```

Real usage frequency: `space-xs` (480) ≫ `space-md` (321) ≫ `space-sm` (239) ≫ `space-2xs` (65) ≫ `space-lg` (18) ≫ `space-2xl` (5) ≫ `space-3xl` (1). `px-gutter-mobile` (31) and `px-margin-mobile` (19) are used interchangeably for the same 16px gutter — pick one.

### 1.8 Elevation — spec vs. code

DESIGN.md specifies exactly three levels. **None of them exist as tokens; none of the specified values appear in code.**

| DESIGN.md level | Specified value | Found in code? |
|---|---|---|
| L1 court surfaces | 1px `rgba(116,140,171,0.20)` outline, no shadow | ❌ 0 occurrences |
| L2 active cards | `0 4px 16px -2px rgba(29,45,68,0.08)` | ❌ 0 (a `…0.06` variant appears 3×) |
| L3 modals/sticky | `0 12px 32px -4px rgba(29,45,68,0.14)` | ❌ 0 |

**What actually ships** — stock Tailwind shadows plus two recurring arbitrary values that are the true chrome tokens:

```
shadow-sm      468×   ← the workhorse
shadow-md      103×
shadow-lg       20×
shadow-xl       19×
shadow-inner    16×
shadow-2xl      12×

shadow-[0_1px_8px_rgba(0,0,0,0.04)]        28×  ← fixed app header (de-facto token)
shadow-[0_-2px_12px_rgba(29,45,68,0.06)]   25×  ← fixed bottom nav (de-facto token)
```

---

## 2. Component catalog

Components recurring in ≥3 files, with real variants and states.

### 2.1 App shell

**Fixed top app bar** — 33 files. `h-16` (64px) + `pt-safe`, `bg-surface/80 backdrop-blur-xl` (25 files), `shadow-[0_1px_8px_rgba(0,0,0,0.04)]`. Contents: 44px `home` icon button → venue title `วินเนอร์ คอร์ท (Winner Court)` (`truncate max-w-[190px]`) over an opening-hours pill with a `#606C38` dot → 32px circular avatar.
*Variants:* standard · chat-room header (navy fill, back/search/call/menu) · flow header (back + centred stepper title) · modal header (close ✕).

**Fixed bottom tab bar** — 34 files. `h-16` + `pb-safe`, `bg-surface/85 backdrop-blur`, `shadow-[0_-2px_12px_rgba(29,45,68,0.06)]`, 4 items.
⚠️ **Four mutually incompatible navigation models exist:**
| Model | Tabs | Files |
|---|---|---|
| A (dominant) | จองคอร์ด · ประวัติจอง · อัตราค่าบริการ · สมาชิก | ~23 |
| B | จองคอร์ท · ท้าดวล · อันดับก๊วน · สมาชิกก๊วน | ~4 |
| C | จองคอร์ท · ประวัติจอง · อันดับก๊วน · โปรไฟล์ | 1 |
| D (English) | Chat · Duels · Courts · Squad | 2 |

⚠️ **`จองคอร์ด` is a typo** (คอร์ด = musical *chord*; correct is `จองคอร์ท`). Shipped in **23 files**; only 7 files spell it correctly.
⚠️ `aria-current="page"` is stuck on the booking tab on scoreboard, stats, leaderboard and Flex-preview screens.

**`main` container** — `pt-16 pb-24` (25 files), gutters `px-space-md` / `px-gutter-mobile`, children `space-y-space-md`.

### 2.2 Court booking grid (the core)

**Slot chip** — the most state-rich component. Two incompatible implementations exist:

| State | Component sheet (canonical) | Production (`_1`, `2.`) |
|---|---|---|
| Available | `#FAF8F2` fill, 2px `#D9D3C7` border, hover→`#DDA15E`, price in `#785E3A` | `surface-container-lowest`, `#606C38` price + dot |
| Available (peak) | — | white card, `secondary` price, row tinted `secondary-container/10–15` |
| **Selected** | `#1D2D44` fill + 2px `#DDA15E` border + check | `primary-container` fill, `secondary-container` label, connector bridge with pulsing dot for multi-hour merge |
| Booked | `.pattern-booked` 45° hatch + warning icon, `cursor-not-allowed` | ⚠️ **`_1` = red `error-container`; `2.` = grey `surface-container-high`** — inverted |
| Maintenance | `.pattern-maintenance` dot grid + gear icon | ⚠️ **`_1` = grey; `2.` = red** — inverted |

⚠️ **Semantic colour inversion between two sibling booking-grid screens is the highest-severity component defect.** Must be settled before build.
⚠️ Only the component sheet implements the non-colour-only encoding (hatch/dot patterns) that DESIGN.md and the sheet itself advertise as the accessibility guarantee. **Production drops it entirely.**
⚠️ Booked/maintenance cells are rendered as `<div>` or as non-`disabled` `<button>` — not announced as disabled, still focusable.

**Court × time matrix** — sticky court header row + fixed `w-16`/`w-20` left time axis + `overflow-x-auto` body (`min-w-[570px]`–`[590px]`), cells `w-[95px] × h-14`. Two build strategies: one scroll container (`_1`) vs. two JS-synchronised panes (`2.`).

**Date picker strip** — horizontal scroll, `min-w-[58px]` pills, `rounded-xl`, edge-bleed via `-mx-space-md px-space-md`. States: today/selected (`primary-container` + `secondary-container` dot) · default (white card) · past (`surface-container-low`, greyed) · with status sub-chip.

**Legend bar** — `surface-container-low rounded-xl`, 4 swatch+label keys, `overflow-x-auto`.

**Sticky booking drawer** — `fixed bottom-16`, `rounded-2xl`, `shadow-[0_12px_36px_rgba(29,45,68,0.18)]`, `pointer-events-none` wrapper / `pointer-events-auto` card. States: **empty** (instructional copy, `disabled` CTA) · **populated** (court chip, duration, peak chip, total in `headline-lg`, enabled CTA).

### 2.3 Buttons

| Tier | As-built | Height | DESIGN.md says | Match? |
|---|---|---|---|---|
| Primary | `bg-primary` (#07182e) or `bg-primary-container` (#1d2d44), `text-on-primary`, `rounded-xl` | 48–52px | `#1D2D44` fill, `#FDFBF7` text, 12px radius, min 48px | ⚠️ fill is often the darker `#07182e`; text is `#ffffff` not `#FDFBF7` |
| Secondary (tonal) | `bg-secondary-fixed` (#ffdcbb) or `bg-surface-container-high`, `text-primary` | 44px | Honey Oat tint + navy text, no border | ✅ tonally |
| Tertiary / outline | rare; `bg-transparent` + text | — | 1.5px Slate Blue border | ❌ **never built** (`border-1.5` isn't a Tailwind class — the one attempt renders borderless) |
| **LINE green** | `bg-[#06C755]` hover `#05b34c`, `text-white` | 48px | **not in DESIGN.md at all** | ❌ undocumented but ships in 21 files |
| Disabled | `bg-surface-container-high`, `opacity-80`, `cursor-not-allowed` | — | — | contrast fail (§4) |

Universal press feedback: `active:scale-95` / `active:scale-[0.98]` / `active:scale-[0.99]`. ⚠️ `active:scale-98` (4 occurrences) is **not a valid class** and does nothing.

### 2.4 Status badges & pills

Recurring set, all `rounded-full`:

| Semantic | As-built | Note |
|---|---|---|
| Confirmed / paid / available | `bg-[#606C38]` + white, **or** `bg-tertiary-fixed #dbe9a9` + `on-tertiary-fixed`, **or** `bg-tertiary #131a00` (black) | ⚠️ **three visual languages for one state** |
| Pending payment / hold | `bg-secondary-container #fdbd77` + `on-secondary-container`, `animate-pulse` | DESIGN.md specifies Dusty Rose `#E0A899` — never used |
| Peak hour | `bg-secondary-container` / `bg-secondary-fixed`, bolt icon | |
| Full / error / deuce | `bg-error-container #ffdad6` + `on-error-container` | |
| Live / ready | dot + `animate-ping` | ⚠️ several use `animate-ping` with **no static dot behind it**, so the indicator blinks out entirely |
| Neutral meta | `bg-surface-container-high` + `on-surface-variant` | |

### 2.5 Cards

- **Standard card** — `bg-surface-container-lowest rounded-xl shadow-sm p-4`.
- **Hero/elevated card** — `rounded-xl shadow-md`, optional 6px left accent bar (`bg-secondary` / `bg-secondary-container`).
- **Navy feature card** — `bg-primary-container`, blurred decorative orbs (`blur-xl`/`blur-2xl` at 10–30% opacity), 10%-opacity SVG court-line watermark. Recurs across hero banners, duel spotlights, Flex headers.
- **Ticket / boarding-pass card** — navy brand strip + 24px perforation row with two 20px notch cut-outs + dashed `outline-variant` tear line + oat footer.
- **Inset panel** — `bg-surface-container-low rounded-lg p-3`, label/value rows.

### 2.6 LINE-specific components

- **LINE Flex bubble** — `max-w-[340px]`–`[370px]`, `rounded-2xl`, `shadow-xl`/`shadow-2xl`, band stack: navy header → hero → body blocks → button stack → footer credit strip.
- **Simulated chat canvas** — wallpaper + chat header bar + date-divider pill + incoming bubble (`rounded-2xl rounded-tl-sm`, avatar, sender name, timestamp) + read receipt (`อ่านแล้ว n`).
- **Plain-text fallback card** — `select-all` `<pre>`/div + copy button with 2–2.5s label swap.

⚠️ **Fidelity warning for engineering:** every Flex mock uses CSS that **LINE Flex JSON cannot express** — gradients, `backdrop-blur`, `animate-ping`/`animate-pulse`/`animate-bounce`, `shadow-xl`, negative-margin overlaps, arbitrary CSS grid, opacity-modified fills, `truncate`, icon fonts. Real bubbles are limited to box/text/image/icon/button/separator/filler. These are **comps, not producible bubbles**; budget a translation pass.

### 2.7 Other recurring components

Progress bar (`h-2`–`h-2.5 rounded-full`, track `surface-container-highest`, fill `secondary`/`secondary-container`/`#606C38`) · segmented tab control (`p-1` track on `surface-container`, active = white pill + `shadow-sm`) · filter chip carousel (horizontal scroll, active = `bg-primary`) · member/roster row (monogram avatar + name + meta + right-aligned amount chip) · mascot card (64–112px image + quote + role chip) · toast pill (`fixed`, opacity+translate transition, 2000–2600ms) · countdown chip · stat tile grid (2-up / 3-up / 4-up) · QR panel (`shadow-inner`, brand header, white tile, centre badge) · copy-to-clipboard button (icon + label swap on success).

---

## 3. Tech conventions

| Convention | Reality |
|---|---|
| **Framework** | Tailwind **play CDN**, unpinned: `<script src="https://cdn.tailwindcss.com">` — 44/48 files. One uses `?plugins=forms,container-queries`. All Tailwind **v3** semantics. |
| **Config** | Inlined `<script id="tailwind-config">tailwind.config={...}</script>`, `theme.extend` only. 38 files identical; 4 bespoke `brand.*` forks; 2 files have **no config at all** (component sheet, dark feedback screen) and use raw arbitrary hex throughout. |
| **Dark mode** | `darkMode:'class'` declared in **38 files**. **Zero `dark:` variants authored.** Dead config. |
| **Fonts** | Google Fonts `<link>`. Requested: `Inter:400,500,600,700` (36 files) · `Noto Sans:400,600,700` (28) · `Noto Sans Thai:400,500,600,700` (23, **should be 44**). Two files add Plus Jakarta Sans. `preconnect` to googleapis + gstatic present in most. |
| **Icons** | **Google Material Symbols Outlined** via webfont (38 files) — `<span class="material-symbols-outlined">name</span>`. Sized with `text-[Npx]`, filled via `font-variation-settings:'FILL' 1`. Two files use hand-rolled Heroicons-style inline SVG instead. One file (dark feedback) uses **no icon font at all** — inline SVG + emoji. Emoji are used as iconography throughout (🧋 🏸 🦫 ⚡ 🔥 👑). |
| **JS** | Plain vanilla, inline `<script>` at end of body — 35 files. 56 inline `onclick=` attrs, 51 `addEventListener`. Pattern: className string rewriting for state, `setTimeout` for fake async, `navigator.clipboard.writeText` for copy. **No framework, no build step, no modules.** |
| **LIFF SDK** | **Loaded in 0 files.** Every "share to LINE" is a fake toast, a `line.me/R/share?text=` plain-text link, or nothing. No `shareTargetPicker`. |
| **Assets** | **136 remote `<img>` refs to `lh3.googleusercontent.com` (56 distinct ephemeral Stitch URLs), 10 to `www.gstatic.com` placeholder SVGs, and 0 local assets.** All will 404. One avatar URL serves 3+ different identities (user, coach mascot, bot). |
| **Mascot** | 4 hand-authored SVGs exist (`capybara_pose_1..4`) but are saved with a **`.html` extension**, have hardcoded `width`/`height`, no `role="img"`/`<title>`, no `currentColor`, and are **referenced by zero screens**. Effectively orphaned. |
| **Base CSS** | `@layer base` block: `html,body{width:100vw;margin:0;padding:0}`, `overscroll-behavior:none`, `.pb-safe`/`.pt-safe` env() helpers, `main>:first-child{margin-top:0!important}`, and a global `::-webkit-scrollbar{display:none}`. |
| **`.no-scrollbar`** | Applied in 6 files, **defined in 1**. Works only by accident via the global scrollbar rule. |

### 3.1 Invalid / no-op Tailwind classes shipped

All verified by count. These silently do nothing:

| Class | Occurrences | Files | Effect |
|---|---|---|---|
| **`py-0.2`** | **47** | **24** | not a valid spacing step → **no vertical padding** on half the badges in the product |
| **`shadow-xs`** | **56** | **12** | Tailwind **v4** name → elements render **flat** |
| `bg-surface-lowest` | 10 | 1 | token is `surface-container-lowest` → **transparent** tiles/bubbles |
| `backdrop-blur-xs` | 5 | 4 | v4 name → no blur |
| `active:scale-98` | 4 | 2 | not on the scale → no press feedback |
| `space-y-space-2xs` | 3 | 3 | malformed |
| `shadow-2xs` | 8 | 1 | v4 name |
| `w-18` / `h-18` | 1 / 1 | 1 | not on the scale → **unsized avatar** (visibly breaks the leaderboard podium) |
| `border-1.5` | 1 | 1 | → **borderless** secondary button |
| `rounded-2xs`, `h-13`, `text-tertiary-fixed-variant` | 1 each | 1 each | no-ops |
| `class="… p- space-sm"` / `"… mb- space-xs"` | 2 | 2 | stray space splits the utility → no padding/margin |

---

## 4. Accessibility & mobile viewport

### 4.1 Viewport assumptions

- **38 files:** `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`
  ⚠️ `maximum-scale=1.0, user-scalable=no` **blocks pinch-zoom — a direct WCAG 2.1 SC 1.4.4 (Resize Text) failure.** Remove `maximum-scale`/`user-scalable`; keep `viewport-fit=cover`.
- **6 files:** plain `width=device-width, initial-scale=1.0`.
- 7 files force `body{min-height:max(884px,100dvh)}` — a 390×844 iPhone assumption baked into CSS.
- `html,body{width:100vw}` with **no `max-width` clamp** on most screens → they stretch full-bleed on desktop. Three files instead hard-frame a 390–410px device mock centred on a grey page (`leaderboard_ranking`, `post_match_victory_card`, `4_court_light_turned_on_feedback`, `line_flex_message_duel_accepted_flex`) — **inconsistent surface convention.**
- Safe areas handled via `.pt-safe`/`.pb-safe` env() helpers. ⚠️ Several sticky CTA bars sit at `bottom-16` above a `h-16` nav **without** accounting for `pb-safe`, so they collide on notched devices.
- DESIGN.md declares tablet/desktop breakpoints and a 1280px cap. **No product screen implements them** — this is a mobile-only LIFF system in practice.

### 4.2 Contrast — computed, not assumed

**Passes (AA normal text, ≥4.5:1):**

| Pair | Ratio |
|---|---|
| `primary #07182e` on `surface #fbf9f5` | **16.94** ✅ AAA |
| white on `primary-container #1d2d44` | **13.90** ✅ AAA |
| `on-secondary-fixed #2b1700` on `secondary-fixed #ffdcbb` | **13.23** ✅ AAA |
| `on-tertiary-fixed #171e00` on `tertiary-fixed #dbe9a9` | **13.29** ✅ AAA |
| `on-surface-variant #44474d` on `surface` | **8.86** ✅ AAA |
| navy `#1d2d44` on `secondary-container #fdbd77` | **8.42** ✅ AAA |
| `on-error-container #93000a` on `error-container` | **7.24** ✅ AAA |
| `secondary #835418` on white | **6.47** ✅ |
| `#606C38` on white / white on `#606C38` | **5.68** ✅ |
| `on-secondary-container #784a0d` on `secondary-container` | **4.57** ✅ (marginal) |
| `on-primary-container #8595b0` on `primary-container` | **4.58** ✅ (marginal) |

**Failures (must fix):**

| Pair | Ratio | Where | Fix |
|---|---|---|---|
| **white on `#06C755`** | **2.26** ❌ | **19+ LINE CTAs** — the primary share action across the product | Use `#1d2d44` text (7.89 ✅) or darken green to ~`#04803a` |
| **`on-tertiary-container #8c9960` on white** | **3.07** ❌ | olive "paid / verified / connected" micro-copy | Use `#606C38` (5.68 ✅) at ≥12px, or `#404b1b` |
| `outline #75777e` on white | **4.47** ❌ | maintenance labels, "booked" text | Darken to `#5f6169` or reserve for ≥18px |
| **white on `secondary-container #fdbd77`** | **1.65** ❌ | the amber-gradient Accept CTA in `line_rematch_challenge_flex_message` | Navy text — DESIGN.md already mandates this |
| disabled `#9A9892` on `#E4E2DC` | **2.23** ❌ | component sheet disabled button | Acceptable only if genuinely inert; still prefer ≥3:1 |
| `#748CAB` on white | **3.45** ❌ | DESIGN.md's own Support Accent | Large text / borders only |
| white on `#DDA15E` | **2.25** ❌ | — | DESIGN.md already forbids this; keep it forbidden |

The component sheet's claim *"คอนทราสต์ 13.5:1"* for `#1D2D44` is **verified correct** (13.45 on `#FDFBF7`, 13.22 on `#fbf9f5`).

### 4.3 Other a11y defects

- **`focus-visible`: 0 occurrences in 48 files.** `focus:outline-none` used with only one replacement ring. DESIGN.md's *"Focus ring: 2px Honey Oat with 2px offset"* is **implemented nowhere.** This alone fails keyboard operability across the entire product.
- **`data-alt` instead of `alt`** on many `<img>` elements — several still contain the raw AI image-generation prompt text. Those images have **no accessible name**.
- **No `role="dialog"` / `aria-modal` / focus trap / Escape handler** on any modal or bottom sheet.
- Disabled slots rendered as `<div>` or as `<button>` without the `disabled` attribute → focusable, not announced.
- Segmented tabs and radio-style selectors are `<button>`s with **no `role="tab"`/`role="radio"`, no `aria-selected`/`aria-checked`** — selection is invisible to AT.
- Court matrix is a scroll pane, **not a `<table>`** — no row/column header association.
- `aria-current="page"` frequently wrong (see §2.1).
- Copy actions use blocking `alert()` in one file.
- Inputs: **no visible border** (white fill + `shadow-inner`), contradicting DESIGN.md's 1.5px Slate Blue spec; no validation, no error state anywhere.

---

## 5. The `candy` DESIGN.md — verdict

**It is an unrelated orphan. Delete or archive it.**

Evidence:
- `candy/` contains **only** `DESIGN.md` (1,693 bytes). No `code.html`, no assets, no `screen.png`.
- Its colours — `#e040a0` hot pink, `#7c52aa` purple, `#0096cc` sky blue, `#fef7ff` pink-white — appear in **0 of 48** HTML files.
- Its font, **DM Sans**, appears in **0** files.
- The string "candy" appears in **0** files.
- Its design language ("Joyful Pop", saturated colours, bouncy `scale(1.03)` spring microinteractions, colourful tinted shadows, full-pill everything) **directly contradicts** the Honey Oat spec, which explicitly states it *"avoids aggressive, hyper-neon esports aesthetics"* and *"avoids synthetic neon glows and harsh drop shadows."*

It is almost certainly a leftover theme option from a Stitch/generator theme picker that was evaluated and discarded. Keeping it in the repo is an active hazard — a future contributor may read it as an alternative brand direction.

---

## 6. Ready-to-use `tailwind.config.js`

This encodes the **true system**: the 38-file M3 palette, plus the two colours the product cannot function without (`success` = `#606C38`, `line` = `#06C755`), plus the two de-facto chrome shadows, plus the DESIGN.md prose colours preserved under a clearly-labelled `legacy` namespace so nothing is lost.

```js
// tailwind.config.js — Winner Court design system (as-built, reconciled)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  // NOTE: `darkMode:'class'` was declared in all 38 generated configs but ZERO
  // dark: variants were ever authored. Enable only when you actually build dark.
  // darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ---------- PRIMARY / NAVY ---------- */
        primary: '#07182e',                        // headings, primary CTA (near-black)
        'on-primary': '#ffffff',
        'primary-container': '#1d2d44',            // THE brand navy: hero cards, selected slots
        'on-primary-container': '#8595b0',
        'primary-fixed': '#d5e3ff',
        'primary-fixed-dim': '#b7c7e5',
        'on-primary-fixed': '#0b1c32',
        'on-primary-fixed-variant': '#384760',
        'inverse-primary': '#b7c7e5',

        /* ---------- SECONDARY / HONEY-OAT FAMILY ---------- */
        secondary: '#835418',                      // reads dark brown, not honey
        'on-secondary': '#ffffff',
        'secondary-container': '#fdbd77',          // the visible "honey" — peak pills
        'on-secondary-container': '#784a0d',
        'secondary-fixed': '#ffdcbb',              // tonal secondary buttons
        'secondary-fixed-dim': '#faba75',
        'on-secondary-fixed': '#2b1700',
        'on-secondary-fixed-variant': '#673d00',

        /* ---------- TERTIARY / DEEP OLIVE ---------- */
        // WARNING: `tertiary` is near-BLACK. Do NOT use it as a success fill —
        // that is what makes "PAID" badges render black today. Use `success`.
        tertiary: '#131a00',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#263003',
        'on-tertiary-container': '#8c9960',        // 3.07:1 on white — LARGE TEXT ONLY
        'tertiary-fixed': '#dbe9a9',
        'tertiary-fixed-dim': '#bfcd8f',
        'on-tertiary-fixed': '#171e00',
        'on-tertiary-fixed-variant': '#404b1b',

        /* ---------- SUCCESS (NEW — formalises the 148 hardcoded #606C38) ----------
           This is DESIGN.md's "Olive Meadow". It was the only prose colour that
           survived into production, but always as a raw literal. Tokenise it. */
        success: '#606C38',                        // 5.68:1 on white — AA at any size
        'on-success': '#ffffff',
        'success-container': '#dbe9a9',
        'on-success-container': '#2f3a12',

        /* ---------- ERROR ---------- */
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        /* ---------- WARNING (NEW — the "pending hold" state has no token) ---------- */
        warning: '#835418',
        'warning-container': '#fdbd77',
        'on-warning-container': '#784a0d',

        /* ---------- SURFACES ---------- */
        surface: '#fbf9f5',
        background: '#fbf9f5',
        'surface-bright': '#fbf9f5',
        'surface-dim': '#dbdad6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3ef',
        'surface-container': '#efeeea',
        'surface-container-high': '#eae8e4',
        'surface-container-highest': '#e4e2de',
        'surface-variant': '#e4e2de',
        'surface-tint': '#4f5f79',
        'on-surface': '#1b1c1a',
        'on-background': '#1b1c1a',
        'on-surface-variant': '#44474d',
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f0ed',
        outline: '#75777e',                        // 4.47:1 — borders / ≥18px text only
        'outline-variant': '#c5c6cd',

        /* ---------- LINE BRAND (NEW — 36 hardcoded uses across 21 files) ---------- */
        line: {
          DEFAULT: '#06C755',
          hover: '#05b34c',
          // Accessible variant: white on #06C755 is 2.26:1 (FAIL).
          // Use `text-primary-container` on `bg-line`, or `bg-line-a11y` + white.
          a11y: '#04803a',
          'chat-bg': '#849eb2',                    // unify 6 divergent wallpapers
          'chat-bar': '#202e38',                   // unify 5 divergent header bars
        },

        /* ---------- LEGACY: DESIGN.md prose palette ----------
           Kept for the mascot SVGs + component sheet only. These are NOT the
           production palette: #E0A899 ships in 0 product screens, #748CAB in 1,
           #FDFBF7 in 0, #DDA15E in 3. Do not introduce them into new work. */
        legacy: {
          navy: '#1D2D44',
          'honey-oat': '#DDA15E',
          olive: '#606C38',
          slate: '#748CAB',
          'dusty-rose': '#E0A899',
          cream: '#FDFBF7',
        },
      },

      /* ---------- RADII ----------
         Matches the 38 shipped configs. NOTE these are COMPRESSED one step
         relative to DESIGN.md's prose ("cards = 16px = rounded-lg" is WRONG here;
         rounded-lg is 8px). 2xl/3xl left at Tailwind defaults, as shipped. */
      borderRadius: {
        DEFAULT: '0.25rem',   //  4px
        lg: '0.5rem',         //  8px — slot chips, icon tiles, inner blocks
        xl: '0.75rem',        // 12px — CARDS, CTAs, inputs (the workhorse)
        // '2xl' inherits Tailwind's 1rem (16px) — sheets, Flex bubbles, chat bubbles
        full: '9999px',       // pills, avatars
      },

      spacing: {
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4rem',
        'gutter-mobile': '1rem',
        'gutter-desktop': '1.5rem',
        'margin-mobile': '1rem',
        'margin-tablet': '2rem',
        'margin-desktop': '3rem',
      },

      /* ---------- TYPOGRAPHY ----------
         House convention: family and size are SEPARATE scales sharing a key.
         Usage: class="font-headline-sm text-headline-sm"
         Noto Sans Thai is chained into EVERY stack — 15 files omitted the
         webfont link entirely; always load it. */
      fontFamily: {
        'display-lg':        ['Noto Sans', 'Noto Sans Thai', 'sans-serif'],
        'display-lg-mobile': ['Noto Sans', 'Noto Sans Thai', 'sans-serif'],
        'headline-lg':       ['Noto Sans', 'Noto Sans Thai', 'sans-serif'],
        'headline-md':       ['Noto Sans', 'Noto Sans Thai', 'sans-serif'],
        'headline-sm':       ['Noto Sans', 'Noto Sans Thai', 'sans-serif'],
        'body-lg':           ['Inter', 'Noto Sans Thai', 'sans-serif'],
        'body-md':           ['Inter', 'Noto Sans Thai', 'sans-serif'],
        'body-sm':           ['Inter', 'Noto Sans Thai', 'sans-serif'],
        'label-lg':          ['Inter', 'Noto Sans Thai', 'sans-serif'],
        'label-md':          ['Inter', 'Noto Sans Thai', 'sans-serif'],
        'label-sm':          ['Inter', 'Noto Sans Thai', 'sans-serif'],
        sans:                ['Noto Sans Thai', 'Noto Sans', 'sans-serif'],
        num:                 ['Inter', 'Noto Sans Thai', 'sans-serif'],
      },
      fontSize: {
        'display-lg':        ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg':       ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md':       ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm':       ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg':           ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md':           ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm':           ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg':          ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md':          ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm':          ['11px', { lineHeight: '14px', letterSpacing: '0.03em', fontWeight: '500' }],
      },

      /* ---------- ELEVATION ----------
         DESIGN.md's three specified levels appear ZERO times in code.
         These are the values the product actually ships. */
      boxShadow: {
        'app-header': '0 1px 8px rgba(0,0,0,0.04)',            // 28 uses
        'app-nav':    '0 -2px 12px rgba(29,45,68,0.06)',       // 25 uses
        'card':       '0 2px 12px rgba(29,45,68,0.04)',
        'card-raised':'0 4px 20px -4px rgba(29,45,68,0.07)',
        'sheet':      '0 12px 36px rgba(29,45,68,0.18)',
        'sticky-bar': '0 -4px 20px rgba(29,45,68,0.08)',
        'flex-bubble':'0 8px 24px -4px rgba(29,45,68,0.12), 0 2px 6px -1px rgba(29,45,68,0.06)',
      },

      minHeight:  { touch: '48px' },   // DESIGN.md: 48px min tap target
      minWidth:   { touch: '44px' },
      maxWidth:   { liff: '430px' },   // clamp the LIFF column; most files forgot this
    },
  },
  plugins: [
    // Restores the utilities the mockups relied on but never defined,
    // and neutralises the v4-only names that ship as silent no-ops.
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        // DESIGN.md mandates tabular figures for schedules/times/THB.
        // Shipped in 1 of 48 files. Apply this to every price and time.
        '.font-num': { 'font-variant-numeric': 'tabular-nums' },
        '.pt-safe': { 'padding-top': 'env(safe-area-inset-top, 0px)' },
        '.pb-safe': { 'padding-bottom': 'env(safe-area-inset-bottom, 0px)' },
        // Non-colour-only slot encoding (component sheet §2; dropped in production)
        '.pattern-booked': {
          backgroundColor: '#f2ece9',
          backgroundImage:
            'repeating-linear-gradient(45deg,#e2d3cd 0,#e2d3cd 2px,transparent 2px,transparent 8px)',
        },
        '.pattern-maintenance': {
          backgroundColor: '#f4f3ee',
          backgroundImage: 'radial-gradient(#b8b3a8 1.2px, transparent 1.2px)',
          backgroundSize: '8px 8px',
        },
      });
      addComponents({
        // DESIGN.md: "Focus ring: 2px Honey Oat with 2px offset."
        // Implemented in ZERO of 48 files. Make it the global default.
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

### CSS custom properties (framework-agnostic mirror)

```css
:root {
  color-scheme: light;

  /* primary / navy */
  --wc-primary: #07182e;
  --wc-on-primary: #ffffff;
  --wc-primary-container: #1d2d44;   /* the brand navy */
  --wc-on-primary-container: #8595b0;
  --wc-primary-fixed: #d5e3ff;
  --wc-primary-fixed-dim: #b7c7e5;
  --wc-on-primary-fixed: #0b1c32;
  --wc-on-primary-fixed-variant: #384760;

  /* secondary / honey-oat */
  --wc-secondary: #835418;
  --wc-on-secondary: #ffffff;
  --wc-secondary-container: #fdbd77;
  --wc-on-secondary-container: #784a0d;
  --wc-secondary-fixed: #ffdcbb;
  --wc-secondary-fixed-dim: #faba75;
  --wc-on-secondary-fixed: #2b1700;
  --wc-on-secondary-fixed-variant: #673d00;

  /* tertiary / deep olive — NOT a success colour, it is near-black */
  --wc-tertiary: #131a00;
  --wc-on-tertiary: #ffffff;
  --wc-tertiary-container: #263003;
  --wc-on-tertiary-container: #8c9960;   /* 3.07:1 on white — large text only */
  --wc-tertiary-fixed: #dbe9a9;
  --wc-tertiary-fixed-dim: #bfcd8f;
  --wc-on-tertiary-fixed: #171e00;
  --wc-on-tertiary-fixed-variant: #404b1b;

  /* success — formalises the 148 hardcoded #606C38 uses */
  --wc-success: #606c38;
  --wc-on-success: #ffffff;
  --wc-success-container: #dbe9a9;
  --wc-on-success-container: #2f3a12;

  /* status */
  --wc-warning: #835418;
  --wc-warning-container: #fdbd77;
  --wc-on-warning-container: #784a0d;
  --wc-error: #ba1a1a;
  --wc-on-error: #ffffff;
  --wc-error-container: #ffdad6;
  --wc-on-error-container: #93000a;

  /* surfaces */
  --wc-surface: #fbf9f5;
  --wc-surface-dim: #dbdad6;
  --wc-surface-bright: #fbf9f5;
  --wc-surface-container-lowest: #ffffff;
  --wc-surface-container-low: #f5f3ef;
  --wc-surface-container: #efeeea;
  --wc-surface-container-high: #eae8e4;
  --wc-surface-container-highest: #e4e2de;
  --wc-surface-variant: #e4e2de;
  --wc-surface-tint: #4f5f79;
  --wc-on-surface: #1b1c1a;
  --wc-on-surface-variant: #44474d;
  --wc-outline: #75777e;
  --wc-outline-variant: #c5c6cd;
  --wc-inverse-surface: #30312e;
  --wc-inverse-on-surface: #f2f0ed;

  /* LINE brand */
  --wc-line: #06c755;
  --wc-line-hover: #05b34c;
  --wc-line-a11y: #04803a;        /* white text passes AA on this */
  --wc-line-chat-bg: #849eb2;
  --wc-line-chat-bar: #202e38;

  /* radii — compressed scale, matches the 38 shipped configs */
  --wc-radius-xs: 0.25rem;   /*  4px */
  --wc-radius-sm: 0.5rem;    /*  8px — slot chips, icon tiles */
  --wc-radius-md: 0.75rem;   /* 12px — cards, CTAs, inputs */
  --wc-radius-lg: 1rem;      /* 16px — sheets, Flex bubbles */
  --wc-radius-full: 9999px;

  /* spacing */
  --wc-space-2xs: 0.25rem;
  --wc-space-xs: 0.5rem;
  --wc-space-sm: 0.75rem;
  --wc-space-md: 1rem;
  --wc-space-lg: 1.5rem;
  --wc-space-xl: 2rem;
  --wc-space-2xl: 3rem;
  --wc-space-3xl: 4rem;
  --wc-gutter-mobile: 1rem;

  /* elevation — the values actually shipped */
  --wc-shadow-app-header: 0 1px 8px rgba(0, 0, 0, 0.04);
  --wc-shadow-app-nav: 0 -2px 12px rgba(29, 45, 68, 0.06);
  --wc-shadow-card: 0 2px 12px rgba(29, 45, 68, 0.04);
  --wc-shadow-card-raised: 0 4px 20px -4px rgba(29, 45, 68, 0.07);
  --wc-shadow-sheet: 0 12px 36px rgba(29, 45, 68, 0.18);
  --wc-shadow-sticky-bar: 0 -4px 20px rgba(29, 45, 68, 0.08);

  /* type */
  --wc-font-heading: 'Noto Sans', 'Noto Sans Thai', sans-serif;
  --wc-font-body: 'Inter', 'Noto Sans Thai', sans-serif;
  --wc-font-thai: 'Noto Sans Thai', 'Noto Sans', sans-serif;

  /* layout */
  --wc-app-bar-h: 4rem;      /* 64px */
  --wc-bottom-nav-h: 4rem;   /* 64px */
  --wc-liff-max-w: 430px;
  --wc-touch-min: 48px;
}

html, body { margin: 0; padding: 0; }
body {
  background: var(--wc-surface);
  color: var(--wc-on-surface);
  font-family: var(--wc-font-thai);
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
}

/* DESIGN.md requires tabular figures for all schedule/time/currency data.
   Shipped in 1 of 48 files — apply globally to numeric UI. */
.font-num,
[data-numeric],
time, .price, .score { font-variant-numeric: tabular-nums; }

/* DESIGN.md specifies a 2px Honey Oat focus ring with 2px offset.
   Implemented in 0 of 48 files. This restores it product-wide. */
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--wc-secondary-container);
  outline-offset: 2px;
  border-radius: var(--wc-radius-xs);
}
```

**Required font `<link>` (must appear on every screen — 15 files omit the Thai face):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
```

**Corrected viewport meta (removes the zoom lock):**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## 7. Prioritised fix list

**P0 — blocks a correct build**

1. Tokenise `success: #606C38` and `line: #06C755`; stop hardcoding (148 + 36 occurrences).
2. Resolve the **inverted booked/maintenance colour semantics** between `_1` and `2.`.
3. Fix `py-0.2` (47×/24 files) and `shadow-xs` (56×/12 files) — half the badges have no padding, twelve files' cards are flat.
4. Add `Noto Sans Thai` to the 15 files that omit it.
5. Remove `maximum-scale=1.0, user-scalable=no` from 38 files (WCAG 1.4.4).
6. Add `focus-visible` rings globally (currently zero).
7. Fix white-on-`#06C755` (2.26:1) on the primary share CTA.

**P1 — system integrity**

8. Retire or reconcile the 4 bespoke `brand.*` forks and the 2 config-less files.
9. Delete `candy/`.
10. Localise all 136 remote `lh3.googleusercontent.com` assets; wire the 4 orphan mascot SVGs (rename `.html` → `.svg`, strip hardcoded `width`/`height`, add `role="img"` + `<title>`, add `currentColor` hooks).
11. Pick **one** bottom-nav IA and fix the `จองคอร์ด` → `จองคอร์ท` typo in 23 files.
12. Apply `tabular-nums` to every price/time/score.
13. Fix `bg-surface-lowest` (10× in one file — invisible tiles).
14. Reconcile DESIGN.md's prose §Colors, §Shapes and §Elevation with reality, or delete those sections.

**P2 — before engineering starts on LINE**

15. Translate every Flex mock into real Flex JSON and re-review; the current comps overstate what LINE can render.
16. Load the LIFF SDK and replace fake `setTimeout` shares with `shareTargetPicker`.
17. Add the missing states the catalog has no design for: loading, error, OCR failure, amount mismatch, offline, locked/earned badge, defeat mascot pose, partial-availability status.