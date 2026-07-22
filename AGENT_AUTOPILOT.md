# Autopilot — Disabled

Autonomous agent execution for AtoEnglish is disabled as of 2026-07-22.

The repository contains `.agent-autopilot-disabled`. Both `scripts/agent-orchestrator.sh` and `scripts/agent-daemon.sh` refuse to run while autonomous operation is disabled. The scheduled GitHub agent-health workflow has also been removed.

Do not restore cron, daemon, headless agent sessions, automatic backlog refill, automatic pushes, or automatic pull-request creation without an explicit reviewed decision from the project owner.

## Manual development workflow

1. Create one focused branch from current `main`.
2. Make one bounded change.
3. Run lint, TypeScript, tests, content-standard checks, and build as appropriate.
4. Push once after validation.
5. Open one pull request and review the final diff before merging.

## Re-enabling

Re-enabling requires a reviewed change that removes `.agent-autopilot-disabled` and restores the retired scripts intentionally. Removing the marker alone is not sufficient because the scripts are now kill-switch stubs.
