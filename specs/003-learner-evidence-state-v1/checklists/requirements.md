# Specification Quality Checklist: Core Learner Model V1

- [x] Canonical ontology binding is explicit.
- [x] Observation != evidence != state != mastery.
- [x] Unknown is not zero.
- [x] Role/activity/modality/support/reveal boundaries are explicit.
- [x] Changed-context transfer requires exact role/distance pairing and prior baseline context.
- [x] Failed transfer remains failed transfer evidence.
- [x] Accepted lineage and duplicate identity are retained for deterministic replay.
- [x] Projection uses `decisionScope: "routing-only"`; no projection `authorityScope` or mastery flag.
- [x] Legacy compatibility preserves V1 model/status provenance.
- [x] Core has no ambient time/random/network/DB/provider dependency.
- [x] Envelope parser is total/non-throwing and grants no brand.
- [x] Public SHA-256 is treated as integrity only.
- [x] Detached JSON/cloned/rehashed envelopes cannot mint repository-reference routing evidence.
- [x] Envelope compatibility helper accepts only still-branded in-process sealed evidence.
- [x] Durable/reference envelope parsing is symmetric but remains untrusted.
- [ ] Exact-head focused/full verification and independent re-review PASS.
