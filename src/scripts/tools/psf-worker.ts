// Heavy sums for the PSF designer, off the main thread.
import { uvMap, cut, rangeProfile, type Elem } from './psf-core';

export interface Job {
  id: number; el: Elem[]; u0: number; v0: number; az0: number; el0: number; n: number;
  angles: Float64Array; B: number; rangeWin: string; dr: Float64Array;
}

self.onmessage = (e: MessageEvent<Job>) => {
  const j = e.data;
  const map = uvMap(j.el, j.u0, j.v0, j.n);
  const azCut = cut(j.el, j.u0, j.v0, 'az', j.el0, j.angles);
  const elCut = cut(j.el, j.u0, j.v0, 'el', j.az0, j.angles);
  const rng = rangeProfile(j.B, j.rangeWin, j.dr);
  (self as unknown as Worker).postMessage({ id: j.id, map, azCut, elCut, rng }, [map.buffer, azCut.buffer, elCut.buffer, rng.buffer]);
};
