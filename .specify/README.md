# AtoEnglish Spec Kit Workflow

This repository uses GitHub Spec Kit's spec-driven sequence as its development
control plane:

```text
constitution
→ specify
→ clarify/checklist
→ plan
→ tasks
→ analyze
→ implement
→ converge
```

## Current bootstrap

The repository was bootstrapped manually on `agent/rebuild-learning-core` because
this agent session did not have a local working tree or the `specify` CLI. The
file layout and artifacts follow the official Spec Kit structure:

```text
.specify/memory/constitution.md
specs/<feature>/spec.md
specs/<feature>/plan.md
specs/<feature>/research.md
specs/<feature>/data-model.md
specs/<feature>/quickstart.md
specs/<feature>/contracts/
specs/<feature>/checklists/
specs/<feature>/tasks.md
```

The manual bootstrap does not claim that CLI integration files, scripts, or agent
slash commands are installed.

## Optional local CLI initialization

When working from a local clone, verify the official CLI and initialize the
preferred agent integration without discarding existing artifacts. Review the
CLI's proposed changes before accepting them.

Example for Codex skills mode:

```bash
specify version
specify init --here --force --integration codex --integration-options="--skills"
```

Do not overwrite `.specify/memory/constitution.md` or active feature artifacts
without an explicit constitution amendment or spec update.

## Repository rule

No non-trivial implementation begins from an ad-hoc prompt alone. It must map to
an active feature under `specs/`, and the pull request must state which tasks are
complete, which evidence was observed, and which blockers remain.

The active feature is:

```text
specs/001-private-natural-lesson-compiler/
```

The rebuild roadmap is:

```text
specs/000-atoenglish-rebuild-roadmap/
```
