# mayhappybb.github.io

Personal site of Haibin Meng. Astro, static output, hand-drawn look with rough.js.

```sh
npm ci
npm run dev      # http://localhost:4321
npm test         # unit tests for the tool maths (dithering, PSF, warping)
npm run build    # -> dist/
```

## Adding things

- A project: a Markdown file in `src/content/projects/` (front matter schema in `src/content.config.ts`; `group` picks the section, `featured: true` puts it on the home page).
- A note: a Markdown file in `src/content/notes/`.
- An idea: one line in `src/data/ideas.ts`. Papers: `src/data/papers.ts`. Timeline: `src/data/timeline.ts`.
- Photos: put them in `src/assets/photos/` **after stripping metadata** (GPS). Reference them from front matter as `image: ../../assets/photos/x.jpg`.

## Tools

`src/pages/tools/` with logic in `src/scripts/tools/`. Everything runs client-side. The face tool self-hosts MediaPipe: the wasm runtime is copied from `node_modules` on every build (`scripts/copy-vendor.mjs`), the model file is in `public/vendor/mediapipe/`.

## Deploy

GitHub Actions (`.github/workflows/pages.yml`) builds and publishes on every push to `main`.
