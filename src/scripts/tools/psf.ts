// Array PSF designer: define Tx/Rx positions, see the virtual array, the beam pattern and the range-angle PSF.
import { virtualArray, weights, dirCos, lobeStats, gratingLobes, type Pt } from './psf-core';
import { css } from '../sketch';
import PsfWorker from './psf-worker.ts?worker';
// the page's language decides the words (Chinese pages live under /zh/)
const ZH = document.documentElement.lang.startsWith('zh');
const tr = (en: string, zh: string) => (ZH ? zh : en);


const C = 299_792_458;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const el = {
  preset: $<HTMLSelectElement>('preset'), tx: $<HTMLTextAreaElement>('tx'), rx: $<HTMLTextAreaElement>('rx'),
  unit: $<HTMLSelectElement>('unit'), f0: $<HTMLInputElement>('f0'), bw: $<HTMLInputElement>('bw'),
  win: $<HTMLSelectElement>('win'), merge: $<HTMLInputElement>('merge'), az0: $<HTMLInputElement>('az0'),
  el0: $<HTMLInputElement>('el0'), dyn: $<HTMLInputElement>('dyn'), click: $<HTMLSelectElement>('click'),
  layout: document.getElementById('layout') as unknown as SVGSVGElement, uv: $<HTMLCanvasElement>('uv'),
  cuts: document.getElementById('cuts') as unknown as SVGSVGElement, ra: $<HTMLCanvasElement>('ra'),
  stats: $('stats'), msg: $('msg'), errs: $('errs'),
};

// Presets in half-wavelength units (x to the right, y up), as published by TI or measured in our lab.
const range = (n: number, f: (i: number) => Pt) => Array.from({ length: n }, (_, i) => f(i));
const PRESETS: Record<string, { label: string; tx: Pt[]; rx: Pt[]; f0: number; bw: number }> = {
  xwr1843: { label: tr('TI xWR1843 / xWR1443 BOOST (3 Tx, 4 Rx)', 'TI xWR1843 / xWR1443 BOOST（3 发 4 收）'), tx: [[0, 0], [2, 1], [4, 0]], rx: range(4, (i) => [i, 0]), f0: 77, bw: 4 },
  aop: {
    label: tr('TI IWR6843AOP (3 Tx, 4 Rx, as mounted in our lab)', 'TI IWR6843AOP（3 发 4 收，按我们实验室的安装方向）'),
    tx: [[0, -2], [-2, 0], [0, 0]], rx: [[0, 1], [0, 0], [1, 1], [1, 0]], f0: 61.75, bw: 3.5,
  },
  cascade: {
    label: tr('TI MMWCAS 4-chip cascade (12 Tx, 16 Rx)', 'TI MMWCAS 四片级联（12 发 16 收）'),
    tx: [11, 10, 9, 32, 28, 24, 20, 16, 12, 8, 4, 0].map((x, i) => [x, [6, 4, 1][i] ?? 0] as Pt),
    rx: [11, 12, 13, 14, 50, 51, 52, 53, 46, 47, 48, 49, 0, 1, 2, 3].map((x) => [x, 0] as Pt), f0: 77, bw: 1,
  },
  ula8: { label: tr('Uniform line, 1 Tx, 8 Rx', '均匀线阵，1 发 8 收'), tx: [[0, 0]], rx: range(8, (i) => [i, 0]), f0: 77, bw: 4 },
  ula8wide: { label: tr('Line with λ spacing (grating lobes)', 'λ 间距线阵（会有栅瓣）'), tx: [[0, 0]], rx: range(8, (i) => [2 * i, 0]), f0: 77, bw: 4 },
  ura: { label: tr('Square 8×8, 2 Tx, 32 Rx', '8×8 方阵，2 发 32 收'), tx: [[0, 0], [0, 4]], rx: range(32, (i) => [i % 8, Math.floor(i / 8)]), f0: 77, bw: 4 },
};
for (const [k, p] of Object.entries(PRESETS)) el.preset.add(new Option(p.label, k));
el.preset.add(new Option(tr('Custom (edit below)', '自定义（在下面编辑）'), 'custom'));

