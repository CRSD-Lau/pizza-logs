"""Shared pytest fixtures for combat log fixture-based tests."""
import json
from pathlib import Path

FIXTURES_DIR = Path(__file__).parent


def load_fixture_dirs() -> list[Path]:
    """Return all subdirectories of fixtures/ that contain both required files."""
    return [
        d for d in FIXTURES_DIR.iterdir()
        if d.is_dir()
        and (d / "combatlog.txt").exists()
        and (d / "expected.json").exists()
    ]


def load_fixture(fixture_dir: Path) -> tuple[str, dict]:
    """Return (combatlog_text, expected_dict) for a fixture directory."""
    log_text = (fixture_dir / "combatlog.txt").read_text(encoding="utf-8")
    expected = json.loads((fixture_dir / "expected.json").read_text(encoding="utf-8"))
    return log_text, expected
