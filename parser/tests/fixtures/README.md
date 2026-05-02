# Combat Log Test Fixtures

Each subdirectory is one fixture: a raw `combatlog.txt` and an `expected.json`
describing what the parser should produce.

## Directory layout

```
fixtures/
  <fixture-name>/
    combatlog.txt    — raw WoWCombatLog.txt content (can be synthetic or trimmed real log)
    expected.json    — expected parse output (see schema below)
    notes.md         — optional: source, known deviations, how to update
```

## expected.json schema

```json
{
  "encounter_count": 1,
  "encounters": [
    {
      "boss_name": "Lord Marrowgar",
      "difficulty": "25N",
      "outcome": "KILL",
      "group_size": 25,
      "duration_seconds_min": 25,
      "duration_seconds_max": 35,
      "total_damage_min": 40000,
      "total_damage_max": 50000,
      "total_healing_min": 0,
      "total_healing_max": 100,
      "participant_count_min": 1,
      "participant_count_max": 5
    }
  ]
}
```

Use `_min`/`_max` ranges for values that depend on exact event content.
For exact values (boss_name, difficulty, outcome, group_size), use exact strings/ints.

## Adding a real log fixture

1. Trim your `WoWCombatLog.txt` to the target boss pull only (use timestamps).
2. Create `fixtures/<boss-slug>-<difficulty>-real/combatlog.txt`.
3. Upload the same trimmed log to your site and note the totals shown.
4. Cross-check against Skada screenshot from the same pull.
5. Fill in `expected.json` using the verified values as `_min`/`_max` ranges (±2% tolerance).
6. Run `pytest tests/test_fixtures.py -v` and verify it passes.
7. Commit with message: `test: add fixture <boss-slug>-<difficulty>`.

## Tolerance rules

- `boss_name`, `difficulty`, `outcome`: exact match
- `group_size`: exact match
- `duration_seconds`: ±2s acceptable (use `_min`/`_max`)
- `total_damage`, `total_healing`: ±2% acceptable (use `_min`/`_max`)
- `participant_count`: exact or `_min`/`_max` range