const fmt = (p: Pt[]) => p.map(([x, y]) => `${+x.toFixed(3)} ${+y.toFixed(3)}`).join('\n');
function parse(s: string, name: string, errs: string[]): Pt[] {
  const out: Pt[] = [];
  s.split('\n').forEach((line, i) => {
    const t = line.replace(/#.*/, '').trim(); if (!t) return;
    const n = t.split(/[\s,;]+/).map(Number);
    if (n.length < 1 || n.length > 2 || n.some((v) => !Number.isFinite(v))) { errs.push(tr(`${name} line ${i + 1}: expected "x y"`, `${name === 'Tx' ? '发射天线' : '接收天线'}第 ${i + 1} 行：应为“x y”`)); return; }
    out.push([n[0], n[1] ?? 0]);
  });
  return out;
}

function applyPreset(k: string) {
  const p = PRESETS[k]; if (!p) return;
  el.unit.value = 'half';
  el.tx.value = fmt(p.tx); el.rx.value = fmt(p.rx); el.f0.value = String(p.f0); el.bw.value = String(p.bw);
}

// current state
let tx: Pt[] = [], rx: Pt[] = [];
const toLambda = () => {
  const lam = C / (+el.f0.value * 1e9);
  return el.unit.value === 'half' ? 0.5 : el.unit.value === 'mm' ? 1e-3 / lam : 1;
};

const N = 161;
const angles = Float64Array.from({ length: 721 }, (_, i) => -90 + i * 0.25);
const worker = new PsfWorker();
let jobId = 0;
let ctx: { u0: number; v0: number; az0: number; el0: number; resR: number; drMax: number } | null = null;

function update() {
  const errs: string[] = [];
  tx = parse(el.tx.value, 'Tx', errs); rx = parse(el.rx.value, 'Rx', errs);
  const f0 = +el.f0.value, B = +el.bw.value * 1e9;
  if (!(f0 > 0)) errs.push(tr('Carrier must be positive.', '载频必须大于零。'));
  if (!(B > 0)) errs.push(tr('Bandwidth must be positive.', '带宽必须大于零。'));
  if (!tx.length || !rx.length) errs.push(tr('Add at least one Tx and one Rx.', '至少要有一个发射天线和一个接收天线。'));
  if (tx.length * rx.length > 4096) errs.push(tr('More than 4096 virtual elements: please use fewer.', '虚拟单元超过 4096 个，请减少一些。'));
  el.errs.textContent = errs.join(' ');
  drawLayout();
  if (errs.length) return;
  const s = toLambda();
  const va = virtualArray(tx.map(([x, y]) => [x * s, y * s]), rx.map(([x, y]) => [x * s, y * s]), el.merge.checked);
  const w = weights(va, el.win.value);
  const az0 = +el.az0.value, e0 = +el.el0.value;
  const [u0, v0] = dirCos(az0, e0);
  const resR = C / (2 * B);
  const drMax = 8 * resR;
  const dr = Float64Array.from({ length: 161 }, (_, i) => -drMax + (2 * drMax * i) / 160);
  ctx = { u0, v0, az0, el0: e0, resR, drMax };
  el.msg.textContent = tr('Computing…', '计算中…');
  worker.postMessage({ id: ++jobId, el: w, u0, v0, az0, el0: e0, n: N, angles, B, rangeWin: el.win.value, dr });
  // aperture numbers now
  const xs = va.map((p) => p.x), ys = va.map((p) => p.y);
  const ap = [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  stats.base = {
    [tr('Virtual elements', '虚拟单元')]: `${va.length}${el.merge.checked ? tr(' unique', ' 个不重复') : ''} (${tx.length} × ${rx.length})`,
    [tr('Aperture', '孔径')]: `${ap[0].toFixed(1)} λ × ${ap[1].toFixed(1)} λ`,
    [tr('Wavelength', '波长')]: `${((C / (f0 * 1e9)) * 1e3).toFixed(2)} mm`,
    [tr('Range resolution', '距离分辨率')]: `${(resR * 100).toFixed(2)} cm`,
  };
}

const stats: { base: Record<string, string>; beam: Record<string, string> } = { base: {}, beam: {} };
function showStats(warn = '') {
  el.stats.replaceChildren(...Object.entries({ ...stats.base, ...stats.beam }).map(([k, v]) => {
    const d = document.createElement('div'); const b = document.createElement('b'); b.textContent = v; d.append(b, k); return d;
  }));
  el.msg.textContent = warn;
}

worker.onmessage = (e) => {
  const { id, map, azCut, elCut, rng } = e.data as { id: number; map: Float32Array; azCut: Float64Array; elCut: Float64Array; rng: Float64Array };
  if (id !== jobId || !ctx) return;
  const iAz = Math.round((ctx.az0 + 90) / 0.25), iEl = Math.round((ctx.el0 + 90) / 0.25);
  const a = lobeStats(angles, azCut, iAz), b = lobeStats(angles, elCut, iEl);
  const flatEl = elCut.every((v) => Math.abs(v - elCut[0]) < 1e-6);
  stats.beam = {
    [tr('Azimuth beamwidth (−3 dB)', '方位波束宽度（−3 dB）')]: `${a.width.toFixed(2)}°`,
    [tr('Azimuth peak sidelobe', '方位最高旁瓣')]: Number.isFinite(a.psl) ? `${a.psl.toFixed(1)} dB` : tr('none', '无'),
    [tr('Elevation beamwidth (−3 dB)', '俯仰波束宽度（−3 dB）')]: flatEl ? tr('no elevation aperture', '俯仰方向没有孔径') : `${b.width.toFixed(2)}°`,
    [tr('Elevation peak sidelobe', '俯仰最高旁瓣')]: flatEl ? '—' : Number.isFinite(b.psl) ? `${b.psl.toFixed(1)} dB` : tr('none', '无'),
  };
  // grating lobes: strong peaks elsewhere in the visible region
  const gl = gratingLobes(map, N, ctx.u0, ctx.v0);
  showStats(gl.length ? tr(`Grating lobes: ${gl.length} other peak${gl.length > 1 ? 's' : ''} within 3 dB of the main beam (spacing wider than λ/2?).`, `栅瓣：还有 ${gl.length} 个峰和主瓣相差不到 3 dB（间距是不是大于 λ/2 了？）`) : '');
  drawMap(map); drawCuts(azCut, elCut, flatEl); drawRA(azCut, rng);
};

// ---------- drawing ----------
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag: string, attrs: Record<string, string | number>, parent?: Element) => {
  const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v)); parent?.appendChild(n); return n;
};

