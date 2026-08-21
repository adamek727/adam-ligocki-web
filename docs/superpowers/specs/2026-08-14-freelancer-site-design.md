# Freelancer site — design

Date: 2026-08-14
Status: approved

## Goal

Turn the existing Astro scaffold from a personal blog into a site that sells
freelance robotics / AI-ML / software / hardware engineering work.

Success criteria:

- A first-time visitor can tell within one screen what is offered and how to
  start a conversation.
- Every service maps to at least one case study with a stated outcome.
- A lead can send a message without leaving the site.
- Every page is indexable, has a canonical URL, and produces a rich link
  preview when shared.

## Decisions

| Decision | Choice |
|---|---|
| Offer | Project delivery, consulting & audits, R&D / prototyping |
| Domain | Stay on `adamek727.github.io/adam-ligocki-web` for now |
| Languages | English and Czech, both full |
| Lead capture | Web3Forms contact form, LinkedIn as the primary funnel |
| Primary audience | Research groups and deep-tech teams |
| Secondary audience | Robotics, autonomous systems, computer vision, industry |
| Availability | Open for new work; hero shows an availability line |
| Day rate | Not published; priced per engagement on the scoping call |

Audience ordering added 2026-08-20 during the content interview. It sets the
vocabulary for the hero, the service copy and the ordering of case studies:
research and deep-tech language leads, applied robotics and industry follow.

Consequences of staying on a GitHub project page: crawlers only read
`robots.txt` from a domain root, so the generated one at
`/adam-ligocki-web/robots.txt` is ignored. The sitemap must be submitted
manually through Search Console. `SITE_URL` and `SITE_BASE` are already
environment driven, so moving to a custom domain later needs no source
change.

## Information architecture

Navigation: Home, Services, Work, About, Blog, Contact.

The CV becomes a section of the About page with a PDF download, rather than
a separate top-level entry, to keep the navigation to six items.

The `projects` content collection keeps its name. Only the visible label
changes to "Work", through `src/i18n/ui.ts`.

## Home page

1. Hero — availability line, one-sentence positioning, primary CTA to
   contact and secondary CTA to work.
2. Three service cards linking to the services page.
3. Up to three featured case studies.
4. Proof strip — years of experience, domains, publications.
5. Recent blog posts.
6. Closing call to action.

## Services page

New route `src/pages/[lang]/services.astro` rendering
`src/content/pages/{en,cs}/services.md`. Three blocks, each stating what the
service is, who it is for, what gets delivered, and how an engagement starts.
Copy lives in markdown, not in components.

## Case studies

The projects collection schema gains:

- `client` (optional) — may be anonymised, e.g. "Confidential automotive OEM"
- `role` — what the engagement was
- `period` — human-readable date range
- `outcome` — one line stating the result, shown on the card
- `stack` — technologies used
- `cover` (optional) — image
- `draft` — currently missing on projects while blog already has it

New route `src/pages/[lang]/projects/[...slug].astro` renders the markdown
body. Cards link to this detail page instead of jumping straight to GitHub;
repository and live links move into the detail page.

## Contact

Web3Forms form posting over plain HTML with a honeypot field and a redirect
to a new per-language thank-you page. Email, LinkedIn, GitHub and Scholar
links stay alongside as fallbacks.

## SEO and sharing

- `@astrojs/sitemap`
- `@astrojs/rss` at `/[lang]/rss.xml`
- Canonical URL, `og:url`, `og:image`, `hreflang` alternates and JSON-LD
  (`Person` and `ProfessionalService`) added to `BaseLayout.astro`
- One static 1200x630 Open Graph image in `public/`

Analytics: GoatCounter, which needs no custom domain and sets no cookies.

## CI

Add a pull-request job running `astro check`, a build, and a link check, plus
an `npm run check` script. The existing deploy workflows are unchanged.

## Delivery order

| Phase | Work | Verification |
|---|---|---|
| 1 | Project schema, detail route, card rewrite | detail page renders, drafts hidden in production build |
| 2 | Navigation, hero, services page, i18n keys | build clean, both languages render, no missing translation keys |
| 3 | Sitemap, RSS, canonical, Open Graph, hreflang, JSON-LD | sitemap and feed present in `dist`, structured data validates |
| 4 | Contact form and thank-you page | a live submission arrives by email |
| 5 | Real content | every placeholder replaced |
| 6 | CI check job | a pull request fails on a broken link or a type error |

Phase 1 runs first so that real project write-ups have somewhere to land.

## Content the site owner must supply

Headshot, biography in both languages, CV in both languages plus a PDF,
three to five case studies clear of any NDA, service copy for three services
in both languages, a real email address, LinkedIn and Scholar URLs, two real
blog posts, and an availability statement with an optional day rate.
