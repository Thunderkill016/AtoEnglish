# Curriculum verification entry point

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md)

AtoEnglish uses one repository-owned command for curriculum-facing changes:

```bash
npm run verify
```

For a faster implementation loop:

```bash
npm run verify:fast
```

To inspect the planned checks without executing them:

```bash
npm run verify:plan
```

## Full technical gate

The default curriculum profile runs existing repository checks in this order:

1. focused lesson regression tests;
2. lesson content-standard tests;
3. TypeScript;
4. full ESLint;
5. full unit suite;
6. production build.

The runner reports every check as `passed`, `failed`, or `unavailable`. An unavailable check is not treated as success.

The fast profile runs the first three checks only. It is suitable during implementation, not as final merge evidence.

## Manual product review

Technical success does not prove scope correctness. Before a curriculum pull request is accepted, the reviewer must also:

- confirm the changed lesson still matches its task-level can-do outcome;
- open the changed lesson and one neighboring unit in the preview;
- compare title, step count, section labels, and navigation;
- explain every changed shared file against the approved scope;
- confirm analytics payloads contain no learner audio, transcripts, names, employers, email addresses, or free-text learner content;
- record unavailable checks instead of claiming they passed.

## Current boundary

Only the `curriculum` profile exists. Add another profile only after at least two real tasks show that the current profile cannot verify a repeated change surface.

This command does not merge, deploy, approve a pull request, replace manual learner review, or prove learning effectiveness.
