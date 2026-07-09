# Install pordee

One install. Works for every AI coding agent on your machine that pordee supports.

If you just want it to work, run the one-liner. If you want to know what gets touched, scroll down.

## One-liner

**macOS / Linux / WSL / Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/kerlos/pordee/main/install.sh | bash
```

**Windows (PowerShell 5.1+)**

```powershell
irm https://raw.githubusercontent.com/kerlos/pordee/main/install.ps1 | iex
```

What it does:

- Auto-detects every supported agent installed on your machine.
- Claude Code gets the native plugin + hooks.
- Every other detected agent gets `npx skills add kerlos/pordee -a <profile>`.
- Skips anything you don't have. Safe to re-run.

Preview mode:

```bash
curl -fsSL https://raw.githubusercontent.com/kerlos/pordee/main/install.sh | bash -s -- --dry-run
```

## Per-agent install

| Agent | Install command | Auto-activates? |
|---|---|:-:|
| **Claude Code** | `claude plugin marketplace add kerlos/pordee && claude plugin install pordee@pordee` | Yes |
| **Gemini CLI** | `npx skills add kerlos/pordee -a gemini` | Yes |
| **Codex CLI** | `npx skills add kerlos/pordee -a codex` | No — say `/pordee` |
| **Cursor** | `npx skills add kerlos/pordee -a cursor` | No — say `/pordee`; `--with-init` for always-on rule file |
| **Windsurf** | `npx skills add kerlos/pordee -a windsurf` | No — say `/pordee`; `--with-init` for always-on rule file |
| **Cline** | `npx skills add kerlos/pordee -a cline` | No — say `/pordee`; `--with-init` for always-on rule file |
| **Continue** | `npx skills add kerlos/pordee -a continue` | No |
| **GitHub Copilot** *(soft probe)* | `npx skills add kerlos/pordee -a copilot` | No; `--with-init` writes `.github/copilot-instructions.md` |
| **opencode** | `npx skills add kerlos/pordee -a opencode` | Yes |
| **OpenClaw** | `npx skills add kerlos/pordee -a openclaw` | Yes |
| **Kilo Code** | `npx skills add kerlos/pordee -a kilo` | No |
| **Roo Code** | `npx skills add kerlos/pordee -a roo` | No |
| **Augment Code** | `npx skills add kerlos/pordee -a augment` | No |
| **Aider Desk** | `npx skills add kerlos/pordee -a aider-desk` | No |
| **Sourcegraph Amp** | `npx skills add kerlos/pordee -a amp` | No |
| **IBM Bob** | `npx skills add kerlos/pordee -a bob` | No |
| **Crush** | `npx skills add kerlos/pordee -a crush` | No |
| **Devin (terminal)** | `npx skills add kerlos/pordee -a devin` | No |
| **Droid (Factory)** | `npx skills add kerlos/pordee -a droid` | No |
| **ForgeCode** | `npx skills add kerlos/pordee -a forgecode` | No |
| **Block Goose** | `npx skills add kerlos/pordee -a goose` | No |
| **iFlow CLI** | `npx skills add kerlos/pordee -a iflow-cli` | No |
| **Kiro CLI** | `npx skills add kerlos/pordee -a kiro-cli` | No |
| **Mistral Vibe** | `npx skills add kerlos/pordee -a mistral-vibe` | No |
| **OpenHands** | `npx skills add kerlos/pordee -a openhands` | No |
| **Qwen Code** | `npx skills add kerlos/pordee -a qwen-code` | No |
| **Atlassian Rovo Dev** | `npx skills add kerlos/pordee -a rovodev` | No |
| **Tabnine CLI** | `npx skills add kerlos/pordee -a tabnine-cli` | No |
| **Trae** | `npx skills add kerlos/pordee -a trae` | No |
| **Warp** | `npx skills add kerlos/pordee -a warp` | No |
| **Replit Agent** | `npx skills add kerlos/pordee -a replit` | No |
| **JetBrains Junie** *(soft probe)* | `npx skills add kerlos/pordee -a junie` | No |
| **Qoder** *(soft probe)* | `npx skills add kerlos/pordee -a qoder` | No |
| **Google Antigravity** *(soft probe)* | `npx skills add kerlos/pordee -a antigravity` | No |

"Soft probe" = the installer won't auto-detect these without `--only <id>` because there's no reliable always-on signal. Pass `--only <id>` when you want them.

For "No" auto-activate agents, type `/pordee` once per session (or use keywords like `พอดี`, `พูดสั้นๆ`).

## Flags

```bash
bash install.sh --all              # install for every detected agent
bash install.sh --only claude      # install for one agent only
bash install.sh --dry-run          # preview commands
bash install.sh --list             # print agent matrix + detection status
bash install.sh --with-init        # drop always-on rule files into repo
bash install.sh --force            # re-run even if already installed
bash install.sh --uninstall        # remove pordee + state
```

`install.ps1` accepts the same flags.

## Always-on rules

For agents without hooks (Cursor, Windsurf, Cline, Copilot), use `--with-init`:

```bash
node bin/install.js --with-init --all
```

This writes `src/rules/pordee-activate.md` into:

- `.cursor/rules/pordee.mdc`
- `.windsurf/rules/pordee.md`
- `.clinerules/pordee.md`
- `.github/copilot-instructions.md`
- `AGENTS.md` (opencode)
- `~/.openclaw/workspace/SOUL.md` (OpenClaw)

## Uninstall

```bash
npx -y github:kerlos/pordee -- --uninstall
```

Removes:

- Claude Code plugin.
- `npx skills remove pordee`.
- pordee state directory (`~/.pordee`).
- Rule files written by `--with-init` (or marker-fenced blocks inside them).

## Verify

1. Run `node bin/install.js --list` — detected agents are marked `yes`.
2. In Claude Code, type `/pordee`. Response should be terse Thai.
3. For skill-only agents, type `/pordee` each session.

## Troubleshooting

**"No supported agents detected."**

Make sure the agent's CLI is on `PATH`, then re-run with `--all` or `--only <id>`.

**"`npx skills add` errored on a profile slug."**

Profile slugs come from the skills registry. If one was renamed upstream, open an issue.
