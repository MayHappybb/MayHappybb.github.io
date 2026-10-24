// Far-field point-spread function of a MIMO radar, by direct summation (no FFT, any geometry).
// Positions are in wavelengths. Direction cosines: u = cos(el)·sin(az), v = sin(el).
// The virtual element of a Tx/Rx pair sits at tx + rx (one-way phase of the round trip, far field).

export interface Elem { x: number; y: number; w: number }
export type Pt = [number, number];

export const WINDOWS: Record<string, (t: number) => number> = {
  // t in [0, 1] across the aperture
  none: () => 1,
  hann: (t) => 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
  hamming: (t) => 0.54 - 0.46 * Math.cos(2 * Math.PI * t),
  blackman: (t) => 0.42 - 0.5 * Math.cos(2 * Math.PI * t) + 0.08 * Math.cos(4 * Math.PI * t),
};

/** Virtual array from Tx and Rx positions (same unit), optionally merging duplicates. */
export function virtualArray(tx: Pt[], rx: Pt[], merge: boolean): { x: number; y: number; n: number }[] {
  const out = new Map<string, { x: number; y: number; n: number }>();
  const list: { x: number; y: number; n: number }[] = [];
  for (const t of tx) for (const r of rx) {
    const x = t[0] + r[0], y = t[1] + r[1];
    if (!merge) { list.push({ x, y, n: 1 }); continue; }
    const key = `${Math.round(x * 1e6)},${Math.round(y * 1e6)}`;
    const e = out.get(key); if (e) e.n++; else out.set(key, { x, y, n: 1 });
  }
  return merge ? [...out.values()] : list;
}