// layout editor: physical Tx, Rx and the virtual array, in the entered unit
let view = { x0: 0, y0: 0, s: 1, W: 600, H: 300 };
function drawLayout() {
  const svg = el.layout; svg.replaceChildren();
  const s = toLambda(); // to wavelengths
  const va = tx.length && rx.length ? virtualArray(tx, rx, true) : [];
  const pts = [...tx, ...rx, ...va.map((v) => [v.x, v.y] as Pt)];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const pad = 2;
  const x0 = (xs.length ? Math.min(...xs) : 0) - pad, x1 = (xs.length ? Math.max(...xs) : 8) + pad;
  const y0 = (ys.length ? Math.min(...ys) : 0) - pad, y1 = (ys.length ? Math.max(...ys) : 4) + pad;
  const W = 600, H = Math.max(160, Math.min(420, (W * (y1 - y0)) / (x1 - x0)));
  const sc = Math.min(W / (x1 - x0), H / (y1 - y0));
  view = { x0, y0: y1, s: sc, W, H };
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const ink = css('--ink'), pencil = css('--pencil');
  const X = (x: number) => (x - x0) * sc, Y = (y: number) => (y1 - y) * sc;
  // grid every unit (every λ/2 by default)
  const step = el.unit.value === 'mm' ? Math.pow(10, Math.floor(Math.log10((x1 - x0) / 4))) : 1;
  for (let gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) mk('line', { x1: X(gx), y1: 0, x2: X(gx), y2: H, stroke: pencil, 'stroke-opacity': 0.25, 'stroke-width': 0.6 }, svg);
  for (let gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) mk('line', { x1: 0, y1: Y(gy), x2: W, y2: Y(gy), stroke: pencil, 'stroke-opacity': 0.25, 'stroke-width': 0.6 }, svg);
  const r = Math.max(2.5, Math.min(7, sc * 0.28));
  for (const v of va) mk('circle', { cx: X(v.x), cy: Y(v.y), r: r * 0.7, fill: pencil, 'fill-opacity': 0.55 }, svg);
  for (const p of rx) mk('circle', { cx: X(p[0]), cy: Y(p[1]), r, fill: 'none', stroke: ink, 'stroke-width': 1.6 }, svg);
  for (const p of tx) {
    const cx = X(p[0]), cy = Y(p[1]);
    mk('polygon', { points: `${cx},${cy - r * 1.3} ${cx - r * 1.2},${cy + r} ${cx + r * 1.2},${cy + r}`, fill: ink }, svg);
  }
  void s;
}

