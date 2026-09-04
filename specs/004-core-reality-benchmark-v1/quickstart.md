# Quickstart: Reality Benchmark Harness V1

- **Contract Identifier**: `nep.reality-benchmark.v1`.
- **Governing Purpose**: Guide researchers and maintainers through staging the SLAM dataset, running adversarial leakage tests, executing stage gates, and verifying experiment manifests.

---

## 1. Prerequisites

- **Node.js**: Version $\ge 22.0.0$.
- **Disk Space**: $\approx 2.5\text{ GB}$ for compressed SLAM archives and cached feature buffers.
- **RAM**: Minimum $4\text{ GB}$ available (harness runs within $\le 1.5\text{ GB}$ heap).

---

## 2. Dataset Staging, License Terms & Quarantine

The Duolingo SLAM 2018 dataset is distributed on Harvard Dataverse under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
- **Usage Boundary**: Research only (`commercialUseAllowed: false`, `redistributionAllowed: false`).
- **Production Quarantine**: The raw dataset, feature caches, and directly derived model weights MUST NOT enter the production database, application, or commercial feature services.
- **Fail Closed**: Dataset terms must be verified at retrieval time; if terms cannot be verified, execution halts.

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

Verify that `.cache/` remains strictly gitignored to prevent raw dataset leakage into version control.

---

## 3. Running Unit & Adversarial Tests

Run the test suite verifying parser fidelity, zero-leakage chronological tracking, TEST split label masking, DeLong test calculations, and integrity digest generation:

```bash
npx vitest run src/lib/reality-benchmark/reality-benchmark.test.ts
```

---

## 4. Executing Benchmark Stage Gates

### Gate R0: Reproduce Official Baseline
```bash
npx tsx src/lib/reality-benchmark/benchmark-runner.ts --gate R0 --track es_en --split dev
```

### Gate R1: Simple History Baseline
```bash
npx tsx src/lib/reality-benchmark/benchmark-runner.ts --gate R1 --track es_en --split dev
```

### Gate R2: Nếp Representation Ablation
```bash
npx tsx src/lib/reality-benchmark/benchmark-runner.ts --gate R2 --track es_en --split dev --compare B2
```

### Full Benchmark Sweep (All Tracks)
```bash
npx tsx src/lib/reality-benchmark/benchmark-runner.ts --gate all --output reports/reality-benchmark-v1.json
```

---

## 5. Verifying Experiment Manifest Integrity

Verify that the emitted manifest has an authentic SHA-256 integrity fingerprint (unkeyed content digest) and valid status:

```bash
node -e '
  const fs = require("fs");
  const crypto = require("crypto");
  const manifest = JSON.parse(fs.readFileSync("reports/reality-benchmark-v1.json"));
  const { manifestDigest, ...rest } = manifest;
  const canonical = JSON.stringify(rest, Object.keys(rest).sort());
  const computed = crypto.createHash("sha256").update(canonical).digest("hex");
  console.log("Embedded Integrity Digest:", manifestDigest);
  console.log("Computed Digest:", computed);
  console.log("Content Integrity Verified:", manifestDigest === computed);
'
```
