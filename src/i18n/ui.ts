/*
 * UI translation strings. The single place to add or change anything that
 * appears in chrome (header, footer, button labels, page titles).
 *
 * Page bodies should live in markdown under src/content, not here.
 */

export const languages = {
  en: 'English',
  cs: 'Čeština',
} as const;

export const defaultLang = 'en';

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.title': 'Adam Ligocki',
    'site.tagline': 'Programmer · AI/ML · Robotics',
    'site.description':
      'Personal site of Adam Ligocki — programmer, AI/ML and robotics specialist.',

    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.cv': 'CV',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    'theme.toggle': 'Toggle colour scheme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'page.home.eyebrow': 'Hello',
    'page.projects.title': 'Selected projects',
    'page.cv.title': 'Curriculum Vitae',
    'page.blog.title': 'Blog',
    'page.blog.empty': 'No posts yet — first one coming soon.',
    'page.blog.tags': 'Tags',
    'page.contact.title': 'Get in touch',
    'page.about.title': 'About',

    'post.published': 'Published',
    'post.updated': 'Updated',
    'post.tagged': 'Tagged',
    'post.back': '← Back to blog',

    'tag.title': 'Posts tagged',
    'tag.back': '← All posts',

    'footer.built': 'Built with Astro',
    'footer.source': 'Source',
  },
  cs: {
    'site.title': 'Adam Ligocki',
    'site.tagline': 'Programátor · AI/ML · Robotika',
    'site.description':
      'Osobní web Adama Ligockého — programátor, specialista na AI/ML a robotiku.',

    'nav.home': 'Úvod',
    'nav.about': 'O mně',
    'nav.projects': 'Projekty',
    'nav.cv': 'Životopis',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',

    'theme.toggle': 'Přepnout barevné schéma',
    'theme.light': 'Světlé',
    'theme.dark': 'Tmavé',

    'page.home.eyebrow': 'Vítejte',
    'page.projects.title': 'Vybrané projekty',
    'page.cv.title': 'Životopis',
    'page.blog.title': 'Blog',
    'page.blog.empty': 'Zatím žádné příspěvky — brzy vyjde první.',
    'page.blog.tags': 'Štítky',
    'page.contact.title': 'Kontakt',
    'page.about.title': 'O mně',

    'post.published': 'Publikováno',
    'post.updated': 'Aktualizováno',
    'post.tagged': 'Štítky',
    'post.back': '← Zpět na blog',

    'tag.title': 'Příspěvky se štítkem',
    'tag.back': '← Všechny příspěvky',

    'footer.built': 'Postaveno na Astro',
    'footer.source': 'Zdroj',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
