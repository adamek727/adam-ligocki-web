# Freelancer Site Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish phases 2–6 of the approved freelancer-site spec so `adam-ligocki-web` ships as a lead-generating personal site with real content, a working contact form, and full SEO.

**Architecture:** Astro 5 static site, zero client JS beyond the existing inline theme bootstrap and one analytics tag. Chrome strings live in `src/i18n/ui.ts`; long-form copy lives in markdown under `src/content/`; identity data (email, social URLs, third-party keys) is centralised in a new `src/config.ts` so JSON-LD, the contact form, the footer, and analytics all read one source. Every page is generated for both `en` and `cs`.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`, TypeScript strict, plain CSS with design tokens, Web3Forms (contact), GoatCounter (analytics), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-14-freelancer-site-design.md`

## Global Constraints

- Deployment target stays `https://adamek727.github.io/adam-ligocki-web`. `SITE_URL=https://adamek727.github.io`, `SITE_BASE=/adam-ligocki-web`. Never hard-code either in a component — read `Astro.site` and `import.meta.env.BASE_URL`.
- Node 20 (`.nvmrc`). CI uses `node-version: 20`.
- Every user-visible string exists in **both** `en` and `cs`. `src/i18n/ui.ts` is typed `as const satisfies Record<Lang, Record<string, string>>`; a key added to `en` and missed in `cs` is a type error, which is the intended safety net.
- No CSS file may hard-code a colour, spacing value, font size, or radius. Reference the custom properties defined in `src/styles/tokens.css` only.
- **Match the existing comment style.** This codebase uses block comments at the top of files explaining intent, and short `//` comments for non-obvious decisions. Keep that. Do not strip existing comments and do not add narration comments to self-evident code.
- Long-form copy belongs in `src/content/**/*.md`, not in `.astro` files. Short chrome strings and one-line labels belong in `src/i18n/ui.ts`.
- `import.meta.env.PROD` is true during `npm run build`, so `draft: true` entries are excluded from production output. Real content must set `draft: false` to appear.
- The CV is a section of the About page, not a top-level route. Navigation stays at six items: Home, Services, Work, About, Blog, Contact.
- **This repository enforces an MR-only flow — commits to `main` are refused by a hook.** Create a feature branch before Task 1: `git switch -c adam/site/finalization`.
- No test runner exists in this project and none is being added. The verification cycle is `npm run check` (type check + build) plus assertions grepped against the generated `dist/`. Each task below states the exact assertion command; run it *before* implementing to watch it fail, and *after* to watch it pass.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/config.ts` | **new** — identity constants: email, social URLs, Web3Forms key, GoatCounter code | 3 |
| `src/components/Header.astro` | nav items; drop CV, add Services | 4 |
| `src/pages/[lang]/about.astro` | renders `about.md` **and** `cv.md` plus a PDF download link | 4 |
| `src/pages/[lang]/cv.astro` | **deleted** | 4 |
| `src/pages/[lang]/services.astro` | **new** — renders `services.md` | 5 |
| `src/content/pages/{en,cs}/services.md` | **new** — three service blocks | 5 |
| `src/components/ServiceCard.astro` | **new** — home-page service teaser | 6 |
| `src/pages/[lang]/index.astro` | hero, service cards, featured work, proof strip, posts, closing CTA | 6 |
| `src/layouts/BaseLayout.astro` | canonical, `og:url`, `og:image`, hreflang, JSON-LD, analytics tag | 7, 8, 9, 11 |
| `astro.config.mjs` | sitemap integration | 7 |
| `scripts/make-og.mjs` | **new** — renders `public/og.png` from an SVG via sharp | 8 |
| `src/pages/[lang]/rss.xml.ts` | **new** — per-language feed | 10 |
| `src/pages/[lang]/contact.astro` | Web3Forms form alongside the markdown body | 12 |
| `src/pages/[lang]/thank-you.astro` | **new** — post-submission landing page | 12 |
| `src/content/**` | real copy replacing every placeholder | 13 |
| `.github/workflows/check.yml` | **new** — PR gate: type check, build, link check | 14 |
| `src/styles/components.css` | styles for service cards, proof strip, form | 6, 12 |

---

### Task 1: Commit the Phase 1 case-study work

Phase 1 (project schema, detail route, `ProjectCard` rewrite, `ProjectLayout`) is already implemented in the working tree but uncommitted. Land it as a baseline so every later task has a clean diff to review against.

**Files:**
- Modify: none — commit existing changes
- Commit: `src/components/ProjectCard.astro`, `src/content.config.ts`, `src/content/projects/{cs,en}/example-project.md`, `src/i18n/ui.ts`, `src/lib/content.ts`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/projects.astro`, `src/styles/components.css`, `src/layouts/ProjectLayout.astro`, `src/pages/[lang]/projects/[...slug].astro`, `docs/`

**Interfaces:**
- Produces: `projectMeta(project): string | undefined` in `src/lib/content.ts`; `ProjectLayout` props `{title, description, client?, role?, period?, outcome?, stack?, cover?, tags?, repo?, link?}`; project frontmatter fields `client`, `role`, `period`, `outcome`, `stack`, `cover`, `draft`.

- [ ] **Step 1: Create the feature branch**

The repo hook refuses commits on `main`.

```bash
git switch -c adam/site/finalization
```

- [ ] **Step 2: Verify the build is clean before committing**

```bash
npm run build
```

Expected: exits 0, "19 page(s) built".

- [ ] **Step 3: Assert drafts are excluded from the production build**

This is the spec's phase-1 verification: the example project carries `draft: true`, so it must produce no detail page.

```bash
test ! -d dist/en/projects/example-project && echo "PASS: draft excluded" || echo "FAIL: draft leaked into dist"
```

Expected: `PASS: draft excluded`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(projects): add case-study schema, detail route and card rewrite

Projects gain client, role, period, outcome, stack, cover and draft
fields. Cards now link to a per-project detail page rather than jumping
straight to GitHub; repository and live links move onto the detail page.

Implements phase 1 of docs/superpowers/specs/2026-08-14-freelancer-site-design.md."
```

---

### Task 2: Verification harness — `npm run check`

Nothing downstream can be trusted without a type check. `astro check` catches missing i18n keys, wrong component props, and broken imports — all of which the following tasks risk introducing.

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run check` — runs `astro check` then `astro build`. Every later task uses this as its gate.

- [ ] **Step 1: Confirm the command does not exist yet**

```bash
npm run check
```

Expected: FAIL — `Missing script: "check"`

- [ ] **Step 2: Install the type-checking dependencies**

```bash
npm install --save-dev @astrojs/check typescript
```

- [ ] **Step 3: Add the script**

Full `scripts` block in `package.json` after the edit:

```json
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && astro build",
    "astro": "astro"
  },
```

- [ ] **Step 4: Run it and verify it passes**

```bash
npm run check
```

Expected: `0 errors, 0 warnings` from `astro check`, then a successful build.

If `astro check` reports pre-existing errors, fix them now — a harness that starts red is useless. Report what was fixed.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add npm run check running astro check and build"
```

---

### Task 3: Site config module

Identity data is currently scattered (hard-coded GitHub URL in `Footer.astro`, `you@example.com` in `contact.md`) and three upcoming tasks — JSON-LD, contact form, analytics — all need it. Centralise first.

**The values below are placeholders.** The real ones come from the content interview (Task 13). Do not invent them; `REPLACE_ME` is the correct value until the owner supplies the real one, and every consumer is written to degrade safely while it is in place.

**Files:**
- Create: `src/config.ts`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Produces: `siteConfig` with keys `name`, `email`, `github`, `linkedin`, `scholar`, `repo`, `web3formsKey`, `goatcounterCode`. Consumed by Tasks 9 (JSON-LD), 11 (analytics), 12 (contact form).

- [ ] **Step 1: Assert the module does not exist**

```bash
test ! -f src/config.ts && echo "PASS: absent as expected"
```

- [ ] **Step 2: Create `src/config.ts`**

```ts
/*
 * Site-level identity constants.
 *
 * These are the values that are neither chrome strings (src/i18n/ui.ts) nor
 * page copy (src/content). They appear in structured data, the contact form
 * and the footer, so they live in exactly one place.
 *
 * The Web3Forms access key and the GoatCounter code are public by design —
 * both are sent from the browser — so committing them is not a leak.
 */
