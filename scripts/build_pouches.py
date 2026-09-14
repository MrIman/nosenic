"""Downscale one retail pouch per visual world into web-sized WebP."""
from pathlib import Path
from PIL import Image

ROOT = Path("/Users/igormanka/Desktop/projekty/nosenic/strona")
OUT = ROOT / "public/pouches"

# world slug -> (source folder, index into the folder's sorted file list)
PICKS = {
    "pop":          ("wasy mocup", 0),
    "typographic":  ("gazeta mocup", 0),
    "minimal":      ("corpo mocup", 0),
    "energy":       ("sport mocup", 0),
    "illustration": ("splash mocup", 0),
    "organic":      ("china mocup", 0),
    "domino":       ("domino mocup", 1),  # index 0 is the back of the pack
    "graphic":      ("art mocup", 0),
}

OUT.mkdir(parents=True, exist_ok=True)
total = 0
for slug, (folder, index) in PICKS.items():
    files = sorted((ROOT / "Mockupy" / folder).glob("*.png"))
    im = Image.open(files[index]).convert("RGB")
    im.thumbnail((900, 900), Image.LANCZOS)
    path = OUT / f"{slug}.webp"
    im.save(path, "WEBP", quality=80, method=6)
    total += path.stat().st_size
    print(f"{slug:14s} {files[index].name[:36]:38s} {im.size} {path.stat().st_size / 1024:.0f} KB")
print(f"total {total / 1024:.0f} KB")
