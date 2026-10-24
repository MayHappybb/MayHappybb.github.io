import { test } from 'node:test';
import assert from 'node:assert/strict';
import { similarity, warpInto, meanShape, borderPoints, type P } from '../src/scripts/tools/morph-core.ts';

test('similarity maps both anchor points exactly', () => {
  const { f } = similarity([10, 20], [50, 30], [100, 100], [200, 100]);
  const a = f([10, 20]), b = f([50, 30]);
  assert.ok(Math.hypot(a[0] - 100, a[1] - 100) < 1e-9 && Math.hypot(b[0] - 200, b[1] - 100) < 1e-9);
});

test('identity warp reproduces the image and covers every pixel', () => {
  const w = 40, h = 30;
  const data = new Uint8ClampedArray(w * h * 4).map((_, i) => (i * 37) % 251);
  const pts: P[] = [...borderPoints(w, h), [20, 15]];
  // fan triangulation around the centre point (index 8)
  const tri = [0, 1, 8, 1, 2, 8, 2, 3, 8, 3, 4, 8, 4, 5, 8, 5, 6, 8, 6, 7, 8, 7, 0, 8];
  const acc = new Float32Array(w * h * 4);
  warpInto({ w, h, data }, pts, pts, tri, acc, w, h);
  let maxErr = 0; for (let i = 0; i < acc.length; i++) maxErr = Math.max(maxErr, Math.abs(acc[i] - data[i]));
  assert.ok(maxErr < 1e-3, `max error ${maxErr}`);
});

test('mean of two shapes is the midpoint', () => {
  const m = meanShape([[[0, 0], [2, 4]], [[2, 2], [4, 0]]]);
  assert.deepEqual(m, [[1, 1], [3, 2]]);
});
