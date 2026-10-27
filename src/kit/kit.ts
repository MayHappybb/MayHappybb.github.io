// The sketchbook kit for the sites that live beside this one (clock gallery, Straight Line).
// Load /kit/v1/sketch.css and /kit/v1/sketch.js (deferred). It adds the site header with the
// pull-cord, shares the paper colour with the main site (same origin, same localStorage key),
// and draws rough frames and underlines. Pages that add content later call sketch.draw(root).
// The header goes before <main>, or in place of an element with data-sketch-header.
// Its language follows the choice made with the main site's 中文/EN link (localStorage 'lang');
// the pages themselves stay in English.
import { initSketch, drawBits, redrawAll } from '../scripts/sketch';
import { NAV } from '../data/site';

const lang: 'en' | 'zh' = (() => { try { return localStorage.getItem('lang') === 'zh' ? 'zh' : 'en'; } catch { return 'en'; } })();
const W = {
  en: { name: 'Haibin Meng', site: "Haibin Meng's site", skip: 'Skip to content', aria: 'Switch between white and black paper', off: 'lights off', on: 'lights on' },
  zh: { name: '孟海彬', site: '孟海彬的网站', skip: '跳到正文', aria: '在白纸和黑纸之间切换', off: '关灯', on: '开灯' },
}[lang];
const page = (href: string) => (lang === 'zh' ? '/zh' + href : href);

const ORIGIN = 'https://mayhappybb.github.io';

function header() {
  const top = document.createElement('header');
  top.className = 'top sk-top';
  const brand = Object.assign(document.createElement('a'), { className: 'brand', href: ORIGIN + page('/'), textContent: W.name });
  const nav = document.createElement('nav'); nav.setAttribute('aria-label', W.site);
  const ul = document.createElement('ul'); ul.className = 'nav';
  for (const n of NAV) {
    const li = document.createElement('li');
    li.append(Object.assign(document.createElement('a'), { href: ORIGIN + page(n.href), textContent: n.label[lang] }));
    ul.append(li);
  }
  nav.append(ul);
  const sw = document.createElement('button');
  Object.assign(sw, { className: 'switch', id: 'switch', type: 'button' });
  sw.setAttribute('aria-label', W.aria); sw.setAttribute('aria-pressed', 'false');
  sw.dataset.off = W.off; sw.dataset.on = W.on;
  sw.innerHTML = `<svg id="switchsvg" viewBox="0 0 30 52" aria-hidden="true"></svg><span id="switchlabel">${W.off}</span>`;
  top.append(brand, nav, sw);
  return top;
}

function start() {
  const body = document.body;
  const main = document.querySelector('main');
  const slot = document.querySelector('[data-sketch-header]'); // a page can say where the header goes
  if (slot) slot.replaceWith(header());
  else if (main) {
    main.id ||= 'sk-main';
    const skip = Object.assign(document.createElement('a'), { className: 'sk-skip', href: `#${main.id}`, textContent: W.skip });
    body.prepend(skip);
    skip.after(header());
  } else body.prepend(header());
  initSketch();
  (window as unknown as { sketch: object }).sketch = { draw: drawBits, redraw: redrawAll, dark: () => document.documentElement.classList.contains('dark') };
  document.dispatchEvent(new CustomEvent('sketch:ready'));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
