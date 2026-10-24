import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const GROUPS = {
  agents: 'Agents × small hardware',
  research: 'Research tools and explainers',
  web: 'Web apps and tools',
  making: 'Making: printers, plotters, cases',
  early: 'Early work (HIT Shenzhen, 2018–2022)',
} as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      year: z.string(),
      date: z.coerce.date(), // for sorting: when it started or was finished
      group: z.enum(Object.keys(GROUPS) as [keyof typeof GROUPS, ...(keyof typeof GROUPS)[]]),
      icon: z.string().default('star'),
      image: image().optional(),
      imageAlt: z.string().optional(),
      status: z.string().optional(),
      built: z.string().optional(), // honest authorship line
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      featured: z.boolean().default(false),
    }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    icon: z.string().default('pen'),
  }),
});

export const collections = { projects, notes };