export const siteConfig = {
  name: 'Adam Ligocki',
  email: 'REPLACE_ME@example.com',
  github: 'https://github.com/adamek727',
  linkedin: 'REPLACE_ME',
  scholar: 'REPLACE_ME',
  repo: 'https://github.com/adamek727/adam-ligocki-web',
  web3formsKey: 'REPLACE_ME',
  goatcounterCode: 'REPLACE_ME',
} as const;
```

- [ ] **Step 3: Point the footer at it**

In `src/components/Footer.astro` frontmatter, add:

```astro
import { siteConfig } from '../config';
```

In the body, change:

```astro
      <a href="https://github.com/adamek727/adam-ligocki-web">{t('footer.source')}</a>
```

to:

```astro
      <a href={siteConfig.repo}>{t('footer.source')}</a>
```

- [ ] **Step 4: Verify**

```bash
npm run check && grep -q 'github.com/adamek727/adam-ligocki-web' dist/en/index.html && echo "PASS: footer link intact"
```

Expected: check passes, `PASS: footer link intact`

- [ ] **Step 5: Commit**

```bash
git add src/config.ts src/components/Footer.astro
git commit -m "refactor: centralise identity constants in src/config.ts"
```

---

### Task 4: Navigation IA — Services in, CV folded into About

The spec fixes navigation at six items and makes the CV a section of About with a PDF download. `services.astro` does not exist yet, so this task adds the nav entry and Task 5 adds the route immediately after — do not reorder them, or the build ships a dead link.

**Files:**
- Modify: `src/i18n/ui.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/pages/[lang]/about.astro`
- Delete: `src/pages/[lang]/cv.astro`

**Interfaces:**
- Produces: i18n keys `nav.services`, `page.services.title`, `about.cv.heading`, `about.cv.download`. Route `/[lang]/cv` no longer exists.

- [ ] **Step 1: Add the i18n keys**

In `src/i18n/ui.ts`, in the `en` block, replace:

```ts
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Work',
    'nav.cv': 'CV',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
```

with:

```ts
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Work',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
```

and replace `'page.cv.title': 'Curriculum Vitae',` with:

```ts
    'page.services.title': 'Services',
    'about.cv.heading': 'Curriculum Vitae',
    'about.cv.download': 'Download CV (PDF)',
```

In the `cs` block, replace:

```ts
    'nav.home': 'Úvod',
    'nav.about': 'O mně',
    'nav.projects': 'Reference',
    'nav.cv': 'Životopis',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
```

with:

```ts
    'nav.home': 'Úvod',
    'nav.services': 'Služby',
    'nav.projects': 'Reference',
    'nav.about': 'O mně',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
```

and replace `'page.cv.title': 'Životopis',` with:

```ts
    'page.services.title': 'Služby',
    'about.cv.heading': 'Životopis',
    'about.cv.download': 'Stáhnout životopis (PDF)',
```

- [ ] **Step 2: Run the check to see it fail**

```bash
npm run check
```

Expected: FAIL — `cv.astro` still references `t('page.cv.title')`, which no longer exists on the `UIKey` union.

- [ ] **Step 3: Rewrite the header nav**

In `src/components/Header.astro`, replace the `items` array:

```astro
const items = [
  { href: link(''),          label: t('nav.home') },
  { href: link('/services'), label: t('nav.services') },
  { href: link('/projects'), label: t('nav.projects') },
  { href: link('/about'),    label: t('nav.about') },
  { href: link('/blog'),     label: t('nav.blog') },
  { href: link('/contact'),  label: t('nav.contact') },
];
```

- [ ] **Step 4: Fold the CV into the About page**

Replace the whole of `src/pages/[lang]/about.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);

// Pull the localized page bodies from markdown so content stays out of
// component code. The CV is a section of this page rather than a route of
// its own, which keeps the primary navigation to six items.
const aboutPages = import.meta.glob<{ Content: any }>(
  '../../content/pages/**/about.md',
  { eager: true },
);
const cvPages = import.meta.glob<{ Content: any }>(
  '../../content/pages/**/cv.md',
  { eager: true },
);

const About = aboutPages[`../../content/pages/${lang}/about.md`]?.Content;
const Cv = cvPages[`../../content/pages/${lang}/cv.md`]?.Content;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const cvPdf = `${base}/adam-ligocki-cv-${lang}.pdf`;
---

<PageLayout title={t('page.about.title')} container="narrow">
  {About ? <About /> : <p class="muted">Content coming soon.</p>}

  {Cv && (
    <section class="stack" style="margin-top: var(--sp-8);">
      <div class="section-heading">
        <h2 id="cv">{t('about.cv.heading')}</h2>
        <a href={cvPdf} class="muted" download>{t('about.cv.download')} ↓</a>
      </div>
      <Cv />
    </section>
  )}
</PageLayout>
```

- [ ] **Step 5: Delete the CV route**

```bash
git rm 'src/pages/[lang]/cv.astro'
```

- [ ] **Step 6: Verify**

```bash
npm run check \
  && test ! -d dist/en/cv && echo "PASS: /en/cv gone" \
  && grep -q 'Curriculum Vitae' dist/en/about/index.html && echo "PASS: CV on About" \
  && grep -q '/adam-ligocki-web/en/services' dist/en/index.html && echo "PASS: services nav link present"
```

Expected: all three PASS lines. The `/en/services` link points at a route that does not exist yet — Task 5 creates it. Do not run the link checker until it does.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(nav): add Services, fold CV into About

Navigation stays at six items per the IA decision in the design spec.
The CV keeps its own markdown file but renders as a section of the About
page with a PDF download link."
```

---

### Task 5: Services page

**Files:**
- Create: `src/pages/[lang]/services.astro`
- Create: `src/content/pages/en/services.md`
- Create: `src/content/pages/cs/services.md`

**Interfaces:**
- Consumes: `t('page.services.title')` from Task 4.
- Produces: routes `/en/services` and `/cs/services`; heading anchors `#delivery`, `#consulting`, `#rnd` used by the home-page service cards in Task 6.

- [ ] **Step 1: Assert the route 404s today**

```bash
test ! -d dist/en/services && echo "PASS: route absent"
```

- [ ] **Step 2: Create the route**

