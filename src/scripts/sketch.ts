// Hand-drawn decorations with rough.js. Elements opt in with data attributes:
//   data-under        heading underline
//   data-frame        rough rectangle around the element (redrawn when it resizes)
//   data-icon="name"  small drawn icon prepended to the element
//   .jar li           checkbox, ticked when data-done is set
//   data-rule         a wobbly horizontal line
// Everything is redrawn when the paper colour changes, with the same seeds, so lines don't jump.
import rough from 'roughjs';
import type { RoughSVG } from 'roughjs/bin/svg';
import type { Options } from 'roughjs/bin/core';

const NS = 'http://www.w3.org/2000/svg';
export const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
export const ink = () => css('--ink');
export const pencil = () => css('--pencil');
export const paper = () => css('--paper');
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function opt(seed: number, o: Options = {}): Options {
  return { stroke: ink(), strokeWidth: 1.6, roughness: 1.4, bowing: 1.2, seed, ...o };
}

export function svgEl(cls: string, viewBox: string, attrs: Record<string, string> = {}) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('class', cls); s.setAttribute('viewBox', viewBox); s.setAttribute('aria-hidden', 'true');
  s.setAttribute('focusable', 'false');
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  return s;
}

type IconFn = (rc: RoughSVG, s: number) => SVGGElement[];
const o = opt;
export const icons: Record<string, IconFn> = {
  spiral: (rc, s) => { const p: [number, number][] = []; for (let a = 0; a < 14; a += 0.4) p.push([20 + Math.cos(a) * a * 1.25, 20 + Math.sin(a) * a * 1.25]); return [rc.curve(p, o(s, { strokeWidth: 1.3 }))]; },
  clock: (rc, s) => [rc.circle(20, 20, 32, o(s)), rc.line(20, 20, 20, 9, o(s + 1)), rc.line(20, 20, 28, 24, o(s + 2))],
  chip: (rc, s) => { const a = [rc.rectangle(9, 9, 22, 22, o(s))]; for (let i = 0; i < 3; i++) { a.push(rc.line(14 + i * 6, 3, 14 + i * 6, 9, o(s + i + 1, { strokeWidth: 1 }))); a.push(rc.line(14 + i * 6, 31, 14 + i * 6, 37, o(s + i + 5, { strokeWidth: 1 }))); } return a; },
  ear: (rc, s) => [rc.arc(20, 20, 20, 20, -2.4, 0.9, false, o(s)), rc.arc(20, 20, 32, 32, -0.7, 0.7, false, o(s + 1)), rc.arc(20, 20, 44, 44, -0.6, 0.6, false, o(s + 2))],
  eye: (rc, s) => [rc.ellipse(20, 20, 34, 18, o(s)), rc.circle(20, 20, 9, o(s + 1, { fill: ink(), fillStyle: 'solid' }))],
  side: (rc, s) => [rc.line(5, 20, 35, 20, o(s)), rc.linearPath([[11, 14], [5, 20], [11, 26]], o(s + 1)), rc.linearPath([[29, 14], [35, 20], [29, 26]], o(s + 2))],
  bounce: (rc, s) => [rc.linearPath([[4, 8], [12, 32], [20, 8], [28, 32], [36, 8]], o(s))],
  star: (rc, s) => { const p: [number, number][] = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16, a = -Math.PI / 2 + i * Math.PI / 5; p.push([20 + r * Math.cos(a), 21 + r * Math.sin(a)]); } return [rc.polygon(p, o(s))]; },
  arm: (rc, s) => [rc.line(6, 34, 34, 34, o(s)), rc.linearPath([[12, 34], [14, 20], [26, 12], [32, 18]], o(s + 1)), rc.circle(14, 20, 5, o(s + 2)), rc.circle(26, 12, 5, o(s + 3))],
  film: (rc, s) => [rc.rectangle(5, 9, 30, 22, o(s)), rc.polygon([[16, 14], [26, 20], [16, 26]], o(s + 1, { fill: ink(), fillStyle: 'solid' }))],
  doc: (rc, s) => [rc.polygon([[9, 4], [25, 4], [32, 11], [32, 36], [9, 36]], o(s)), rc.line(14, 16, 27, 16, o(s + 1, { strokeWidth: 1 })), rc.line(14, 22, 27, 22, o(s + 2, { strokeWidth: 1 })), rc.line(14, 28, 23, 28, o(s + 3, { strokeWidth: 1 }))],
  cap: (rc, s) => [rc.polygon([[3, 16], [20, 8], [37, 16], [20, 24]], o(s)), rc.linearPath([[10, 20], [10, 29], [20, 33], [30, 29], [30, 20]], o(s + 1))],
  work: (rc, s) => [rc.rectangle(5, 13, 30, 21, o(s)), rc.rectangle(14, 7, 12, 6, o(s + 1))],
  printer: (rc, s) => [rc.rectangle(5, 5, 30, 30, o(s)), rc.line(5, 13, 35, 13, o(s + 1)), rc.rectangle(17, 13, 6, 6, o(s + 2)), rc.line(20, 19, 20, 24, o(s + 3)), rc.rectangle(12, 28, 16, 4, o(s + 4, { fill: ink(), fillStyle: 'hachure' }))],
  lamp: (rc, s) => [rc.polygon([[12, 6], [28, 6], [33, 20], [7, 20]], o(s)), rc.line(20, 20, 20, 32, o(s + 1)), rc.line(11, 34, 29, 34, o(s + 2))],
  car: (rc, s) => [rc.rectangle(6, 14, 28, 13, o(s)), rc.circle(12, 30, 8, o(s + 1)), rc.circle(28, 30, 8, o(s + 2)), rc.line(4, 37, 36, 37, o(s + 3, { strokeWidth: 1, stroke: pencil() }))],
  face: (rc, s) => [rc.circle(20, 20, 32, o(s)), rc.circle(14, 17, 3, o(s + 1, { fill: ink(), fillStyle: 'solid' })), rc.circle(26, 17, 3, o(s + 2, { fill: ink(), fillStyle: 'solid' })), rc.arc(20, 22, 16, 12, 0.3, 2.8, false, o(s + 3))],
  dots: (rc, s) => { const a: SVGGElement[] = []; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const r = 2 + (x + y) * 0.9; a.push(rc.circle(8 + x * 8, 8 + y * 8, r, o(s + y * 4 + x, { fill: ink(), fillStyle: 'solid', strokeWidth: 0.6 }))); } return a; },
  array: (rc, s) => { const a: SVGGElement[] = []; for (let i = 0; i < 4; i++) a.push(rc.circle(8 + i * 8, 30, 4, o(s + i, { strokeWidth: 1 }))); a.push(rc.arc(20, 30, 40, 40, -2.6, -0.5, false, o(s + 5, { strokeWidth: 1.2 }))); a.push(rc.arc(20, 30, 24, 24, -2.6, -0.5, false, o(s + 6, { strokeWidth: 1.2 }))); return a; },
  bot: (rc, s) => [rc.rectangle(9, 12, 22, 18, o(s)), rc.line(20, 12, 20, 5, o(s + 1)), rc.circle(20, 5, 4, o(s + 2)), rc.circle(15, 20, 3, o(s + 3, { fill: ink(), fillStyle: 'solid' })), rc.circle(25, 20, 3, o(s + 4, { fill: ink(), fillStyle: 'solid' })), rc.line(15, 26, 25, 26, o(s + 5, { strokeWidth: 1 }))],
  globe: (rc, s) => [rc.circle(20, 20, 32, o(s)), rc.ellipse(20, 20, 14, 32, o(s + 1, { strokeWidth: 1 })), rc.line(4, 20, 36, 20, o(s + 2, { strokeWidth: 1 }))],
  bulb: (rc, s) => [rc.circle(20, 16, 22, o(s)), rc.rectangle(15, 27, 10, 7, o(s + 1)), rc.line(20, 2, 20, 0, o(s + 2))],
  heart: (rc, s) => [rc.path('M20 34 C 4 22, 6 8, 14 8 C 18 8, 20 12, 20 14 C 20 12, 22 8, 26 8 C 34 8, 36 22, 20 34 Z', o(s))],
  mail: (rc, s) => [rc.rectangle(5, 10, 30, 20, o(s)), rc.linearPath([[5, 10], [20, 22], [35, 10]], o(s + 1))],
  sun: (rc, s) => { const a = [rc.circle(20, 20, 16, o(s))]; for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; a.push(rc.line(20 + 11 * Math.cos(t), 20 + 11 * Math.sin(t), 20 + 17 * Math.cos(t), 20 + 17 * Math.sin(t), o(s + i + 1, { strokeWidth: 1.2 }))); } return a; },
  wave: (rc, s) => [rc.curve([[3, 20], [10, 10], [17, 30], [24, 10], [31, 30], [37, 20]], o(s))],
  key: (rc, s) => [rc.circle(12, 20, 14, o(s)), rc.line(19, 20, 36, 20, o(s + 1)), rc.line(31, 20, 31, 27, o(s + 2)), rc.line(26, 20, 26, 25, o(s + 3))],
  pen: (rc, s) => [rc.polygon([[8, 32], [11, 24], [29, 6], [34, 11], [16, 29]], o(s)), rc.line(8, 32, 4, 36, o(s + 1))],
  house: (rc, s) => [rc.polygon([[5, 19], [20, 6], [35, 19]], o(s)), rc.rectangle(9, 19, 22, 16, o(s + 1)), rc.rectangle(17, 25, 6, 10, o(s + 2))],
};

