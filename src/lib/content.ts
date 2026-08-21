/*
 * Helpers for filtering content collections by language and de-drafting.
 *
 * Convention: post files live under `src/content/<collection>/<lang>/<slug>.md`.
 * The first path segment of the entry id is the language code.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';

type Collection = 'blog' | 'projects';

const isProd = import.meta.env.PROD;

function entryLang(id: string): string {
  return id.split('/')[0] ?? '';
}

/** Strip the leading `<lang>/` from an entry id to get the bare slug. */
export function entrySlug(id: string): string {
  const idx = id.indexOf('/');
  return idx === -1 ? id : id.slice(idx + 1);
}

export async function getEntriesByLang<C extends Collection>(
  collection: C,
  lang: Lang,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection, ({ data, id }) => {
    if (entryLang(id) !== lang) return false;
    if (isProd && 'draft' in data && data.draft) return false;
    return true;
  });
  return entries;
}

export async function getBlogPosts(lang: Lang): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getEntriesByLang('blog', lang);
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getProjects(lang: Lang): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getEntriesByLang('projects', lang);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** One-line engagement summary shown under a project card title. */
export function projectMeta(project: CollectionEntry<'projects'>): string | undefined {
  const parts = [project.data.client, project.data.role, project.data.period];
  const meta = parts.filter(Boolean).join(' · ');
  return meta === '' ? undefined : meta;
}

/** Collect every distinct tag across the published posts. */
export async function getAllTags(lang: Lang): Promise<string[]> {
  const posts = await getBlogPosts(lang);
  const tags = new Set<string>();
  for (const post of posts) for (const tag of post.data.tags) tags.add(tag);
  return [...tags].sort((a, b) => a.localeCompare(b));
}
