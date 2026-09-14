"""Cut the 10 device mockup rows into 70 background-keyed WebP files.

Each source row is 3226x824 and holds 7 devices on flat #F7F7F7 panels with a
36px gutter between them. We key the panel background out so the devices can
float on the dark page, then crop every device to one shared bounding box so
they line up pixel-for-pixel across worlds.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = Path("/Users/igormanka/Desktop/projekty/nosenic/strona/Mockupy/mocup Nosenic urządzenia")
OUT = Path("/Users/igormanka/Desktop/projekty/nosenic/strona/public/devices")

PANEL_X = [70, 516, 962, 1408, 1854, 2300, 2746]
PANEL_W = 410
BG = 247
TOL = 18
FLARE = 3

ORDER_A = ["double-mint", "cola-ice", "limoncello", "red-hot", "winter-green", "blueberry-ice", "cherry-ice"]
ORDER_B = ["cherry-ice", "blueberry-ice", "red-hot", "winter-green", "cola-ice", "double-mint", "limoncello"]
ORDER_C = ["red-hot", "blueberry-ice", "cherry-ice", "winter-green", "cola-ice", "double-mint", "limoncello"]

ROWS = [
    ("pop",          "NoseNic_Mockups_Row_01-1.png", ORDER_C),
    ("typographic",  "NoseNic_Mockups_Row_02.png",   ORDER_B),
    ("minimal",      "NoseNic_Mockups_Row_03.png",   ORDER_B),
    ("street",       "NoseNic_Mockups_Row_04.png",   ORDER_B),
    ("illustration", "NoseNic_Mockups_Row_05.png",   ORDER_A),
    ("organic",      "NoseNic_Mockups_Row_06-1.png", ORDER_A),
    ("energy",       "NoseNic_Mockups_Row_07.png",   ORDER_A),
    ("domino",       "NoseNic_Mockups_Row_08.png",   ORDER_A),  # unlabelled artwork, order assumed
    ("graphic",      "NoseNic_Mockups_Row_09.png",   ORDER_A),
    ("pattern",      "NoseNic_Mockups_Row_10.png",   ORDER_A),
]


def silhouette(panels: list[Image.Image]) -> np.ndarray:
    """One shared device mask, unioned over every panel.

    The backdrop is identical in all 70 panels while the label art is not, so a
    union marks everything that is casing in at least one world. The catch is
    that the inhaler is lit from the right: its left flank fades into the
    backdrop with no edge to threshold, which chews a notch out of the mask.
    The casing is symmetric, so we keep only the well-lit right edge and mirror
    it about the centreline to rebuild the left one.
    """
    union = None
    for rgb in panels:
        a = np.asarray(rgb).astype(np.int16)
        solid = np.abs(a - BG).max(axis=2) > TOL
        union = solid if union is None else (union | solid)

    labels, count = ndimage.label(union)
    sizes = ndimage.sum(union, labels, range(1, count + 1))
    core = ndimage.binary_fill_holes(labels == (int(np.argmax(sizes)) + 1))

    rows = np.flatnonzero(core.any(axis=1))
    right = ndimage.median_filter(
        np.array([np.flatnonzero(core[y])[-1] for y in rows]), size=5
    )
    left = np.array([np.flatnonzero(core[y])[0] for y in rows])
    centre = (left.min() + right.max()) / 2

    # Away from its widest row a rounded casing only ever narrows. Where the
    # silhouette flares back out it is the contact shadow on the panel, not the
    # product, so the body ends there.
    peak = int(np.argmax(right))
    top, bottom = 0, len(rows) - 1
    for i in range(peak + 1, len(rows)):
        if right[i] - right[i - 1] > FLARE:
            bottom = i - 1
            break
        right[i] = min(right[i], right[i - 1])
    for i in range(peak - 1, -1, -1):
        if right[i] - right[i + 1] > FLARE:
            top = i + 1
            break
        right[i] = min(right[i], right[i + 1])

    mask = np.zeros_like(core)
    for y, r in zip(rows[top:bottom + 1], right[top:bottom + 1]):
        mask[y, max(0, int(round(2 * centre - r))):r + 1] = True
    return ndimage.binary_erosion(mask, iterations=1)


def main() -> None:
    panels: dict[tuple[str, str], Image.Image] = {}
    for world, filename, order in ROWS:
        row = Image.open(SRC / filename).convert("RGB")
        for x, flavour in zip(PANEL_X, order):
            panels[(world, flavour)] = row.crop((x, 0, x + PANEL_W, row.height))

    mask = silhouette(list(panels.values()))
    alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))

    ys, xs = np.nonzero(mask)
    pad = 6
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad),
           min(PANEL_W, xs.max() + 1 + pad), min(824, ys.max() + 1 + pad))
    print(f"shared crop {box} -> {box[2] - box[0]}x{box[3] - box[1]}")

    total = 0
    for (world, flavour), panel in panels.items():
        out = panel.convert("RGBA")
        out.putalpha(alpha)
        target = OUT / world
        target.mkdir(parents=True, exist_ok=True)
        path = target / f"{flavour}.webp"
        out.crop(box).save(path, "WEBP", quality=88, method=6)
        total += path.stat().st_size

    print(f"{len(panels)} files, {total / 1024:.0f} KB total, avg {total / len(panels) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