`src/pages/[lang]/services.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);

const pages = import.meta.glob<{ Content: any }>(
  '../../content/pages/**/services.md',
  { eager: true },
);
const Content = pages[`../../content/pages/${lang}/services.md`]?.Content;
---

<PageLayout title={t('page.services.title')} container="base">
  {Content ? <Content /> : <p class="muted">Content coming soon.</p>}
</PageLayout>
```

- [ ] **Step 3: Write the English service copy**

`src/content/pages/en/services.md`. The anchor ids must match exactly — Task 6 links to them. The wording below is a scaffold; the interview in Task 13 replaces it with the owner's own words. The four-beat structure (what it is / who it is for / what you get / how it starts) is required by the spec and stays.

```markdown
Three ways to work together. Every engagement starts with a short call to
establish whether the problem is one I can actually move.

## Project delivery {#delivery}

**What it is.** End-to-end delivery of a robotics, perception or ML component —
from requirements through implementation to a system running on your hardware.

**Who it is for.** Teams with a defined problem and no spare engineer to own it.

**What you get.** Working software in your repository, documented interfaces,
a handover session, and the tests that prove it does what was agreed.

**How it starts.** A scoping call, then a fixed-scope proposal with a delivery
date before any code is written.

## Consulting and audits {#consulting}

**What it is.** A focused review of an existing system — architecture, model
pipeline, sensor stack or codebase — with written findings ranked by impact.

**Who it is for.** Teams that have something running and suspect it could be
faster, more accurate, or less fragile than it is.

**What you get.** A written report with prioritised findings, each with the
evidence behind it and a concrete remediation, plus a walkthrough call.

**How it starts.** Read-only access to the code or data, and a week.

## R&D and prototyping {#rnd}

**What it is.** Turning a research idea into something you can measure — a
prototype that answers whether the approach is worth productising.

**Who it is for.** Teams evaluating a technology before committing a roadmap
to it.

**What you get.** A working prototype, a benchmark harness, and an honest
recommendation — including "this does not work yet" when that is the answer.

**How it starts.** A written problem statement and a definition of what
success would look like.
```

- [ ] **Step 4: Write the Czech service copy**

`src/content/pages/cs/services.md` — same three anchors, same structure:

```markdown
Tři způsoby spolupráce. Každá zakázka začíná krátkým hovorem, na kterém
zjistíme, jestli je problém takový, se kterým dokážu pohnout.

## Dodávka projektu {#delivery}

**Co to je.** Dodání robotické, percepční nebo ML komponenty od zadání přes
implementaci až po systém běžící na vašem hardwaru.

**Pro koho.** Pro týmy, které mají zadaný problém a nemají volného inženýra,
který by ho převzal.

**Co dostanete.** Funkční software ve vašem repozitáři, zdokumentovaná
rozhraní, předávací schůzku a testy, které doloží dohodnuté chování.

**Jak to začíná.** Úvodní hovor a poté nabídka s pevným rozsahem a termínem
dodání ještě předtím, než vznikne první řádek kódu.

## Konzultace a audity {#consulting}

**Co to je.** Cílený přezkum existujícího systému — architektury, modelové
pipeline, senzorického stacku nebo kódu — s písemnými zjištěními seřazenými
podle dopadu.

**Pro koho.** Pro týmy, kterým už něco běží a tuší, že by to šlo rychleji,
přesněji nebo spolehlivěji.

**Co dostanete.** Písemnou zprávu s prioritizovanými zjištěními, u každého
podklad a konkrétní návrh nápravy, plus hovor nad výsledky.

**Jak to začíná.** Přístup pro čtení ke kódu nebo datům a jeden týden.

## Výzkum a prototypy {#rnd}

**Co to je.** Převedení výzkumného nápadu do měřitelné podoby — prototypu,
který odpoví, jestli má smysl přístup produktizovat.

**Pro koho.** Pro týmy, které technologii vyhodnocují dřív, než na ni naváží
roadmapu.

**Co dostanete.** Funkční prototyp, benchmark a upřímné doporučení — včetně
„zatím to nefunguje", pokud je to odpověď.

**Jak to začíná.** Písemné zadání a definice toho, jak vypadá úspěch.
```

- [ ] **Step 5: Verify**

```bash
npm run check \
  && grep -q 'id="delivery"' dist/en/services/index.html && echo "PASS: en anchors" \
  && grep -q 'id="consulting"' dist/cs/services/index.html && echo "PASS: cs anchors" \
  && grep -q 'id="rnd"' dist/en/services/index.html && echo "PASS: rnd anchor"
```

Expected: three PASS lines.

If `{#delivery}` does not produce an `id` attribute, Astro's markdown pipeline lacks custom-id support here. Install and wire `rehype-slug` instead: `npm install rehype-slug`, add `rehypePlugins: [rehypeSlug]` under `markdown` in `astro.config.mjs`, and change the headings to plain `## Project delivery`, relying on auto-generated slugs. **That route produces different anchors per language — update Task 6's `href` values to match and say so in the commit message.**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(services): add services page in both languages"
```

---

### Task 6: Home page rewrite

The spec's home page is six blocks: hero with availability line and two CTAs, three service cards, up to three featured case studies, a proof strip, recent posts, and a closing call to action. The current home page has a generic hero and two sections.

**Files:**
- Create: `src/components/ServiceCard.astro`
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/i18n/ui.ts`
- Modify: `src/styles/components.css`

**Interfaces:**
- Consumes: `ProjectCard` props from Task 1, service anchors from Task 5.
- Produces: `ServiceCard` props `{title: string, body: string, href: string}`; the i18n keys listed in Step 1.

- [ ] **Step 1: Add the home-page i18n keys**

The hero and proof-strip strings are one-liners that need translating and have no natural markdown home, so they live in `src/i18n/ui.ts` alongside the other chrome strings. Long-form service copy stays in markdown.

In the `en` block, replace `'page.home.eyebrow': 'Hello',` with:

```ts
    'page.home.availability': 'Available for new engagements',
    'page.home.positioning':
      'I build robotics, perception and machine-learning systems that have to work outside the lab.',
    'page.home.cta.primary': 'Start a conversation',
    'page.home.cta.secondary': 'See selected work',
    'page.home.services': 'How I can help',
    'page.home.service.delivery': 'Project delivery',
    'page.home.service.delivery.body':
      'End-to-end delivery of a component, from requirements to running on your hardware.',
    'page.home.service.consulting': 'Consulting & audits',
    'page.home.service.consulting.body':
      'A written review of an existing system, with findings ranked by impact.',
    'page.home.service.rnd': 'R&D & prototyping',
    'page.home.service.rnd.body':
      'A measurable prototype that answers whether an approach is worth productising.',
    'page.home.proof': 'Track record',
    'page.home.proof.years.value': 'REPLACE_ME',
    'page.home.proof.years.label': 'years of engineering',
    'page.home.proof.domains.value': 'REPLACE_ME',
    'page.home.proof.domains.label': 'domains delivered in',
    'page.home.proof.pubs.value': 'REPLACE_ME',
    'page.home.proof.pubs.label': 'peer-reviewed publications',
    'page.home.closing': 'Have a problem that fits?',
    'page.home.closing.body':
      'Tell me what you are building and where it is stuck. If it is not something I can help with, I will say so.',
```

