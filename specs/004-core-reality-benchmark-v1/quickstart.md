# Quickstart: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Guide researchers and maintainers through environment setup, dataset staging, running adversarial leakage tests, executing stage gates, and verifying tamper-evident experiment manifests.

---

## 1. Prerequisites & Environment Setup

- **Node.js**: Version $\ge 22.0.0$ (for repository quality gates and B3 learner-state bridge).
- **Python**: Version $\ge 3.10$ (for official baseline reproduction, estimator fitting, and statistical testing).
- **Disk Space**: $\approx 2.5\text{ GB}$ for compressed SLAM archives and cached feature buffers.
- **RAM**: Minimum $4\text{ GB}$ available (streaming parser keeps heap/RSS $\le 1.5\text{ GB}$).

### Setup Isolated Python Environment
In accordance with the reuse-first policy (#138), benchmark estimators run in an isolated offline environment:

```bash
cd benchmarks/reality-slam-v1
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 2. Dataset Staging, License Terms & Quarantine

The Duolingo SLAM 2018 dataset is distributed on Harvard Dataverse under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
- **Usage Boundary**: Research only (`commercialUseAllowed: false`).
- **Quarantine Policy**: `redistributionAllowed: false` is an explicit **Nếp project quarantine policy** (raw learner traces must not be committed to Git or redistributed).
- **Production Isolation**: The raw dataset, feature caches, and directly derived model weights MUST NOT enter the production database, application, or commercial feature services.
- **Fail Closed**: Dataset terms and checksums must be verified at retrieval time; if terms cannot be verified, execution halts.

Download the official dataset into the isolated, gitignored cache directory:

```bash
mkdir -p .cache/benchmarks/slam-2018
cd .cache/benchmarks/slam-2018

# Download language tracks (Harvard Dataverse DOI: 10.7910/DVN/8SWHNO)
curl -O https://dataverse.harvard.edu/api/access/datafile/:persistentId?persistentId=doi:10.7910/DVN/8SWHNO/data_es_en.tar.gz
curl -O https://dataverse.harvard.edu/api/access/datafile/:persistentId?persistentId=doi:10.7910/DVN/8SWHNO/data_en_es.tar.gz
curl -O https://dataverse.harvard.edu/api/access/datafile/:persistentId?persistentId=doi:10.7910/DVN/8SWHNO/data_fr_en.tar.gz

# Extract archives locally
tar -xzf data_es_en.tar.gz
tar -xzf data_en_es.tar.gz
tar -xzf data_fr_en.tar.gz
```

Verify that `.cache/` remains strictly gitignored.

---

## 3. Running Unit & Adversarial Tests

Run the test suite verifying parser fidelity, zero-leakage chronological tracking, split-aware evaluation label masking, cluster bootstrap calculations, and integrity digest generation:

```bash
# Test benchmark components
pytest benchmarks/reality-slam-v1/tests/
```

---

## 4. Executing Benchmark Stage Gates

### Gate R0: Reproduce Official Baseline on DEV
Reproduces the official Duolingo baseline against the Python starter oracle on the `dev` split scored against `dev.key`:
```bash
python benchmarks/reality-slam-v1/scripts/run_gate_r0.py --track en_es --split dev
```

### Gate R1: Simple History Baseline B2
Establishes the transparent recency & repetition baseline under split-aware masking:
```bash
python benchmarks/reality-slam-v1/scripts/run_gate_r1.py --track en_es --split dev
```

### Gate R2: Nếp Representation Ablation (Blocked on PR #140 Rebase)
*Note: Gate R2 requires rebasing onto the frontier after PR #140 is merged.*
```bash
python benchmarks/reality-slam-v1/scripts/run_gate_r2.py --track en_es --split dev --compare B2
```

### Full Benchmark Sweep (All Tracks)
```bash
python benchmarks/reality-slam-v1/scripts/run_gate_r4.py --sweep --output reports/reality-benchmark-v1.json
```

---

## 5. Verifying Experiment Manifest Integrity (RFC 8785 JCS)

Verify that the emitted manifest has a valid SHA-256 integrity fingerprint computed over its canonical RFC 8785 JSON representation:

```bash
python -c '
import json, hashlib, canonicaljson
with open("reports/reality-benchmark-v1.json", "r") as f:
    manifest = json.load(f)
embedded_digest = manifest.pop("manifestDigest", None)
canonical_bytes = canonicaljson.encode_canonical_json(manifest)
computed_digest = hashlib.sha256(canonical_bytes).hexdigest()
print(f"Embedded Integrity Digest: {embedded_digest}")
print(f"Computed Digest:          {computed_digest}")
print(f"Content Integrity Verified: {embedded_digest == computed_digest}")
assert embedded_digest == computed_digest, "Digest mismatch!"
'
```

*Note*: The manifest digest provides tamper-evident, content-addressed data integrity. It does NOT constitute cryptographic origin authentication.