/** Separable taper over the aperture extent in x and y. Weights are normalised so the peak gain is 1. */
export function weights(v: { x: number; y: number; n: number }[], win: string): Elem[] {
  const f = WINDOWS[win] ?? WINDOWS.none;
  const xs = v.map((e) => e.x), ys = v.map((e) => e.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  // map to (0,1) with half a cell of margin, so edge elements are not zeroed by Hann
  const tx = (x: number) => (x1 === x0 ? 0.5 : (x - x0 + 0.5) / (x1 - x0 + 1));
  const ty = (y: number) => (y1 === y0 ? 0.5 : (y - y0 + 0.5) / (y1 - y0 + 1));
  const e = v.map((p) => ({ x: p.x, y: p.y, w: f(tx(p.x)) * f(ty(p.y)) }));
  const s = e.reduce((a, b) => a + b.w, 0) || 1;
  return e.map((p) => ({ ...p, w: p.w / s }));
}

/** |AF| at direction cosines (u, v), steered to (u0, v0), elements in wavelengths. */
export function af(el: Elem[], u: number, v: number, u0: number, v0: number): number {
  const a = 2 * Math.PI * (u - u0), b = 2 * Math.PI * (v - v0);
  let re = 0, im = 0;
  for (const e of el) { const p = a * e.x + b * e.y; re += e.w * Math.cos(p); im += e.w * Math.sin(p); }
  return Math.hypot(re, im);
}

export const db = (x: number) => 20 * Math.log10(Math.max(x, 1e-12));
export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
export const dirCos = (azDeg: number, elDeg: number): Pt => [Math.cos(rad(elDeg)) * Math.sin(rad(azDeg)), Math.sin(rad(elDeg))];

/** u-v map over the visible disk, n×n samples on [-1, 1]². NaN outside the disk. */
export function uvMap(el: Elem[], u0: number, v0: number, n: number): Float32Array {
  const out = new Float32Array(n * n);
  // separate the phase into per-row and per-column factors: exp(j(a x)) · exp(j(b y))
  const N = el.length;
  const cx = new Float64Array(N * n), sx = new Float64Array(N * n), cy = new Float64Array(N * n), sy = new Float64Array(N * n);
  for (let i = 0; i < n; i++) {
    const g = -1 + (2 * i) / (n - 1);
    for (let k = 0; k < N; k++) {
      const px = 2 * Math.PI * (g - u0) * el[k].x, py = 2 * Math.PI * (g - v0) * el[k].y;
      cx[i * N + k] = Math.cos(px); sx[i * N + k] = Math.sin(px);
      cy[i * N + k] = Math.cos(py); sy[i * N + k] = Math.sin(py);
    }
  }
  for (let j = 0; j < n; j++) {
    const v = 1 - (2 * j) / (n - 1); // top row = up
    const jj = n - 1 - j;
    for (let i = 0; i < n; i++) {
      const u = -1 + (2 * i) / (n - 1);
      if (u * u + v * v > 1) { out[j * n + i] = NaN; continue; }
      let re = 0, im = 0;
      for (let k = 0; k < N; k++) {
        const a = cx[i * N + k], b = sx[i * N + k], c = cy[jj * N + k], d = sy[jj * N + k];
        const w = el[k].w;
        re += w * (a * c - b * d); im += w * (a * d + b * c);
      }
      out[j * n + i] = db(Math.hypot(re, im));
    }
  }
  return out;
}

/** Cut through azimuth at fixed elevation (or elevation at fixed azimuth), dB, angles in degrees. */
export function cut(el: Elem[], u0: number, v0: number, kind: 'az' | 'el', fixedDeg: number, angles: Float64Array): Float64Array {
  const out = new Float64Array(angles.length);
  for (let i = 0; i < angles.length; i++) {
    const [u, v] = kind === 'az' ? dirCos(angles[i], fixedDeg) : dirCos(fixedDeg, angles[i]);
    out[i] = db(af(el, u, v, u0, v0));
  }
  return out;
}

/** Range profile of a point target for an FMCW sweep of bandwidth B (Hz), K samples, window win. dr in metres. */
export function rangeProfile(B: number, win: string, dr: Float64Array, K = 128): Float64Array {
  const c = 299_792_458;
  const f = WINDOWS[win] ?? WINDOWS.none;
  const w = Array.from({ length: K }, (_, k) => f((k + 0.5) / K));
  const s = w.reduce((a, b) => a + b, 0);
  return dr.map((r) => {
    let re = 0, im = 0;
    for (let k = 0; k < K; k++) { const ph = (4 * Math.PI * ((k / (K - 1) - 0.5) * B) * r) / c; re += w[k] * Math.cos(ph); im += w[k] * Math.sin(ph); }
    return db(Math.hypot(re, im) / s);
  });
}

/** -3 dB width, first-null bounds and peak sidelobe of a cut around its main lobe near index i0. */
export function lobeStats(a: Float64Array, y: Float64Array, i0: number) {
  // climb to the local peak
  let p = Math.max(0, Math.min(y.length - 1, i0));
  while (p > 0 && y[p - 1] > y[p]) p--;
  while (p < y.length - 1 && y[p + 1] > y[p]) p++;
  const top = y[p];
  const cross = (dir: number) => {
    let i = p; while (i + dir >= 0 && i + dir < y.length && y[i + dir] > top - 3) i += dir;
    if (i + dir < 0 || i + dir >= y.length) return a[i];
    const y1 = y[i], y2 = y[i + dir]; const t = (y1 - (top - 3)) / (y1 - y2);
    return a[i] + t * (a[i + dir] - a[i]);
  };
  const nul = (dir: number) => { let i = p; while (i + dir >= 0 && i + dir < y.length && y[i + dir] <= y[i]) i += dir; return i; };
  const l = nul(-1), r = nul(1);
  let psl = -Infinity;
  for (let i = 0; i < y.length; i++) if (i < l || i > r) psl = Math.max(psl, y[i]);
  return { peakAt: a[p], width: Math.abs(cross(1) - cross(-1)), psl: psl - top, nullL: a[l], nullR: a[r] };
}

/**
 * Grating lobes: regions of the u-v map above `floor` dB (relative to 0 dB peak gain) that are not
 * connected to the main beam at (u0, v0). Returns the strongest point of each such region.
 * (Local maxima would not do: a line array's main lobe is a ridge with many equal maxima.)
 */
export function gratingLobes(map: Float32Array, n: number, u0: number, v0: number, floor = -3): Pt[] {
  const label = new Int32Array(n * n).fill(-1);
  const toUV = (k: number): Pt => [-1 + (2 * (k % n)) / (n - 1), 1 - (2 * Math.floor(k / n)) / (n - 1)];
  // cells within 1.5 grid steps of the steering direction belong to the main beam
  const near = (k: number) => { const [u, v] = toUV(k); return Math.hypot(u - u0, v - v0) <= (1.5 * 2) / (n - 1); };
  const out: Pt[] = [];
  let id = 0;
  for (let k0 = 0; k0 < n * n; k0++) {
    if (label[k0] !== -1 || !(map[k0] > floor)) continue;
    const stack = [k0]; label[k0] = id; let best = k0, hasMain = false;
    while (stack.length) {
      const k = stack.pop()!; if (!hasMain && near(k)) hasMain = true;
      if (map[k] > map[best]) best = k;
      const i = k % n, j = (k - i) / n;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue;
        const q = jj * n + ii; if (label[q] === -1 && map[q] > floor) { label[q] = id; stack.push(q); }
      }
    }
    if (!hasMain) out.push(toUV(best));
    id++;
  }
  return out;
}
