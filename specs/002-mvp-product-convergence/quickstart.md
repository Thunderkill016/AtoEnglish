# Quickstart: AtoEnglish YouTube-to-Private-Lesson MVP

This guide applies after implementation is explicitly authorized. It does not by
itself authorize a hosted migration, preview, merge, or production deployment.

## 1. Read the governing artifacts

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

Spec 001 supplies compiler/private-draft evidence. Spec 002 makes paste-URL
generation the learner-facing product.

## 2. Freeze current main and create a clean branch

```bash
git fetch origin --prune
git switch main
git pull --ff-only origin main
git rev-parse HEAD
git switch -c integration/mvp-youtube-to-lesson
```

Do not merge `agent/rebuild-learning-core` or PR #54 wholesale.

## 3. Create the selective-port manifest

Create `specs/002-mvp-product-convergence/port-manifest.md` before copying code.
For each candidate path record source branch/SHA/path, `port|adapt|reference|reject`,
destination, reason, and verification.

Start with the Spec 001 application/domain/compiler/Gemini/transcript/private-draft
paths and their focused tests. Preserve current-main package/lock/toolchain.

## 4. Align environment and generated types

Required hosted targets:

```text
Supabase: zpiwddskhduuykpxltun
Vercel:   atoenglish
Node:     24.x
```

Fix the `db:types` script to use the same Supabase project, then regenerate types.
Never print secrets or edit generated types manually.

Required private preview variables include public Supabase values and a bounded
server-only Gemini key. Upstash/Sentry values are used only when configured.

## 5. Build in dependency order

Recommended checkpoints:

1. **Entry checkpoint** — truthful landing, auth, server bootstrap, protected URL-first dashboard.
2. **Source checkpoint** — valid/invalid YouTube URL, official playback, supported/unsupported transcript behavior, stable failure codes.
3. **Compiler checkpoint** — bounded segment, live Gemini structured output, evidence validation, atomic owner-private draft.
4. **Runtime checkpoint** — first listen, support, retrieval, speak-and-confirm, transfer gate.
5. **Return checkpoint** — private library, reload, logout/login, cross-user denial.
6. **Preview checkpoint** — exact hosted desktop/mobile URL-to-lesson journey.

## 6. Transcript adapter gate

Before release, record the private-production transcript decision:

- adapter ID and implementation path;
- acquisition mode;
- supported YouTube conditions;
- language/timing limits;
- known reliability/terms/rights risks;
- retry and failure codes;
- visible learner warnings;
- replacement/rollback path.

Do not call the adapter production-ready merely because mocks or controlled
fixtures pass.

## 7. Live provider verification

A mock is insufficient for the final gate.

Run a bounded controlled source through:

```text
authentication
→ transcript acquisition
→ segment selection
→ live Gemini generation
→ schema/evidence validation
→ atomic private persistence
→ reload
```

Also verify one live Gemini failure path and one unsupported-video/transcript path.
Do not log the API key, provider payload secrets, Auth tokens, or service-role key.

## 8. Database workflow

Before new DDL:

1. compare hosted schema/migrations/types to repo expectations;
2. verify existing atomic private-draft RPC and RLS;
3. decide whether existing evidence storage can model learner progress;
4. create only versioned migrations if necessary;
5. obtain owner authorization before applying;
6. test anonymous/ownerA/ownerB behavior;
7. run Supabase security/performance advisors;
8. regenerate types;
9. record rollback/cleanup.

Do not adopt the old unapplied `20260731162613_learning_attempts.sql` by default.

## 9. Required technical checks

```bash
npm run lint
npx tsc --noEmit
npm run test:real-talk
npm run test
npm run test:content-standard
npm run test:integration
npm run build
```

Run production-server Playwright on desktop and mobile for:

```text
landing
→ signup/login
→ paste supported YouTube URL
→ generation status
→ private lesson
→ first listen/support/retrieval/speech/transfer
→ completion
→ dashboard/private library
→ logout/login
→ restored state
```

Also cover malformed URL, transcript unavailable, provider failure, persistence
failure, and another user's private lesson.

## 10. Create one intentional preview

After all prerequisite gates and explicit authorization, deploy only an intentional
`preview/mvp-youtube-to-lesson` branch.

Verify:

- READY deployment matches exact commit;
- correct Supabase project and server-only Gemini key are configured;
- supported video generates a private lesson;
- unsupported video fails honestly;
- no static fixture masquerades as generated content;
- no cross-user access;
- no critical runtime errors;
- desktop/mobile journey passes.

## 11. Convergence and release

Before owner acceptance:

- update tasks from observed evidence only;
- complete the requirements checklist;
- update requirement-to-evidence analysis;
- record adapter decision, live Gemini run, hosted IDs/migrations, preview ID/SHA,
  browser evidence, cleanup, risks, and rollback;
- state explicitly that generated lessons are private AI drafts.

Only after owner acceptance prepare a clean main-targeted PR. Merge and production
deployment require separate explicit authorization.