In the `cs` block, replace `'page.home.eyebrow': 'Vítejte',` with:

```ts
    'page.home.availability': 'Přijímám nové zakázky',
    'page.home.positioning':
      'Stavím robotické, percepční a ML systémy, které musí fungovat i mimo laboratoř.',
    'page.home.cta.primary': 'Ozvěte se',
    'page.home.cta.secondary': 'Vybrané reference',
    'page.home.services': 'S čím pomůžu',
    'page.home.service.delivery': 'Dodávka projektu',
    'page.home.service.delivery.body':
      'Dodání komponenty od zadání až po běh na vašem hardwaru.',
    'page.home.service.consulting': 'Konzultace a audity',
    'page.home.service.consulting.body':
      'Písemný přezkum existujícího systému se zjištěními seřazenými podle dopadu.',
    'page.home.service.rnd': 'Výzkum a prototypy',
    'page.home.service.rnd.body':
      'Měřitelný prototyp, který odpoví, jestli má smysl přístup produktizovat.',
    'page.home.proof': 'Zkušenosti',
    'page.home.proof.years.value': 'REPLACE_ME',
    'page.home.proof.years.label': 'let v oboru',
    'page.home.proof.domains.value': 'REPLACE_ME',
    'page.home.proof.domains.label': 'oborů s dodanými projekty',
    'page.home.proof.pubs.value': 'REPLACE_ME',
    'page.home.proof.pubs.label': 'recenzovaných publikací',
    'page.home.closing': 'Máte problém, který sedí?',
    'page.home.closing.body':
      'Napište, co stavíte a kde to vázne. Pokud to není nic, s čím pomůžu, řeknu to rovnou.',
```

The `REPLACE_ME` proof values are filled from the interview in Task 13.

- [ ] **Step 2: Run the check to see it fail**

```bash
npm run check
```

Expected: FAIL — `index.astro` still calls `t('page.home.eyebrow')`, now removed from the key union.

- [ ] **Step 3: Create `ServiceCard.astro`**

Modelled directly on the existing `ProjectCard.astro` so the two read the same.

```astro
---
interface Props {
  title: string;
  body: string;
  href: string;
}

const { title, body, href } = Astro.props;
---

<article class="card">
  <h3 class="card__title"><a href={href}>{title}</a></h3>
  <p class="card__body">{body}</p>
</article>
```

- [ ] **Step 4: Rewrite the home page**

Replace the whole of `src/pages/[lang]/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';
import { getBlogPosts, getProjects, entrySlug, projectMeta } from '../../lib/content';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const link = (path: string) => `${base}/${lang}${path}`;

const recentPosts = (await getBlogPosts(lang)).slice(0, 3);
const featuredProjects = (await getProjects(lang))
  .filter((p) => p.data.featured)
  .slice(0, 3);

const services = [
  {
    title: t('page.home.service.delivery'),
    body: t('page.home.service.delivery.body'),
    href: `${link('/services')}#delivery`,
  },
  {
    title: t('page.home.service.consulting'),
    body: t('page.home.service.consulting.body'),
    href: `${link('/services')}#consulting`,
  },
  {
    title: t('page.home.service.rnd'),
    body: t('page.home.service.rnd.body'),
    href: `${link('/services')}#rnd`,
  },
];

const proof = [
  { value: t('page.home.proof.years.value'), label: t('page.home.proof.years.label') },
  { value: t('page.home.proof.domains.value'), label: t('page.home.proof.domains.label') },
  { value: t('page.home.proof.pubs.value'), label: t('page.home.proof.pubs.label') },
];
---

<BaseLayout>
  <section class="container container--wide section--hero">
    <p class="availability">{t('page.home.availability')}</p>
    <h1 class="hero__title">{t('site.title')}</h1>
    <p class="hero__lede">{t('page.home.positioning')}</p>

    <p class="cluster" style="margin-top: var(--sp-6); gap: var(--sp-4);">
      <a class="button" href={link('/contact')}>{t('page.home.cta.primary')}</a>
      <a href={link('/projects')}>{t('page.home.cta.secondary')} →</a>
    </p>
  </section>

  <section class="container container--wide section">
    <div class="section-heading">
      <h2>{t('page.home.services')}</h2>
      <a href={link('/services')} class="muted">{t('nav.services')} →</a>
    </div>
    <div class="grid grid--cards">
      {services.map((s) => (
        <ServiceCard title={s.title} body={s.body} href={s.href} />
      ))}
    </div>
  </section>

  {featuredProjects.length > 0 && (
    <section class="container container--wide section">
      <div class="section-heading">
        <h2>{t('page.projects.title')}</h2>
        <a href={link('/projects')} class="muted">{t('nav.projects')} →</a>
      </div>
      <div class="grid grid--cards">
        {featuredProjects.map((p) => (
          <ProjectCard
            title={p.data.title}
            description={p.data.description}
            href={`${link('/projects/')}${entrySlug(p.id)}`}
            meta={projectMeta(p)}
            outcome={p.data.outcome}
            tags={p.data.tags}
          />
        ))}
      </div>
    </section>
  )}

  <section class="container container--wide section">
    <h2 class="visually-hidden">{t('page.home.proof')}</h2>
    <ul class="proof-strip">
      {proof.map((item) => (
        <li class="proof-strip__item">
          <span class="proof-strip__value">{item.value}</span>
          <span class="proof-strip__label">{item.label}</span>
        </li>
      ))}
    </ul>
  </section>

  {recentPosts.length > 0 && (
    <section class="container container--wide section">
      <div class="section-heading">
        <h2>{t('page.blog.title')}</h2>
        <a href={link('/blog')} class="muted">{t('nav.blog')} →</a>
      </div>
      <ul class="post-list">
        {recentPosts.map((post) => (
          <li>
            <PostCard
              title={post.data.title}
              href={`${link('/blog/')}${entrySlug(post.id)}`}
              date={post.data.pubDate}
              description={post.data.description}
              tags={post.data.tags}
              lang={lang}
            />
          </li>
        ))}
      </ul>
    </section>
  )}

  <section class="container container--wide section">
    <div class="closing-cta">
      <h2>{t('page.home.closing')}</h2>
      <p>{t('page.home.closing.body')}</p>
      <p><a class="button" href={link('/contact')}>{t('page.home.cta.primary')}</a></p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Add the styles**

Append to `src/styles/components.css`, after the existing card rules:

```css
/* ---- Home page -------------------------------------------------------- */
.availability {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  margin: 0 0 var(--sp-4);
  font-size: var(--fs-sm);
  color: var(--fg-muted);
}

.availability::before {
  content: "";
  width: var(--sp-2);
  height: var(--sp-2);
  border-radius: 50%;
  background: var(--accent);
}

.button {
  display: inline-block;
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--radius-md);
  background: var(--accent);
  color: var(--accent-fg);
  font-weight: var(--fw-medium);
  text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out);
}

.button:hover {
  background: var(--accent-hover);
  color: var(--accent-fg);
}

.proof-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--sp-5);
  margin: 0;
  padding: var(--sp-6);
  list-style: none;
  border-block: var(--border-width) solid var(--border);
}

.proof-strip__item {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.proof-strip__value {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-tight);
}

.proof-strip__label {
  font-size: var(--fs-sm);
  color: var(--fg-muted);
}

.closing-cta {
  padding: var(--sp-7);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
  text-align: center;
}

.closing-cta > * + * {
  margin-top: var(--sp-4);
}
```

