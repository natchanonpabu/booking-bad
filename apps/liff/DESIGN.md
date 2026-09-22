# Winner Court — design and build conventions

Read this before writing any screen. It exists so that two people — or a person and an
AI — produce screens that look like the same product.

The authority order is: **this file → `tailwind.config.js` → the Stitch mockups in
`documents/stitch/` → `documents/plans/01-frontend-booking-demo.md`.** Where a mockup
disagrees with this file, this file wins; the mockups contain five nav models, two
inverted colour codes and three rate cards, and those conflicts are already resolved here.

---

## 1. What this product is

A Thai badminton court booking app, opened on a phone. The user is a person standing in
a car park deciding whether tonight is worth ฿440. Every screen is read one-handed, in
Thai, in a hurry, sometimes on bad wifi.

Tone: **calm, warm, concrete.** Not a dashboard, not a game. Say the price, say the
court, say the time. A capybara mascot appears only in empty and celebratory states.

---

## 2. Colour

Never write a hex value in `src/`. Colours come from `tailwind.config.js`, and the CI
gate fails the build if a raw hex appears in a `.ts`/`.tsx` file.

### The palette that carries meaning

| Token | Hex | Use it for |
|---|---|---|
| `primary` | `#07182e` | Headings, primary button fill. Near-black navy. |
| `primary-container` | `#1d2d44` | **The brand navy.** Hero cards, selected slots, ticket headers. |
| `secondary` | `#835418` | Peak-hour prices, peak icons. Reads dark brown, not honey. |
| `secondary-container` | `#fdbd77` | The visible honey: peak pills, countdowns, the focus ring. |
| `success` | `#606c38` | Available, confirmed, paid, open. **The one success colour.** |
| `success-container` | `#dbe9a9` | Success pill backgrounds. |
| `error` / `error-container` | `#ba1a1a` / `#ffdad6` | Maintenance, rejections, cancel. |
| `surface` | `#fbf9f5` | The page. Warm, never pure white. |
| `card` | `#ffffff` | Anything raised off the page. |
| `muted` / `muted-foreground` | `#efeeea` / `#44474d` | Inset panels; secondary text. |
| `outline-variant` | `#c5c6cd` | Hairlines and dividers. |
| `line` | `#06c755` | LINE buttons only. |

### Rules that are not negotiable

1. **`tertiary` (`#131a00`) is near-black.** It is not a success colour. Using it as one
   is why "ชำระแล้ว" badges render black in the mockups. Use `success`.
2. **White text on `line` green is 2.26:1 and fails AA.** The LINE button hard-codes
   navy text. There is no prop that changes it.
3. **`on-tertiary-container` (`#8c9960`) is 3.07:1** — 18px and larger only.
4. **Nothing is distinguishable by hue alone.** Booked cells carry a 45° hatch,
   maintenance a dot grid, selected a `check_circle` glyph and the word `เลือกแล้ว`.

### shadcn's token names

`background`, `foreground`, `card`, `muted`, `accent`, `destructive`, `border`, `input`,
`ring` and the `*-foreground` names exist as aliases onto the palette above, so shadcn
components compile. **`primary` and `secondary` keep our meaning, not shadcn's.** When
pasting a shadcn component that says `bg-secondary` for a muted button, rewrite it to
`bg-surface-container-high text-on-surface` — ours is a dark brown for peak pricing.

---

## 3. Type

Two scales that share a key. Every text element carries **both**:

```tsx
<p className="font-body-md text-body-md">…</p>
```

| Key | Size / line-height | Weight | Use |
|---|---|---|---|
| `headline-md` | 22 / 28 | 600 | Screen titles |
| `headline-sm` | 18 / 24 | 600 | Card titles, totals |
| `body-lg` | 16 / 24 | 400 | Emphasised body, large buttons |
| `body-md` | 14 / 22 | 400 | Default body |
| `body-sm` | 12 / 18 | 400 | Captions |
| `label-lg` | 14 / 22 | 600 | Buttons, row labels |
| `label-md` | 12 / 18 | 600 | Chips |
| `label-sm` | 11 / 17 | 500 | Pills, the time axis |

**Thai line-height floor: every size ≤ 16px has line-height ≥ 1.5.** Thai stacks vowels
and tone marks above the x-height (ตื้, เกี๊ยะ) and descends below it (ญ ฐ ฎ ฏ). The M3
scale these numbers came from is a Latin ratio set; at 1.27–1.33 the marks clip. This is
why `body-md` is 14/22 here and 14/20 in the original spec.

Fonts are self-hosted: **Noto Sans Thai** (chained into every stack), Inter for body and
numbers, Noto Sans for headings. Never `<link>` Google Fonts.

**Numbers use `tabular-nums`.** Prices, times and countdowns are wrapped in `<time>` or
carry `.price` / `.total` / `.countdown` / `.slot-time`, which applies it globally.

---

## 4. Shape, spacing, elevation

- **Radius:** `rounded-xl` (12px) for cards, buttons and inputs — the workhorse.
  `rounded-lg` (8px) for slot chips and inner blocks. `rounded-full` for pills.
  **`rounded-lg` is 8px here, not the 16px the old design prose claims.**
- **Spacing:** `space-xs` 8 · `space-sm` 12 · `space-md` 16 · `space-lg` 24 · `space-xl` 32.
  Page gutter is `px-gutter-mobile` (16px).
