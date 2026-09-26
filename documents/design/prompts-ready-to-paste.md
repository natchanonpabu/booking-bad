# Prompt พร้อมก๊อปแปะ — สไตล์โชโจ

ทุก prompt ในไฟล์นี้**ประกอบเสร็จแล้ว** ก๊อปทั้งก้อนไปวางได้เลย ไม่ต้องต่อเอง

**ลำดับที่ควรเจน:** A ก่อนเสมอ → แล้วใช้ A เป็นภาพอ้างอิงตอนเจน B–E
ลายเส้นจะเพี้ยนข้าม session มากกว่าที่คำใน prompt คุมได้ และโชโจเพี้ยนง่ายกว่าลายเส้นแบนเรียบ

**ถ้าเครื่องมือไม่มีช่อง negative prompt** (เช่น ChatGPT) ให้ลบบรรทัด `NEGATIVE:` ทิ้ง
แล้วพิมพ์ต่อท้ายแทนว่า `Do not include: ...` ตามด้วยรายการเดิม

**ข้อควรระวังของสไตล์นี้:** ลายเส้นโชโจมีรายละเอียดเยอะ พอย่อเหลือ 32px จะเละ ตัวที่ต้องเล็ก (โลโก้กับรูปโปรไฟล์) เลยมี prompt แยกที่สั่งให้ลดทอนรายละเอียดลงโดยยังรักษาอารมณ์เดิม

---

## A · มาสคอตยืนถือแร็กเกต

**ไฟล์ที่ต้องได้:** `capybara-idle.png` · 1024×1024 โปร่งใส
**ใช้ที่:** หน้าไม่มีการจอง · หน้า 404
**ตรวจก่อนรับ:** เจนอันนี้ก่อนเพื่อน แล้วใช้เป็นภาพอ้างอิงของที่เหลือ · ปลายแร็กเกตต้องไม่ชนขอบภาพ

```
SUBJECT: A gentle capybara character standing calmly in three-quarter view, holding a badminton racket in one paw with the head of the racket resting on the ground beside it. The racket is an oval frame with finely drawn strings on a slim handle, and it sits entirely inside the frame — no part of it is cropped. The capybara wears a soft navy scarf that drapes over one shoulder. Large round shoujo eyes with long lashes and bright highlights, a small gentle smile, rosy blush on both cheeks. Soft rounded body, fluffy edges to the fur. A single shuttlecock rests on the ground beside its feet, and a few flower petals drift past.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
```

---

## B · โลโก้

**ไฟล์ที่ต้องได้:** `logo-mark.png` · 1024×1024 โปร่งใส
**ใช้ที่:** favicon · ไอคอนหน้าจอ · รูปแชร์
**ตรวจก่อนรับ:** ลดทอนรายละเอียดแล้ว เพราะต้องอ่านออกที่ 32px · ย่อดูจริงก่อนรับ

```
SUBJECT: A logo mark for a Thai badminton court booking service, drawn in a simplified shoujo style. A capybara head in three-quarter view with large gentle eyes — a thick upper lash line, one single white highlight dot per eye, and nothing smaller than that — soft blush, and a navy scarf at the neck. A single badminton shuttlecock sits beside the head at the lower right, tilted 30 degrees, with five clean feather shapes. Head and shuttlecock together form a balanced circular silhouette. IMPORTANT: this version is deliberately reduced — keep the shoujo mood in the eye shape and the soft curves, but use bold clear masses, minimal internal line detail, no screentone, and no floating sparkles, so it still reads at 32 pixels.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
```

---

## B2 · โลโก้ พื้นทึบ (ไอคอนหน้าจอ)

**ไฟล์ที่ต้องได้:** `icon-512.png` · 1024×1024 พื้นทึบ
**ใช้ที่:** ไอคอนตอนเพิ่มลงหน้าจอมือถือ
**ตรวจก่อนรับ:** พื้นไม่โปร่งใส เพราะไอคอนบนหน้าจอมือถือต้องมีพื้น

```
SUBJECT: The same simplified shoujo capybara logo mark, placed on a solid deep navy #1D2D44 rounded square with a 12% corner radius. The capybara head, its scarf and the shuttlecock are drawn in warm cream #FBF9F5 and honey #FDBD77 — light shapes on the dark navy square — with the eyes rendered as clean cream shapes with a single dark highlight. Keep the gentle shoujo eye shape, but use bold clear masses, no screentone and no sparkles, so it stays legible at 32 pixels.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
```

---

## C · มาสคอตชูแร็กเกตดีใจ

**ไฟล์ที่ต้องได้:** `capybara-cheer.png` · 1024×1024 โปร่งใส
**ใช้ที่:** หน้าจองสำเร็จ
**ตรวจก่อนรับ:** รูปเดิมของ Stitch หัวแร็กเกตโดนตัดหายตรงนี้ — เช็กด้านบนก่อนรับงาน

