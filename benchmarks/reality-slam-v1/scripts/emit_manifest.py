from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import rfc8785

CONTRACT_ID = "nep.reality-benchmark.v1"
CONTRACT_VERSION = 1
BASELINES = {"B0", "B1", "B2", "B3", "B4"}
STATUSES = {
    "reproduced",
    "candidate-better",
    "no-evidence-of-improvement",
    "candidate-worse",
    "invalid-run",
    "not-applicable",
}
TRACKS = {"en_es", "es_en", "fr_en"}
SPLITS = {"train", "dev", "test"}
FIT_PHASES = {"train-only", "train-plus-dev"}


class ManifestError(ValueError):
    pass


def _require(obj: dict[str, Any], key: str) -> Any:
    if key not in obj:
        raise ManifestError(f"manifest is missing required field {key!r}")
    return obj[key]


def validate_manifest_draft(manifest: dict[str, Any]) -> None:
    if "manifestDigest" in manifest:
        raise ManifestError("draft manifest must omit manifestDigest before canonicalization")
    if _require(manifest, "contractId") != CONTRACT_ID:
        raise ManifestError("unexpected contractId")
    if _require(manifest, "contractVersion") != CONTRACT_VERSION:
        raise ManifestError("unexpected contractVersion")
    if _require(manifest, "baselineId") not in BASELINES:
        raise ManifestError("unsupported baselineId")
    if _require(manifest, "track") not in TRACKS:
        raise ManifestError("unsupported track")
    if _require(manifest, "sourceSplit") not in SPLITS:
        raise ManifestError("unsupported sourceSplit")
    if _require(manifest, "fitPhase") not in FIT_PHASES:
        raise ManifestError("unsupported fitPhase")
    if _require(manifest, "status") not in STATUSES:
        raise ManifestError("unsupported status")
    if _require(manifest, "leakagePolicyId") != "nep.slam-causal-mask.v1":
        raise ManifestError("unexpected leakagePolicyId")

    for key in (
        "codeCommitSha",
        "dataset",
        "featureSetId",
        "baselineSource",
        "model",
        "runtime",
        "resources",
        "metrics",
        "eligibleTrackCount",
        "comparison",
        "decisionNote",
    ):
        _require(manifest, key)

    dataset = manifest["dataset"]
    if not isinstance(dataset, dict):
        raise ManifestError("dataset must be an object")
    if dataset.get("doi") != "10.7910/DVN/8SWHNO":
        raise ManifestError("unexpected dataset DOI")
    if dataset.get("datasetLicense") != "CC-BY-NC-4.0":
        raise ManifestError("dataset license must remain explicit CC-BY-NC-4.0")
    if dataset.get("commercialUseAllowed") is not False:
        raise ManifestError("commercialUseAllowed must be false for this benchmark corpus")
    if dataset.get("redistributionAllowedByNepPolicy") is not False:
        raise ManifestError("raw redistribution must remain disabled by Nếp project quarantine policy")
    artifacts = dataset.get("artifacts")
    if not isinstance(artifacts, list) or not artifacts:
        raise ManifestError("dataset.artifacts must record at least one staged artifact")

    metrics = manifest["metrics"]
    if not isinstance(metrics, dict):
        raise ManifestError("metrics must be an object")
    for key in (
        "auc",
        "f1At05",
        "logLoss",
        "tokenCount",
        "learnerCount",
        "positiveCount",
        "positivePrevalence",
        "coverage",
    ):
        _require(metrics, key)


def finalize_manifest(manifest: dict[str, Any]) -> dict[str, Any]:
    validate_manifest_draft(manifest)
    canonical_bytes = rfc8785.dumps(manifest)
    digest = hashlib.sha256(canonical_bytes).hexdigest()
    return {**manifest, "manifestDigest": f"sha256:{digest}"}


def verify_manifest(manifest: dict[str, Any]) -> bool:
    digest = manifest.get("manifestDigest")
    if not isinstance(digest, str) or not digest.startswith("sha256:"):
        return False
    draft = {key: value for key, value in manifest.items() if key != "manifestDigest"}
    try:
        expected = finalize_manifest(draft)["manifestDigest"]
    except (ManifestError, rfc8785.CanonicalizationError):
        return False
    return digest == expected


def main() -> int:
    parser = argparse.ArgumentParser(description="Finalize a CORE-REALITY-001 experiment manifest with RFC 8785 + SHA-256")
    parser.add_argument("--draft", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    raw = json.loads(args.draft.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ManifestError("manifest draft JSON must be an object")
    final = finalize_manifest(raw)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(final, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(final["manifestDigest"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
