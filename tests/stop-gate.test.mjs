// Tests for the Stop hook that keeps the agent working until a /ship:it run is finished.
// Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'plugins', 'ship', 'scripts', 'stop-gate.mjs');

function project(run) {
  const dir = mkdtempSync(join(tmpdir(), 'ship-gate-'));
  if (run !== undefined) {
    mkdirSync(join(dir, '.ship'));
    writeFileSync(join(dir, '.ship', 'run.json'), typeof run === 'string' ? run : JSON.stringify(run));
  }
  return dir;
}

function gate(cwd, extra = {}) {
  const r = spawnSync('node', [SCRIPT], { input: JSON.stringify({ cwd, hook_event_name: 'Stop', stop_hook_active: false, ...extra }), encoding: 'utf8' });
  const out = r.stdout.trim();
  return { code: r.status, decision: out ? JSON.parse(out) : null };
}

const unfinished = { task: 'Add a dark mode toggle', stage: 'build', checks: 'pending', verify: 'pending', review: 'pending' };

test('no ship run in the project: lets the agent stop', () => {
  const { code, decision } = gate(project());
  assert.equal(code, 0);
  assert.equal(decision, null);
});

test('unfinished run: blocks and names every step still to do', () => {
  const { code, decision } = gate(project(unfinished));
  assert.equal(code, 0);
  assert.equal(decision.decision, 'block');
  assert.match(decision.reason, /checks/);
  assert.match(decision.reason, /verify/);
  assert.match(decision.reason, /review/);
});

test('failed step counts as not done', () => {
  const { decision } = gate(project({ ...unfinished, stage: 'verify', checks: 'pass', verify: 'fail' }));
  assert.equal(decision.decision, 'block');
  assert.doesNotMatch(decision.reason, /checks/);
  assert.match(decision.reason, /verify/);
});

test('finished run: lets the agent stop', () => {
  const { decision } = gate(project({ ...unfinished, stage: 'done', checks: 'pass', verify: 'pass', review: 'pass' }));
  assert.equal(decision, null);
});

test('already continuing because of this hook: never loops forever', () => {
  const { decision } = gate(project(unfinished), { stop_hook_active: true });
  assert.equal(decision, null);
});

test('grill stage or waiting on the user: lets the agent stop to ask questions', () => {
  assert.equal(gate(project({ ...unfinished, stage: 'grill' })).decision, null);
  assert.equal(gate(project({ ...unfinished, waiting_for_user: true })).decision, null);
});

test('paused by the user: lets the agent stop', () => {
  assert.equal(gate(project({ ...unfinished, stage: 'paused' })).decision, null);
});

test('broken run file: never traps the agent', () => {
  const { code, decision } = gate(project('{not json'));
  assert.equal(code, 0);
  assert.equal(decision, null);
});

test('garbage on stdin: never traps the agent', () => {
  const r = spawnSync('node', [SCRIPT], { input: 'nope', encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '');
});
