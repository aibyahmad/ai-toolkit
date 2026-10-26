import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';

const help = `Render an HTML/CSS graphic to PNG, MP4 and GIF.
node scripts/render.mjs --html design.html --out output [--name design]
  --png --mp4 --gif   Select outputs (default: PNG)
  --scale 1          Output scale, 1 to 3
  --fps 60           MP4 capture fps, 1 to 60
  --gif-fps 20       GIF fps, 1 to 30 (also capped to 240 frames)
  --gif-width 1080   GIF width, 320 to 2160
  --overwrite        Replace existing named output files
  --help             Show this message
MP4/GIF require ffmpeg on PATH, or FFMPEG_PATH pointing to its binary.
HTML must use inline assets and CSS animation. Page scripts are blocked.
`;

function number(value, name, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
  return parsed;
}

function options() {
  const strings = ['html', 'out', 'name', 'scale', 'fps', 'gif-fps', 'gif-width'];
  const booleans = ['png', 'mp4', 'gif', 'overwrite', 'help'];
  const schema = Object.fromEntries([
    ...strings.map(key => [key, { type: 'string' }]),
    ...booleans.map(key => [key, { type: 'boolean' }]),
  ]);
  const { values } = parseArgs({ options: schema, strict: true });
  if (values.help) return { help: true };
  if (!values.html) throw new Error('--html is required');
  const name = values.name ?? path.basename(values.html, path.extname(values.html));
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) throw new Error('Use a simple --name without path separators');
  const selected = ['png', 'mp4', 'gif'].filter(key => values[key]);
  return {
    input: path.resolve(values.html), out: path.resolve(values.out ?? 'output'), name,
    formats: selected.length ? selected : ['png'], overwrite: values.overwrite,
    scale: number(values.scale ?? 1, 'scale', 1, 3),
    fps: number(values.fps ?? 60, 'fps', 1, 60),
    gifFps: number(values['gif-fps'] ?? 20, 'gif-fps', 1, 30),
    gifWidth: number(values['gif-width'] ?? 1080, 'gif-width', 320, 2160),
  };
}

function metadata(html) {
  const read = (key, fallback) => html.match(new RegExp(`<meta\\s+name=["']${key}["']\\s+content=["']([^"']+)["']`, 'i'))?.[1] ?? fallback;
  const width = number(read('width', 1080), 'width', 2, 4096);
  const height = number(read('height', 1350), 'height', 2, 4096);
  if (!Number.isInteger(width) || !Number.isInteger(height)) throw new Error('width and height must be integers');
  const duration = number(read('duration', 6), 'duration', 1, 30);
  const still = number(read('still', 0), 'still', 0, duration);
  return { width, height, duration, still };
}

async function checkOutputs(opt, meta) {
  if (meta.width * meta.height * opt.scale ** 2 >= 36152320) throw new Error('Scaled canvas exceeds the pixel limit');
  if (opt.formats.includes('mp4') && (meta.width * opt.scale % 2 || meta.height * opt.scale % 2)) {
    throw new Error('MP4 needs even scaled width and height');
  }
  for (const format of opt.formats) {
    const file = path.join(opt.out, `${opt.name}.${format}`);
    const exists = await fs.access(file).then(() => true, () => false);
    if (exists && !opt.overwrite) throw new Error(`${file} already exists; use --overwrite to replace it`);
  }
}

function ffmpeg(args) {
  const result = spawnSync(process.env.FFMPEG_PATH ?? 'ffmpeg', args, {
    encoding: 'utf8', timeout: 120000, maxBuffer: 1024 * 1024, shell: false,
  });
  if (result.error) throw new Error(`Cannot run ffmpeg: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.stderr.slice(-3000)}`);
}

async function renderRequest(route, html) {
  const url = route.request().url();
  if (url === 'http://graphic.invalid/') {
    const policy = "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src data: https://fonts.gstatic.com; script-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
    return route.fulfill({ status: 200, contentType: 'text/html', headers: { 'Content-Security-Policy': policy }, body: html });
  }
  if (['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(new URL(url).origin)) {
    return route.continue();
  }
  return route.abort();
}

async function pageFor(browser, html, opt, meta) {
  const page = await browser.newPage({
    viewport: { width: meta.width, height: meta.height }, deviceScaleFactor: opt.scale,
    serviceWorkers: 'block',
  });
  await page.route('**/*', route => renderRequest(route, html));
  await page.goto('http://graphic.invalid/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getAnimations().forEach(animation => {
    animation.pause(); animation.currentTime = 0;
  }));
  return page;
}

async function seek(page, seconds) {
  await page.evaluate(time => document.getAnimations().forEach(animation => {
    animation.currentTime = time;
  }), seconds * 1000);
}

async function captureFrames(page, opt, meta, work) {
  const fps = opt.formats.includes('mp4') ? opt.fps : Math.min(opt.gifFps, Math.floor(240 / meta.duration));
  const count = Math.ceil(meta.duration * fps);
  for (let index = 0; index < count; index++) {
    await seek(page, index / fps);
    await page.screenshot({ path: path.join(work, `f${String(index).padStart(5, '0')}.png`) });
  }
  return fps;
}

async function encode(opt, meta, work, fps) {
  const input = ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', path.join(work, 'f%05d.png')];
  if (opt.formats.includes('mp4')) {
    ffmpeg([...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', path.join(opt.out, `${opt.name}.mp4`)]);
  }
  if (opt.formats.includes('gif')) {
    const gifFps = Math.min(opt.gifFps, Math.floor(240 / meta.duration));
    const width = 2 * Math.floor(Math.min(opt.gifWidth, meta.width * opt.scale) / 2);
    const filter = `fps=${gifFps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`;
    const file = path.join(opt.out, `${opt.name}.gif`);
    ffmpeg([...input, '-vf', filter, '-loop', '0', file]);
    if ((await fs.stat(file)).size >= 5000000) {
      throw new Error('GIF exceeds 5 MB. Reduce --gif-width or --gif-fps, then use --overwrite to retry');
    }
  }
}

async function main() {
  const opt = options();
  if (opt.help) return console.log(help);
  const html = await fs.readFile(opt.input, 'utf8');
  const meta = metadata(html);
  await checkOutputs(opt, meta);
  const moving = opt.formats.some(format => format !== 'png');
  if (moving) ffmpeg(['-version']);
  const { chromium } = await import('playwright');
  const work = await fs.mkdtemp(path.join(tmpdir(), 'html-graphic-gen-'));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await pageFor(browser, html, opt, meta);
    await fs.mkdir(opt.out, { recursive: true });
    if (opt.formats.includes('png')) {
      await seek(page, meta.still);
      await page.screenshot({ path: path.join(opt.out, `${opt.name}.png`) });
    }
    if (moving) await encode(opt, meta, work, await captureFrames(page, opt, meta, work));
    console.log(`Exported ${opt.formats.join(', ')} to ${opt.out}`);
  } finally {
    await browser?.close();
    await fs.rm(work, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
