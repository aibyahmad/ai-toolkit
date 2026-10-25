#!/usr/bin/env node
// Stop hook: while a /ship:it run is in progress, don't let the agent finish
// until checks, verify and review have all passed.
// It only acts when .ship/run.json exists in the project, and it fails open:
// anything unexpected lets the agent stop rather than trapping it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const STEPS = ['checks', 'verify', 'review'];
const FREE_STAGES = new Set(['done', 'grill', 'paused']);

function readJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function pending(run) {
  return STEPS.filter((step) => run[step] !== 'pass');
}

function decide(input) {
  if (!input || input.stop_hook_active) return null;
  const run = readJson(safeRead(join(input.cwd || process.cwd(), '.ship', 'run.json')));
  if (!run || FREE_STAGES.has(run.stage) || run.waiting_for_user) return null;
  const left = pending(run);
  if (left.length === 0) return null;
  return {
    decision: 'block',
    reason:
      `The ship run for "${run.task || 'this task'}" isn't finished. Still to do: ${left.join(', ')}. ` +
      'Carry on with the /ship:it loop and update .ship/run.json as each step passes. ' +
      'If you need the user, set "waiting_for_user": true first. If the user asked to stop, set "stage": "paused".',
  };
}

function safeRead(path) {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

let raw = '';
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  const result = decide(readJson(raw));
  if (result) process.stdout.write(JSON.stringify(result));
  process.exit(0);
});
