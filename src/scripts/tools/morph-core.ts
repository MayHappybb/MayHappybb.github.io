// Face averaging and morphing by piecewise-affine warping, on raw RGBA buffers (no canvas needed, so it is testable).
export type P = [number, number];
export interface Img { w: number; h: number; data: Uint8ClampedArray | Float32Array }

/** Similarity transform (scale, rotation, translation) that maps a1→b1 and a2→b2. Returns a function and its matrix. */
export function similarity(a1: P, a2: P, b1: P, b2: P) {
  const ax = a2[0] - a1[0], ay = a2[1] - a1[1], bx = b2[0] - b1[0], by = b2[1] - b1[1];
  const d = ax * ax + ay * ay;
  // complex ratio (b2-b1)/(a2-a1) = s·e^{iθ}
  const c = (bx * ax + by * ay) / d, s = (by * ax - bx * ay) / d;
  const tx = b1[0] - (c * a1[0] - s * a1[1]), ty = b1[1] - (s * a1[0] + c * a1[1]);
  return { m: [c, s, -s, c, tx, ty] as const, f: (p: P): P => [c * p[0] - s * p[1] + tx, s * p[0] + c * p[1] + ty] };
}

/** Bilinear sample of an RGBA image at (x, y); writes into out[o..o+3]. Outside the image: clamp to edge. */
function sample(src: Img, x: number, y: number, out: Float32Array, o: number) {
  const { w, h, data } = src;
  x = Math.min(Math.max(x, 0), w - 1); y = Math.min(Math.max(y, 0), h - 1);
  const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0;
  const x1 = Math.min(x0 + 1, w - 1), y1 = Math.min(y0 + 1, h - 1);
  const i00 = (y0 * w + x0) * 4, i10 = (y0 * w + x1) * 4, i01 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4;
  for (let c = 0; c < 4; c++) {
    const top = data[i00 + c] + (data[i10 + c] - data[i00 + c]) * fx;
    const bot = data[i01 + c] + (data[i11 + c] - data[i01 + c]) * fx;
    out[o + c] = top + (bot - top) * fy;
  }
}

/**
 * Warp `src` so that its landmarks `from` move to `to`, triangle by triangle (inverse mapping, so no holes).
 * tri: flat index triples into the point lists. Adds weight·pixel into acc (Float32 RGBA, size w·h·4).
 */
export function warpInto(src: Img, from: P[], to: P[], tri: Uint32Array | number[], acc: Float32Array, w: number, h: number, weight = 1) {
  const px = new Float32Array(4);
  const done = new Uint8Array(w * h); // a pixel on a shared edge is drawn once
  for (let t = 0; t < tri.length; t += 3) {
    const [i, j, k] = [tri[t], tri[t + 1], tri[t + 2]];
    const [x0, y0] = to[i], [x1, y1] = to[j], [x2, y2] = to[k];
    const det = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
    if (Math.abs(det) < 1e-9) continue;
    const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2))), maxX = Math.min(w - 1, Math.ceil(Math.max(x0, x1, x2)));
    const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2))), maxY = Math.min(h - 1, Math.ceil(Math.max(y0, y1, y2)));
    const [u0, v0] = from[i], [u1, v1] = from[j], [u2, v2] = from[k];
    const eps = -1e-6;
    for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
      const p = y * w + x; if (done[p]) continue;
      const cx = x + 0.5, cy = y + 0.5;
      const l0 = ((y1 - y2) * (cx - x2) + (x2 - x1) * (cy - y2)) / det;
      const l1 = ((y2 - y0) * (cx - x2) + (x0 - x2) * (cy - y2)) / det;
      const l2 = 1 - l0 - l1;
      if (l0 < eps || l1 < eps || l2 < eps) continue;
      done[p] = 1;
      sample(src, l0 * u0 + l1 * u1 + l2 * u2 - 0.5, l0 * v0 + l1 * v1 + l2 * v2 - 0.5, px, 0);
      const o = p * 4;
      acc[o] += weight * px[0]; acc[o + 1] += weight * px[1]; acc[o + 2] += weight * px[2]; acc[o + 3] += weight * px[3];
    }
  }
}

export function meanShape(shapes: P[][], weights?: number[]): P[] {
  const n = shapes[0].length, ws = weights ?? shapes.map(() => 1 / shapes.length);
  return Array.from({ length: n }, (_, i) => {
    let x = 0, y = 0; shapes.forEach((s, k) => { x += ws[k] * s[i][0]; y += ws[k] * s[i][1]; }); return [x, y] as P;
  });
}

/** Eight fixed points on the frame border, so the whole picture (hair, neck, background) warps too. */
export const borderPoints = (w: number, h: number): P[] => [[0, 0], [w / 2, 0], [w, 0], [w, h / 2], [w, h], [w / 2, h], [0, h], [0, h / 2]];
