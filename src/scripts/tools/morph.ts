// Face morph: landmarks with MediaPipe (self-hosted WASM), Delaunay on the mean shape, piecewise-affine warps.
// Photos are decoded and processed in this tab only.
import Delaunator from 'delaunator';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { similarity, warpInto, meanShape, borderPoints, type P, type Img } from './morph-core';

const W = 480, H = 600;
// target eye centres in the output frame
const EYE_L: P = [W * 0.36, H * 0.42], EYE_R: P = [W * 0.64, H * 0.42];

interface Face { name: string; url: string; aligned: Img; pts: P[]; status: string; ok: boolean }
const faces: Face[] = [];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const ui = {
  file: $<HTMLInputElement>('file'), drop: $('drop'), list: $('faces'), status: $('status'),
  mode: $<HTMLSelectElement>('mode'), a: $<HTMLSelectElement>('fa'), b: $<HTMLSelectElement>('fb'),
  t: $<HTMLInputElement>('t'), play: $<HTMLButtonElement>('play'), mesh: $<HTMLInputElement>('mesh'),
  out: $<HTMLCanvasElement>('out'), png: $<HTMLButtonElement>('png'), gif: $<HTMLButtonElement>('gif'),
  webm: $<HTMLButtonElement>('webm'), morphOpts: $('morphopts'),
};
ui.out.width = W; ui.out.height = H;

// ---------- landmarker (lazy) ----------
type Landmarker = { detect: (img: HTMLCanvasElement) => { faceLandmarks: { x: number; y: number }[][] } };
let landmarker: Promise<Landmarker> | null = null;
function getLandmarker() {
  landmarker ??= (async () => {
    say('Loading the face model (about 17 MB, once)…');
    const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks('/vendor/mediapipe/wasm');
    return (await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: '/vendor/mediapipe/face_landmarker.task', delegate: 'CPU' },
      runningMode: 'IMAGE', numFaces: 4,
    })) as unknown as Landmarker;
  })();
  return landmarker;
}
const say = (s: string) => { ui.status.textContent = s; };

async function decode(file: File): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error(`${file.name}: this browser can't decode it (HEIC works in Safari; elsewhere use JPEG or PNG).`);
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height)); // landmarks don't need more
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
  return c;
}

async function addFiles(files: FileList | File[]) {
  // MediaPipe uploads every image through WebGL, even when the model runs on the CPU
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2') && !probe.getContext('webgl')) { say('This tool needs WebGL, which is turned off or missing in this browser.'); return; }
  const lm = await getLandmarker();
  for (const file of [...files].filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))) {
    say(`Finding the face in ${file.name}…`);
    try {
      const c = await decode(file);
      const res = lm.detect(c).faceLandmarks;
      if (!res.length) { faces.push(stub(file.name, c, 'no face found')); continue; }
      // the largest face, by landmark bounding box
      const area = (f: { x: number; y: number }[]) => (Math.max(...f.map((p) => p.x)) - Math.min(...f.map((p) => p.x))) * (Math.max(...f.map((p) => p.y)) - Math.min(...f.map((p) => p.y)));
      const best = res.reduce((a, b) => (area(b) > area(a) ? b : a));
      faces.push(align(file.name, c, best.slice(0, 468).map((p) => [p.x * c.width, p.y * c.height] as P), res.length));
    } catch (e) { console.error(e); faces.push({ ...stub(file.name, document.createElement('canvas'), `couldn't read it: ${(e as Error).message}`), url: '' }); }
  }
  refresh();
}

function stub(name: string, c: HTMLCanvasElement, status: string): Face {
  return { name, url: c.toDataURL('image/jpeg', 0.7), aligned: { w: 0, h: 0, data: new Uint8ClampedArray() }, pts: [], status, ok: false };
}

