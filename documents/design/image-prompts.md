# Winner Court — image generation prompts

Everything the app renders as an image, what it is for, where it lives, and the exact
prompt to generate it. **The style block in §2 must be pasted verbatim into every
illustration prompt** — that is what keeps the line weight identical across all of them.

---

## 1. The inventory

**8 images to generate.** Five are illustrations that share one line style; three are
photographs, which cannot share it (see §5).

| # | Asset | File in the app | Size | Used in |
|---|---|---|---|---|
| 1 | Logo mark | `public/brand/logo-mark.png` | 512² transparent | Share card, print master |
| 1a | Favicon | `public/brand/favicon-32.png` · `favicon-180.png` | 32² · 180² | Browser tab · iOS home screen |
| 1b | App icon | `public/brand/icon-512.png` | 512², navy square | Home-screen icon |
| 2 | Mascot — idle | `public/mascot/capybara-idle.webp` | 400² transparent | Empty "ยังไม่มีนัดตีแบด" · 404 |
| 3 | Mascot — cheering | `public/mascot/capybara-cheer.webp` | 400² transparent | Booking success |
| 4 | Mascot — sleeping | `public/mascot/capybara-sleep.webp` | 400² transparent | Fully booked day |
| 5 | Mascot — avatar | `public/mascot/capybara-avatar.webp` | 128² transparent | App header (32px) · user picture |
| 6–8 | Venue photos | `public/venue/court-1..3.webp` | 860×484 | Photo carousel |

**Delivered on 2026-09-26.** Masters are in `documents/design/raw/`. Three things the
generator did that had to be corrected on the way in, worth knowing before the next round:

- It painted a **checkerboard** into the picture instead of writing real transparency,
  and saved JPEG. `scratchpad/dechecker.py` floods that pattern from the edges inward,
  which also correctly opens the gaps between the racket strings. Ask for **PNG with a
  real alpha channel** next time and this step disappears.
- Everything came out **1408×768 landscape**, not square. The cutter re-centres and pads
  to a square itself, so this was harmless — but a square request costs nothing.
- Each court photo carries the generator's **sparkle watermark** in the bottom-right.
  They are cropped to 92% width at 16:9 to cut it off, losing a little foreground.

### Where the logo appears — 4 places, one file

The logo now exists. The header keeps the *avatar* — it reads as "your profile" — and
the logo does the other three jobs:

| Place | File to update | Note |
|---|---|---|
| Browser tab / bookmark | `index.html` → `<link rel="icon">` | Export 32, 180, 512px from the 1024 master |
| Home-screen icon | `public/brand/icon-512.png` + a web manifest | Needs a solid background — see §3.1 variant B |
| App header, top-right | `src/components/shell/AppHeader.tsx` | Uses `capybara-avatar.webp` — the avatar, deliberately, not the logo |
| Share preview | `og-image.png`, 1200×630 | Composed, not generated: logo mark + venue photo + Thai title |

**Recommendation:** keep the *avatar* in the header (it reads as "your profile") and use
the *logo mark* for tab, home screen and share. They are different jobs.

---

## 2. The style block — paste into every illustration prompt

**Changed on 2026-09-26: the house style is shoujo manga, not flat vector.** The
assembled, copy-paste versions live in `prompts-ready-to-paste.md`; this section exists
to explain the choices behind them.

```
STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s
Japanese girls' comics. Delicate tapered ink linework — lines thin out at their
ends and thicken slightly on the shadow side, drawn with a fine nib, never
uniform and never harsh. Large expressive eyes with a thick upper lash line, a
soft gradient iris and two or three round white highlight dots. Rosy blush
across the cheeks. Gentle cel shading with soft pastel gradients and a light
dusting of screentone dots in the shadows. Floating decorative accents around
the subject: small four-point sparkles, tiny flower petals, soft bubbles.
Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44
for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft
sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush,
white for highlights. Single subject centred on a fully transparent background
with even padding on all four sides, about 8% of the canvas. Soft, clean,
printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform
outlines, heavy solid black fills, harsh contrast, grunge, horror, text,
letters, numbers, speech bubbles, watermark, signature, panel borders, manga
page layout, busy background scenery, multiple characters, cropped limbs,
objects touching or cut off by the canvas edge, extra fingers, distorted
anatomy, muddy colours, oversaturated neon.
```

**The palette is what keeps this on brand.** The linework, the shading and the sparkles
all changed; the five hex values did not. A shoujo capybara in navy, cream and honey
still belongs to the same product as the UI around it.

### Three consequences of the switch, stated plainly

