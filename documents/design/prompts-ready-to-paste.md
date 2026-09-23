# Prompt พร้อมก๊อปแปะ

ทุก prompt ในไฟล์นี้**ประกอบเสร็จแล้ว** ก๊อปทั้งก้อนไปวางได้เลย ไม่ต้องต่อเอง
เหตุผลของแต่ละบรรทัดอยู่ใน `image-prompts.md`

**ลำดับที่ควรเจน:** A ก่อนเสมอ → แล้วใช้ A เป็นภาพอ้างอิงตอนเจน B–E
ลายเส้นจะเพี้ยนข้าม session มากกว่าที่คำใน prompt คุมได้

**ถ้าเครื่องมือไม่มีช่อง negative prompt** (เช่น ChatGPT) ให้ลบบรรทัด `NEGATIVE:` ทิ้ง
แล้วพิมพ์ต่อท้ายแทนว่า `Do not include: ...` ตามด้วยรายการเดิม

---

## A · มาสคอตยืนถือแร็กเกต

**ไฟล์ที่ต้องได้:** `capybara-idle.png` · 1024×1024 โปร่งใส
**ใช้ที่:** หน้าไม่มีการจอง · หน้า 404
**ตรวจก่อนรับ:** เจนอันนี้ก่อนเพื่อน แล้วใช้เป็นภาพอ้างอิงของที่เหลือ

```
SUBJECT: A capybara standing calmly in three-quarter view, holding a badminton racket in one paw with the head of the racket resting on the ground beside it. The racket is drawn as a simple oval frame with a light grid of strings, on a straight handle, and it is entirely inside the frame — no part of it is cropped. The capybara wears a navy scarf. Its expression is relaxed and patient: small closed-arc eyes, gentle mouth. The body is a soft rounded barrel shape, short legs. A single shuttlecock rests on the ground beside its feet.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## B · โลโก้

**ไฟล์ที่ต้องได้:** `logo-mark.png` · 1024×1024 โปร่งใส
**ใช้ที่:** favicon · ไอคอนหน้าจอ · รูปแชร์
**ตรวจก่อนรับ:** ย่อเหลือ 32px แล้วดู ถ้าลูกขนไก่กลายเป็นก้อนเบลอ ให้เจนใหม่โดยลดจำนวนขนลง

```
SUBJECT: A logo mark for a Thai badminton court booking service. A capybara head in three-quarter view, calm and friendly with small closed-arc eyes and a soft rounded muzzle, wearing a navy scarf. A single badminton shuttlecock sits beside the head at the lower right, tilted 30 degrees, its feather skirt drawn as five simple tapered shapes. Head and shuttlecock together form a balanced circular silhouette that still reads at 32 pixels. Bold simple masses, no small details.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## B2 · โลโก้ พื้นทึบ (ไอคอนหน้าจอ)

**ไฟล์ที่ต้องได้:** `icon-512.png` · 1024×1024 พื้นทึบ
**ใช้ที่:** ไอคอนตอนเพิ่มลงหน้าจอมือถือ
**ตรวจก่อนรับ:** อันนี้พื้นไม่โปร่งใส เพราะไอคอนบนหน้าจอมือถือต้องมีพื้น

```
SUBJECT: A logo mark for a Thai badminton court booking service, placed on a solid deep navy #1D2D44 rounded square with a 12% corner radius. A capybara head in three-quarter view, calm and friendly with small closed-arc eyes, wearing a scarf, with a single badminton shuttlecock beside it at the lower right. The capybara and the shuttlecock are drawn in warm cream #FBF9F5 and honey #FDBD77 — light shapes on the dark navy square. Bold simple masses that stay legible at 32 pixels.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## C · มาสคอตชูแร็กเกตดีใจ

**ไฟล์ที่ต้องได้:** `capybara-cheer.png` · 1024×1024 โปร่งใส
**ใช้ที่:** หน้าจองสำเร็จ
**ตรวจก่อนรับ:** รูปเดิมของ Stitch หัวแร็กเกตโดนตัดหายตรงนี้ — เช็กด้านบนก่อนรับงาน

```
SUBJECT: A capybara celebrating a win, front-facing, both arms raised. One paw holds a badminton racket lifted above the head — the entire racket head, including its top edge, sits well inside the frame with clear space above it. The capybara wears a navy scarf that lifts slightly as if mid-motion. Its expression is happy but still calm: closed upward-curving arc eyes, small open smile. Two or three tiny four-point sparkle shapes float near the racket head. Body is a soft rounded barrel, feet planted.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## D · มาสคอตนอนหลับ