function hashSeed(str: string, i: number) {
  let h = 17 + i * 101;
  for (let k = 0; k < str.length; k++) h = (h * 31 + str.charCodeAt(k)) % 100000;
  return h + 1;
}

export function drawIcon(name: string, seed: number, cls = 'icon') {
  const s = svgEl(cls, '0 0 40 40');
  const fn = icons[name] ?? icons.star;
  fn(rough.svg(s), seed).forEach((n) => s.appendChild(n));
  return s;
}

function frame(el: HTMLElement, i: number) {
  el.querySelector(':scope > svg.frame')?.remove();
  const w = el.offsetWidth, h = el.offsetHeight;
  if (!w || !h) return;
  const s = svgEl('frame', `0 0 ${w} ${h}`);
  const rc = rough.svg(s);
  const kind = el.dataset.frame;
  el.dataset.seed ??= String(hashSeed(el.textContent?.slice(0, 40) ?? '', i));
  const seed = Number(el.dataset.seed);
  if (kind === 'circle') s.appendChild(rc.ellipse(w / 2, h / 2, w - 4, h - 4, opt(seed, { strokeWidth: 1.4 })));
  else s.appendChild(rc.rectangle(3, 3, w - 6, h - 6, opt(seed, { strokeWidth: kind === 'bold' ? 2 : 1.2, roughness: 1.6 })));
  el.prepend(s);
}

