# Documentation Map

> **Document status:** canonical repository navigation
> **Governing authority:** [Nếp / AtoEnglish Constitution](../.specify/memory/constitution.md)

- Project invariants and conflict rules: [constitution](../.specify/memory/constitution.md).
- Active bounded changes: `specs/**/spec.md`; the checked-out feature pointer is machine-local
  `.specify/feature.json`.
- Technical approach and execution: the matching `plan.md`, `tasks.md`, and `checklists/**` under
  the feature directory.
- Durable domain and research material: `docs/core/**`, `docs/nep/**`, `docs/learning-system/**`,
  `docs/architecture/**`, and `docs/reference/**`. These are reference material, not governance.
- Superseded decisions and execution records: `docs/history/**`.
- Repository entry and commands: [README](../README.md). Security disclosure and operational
  security policy: [SECURITY](../SECURITY.md).

On conflict, the constitution wins. Within a bounded change, `spec.md` owns WHAT/WHY, `plan.md`
owns HOW, and `tasks.md` owns executable progress. GitHub issues authorize work and PRs review it;
neither silently overrides committed governance.
