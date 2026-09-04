from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ReportDirectoryTest(unittest.TestCase):
    def test_reports_directory_contains_docs_only_on_initial_head(self) -> None:
        for path in (ROOT / "reports").iterdir():
            if path.is_file() and path.name != ".gitkeep":
                self.assertEqual(path.suffix, ".md")


if __name__ == "__main__":
    unittest.main()
