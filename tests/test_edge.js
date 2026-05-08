// Edge-case tests for pordee — fills coverage gaps identified during review:
// 1. Filesystem permission failure on setState
// 2. Concurrent setState writers (no JSON corruption)
// 3. Inline-backtick code fence containing a trigger

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const TRACKER_PATH = path.join(__dirname, '..', 'hooks', 'pordee-mode-tracker.js');

function makeTempHome() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pordee-edge-'));
  process.env.PORDEE_HOME = dir;
  delete require.cache[require.resolve('../hooks/pordee-config.js')];
  return dir;
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  delete process.env.PORDEE_HOME;
}

function runTracker(prompt, home) {
  return spawnSync(process.execPath, [TRACKER_PATH], {
    env: { ...process.env, PORDEE_HOME: home },
    input: JSON.stringify({ prompt }),
    encoding: 'utf8',
    timeout: 5000
  });
}

function readState(home) {
  const p = path.join(home, 'state.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// ─── 1. Permission failure ──────────────────────────────────────────────

test('setState returns null and does not throw when state path unwritable', () => {
  const home = makeTempHome();
  try {
    // Block writes by creating a directory at the state.json path.
    // setState will try writeFileSync(state.json.tmp, ...) then renameSync, both fail.
    fs.mkdirSync(path.join(home, 'state.json'));
    fs.mkdirSync(path.join(home, 'state.json.tmp'));

    const { setState } = require('../hooks/pordee-config.js');
    const result = setState({ enabled: true, level: 'full' });
    assert.equal(result, null, 'setState should return null on filesystem error');

    // Error should be logged to error.log (best-effort).
    const errLog = path.join(home, 'error.log');
    assert.ok(fs.existsSync(errLog), 'error.log should be created on failure');
  } finally {
    cleanup(home);
  }
});

// ─── 2. Concurrent setState ────────────────────────────────────────────

test('concurrent setState writers leave state.json valid (last-write-wins)', async () => {
  const home = makeTempHome();
  try {
    const writers = [];
    for (let i = 0; i < 10; i++) {
      writers.push(new Promise((resolve) => {
        const child = spawnSync(process.execPath, [TRACKER_PATH], {
          env: { ...process.env, PORDEE_HOME: home },
          input: JSON.stringify({ prompt: i % 2 === 0 ? '/pordee lite' : '/pordee full' }),
          encoding: 'utf8',
          timeout: 5000
        });
        resolve(child.status);
      }));
    }
    const results = await Promise.all(writers);
    for (const status of results) assert.equal(status, 0, 'every writer should exit 0');

    // Final state file must be parseable JSON with valid level.
    const state = readState(home);
    assert.ok(state, 'state.json must exist after concurrent writes');
    assert.equal(state.enabled, true);
    assert.ok(state.level === 'lite' || state.level === 'full',
      `level should be lite or full, got ${state.level}`);
  } finally {
    cleanup(home);
  }
});

// ─── 3. Inline-backtick fences ─────────────────────────────────────────

test('tracker ignores trigger inside inline triple-backtick on one line', () => {
  const home = makeTempHome();
  try {
    runTracker('see ```/pordee lite``` here', home);
    const state = readState(home);
    assert.ok(state === null || state.enabled === false,
      'inline fenced trigger should not fire');
  } finally {
    cleanup(home);
  }
});

test('tracker ignores trigger inside unclosed code fence (rest-of-prompt)', () => {
  const home = makeTempHome();
  try {
    runTracker('start text\n```\n/pordee\nstill in unclosed fence', home);
    const state = readState(home);
    assert.ok(state === null || state.enabled === false,
      'trigger after an unclosed ``` should be stripped');
  } finally {
    cleanup(home);
  }
});

test('tracker still fires trigger that appears AFTER a closed fence block', () => {
  const home = makeTempHome();
  try {
    // The fence is closed cleanly; the bare /pordee on its own line after the
    // fence should still be parsed.
    const prompt = '```\nsome code\n```\n/pordee';
    runTracker(prompt, home);
    const state = readState(home);
    assert.ok(state, 'state should be written');
    assert.equal(state.enabled, true, 'trigger after closed fence should fire');
  } finally {
    cleanup(home);
  }
});
