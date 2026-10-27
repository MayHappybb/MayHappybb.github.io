// Projects and notes in either language. Chinese entries carry only the words; dates, images,
// groups and flags come from the English entry with the same id. A missing or orphaned
// translation stops the build, so the two sites always have the same pages.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

type ProjectData = CollectionEntry<'projects'>['data'];
type NoteData = CollectionEntry<'notes'>['data'];
export interface Project { id: string; data: ProjectData; entry: CollectionEntry<'projects'> | CollectionEntry<'projectsZh'> }
export interface Note { id: string; data: NoteData; entry: CollectionEntry<'notes'> | CollectionEntry<'notesZh'> }

const defined = <O extends object>(o: O) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<O>;

function pair<E extends { id: string }, Z extends { id: string }>(en: E[], zh: Z[], what: string) {
  const byId = new Map(zh.map((z) => [z.id, z]));
  const missing = en.filter((e) => !byId.has(e.id)).map((e) => e.id);
  const orphan = zh.filter((z) => !en.some((e) => e.id === z.id)).map((z) => z.id);
  if (missing.length) throw new Error(`Missing Chinese ${what}: ${missing.join(', ')} (add src/content/${what}-zh/<id>.md)`);
  if (orphan.length) throw new Error(`Chinese ${what} without an English original: ${orphan.join(', ')}`);
  return byId;
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  const en = await getCollection('projects');
  if (lang === 'en') return en.map((p) => ({ id: p.id, data: p.data, entry: p }));
  const zh = pair(en, await getCollection('projectsZh'), 'projects');
  return en.map((p) => {
    const z = zh.get(p.id)!;
    if (z.data.links && z.data.links.length !== p.data.links.length) throw new Error(`projects-zh/${p.id}.md: links must match the English ones`);
    return { id: p.id, data: { ...p.data, ...defined(z.data), links: z.data.links ?? p.data.links }, entry: z };
  });
}

export async function getNotes(lang: Lang): Promise<Note[]> {
  const en = await getCollection('notes');
  if (lang === 'en') return en.map((n) => ({ id: n.id, data: n.data, entry: n }));
  const zh = pair(en, await getCollection('notesZh'), 'notes');
  return en.map((n) => ({ id: n.id, data: { ...n.data, ...defined(zh.get(n.id)!.data) }, entry: zh.get(n.id)! }));
}
