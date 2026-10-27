import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { T } from './i18n';

export const GROUPS = {
  agents: { en: 'Agents × small hardware', zh: '智能体 × 小硬件' },
  research: { en: 'Research tools and explainers', zh: '科研工具与科普' },
  web: { en: 'Web apps and tools', zh: '网页应用与小工具' },
  making: { en: 'Making: printers, plotters, cases', zh: '动手做：打印机、写字机和外壳' },
  early: { en: 'Early work (HIT Shenzhen, 2018–2022)', zh: '早期作品（哈工大深圳，2018–2022）' },
} satisfies Record<string, T>;

const link = z.object({ label: z.string(), href: z.string() });

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
      caption: z.string().optional(), // handwritten line under the taped-in photo
      status: z.string().optional(),
      built: z.string().optional(), // honest authorship line
      links: z.array(link).default([]),
      featured: z.boolean().default(false),
      film: z.boolean().default(false), // show the radar explainer film above the text
    }),
});

// Chinese twins: same file name as the English entry; only the words, everything else is taken from English.
const projectsZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects-zh' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string().optional(),
    imageAlt: z.string().optional(),
    caption: z.string().optional(),
    status: z.string().optional(),
    built: z.string().optional(),
    links: z.array(link).optional(), // same order and hrefs as English, Chinese labels
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

const notesZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes-zh' }),
  schema: z.object({ title: z.string(), summary: z.string() }),
});

export const collections = { projects, projectsZh, notes, notesZh };
