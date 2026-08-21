import { defaultLang, languages, ui, type Lang, type UIKey } from './ui';

export { languages, defaultLang };
export type { Lang };

/** Extract the language segment from a URL path (e.g. "/en/blog" → "en"). */
export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.split('/').filter(Boolean);
  // Account for the configured `base` path which may prefix the URL.
  for (const segment of segments) {
    if (segment in languages) return segment as Lang;
  }
  return defaultLang;
}

/** Curried translator bound to a language. Falls back to the default lang. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/**
 * Replace the language segment in a path. Used by the language switcher.
 * Preserves the rest of the path so the user lands on the equivalent page.
 *
 * A path with no language segment — the 404 page, the root redirect — has no
 * equivalent to preserve, so it falls back to that language's home. Prefixing
 * the language onto such a path would invent a URL that does not exist.
 */
export function switchLangInPath(pathname: string, target: Lang): string {
  const parts = pathname.split('/');
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] in languages) {
      parts[i] = target;
      return parts.join('/');
    }
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${target}/`;
}

/** All locales the site supports — handy for `getStaticPaths`. */
export const allLangs: Lang[] = Object.keys(languages) as Lang[];
