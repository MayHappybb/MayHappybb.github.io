// Chinese fonts, cut down to exactly the characters the built site uses.
//   LXGW WenKai (OFL 1.1, drawn from Klee One) for text, so English and Chinese share one hand.
//   ZCOOL KuaiLe (OFL 1.1), a round felt-pen hand, beside Gaegu in headings.
// Two subsets, so English pages stay light:
//   en: the few Chinese words on English pages, the kit's header labels and the clock gallery (loaded by en.css and the kit)
//   zh: everything on the /zh/ pages and in the page scripts (loaded by zh.css on Chinese pages only)
// Runs after `astro build`, on dist/:
//   node scripts/build-cjk-fonts.mjs          check that the committed fonts cover every character (CI does this)
//   node scripts/build-cjk-fonts.mjs --write  re-subset into public/fonts/cjk/ and dist/fonts/cjk/, then commit
// The full fonts are downloaded once into fonts-src/ (not committed); sizes and SHA-256 are checked.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const DIST = 'dist';
const OUT = 'public/fonts/cjk';
const SRC = 'fonts-src';
const FONTS = {
  wenkai: { family: 'LXGW WenKai', file: 'LXGWWenKai-Regular.ttf', size: 25928940,
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.530/LXGWWenKai-Regular.ttf' },
  kuaile: { family: 'ZCOOL KuaiLe', file: 'ZCOOLKuaiLe-Regular.ttf', size: 1514968,
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf' },
};
const HASHES = 'scripts/cjk-fonts.sha256.json'; // pinned on the first good download
const RANGE = 'U+3000-303F, U+3400-4DBF, U+4E00-9FFF, U+FF00-FFEF';
const CJK = /[　-〿㐀-䶿一-鿿＀-￯]/gu;

if (!existsSync(DIST)) { console.error('Run `astro build` first: this script reads dist/.'); process.exit(1); }

const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : [p]; });
const charsOf = (paths) => new Set(paths.flatMap((p) => readFileSync(p, 'utf8').match(CJK) ?? []));
const all = files(DIST);
const isZhPage = (p) => relative(DIST, p).startsWith('zh/');
const en = charsOf([
  ...all.filter((p) => p.endsWith('.html') && !isZhPage(p) && !p.endsWith('404.html')),
  ...all.filter((p) => p.startsWith(join(DIST, 'kit')) && p.endsWith('.js')),
  ...(existsSync('scripts/cjk-extra-chars.txt') ? ['scripts/cjk-extra-chars.txt'] : []), // the clock gallery's blurbs
]);
const zh = new Set([...en, ...charsOf([
  ...all.filter((p) => p.endsWith('.html') && (isZhPage(p) || p.endsWith('404.html'))),
  ...all.filter((p) => p.startsWith(join(DIST, '_astro')) && p.endsWith('.js')), // tool and hero strings
])]);
const sorted = (s) => [...s].sort().join('');

const covered = existsSync(join(OUT, 'chars.json')) ? JSON.parse(readFileSync(join(OUT, 'chars.json'), 'utf8')) : { en: '', zh: '' };
if (!process.argv.includes('--write')) {
  const missing = (need, have) => [...need].filter((c) => !have.includes(c));
  const m = { en: missing(en, covered.en), zh: missing(zh, covered.zh) };
  if (m.en.length || m.zh.length) {
    console.error(`Chinese fonts do not cover new text (en: ${m.en.join('') || '-'}, zh: ${m.zh.length} characters).`);
    console.error('Run: npm run fonts   (astro build + node scripts/build-cjk-fonts.mjs --write), then commit public/fonts/cjk/.');
    process.exit(1);
  }
  console.log(`Chinese fonts cover the site (en ${en.size}, zh ${zh.size} characters)`);
  process.exit(0);
}

// ---- write ----
const { default: subsetFont } = await import('subset-font');
mkdirSync(SRC, { recursive: true });
const pinned = existsSync(HASHES) ? JSON.parse(readFileSync(HASHES, 'utf8')) : {};
const source = {};
for (const [key, f] of Object.entries(FONTS)) {
  const path = join(SRC, f.file);
  if (!existsSync(path)) {
    console.log(`downloading ${f.url}`);
    const res = await fetch(f.url); if (!res.ok) throw new Error(`${f.url}: HTTP ${res.status}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  }
  const buf = readFileSync(path);
  if (buf.length !== f.size) throw new Error(`${f.file}: ${buf.length} bytes, expected ${f.size} (an interrupted download? delete it and run again)`);
  const sha = createHash('sha256').update(buf).digest('hex');
  if (pinned[f.file] && pinned[f.file] !== sha) throw new Error(`${f.file}: checksum ${sha} does not match the pinned ${pinned[f.file]}`);
  pinned[f.file] = sha;
  source[key] = buf;
}
writeFileSync(HASHES, JSON.stringify(pinned, null, 2) + '\n');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const report = [];
for (const [set, chars] of [['en', en], ['zh', zh]]) {
  const text = sorted(chars);
  const faces = [];
  for (const [key, f] of Object.entries(FONTS)) {
    const name = `${key}-${set}.woff2`;
    const out = await subsetFont(source[key], text, { targetFormat: 'woff2' });
    writeFileSync(join(OUT, name), out);
    faces.push(`@font-face { font-family:'${f.family}'; font-style:normal; font-weight:400; font-display:swap; src:url(/fonts/cjk/${name}) format('woff2'); unicode-range:${RANGE}; }`);
    report.push(`${name} ${(out.length / 1024).toFixed(0)} KB`);
  }
  writeFileSync(join(OUT, `${set}.css`), `/* Generated by scripts/build-cjk-fonts.mjs: ${chars.size} characters. Do not edit. */\n${faces.join('\n')}\n`);
}
writeFileSync(join(OUT, 'chars.json'), JSON.stringify({ en: sorted(en), zh: sorted(zh) }) + '\n');
// OFL 1.1: the licence travels with the fonts
for (const l of ['OFL-LXGWWenKai.txt', 'OFL-ZCOOLKuaiLe.txt']) if (existsSync(join(SRC, l))) copyFileSync(join(SRC, l), join(OUT, l));
// the same files into this build
rmSync(join(DIST, 'fonts/cjk'), { recursive: true, force: true });
mkdirSync(join(DIST, 'fonts/cjk'), { recursive: true });
for (const f of readdirSync(OUT)) copyFileSync(join(OUT, f), join(DIST, 'fonts/cjk', f));
console.log(`Chinese fonts: en ${en.size} and zh ${zh.size} characters; ${report.join(', ')}`);
