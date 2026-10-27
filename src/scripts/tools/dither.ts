// Dithering studio: picture in, 1-bit pixels / dots / symbols out, as PNG or SVG. Runs entirely in the browser.
import { KERNELS, diffuse, bayer, ordered, voidAndCluster, threshold } from './dither-core';
// the page's language decides the words (Chinese pages live under /zh/)
const ZH = document.documentElement.lang.startsWith('zh');
const tr = (en: string, zh: string) => (ZH ? zh : en);


const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const els = {
  file: $<HTMLInputElement>('file'), drop: $('drop'), algo: $<HTMLSelectElement>('algo'), mode: $<HTMLSelectElement>('mode'),
  width: $<HTMLInputElement>('width'), bright: $<HTMLInputElement>('bright'), contrast: $<HTMLInputElement>('contrast'),
  gamma: $<HTMLInputElement>('gamma'), thresh: $<HTMLInputElement>('thresh'), invert: $<HTMLInputElement>('invert'),
  serp: $<HTMLInputElement>('serp'), ink: $<HTMLInputElement>('ink'), paper: $<HTMLInputElement>('paper'),
  cell: $<HTMLInputElement>('cell'), chars: $<HTMLInputElement>('chars'), scale: $<HTMLInputElement>('scale'),
  canvas: $<HTMLCanvasElement>('out'), status: $('status'), png: $<HTMLButtonElement>('png'), svg: $<HTMLButtonElement>('svg'),
  orig: $<HTMLInputElement>('orig'), original: $<HTMLImageElement>('original'),
  modeOpts: document.querySelectorAll<HTMLElement>('[data-for-mode]'),
};

let img: HTMLImageElement | null = null;
let blue: Uint16Array | null = null;
let last: { mask: Uint8Array; grey: Float32Array; w: number; h: number } | null = null;

function loadImage(src: string) {
  const im = new Image();
  im.onload = () => { img = im; els.original.src = src; schedule(); };
  im.onerror = () => { els.status.textContent = tr("That file couldn't be read as an image. Try a JPEG, PNG or WebP.", '这个文件读不出图片。试试 JPEG、PNG 或 WebP。'); };
  im.src = src;
}

/** Grey levels 0..1 at the working size, after brightness, contrast and gamma. */
function greyAt(w: number, h: number): Float32Array {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // transparent areas become paper
  ctx.drawImage(img!, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const b = +els.bright.value, k = +els.contrast.value, gm = +els.gamma.value, inv = els.invert.checked;
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    // Rec. 709 luma on sRGB values
    let v = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    if (inv) v = 1 - v;
    v = (v - 0.5) * k + 0.5 + b;
    v = Math.min(1, Math.max(0, v));
    g[i] = Math.pow(v, gm);
  }
  return g;
}

function mask(grey: Float32Array, w: number, h: number): Uint8Array {
  const a = els.algo.value, t = +els.thresh.value;
  if (a in KERNELS) return diffuse(grey, w, h, KERNELS[a], t, els.serp.checked);
  if (a.startsWith('bayer')) { const n = +a.slice(5); return ordered(grey, w, h, bayer(n), n, t); }
  if (a === 'blue') { blue ??= voidAndCluster(64, 7); return ordered(grey, w, h, blue, 64, t); }
  return threshold(grey, t);
}