1. **Detail dies at 32px.** Tapered lines, screentone and multi-dot eye highlights are
   invisible on the header avatar and the browser tab. Prompts **B**, **B2** and **E**
   are therefore deliberately reduced versions — same eye shape and mood, no screentone,
   no sparkles, bold masses. Treat them as a second style tier, not as failures.
2. **Keep the mascots as PNG, not SVG.** Gradients and screentone do not trace to clean
   vector. The app currently loads `.svg`; it will load `.png` instead, at 2× the
   rendered size (320px for empty states, 64px for the avatar).
3. **The UI stays flat.** `DESIGN.md` §2 forbids gradients in the interface, and that
   rule is unchanged — it governs buttons, cards and chips. The mascot is the one place
   the product is allowed to be lush. Flat UI plus one richly drawn character is a
   deliberate contrast, not an inconsistency; if the illustrations start leaking their
   gradients into components, that is the line being crossed.

### Two rules that matter more than the wording

1. **Generate all five illustrations in one session, same model, same seed family, and
   use A as a style reference for the rest.** Shoujo drifts *more* than flat line art
   does — eye size, lash weight and blush intensity wander between prompts.
2. **Nothing may touch the canvas edge.** The racket in the original Stitch art is
   clipped off the artboard at exactly the focal point of the victory illustration.

## 3. Illustration prompts

Each one is: **SUBJECT + the §2 style block + the §2 negative block.**

> **The subjects below are the flat-vector originals, kept for reference. The shoujo
> versions that are actually in use are in `prompts-ready-to-paste.md`.**

### 3.1 Logo mark

> **SUBJECT:** A logo mark for a Thai badminton court booking service. A capybara head
> in three-quarter view, calm and friendly with small closed-arc eyes and a soft
> rounded muzzle, wearing a navy scarf. A single badminton shuttlecock sits beside the
> head at the lower right, tilted 30 degrees, its feather skirt drawn as five simple
> tapered shapes. Head and shuttlecock together form a balanced circular silhouette
> that still reads at 32 pixels. Bold simple masses, no small details.

**Variant B, for the home-screen icon:** same subject, but place it on a solid
`#1D2D44` navy rounded square with 12% corner radius, and render the capybara and
shuttlecock in warm cream `#FBF9F5` and honey `#FDBD77` — light on dark. Keep the
outline weight identical.

**Check before accepting:** shrink it to 32px. If the shuttlecock disappears into a
blob, regenerate with fewer feathers.

### 3.2 Mascot — idle with racket

> **SUBJECT:** A capybara standing calmly in three-quarter view, holding a badminton
> racket in one paw with the head of the racket resting on the ground beside it. The
> racket is drawn as a simple oval frame with a light grid of strings, on a straight
> handle, and it is **entirely inside the frame** — no part of it is cropped. The
> capybara wears a navy scarf. Its expression is relaxed and patient: small closed-arc
> eyes, gentle mouth. The body is a soft rounded barrel shape, short legs. A single
> shuttlecock rests on the ground beside its feet.

**Used for:** "ยังไม่มีนัดตีแบดเลยครับ" and the 404 screen. Read: *waiting, ready*.

### 3.3 Mascot — cheering

> **SUBJECT:** A capybara celebrating a win, front-facing, both arms raised. One paw
> holds a badminton racket lifted above the head — **the entire racket head, including
> its top edge, sits well inside the frame with clear space above it.** The capybara
> wears a navy scarf that lifts slightly as if mid-motion. Its expression is happy but
> still calm: closed upward-curving arc eyes, small open smile. Two or three tiny
> four-point sparkle shapes float near the racket head. Body is a soft rounded barrel,
> feet planted.

**Used for:** the booking success screen — the one moment the product celebrates.
**This is the illustration the original art got wrong**, so check the top of the racket
first.

### 3.4 Mascot — sleeping

> **SUBJECT:** A capybara asleep, curled and lying down in side view, seen from a gentle
> three-quarter angle. Eyes are simple closed curved lines. A badminton shuttlecock
> rests balanced on its back, feathers up. A navy scarf is draped over its neck and
> lies flat against the body — **the scarf must visibly connect to the neck, not float
> separately.** Three small "z" shapes rise from its head in increasing size, drawn as
> simple geometric letters. Relaxed, cosy, content.

**Used for:** a fully booked day. Read: *the courts are resting, come back tomorrow* —
not *error*.

### 3.5 Mascot — avatar

