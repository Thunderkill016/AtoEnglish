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
  - Every vetted engine MUST have pinned upstream repository URL, release tag, and commit SHA.
  - Upstream copyright notices, licenses, and author citations MUST be preserved in the third-party notice registry.
- **Adapter Contract Invariants**:
  - All adapter contracts (`AsrAdapterContract`, `VadAdapterContract`, `LinguisticAdapterContract`, `AlignmentAdapterContract`, `BktAdapterContract`) MUST be pure TypeScript interfaces emitting typed observation payloads.
  - Adapter failures MUST produce typed problem codes, never unhandled exceptions.
- **Purity & Determinism**:
  - The registry and policy engine MUST be pure and deterministic with zero ambient time or network dependencies.
