# Content interview — adam-ligocki-web

Started 2026-08-20. Feeds Task 13 of
`docs/superpowers/plans/2026-08-20-freelancer-site-finalization.md`.

Everything here is supplied by the site owner. Nothing in this file may be
invented — an unanswered field stays marked OPEN until the owner answers it.

## Positioning

| Field | Value |
|---|---|
| Primary audience | Research groups and deep-tech teams |
| Secondary audience | Robotics, autonomous systems, computer vision, industry |
| Availability | Open for new work now |
| Day rate | Not published |

## Identity and accounts

| Field | Value |
|---|---|
| Email | `ligocki.a@gmail.com` |
| LinkedIn | `https://www.linkedin.com/in/adamligocki` |
| Google Scholar | `https://scholar.google.com/citations?user=jKSGGB8AAAAJ` |
| GitHub | `https://github.com/adamek727` |
| Web3Forms access key | **OPEN** — owner not signed up yet |
| GoatCounter site code | **OPEN** — owner not signed up yet |

Scholar URL stored without the `&hl=en&oi=ao` tracking parameters. LinkedIn
stored with an explicit `https://` scheme so it works as an `href`.

Consequence of the two OPEN keys: Task 12 renders the contact page without a
form (gated on `web3formsKey !== 'REPLACE_ME'`), and Task 11 emits no
analytics tag. Both degrade cleanly; fill them in and rebuild.

## Track record

| Field | Value |
|---|---|
| Years of engineering | 15 |
| Domains | ML, computer vision, autonomous driving, robotics (4) |
| Publications | Owner is not actively publishing — **not** to be used as a headline metric. Scholar profile stays linked as a credential. |
| Third proof-strip metric | PhD + 6 years postdoc research |

## Career

| Field | Value |
|---|---|
| Current | Freelancer |
| Doctorate | PhD in robotics, Brno University of Technology |
| Postdoc | 6 years |
| Other role | CTO at a technology startup |

**OPEN** for the CV section:

- Postdoc — institution, years, research focus
- CTO role — company name (or anonymised label), years, what the company built
- PhD — year awarded, thesis topic
- Whether the CTO role and the postdoc overlapped, and whether either is current
- Employment before the PhD (the 15 years starts somewhere)

## Portfolio

Owner wants the case-study portfolio built from previous projects.
Inventory **OPEN** — awaiting the owner's candidate list.

Per project the interview must capture: title, client (real or anonymised),
role, period, a measurable outcome line, stack, and three paragraphs
(Problem / Approach / Result).

## Build status (2026-08-20)

Branch `adam/site/finalization`, nothing committed yet.

Done and verified — `npm run check` reports 0 errors, 0 warnings, 0 hints,
22 pages, no broken internal links:

- navigation reworked to six items, CV folded into About
- services page in both languages, stable `#rnd` / `#delivery` / `#consulting`
  anchors
- home page rebuilt: availability line, positioning, two CTAs, three service
  cards, featured work, proof strip, recent posts, closing CTA
- sitemap, canonical URLs, hreflang alternates, `og:image`, JSON-LD
  (`Person` + `ProfessionalService`), per-language RSS
- generated Open Graph card at `public/og.png`
- contact form and thank-you pages built, form gated off pending the key
- CI check workflow, with the link gate proven to fail on both a dead path
  and a dead fragment

Blocked on content only.

## Still to gather

- Biography (About page), EN
- CV body, EN
- Service copy in the owner's own words, three blocks
- 3–5 case studies
- 2 blog posts
- Headshot, CV PDF
- Czech translations of all of the above, owner-reviewed
