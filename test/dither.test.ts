import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bayer, voidAndCluster, diffuse, ordered, KERNELS } from '../src/scripts/tools/dither-core.ts';

const isPerm = (a: Uint16Array) => [...a].sort((x, y) => x - y).every((v, i) => v === i);

test('bayer 2 is the textbook matrix', () => assert.deepEqual([...bayer(2)], [0, 2, 3, 1]));
test('bayer 16 is a permutation', () => assert.ok(isPerm(bayer(16))));
test('void-and-cluster 32 is a permutation', () => assert.ok(isPerm(voidAndCluster(32, 3))));

const flat = (g: number, n = 64) => new Float32Array(n * n).fill(g);
const ink = (m: Uint8Array) => m.reduce((s, v) => s + v, 0) / m.length;

for (const name of Object.keys(KERNELS)) {
  if (name === 'atkinson') continue; // Atkinson loses 1/4 of the error by design
  test(`${name} keeps a 30 % grey at ~70 % ink`, () => assert.ok(Math.abs(ink(diffuse(flat(0.3), 64, 64, KERNELS[name])) - 0.7) < 0.03));
}
test('bayer 8 keeps a 25 % grey at 75 % ink', () => assert.ok(Math.abs(ink(ordered(flat(0.25), 64, 64, bayer(8), 8)) - 0.75) < 0.02));
test('blue noise keeps a 60 % grey at 40 % ink', () => {
  const r = voidAndCluster(32, 1); assert.ok(Math.abs(ink(ordered(flat(0.6), 64, 64, r, 32)) - 0.4) < 0.02);
});
