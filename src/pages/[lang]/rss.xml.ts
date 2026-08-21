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
