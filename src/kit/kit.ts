// The sketchbook kit for the sites that live beside this one (clock gallery, Straight Line).
// Load /kit/v1/sketch.css and /kit/v1/sketch.js (deferred). It adds the site header with the
// pull-cord, shares the paper colour with the main site (same origin, same localStorage key),
// and draws rough frames and underlines. Pages that add content later call sketch.draw(root).
import { initSketch, drawBits, redrawAll } from '../scripts/sketch';
import { NAV, SITE } from '../data/site';

const ORIGIN = 'https://mayhappybb.github.io';

function header() {
  const top = document.createElement('header');
  top.className = 'top sk-top';
  const brand = Object.assign(document.createElement('a'), { className: 'brand', href: `${ORIGIN}/`, textContent: SITE.name });
  const nav = document.createElement('nav'); nav.setAttribute('aria-label', 'Haibin Meng\'s site');
  const ul = document.createElement('ul'); ul.className = 'nav';
  for (const n of NAV) {
    const li = document.createElement('li');
    li.append(Object.assign(document.createElement('a'), { href: ORIGIN + n.href, textContent: n.label }));
    ul.append(li);
  }
  nav.append(ul);
  const sw = document.createElement('button');
  Object.assign(sw, { className: 'switch', id: 'switch', type: 'button' });
  sw.setAttribute('aria-label', 'Switch between white and black paper'); sw.setAttribute('aria-pressed', 'false');
  sw.innerHTML = '<svg id="switchsvg" viewBox="0 0 30 52" aria-hidden="true"></svg><span id="switchlabel">lights off</span>';
  top.append(brand, nav, sw);
  return top;
}

function start() {
  const body = document.body;
  const main = document.querySelector('main');
  if (main) {
    main.id ||= 'sk-main';
    const skip = Object.assign(document.createElement('a'), { className: 'sk-skip', href: `#${main.id}`, textContent: 'Skip to content' });
    body.prepend(skip);
    skip.after(header());
  } else body.prepend(header());
  initSketch();
  (window as unknown as { sketch: object }).sketch = { draw: drawBits, redraw: redrawAll, dark: () => document.documentElement.classList.contains('dark') };
  document.dispatchEvent(new CustomEvent('sketch:ready'));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
