# NoseNic — Breaking Flavour

One-page site for the NoseNic nasal inhaler series, built from
`NoseNic_Brief_komunikacyjny_prezentacja_ulotka_WWW.docx` (section 13 defines the page
architecture; every headline and body string on the page comes from that brief and lives in
`src/data/nosenic.ts`).

React 19 + TypeScript + Vite + Tailwind 4 + GSAP/ScrollTrigger.

```bash
npm run dev      # dev server on :5173
npm run build    # typecheck + production build
npm run assets   # regenerate public/ images from Mockupy/
npm run format
```

## Sections

| # | Component | Brief |
|---|-----------|-------|
| — | `Hero` | §02 — all seven variants together, each re-dressing itself in its own visual world |
| 02 | `Manifesto` | §13 SECTION 2 — a new sensory nicotine format |
| 03 | `FlavourJourney` | §13 SECTION 3 — choose your flavour |
| 04 | `Personalities` | §13 SECTION 4 — full descriptions of all seven |
| 05 | `Format` | §05 + §13 SECTION 7 — small format, and how to use |
| 06 | `Moments` | §13 SECTION 5 — find your moment, over the SPORT film |
| 07 | `Worlds` | §13 SECTION 6 — ten visual worlds, plus the retail pouches |
| 08 | `Statement` + `Footer` | §11 — brand statement and the nicotine/18+ notice |

## Assets

`public/` is generated — do not hand-edit it.

- **`scripts/build_devices.py`** cuts the ten `Mockupy/mocup Nosenic urządzenia/` rows into
  70 background-keyed WebP files at `public/devices/<world>/<flavour>.webp` (~25 KB each).
  The panel backdrop is flat, but the inhaler is lit from the right and its left flank fades
  into that backdrop with no edge to threshold, so the script keys on the well-lit right edge
  and mirrors it about the casing's centreline. Rows where the silhouette flares back out are
  the contact shadow, not the product, and are trimmed.
- **`scripts/build_packs.py`** exports the transparent 3D pouch renders in `Mockup 3D/` to
  `public/packs/<world>/<flavour>.webp` for the hero, and one larger pack per world to
  `public/shelf/<world>.webp` for the shelf strip. The renders are only numbered, so each
  folder's flavour order was read off the packs and is recorded in `PACKS`. Korpo (`minimal`)
  has a Winter Green render only.
- The hero film is cut from `ujecia_raw/` shots s01, s05, s08 and s07 (see `MONTAZ.md` for
  which takes are clean) into `public/video/` at two widths plus a poster frame.

### World naming

The ten device rows are unlabelled in the source files, so the world slugs (`pop`,
`typographic`, `minimal`, `street`, `illustration`, `organic`, `energy`, `domino`, `graphic`,
`pattern`) are our reading of the ten directions listed in brief §08. Rename them in
`ROWS` in `scripts/build_devices.py` and in `WORLDS` in `src/data/nosenic.ts` to match the
official names.

The **domino** row carries no flavour marking at all, so its flavour order is assumed to match
the other late rows. It appears in the worlds marquee but is left out of nothing else; if the
mapping matters, confirm it before launch.

## Dev affordances

Both are stripped from production builds.

- `?only=<section>` renders one section on its own (`hero`, `manifesto`, `flavours`,
  `personalities`, `format`, `moments`, `worlds`, `statement`, `footer`).
- `?still=1` renders every section in its settled state, as if `prefers-reduced-motion` were
  set — useful for screenshots.