const ro = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver((entries) => entries.forEach((e) => frame(e.target as HTMLElement, 0)))
  : null;
const observed = new WeakSet<Element>();

export function drawBits(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-under]').forEach((h, i) => {
    h.querySelector(':scope > svg.under')?.remove();
    const s = svgEl('under', '0 0 200 16', { preserveAspectRatio: 'none' });
    s.appendChild(rough.svg(s).curve([[2, 10], [60, 6], [130, 11], [198, 7]], opt(hashSeed(h.textContent ?? '', i), { strokeWidth: 2.2, roughness: 2 })));
    h.appendChild(s);
  });
  root.querySelectorAll<HTMLElement>('[data-icon]').forEach((el, i) => {
    el.querySelector(':scope > svg.icon')?.remove();
    el.prepend(drawIcon(el.dataset.icon!, hashSeed(el.dataset.icon!, i)));
  });
  root.querySelectorAll<HTMLElement>('.jar li').forEach((li, i) => {
    li.querySelector(':scope > svg.box')?.remove();
    const s = svgEl('box', '0 0 22 22');
    const rc = rough.svg(s); const seed = hashSeed(li.textContent ?? '', i);
    s.appendChild(rc.rectangle(2, 2, 18, 18, opt(seed, { strokeWidth: 1.3 })));
    if (li.dataset.done !== undefined) s.appendChild(rc.linearPath([[5, 11], [9, 17], [21, -2]], opt(seed + 1, { strokeWidth: 2.2 })));
    li.prepend(s);
  });
  root.querySelectorAll<HTMLElement>('[data-rule]').forEach((el, i) => {
    el.replaceChildren();
    const w = el.offsetWidth || 600;
    const s = svgEl('rule', `0 0 ${w} 16`, { width: '100%', height: '16' });
    s.appendChild(rough.svg(s).line(4, 8, w - 4, 8, opt(hashSeed('rule', i), { strokeWidth: 1.2, roughness: 2, stroke: pencil() })));
    el.appendChild(s);
  });
  root.querySelectorAll<HTMLElement>('.nav a[aria-current="page"]').forEach((a, i) => {
    a.querySelector(':scope > svg.under')?.remove();
    const s = svgEl('under', '0 0 100 16', { preserveAspectRatio: 'none' });
    s.appendChild(rough.svg(s).curve([[2, 9], [40, 6], [98, 9]], opt(hashSeed('nav', i), { strokeWidth: 2, roughness: 2 })));
    a.appendChild(s);
  });
  root.querySelectorAll<HTMLElement>('[data-frame]').forEach((el, i) => {
    frame(el, i);
    if (ro && !observed.has(el)) { observed.add(el); ro.observe(el); }
  });
}

