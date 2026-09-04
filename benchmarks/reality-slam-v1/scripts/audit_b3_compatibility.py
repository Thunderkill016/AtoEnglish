from __future__ import annotations

import argparse
import json
from pathlib import Path

TRACK_LANGUAGE = {
    "en_es": ("English", True),
    "es_en": ("Spanish", False),
    "fr_en": ("French", False),
}

# These semantics are required by the final #137 evidence contract but are not directly
# observable in original SLAM rows. They must never be defaulted merely to obtain a B3 score.
REQUIRED_UNAVAILABLE_SLAM_FIELDS = (
    "canonicalOntologyNodeId",
    "coreEvidenceRole",
    "supportLevel",
    "revealUsed",
    "validatedTaskSemantics",
    "changedContextTransferSemantics",
    "repositoryValidatedEvidenceProvenance",
)


def audit_track(track: str, total_rows: int) -> dict[str, object]:
    if track not in TRACK_LANGUAGE:
        raise ValueError(f"unsupported track {track!r}")
    if total_rows < 0:
        raise ValueError("total_rows must be non-negative")

    target_language, language_compatible = TRACK_LANGUAGE[track]
    # V1 deliberately does not guess missing evidence semantics. Even en_es is therefore
    # not automatically eligible just because its target language is English.
    return {
        "track": track,
        "targetLanguage": target_language,
        "ontologyLanguageCompatible": language_compatible,
        "totalRowsAudited": total_rows,
        "mappedRows": 0,
        "unmappedRows": total_rows,
        "mappingCoverage": 0.0,
        "requiredButUnavailableFields": list(REQUIRED_UNAVAILABLE_SLAM_FIELDS),
        "eligibleForB3": False,
        "decision": "b3-not-applicable-on-slam",
        "rationale": (
            "Original SLAM rows do not contain enough prospectively known Nếp task/evidence semantics "
            "to construct CoreEvidenceForRouting without guessing. Language compatibility alone is insufficient."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Emit the pre-R2 SLAM -> Nếp compatibility audit")
    parser.add_argument("--track", choices=sorted(TRACK_LANGUAGE), required=True)
    parser.add_argument("--total-rows", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    result = audit_track(args.track, args.total_rows)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
