// Minimal types for gifenc 1.0.3 (the package ships none).
declare module 'gifenc' {
  type Palette = number[][];
  export function GIFEncoder(): {
    writeFrame(index: Uint8Array, width: number, height: number, opts?: { palette?: Palette; delay?: number; repeat?: number; transparent?: boolean }): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
  };
  export function quantize(rgba: Uint8ClampedArray | Uint8Array, maxColors: number, opts?: object): Palette;
  export function applyPalette(rgba: Uint8ClampedArray | Uint8Array, palette: Palette, format?: string): Uint8Array;
}
