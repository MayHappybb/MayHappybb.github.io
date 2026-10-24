// Build the sketchbook kit into public/kit/v1/ (sketch.js, sketch.css, fonts/).
// The clock gallery and Straight Line load it from https://mayhappybb.github.io/kit/v1/.
// Keep the v1 contract (file names, the window.sketch API, the sketch:redraw event) or bump to v2.
import { rolldown } from 'rolldown';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const OUT = 'public/kit/v1';
mkdirSync(`${OUT}/fonts`, { recursive: true });

const bundle = await rolldown({ input: 'src/kit/kit.ts' });
await bundle.write({ file: `${OUT}/sketch.js`, format: 'iife', minify: true });

let fonts = '';
for (const f of ['gaegu/latin-400', 'gaegu/latin-700', 'klee-one/latin-400', 'klee-one/latin-600', 'klee-one/latin-ext-400']) {
  const css = readFileSync(`node_modules/@fontsource/${f}.css`, 'utf8');
  for (const [, file] of css.matchAll(/url\(\.\/files\/([^)]+)\)/g)) cpSync(`node_modules/@fontsource/${f.split('/')[0]}/files/${file}`, `${OUT}/fonts/${file}`);
  fonts += css.replaceAll('./files/', 'fonts/');
}
writeFileSync(`${OUT}/sketch.css`, fonts + readFileSync('src/styles/sketch-base.css', 'utf8'));
console.log('built the sketch kit in', OUT);
