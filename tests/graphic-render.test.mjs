import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../plugins/html-graphic-gen/skills/html-graphic-gen/scripts/render.mjs', import.meta.url));
function run(args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', timeout: 60000 });
}
function graphic(still = 0) {
  return `<!doctype html><html><head><meta name="width" content="20"><meta name="height" content="24"><meta name="duration" content="2"><meta name="still" content="${still}"><style>html,body{margin:0;width:20px;height:24px;background:white;overflow:hidden}.box{width:10px;height:10px;background:red;animation:move 2s linear infinite}@keyframes move{from{transform:translateY(0)}to{transform:translateY(14px)}}</style></head><body><div class="box"></div></body></html>`;
}

test('renders the requested still at exact scaled dimensions; refuses to overwrite', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'graphic-cli-'));
  try {
    const html = path.join(dir, 'input.html');
    const out = path.join(dir, 'output');
    await writeFile(html, graphic());
    const first = run(['--html', html, '--out', out, '--name', 'sample', '--scale', '2']);
    assert.equal(first.status, 0, first.stderr);
    const png = await readFile(path.join(out, 'sample.png'));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), 40);
    assert.equal(png.readUInt32BE(20), 48);
    await writeFile(html, graphic(1));
    const second = run(['--html', html, '--out', out, '--name', 'later', '--scale', '2']);
    assert.equal(second.status, 0, second.stderr);
    assert.notDeepEqual(await readFile(path.join(out, 'later.png')), png);
    const collision = run(['--html', html, '--out', out, '--name', 'sample']);
    assert.notEqual(collision.status, 0);
    assert.match(collision.stderr, /already exists/);
    assert.deepEqual(await readFile(path.join(out, 'sample.png')), png);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('rejects invalid dimensions without creating output', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'graphic-invalid-'));
  try {
    const html = path.join(dir, 'bad.html');
    await writeFile(html, graphic().replace('content="20"', 'content="0"'));
    const result = run(['--html', html, '--out', path.join(dir, 'output')]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /width/);
    assert.deepEqual(await readdir(dir), ['bad.html']);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('help works without a graphic; unsafe names and unknown flags fail', () => {
  assert.equal(run(['--help']).status, 0);
  assert.notEqual(run(['--html', 'unused.html', '--name', '../escape']).status, 0);
  assert.notEqual(run(['--surprise']).status, 0);
});

test('page scripts are blocked even when placed before the HTML head', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'graphic-policy-'));
  try {
    const clean = path.join(dir, 'clean.html');
    const scripted = path.join(dir, 'scripted.html');
    const out = path.join(dir, 'output');
    await writeFile(clean, graphic());
    await writeFile(scripted, '<script>document.documentElement.style.opacity="0"</script>' + graphic());
    for (const html of [clean, scripted]) {
      const result = run(['--html', html, '--out', out]);
      assert.equal(result.status, 0, result.stderr);
    }
    assert.deepEqual(await readFile(path.join(out, 'scripted.png')), await readFile(path.join(out, 'clean.png')));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