/** Rotate, scale and crop the photo so the eyes land on fixed positions; carry the landmarks along. */
function align(name: string, c: HTMLCanvasElement, pts: P[], nFaces: number): Face {
  const mid = (a: number, b: number): P => [(pts[a][0] + pts[b][0]) / 2, (pts[a][1] + pts[b][1]) / 2];
  // MediaPipe face mesh: 33/133 = one eye's corners, 362/263 = the other's (image left first)
  const e1 = mid(33, 133), e2 = mid(362, 263);
  const [l, r] = e1[0] < e2[0] ? [e1, e2] : [e2, e1];
  const { m, f } = similarity(l, r, EYE_L, EYE_R);
  const o = document.createElement('canvas'); o.width = W; o.height = H;
  const g = o.getContext('2d')!;
  g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);
  g.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); g.drawImage(c, 0, 0);
  g.setTransform(1, 0, 0, 1, 0, 0);
  const data = g.getImageData(0, 0, W, H).data;
  const thumb = document.createElement('canvas'); thumb.width = 120; thumb.height = 150;
  thumb.getContext('2d')!.drawImage(o, 0, 0, 120, 150);
  return { name, url: thumb.toDataURL('image/jpeg', 0.8), aligned: { w: W, h: H, data }, pts: [...pts.map(f), ...borderPoints(W, H)], status: nFaces > 1 ? `${nFaces} faces, used the largest` : 'face found', ok: true };
}

// ---------- rendering ----------
let tri: Uint32Array | null = null;
function triangulate(shape: P[]) { tri = new Delaunator(shape.flat()).triangles; return tri; }

function blend(items: { f: Face; w: number }[], shape: P[]): ImageData {
  const t = triangulate(shape);
  const acc = new Float32Array(W * H * 4);
  for (const { f, w } of items) warpInto(f.aligned, f.pts, shape, t, acc, W, H, w);
  const out = new ImageData(W, H);
  for (let i = 0; i < acc.length; i++) out.data[i] = acc[i];
  for (let i = 3; i < acc.length; i += 4) out.data[i] = 255;
  return out;
}

function frame(t: number): ImageData | null {
  const ok = faces.filter((f) => f.ok);
  if (ui.mode.value === 'average') {
    if (ok.length < 1) return null;
    return blend(ok.map((f) => ({ f, w: 1 / ok.length })), meanShape(ok.map((f) => f.pts)));
  }
  const A = faces[+ui.a.value], B = faces[+ui.b.value];
  if (!A?.ok || !B?.ok) return null;
  return blend([{ f: A, w: 1 - t }, { f: B, w: t }], meanShape([A.pts, B.pts], [1 - t, t]));
}

let shape: P[] | null = null;
function draw() {
  const g = ui.out.getContext('2d')!;
  const t = +ui.t.value;
  const im = frame(t);
  const can = !!im;
  ui.png.disabled = ui.gif.disabled = ui.webm.disabled = !can; ui.play.disabled = !can || ui.mode.value === 'average';
  ui.webm.hidden = typeof MediaRecorder === 'undefined';
  if (!im) { g.clearRect(0, 0, W, H); return; }
  g.putImageData(im, 0, 0);
  const ok = faces.filter((f) => f.ok);
  shape = ui.mode.value === 'average' ? meanShape(ok.map((f) => f.pts)) : meanShape([faces[+ui.a.value].pts, faces[+ui.b.value].pts], [1 - t, t]);
  if (ui.mesh.checked && tri) {
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 0.6; g.beginPath();
    for (let i = 0; i < tri.length; i += 3) {
      const [a, b, c] = [shape[tri[i]], shape[tri[i + 1]], shape[tri[i + 2]]];
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.closePath();
    }
    g.stroke();
  }
}