- [ ] **Step 6: Verify**

```bash
npm run check \
  && grep -q 'availability' dist/en/index.html && echo "PASS: hero availability" \
  && grep -q 'proof-strip' dist/cs/index.html && echo "PASS: proof strip both langs" \
  && grep -q 'services#delivery' dist/en/index.html && echo "PASS: service card anchors" \
  && grep -q 'closing-cta' dist/en/index.html && echo "PASS: closing CTA"
```

Expected: four PASS lines.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(home): rebuild home page around the offer

Hero with availability line and two CTAs, three service cards, featured
case studies, a proof strip, recent posts and a closing call to action —
the six blocks specified in the design doc."
```

---

### Task 7: Sitemap, canonical URL, `og:url` and hreflang

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `switchLangInPath(pathname, target)` and `allLangs` from `src/i18n/utils`.
- Produces: `dist/sitemap-index.xml`; `<link rel="canonical">`, `<meta property="og:url">`, and one `<link rel="alternate" hreflang>` per language plus `x-default` on every page.

- [ ] **Step 1: Assert none of it exists**

```bash
test ! -f dist/sitemap-index.xml && ! grep -q 'rel="canonical"' dist/en/about/index.html && echo "PASS: absent as expected"
```

- [ ] **Step 2: Install and wire the sitemap integration**

```bash
npm install @astrojs/sitemap
```

In `astro.config.mjs`, add the import at the top:

```js
import sitemap from '@astrojs/sitemap';
```

and add `integrations` to the config object, immediately after `base`:

```js
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', cs: 'cs' },
      },
    }),
  ],
```

- [ ] **Step 3: Add canonical, `og:url` and hreflang to `BaseLayout.astro`**

Extend the i18n import:

```astro
import { allLangs, getLangFromUrl, switchLangInPath, useTranslations, type Lang } from '../i18n/utils';
```

Add below the existing `favicon` line:

```astro
// Absolute URLs for canonical, sharing and hreflang. `Astro.site` carries the
// deployment origin; `Astro.url.pathname` already includes the configured
// base path, so joining the two gives the real public URL.
const canonical = Astro.site
  ? new URL(Astro.url.pathname, Astro.site).href
  : Astro.url.href;

const alternates = allLangs.map((code) => ({
  code,
  href: Astro.site
    ? new URL(switchLangInPath(Astro.url.pathname, code), Astro.site).href
    : switchLangInPath(Astro.url.pathname, code),
}));
```

In the `<head>`, after `<meta name="twitter:card" ... />`, add:

```astro
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={lang} />
    <link rel="canonical" href={canonical} />
    {alternates.map((alt) => (
      <link rel="alternate" hreflang={alt.code} href={alt.href} />
    ))}
    <link rel="alternate" hreflang="x-default" href={alternates[0].href} />
```

`alternates[0]` is `en` because `allLangs` derives from the `languages` object, where `en` is declared first. If a language is ever added ahead of `en` this breaks — note it and move on rather than over-engineering now.

- [ ] **Step 4: Verify**

```bash
npm run check \
  && test -f dist/sitemap-index.xml && echo "PASS: sitemap emitted" \
  && grep -q 'https://adamek727.github.io/adam-ligocki-web/en/about' dist/en/about/index.html && echo "PASS: canonical absolute" \
  && grep -q 'hreflang="cs"' dist/en/about/index.html && echo "PASS: hreflang alternates" \
  && grep -q 'hreflang="x-default"' dist/cs/about/index.html && echo "PASS: x-default"
```

Expected: four PASS lines.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(seo): add sitemap, canonical URLs and hreflang alternates"
```

---

### Task 8: Open Graph image

The spec calls for one static 1200×630 image. `sharp` ships with Astro 5 (verified in this checkout: vips 8.17.3), so the image can be generated from an SVG built out of the design tokens rather than sourced externally.

**Files:**
- Create: `scripts/make-og.mjs`
- Create: `public/og.png` (generated, committed)
- Modify: `package.json`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `npm run og` regenerates the image; `<meta property="og:image">` on every page.

- [ ] **Step 1: Assert the image is missing**

```bash
test ! -f public/og.png && echo "PASS: no OG image yet"
```

- [ ] **Step 2: Write the generator**

`scripts/make-og.mjs`:

```js
/*
 * Generates the static Open Graph card at public/og.png.
 *
 * Colours mirror the dark theme in src/styles/tokens.css. sharp comes with
 * Astro's image pipeline, so this needs no extra dependency. Re-run with
 * `npm run og` after changing the palette or the tagline.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0f1113"/>
  <rect x="0" y="0" width="1200" height="8" fill="#6aa4e8"/>
  <text x="80" y="270" font-family="Helvetica, Arial, sans-serif" font-size="86"
        font-weight="700" fill="#e6e8ea">Adam Ligocki</text>
  <text x="80" y="345" font-family="Helvetica, Arial, sans-serif" font-size="38"
        fill="#a3a8ae">Robotics · Perception · Machine Learning</text>
  <text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-size="30"
        fill="#707680">adamek727.github.io/adam-ligocki-web</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);
console.log('wrote public/og.png');
```

- [ ] **Step 3: Add the script and generate the image**

In `package.json` `"scripts"`, add `"og": "node scripts/make-og.mjs",` then run:

```bash
npm run og
```

Expected: `wrote public/og.png`

- [ ] **Step 4: Reference it from the layout**

In `src/layouts/BaseLayout.astro` frontmatter, below the `alternates` block:

```astro
const ogImage = Astro.site
  ? new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/og.png`, Astro.site).href
  : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/og.png`;
```

In the `<head>`, change `<meta name="twitter:card" content="summary" />` to `summary_large_image` and add:

```astro
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
```

- [ ] **Step 5: Verify**

```bash
npm run check \
  && node -e "import('sharp').then(async s=>{const m=await s.default('public/og.png').metadata();console.log(m.width===1200&&m.height===630?'PASS: 1200x630':'FAIL: '+m.width+'x'+m.height)})" \
  && grep -q 'og:image" content="https://adamek727.github.io/adam-ligocki-web/og.png"' dist/en/index.html && echo "PASS: og:image absolute" \
  && test -f dist/og.png && echo "PASS: image copied to dist"
```

Expected: three PASS lines.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(seo): add generated Open Graph card"
```

---

### Task 9: JSON-LD structured data

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `siteConfig` from Task 3, `canonical` and `ogImage` from Tasks 7 and 8.
- Produces: one `<script type="application/ld+json">` per page carrying a `Person` and a `ProfessionalService` node.

- [ ] **Step 1: Assert it is absent**

```bash
grep -q 'application/ld+json' dist/en/index.html && echo "FAIL: already present" || echo "PASS: absent as expected"
```

- [ ] **Step 2: Build the graph in the frontmatter**

Add `import { siteConfig } from '../config';` and, below the `ogImage` block:

```astro
// Structured data. Two nodes: the person, and the service offered — the spec
// calls for both so search results can distinguish the individual from the
// freelance practice.
const siteRoot = Astro.site
  ? new URL(import.meta.env.BASE_URL, Astro.site).href
  : import.meta.env.BASE_URL;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteRoot}#person`,
      name: siteConfig.name,
      url: siteRoot,
      email: `mailto:${siteConfig.email}`,
      image: ogImage,
      jobTitle: t('site.tagline'),
      sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.scholar],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteRoot}#service`,
      name: siteConfig.name,
      url: siteRoot,
      image: ogImage,
      description: t('site.description'),
      provider: { '@id': `${siteRoot}#person` },
      areaServed: 'Worldwide',
      availableLanguage: ['en', 'cs'],
    },
  ],
};
```

- [ ] **Step 3: Emit it**

At the end of the `<head>`, immediately before the inline theme bootstrap comment:

```astro
    <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
