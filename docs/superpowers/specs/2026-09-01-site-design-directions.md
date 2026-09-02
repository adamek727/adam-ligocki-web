# Site design directions — what was tried, and what was chosen

Record of the design exploration for `adam-ligocki-web`, 2026-08-31 and
2026-09-01. The dated reasoning is in `docs/journal/`; this file is the
reference: the directions themselves, so none of them has to be reinvented.

## The brief, as it arrived

In Adam's own words, across several messages:

- *"a single page with several sections, something like presentation of myself,
  my skills, my clients, contact on me, and maybe link to a blog"*
- *"some lightweight design, not something complicated"*, with a placeholder
  for a photo
- *"this web can be linked in a meeting"* — the real specification. The page is
  pasted into a chat and read in about twenty seconds by someone with no
  context.
- *"by default light-gray theme with soft blue elements"*
- *"too much text"*

## Direction 1 — the CV, carried onto the web (rejected)

Adam said he liked the "slate" CV theme in
`adam-freelance/scripts/build_cv.py`, so the site inherited it value for value:
`#17324a` navy headings, `#6f8ba3` monospace channel labels over hairline
rules, `#f2f6f9` panels, Archivo + IBM Plex Sans + IBM Plex Mono.

**Rejected:** *"it is too much machine-like. just a lot of text."*

The lesson is worth keeping: **a liked artefact is not a liked style.** A CV is
dense on purpose, read by someone who already decided to read it. A website is
scanned by someone who has not. Uppercase monospace labels on every section
were the single biggest contributor to the "machine-like" feeling.

## Direction 2 — bento tiles (rejected, but not for its layout)

Chosen from three options against a big editorial page and a drifting
point-cloud hero. A four-column grid of tiles: identity 2×2, portrait 1×2,
three tinted stat tiles, about, languages, five client tiles, skills, contact.
Exactly one tile — ULLMANNA — inverted to deep navy, carrying the fleet plot.

Its real merit was structural rather than visual: **a tile cannot hold a
paragraph**, so the layout itself forced the copy down. About went from four
paragraphs to two, skills from eight items per group to four.

**Superseded** when Adam supplied a reference site. Nothing was wrong with it;
he wanted a different feeling.

## Direction 3 — full-bleed blocks, after vladan.cz (current)

*"try something more like https://www.vladan.cz/, but just for software
development, robotics and ai/ml."*

What that reference actually does, in order of importance:

1. **Full-bleed alternating blocks.** No container, no cards. A tinted visual on
   one side, a panel of words on the other, flipping side each block.
2. **One tint over every photograph.** Pictures taken on different days with
   different cameras read as one site because of it. This is the identity.
3. **Large uppercase serif headings**, centred, letterspaced, low contrast.
4. **Three or four short centred sentences per block.** No paragraphs.
5. **A big-number band** across the full width.

Adapted: the tint is blue rather than green, and the three service blocks are
the three areas Adam named — robotics and perception, AI and machine learning,
software development. That also turns the site from CV-shaped into
service-shaped, which is a commercial improvement independent of the visuals.

Type: Source Serif 4 for display, IBM Plex Sans for body. Both were already in
the CV builder's font list, so the family stays his.

## The unresolved constraint

**This style is built on photography and Adam has none.** Each visual currently
renders a generated pattern in the tint — `points` (a LiDAR return), `grid` (a
calibration target), `bars` (a spectrum). Swapping in a real photo is one line:
put the file in `public/` and add `image: file.jpg` to the block in
`src/content/pages/<lang>/home.md`.

Most valuable photographs, in order: Adam at a desk or beside a machine (the
hero slot), a robot or vehicle outdoors in the field, a sensor rig or a screen
showing point-cloud or detection output.

## Ideas raised and not used

- **A drifting point-cloud hero.** A slow-moving field of dots behind the
  headline, evoking a LiDAR scan. On-subject and the freshest of the options,
  but motion on a personal site risks reading as a gimmick to a conservative
  buyer. The static `points` pattern is the quiet version of the same idea.
- **A two-door site**, one page for robotics clients and one for general
  software clients. Rejected as double the writing in two languages, and it
  asks a visitor to choose before they know anything.
- **The proof strip** — three big numbers under the hero. Folded into the
  numbers band, which does the same job across the full width.
- **A publications headline number.** Deliberately never used:
  `docs/superpowers/notes/content-interview.md` records Adam saying publications
  must not be a headline metric because he is not actively publishing. The
  eighteen papers appear only inside the Brno University entry, as a credential.

## What survived every direction

- The **fleet plot**: 200 cells with the first 10 filled, captioned
  `10 machines, 2023 → 200 machines, 2026`. The strongest claim on the site,
  drawn at true scale rather than asserted. One chart, only ever one.
- **Content out of components.** Every word lives in
  `src/content/pages/<lang>/home.md` or `src/content/projects/<lang>/*.md`.
  Adam can rewrite his own copy without opening an `.astro` file.
- **Both languages, always.** Adding a key to `en` without `cs` is a type error.
