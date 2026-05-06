# adam-ligocki-web

Personal site and blog of **Adam Ligocki** — programmer, AI/ML and robotics
specialist.

Built with [Astro](https://astro.build) as a static site, hosted on GitHub
Pages, portable to GitLab Pages.

## Stack

- **Astro 5** — static site generator, ships zero JS by default.
- **Plain CSS with design tokens** — single tokens file controls the entire
  look. Re-skin without touching component code.
- **Markdown content collections** — every page body, project entry and
  blog post lives as a `.md` file under `src/content/`.
- **Built-in i18n** — English and Czech, easy to add more.
- **Light & dark theme** — automatic system detection plus manual toggle.
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
│   │   ├── pages/{en,cs}/        about, cv, contact bodies
│   │   ├── projects/{en,cs}/     project entries
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

### A new project

Create `src/content/projects/en/<slug>.md`:

```markdown
---
title: Project name
description: One-line description shown on the projects page.
tags: [c++, ros]
repo: https://github.com/...
link: https://demo.example.com   # optional
order: 10                         # ascending; lower = higher up
featured: true                    # show on home page
---
```

### Editing the about / CV / contact pages

Just edit the corresponding `src/content/pages/<lang>/<page>.md` file.

## Theming

All visual decisions live in `src/styles/tokens.css`:

- Color palette (light + dark)
- Typography scale and font stacks
- Spacing scale
- Container widths, border radii, motion timings

To create an alternative theme, copy `tokens.css`, change the values, and
swap the import in `src/styles/global.css`. No component file references a
hard-coded color or size.

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