```
SUBJECT: A capybara character celebrating a win, front-facing, both paws raised in joy. One paw holds a badminton racket lifted above the head — the entire racket head, including its top edge, sits well inside the frame with clear space above it. A navy scarf lifts and flows as if caught mid-motion. Large shoujo eyes closed into happy upward curves with a few lashes, an open cheerful smile, strong rosy blush. A burst of four-point sparkles, flower petals and soft bubbles radiates gently outward behind the character. Warm, joyful, tender.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
```

---

## D · มาสคอตนอนหลับ

**ไฟล์ที่ต้องได้:** `capybara-sleep.png` · 1024×1024 โปร่งใส
**ใช้ที่:** วันที่คอร์ทเต็ม
**ตรวจก่อนรับ:** รูปเดิมผ้าพันคอลอยหลุดจากคอ — เช็กว่าผ้าติดกับตัว

```
SUBJECT: A capybara character fast asleep, curled up and lying on its side, seen from a gentle three-quarter angle. Eyes closed as two soft downward curves with long lashes resting on blushing cheeks. A badminton shuttlecock rests balanced on its back, feathers up. A navy scarf is draped over the neck and lies flat against the body — the scarf must visibly connect to the neck and not float separately. Three small z shapes rise from its head in increasing size, drawn in a soft rounded hand. A few flower petals and tiny bubbles float nearby. Cosy, peaceful, dreamy.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
```

---

## E · มาสคอตหน้าอย่างเดียว

**ไฟล์ที่ต้องได้:** `capybara-avatar.png` · 512×512 โปร่งใส
**ใช้ที่:** header มุมขวาบน · รูปโปรไฟล์
**ตรวจก่อนรับ:** ลดทอนรายละเอียดแล้ว · ย่อเหลือ 32px วางข้างตัวอักษรไทย 11px ถ้าหน้าเละให้เจนใหม่แบบเรียบกว่านี้

```
SUBJECT: A capybara head only, front-facing and centred, cropped as a portrait bust at the shoulders, drawn in a simplified shoujo style. Large gentle eyes with a thick upper lash line and one single white highlight dot each, soft blush, a small closed smile, and a navy scarf visible at the base of the neck. IMPORTANT: this version is deliberately reduced — no screentone, no sparkles, no flower petals, minimal internal line work — so the face still reads clearly at 32 pixels.

STYLE: soft shoujo manga illustration, in the tradition of 1990s-2000s Japanese girls' comics. Delicate tapered ink linework — lines thin out at their ends and thicken slightly on the shadow side, drawn with a fine nib, never uniform and never harsh. Large expressive eyes with a thick upper lash line, a soft gradient iris and two or three round white highlight dots. Rosy blush across the cheeks. Gentle cel shading with soft pastel gradients and a light dusting of screentone dots in the shadows. Floating decorative accents around the subject: small four-point sparkles, tiny flower petals, soft bubbles. Dreamy, warm, tender, gently romantic mood. Colour palette: deep navy #1D2D44 for the ink and the scarf, warm cream #FBF9F5 as the base, honey #FDBD77, soft sand #E8DCC8, olive green #606C38 used sparingly, pale rose pink for blush, white for highlights. Single subject centred on a fully transparent background with even padding on all four sides, about 8% of the canvas. Soft, clean, printable.

NEGATIVE: photorealism, 3D render, western cartoon style, chunky uniform outlines, heavy solid black fills, harsh contrast, grunge, horror, text, letters, numbers, speech bubbles, watermark, signature, panel borders, manga page layout, busy background scenery, multiple characters, cropped limbs, objects touching or cut off by the canvas edge, extra fingers, distorted anatomy, muddy colours, oversaturated neon.
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
2. บอกผมว่าเสร็จแล้ว — ผมจะตัดขอบ ย่อขนาด แปลงไฟล์ และต่อเข้าโค้ดให้
   พร้อมเช็กว่ามาสคอตยังอ่านออกที่ 32px และหน้าเว็บไม่พัง

```bash
# มาสคอตกับโลโก้ — ตัดขอบโปร่งใสส่วนเกินออก
npx sharp-cli -i documents/design/raw/capybara-idle.png \
  -o apps/liff/public/mascot/capybara-idle.png -f png trim

# รูปสนาม — ย่อเหลือ 860px แล้วแปลงเป็น WebP
npx sharp-cli -i documents/design/raw/court-1.png \
  -o apps/liff/public/venue/court-1.webp -f webp -q 80 resize 860
```

**หมายเหตุเรื่องไฟล์:** สไตล์โชโจมีไล่เฉดและ screentone ซึ่งแปลงเป็น SVG ไม่สวย
มาสคอตชุดนี้จึงควรเก็บเป็น **PNG โปร่งใส** ไม่ใช่ SVG แบบเดิม — ผมจะแก้นามสกุลไฟล์ในโค้ดให้
