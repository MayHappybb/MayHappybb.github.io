// The home-page drawing: a radar on a tripod sends waves to a foil in front of a speaker,
// and a tiny desk clock shows the real time. Draws itself once, then redraws on paper change.
import rough from 'roughjs';
import { opt, ink, pencil, paper, reduceMotion } from './sketch';

const NS = 'http://www.w3.org/2000/svg';

function text(svg: SVGSVGElement, x: number, y: number, s: string, size = 20, color?: string, anchor = 'start', rot = 0) {
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', String(x)); t.setAttribute('y', String(y)); t.setAttribute('font-family', 'Gaegu, "ZCOOL KuaiLe", cursive');
  t.setAttribute('font-size', String(size)); t.setAttribute('fill', color || ink()); t.setAttribute('text-anchor', anchor);
  if (rot) t.setAttribute('transform', `rotate(${rot} ${x} ${y})`);
  t.textContent = s; svg.appendChild(t); return t;
}

function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function drawHero(svg: SVGSVGElement, animate: boolean) {
  svg.replaceChildren();
  let seed = 7; const o = (x = {}) => opt(seed++, x);
  const rc = rough.svg(svg); const add = (n: SVGElement) => svg.appendChild(n);
  add(rc.line(10, 262, 690, 262, o({ strokeWidth: 1.2 })));
  // radar on a tripod
  add(rc.rectangle(40, 120, 84, 60, o()));
  for (let i = 0; i < 3; i++) add(rc.circle(58 + i * 12, 140, 6, o({ fill: ink(), fillStyle: 'solid', strokeWidth: 1 })));
  for (let i = 0; i < 4; i++) add(rc.circle(58 + i * 12, 160, 6, o({ strokeWidth: 1 })));
  add(rc.line(82, 180, 60, 262, o())); add(rc.line(82, 180, 104, 262, o())); add(rc.line(82, 180, 82, 262, o()));
  text(svg, 82, 112, '77 GHz', 20, pencil(), 'middle', -4);
  // waves
  const waves = document.createElementNS(NS, 'g'); waves.setAttribute('class', 'waves'); svg.appendChild(waves);
  for (let i = 0; i < 4; i++) {
    const r = 40 + i * 32;
    waves.appendChild(rc.arc(124, 150, r * 2, r * 2, -0.55, 0.55, false, o({ strokeWidth: 1.3, roughness: 1.8 })));
  }
  // speaker with a thin foil in front
  add(rc.rectangle(300, 150, 70, 112, o()));
  add(rc.circle(335, 185, 38, o())); add(rc.circle(335, 235, 22, o()));
  add(rc.curve([[282, 140], [286, 175], [280, 205], [285, 240]], o({ strokeWidth: 2.2 })));
  text(svg, 286, 292, 'a 10 µm foil', 20, pencil(), 'middle', -3);
  add(rc.line(284, 276, 284, 246, o({ stroke: pencil(), strokeWidth: 1 })));
  // little notes
  [[388, 168], [404, 150], [396, 196]].forEach(([x, y]) => {
    add(rc.ellipse(x, y, 9, 7, o({ fill: ink(), fillStyle: 'solid', strokeWidth: 1 })));
    add(rc.line(x + 4, y, x + 4, y - 20, o({ strokeWidth: 1.2 })));
  });
  // desk and the tiny screen
  add(rc.line(470, 232, 690, 232, o())); add(rc.line(490, 232, 490, 262, o())); add(rc.line(670, 232, 670, 262, o()));
  add(rc.rectangle(520, 172, 130, 54, o()));
  add(rc.rectangle(530, 182, 110, 34, o({ fill: ink(), fillStyle: 'solid', strokeWidth: 1 })));
  const t = text(svg, 585, 210, hhmm(), 30, paper(), 'middle');
  t.setAttribute('font-weight', '700'); t.setAttribute('class', 'heroclock');
  text(svg, 585, 160, 'my desk clock', 20, pencil(), 'middle', 3);
  // sparkle
  add(rc.linearPath([[672, 118], [672, 140]], o({ strokeWidth: 1.2 }))); add(rc.linearPath([[661, 129], [683, 129]], o({ strokeWidth: 1.2 })));

  if (animate && !reduceMotion()) {
    svg.querySelectorAll('path').forEach((p, i) => {
      const L = p.getTotalLength ? p.getTotalLength() : 0; if (!L) return;
      p.style.strokeDasharray = String(L); p.style.strokeDashoffset = String(L);
      p.style.transition = `stroke-dashoffset .9s ease ${Math.min(i * 0.012, 1.6)}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => { p.style.strokeDashoffset = '0'; }));
    });
    svg.querySelectorAll('text').forEach((tt, i) => {
      tt.style.opacity = '0'; tt.style.transition = `opacity .6s ease ${1.2 + i * 0.1}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => { tt.style.opacity = '1'; }));
    });
  }
}

export function initHero() {
  const svg = document.getElementById('hero') as SVGSVGElement | null; if (!svg) return;
  let first = true;
  const draw = () => { drawHero(svg, first); first = false; };
  document.addEventListener('sketch:redraw', draw);
  setInterval(() => { const c = svg.querySelector('.heroclock'); if (c) c.textContent = hhmm(); }, 10_000);
}