```

- [ ] **Step 4: Verify the JSON parses and carries both nodes**

```bash
npm run check && node -e "
const fs=require('fs');
const html=fs.readFileSync('dist/en/index.html','utf8');
const m=html.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s);
if(!m){console.log('FAIL: no ld+json block');process.exit(1)}
const d=JSON.parse(m[1]);
const types=d['@graph'].map(n=>n['@type']);
console.log(types.includes('Person')&&types.includes('ProfessionalService')?'PASS: both nodes, valid JSON':'FAIL: '+types);
"
```

Expected: `PASS: both nodes, valid JSON`

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(seo): add Person and ProfessionalService JSON-LD"
```

---

### Task 10: RSS feeds

**Files:**
- Create: `src/pages/[lang]/rss.xml.ts`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `getBlogPosts(lang)` and `entrySlug(id)` from `src/lib/content`.
- Produces: `/en/rss.xml` and `/cs/rss.xml`, plus an autodiscovery `<link rel="alternate" type="application/rss+xml">`.

- [ ] **Step 1: Assert the feed is absent**

```bash
test ! -f dist/en/rss.xml && echo "PASS: no feed yet"
```

- [ ] **Step 2: Install the RSS helper**

```bash
npm install @astrojs/rss
```

- [ ] **Step 3: Create the route**

`src/pages/[lang]/rss.xml.ts`:

```ts
/*
 * Per-language blog feed. One route per locale so a reader can subscribe to
 * just the language they read.
 */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';
import { getBlogPosts, entrySlug } from '../../lib/content';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const t = useTranslations(lang);
  const posts = await getBlogPosts(lang);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return rss({
    title: `${t('site.title')} — ${t('page.blog.title')}`,
    description: t('site.description'),
    site: site ?? 'https://adamek727.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}/${lang}/blog/${entrySlug(post.id)}/`,
    })),
  });
};
```

- [ ] **Step 4: Add autodiscovery to the layout**

In the `<head>` of `BaseLayout.astro`, after the canonical link:

```astro
    <link
      rel="alternate"
      type="application/rss+xml"
      title={`${t('site.title')} — ${t('page.blog.title')}`}
      href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/${lang}/rss.xml`}
    />
```

- [ ] **Step 5: Verify**

```bash
npm run check \
  && test -f dist/en/rss.xml && test -f dist/cs/rss.xml && echo "PASS: both feeds emitted" \
  && grep -q '<item>' dist/en/rss.xml && echo "PASS: feed has items" \
  && grep -q 'application/rss+xml' dist/en/index.html && echo "PASS: autodiscovery link"
```

Expected: three PASS lines.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(blog): add per-language RSS feeds with autodiscovery"
```

---

### Task 11: GoatCounter analytics

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `siteConfig.goatcounterCode` from Task 3.
- Produces: a single deferred script tag, present only in production builds and only when a real code is configured.

- [ ] **Step 1: Assert no analytics tag exists**

```bash
grep -q 'goatcounter' dist/en/index.html && echo "FAIL: already present" || echo "PASS: absent as expected"
```

- [ ] **Step 2: Add the guarded tag**

In the frontmatter:

```astro
// Analytics only in production, and only once a real site code is set — this
// keeps dev sessions and unconfigured checkouts out of the statistics.
const analyticsEnabled =
  import.meta.env.PROD && siteConfig.goatcounterCode !== 'REPLACE_ME';
```

At the very end of the `<head>`:

```astro
    {analyticsEnabled && (
      <script
        is:inline
        data-goatcounter={`https://${siteConfig.goatcounterCode}.goatcounter.com/count`}
        async
        src="//gc.zgo.at/count.js"
      />
    )}
```

- [ ] **Step 3: Verify the guard works both ways**

While `goatcounterCode` is still `REPLACE_ME`:

```bash
npm run check && (grep -q 'goatcounter' dist/en/index.html && echo "FAIL: tag emitted without a code" || echo "PASS: guard holds")
```

Expected: `PASS: guard holds`

Then, once the real code is set in `src/config.ts`:

```bash
npm run check && grep -q 'gc.zgo.at/count.js' dist/en/index.html && echo "PASS: tag emitted with a real code"
```

Expected: `PASS: tag emitted with a real code`

**If no GoatCounter code has been supplied yet, stop after the first assertion, leave `REPLACE_ME` in place, and say so.** Do not invent a code.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(analytics): add cookie-free GoatCounter tag, production only"
```

---

### Task 12: Contact form and thank-you page

Web3Forms posts over plain HTML — no JavaScript, no client framework. A honeypot field catches naive bots, and a `redirect` field sends a successful submission to a per-language thank-you page.

**Files:**
- Modify: `src/pages/[lang]/contact.astro`
- Create: `src/pages/[lang]/thank-you.astro`
- Modify: `src/i18n/ui.ts`
- Modify: `src/styles/components.css`

**Interfaces:**
- Consumes: `siteConfig.web3formsKey` from Task 3.
- Produces: routes `/en/thank-you`, `/cs/thank-you`; the i18n keys in Step 2.

- [ ] **Step 1: Assert the form is absent**

```bash
grep -q 'api.web3forms.com' dist/en/contact/index.html && echo "FAIL: already present" || echo "PASS: absent as expected"
```

- [ ] **Step 2: Add the i18n keys**

In the `en` block, after `'page.contact.title'`:

```ts
    'contact.form.heading': 'Send a message',
    'contact.form.name': 'Your name',
    'contact.form.email': 'Your email',
    'contact.form.message': 'What are you working on?',
    'contact.form.submit': 'Send',
    'contact.form.subject': 'New enquiry from adam-ligocki-web',
    'page.thankyou.title': 'Message sent',
    'page.thankyou.body':
      'Thank you — your message is on its way. I read everything and reply to anything I can help with, usually within two working days.',
    'page.thankyou.back': '← Back to the home page',
```

In the `cs` block, after `'page.contact.title'`:

```ts
    'contact.form.heading': 'Napište mi',
    'contact.form.name': 'Vaše jméno',
    'contact.form.email': 'Váš e-mail',
    'contact.form.message': 'Na čem pracujete?',
    'contact.form.submit': 'Odeslat',
    'contact.form.subject': 'Nová poptávka z adam-ligocki-web',
    'page.thankyou.title': 'Zpráva odeslána',
    'page.thankyou.body':
      'Děkuji — zpráva je na cestě. Čtu všechno a na cokoli, s čím dokážu pomoct, odpovídám obvykle do dvou pracovních dnů.',
    'page.thankyou.back': '← Zpět na úvodní stránku',
```

