import { test } from 'node:test';
import assert from 'node:assert/strict';
import { virtualArray, weights, cut, lobeStats, uvMap, af, gratingLobes, rangeProfile, dirCos, type Pt } from '../src/scripts/tools/psf-core.ts';

const angles = Float64Array.from({ length: 721 }, (_, i) => -90 + i * 0.25);
const line = (n: number, d: number): Pt[] => Array.from({ length: n }, (_, i) => [i * d, 0]);

test('virtual array of TI xWR1843 has 12 elements, 8 in the azimuth row', () => {
  const v = virtualArray([[0, 0], [2, 1], [4, 0]], line(4, 1), true);
  assert.equal(v.length, 12);
  assert.equal(v.filter((e) => e.y === 0).length, 8);
});

test('uniform 8-element λ/2 line: beamwidth ≈ 101.5°/N and PSL ≈ −12.8 dB', () => {
  const el = weights(virtualArray([[0, 0]], line(8, 0.5), true), 'none');
  const s = lobeStats(angles, cut(el, 0, 0, 'az', 0, angles), 360);
  assert.ok(Math.abs(s.width - 12.8) < 0.3, `width ${s.width}`);
  assert.ok(Math.abs(s.psl + 12.8) < 0.3, `psl ${s.psl}`);
});

test('Hann taper lowers sidelobes below −25 dB', () => {
  const el = weights(virtualArray([[0, 0]], line(16, 0.5), true), 'hann');
  const s = lobeStats(angles, cut(el, 0, 0, 'az', 0, angles), 360);
  assert.ok(s.psl < -25, `psl ${s.psl}`);
});

test('peak gain is 0 dB at the steering direction', () => {
  const el = weights(virtualArray([[0, 0], [0, 2]], line(4, 0.5), true), 'hamming');
  const [u0, v0] = dirCos(20, 10);
  assert.ok(Math.abs(af(el, u0, v0, u0, v0) - 1) < 1e-9);
});

test('λ spacing produces grating lobes at u = ±1', () => {
  const el = weights(virtualArray([[0, 0]], line(8, 1), true), 'none');
  const map = uvMap(el, 0, 0, 161);
  const g = gratingLobes(map, 161, 0, 0);
  assert.ok(g.some(([u]) => Math.abs(Math.abs(u) - 1) < 0.05), JSON.stringify(g));
  const ok = weights(virtualArray([[0, 0]], line(8, 0.5), true), 'none');
  assert.equal(gratingLobes(uvMap(ok, 0, 0, 161), 161, 0, 0).length, 0);
});

test('range profile: −3 dB width ≈ 0.886 c/2B for a uniform sweep', () => {
  const B = 4e9, res = 299792458 / (2 * B);
  const dr = Float64Array.from({ length: 2001 }, (_, i) => -2 * res + (4 * res * i) / 2000);
  const s = lobeStats(dr, rangeProfile(B, 'none', dr), 1000);
  assert.ok(Math.abs(s.width / res - 0.886) < 0.02, `${s.width / res}`);
});
