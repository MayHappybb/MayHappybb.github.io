// Two languages: English at /, Chinese at /zh/. Every page exists in both.
export type Lang = 'en' | 'zh';
export type T = { en: string; zh: string };
export const LANGS: Lang[] = ['en', 'zh'];
export const htmlLang = (l: Lang) => (l === 'zh' ? 'zh-CN' : 'en');

/** Pick the string for a language; plain strings are the same in both. */
export const L = (lang: Lang, v: T | string | undefined): string => (v === undefined ? '' : typeof v === 'string' ? v : v[lang]);

// page roots that have a Chinese twin; other site paths (/media/, /fonts/, /vendor/, /kit/) are shared files
const PAGES = ['/research', '/projects', '/tools', '/notes', '/about'];

/** An internal page link in the given language: '/research/' → '/zh/research/'. Other links are unchanged. */
export function lp(lang: Lang, href: string): string {
  if (lang !== 'zh' || !href.startsWith('/') || href.startsWith('/zh/')) return href;
  if (href === '/' || href.startsWith('/#')) return '/zh' + href;
  return PAGES.some((p) => href === p || href.startsWith(p + '/') || href.startsWith(p + '#')) ? '/zh' + href : href;
}

/** The same page in the other language. */
export function twin(path: string): { lang: Lang; href: string } {
  if (path === '/zh' || path.startsWith('/zh/')) return { lang: 'en', href: path.slice(3) || '/' };
  return { lang: 'zh', href: '/zh' + path };
}

export const dateFmt = (lang: Lang, d: Date) =>
  d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' });

/** Short strings used across pages. */
export const UI = {
  skip: { en: 'Skip to content', zh: '跳到正文' },
  navLabel: { en: 'Main', zh: '主导航' },
  lightsOff: { en: 'lights off', zh: '关灯' },
  lightsOn: { en: 'lights on', zh: '开灯' },
  switchAria: { en: 'Switch between white and black paper', zh: '在白纸和黑纸之间切换' },
  sayHi: { en: 'Say hi:', zh: '打个招呼：' },
  credits: {
    en: 'Drawn with rough.js, set in Gaegu and Klee One. Built with Astro and coding agents.',
    zh: '用 rough.js 手绘，英文字体 Gaegu 和 Klee One，中文字体霞鹜文楷和站酷快乐体。用 Astro 和编程智能体搭建。',
  },
  firstAuthor: { en: 'first author', zh: '第一作者' },
  allProjects: { en: 'All projects', zh: '全部项目' },
  allNotes: { en: 'All notes', zh: '全部随笔' },
  notes: { en: 'Notes', zh: '随笔' },
} satisfies Record<string, T>;