function drawSwitch() {
  const sw = document.getElementById('switchsvg'); if (!sw) return;
  sw.replaceChildren(); const rc = rough.svg(sw as unknown as SVGSVGElement);
  const dark = document.documentElement.classList.contains('dark');
  sw.appendChild(rc.line(15, 0, 15, 32, opt(3, { strokeWidth: 1.2 })));
  sw.appendChild(rc.circle(15, 39, 12, opt(4, { fill: dark ? 'none' : ink(), fillStyle: 'solid' })));
}

export function redrawAll() {
  drawBits(); drawSwitch();
  document.dispatchEvent(new CustomEvent('sketch:redraw'));
}

export function initSketch() {
  const btn = document.getElementById('switch');
  const label = document.getElementById('switchlabel');
  const sync = () => {
    const dark = document.documentElement.classList.contains('dark');
    // the labels come from the button, in the page's language
    if (label) label.textContent = (dark ? btn?.dataset.on : btn?.dataset.off) ?? (dark ? 'lights on' : 'lights off');
    btn?.setAttribute('aria-pressed', String(dark));
  };
  sync();
  btn?.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('paper', dark ? 'black' : 'white'); } catch { /* private mode */ }
    sync();
    // wait for the colour transition to pick the new ink
    setTimeout(redrawAll, 30);
  });
  // the 中文/EN link: remember the choice, so other pages (and the gallery's header) follow it
  document.querySelectorAll<HTMLAnchorElement>('a[data-lang]').forEach((a) =>
    a.addEventListener('click', () => { try { localStorage.setItem('lang', a.dataset.lang!); } catch { /* private mode */ } }));
  let rt: number | undefined;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => drawBits(), 200); });
  document.fonts.ready.then(redrawAll);
}
