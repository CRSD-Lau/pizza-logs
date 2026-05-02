"""Plain Python helpers for loading fixture directories and fixture data.

Not a pytest conftest in the decorator sense — contains no @pytest.fixture
definitions. Imported directly by test_fixtures.py."""
import json
from pathlib import Path

FIXTURES_DIR = Path(__file__).parent


def load_fixture_dirs() -> list[Path]:
    """Return sorted subdirectories of fixtures/ that contain both required files."""
    return sorted(
        [
            d for d in FIXTURES_DIR.iterdir()
            if d.is_dir()
            and (d / "combatlog.txt").exists()
            and (d / "expected.json").exists()
        ],
        key=lambda p: p.name,
    )


def load_fixture(fixture_dir: Path) -> tuple[str, dict]:
    """Return (combatlog_text, expected_dict) for a fixture directory."""
    log_text = (fixture_dir / "combatlog.txt").read_text(encoding="utf-8")
    expected = json.loads((fixture_dir / "expected.json").read_text(encoding="utf-8"))
    return log_text, expected
