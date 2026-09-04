# Contract: Core Acceleration and Vetted Open-Source Matrix V1

- **Contract Identifier**: `nep.vetted-oss-matrix.v1`.
- **Contract Version**: `1`.
- **Reuse-First Policy Invariants**:
  - A commodity capability MUST NOT be built from scratch without first auditing the vetted open-source matrix.
  - Decision hierarchy MUST proceed in order:
    1. Direct library dependency (permissive license, pure TS/Wasm/ONNX, low footprint).
    2. Pinned source adaptation (pure invariant algorithm, explicit provenance and attribution).
    3. Isolated local service / sidecar (native runtime, PyTorch/Java, or LGPL process boundary).
    4. Baseline / benchmark donor only (offline comparative validation).
    5. Internal build only when 1–4 are formally unviable.
- **Constitutional Epistemic Boundary**:
  - External engine outputs are strictly classified as **Raw Observations** (`CoreObservation`).
  - Open-source adapters MUST NOT emit certified evidence, durable calibration authority, or learner mastery.
  - ASR confidence, VAD probabilities, grammar flags, and BKT probabilities cannot mutate learner skill projections directly.
- **Copyleft Isolation Invariants**:
  - **LGPL-2.1+**: Components like LanguageTool MUST operate across an isolated network/process boundary (loopback HTTP/REST or IPC daemon). Direct bundling/linking into the core TypeScript package is strictly prohibited.
  - **GPL-3.0+**: Direct linking of GPLv3 components (e.g. `bootphon/phonemizer`) into core distribution is REJECTED.
  - **Non-Commercial**: Any model or code carrying non-commercial restrictions (`CC-BY-NC`) is strictly REJECTED from the production path.
- **Provenance & Attribution Invariants**:
  - Every vetted engine MUST have pinned upstream repository URL, release tag, and an immutable full 40-character hexadecimal git commit SHA (`/^[0-9a-f]{40}$/i`). Tag strings or short SHAs are strictly prohibited.
  - Upstream copyright notices, licenses, and author citations MUST be preserved in the third-party notice registry.
  - Code and model/data licenses MUST be evaluated independently; permissive code never auto-approves incompatible model/data terms under direct linking.
- **Adapter Contract Invariants**:
  - All adapter contracts (`AsrAdapterContract`, `VadAdapterContract`, `LinguisticAdapterContract`, `AlignmentAdapterContract`, `BktAdapterContract`) MUST be pure TypeScript interfaces emitting typed raw observation payloads.
  - Adapter failures MUST produce typed problem codes, never unhandled exceptions.
  - The Nếp-owned constructor `createVettedCoreObservation` wraps raw payloads into canonical `CoreObservation` envelopes with explicit `authority: "none"` and unvalidated shadow calibration.
  - Injected authority, mastery, or calibration fields MUST trigger immediate fail-closed rejection.
- **Purity & Determinism**:
  - The registry, policy engine, adapters, and observation wrapper MUST be pure and deterministic with zero ambient time (`new Date()`, `Date.now()`) or network dependencies.
  - Given identical semantic inputs and explicit ISO timestamp string, adapter execution MUST replay byte-deterministically.

