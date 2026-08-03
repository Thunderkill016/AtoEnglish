# AtoEnglish Rebuild — Spec of Specs

## Roadmap Purpose

The rebuild is decomposed into independently testable specs. No child spec may
silently absorb another, and no agent may merge or deploy automatically.

## Owner Correction — 2026-08-03

The core AtoEnglish idea is confirmed as:

```text
learner pastes a YouTube URL
→ AtoEnglish generates a private personal English lesson
```

A fixed reviewed lesson catalog must not replace this interaction. The roadmap is
therefore ordered around making the private URL-to-lesson workflow usable first.

## Ordered Feature Specs

### 001 — Private Natural Lesson Compiler

**Outcome:** An authenticated user turns supported YouTube transcript evidence into
a typed, evidence-bound, owner-private AI lesson draft.

**Current evidence:** Substantial implementation exists on
`agent/rebuild-learning-core`: authentication ordering, transcript adapter/policy,
bounded segment selection, Gemini structured output, evidence validation, atomic
private persistence, RLS, provenance, stable failures, and desktop/mobile persisted
preview.

**Remaining blockers:** final private-production transcript decision, live Gemini
key/path, clean integration with current main, exact-head hosted/Vercel learner
journey, and owner release acceptance.

**Hard boundary:** generated lessons remain private AI drafts; no automatic
publication and no claim that every YouTube video is supported.

---

### 002 — YouTube-to-Private-Lesson MVP Convergence

**Outcome:** A Vietnamese learner completes the full hosted product journey:

```text
landing
→ auth
→ paste supported YouTube URL
→ transcript + live Gemini generation
→ private ai_draft
→ transfer-gated lesson
→ private progress/library
→ return
```

**Independent value:** The actual product idea becomes usable instead of remaining
a disconnected compiler branch beside a legacy course application.

**Depends on:** current main foundation, selected Spec 001 code/evidence, hosted
Supabase/Vercel, an accepted transcript adapter decision, and live Gemini access.

**Hard boundary:**

- supported YouTube subset only;
- official playback, no media re-hosting;
- owner-private drafts and owner-only RLS;
- no whole-branch merge of PR #54;
- no public catalog/publication requirement;
- no broad curriculum, gamification, writing, social, payment, or native-app expansion;
- no automatic merge or deployment.

**Status:** Planning corrected on `spec/mvp-product-convergence`. Core direction is
confirmed; implementation authorization is still a separate decision.

---

### 003 — Human Review, Sharing, and Publication

**Outcome:** Authorized reviewers can inspect, correct, approve, reject, publish,
unpublish, and audit selected generated/source lesson packages.

**Independent value:** Private lessons can later become trustworthy shared/catalog
content without making every generated draft public.

**Depends on:** private draft/provenance contracts from Specs 001–002.

**Hard boundary:** no automatic approval or mass autonomous publication.

---

### 004 — Private Library Intelligence and Capability Progression

**Outcome:** Private/generated and reviewed lessons map to communication
capabilities; the product can recommend what to generate, revisit, or learn next
without presenting a grammar syllabus.

**Depends on:** real learner attempt evidence from Spec 002 and reviewed metadata
when available.

**Hard boundary:** no fabrication to fill coverage gaps and no grammar-first
learner navigation.

---

### 005 — Delayed Transfer and Retention Evidence

**Outcome:** Learners return for reduced-support tasks with changed speakers/data
and the product separates immediate completion from delayed retention/transfer.

**Depends on:** bounded attempts from Spec 002 and capability mapping from Spec 004.

**Hard boundary:** no raw audio retention by default and no mastery claims from one
attempt.

---

### 006 — Pilot Expansion and Product Evidence

**Outcome:** Use activation, successful generation, unsupported-source rate,
lesson completion, return, support cost, willingness to pay, and renewal evidence
to decide whether to expand.

**Hard boundary:** no broad catalog, payments platform, social system, or vanity
roadmap before evidence.

## Delivery Gates

A spec may enter implementation only when its product decision is accepted, user
stories are testable, plan/tasks/analysis are consistent, exact dependencies are
visible, and the owner grants implementation permission when required.

A spec is complete only after exact-head repository, hosted database, required
live-provider, browser, security, and owner evidence. Merge and deployment remain
separate owner decisions.

## Current State

```text
Planning branch:          spec/mvp-product-convergence
Core product direction:   confirmed
Implementation branch:    not created
Implementation:           not yet explicitly authorized
Hosted migration:         not authorized
Preview:                  not authorized
Merge:                    not authorized
Production deployment:    not authorized
```