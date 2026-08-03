# Implementation Baseline

**Recorded:** 2026-08-03

## Repository

```text
repository: Thunderkill016/AtoEnglish
implementation branch: integration/mvp-youtube-to-lesson
base branch: main
base SHA: 961e779886ff95b1b5f67d5e6997520d1facdb1a
initial comparison: identical (ahead 0, behind 0)
```

## Hosted services

```text
Supabase project: zpiwddskhduuykpxltun
Vercel project: atoenglish
Vercel project ID: prj_2lnCWZp4PvBvuTBksDjMtPPruVqL
Node: 24.x
npm: 11.x
```

## Source work

```text
Spec 001 source branch: agent/rebuild-learning-core
source head: e1642db1540046271f520f72f1b20a04e5d84f09
source PR: #54 (draft, non-main base)
planning PR: #56
```

## Boundaries

- Do not merge the Spec 001 branch wholesale.
- Preserve the `main` package/lock/toolchain baseline.
- Port only files named in `port-manifest.md`.
- Hosted migrations, Vercel preview, merge, and production deployment remain separate gates.