function render() {
  if (!img) return;
  const mode = els.mode.value;
  const W = Math.max(8, Math.min(1600, Math.round(+els.width.value)));
  const aspect = img.naturalHeight / img.naturalWidth;
  const ink = els.ink.value, paper = els.paper.value;
  const cv = els.canvas, ctx = cv.getContext('2d')!;
  const t0 = performance.now();

  if (mode === 'pixels') {
    const w = W, h = Math.max(1, Math.round(W * aspect));
    const grey = greyAt(w, h), m = mask(grey, w, h);
    last = { mask: m, grey, w, h };
    cv.width = w; cv.height = h; cv.classList.add('pixelated');
    const id = ctx.createImageData(w, h);
    const [ir, ig, ib] = hex(ink), [pr, pg, pb] = hex(paper);
    for (let i = 0; i < w * h; i++) {
      const on = m[i]; id.data[i * 4] = on ? ir : pr; id.data[i * 4 + 1] = on ? ig : pg; id.data[i * 4 + 2] = on ? ib : pb; id.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(id, 0, 0);
    cv.style.width = `min(100%, ${Math.max(w, Math.min(w * 4, 900))}px)`;
  } else {
    // dots and symbols: one cell per sample, cell size in output pixels
    const cell = +els.cell.value;
    const w = Math.max(4, Math.round(W / cell)), h = Math.max(1, Math.round((W * aspect) / cell));
    const grey = greyAt(w, h);
    last = { mask: new Uint8Array(0), grey, w, h };
    cv.width = w * cell; cv.height = h * cell; cv.classList.remove('pixelated');
    cv.style.width = `min(100%, ${cv.width}px)`;
    ctx.fillStyle = paper; ctx.fillRect(0, 0, cv.width, cv.height); ctx.fillStyle = ink;
    if (mode === 'dots') {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const r = dotRadius(grey[y * w + x], cell); if (r <= 0.15) continue;
        ctx.beginPath(); ctx.arc((x + 0.5) * cell, (y + 0.5) * cell, r, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      const chars = symbolSet();
      ctx.font = `${cell * 1.15}px ui-monospace, Menlo, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const ch = chars[symbolIndex(grey[y * w + x], chars.length)];
        if (ch !== ' ') ctx.fillText(ch, (x + 0.5) * cell, (y + 0.55) * cell);
      }
    }
  }
  const ms = Math.round(performance.now() - t0);
  els.status.textContent = `${cv.width} × ${cv.height} px · ${ms} ms`;
  els.png.disabled = els.svg.disabled = false;
}

/** Dot area proportional to darkness; at full black the dot covers the whole cell (radius = cell/√2). */
const dotRadius = (g: number, cell: number) => Math.sqrt(1 - g) * (cell / Math.SQRT2) * 0.98;
const symbolSet = () => [...(els.chars.value || ' .:-=+*#%@')];
/** chars are listed light → dark */
const symbolIndex = (g: number, n: number) => Math.min(n - 1, Math.floor((1 - g) * n));

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function svgString(): string {
  if (!last) return '';
  const { w, h, mask: m, grey } = last;
  const ink = els.ink.value, paper = els.paper.value, mode = els.mode.value;
  const parts: string[] = [];
  let W: number, H: number;
  if (mode === 'pixels') {
    W = w; H = h;
    // one path, a run of ink pixels per subpath
    let d = '';
    for (let y = 0; y < h; y++) {
      let x = 0;
      while (x < w) {
        if (!m[y * w + x]) { x++; continue; }
        const x0 = x; while (x < w && m[y * w + x]) x++;
        d += `M${x0} ${y}h${x - x0}v1h${x0 - x}z`;
      }
    }
    parts.push(`<path fill="${ink}" d="${d}"/>`);
  } else {
    const cell = +els.cell.value; W = w * cell; H = h * cell;
    if (mode === 'dots') {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const r = dotRadius(grey[y * w + x], cell); if (r <= 0.15) continue;
        parts.push(`<circle cx="${((x + 0.5) * cell).toFixed(2)}" cy="${((y + 0.5) * cell).toFixed(2)}" r="${r.toFixed(2)}"/>`);
      }
      parts.unshift(`<g fill="${ink}">`); parts.push('</g>');
    } else {
      const chars = symbolSet();
      parts.push(`<g fill="${ink}" font-family="ui-monospace, Menlo, monospace" font-size="${(cell * 1.15).toFixed(2)}" text-anchor="middle" dominant-baseline="middle">`);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const ch = chars[symbolIndex(grey[y * w + x], chars.length)]; if (ch === ' ') continue;
        const esc = ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        parts.push(`<text x="${((x + 0.5) * cell).toFixed(1)}" y="${((y + 0.55) * cell).toFixed(1)}">${esc}</text>`);
      }
      parts.push('</g>');
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">` +
    `<rect width="100%" height="100%" fill="${paper}"/>${parts.join('')}</svg>`;
}

function download(name: string, blob: Blob) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

els.png.addEventListener('click', () => {
  const s = Math.max(1, Math.round(+els.scale.value));
  const src = els.canvas;
  const c = document.createElement('canvas'); c.width = src.width * s; c.height = src.height * s;
  const ctx = c.getContext('2d')!; ctx.imageSmoothingEnabled = false; ctx.drawImage(src, 0, 0, c.width, c.height);
  c.toBlob((b) => b && download(`dither-${els.algo.value}.png`, b), 'image/png');
});
els.svg.addEventListener('click', () => download(`dither-${els.mode.value}.svg`, new Blob([svgString()], { type: 'image/svg+xml' })));

// controls
let pending = 0;
function schedule() { cancelAnimationFrame(pending); pending = requestAnimationFrame(render); }
function syncLabels() {
  document.querySelectorAll<HTMLInputElement>('input[type=range]').forEach((r) => {
    const v = document.querySelector(`[data-val="${r.id}"]`); if (v) v.textContent = r.value;
  });
  const mode = els.mode.value;
  els.modeOpts.forEach((el) => { el.hidden = !el.dataset.forMode!.split(' ').includes(mode); });
  els.original.hidden = !els.orig.checked;
}
document.querySelectorAll('#controls input, #controls select').forEach((el) =>
  el.addEventListener('input', () => { syncLabels(); schedule(); }));
els.file.addEventListener('change', () => { const f = els.file.files?.[0]; if (f) loadImage(URL.createObjectURL(f)); });
['dragenter', 'dragover'].forEach((ev) => els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => els.drop.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.remove('over'); }));
els.drop.addEventListener('drop', (e) => { const f = (e as DragEvent).dataTransfer?.files?.[0]; if (f) loadImage(URL.createObjectURL(f)); });
addEventListener('paste', (e) => {
  const f = [...(e.clipboardData?.files ?? [])].find((x) => x.type.startsWith('image/')); if (f) loadImage(URL.createObjectURL(f));
});

syncLabels();
loadImage(els.drop.dataset.sample!);