- **Elevation:** `shadow-card` for cards, `shadow-card-raised` for the one card a screen
  is about, `shadow-sheet` for bottom sheets, `shadow-app-header` / `shadow-app-nav` for
  chrome. No neon, no glow.

---

## 5. Layout

Every screen lives inside `.liff-column` — full width, clamped to **430px**, centred.

```
┌─ header (fixed, h-16, frosted)      ─┐  venue name · open-hours pill · avatar
│  main  (pt-16 pb-24, .liff-column)   │  the screen
└─ bottom nav (fixed, h-16, 2 tabs)   ─┘  จองคอร์ท · ประวัติจอง
```

- **Every `fixed` element needs its own inner `max-w-liff mx-auto`.** `fixed` positions
  against the viewport, not the column, so without it the header spans a desktop window
  while the content stays 430px.
- `pt`/`pb` use `env(safe-area-inset-*)`, not bare numbers.
- The bottom nav is hidden on `/book/success/:ref` only.
- **Never block pinch-zoom.** No `maximum-scale`, no `user-scalable=no`.
- **Inputs are 16px or larger**, or iOS zooms the page on focus and never zooms back.

---

## 6. Components

Base components come from **shadcn on the Tailwind 3 registry (`shadcn@2.x`)**, adapted
to the tokens above. `components.json` is committed, so `pnpm dlx shadcn@2.1.8 add …`
keeps working. After adding one, always: rewrite `bg-secondary`/`bg-primary` usages to
our meaning, replace sizes with 48px touch targets, and swap any `lucide-react` import.

| Need | Use | Notes |
|---|---|---|
| Button | `ui/button` | variants `primary` `tonal` `ghost` `outline` `line` `danger`; `asChild` for links |
| Badge / pill | `ui/badge` | tones `success` `peak` `error` `neutral` `info` `line` |
| Card | `ui/card` | variants `base` `raised` `inset` `accent` (6px left bar) |
| Form field | `ui/input` + `ui/label` | |
| Choice list | `ui/radio-group` | real `role="radiogroup"` |
| Loading | `ui/skeleton`, `ui/Spinner` | |
| Modal | `ui/Modal` | **pass `trigger`**, or focus will not return to the opener |
| Bottom bar | `ui/Sheet` | **non-modal**: no focus trap, no scroll lock |
| Toast | `useToast()` | `assertive: true` for rejections only |
| Tabs | `ui/SegmentedTabs` | roving focus, keeps disabled items reachable |
| Empty / sold out | `ui/EmptyState` | mascot poses `idle` `cheer` `sleep` |
| Icon | `ui/Icon` | `<Icon name="sports_tennis" />`, 69 typed names |

**Deliberately not used:** `lucide-react` (no racket glyph), `sonner` (we need two live
regions), Geist (no Thai). The CI gate fails if they reappear.

### Touch and focus

- Minimum target **48×48** (`min-h-touch`). Icon buttons are `size-12` (48px).
- Every interactive element gets the global honey focus ring. Never `outline-none`
  without a `focus-visible` replacement on the same line.
- Press feedback is `active:scale-98`. No hover-only affordances.

---

## 7. Writing Thai UI copy

- **`จองคอร์ท`, never `จองคอร์ด`** — the second means "book a musical chord" and ships in
  23 of the 48 mockups. The CI gate blocks it.
- Speak to the user as `คุณ`; end helpful sentences with `ครับ` sparingly — once per
  screen at most, usually in an empty state or a rejection.
- Prices are `฿440` in lists and grids, `440.00` only for an amount being transferred.
- Times are `19:00 - 21:00 น.`; dates are Buddhist era: `ศุกร์ 24 พ.ค. 2569`.
- Rejections say what happened and what to do:
  `เลือกได้เฉพาะชั่วโมงติดกัน — เริ่มเลือกใหม่ที่ 19:00`.
- Never invent a number. If the screen shows "5 ช่วงเวลาว่าง", it must be counted from
  the same data the grid renders.

---

## 8. Data and state

- **Screens never import `data/db`.** They call `api.*`, which is async and deliberately
  slow, so every screen is forced to have a loading state.
- **Money is integer satang.** `satang(44_000)` is ฿440. Render through `thb()` or
  `payAmount()` — never build a price string by hand.
- **Prices are data**, in `data/rates.ts`. Never hard-code ฿180 or ฿220 in a component.
- The booking rules live in `features/booking/selection.ts` as a pure function. UI calls
  `useSlotSelection`; it does not re-implement any rule.
- Dates are venue-local ISO strings (`2026-09-24`) handled by `lib/clock.ts`. Never call
  `new Date().getDay()` — it reads the runtime's zone and shifts the weekend pricing.

---

## 9. States every screen must have

The 48 mockups have none of these, and retrofitting them is how a demo falls apart in
someone's hand:

1. **Loading** — skeletons shaped like the content, not a spinner in the middle.
2. **Empty** — mascot, one sentence, one action.
3. **Error** — what failed, and a retry button.
4. **Rejected** — an assertive toast that names the reason.

---

## 10. Checklist before calling a screen done

- [ ] Renders correctly at 390px wide, and at 430px.
- [ ] Tab through it: every control reachable, focus ring visible on each.
- [ ] Thai text at the largest iOS text size does not clip or overlap.
- [ ] Loading, empty and error states exist and are reachable in the demo.
- [ ] No raw hex, no hard-coded price, no nav label outside `navConfig.ts`.
- [ ] `pnpm check` is green (gate, types, lint, tests, build).
