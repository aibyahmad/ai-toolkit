import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN = join(dirname(fileURLToPath(import.meta.url)), '..', 'plugins', 'ship');

function installedHook(t, run) {
  const root = mkdtempSync(join(tmpdir(), 'ship-installed-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const pluginRoot = join(root, "plugin with spaces $cash `literal` 'quote'");
  cpSync(PLUGIN, pluginRoot, { recursive: true });
  const cwd = join(root, 'project');
  mkdirSync(join(cwd, '.ship'), { recursive: true });
  writeFileSync(join(cwd, '.ship', 'run.json'), JSON.stringify(run));
  const config = JSON.parse(readFileSync(join(pluginRoot, 'hooks', 'hooks.json'), 'utf8'));
  const hook = config.hooks.Stop[0].hooks[0];
  const args = hook.args.map((arg) => arg.replaceAll('${CLAUDE_PLUGIN_ROOT}', pluginRoot));
  return spawnSync(hook.command, args, {
    cwd,
    input: JSON.stringify({ cwd, hook_event_name: 'Stop', stop_hook_active: false }),
    encoding: 'utf8',
    timeout: hook.timeout * 1000,
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: pluginRoot },
  });
}

test('the configured plugin hook blocks an unfinished run from a path with special characters', (t) => {
  const result = installedHook(t, {
    task: 'Add a delete button', stage: 'build', checks: 'pass', verify: 'pending', review: 'pending',
  });
  assert.equal(result.status, 0, result.stderr);
  const decision = JSON.parse(result.stdout);
  assert.equal(decision.decision, 'block');
  assert.match(decision.reason, /verify/);
  assert.match(decision.reason, /review/);
  assert.doesNotMatch(decision.reason, /checks/);
});

test('the configured plugin hook allows a fully checked run to finish', (t) => {
  const result = installedHook(t, {
    task: 'Add a delete button', stage: 'done', checks: 'pass', verify: 'pass', review: 'pass',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});