el.layout.addEventListener('click', (e) => {
  const mode = el.click.value; if (mode === 'none') return;
  const pt = el.layout.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  const m = el.layout.getScreenCTM(); if (!m) return;
  const p = pt.matrixTransform(m.inverse());
  const snap = el.unit.value === 'mm' ? 0.1 : 0.5;
  const x = Math.round((p.x / view.s + view.x0) / snap) * snap, y = Math.round((view.y0 - p.y / view.s) / snap) * snap;
  if (mode === 'remove') {
    const d = (q: Pt) => Math.hypot(q[0] - x, q[1] - y);
    const all = [...tx.map((q, i) => ({ k: 'tx', i, d: d(q) })), ...rx.map((q, i) => ({ k: 'rx', i, d: d(q) }))].sort((a, b) => a.d - b.d);
    if (!all.length || all[0].d > 1.5) return;
    (all[0].k === 'tx' ? tx : rx).splice(all[0].i, 1);
  } else (mode === 'tx' ? tx : rx).push([x, y]);
  el.tx.value = fmt(tx); el.rx.value = fmt(rx); el.preset.value = 'custom'; update();
});

/** grey ramp from paper (weak) to ink (strong) */
function ramp(): (t: number) => [number, number, number] {
  const p = hex(css('--paper')), k = hex(css('--ink'));
  return (t) => [p[0] + (k[0] - p[0]) * t, p[1] + (k[1] - p[1]) * t, p[2] + (k[2] - p[2]) * t];
}
function hex(c: string): [number, number, number] {
  if (c.startsWith('#')) { const n = parseInt(c.length === 4 ? c.slice(1).split('').map((h) => h + h).join('') : c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  const m = c.match(/\d+/g)!.map(Number); return [m[0], m[1], m[2]];
}

let lastMap: Float32Array | null = null, lastCuts: [Float64Array, Float64Array, boolean] | null = null, lastRA: [Float64Array, Float64Array] | null = null;
function drawMap(map: Float32Array) {
  lastMap = map;
  const cv = el.uv; cv.width = N; cv.height = N;
  const g = cv.getContext('2d')!; const id = g.createImageData(N, N); const f = ramp(); const dyn = +el.dyn.value;
  for (let i = 0; i < N * N; i++) {
    const z = map[i];
    if (Number.isNaN(z)) { id.data[i * 4 + 3] = 0; continue; }
    const [r, gg, b] = f(Math.max(0, Math.min(1, 1 + z / dyn)));
    id.data[i * 4] = r; id.data[i * 4 + 1] = gg; id.data[i * 4 + 2] = b; id.data[i * 4 + 3] = 255;
  }
  g.putImageData(id, 0, 0);
}

function drawCuts(azCut: Float64Array, elCut: Float64Array, flatEl: boolean) {
  lastCuts = [azCut, elCut, flatEl];
  const svg = el.cuts; svg.replaceChildren();
  const W = 640, H = 280, L = 44, R = 10, T = 10, Bm = 54, dyn = +el.dyn.value;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const ink = css('--ink'), pencil = css('--pencil');
  const X = (a: number) => L + ((a + 90) / 180) * (W - L - R);
  const Y = (z: number) => T + (Math.min(0, Math.max(-dyn, z)) / -dyn) * (H - T - Bm);
  for (let a = -90; a <= 90; a += 30) {
    mk('line', { x1: X(a), y1: T, x2: X(a), y2: H - Bm, stroke: pencil, 'stroke-opacity': 0.3 }, svg);
    mk('text', { x: X(a), y: H - Bm + 16, 'text-anchor': 'middle', 'font-size': 13, fill: pencil }, svg).textContent = `${a}°`;
  }
  for (let z = 0; z >= -dyn; z -= 10) {
    mk('line', { x1: L, y1: Y(z), x2: W - R, y2: Y(z), stroke: pencil, 'stroke-opacity': 0.3 }, svg);
    mk('text', { x: L - 6, y: Y(z) + 4, 'text-anchor': 'end', 'font-size': 13, fill: pencil }, svg).textContent = `${z}`;
  }
  mk('text', { x: L, y: H - 4, 'font-size': 13, fill: pencil }, svg).textContent = tr('angle · dB', '角度 · dB');
  const line = (y: Float64Array, attrs: Record<string, string | number>) => {
    let d = ''; for (let i = 0; i < angles.length; i++) d += `${i ? 'L' : 'M'}${X(angles[i]).toFixed(1)} ${Y(y[i]).toFixed(1)}`;
    mk('path', { d, fill: 'none', stroke: ink, 'stroke-width': 1.6, ...attrs }, svg);
  };
  line(azCut, {});
  if (!flatEl) line(elCut, { 'stroke-dasharray': '5 4', 'stroke-width': 1.3 });
  const lg = mk('g', { 'font-size': 14, fill: ink }, svg);
  mk('line', { x1: W - 330, y1: H - 9, x2: W - 300, y2: H - 9, stroke: ink, 'stroke-width': 1.6 }, lg);
  mk('text', { x: W - 294, y: H - 5 }, lg).textContent = tr('azimuth cut', '方位切面');
  if (!flatEl) {
    mk('line', { x1: W - 180, y1: H - 9, x2: W - 150, y2: H - 9, stroke: ink, 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, lg);
    mk('text', { x: W - 144, y: H - 5 }, lg).textContent = tr('elevation cut', '俯仰切面');
  }
}

/** Far-field range-azimuth PSF: range profile (dB) + azimuth cut (dB), i.e. their product in linear scale. */
function drawRA(azCut: Float64Array, rng: Float64Array) {
  lastRA = [azCut, rng];
  const W = 361, H = rng.length; const cv = el.ra; cv.width = W; cv.height = H;
  const g = cv.getContext('2d')!; const id = g.createImageData(W, H); const f = ramp(); const dyn = +el.dyn.value;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const z = rng[H - 1 - j] + azCut[i * 2];
    const [r, gg, b] = f(Math.max(0, Math.min(1, 1 + z / dyn)));
    const k = (j * W + i) * 4; id.data[k] = r; id.data[k + 1] = gg; id.data[k + 2] = b; id.data[k + 3] = 255;
  }
  g.putImageData(id, 0, 0);
  const lab = document.getElementById('ralabel');
  if (lab && ctx) lab.textContent = tr(`Range ±${(ctx.drMax * 100).toFixed(1)} cm (8 resolution cells) around the target, azimuth −90° to 90°.`, `距离为目标前后 ±${(ctx.drMax * 100).toFixed(1)} cm（8 个分辨单元），方位从 −90° 到 90°。`);
}

// ---------- wiring ----------
let t: number | undefined;
const later = () => { clearTimeout(t); t = window.setTimeout(update, 150); };
el.preset.addEventListener('change', () => { applyPreset(el.preset.value); update(); });
[el.tx, el.rx].forEach((a) => a.addEventListener('input', () => { el.preset.value = 'custom'; later(); }));
[el.f0, el.bw, el.win, el.merge, el.az0, el.el0, el.unit].forEach((i) => i.addEventListener('input', () => {
  for (const id of ['az0', 'el0']) { const v = document.querySelector(`[data-val="${id}"]`); if (v) v.textContent = `${(el as any)[id].value}°`; }
  later();
}));
el.dyn.addEventListener('input', () => {
  const v = document.querySelector('[data-val="dyn"]'); if (v) v.textContent = `${el.dyn.value} dB`;
  if (lastMap) drawMap(lastMap); if (lastCuts) drawCuts(...lastCuts); if (lastRA) drawRA(...lastRA);
});
document.addEventListener('sketch:redraw', () => { drawLayout(); if (lastMap) drawMap(lastMap); if (lastCuts) drawCuts(...lastCuts); if (lastRA) drawRA(...lastRA); });

el.preset.value = 'cascade'; applyPreset('cascade'); update();
