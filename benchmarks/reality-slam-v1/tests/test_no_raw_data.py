from __future__ import annotations

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class NoRawDataTest(unittest.TestCase):
    def test_benchmark_tree_contains_no_data_archives_or_slam_split_files(self) -> None:
        forbidden_suffixes = {".tar", ".gz", ".tgz", ".zip"}
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            self.assertNotIn(path.suffix, forbidden_suffixes, msg=str(path))
            self.assertFalse(path.name.startswith("slam_"), msg=str(path))


if __name__ == "__main__":
    unittest.main()
