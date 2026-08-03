# Verification Evidence: Private Natural Lesson Compiler

**Observed date**: 2026-08-02  
**Branch**: `agent/rebuild-learning-core`  
**Observed head**: `20f5706c7a22efe37027a05e54f0ba7453c6f3b9`  
**GitHub Actions workflow**: Verify run #88  
**Run ID**: `30753932568`  
**Job ID**: `91512723781`  
**Conclusion**: success

This record captures technical evidence only. It does not replace live Gemini,
Supabase RLS, browser, source-rights, transcript, or human pedagogical review.

## Passed gates

| Gate | Observed result |
|---|---|
| Dependency installation | success with warnings recorded below |
| `npm run lint` | success |
| `npx tsc --noEmit` | success |
| `npm run test:real-talk` | 9 test files, 71 tests passed |
| `npm run test` | 35 test files, 335 tests passed |
| `npm run test:content-standard` | 1 test file, 50 tests passed |
| `npm run build` | Next.js 16.2.9 production build succeeded; 89 pages generated/processed |

The targeted Real Talk suite covered:

- canonical HTTPS YouTube source parsing and lookalike-host rejection;
- generation schema and source-evidence validation;
- transcript-source production fail-closed policy;
- stable generation result codes;
- auth/rate/compiler/persistence orchestration;
- private-draft migration contract;
- persisted draft row mapping;
- environment-first lesson preview;
- phrase-production and changed-context transfer completion gates.

## Failures discovered and fixed during verification

1. `@types/web-push@^6.4.1` did not exist on npm. `package.json` was
   reconciled with the lockfile at `^3.6.4`.
2. The application accepted a non-URL string before authentication. A canonical
   YouTube source contract now accepts only supported HTTPS YouTube watch,
   shorts, embed, mobile, or `youtu.be` URLs with an 11-character video ID.
3. The new YouTube source suite initially ran in both jsdom and Node projects.
   Project assignment was corrected so the domain suite runs once in Node.

## Non-blocking warnings observed

- npm reported an optional peer mismatch between Sentry server utilities and
  Vite 8.
- npm reported deprecated transitive packages including `request`,
  `har-validator`, an old `uuid`, and `node-domexception`.
- npm reported install scripts awaiting explicit allow-list review for Sentry
  CLI, esbuild, sharp, and unrs-resolver.
- an unrelated lesson-presentation suite emitted React `act(...)` environment
  warnings while still passing.
- the production build skipped Sentry release and source-map upload because no
  auth token was provided; compilation and page generation still succeeded.
- GitHub Actions emitted a checkout cleanup warning for
  `.gitlab-ci-local/builds/.docker` because the path has no matching submodule
  URL.
- GitHub Actions warned that actions implemented on Node 20 are being forced to
  run on Node 24.

These warnings are visible follow-up maintenance items. They are not evidence of
live provider, database, browser, or production readiness.

## Still unverified

- Gemini live success, malformed output, rate limit, provider outage, and
  adversarial-source behavior;
- application or dry-run of the Real Talk migration in an authorized
  non-production Supabase project;
- owner A / owner B / anonymous RLS behavior against that migrated project;
- repeated generation and partial-write behavior against a real database;
- regenerated Supabase types;
- desktop/mobile official playback, oEmbed, and persisted-draft preview;
- human review of rights, transcript, speaker attribution, pragmatic meaning,
  Vietnamese guidance, and transfer coherence;
- a production-approved transcript acquisition mode.

## Final-head rule

Any commit after the observed head requires another Verify run. The PR body must
record the final exact branch head and its final successful workflow run before
T088 or convergence can be considered complete.
