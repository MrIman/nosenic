"""Export the 3D retail pouch renders in Mockup 3D/ for the hero.

The renders are 5000x5000 transparent PNGs with every pouch in the same spot,
so one shared crop keeps all packs identical in size and position. File names
are only numbered, so the flavour order of each folder was read off the packs
and is recorded in PACKS below.
"""
from pathlib import Path
from PIL import Image

ROOT = Path("/Users/igormanka/Desktop/projekty/nosenic/strona")
SRC = ROOT / "Mockup 3D"
OUT = ROOT / "public/packs"
HEIGHT = 600
# Solid pouch spans x 1238-3708, y 686-4510 in every render; the margin keeps
# the start of the baked soft shadow, which reads as grounding on a dark page.
CROP = (1200, 660, 3740, 4580)

# world slug -> (folder, flavour for each file in sorted order)
PACKS = {
    "street": ("Grafiti 3d", ["limoncello", "cherry-ice", "double-mint", "cola-ice", "red-hot", "winter-green", "blueberry-ice"]),
    "typographic": ("Gazeta 3d", ["cherry-ice", "blueberry-ice", "red-hot", "winter-green", "cola-ice", "limoncello", "double-mint"]),
    "illustration": ("Splash 3d", ["blueberry-ice", "cola-ice", "red-hot", "winter-green", "limoncello", "cherry-ice", "double-mint"]),
    "energy": ("Sportowe 3d", ["red-hot", "cola-ice", "winter-green", "double-mint", "cherry-ice", "limoncello", "blueberry-ice"]),
    "graphic": ("Art 3d", ["cola-ice", "winter-green", "double-mint", "red-hot", "blueberry-ice", "cherry-ice", "limoncello"]),
    # Only Winter Green has been rendered in the Korpo world so far.
    "minimal": ("Korpo 3D", ["winter-green"]),
}


def main() -> None:
    Image.MAX_IMAGE_PIXELS = None
    total = count = 0
    for world, (folder, order) in PACKS.items():
        files = sorted((SRC / folder).glob("*.png"))
        assert len(files) == len(order), (folder, len(files), len(order))
        (OUT / world).mkdir(parents=True, exist_ok=True)
        for path, flavour in zip(files, order):
            pack = Image.open(path).convert("RGBA").crop(CROP)
            width = round(pack.width * HEIGHT / pack.height)
            target = OUT / world / f"{flavour}.webp"
            pack.resize((width, HEIGHT), Image.LANCZOS).save(target, "WEBP", quality=82, method=6)
            total += target.stat().st_size
            count += 1
    print(f"{count} packs, {total / 1024:.0f} KB, avg {total / count / 1024:.0f} KB")


if __name__ == "__main__":
    main()
