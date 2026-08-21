/*
 * Content collections schema. The site separates GUI (under src/components,
 * src/layouts, src/styles) from CONTENT (this directory). Adding or editing
 * a post is just dropping a .md file under src/content/blog/<lang>/ — no
 * code change required.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Engagement framing. `client` may be anonymised when an NDA applies,
      // e.g. "Confidential automotive OEM".
      client: z.string().optional(),
      role: z.string().optional(),
      period: z.string().optional(),
      outcome: z.string().optional(),
      stack: z.array(z.string()).default([]),
      cover: image().optional(),
      tags: z.array(z.string()).default([]),
      repo: z.string().url().optional(),
      link: z.string().url().optional(),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, projects };
