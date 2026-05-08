# Security Policy

## Supported Versions

`pordee` is a small, single-author Claude Code plugin with no runtime dependencies. Only the latest released version is supported with security fixes.

| Version | Supported |
|---|---|
| 0.1.x   | ✅ |
| < 0.1   | ❌ |

## Reporting a Vulnerability

If you discover a security issue, **please do not open a public GitHub issue**.

Instead, report it privately by either:

1. **GitHub Security Advisories** — preferred — open a draft advisory at
   https://github.com/kerlos/pordee/security/advisories/new
2. **Email** — contact the maintainer directly via the address listed on the GitHub profile of the repository owner.

Please include:

- A clear description of the issue and its impact
- Steps to reproduce (or a proof-of-concept) where possible
- The version / commit hash affected
- Your name / handle if you wish to be credited

You should receive an acknowledgment within **5 business days**. A coordinated disclosure timeline will be agreed upon based on severity, typically within **30 days** of the initial report.

## Threat Model — what `pordee` does and does not do

**Scope of the plugin:**

- Reads and writes a single file: `$PORDEE_HOME/state.json` (defaults to `~/.pordee/state.json`)
- Reads `stdin` from Claude Code hooks (JSON only)
- Writes `stdout` for Claude Code to consume as additional session context
- Logs hook errors to `$PORDEE_HOME/error.log`

**Not in scope:**

- No network calls
- No `eval`, `Function`, or `child_process.exec` of user input
- No execution of code outside the plugin's own files
- No reading of files outside `$PORDEE_HOME`

**Trust assumptions:**

- The `PORDEE_HOME` environment variable, when set, is trusted (it is set by the user or test harness)
- The Node.js runtime invoking the hooks is trusted
- Claude Code is responsible for invoking hooks with valid stdin and respecting their stdout

If you find a way for `pordee` to do anything beyond the scope above, that is a vulnerability — please report it.
