"""Turn the painted checkerboard behind a generated sticker into real transparency."""
import sys
import numpy as np
from PIL import Image

def background_mask(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    grey = (mx - mn) < 26                      # the checker is neutral; fur and scarf are not
    tone = (mn > 120) & (mx < 246)             # its two tones sit between; white fur is brighter
    candidate = grey & tone

    # Only background that TOUCHES THE EDGE counts. A white belly enclosed by an outline
    # is never reached, while the gaps between racket strings are — which is correct,
    # they really are see-through.
    reached = np.zeros_like(candidate)
    reached[0, :] = candidate[0, :]
    reached[-1, :] = candidate[-1, :]
    reached[:, 0] = candidate[:, 0]
    reached[:, -1] = candidate[:, -1]
    while True:
        grown = reached.copy()
        grown[1:, :] |= reached[:-1, :]
        grown[:-1, :] |= reached[1:, :]
        grown[:, 1:] |= reached[:, :-1]
        grown[:, :-1] |= reached[:, 1:]
        grown &= candidate
        if grown.sum() == reached.sum():
            return grown
        reached = grown

def cut(path, out, size, pad=0.06, square=True):
    im = Image.open(path).convert('RGB')
    rgb = np.asarray(im)
    bg = background_mask(rgb)

    # JPEG softens every edge, leaving a one-pixel checker halo. Grow the background by
    # two pixels into those in-between greys rather than leaving a dirty outline.
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    halo = ((mx - mn) < 40) & (mn > 110) & (mx < 250)
    for _ in range(2):
        grown = bg.copy()
        grown[1:, :] |= bg[:-1, :]; grown[:-1, :] |= bg[1:, :]
        grown[:, 1:] |= bg[:, :-1]; grown[:, :-1] |= bg[:, 1:]
        bg = grown & (halo | bg)

    alpha = np.where(bg, 0, 255).astype(np.uint8)
    out_im = Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')

    bbox = out_im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    out_im = out_im.crop(bbox)

    w, h = out_im.size
    if square:
        side = int(max(w, h) * (1 + pad * 2))
        canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        canvas.paste(out_im, ((side - w) // 2, (side - h) // 2), out_im)
        out_im = canvas
    out_im = out_im.resize((size, size) if square else (size, int(size * h / w)), Image.LANCZOS)
    out_im.save(out, optimize=True)
    print(f'{out}  {out_im.size[0]}×{out_im.size[1]}  bg removed {bg.mean()*100:.0f}%')

if __name__ == '__main__':
    cut(sys.argv[1], sys.argv[2], int(sys.argv[3]))
