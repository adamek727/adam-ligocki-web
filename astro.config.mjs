import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site configuration.
//
// `site` and `base` are the only host-specific values here. To redeploy under
// a different URL (e.g. GitLab Pages) override them via environment variables
// in CI — no source code changes required.
const site = process.env.SITE_URL ?? 'https://adamek727.github.io';
const base = process.env.SITE_BASE ?? '/adam-ligocki-web';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', cs: 'cs' },
      },
    }),
  ],
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cs'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
