#!/usr/bin/env node
// pordee — UserPromptSubmit hook.
// Reads stdin: { prompt, transcript_path?, ... }
// Parses prompt for triggers (skipping content inside ``` code fences).
// Updates state.json. Emits hookSpecificOutput when pordee enabled.
// Always exits 0.

const { getState, setState, logError } = require('./pordee-config');

function stripCodeFences(text) {
  // Remove triple-backtick fenced blocks (multi-line and inline ```...```).
  return text.replace(/```[\s\S]*?```/g, '').replace(/```[\s\S]*$/, '');
}

function parseTrigger(prompt) {
  const cleaned = stripCodeFences(prompt);
  const trimmed = cleaned.trim();

  // Slash commands — case-insensitive on the command, exact on args.
  const slashMatch = trimmed.match(/^\/pordee(?:\s+(\w+))?$/i);
  if (slashMatch) {
    const arg = (slashMatch[1] || '').toLowerCase();
    if (arg === 'lite') return { enabled: true, level: 'lite' };
    if (arg === 'full') return { enabled: true, level: 'full' };
    if (arg === 'stop') return { enabled: false };
    if (arg === '') return { enabled: true };  // bare /pordee
    // Unknown subcommand — ignore.
    return null;
  }

  // Thai phrase triggers — exact match only (=== on trimmed input), so order is irrelevant.
  // Disable listed first purely for readability.
  const enableThai = ['พอดีโหมด', 'พูดสั้นๆ', 'พอดี'];
  const disableThai = ['หยุดพอดี', 'พูดปกติ'];

  for (const phrase of disableThai) {
    if (trimmed === phrase) return { enabled: false };
  }
  for (const phrase of enableThai) {
    if (trimmed === phrase) return { enabled: true };
  }

  return null;
}

function emitActiveReminder(state) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        `PORDEE MODE ACTIVE (${state.level}). ` +
        `ตอบไทยกระชับ. Keep technical English terms. ` +
        `Drop polite particles, hedging, pleasantries. Fragments OK. ` +
        `Code/commits/security: write normal.`
    }
  }));
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').toString();

    const trigger = parseTrigger(prompt);
    if (trigger) {
      setState(trigger);
    }

    const state = getState();
    if (state.enabled) {
      emitActiveReminder(state);
    }
  } catch (e) {
    // Silent fail to never block prompts; log to ~/.pordee/error.log per spec §4.4.
    logError(`mode-tracker: ${e.message}`);
  }
  process.exit(0);
});
