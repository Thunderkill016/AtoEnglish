# Quickstart: AtoEnglish MVP Product Convergence

This guide is for the future implementation pass after the owner accepts the MVP
specification. It does not authorize merge, migration, preview deployment, or
production deployment by itself.

## 1. Read the governing artifacts

Read in this order:

```text
.specify/memory/constitution.md
specs/002-mvp-product-convergence/spec.md
specs/002-mvp-product-convergence/plan.md
specs/002-mvp-product-convergence/research.md
specs/002-mvp-product-convergence/data-model.md
specs/002-mvp-product-convergence/contracts/mvp-contract.md
specs/002-mvp-product-convergence/tasks.md
specs/002-mvp-product-convergence/analysis.md
specs/001-private-natural-lesson-compiler/
```

Spec 001 is evidence and reusable implementation material. Spec 002 governs the
learner-facing MVP convergence.

## 2. Freeze the implementation baseline

Resolve the current `main` head immediately before implementation.

```bash
git fetch origin --prune
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

Create the implementation branch from that exact `main` head:

```bash
git switch -c integration/mvp-product-convergence
```

Do not merge `agent/rebuild-learning-core` or PR #54 into this branch.

## 3. Create the port manifest before copying code

Create:

```text
specs/002-mvp-product-convergence/port-manifest.md
```

For every candidate path from Real Talk or other open branches, record:

```text
source branch
source SHA
source path
classification: port | adapt | reference | reject
destination path
reason
required verification
```

Review the manifest before the first implementation commit.

## 4. Keep the main toolchain baseline

Use the current `main` versions of:

- `.nvmrc`;
- `package.json` engine/package-manager declarations;
- `package-lock.json`;
- GitHub verification workflow;
- removed legacy dependency decisions.

After adding only required dependencies:

```bash
node --version
npm --version
npm ci --no-audit --prefer-offline
```

Do not restore `gtts`, `request`, `har-validator`, or `uuid@3` through a branch
merge.

## 5. Align the hosted environment

MVP hosted services:

```text
Supabase project: zpiwddskhduuykpxltun
Vercel project:   atoenglish
Node runtime:     24.x
```

Before implementation, confirm the local environment contains the public
Supabase URL/key for that project and the required preview-only secrets. Never
print or commit secret values.

Generate types from the same project:

```bash
npm run db:types
```

The `db:types` script must point to `zpiwddskhduuykpxltun` before using it.
Review the generated diff; never edit `src/types/supabase.ts` manually.

## 6. Implement by user story

Follow `tasks.md` dependency order.

Recommended stopping checkpoints:

1. **Shell checkpoint** — landing, auth, route protection, navigation, and focused
   dashboard work with controlled fixtures.
2. **Content checkpoint** — three human-reviewed lessons are published through a
   controlled database operation and no static fallback remains.
3. **Runtime checkpoint** — one lesson requires first listening, retrieval,
   speak-and-confirm, and transfer.
4. **Persistence checkpoint** — a learner returns to the correct state and another
   user is denied by RLS.
5. **Preview checkpoint** — the complete journey passes on desktop and mobile.

Do not start the next checkpoint while the current one has unresolved critical
failures.

## 7. Database workflow

Before DDL:

1. inspect hosted constraints, grants, policies, and generated types;
2. decide whether existing evidence storage can satisfy the strict attempt
   contract;
3. create a versioned migration only after the model is final;
4. run contract tests against the SQL text;
5. obtain owner authorization before applying the hosted migration;
6. run two-user and anonymous verification;
7. run Supabase security and performance advisors;
8. regenerate types;
9. record rollback and cleanup evidence.

Do not apply `20260731162613_learning_attempts.sql` by default. It requires a new
explicit adoption decision.

## 8. Content-review workflow

For every MVP lesson:

1. identify canonical media and source context;
2. record item-level rights/provenance;
3. listen to the complete bounded segment;
4. correct exact words, timestamps, and speaker turns;
5. review Vietnamese guidance and answer evidence;
6. review safety, age suitability, and level;
7. review changed-context transfer;
8. record human reviewer identity/date/decision;
9. publish only after all required fields pass.

The initial launch gate is three reviewed lessons in one environment and at least
two speakers or contexts.

## 9. Required verification commands

Run focused checks during implementation and the full gate on the exact final
head.

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run test:content-standard
npm run test:integration
npm run build
```

Run the MVP-specific Playwright suite against a production build on desktop and
mobile. It must cover:

```text
landing
→ signup/login
→ dashboard
→ reviewed catalog
→ lesson start
→ support/retrieval/speech/transfer
→ completion
→ logout/login
→ restored dashboard state
```

## 10. Create one intentional preview

Only after local/GitHub gates pass, create or update:

```text
preview/mvp-product-convergence
```

Vercel is configured to deploy `preview/**` branches. Verify:

- deployment is READY;
- expected commit SHA is deployed;
- the same hosted Supabase project is used;
- desktop/mobile journey passes;
- no critical runtime error cluster appears;
- editor-only generation is not exposed;
- static sample lessons do not appear.

## 11. Convergence and release

Before requesting owner acceptance:

- update every task checkbox from observed evidence only;
- complete the requirement checklist;
- update `analysis.md` with final requirement-to-evidence results;
- record the reviewed corpus IDs and publication state;
- record hosted migration and advisor results;
- record Vercel deployment ID and tested commit;
- list unresolved risks honestly.

Only after owner acceptance:

1. prepare a clean PR targeting `main`;
2. run exact-head checks again if the head changes;
3. request explicit merge authorization;
4. request separate explicit production-deployment authorization;
5. smoke-test production and preserve rollback information.

A successful preview does not authorize merge or deployment.