- [ ] **Step 3: Create the thank-you page**

`src/pages/[lang]/thank-you.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---

<PageLayout title={t('page.thankyou.title')} container="narrow">
  <p>{t('page.thankyou.body')}</p>
  <p><a href={`${base}/${lang}/`}>{t('page.thankyou.back')}</a></p>
</PageLayout>
```

- [ ] **Step 4: Add the form to the contact page**

Replace the whole of `src/pages/[lang]/contact.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { allLangs, useTranslations, type Lang } from '../../i18n/utils';
import { siteConfig } from '../../config';

export function getStaticPaths() {
  return allLangs.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: Lang };
const t = useTranslations(lang);

const pages = import.meta.glob<{ Content: any }>(
  '../../content/pages/**/contact.md',
  { eager: true },
);
const Content = pages[`../../content/pages/${lang}/contact.md`]?.Content;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const thankYou = Astro.site
  ? new URL(`${base}/${lang}/thank-you/`, Astro.site).href
  : `${base}/${lang}/thank-you/`;

// The form only works once a real Web3Forms access key is configured. Until
// then the markdown contact details render on their own rather than showing
// a form that silently fails.
const formEnabled = siteConfig.web3formsKey !== 'REPLACE_ME';
---

<PageLayout title={t('page.contact.title')} container="narrow">
  {Content ? <Content /> : <p class="muted">Content coming soon.</p>}

  {formEnabled && (
    <section style="margin-top: var(--sp-8);">
      <h2>{t('contact.form.heading')}</h2>
      <form class="form stack" action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value={siteConfig.web3formsKey} />
        <input type="hidden" name="subject" value={t('contact.form.subject')} />
        <input type="hidden" name="redirect" value={thankYou} />
        <input
          type="checkbox"
          name="botcheck"
          class="visually-hidden"
          style="display: none;"
          tabindex="-1"
          autocomplete="off"
        />

        <label class="form__field">
          <span>{t('contact.form.name')}</span>
          <input type="text" name="name" required autocomplete="name" />
        </label>

        <label class="form__field">
          <span>{t('contact.form.email')}</span>
          <input type="email" name="email" required autocomplete="email" />
        </label>

        <label class="form__field">
          <span>{t('contact.form.message')}</span>
          <textarea name="message" rows="6" required></textarea>
        </label>

        <p><button class="button" type="submit">{t('contact.form.submit')}</button></p>
      </form>
    </section>
  )}
</PageLayout>
```

- [ ] **Step 5: Style the form**

Append to `src/styles/components.css`:

```css
/* ---- Form ------------------------------------------------------------- */
.form__field {
  display: grid;
  gap: var(--sp-2);
}

.form__field > span {
  font-size: var(--fs-sm);
  color: var(--fg-muted);
}

.form input[type="text"],
.form input[type="email"],
.form textarea {
  width: 100%;
  padding: var(--sp-3);
  font: inherit;
  color: var(--fg);
  background: var(--bg-elevated);
  border: var(--border-width) solid var(--border-strong);
  border-radius: var(--radius-md);
}

.form input:focus-visible,
.form textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.form button {
  border: 0;
  cursor: pointer;
  font: inherit;
}
```

- [ ] **Step 6: Verify**

```bash
npm run check \
  && test -d dist/en/thank-you && test -d dist/cs/thank-you && echo "PASS: thank-you routes" \
  && (grep -q 'api.web3forms.com' dist/en/contact/index.html \
      && echo "PASS: form rendered" \
      || echo "SKIP: form gated off, access key still REPLACE_ME")
```

Expected: `PASS: thank-you routes`, then either `PASS: form rendered` or the `SKIP` line.

- [ ] **Step 7: Live submission test**

This is the spec's phase-4 verification and cannot be faked. Once deployed, submit the form from the live site and confirm the email arrives and the browser lands on `/en/thank-you`. Report the result; if no email arrives, the access key is wrong or unverified in the Web3Forms dashboard.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(contact): add Web3Forms contact form and thank-you page

Plain HTML POST with a honeypot field and a redirect to a per-language
thank-you page. The form is gated on a configured access key so an
unconfigured checkout does not render a form that silently fails."
```

---

### Task 13: Real content, gathered by interview

Every placeholder gets replaced. **All facts in this task come from the site owner via a structured interview — never from invention.** Biography, employment history, client names, dates, outcome numbers and publication counts are claims about a real person; fabricating any of them is a serious problem, not a placeholder. Where an answer is missing, leave the file untouched, list the gap, and ask.

The interview runs topic by topic, each topic producing one or more files:

| Interview topic | Produces |
|---|---|
| Identity and accounts | `src/config.ts` |
| Positioning and availability | `page.home.availability`, `page.home.positioning` in `ui.ts` |
| Track record numbers | the six `page.home.proof.*.value` keys |
| Services — the owner's own words for each of the three blocks | `content/pages/{en,cs}/services.md` |
| Biography | `content/pages/{en,cs}/about.md` |
| Career history | `content/pages/{en,cs}/cv.md` + the two PDFs |
| Case studies (3–5) | `content/projects/{en,cs}/<slug>.md` |
| Blog posts (2) | `content/blog/{en,cs}/<slug>.md` |

Czech copy is a translation of the owner's English answers (or vice versa), reviewed by the owner before commit — the two languages must state the same facts.

**Files:**
- Modify: `src/config.ts`, `src/i18n/ui.ts`, `src/content/pages/{en,cs}/{about,cv,contact,services}.md`
- Delete: `src/content/projects/{en,cs}/example-project.md`
- Create: `src/content/projects/{en,cs}/<slug>.md` × 3–5, `src/content/blog/{en,cs}/<slug>.md` × 2
- Create: `public/adam-ligocki-cv-en.pdf`, `public/adam-ligocki-cv-cs.pdf`

**Interfaces:**
- Consumes: the project schema from Task 1, the `cvPdf` path convention from Task 4 (`/adam-ligocki-cv-<lang>.pdf`).

- [ ] **Step 1: List every remaining placeholder — this is the work list**

```bash
grep -rn 'REPLACE_ME\|you@example.com\|add your profile URL\|placeholder\|Replace this' src/ | tee /tmp/placeholders.txt; wc -l < /tmp/placeholders.txt
```

Expected: a non-zero count. The task is done when it reads 0.

- [ ] **Step 2: Fill `src/config.ts` from the identity interview**

Replace `email`, `linkedin`, `scholar`, `web3formsKey`, `goatcounterCode` with the real values.

- [ ] **Step 3: Fill the positioning, availability and proof strings**

In `src/i18n/ui.ts`, replace `page.home.positioning`, `page.home.availability` and the six `page.home.proof.*.value` entries. Proof values are identical across languages; only the labels differ.

- [ ] **Step 4: Rewrite the service copy in the owner's words**

`src/content/pages/{en,cs}/services.md` — keep the three anchors and the four-beat structure, replace the wording.

- [ ] **Step 5: Replace the About and CV bodies**

Rewrite `about.md` with the real biography and `cv.md` with real experience, education, skills and publications. **The CV file must not start with an `<h1>`** — it renders as a subsection of the About page.

- [ ] **Step 6: Replace the contact details**

`src/content/pages/{en,cs}/contact.md` — real email, LinkedIn and Scholar URLs, matching `src/config.ts` exactly.

- [ ] **Step 7: Add the CV PDFs**

Place the supplied files at `public/adam-ligocki-cv-en.pdf` and `public/adam-ligocki-cv-cs.pdf`. The filenames are fixed by Task 4's `cvPdf` expression — if only one bilingual PDF exists, copy it to both names rather than changing the code.

- [ ] **Step 8: Replace the example project with real case studies**

```bash
git rm 'src/content/projects/en/example-project.md' 'src/content/projects/cs/example-project.md'
```

Create three to five case studies per language. `draft` must be `false` or the entry will not appear in a production build:

```markdown
---
title: <case study title>
description: <one-line pitch shown on the card>
client: <client name, or an anonymised label like "Confidential automotive OEM">
role: <what the engagement was>
period: <e.g. 2023 — 2024>
outcome: <one line stating the measurable result>
stack: [<technologies>]
tags: [<topic tags>]
repo: <optional URL>
link: <optional URL>
order: 1
featured: true
draft: false
---

