# Handoff — 2026-08-20

Branch: `adam/site/finalization`. Everything below is committed and pushed.

## Where this stands

The site is structurally finished and shippable. What is missing is **content
only** — real biography, CV, case studies and blog posts, plus two third-party
keys. No code work is blocking.

Verification, from a clean checkout:

```sh
npm ci
npm run check
```

Expected: `0 errors, 0 warnings, 0 hints`, then
`OK: 22 pages, no broken internal links`.

`npm run check` runs `astro check`, a production build, and the internal link
checker. It is the same command the pull-request workflow runs, so if it is
green locally, CI is green.

## Read these first, in this order

1. `docs/superpowers/specs/2026-08-14-freelancer-site-design.md` — the
   approved design. Decisions table now also records audience, availability
   and day-rate choices made on 2026-08-20.
2. `docs/superpowers/plans/2026-08-20-freelancer-site-finalization.md` — the
   14-task implementation plan, plus a **Deviations** section at the end
   recording where the shipped code differs from the plan and why.
3. `docs/superpowers/notes/content-interview.md` — every answer the site
   owner has given, and every question still open. Nothing in that file was
   invented; unanswered fields are marked OPEN.

## What was built

- Navigation reduced to six items; Services added, CV folded into About.
- Services page in both languages, with stable `#rnd` / `#delivery` /
  `#consulting` anchors that the home page links to.
- Home page rebuilt as the six blocks the spec calls for: availability line,
  positioning, two CTAs, three service cards, featured case studies, proof
  strip, recent posts, closing call to action.
- SEO: sitemap, canonical URLs, hreflang alternates with `x-default`,
  `og:image`, and JSON-LD carrying a `Person` and a `ProfessionalService`
  node.
- Per-language RSS at `/en/rss.xml` and `/cs/rss.xml`, with autodiscovery.
- Open Graph card generated from the design tokens — `npm run og` rewrites
  `public/og.png`.
- Contact form (Web3Forms, plain HTML POST, honeypot) and per-language
  thank-you pages.
- Pull-request CI gate at `.github/workflows/check.yml`.

## Two bugs fixed along the way

Both were found by the new link checker, not by inspection.

1. `switchLangInPath` was base-unaware. On a path with no language segment —
   the 404 page — it prefixed the language instead of replacing it, so the
   language switcher linked to `/en/adam-ligocki-web/404/`. It now falls back
   to that language's home. **This bug predates this work.**
2. Blog tag pages cross-linked to tags that do not exist, because the tag
   itself is translated: `/en/blog/tags/writing` has no
   `/cs/blog/tags/writing`. The tag route now passes `langAltPath="/blog"`,
   so both the hreflang alternates and the language switcher point at the
   other language's blog index.

## Next session — start here

### 1. Finish the content interview

`docs/superpowers/notes/content-interview.md` lists what is open. The two
highest-value items:

**Portfolio inventory.** A rough one-line list of candidate projects —
postdoc, CTO, PhD, freelance, open source. Then pick the strongest three to
five and capture, per project: title, client (real or anonymised), role,
period, a measurable outcome line, stack, and three paragraphs
(Problem / Approach / Result).

**CV specifics.** Postdoc institution, years and research focus; CTO company,
years and what it built; PhD year and thesis topic; whether either role is
current or overlapped; and what came before the PhD, since the stated 15
years starts somewhere.

Then Task 13 of the plan can run. It has the exact frontmatter shape for both
case studies and blog posts.

### 2. Review the drafted English copy

The positioning line, the service copy and the site description are **drafts
written during this session** from facts the owner supplied. They are not the
owner's own words and must be read before the site goes public. They live in:

- `src/i18n/ui.ts` — `page.home.positioning`, `page.home.availability`,
  `site.tagline`, `site.description`, the service card bodies, the closing CTA
- `src/content/pages/{en,cs}/services.md` — the three service blocks

The Czech is a translation of the same drafts and needs the same review.

### 3. Fill the three gated values

Each is a one-line change in `src/config.ts`. All three degrade cleanly today
— nothing is broken while they are unset, the feature simply does not render.

| Value | Effect when set |
|---|---|
| `web3formsKey` | Contact form appears. Free key from web3forms.com. |
| `goatcounterCode` | Analytics tag appears, production builds only. |
| `cvPdfAvailable` | CV download link appears. Set `true` **only after** placing `public/adam-ligocki-cv-en.pdf` and `public/adam-ligocki-cv-cs.pdf` — otherwise the link check fails. |

### 4. Open the pull request

The check workflow has never run on GitHub yet — it was verified locally
instead. Opening the PR runs it against itself for the first time.

## After merging

1. Submit `https://adamek727.github.io/adam-ligocki-web/sitemap-index.xml`
   through Google Search Console. The generated `robots.txt` sits at a project
   path and is therefore ignored by crawlers; this manual submission is the
   documented workaround for staying on a GitHub project page.
2. Submit the live contact form once and confirm the email arrives and the
   browser lands on `/en/thank-you`. That is the spec's phase-4 verification
   and cannot be faked locally.
3. Validate the JSON-LD at `https://validator.schema.org/` against the
   deployed home page.

## Things worth knowing

- Markdown here does **not** support `## Heading {#id}`. It renders literally.
  Use a raw `<h2 id="…">` when a stable anchor is needed.
- `import.meta.env.PROD` is true during `npm run build`, so `draft: true`
  content is excluded from production output. Real case studies need
  `draft: false` or they will not appear.
- At most three case studies should carry `featured: true` — the home page
  slices to three, so a fourth would silently never show.
- Adding a key to `en` in `src/i18n/ui.ts` without adding it to `cs` is a type
  error. That is deliberate.
- The link checker ignores external URLs on purpose. A gate that fails because
  someone else's server is down gets bypassed, and a bypassed gate is worse
  than no gate.
