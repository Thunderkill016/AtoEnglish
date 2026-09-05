from __future__ import annotations

import argparse
import json
from pathlib import Path

from utility import build_n044_utility_report


def main() -> None:
    parser = argparse.ArgumentParser(description="Emit deterministic N044 synthetic utility analysis")
    parser.add_argument("--output", required=True, help="Destination JSON path")
    args = parser.parse_args()

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    report = build_n044_utility_report()
    output.write_text(
        json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(report["report_digest"])


if __name__ == "__main__":
    main()
