# Reality SLAM Benchmark V1

Offline research harness for Issue #141 / contract `nep.reality-benchmark.v1`.

This directory implements the reality-first lane that is independent of PR #140:

- B0: prevalence baseline;
- B1: exact staged official SLAM starter/evaluator oracle (the upstream artifact is never committed here);
- B2: leakage-safe learner-history baseline using a vetted sklearn estimator;
- pre-R2 compatibility audit scaffolding.

B3 is intentionally blocked until the final `nep.learner-evidence-state.v1` contract from PR #140 is independently accepted, merged into `frontier/nep-core-foundation-v1`, and this branch is rebased.

## Data boundary

The SLAM 2018 corpus is not committed to Git. The project classifies the Harvard Dataverse dataset as CC BY-NC 4.0 and quarantines raw bytes under `.cache/benchmarks/slam-2018/`. Respect Dataverse access/Guestbook requirements. The resolver may inspect metadata, but download code must fail closed when terms have not been legitimately accepted.

Expected local layout:

```text
.cache/benchmarks/slam-2018/
  upstream/
  work/
  features/
```

No raw corpus, gold key, starter-code archive, extracted upstream source, model output, or generated feature cache belongs in the repository.

## Quick checks

```bash
python -m unittest discover -s benchmarks/reality-slam-v1/tests -p 'test_*.py'
```

The benchmark-specific GitHub workflow installs the pinned research dependencies and executes the same tests. Repository Verify remains separate.

## Scientific boundary

A green harness proves repository/method correctness only. B0/B1/B2 results do not prove learning efficacy, mastery, retention, transfer, Vietnamese-learner validity, or production readiness. B3 may be reported as `not-applicable-on-slam` if canonical Nếp evidence cannot be constructed from SLAM observables without guessing.