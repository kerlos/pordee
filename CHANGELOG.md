# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint configuration (`eslint:recommended` + custom rules) and `npm run lint` script
- GitHub Actions `lint` workflow (Node 20 / ubuntu-latest)
- `CHANGELOG.md` (this file) and `SECURITY.md`
- Edge-case tests: filesystem permission denied, concurrent `setState`, inline backtick code fence

## [0.1.0] - 2026-05-07

### Added
- Initial release
- Claude Code plugin with SessionStart and UserPromptSubmit hooks
- Two terseness levels: `lite` and `full`
- Slash commands: `/pordee`, `/pordee lite`, `/pordee full`, `/pordee stop`
- Thai keyword triggers: `พอดี`, `พอดีโหมด`, `พูดสั้นๆ`, `หยุดพอดี`, `พูดปกติ`
- Persistent state at `~/.pordee/state.json` (atomic writes)
- Auto-clarity: pordee disables itself for security warnings, irreversible commands, and clarification requests
- Test suite (30 cases across state, triggers, tracker, activate)
- Skill definition at `skills/pordee/SKILL.md`

[Unreleased]: https://github.com/kerlos/pordee/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kerlos/pordee/releases/tag/v0.1.0
