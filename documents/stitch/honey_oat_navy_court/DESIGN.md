---
name: Honey Oat & Navy Court
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#44474d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#4f5f79'
  primary: '#07182e'
  on-primary: '#ffffff'
  primary-container: '#1d2d44'
  on-primary-container: '#8595b0'
  inverse-primary: '#b7c7e5'
  secondary: '#835418'
  on-secondary: '#ffffff'
  secondary-container: '#fdbd77'
  on-secondary-container: '#784a0d'
  tertiary: '#131a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#263003'
  on-tertiary-container: '#8c9960'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b7c7e5'
  on-primary-fixed: '#0b1c32'
  on-primary-fixed-variant: '#384760'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#faba75'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#dbe9a9'
  tertiary-fixed-dim: '#bfcd8f'
  on-tertiary-fixed: '#171e00'
  on-tertiary-fixed-variant: '#404b1b'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Noto Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
---

## Brand & Style

This design system embodies a "sport-chill," classic, and warm club atmosphere crafted specifically for badminton court reservations in Thailand. It merges the structure, discipline, and trust of traditional racquet sports clubs with a relaxed, social, and endearing personality symbolized by an understated capybara mascot.

The visual style blends modern corporate clarity with tactile hospitality:
- **Tone & Atmosphere:** Calmly active, trustworthy, welcoming, and hospitable. It avoids aggressive, hyper-neon esports aesthetics in favor of a warm clubhouse lounge feel where players organize matches, socialize, and hydrate.
- **Audience:** Social players, local badminton leagues, after-work professionals, and weekend recreational families across Thailand who value frictionless scheduling, immediate booking transparency, and approachable hospitality.
- **Mascot Integration:** The capybara serves as an ambassador of tranquility under match pressure. Mascot illustrations appear purposefully in empty states, confirmation moments, cancellation reassurance, and peak-hour alerts—rendered in clean line work with oat and navy fills, never cluttering utilitarian transactional screens.

## Colors

The color palette grounds sports utility in warm, natural tones, guaranteeing minimum AA (4.5:1) to AAA (7:1) contrast against light surfaces.

- **Primary (`#1D2D44` - Deep Navy):** Anchors high-priority interactive elements, headers, solid body copy, and selected court states. Conveys stability, authority, and high operational trust.
- **Secondary (`#DDA15E` - Honey Oat):** Used for warm interactive highlights, court prime-time indicators, special promotional tiers, and mascot accents. Paired with dark navy text when used as a fill to maintain accessibility.
- **Tertiary (`#606C38` - Olive Meadow):** Dedicated status color representing confirmed reservations, open available courts, successful payment transfers, and active memberships.
- **Support Accents:**
  - **Dusty Rose (`#E0A899`):** Reserved for limited availability indicators, alerts, pending holds, and subtle warm notification pips.
  - **Slate Blue (`#748CAB`):** Applied to secondary borders, subtle timeline grid tracks, inactive time slots, and supporting icons.
- **Neutral Background (`#FDFBF7` - Warm Cream):** Canvas base that eliminates harsh screen glare during indoor court visits and evening mobile bookings.

## Typography

Typography pairs **Noto Sans** (with full fallback to Noto Sans Thai) for headings and **Inter** for dense tabular court data, price breakdowns, and UI labels.

- **Bilingual Harmony:** Noto Sans ensures Thai script rendering retains identical baseline metrics, counter openings, and structural weight alongside English copy.
- **Tabular Figures:** Numbers in court schedules, 24-hour time slots, and THB currency displays must default to tabular figures (`font-variant-numeric: tabular-nums`) to preserve column alignment across slot selectors.
- **Hierarchy:** High-level headers emphasize approachable weight (600–700) without becoming heavy or harsh, maintaining a refined athletic look.

## Layout & Spacing

The system uses an 8px base grid rhythm paired with a fluid column structure:
- **Breakpoints:**
  - Mobile: `< 640px` (4-column layout, 16px margins, sticky bottom confirmation drawer).
  - Tablet: `640px – 1024px` (8-column layout, 24px margins, interactive timeline split-view).
  - Desktop: `> 1024px` (12-column layout, 32px to 48px margins, max-width container capped at 1280px).