## Problem

## Approach

## Result
```

At most three carry `featured: true` — the home page slices to three, so a fourth would silently never appear.

Every service must map to at least one case study with a stated outcome; that is an explicit success criterion in the spec. Check the coverage before moving on.

- [ ] **Step 9: Add two real blog posts**

Replace or supplement `src/content/blog/{en,cs}/hello-world.md`:

```markdown
---
title: <post title>
description: <one-line summary used in listings and meta tags>
pubDate: YYYY-MM-DD
tags: [<tags>]
draft: false
---
```

- [ ] **Step 10: Verify no placeholders remain**

```bash
npm run check \
  && (grep -rn 'REPLACE_ME\|you@example.com\|add your profile URL' src/ && echo "FAIL: placeholders remain" || echo "PASS: no placeholders") \
  && test -f dist/adam-ligocki-cv-en.pdf && echo "PASS: CV PDF published" \
  && ls dist/en/projects/ | grep -qv '^index' && echo "PASS: case-study pages generated" \
  && grep -c '<item>' dist/en/rss.xml
```

Expected: `PASS: no placeholders`, `PASS: CV PDF published`, `PASS: case-study pages generated`, and an item count of at least 2.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "content: replace every placeholder with real copy

Biography, CV, contact details, service copy, case studies and blog posts
in both languages, plus the downloadable CV PDFs."
```

---

### Task 14: CI check job

**Files:**
- Create: `.github/workflows/check.yml`

**Interfaces:**
- Consumes: `npm run check` from Task 2.
- Produces: a pull-request gate that fails on a type error or a broken internal link.

- [ ] **Step 1: Assert the workflow is absent**

```bash
test ! -f .github/workflows/check.yml && echo "PASS: absent as expected"
```

- [ ] **Step 2: Write the workflow**

`.github/workflows/check.yml`:

```yaml
# Pull-request quality gate. The deploy workflows are untouched — this only
# blocks merges, it never publishes.
name: Check

on:
  pull_request:
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check and build
        env:
          # Build at the site root so root-relative hrefs in the output resolve
          # against ./dist for the link checker below.
          SITE_URL: https://adamek727.github.io
          SITE_BASE: /
        run: npm run check

      - name: Check internal links
        uses: lycheeverse/lychee-action@v2
        with:
          args: --offline --base dist --no-progress 'dist/**/*.html'
          fail: true
```

- [ ] **Step 3: Reproduce the link check locally before pushing**

```bash
SITE_BASE=/ npm run check \
  && npx --yes @lycheeverse/lychee --offline --base dist --no-progress 'dist/**/*.html'
```

Expected: exit 0, no broken links. If it flags the CV PDF or `og.png`, those are real files under `public/` — a failure means Task 13 has not placed them yet.

Restore the production build afterwards:

```bash
npm run build
```

- [ ] **Step 4: Verify the gate can actually fail**

A gate that cannot fail is not a gate.

```bash
sed -i 's|href={link('"'"'/contact'"'"')}|href="/definitely-not-a-page"|' 'src/pages/[lang]/index.astro'
SITE_BASE=/ npm run build \
  && npx --yes @lycheeverse/lychee --offline --base dist --no-progress 'dist/**/*.html' \
  && echo "FAIL: gate did not catch the broken link" || echo "PASS: gate catches broken links"
git checkout 'src/pages/[lang]/index.astro'
npm run build
```

Expected: `PASS: gate catches broken links`, then a clean restore.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/check.yml
git commit -m "ci: gate pull requests on type check, build and link check"
```

---

## Post-implementation

Once every task is committed:

1. Push the branch and open a pull request, so the new check workflow runs against itself.
2. Merge; the existing deploy workflow publishes to GitHub Pages.
3. **Manual, outside the repo:** submit `https://adamek727.github.io/adam-ligocki-web/sitemap-index.xml` through Google Search Console. The generated `robots.txt` sits at a project path and is therefore ignored by crawlers — the documented consequence of staying on a GitHub project page, and this submission is the workaround.
4. Run the live contact-form submission from Task 12 Step 7 against production.
5. Validate the JSON-LD at `https://validator.schema.org/` against the deployed home page.

---

## Deviations from the plan as written

Recorded 2026-08-20 during execution. The plan above is the intent; this is
what actually shipped where the two differ.

1. **Service anchors use raw HTML headings, not `{#id}`.** Astro's markdown
   pipeline here does not support the custom-id syntax — it rendered
   `## R&D and prototyping {#rnd}` literally, producing
   `id="rd-and-prototyping-rnd"`. Rather than adding `rehype-slug` (whose
   auto-slugs differ per language, so the home-page links would have needed
   two sets of hrefs), the three headings in `services.md` are written as
   `<h2 id="rnd">…</h2>`. Anchors are now identical in both languages.

2. **The link checker is `scripts/check-links.mjs`, not `lychee-action`.**
   `npx lychee` could not be resolved locally, so the gate could not be
   proven to fail before pushing. The replacement is ~90 lines, runs
   identically locally and in CI, needs no third-party action, and
   additionally validates URL fragments — which is what caught deviation 1.
   `npm run check` now runs `astro check && astro build && npm run check:links`.

3. **The CV download link is gated on `siteConfig.cvPdfAvailable`.** The PDFs
   do not exist yet, and a hard link to a missing file fails the new gate.
   The flag defaults to `false`; flip it when the files land in `public/`.

4. **`langAltPath` was added to BaseLayout, PageLayout, Header and
   LanguageSwitcher.** Two real defects surfaced once links were checked:

   - `switchLangInPath` was base-unaware. On a path with no language segment
     (the 404 page) it prefixed rather than replaced, producing
     `/en/adam-ligocki-web/404/`. It now falls back to that language's home.
     This bug predates this work — the language switcher was already broken
     on the 404 page.
   - Blog tag pages have no cross-language equivalent, because the tag itself
     is translated: `/en/blog/tags/writing` has no `/cs/blog/tags/writing`.
     The tag route now passes `langAltPath="/blog"`, so both the hreflang
     alternates and the language switcher point at the other language's blog
     index instead of a URL that does not exist.

5. **Task order.** Tasks were executed without committing, at the user's
   pace, on branch `adam/site/finalization`. Commits are pending explicit
   authorization.