**ไฟล์ที่ต้องได้:** `capybara-sleep.png` · 1024×1024 โปร่งใส
**ใช้ที่:** วันที่คอร์ทเต็ม
**ตรวจก่อนรับ:** รูปเดิมผ้าพันคอลอยหลุดจากคอ — เช็กว่าผ้าติดกับตัว

```
SUBJECT: A capybara asleep, curled and lying down in side view, seen from a gentle three-quarter angle. Eyes are simple closed curved lines. A badminton shuttlecock rests balanced on its back, feathers up. A navy scarf is draped over its neck and lies flat against the body — the scarf must visibly connect to the neck, not float separately. Three small z shapes rise from its head in increasing size, drawn as simple geometric letters. Relaxed, cosy, content.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## E · มาสคอตหน้าอย่างเดียว

**ไฟล์ที่ต้องได้:** `capybara-avatar.png` · 512×512 โปร่งใส
**ใช้ที่:** header มุมขวาบน · รูปโปรไฟล์
**ตรวจก่อนรับ:** ย่อเหลือ 32px วางข้างตัวอักษรไทย 11px ถ้าหน้าเละให้เจนใหม่แบบเรียบกว่านี้

```
SUBJECT: A capybara head only, front-facing, centred, cropped as a portrait bust at the shoulders. Calm closed-arc eyes, soft rounded muzzle, small rounded ears, navy scarf visible at the base. Bold simple shapes with very little internal detail, designed to stay legible at 32 pixels. No racket, no shuttlecock, no props.

STYLE: flat vector illustration, clean geometric line art. Uniform outline weight throughout — 3% of the canvas width, no thick-thin variation, rounded line caps and rounded joins. Outlines in deep navy #1D2D44. Flat fill colours only: warm sand #E8DCC8, honey #FDBD77, olive green #606C38, deep navy #1D2D44, warm cream #FBF9F5. No gradients, no shading, no texture, no drop shadows, no highlights, no ambient occlusion. Simple friendly shapes, generous rounded corners, minimal internal detail. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Flat front-facing or gentle three-quarter view, no perspective, no horizon line, no ground plane, no cast shadow. Calm, warm, modern Thai sports-club branding. Sticker-like, printable at small size.

NEGATIVE: photorealism, 3D render, gradients, drop shadows, glow, neon, outer space, text, letters, numbers, watermark, signature, busy background, scenery, multiple characters, cropped limbs, cut-off objects touching the canvas edge, sketchy lines, variable line weight, cross-hatching, anime style, cute big sparkly eyes, extra fingers, distorted anatomy.
```

---

## F · รูปสนาม 1 — ภาพรวมฮอลล์

**ไฟล์ที่ต้องได้:** `court-1.webp` · 16:9 กว้างอย่างน้อย 1720px
**ใช้ที่:** แถบรูปหน้าแรก สไลด์ 1

```
SUBJECT: Wide interior view down a row of six indoor badminton courts with green professional rubber matting and crisp white court lines, nets strung and taut. High ceiling with exposed steel trusses and rows of LED panel lights. Two or three players in casual sportswear are visible in the middle distance, small in frame and seen from behind or side-on, none identifiable. The hall feels open, clean and busy but not crowded.

