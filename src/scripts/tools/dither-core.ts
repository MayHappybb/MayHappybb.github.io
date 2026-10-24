// Dithering algorithms on a grey image (Float32Array, 0 = black, 1 = white).
// Output is a Uint8Array mask: 1 = ink, 0 = paper.

export type Kernel = { div: number; taps: [dx: number, dy: number, w: number][] };

export const KERNELS: Record<string, Kernel> = {
  'floyd-steinberg': { div: 16, taps: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]] },
  atkinson: { div: 8, taps: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]] }, // passes on 6/8 only
  'jarvis-judice-ninke': {
    div: 48,
    taps: [[1, 0, 7], [2, 0, 5], [-2, 1, 3], [-1, 1, 5], [0, 1, 7], [1, 1, 5], [2, 1, 3], [-2, 2, 1], [-1, 2, 3], [0, 2, 5], [1, 2, 3], [2, 2, 1]],
  },
  stucki: {
    div: 42,
    taps: [[1, 0, 8], [2, 0, 4], [-2, 1, 2], [-1, 1, 4], [0, 1, 8], [1, 1, 4], [2, 1, 2], [-2, 2, 1], [-1, 2, 2], [0, 2, 4], [1, 2, 2], [2, 2, 1]],
  },
  burkes: { div: 32, taps: [[1, 0, 8], [2, 0, 4], [-2, 1, 2], [-1, 1, 4], [0, 1, 8], [1, 1, 4], [2, 1, 2]] },
  sierra: {
    div: 32,
    taps: [[1, 0, 5], [2, 0, 3], [-2, 1, 2], [-1, 1, 4], [0, 1, 5], [1, 1, 4], [2, 1, 2], [-1, 2, 2], [0, 2, 3], [1, 2, 2]],
  },
  'sierra-lite': { div: 4, taps: [[1, 0, 2], [-1, 1, 1], [0, 1, 1]] },
};

/** Error diffusion. Serpentine scanning mirrors the kernel on odd rows to avoid worm artefacts. */
export function diffuse(grey: Float32Array, w: number, h: number, k: Kernel, threshold = 0.5, serpentine = true): Uint8Array {
  const buf = Float32Array.from(grey);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const rev = serpentine && y % 2 === 1;
    for (let i = 0; i < w; i++) {
      const x = rev ? w - 1 - i : i;
      const idx = y * w + x;
      const old = buf[idx];
      const nv = old < threshold ? 0 : 1;
      out[idx] = nv ? 0 : 1;
      const err = (old - nv) / k.div;
      for (const [dx0, dy, wt] of k.taps) {
        const dx = rev ? -dx0 : dx0;
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || xx >= w || yy >= h) continue;
        buf[yy * w + xx] += err * wt;
      }
    }
  }
  return out;
}

/** Bayer index matrix of size n (power of two), values 0..n²-1. */
export function bayer(n: number): Uint16Array {
  let m = new Uint16Array([0]);
  for (let s = 1; s < n; s *= 2) {
    const next = new Uint16Array(4 * s * s);
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      const v = 4 * m[y * s + x];
      next[y * 2 * s + x] = v;
      next[y * 2 * s + x + s] = v + 2;
      next[(y + s) * 2 * s + x] = v + 3;
      next[(y + s) * 2 * s + x + s] = v + 1;
    }
    m = next;
  }
  return m;
}

/** Threshold against a tiled matrix of ranks 0..count-1. bias shifts the overall threshold (0.5 = neutral). */
export function ordered(grey: Float32Array, w: number, h: number, ranks: Uint16Array, size: number, threshold = 0.5): Uint8Array {
  const out = new Uint8Array(w * h);
  const n = size * size;
  const shift = threshold - 0.5;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const t = (ranks[(y % size) * size + (x % size)] + 0.5) / n + shift;
    out[y * w + x] = grey[y * w + x] < t ? 1 : 0;
  }
  return out;
}

/**
 * Blue-noise ranks by Ulichney's void-and-cluster method on a size×size torus.
 * Energy is a Gaussian (sigma 1.5) of the minority pixels, updated incrementally.
 */
export function voidAndCluster(size = 64, seed = 1): Uint16Array {
  const N = size * size;
  const sigma = 1.5;
  const R = Math.ceil(sigma * 4);
  const g: number[] = [];
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) g.push(Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)));
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

  const energy = new Float64Array(N);
  const bits = new Uint8Array(N);
  const splat = (i: number, sign: number) => {
    const x0 = i % size, y0 = (i / size) | 0;
    let k = 0;
    for (let dy = -R; dy <= R; dy++) {
      const yy = (y0 + dy + size) % size;
      for (let dx = -R; dx <= R; dx++, k++) energy[yy * size + ((x0 + dx + size) % size)] += sign * g[k];
    }
  };
  const tightest = () => { let b = -1, v = -Infinity; for (let i = 0; i < N; i++) if (bits[i] && energy[i] > v) { v = energy[i]; b = i; } return b; };
  const largestVoid = () => { let b = -1, v = Infinity; for (let i = 0; i < N; i++) if (!bits[i] && energy[i] < v) { v = energy[i]; b = i; } return b; };

  // initial pattern: ~10 % random ones, then relax until the tightest cluster is the largest void
  const ones = Math.max(1, Math.round(N * 0.1));
  for (let c = 0; c < ones;) { const i = Math.floor(rand() * N); if (!bits[i]) { bits[i] = 1; splat(i, 1); c++; } }
  for (let guard = 0; guard < N * 4; guard++) {
    const t = tightest(); bits[t] = 0; splat(t, -1);
    const v = largestVoid();
    if (v === t) { bits[t] = 1; splat(t, 1); break; }
    bits[v] = 1; splat(v, 1);
  }
  const ranks = new Uint16Array(N);
  const proto = Uint8Array.from(bits);
  const protoEnergy = Float64Array.from(energy);
  // phase 1: remove ones from the prototype, ranks ones-1 .. 0
  for (let r = ones - 1; r >= 0; r--) { const t = tightest(); bits[t] = 0; splat(t, -1); ranks[t] = r; }
  // phase 2 and 3: from the prototype, add zeros into the largest voids, ranks ones .. N-1
  bits.set(proto); energy.set(protoEnergy);
  for (let r = ones; r < N; r++) { const v = largestVoid(); bits[v] = 1; splat(v, 1); ranks[v] = r; }
  return ranks;
}

export function threshold(grey: Float32Array, t = 0.5): Uint8Array {
  const out = new Uint8Array(grey.length);
  for (let i = 0; i < grey.length; i++) out[i] = grey[i] < t ? 1 : 0;
  return out;
}