- **Time Slot & Court Matrix:** The reservation board transitions from a horizontally swipeable matrix on mobile to a multi-court synchronized horizontal timeline on desktop. Gaps between court slots maintain an explicit `0.5rem` (8px) spacer to avoid accidental multi-tap errors during fast bookings.

## Elevation & Depth

This system avoids synthetic neon glows and harsh drop shadows. Instead, it relies on soft ambient warmth and tonal layering that mimics smooth birch court flooring and matte acrylic finishes:

- **Level 0 (Flat / Canvas):** Warm Cream background (`#FDFBF7`) without shadows.
- **Level 1 (Court Surfaces & Inactive Slots):** Crisp `#FFFFFF` surface resting on Warm Cream, defined by a 1px perimeter outline of Slate at 20% opacity (`rgba(116, 140, 171, 0.20)`), no shadow.
- **Level 2 (Active Cards & Hovered Slots):** Low-contrast ambient drop shadow: `0 4px 16px -2px rgba(29, 45, 68, 0.08)`.
- **Level 3 (Modals, Sticky Booking Summaries, Mascots):** Elevated focus layer: `0 12px 32px -4px rgba(29, 45, 68, 0.14)`.

## Shapes

The interface embraces a tailored **Rounded** aesthetic with radii calibrated between 12px and 16px:

- **Standard Controls (Inputs, Buttons, Chips):** `12px` border radius (`rounded-md` equivalent in standard mapping) provides an approachable, ergonomic feel under touch interactions.
- **Cards, Court Matrix Containers, Panels:** `16px` border radius (`rounded-lg`) creates soft visual framing for court cards and transaction modals.
- **Status Pills & Court Identifiers:** Fully circular / pill (`rounded-full`) for court badges (e.g., "Court 01", "Peak", "Air-Conditioned").

## Components

### Buttons
- **Primary Action (Book Now / Confirm Payment):** Solid Deep Navy (`#1D2D44`) background with crisp Warm Cream (`#FDFBF7`) text, 12px radius, min-height 48px for finger tap targets. Focus ring: 2px Honey Oat with 2px offset.
- **Secondary Action (View History / Modify):** Honey Oat (`#DDA15E`) tint background with Deep Navy (`#1D2D44`) text and no border.
- **Tertiary / Outline:** Transparent fill, 1.5px border in Slate Blue (`#748CAB`), Deep Navy text.

### Court Slot Chips
- **Available:** White background, 1px border in `#748CAB` (30% opacity), Deep Navy text.
- **Selected:** Deep Navy (`#1D2D44`) fill, Warm Cream text, subtle Honey Oat indicator dot.
- **Peak Hour:** Honey Oat (`#DDA15E`) light tint surface with a small icon and bold time string.
- **Booked / Unavailable:** Disabled state with Warm Cream muted fill, Slate Blue strikethrough, 40% opacity.

### Badges & Status Indicators
- **Confirmed:** Olive Meadow fill (`#606C38`) with pure white text.
- **Pending Payment / Hold (10-min countdown):** Dusty Rose fill (`#E0A899`) with Deep Navy text.
- **Court Amenities Badge:** Subtle Slate background tint with pill radius.

### Input Fields & Selectors
- Background is crisp white (`#FFFFFF`) with 1.5px border in Slate Blue (`#748CAB`) at 40% opacity.
- Focused state transitions to Deep Navy (`#1D2D44`) border with a 2px outer Honey Oat glow.
- Helper text and validation icons use standard 12px body copy with Olive Meadow (success) or deep warm red (error).

### Cards (Court & Facility Cards)
- Multi-layer white card containers on `#FDFBF7` canvas, 16px rounded corners, 1px subtle Slate outline.
- Header showcases court number, surface type (Rubber / Parquet), air-conditioning pill, and hourly rate in prominent bold tabular figures.
- Integrated mascot empty state illustration: Capybara sipping iced tea with a badminton racquet when all slots for the selected date are fully occupied.