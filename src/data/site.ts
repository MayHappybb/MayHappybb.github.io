import type { T } from '../i18n';

export const SITE = {
  name: { en: 'Haibin Meng', zh: '孟海彬' } satisfies T,
  description: {
    en: 'Haibin Meng: PhD candidate at Shanghai Jiao Tong University measuring micrometre vibrations with radar, and a maker of small things that blink.',
    zh: '孟海彬：上海交通大学博士生，用雷达测量微米级的振动，也做些会闪的小东西。',
  } satisfies T,
  email: 'hb.meng@outlook.com',
  github: 'https://github.com/MayHappybb',
  orcid: 'https://orcid.org/0009-0001-4117-3595',
  scholar: 'https://scholar.google.com/citations?user=4nmVRpQAAAAJ&hl=en',
};

export const NAV: { href: string; label: T }[] = [
  { href: '/', label: { en: 'Home', zh: '首页' } },
  { href: '/research/', label: { en: 'Research', zh: '研究' } },
  { href: '/projects/', label: { en: 'Projects', zh: '项目' } },
  { href: '/tools/', label: { en: 'Tools', zh: '工具' } },
  { href: '/notes/', label: { en: 'Notes', zh: '随笔' } },
  { href: '/about/', label: { en: 'About', zh: '关于' } },
];
