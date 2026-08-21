/*
 * Site-level identity constants.
 *
 * These are the values that are neither chrome strings (src/i18n/ui.ts) nor
 * page copy (src/content). They appear in structured data, the contact form
 * and the footer, so they live in exactly one place.
 *
 * The Web3Forms access key and the GoatCounter code are public by design —
 * both are sent from the browser — so committing them is not a leak. Until
 * they are set, the contact form and the analytics tag are simply not
 * rendered; see contact.astro and BaseLayout.astro.
 */
export const siteConfig = {
  name: 'Adam Ligocki',
  email: 'ligocki.a@gmail.com',
  github: 'https://github.com/adamek727',
  linkedin: 'https://www.linkedin.com/in/adamligocki',
  scholar: 'https://scholar.google.com/citations?user=jKSGGB8AAAAJ',
  repo: 'https://github.com/adamek727/adam-ligocki-web',
  web3formsKey: 'REPLACE_ME',
  goatcounterCode: 'REPLACE_ME',
  // Flip to true once public/adam-ligocki-cv-<lang>.pdf exist. Until then the
  // About page omits the download link rather than offering a dead one.
  cvPdfAvailable: false,
} as const;