PHOTO STYLE: realistic editorial photograph of a modern indoor badminton facility in Bangkok, Thailand. Clean, bright, warm daylight mixed with even overhead LED lighting. Natural colour, slightly warm white balance, no heavy colour grading, no HDR halos, no lens flare. Shot at 24mm, eye level, straight horizon. Composition leaves the upper third relatively calm so a caption can sit over it. Aspect ratio 16:9.

NEGATIVE: text, signage with readable letters, logos, brand names, watermark, fisheye distortion, tilted horizon, empty lifeless room, dark shadows, cluttered storage, people's faces in sharp focus, crowds, motion blur on faces.
```

---

## G · รูปสนาม 2 — โซนพัก

**ไฟล์ที่ต้องได้:** `court-2.webp` · 16:9 กว้างอย่างน้อย 1720px
**ใช้ที่:** แถบรูปหน้าแรก สไลด์ 2

```
SUBJECT: A clean, spacious lounge and rest area beside badminton courts. Light wooden bench seating with a few racket bags resting against it, a small shop counter with shuttlecock tubes and grip tape neatly arranged on shelves, a drinks fridge, and a water station. Courts are visible softly out of focus in the background. Warm wood tones against a cream wall.

PHOTO STYLE: realistic editorial photograph of a modern indoor badminton facility in Bangkok, Thailand. Clean, bright, warm daylight mixed with even overhead LED lighting. Natural colour, slightly warm white balance, no heavy colour grading, no HDR halos, no lens flare. Shot at 24mm, eye level, straight horizon. Composition leaves the upper third relatively calm so a caption can sit over it. Aspect ratio 16:9.

NEGATIVE: text, signage with readable letters, logos, brand names, watermark, fisheye distortion, tilted horizon, empty lifeless room, dark shadows, cluttered storage, people's faces in sharp focus, crowds, motion blur on faces.
```

---

## H · รูปสนาม 3 — คอร์ทเดี่ยว

**ไฟล์ที่ต้องได้:** `court-3.webp` · 16:9 กว้างอย่างน้อย 1720px
**ใช้ที่:** แถบรูปหน้าแรก สไลด์ 3

```
SUBJECT: A single indoor badminton court seen from the back boundary line, centred, with premium green rubber BWF-grade matting, bright white boundary lines and a taut white net. A wall-mounted air-conditioning unit and bright ceiling LED panels are visible above. The court is empty and pristine, ready to play. Calm and inviting.

PHOTO STYLE: realistic editorial photograph of a modern indoor badminton facility in Bangkok, Thailand. Clean, bright, warm daylight mixed with even overhead LED lighting. Natural colour, slightly warm white balance, no heavy colour grading, no HDR halos, no lens flare. Shot at 24mm, eye level, straight horizon. Composition leaves the upper third relatively calm so a caption can sit over it. Aspect ratio 16:9.

NEGATIVE: text, signage with readable letters, logos, brand names, watermark, fisheye distortion, tilted horizon, empty lifeless room, dark shadows, cluttered storage, people's faces in sharp focus, crowds, motion blur on faces.
```

---

## เจนเสร็จแล้วทำอะไรต่อ

1. เซฟไฟล์ดิบทั้งหมดไว้ที่ `documents/design/raw/` โดย**ตั้งชื่อตามที่ระบุไว้ข้างบน**
2. บอกผมว่าเสร็จแล้ว — ผมจะตัดขอบ ย่อขนาด แปลงเป็น WebP/SVG และต่อเข้าโค้ดให้
   พร้อมเช็กว่ามาสคอตยังอ่านออกที่ 32px และหน้าเว็บไม่พัง

ถ้าอยากทำเองก็ได้:

```bash
# มาสคอตกับโลโก้ — ตัดขอบโปร่งใสส่วนเกินออก
npx sharp-cli -i documents/design/raw/capybara-idle.png \
  -o apps/liff/public/mascot/capybara-idle.png -f png trim

# รูปสนาม — ย่อเหลือ 860px แล้วแปลงเป็น WebP
npx sharp-cli -i documents/design/raw/court-1.png \
  -o apps/liff/public/venue/court-1.webp -f webp -q 80 resize 860
```