> **SUBJECT:** A capybara head only, front-facing, centred, cropped as a portrait bust
> at the shoulders. Calm closed-arc eyes, soft rounded muzzle, small rounded ears, navy
> scarf visible at the base. Bold simple shapes with very little internal detail,
> designed to stay legible at 32 pixels. No racket, no shuttlecock, no props.

**Check before accepting:** shrink to 32px and put it next to real Thai text at 11px. If
the face turns to mud, simplify further.

---

## 4. Venue photo prompts

These are **photographs**, so they cannot carry the line style in §2. See §5 for the
all-illustration alternative.

Shared photographic direction, paste into all three:

```
PHOTO STYLE: realistic editorial photograph of a modern indoor badminton
facility in Bangkok, Thailand. Clean, bright, warm daylight mixed with even
overhead LED lighting. Natural colour, slightly warm white balance, no heavy
colour grading, no HDR halos, no lens flare. Shot at 24mm, eye level, straight
horizon. Composition leaves the upper third relatively calm so a caption can
sit over it. Aspect ratio 16:9.

NEGATIVE: text, signage with readable letters, logos, brand names, watermark,
fisheye distortion, tilted horizon, empty lifeless room, dark shadows, cluttered
storage, people's faces in sharp focus, crowds, motion blur on faces.
```

### 4.1 Slide 1 — the hall

> **SUBJECT:** Wide interior view down a row of six indoor badminton courts with green
> professional rubber matting and crisp white court lines, nets strung and taut. High
> ceiling with exposed steel trusses and rows of LED panel lights. Two or three players
> in casual sportswear are visible in the middle distance, small in frame and seen from
> behind or side-on, none identifiable. The hall feels open, clean and busy but not
> crowded.

### 4.2 Slide 2 — the rest area

> **SUBJECT:** A clean, spacious lounge and rest area beside badminton courts. Light
> wooden bench seating with a few racket bags resting against it, a small shop counter
> with shuttlecock tubes and grip tape neatly arranged on shelves, a drinks fridge, and
> a water station. Courts are visible softly out of focus in the background. Warm wood
> tones against a cream wall.

### 4.3 Slide 3 — one court, close

> **SUBJECT:** A single indoor badminton court seen from the back boundary line,
> centred, with premium green rubber BWF-grade matting, bright white boundary lines and
> a taut white net. A wall-mounted air-conditioning unit and bright ceiling LED panels
> are visible above. The court is empty and pristine, ready to play. Calm and inviting.

---

## 5. If you want everything in one line style

Replace the three photographs with illustrations, using the **§2 style block** plus:

> **SUBJECT (5.1):** A wide flat illustration of an indoor badminton hall, straight-on
> view. Three courts in a row in olive green with cream boundary lines and simple nets,
> a ceiling line with three simple rectangular light panels above, and two small
> simplified player silhouettes mid-rally. No faces, no detail on the figures.

> **SUBJECT (5.2):** A wide flat illustration of a badminton club rest corner: a wooden
> bench, two racket bags leaning against it, a shelf with three shuttlecock tubes, and
> a drinks cooler. Warm sand and honey fills against a cream background.

> **SUBJECT (5.3):** A wide flat illustration of a single badminton court seen head-on:
> olive green surface, cream boundary lines, a net across the middle, one shuttlecock
> mid-air above the net, and two simple ceiling light panels.

**The honest trade:** illustrations guarantee a consistent look and cost nothing to
license, but a venue owner wants to see *courts that look like courts*. **My
recommendation: photographs — and real ones of their venue as soon as you have a pilot
site.** AI photos are a placeholder, and they should be replaced before anyone signs
anything.

---

## 6. After generating

1. **Trim and pad.** Every illustration: transparent PNG, subject centred, ~8% padding.
2. **Convert the mascots to SVG if you can** (`svgtrace`, Illustrator Image Trace, or
   redraw). The app renders them at 160px and 32px; vector stays crisp and stays small.
   If you keep PNG, export at 2× (320px and 64px) and update the file extensions in
   `src/components/ui/EmptyState.tsx`, `src/components/shell/AppHeader.tsx`,
   `src/screens/BookingSuccess.tsx` and `src/data/fixtures.ts`.
3. **Photos:** resize to 860px wide, convert to WebP quality 80. Each file should land
   under ~90 KB.
   ```bash
   npx sharp-cli -i raw.png -o public/venue/court-1.webp -f webp -q 80 resize 860
   ```
4. **Alt text is already written** in `src/data/fixtures.ts` and `EmptyState.tsx`. If
   you change what a picture shows, change its alt text in the same commit.
5. **Check the mascots at their real sizes** — 160px for empty states, 32px for the
   header — not at 1024px where everything looks good.
