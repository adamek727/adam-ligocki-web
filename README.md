# adam-ligocki-web

Personal site and blog of **Adam Ligocki** — freelance software engineer,
robotics, computer vision and machine learning.

The site is **one page plus a blog**. Everything a visitor needs — biography,
skills, clients, contact — is a section of `/{lang}/`, so the URL can be pasted
into a meeting and read top to bottom. The blog is the only other route.

Built with [Astro](https://astro.build) as a static site, hosted on GitHub
Pages, portable to GitLab Pages.

## Stack

- **Astro 5** — static site generator, ships zero JS by default.
- **Plain CSS with design tokens** — single tokens file controls the entire
  look. Re-skin without touching component code.
- **Full-bleed blocks** — the page is a stack of blocks that alternate a tinted
  visual against a panel of a few short centred lines. A block holds three
  sentences at most, which is the constraint that keeps the copy short.
- **Markdown content collections** — every page body, project entry and
  blog post lives as a `.md` file under `src/content/`.
- **Built-in i18n** — English and Czech, easy to add more.
- **Light & dark theme** — light grey-blue is the default for everyone,
  regardless of the operating system setting, because the page is meant to be
  shared and should look the same in every room. Dark is opt-in via the toggle.
- **Syntax highlighting** — via Astro's built-in Shiki integration.

## Project layout

```
adam-ligocki-web/
├── public/                       static assets (favicon, images)
├── src/
│   ├── components/               GUI building blocks (Astro components)
│   ├── layouts/                  page shells
│   ├── styles/                   tokens + base + components CSS
│   │   └── tokens.css            ← edit me to re-skin
│   ├── i18n/                     translation strings & helpers
│   ├── lib/                      content helpers (filtering, sorting)
│   ├── content/                  ALL CONTENT — markdown only
│   │   ├── pages/{en,cs}/home.md hero, biography and skills
│   │   ├── projects/{en,cs}/     one file per client, shown on the home page
│   │   └── blog/{en,cs}/         blog posts
│   ├── content.config.ts         content collection schemas
│   └── pages/                    routes (one file = one URL)
├── astro.config.mjs              site config (URL, base, i18n, markdown)
├── .github/workflows/deploy.yml  GitHub Pages CI
└── .gitlab-ci.yml                GitLab Pages CI
```

The repo cleanly separates **GUI** (`src/components`, `src/layouts`,
`src/styles`) from **content** (`src/content`). To redesign the site, work
in `styles/`. To add or edit text, work in `content/`.

The facts on this site come from the `adam-freelance` repository, which is the
source of truth for the profile, the skills and the client list. Change a claim
there first, then bring it here.

## Local development

Requires Node 20+.

```sh
npm install      # one-time
npm run dev      # http://localhost:4321
npm run build    # produce ./dist
npm run preview  # serve ./dist locally
```

## Adding content

### A new blog post

Create `src/content/blog/en/<slug>.md` (and `src/content/blog/cs/<slug>.md`
for the Czech version):

```markdown
---
title: My new post
description: One-line summary used in listings and meta tags.
pubDate: 2026-05-20
updatedDate: 2026-06-01     # optional
tags: [robotics, notes]
draft: false                 # set true to hide outside dev
---

Post body in markdown…
```

Tag pages are generated automatically from the `tags` field.

### A new client entry

Create `src/content/projects/en/<slug>.md` and the matching `cs/` file. Each one
renders as a card in the Clients section, ordered by `order`.

```markdown
---
title: Client or project name
description: One line, shown under the title.
client: Company name
role: What you did there
period: 2023 — 2026
outcome: The measurable result. Rendered with an accent bar.
stack: [Rust, C++, Computer vision]
tags: [robotics]
order: 10                         # ascending; lower = higher up
---
```

There are no case-study detail pages. A card carries everything, because the
whole point of the page is that nobody has to click.

### Editing the home page

`src/content/pages/<lang>/home.md`. The frontmatter holds the hero (`headline`,
`tagline`, `lede`, `availability`) and the `skills` groups; the body is the
biography.

### The portrait

The hero shows a dashed placeholder until a photo exists. Put the image in
`public/`, then set `portrait` in `src/config.ts` to its file name, for example
`portrait: 'portrait.jpg'`.

## Theming

All visual decisions live in `src/styles/tokens.css`:

- Color palette (light + dark)
- Typography scale and font stacks
- Spacing scale
- Container widths, border radii, motion timings

Everything is one blue family: `--ink` for the darkest panels and the visual
backgrounds, `--deep` for the dark text panels, `--mid` for the numbers band,
`--pale` for the light panels. The same tint lies over every visual, so
photographs taken on different days with different cameras still read as one
site. **That tint is the identity** — remove it and the design is gone.

To create an alternative theme, copy `tokens.css`, change the values, and
swap the import in `src/styles/global.css`. No component file references a
hard-coded color or size.

### Blocks and photographs

The home page is built from `blocks` in `src/content/pages/<lang>/home.md`.
Each block declares a `title`, up to three `lines`, a `panel` (`pale` or
`deep`), a `pattern`, and optionally `flip: true` to put the visual on the
right.

Until a photograph exists, a block renders a generated pattern —
`points`, `grid` or `bars` — in place of an image. **To use a real photo:** put
the file in `public/` and add `image: your-photo.jpg` to that block. The tint
and the crop are applied by `.block__visual img`, so any photo drops straight
into the family. The hero uses `portrait` from `src/config.ts` unless its own
`image` is set.

Photographs are what this layout is built for. It will look markedly better
once real pictures of machines, the lab and the field replace the patterns.

### The fleet plot

The one chart on the site. A client entry that declares a `fleet` block in its
frontmatter renders `total` cells with the first `start` filled, so a growth
claim is drawn at true scale instead of asserted. Only the ULLMANNA entry uses
it, and only one entry should.

### The CV

`public/adam-ligocki-cv.pdf` is generated by `scripts/build_cv.py` in the
`adam-freelance` repository and copied here. Regenerate it there and copy it
again; do not edit the PDF. The file name is set in `src/config.ts` as
`cvFile`.

The site serves the **slate** theme: two columns, one page, made for a person
reading it. The **linear** theme is the single-column one for application forms
and job boards — a two-column PDF extracts as scrambled text, which is what an
applicant tracking system reads.

## Deployment

### GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
Enable Pages in the repository settings (Source: GitHub Actions) once. The
workflow sets `SITE_URL` and `SITE_BASE` to match
`https://adamek727.github.io/adam-ligocki-web/`.

### GitLab Pages

`.gitlab-ci.yml` deploys to `https://<namespace>.gitlab.io/<project>/` on
push to the default branch. No source changes needed — `SITE_URL` and
`SITE_BASE` are derived from CI variables.

### Custom domain

Set `SITE_URL` to the domain and `SITE_BASE` to `/` (or omit it) when
building.

## Adding a third language

1. Add the locale code to `astro.config.mjs` under `i18n.locales`.
2. Add an entry to `languages` in `src/i18n/ui.ts` and translate the strings.
3. Mirror `src/content/{pages,blog,projects}/<existing-lang>/` into the new
   language folder.

## License

Source code: MIT. Content (text, images): all rights reserved unless
otherwise noted.