function refresh() {
  ui.list.replaceChildren(...faces.map((f, i) => {
    const li = document.createElement('li');
    const img = document.createElement('img'); img.src = f.url; img.alt = `Photo ${i + 1}`; img.width = 60; img.height = 75;
    const span = document.createElement('span'); span.textContent = `${i + 1}. ${f.status}`;
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'btn'; rm.textContent = 'remove';
    rm.setAttribute('aria-label', `Remove photo ${i + 1}`);
    rm.onclick = () => { faces.splice(i, 1); refresh(); };
    li.append(img, span, rm); return li;
  }));
  const ok = faces.map((f, i) => [f, i] as const).filter(([f]) => f.ok);
  for (const [sel, pick] of [[ui.a, 0], [ui.b, 1]] as const) {
    const prev = sel.value; sel.replaceChildren(...ok.map(([, i]) => new Option(`photo ${i + 1}`, String(i))));
    if ([...sel.options].some((o) => o.value === prev)) sel.value = prev; else if (ok[pick]) sel.value = String(ok[pick][1]);
  }
  ui.morphOpts.hidden = ui.mode.value !== 'morph';
  const n = ok.length;
  say(n === 0 ? (faces.length ? 'No usable face yet. Try a clear, front-facing photo.' : 'Add two or more photos to begin.')
    : n === 1 ? 'One face ready. Add another to average or morph.' : `${n} faces ready.`);
  draw();
}

// ---------- export ----------
function download(name: string, blob: Blob) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
const frames = (n: number) => Array.from({ length: n }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n)); // there and back, eased

ui.png.onclick = () => ui.out.toBlob((b) => b && download(ui.mode.value === 'average' ? 'average-face.png' : 'morph.png', b), 'image/png');
ui.gif.onclick = async () => {
  ui.gif.disabled = true; const gw = W / 2, gh = H / 2;
  const enc = GIFEncoder(); const small = document.createElement('canvas'); small.width = gw; small.height = gh;
  const sg = small.getContext('2d', { willReadFrequently: true })!; const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const list = ui.mode.value === 'average' ? [0] : frames(40);
  for (let i = 0; i < list.length; i++) {
    say(`Making the GIF: frame ${i + 1} of ${list.length}…`); await new Promise((r) => setTimeout(r));
    tmp.getContext('2d')!.putImageData(frame(list[i])!, 0, 0); sg.drawImage(tmp, 0, 0, gw, gh);
    const { data } = sg.getImageData(0, 0, gw, gh);
    const pal = quantize(data, 256); enc.writeFrame(applyPalette(data, pal), gw, gh, { palette: pal, delay: 60 });
  }
  enc.finish(); download('morph.gif', new Blob([enc.bytes()], { type: 'image/gif' })); ui.gif.disabled = false; refresh();
};
ui.webm.onclick = async () => {
  ui.webm.disabled = true;
  const stream = ui.out.captureStream(30);
  const type = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'].find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
  const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined); const chunks: Blob[] = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = r)); rec.start();
  const list = ui.mode.value === 'average' ? [0] : frames(90);
  for (const t of list) { ui.t.value = String(t); draw(); await new Promise((r) => setTimeout(r, 33)); }
  rec.stop(); await done;
  download(type.includes('mp4') ? 'morph.mp4' : 'morph.webm', new Blob(chunks, { type: type || 'video/webm' })); ui.webm.disabled = false;
};

let playing = 0;
ui.play.onclick = () => {
  if (playing) { cancelAnimationFrame(playing); playing = 0; ui.play.textContent = 'Play'; return; }
  ui.play.textContent = 'Stop'; const t0 = performance.now();
  const step = (now: number) => { ui.t.value = String(0.5 - 0.5 * Math.cos(((now - t0) / 3000) * 2 * Math.PI)); draw(); playing = requestAnimationFrame(step); };
  playing = requestAnimationFrame(step);
};

// ---------- wiring ----------
ui.file.onchange = () => { const list = [...(ui.file.files ?? [])]; ui.file.value = ""; if (list.length) addFiles(list); };
['dragenter', 'dragover'].forEach((ev) => ui.drop.addEventListener(ev, (e) => { e.preventDefault(); ui.drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => ui.drop.addEventListener(ev, (e) => { e.preventDefault(); ui.drop.classList.remove('over'); }));
ui.drop.addEventListener('drop', (e) => { const f = (e as DragEvent).dataTransfer?.files; if (f?.length) addFiles(f); });
[ui.mode, ui.a, ui.b].forEach((s) => s.addEventListener('change', refresh));
ui.t.addEventListener('input', draw); ui.mesh.addEventListener('change', draw);
refresh();
