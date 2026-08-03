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

## Repository layout

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
specs/<feature>/analysis.md
```

The repository was initially bootstrapped manually because the first agent session
did not have a local working tree or the `specify` CLI. The manual bootstrap does
not claim that CLI integration files, scripts, or slash commands are installed.

## Governing specs

Rebuild roadmap:

```text
specs/000-atoenglish-rebuild-roadmap/
```

Existing compiler/provenance feature and evidence:

```text
specs/001-private-natural-lesson-compiler/
```

Proposed MVP convergence feature:

```text
specs/002-mvp-product-convergence/
```

Spec 002 planning artifacts are prepared for owner review. They do not authorize
implementation, hosted migration, preview deployment, merge, or production
deployment. After owner acceptance, its `tasks.md` becomes the only active MVP
implementation queue.

Spec 001 remains reusable evidence and source code material. Its diverged branch
must not be merged wholesale into the future MVP branch.

## Optional local CLI initialization

When working from a local clone, verify the official CLI and initialize the
preferred agent integration without discarding existing artifacts. Review the
CLI's proposed changes before accepting them.

Example:

```bash
specify version
specify init --here --force --integration codex --integration-options="--skills"
```

Do not overwrite `.specify/memory/constitution.md` or feature artifacts without an
explicit constitution amendment or approved spec update.

## Repository rule

No non-trivial implementation begins from an ad-hoc prompt alone. It must map to
an accepted feature under `specs/`, and its pull request must state which tasks are
complete, which evidence was observed, and which blockers remain.

A planning document is not implementation permission. Migrations, previews,
merge, and production deployment remain separate owner-gated actions.