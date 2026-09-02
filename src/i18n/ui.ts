/*
 * UI translation strings — chrome only: navigation, section headings, button
 * labels, and the three proof numbers.
 *
 * Page copy does NOT live here. The hero, biography and skills come from
 * src/content/pages/<lang>/home.md; the client entries come from
 * src/content/projects/<lang>/*.md.
 *
 * Adding a key to `en` without adding it to `cs` is a type error. That is
 * deliberate: it stops a language falling silently behind.
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
    'site.tagline': 'Software engineer for machines that have to work outside the lab',
    'site.description':
      'Freelance software engineer in Ostrava and Český Těšín, Czech Republic. Robotics, computer vision and machine learning. 13 years of engineering, a doctorate in sensor fusion, and three years as CTO of a robotics company.',

    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.contact': 'Contact',
    'section.work': 'Selected work',
    'section.numbers': 'Track record',
    'section.contact': 'Contact',
    'nav.blog': 'Blog',

    'cta.contact': 'Get in touch',
    'cta.cv': 'Download CV',

    'portrait.placeholder': 'Photo goes here',

    'contact.lede':
      'Tell me what you are building and where it is stuck. If it is not something I can help with, I will say so.',
    'contact.email': 'Email',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.scholar': 'Publications',
    'contact.scholar.value': 'Google Scholar',

    'theme.toggle': 'Toggle colour scheme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'page.blog.title': 'Blog',
    'page.blog.empty': 'No posts yet — the first one is coming.',
    'page.blog.tags': 'Tags',

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
    'site.tagline': 'Softwarový inženýr pro stroje, které musí fungovat i mimo laboratoř',
    'site.description':
      'Softwarový inženýr na volné noze, Ostrava a Český Těšín. Robotika, počítačové vidění a strojové učení. Třináct let praxe, doktorát ze senzorové fúze a tři roky ve funkci CTO robotické firmy.',

    'nav.services': 'Služby',
    'nav.work': 'Reference',
    'nav.contact': 'Kontakt',
    'section.work': 'Vybrané reference',
    'section.numbers': 'Zkušenosti',
    'section.contact': 'Kontakt',
    'nav.blog': 'Blog',

    'cta.contact': 'Ozvěte se',
    'cta.cv': 'Stáhnout životopis',

    'portrait.placeholder': 'Sem přijde fotka',

    'contact.lede':
      'Napište mi, co stavíte a kde to vázne. Pokud to není nic, s čím dokážu pomoct, řeknu to rovnou.',
    'contact.email': 'E-mail',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.scholar': 'Publikace',
    'contact.scholar.value': 'Google Scholar',

    'theme.toggle': 'Přepnout barevné schéma',
    'theme.light': 'Světlé',
    'theme.dark': 'Tmavé',

    'page.blog.title': 'Blog',
    'page.blog.empty': 'Zatím žádné příspěvky — první brzy vyjde.',
    'page.blog.tags': 'Štítky',

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
