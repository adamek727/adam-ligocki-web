/*
 * UI translation strings. The single place to add or change anything that
 * appears in chrome (header, footer, button labels, page titles).
 *
 * Page bodies should live in markdown under src/content, not here. The
 * exceptions are the hero and proof-strip one-liners: they need translating
 * and have no natural markdown home, so they sit alongside the other short
 * strings.
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
    'site.tagline': 'Freelance robotics, computer vision and ML engineer',
    'site.description':
      'Freelance robotics, computer vision and machine-learning engineer. PhD, 15 years of engineering, available for research and deep-tech projects.',

    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Work',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    'theme.toggle': 'Toggle colour scheme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    'page.home.availability': 'Available for new engagements',
    'page.home.positioning':
      'PhD roboticist with 15 years of engineering. I turn research-stage perception, computer vision and machine learning into systems that hold up outside the lab.',
    'page.home.cta.primary': 'Start a conversation',
    'page.home.cta.secondary': 'See selected work',
    'page.home.services': 'How I can help',
    'page.home.service.delivery': 'Project delivery',
    'page.home.service.delivery.body':
      'End-to-end delivery of a perception or ML component, from requirements to running on your hardware.',
    'page.home.service.consulting': 'Consulting & audits',
    'page.home.service.consulting.body':
      'A written review of an existing system, with findings ranked by impact and each one backed by evidence.',
    'page.home.service.rnd': 'R&D & prototyping',
    'page.home.service.rnd.body':
      'A measurable prototype that answers whether a research approach is worth productising.',
    'page.home.proof': 'Track record',
    'page.home.proof.years.value': '15',
    'page.home.proof.years.label': 'years of engineering',
    'page.home.proof.domains.value': '4',
    'page.home.proof.domains.label': 'core domains',
    'page.home.proof.research.value': '6',
    'page.home.proof.research.label': 'years of postdoc research',
    'page.home.closing': 'Have a problem that fits?',
    'page.home.closing.body':
      'Tell me what you are building and where it is stuck. If it is not something I can help with, I will say so.',

    'page.services.title': 'Services',
    'page.projects.title': 'Selected work',
    'page.projects.empty': 'No case studies published yet.',

    'project.client': 'Client',
    'project.role': 'Role',
    'project.period': 'Period',
    'project.outcome': 'Outcome',
    'project.stack': 'Stack',
    'project.repo': 'Source code',
    'project.link': 'Live',
    'project.back': '← All work',

    'page.about.title': 'About',
    'about.cv.heading': 'Curriculum Vitae',
    'about.cv.download': 'Download CV (PDF)',

    'page.blog.title': 'Blog',
    'page.blog.empty': 'No posts yet — first one coming soon.',
    'page.blog.tags': 'Tags',

    'page.contact.title': 'Get in touch',
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
    'site.tagline': 'Robotika, počítačové vidění a ML na volné noze',
    'site.description':
      'Robotika, počítačové vidění a strojové učení na volné noze. Doktorát, 15 let inženýrské praxe, volné kapacity pro výzkumné a deep-tech projekty.',

    'nav.home': 'Úvod',
    'nav.services': 'Služby',
    'nav.projects': 'Reference',
    'nav.about': 'O mně',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',

    'theme.toggle': 'Přepnout barevné schéma',
    'theme.light': 'Světlé',
    'theme.dark': 'Tmavé',

    'page.home.availability': 'Přijímám nové zakázky',
    'page.home.positioning':
      'Robotik s doktorátem a 15 lety inženýrské praxe. Převádím výzkumnou percepci, počítačové vidění a strojové učení do systémů, které obstojí i mimo laboratoř.',
    'page.home.cta.primary': 'Ozvěte se',
    'page.home.cta.secondary': 'Vybrané reference',
    'page.home.services': 'S čím pomůžu',
    'page.home.service.delivery': 'Dodávka projektu',
    'page.home.service.delivery.body':
      'Dodání percepční nebo ML komponenty od zadání až po běh na vašem hardwaru.',
    'page.home.service.consulting': 'Konzultace a audity',
    'page.home.service.consulting.body':
      'Písemný přezkum existujícího systému se zjištěními seřazenými podle dopadu a doloženými podklady.',
    'page.home.service.rnd': 'Výzkum a prototypy',
    'page.home.service.rnd.body':
      'Měřitelný prototyp, který odpoví, jestli má smysl výzkumný přístup produktizovat.',
    'page.home.proof': 'Zkušenosti',
    'page.home.proof.years.value': '15',
    'page.home.proof.years.label': 'let inženýrské praxe',
    'page.home.proof.domains.value': '4',
    'page.home.proof.domains.label': 'hlavní obory',
    'page.home.proof.research.value': '6',
    'page.home.proof.research.label': 'let postdoktorského výzkumu',
    'page.home.closing': 'Máte problém, který sedí?',
    'page.home.closing.body':
      'Napište, co stavíte a kde to vázne. Pokud to není nic, s čím pomůžu, řeknu to rovnou.',

    'page.services.title': 'Služby',
    'page.projects.title': 'Vybrané reference',
    'page.projects.empty': 'Zatím nejsou publikované žádné reference.',

    'project.client': 'Klient',
    'project.role': 'Role',
    'project.period': 'Období',
    'project.outcome': 'Výsledek',
    'project.stack': 'Technologie',
    'project.repo': 'Zdrojový kód',
    'project.link': 'Živá ukázka',
    'project.back': '← Všechny reference',

    'page.about.title': 'O mně',
    'about.cv.heading': 'Životopis',
    'about.cv.download': 'Stáhnout životopis (PDF)',

    'page.blog.title': 'Blog',
    'page.blog.empty': 'Zatím žádné příspěvky — brzy vyjde první.',
    'page.blog.tags': 'Štítky',

    'page.contact.title': 'Kontakt',
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
