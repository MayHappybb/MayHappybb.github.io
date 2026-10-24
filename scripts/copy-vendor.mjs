// Copy MediaPipe's wasm runtime into public/ so the face tool loads nothing from third parties.
import { cpSync, mkdirSync } from 'node:fs';
const src = 'node_modules/@mediapipe/tasks-vision/wasm';
const dst = 'public/vendor/mediapipe/wasm';
mkdirSync(dst, { recursive: true });
for (const f of ['vision_wasm_internal.js', 'vision_wasm_internal.wasm', 'vision_wasm_nosimd_internal.js', 'vision_wasm_nosimd_internal.wasm']) cpSync(`${src}/${f}`, `${dst}/${f}`);
console.log('copied MediaPipe wasm to', dst);
