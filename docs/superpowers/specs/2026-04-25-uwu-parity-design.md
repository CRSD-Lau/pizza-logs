# UWU Parity — Full Parser Accuracy Design

**Date:** 2026-04-25  
**Status:** Approved  
**Goal:** Pizza Logs parser output matches UWU Logs exactly at all four levels of granularity for the same uploaded `WoWCombatLog.txt`.

---

## Problem Statement

Session-level damage totals are within 0.1% of UWU (fixed in prior sessions). The remaining gaps are:

1. Per-encounter (per-boss) damage totals are off — one session over-counts, one under-counts.
2. Healing totals do not match UWU at any level.
3. Healing stats surface for non-healer classes (DPS, tanks), polluting milestones and display.
4. Total healing column is missing from the UI (only HPS is shown).
5. Per-spell, per-target breakdown accuracy is unverified.

The app cannot earn user trust from players who already know their UWU numbers until all four levels match.

---

## Reference Log

Single file: `WoWCombatLog.txt`  
Contains two raid sessions:
- **Session 0 (S0):** 10-player — Felyyia — Lordaeron  
  UWU report: `26-04-18--23-06--Felyyia--Lordaeron`
- **Session 1 (S1):** 25-player — Notlich — Lordaeron  
  UWU report: `26-04-19--13-02--Notlich--Lordaeron`

---

## UWU Reference Values

### Session 1 (25H — Notlich) — from screenshots

| Encounter | Mode | Outcome | Duration | Total Damage | DPS | Total Healing | HPS |
|---|---|---|---|---|---|---|---|
| Custom Slice (full session) | 25H | — | 1:14:35.904 | 407,718,447 | 91,091.8 | 49,629,161 | 11,088.0 |
| Lord Marrowgar | 25H | Kill | 0:03:54.758 | 51,485,997 | 219,315.1 | 8,656,055 | 36,872.2 |
| Lady Deathwhisper | 25N | Kill | 0:02:59.008 | 35,747,394 | 199,697.1 | 3,084,597 | 17,231.6 |
| Deathbringer Saurfang | 25H | Kill | 0:03:25.553 | 47,742,135 | 232,261.9 | 4,191,806 | 20,392.8 |
| Blood Prince Council | 25H | Kill | 0:05:08.449 | 41,175,251 | 133,491.2 | 9,741,570 | 31,582.4 |
| Blood Queen Lana'thel | 25H | Kill | TBD | TBD | TBD | TBD | TBD |

> Blood Queen values to be fetched from UWU URL during harness construction.

### Session 0 (10N — Felyyia) — from UWU URLs

| Encounter | Mode | Outcome | Duration | Total Damage | DPS | Total Healing | HPS |
|---|---|---|---|---|---|---|---|
| Sindragosa | 10N | Kill (attempt 1) | TBD | TBD | TBD | TBD | TBD |
| Blood Prince Council | 10N | Kill (attempt 6) | TBD | TBD | TBD | TBD | TBD |

> S0 values to be fetched from UWU URLs during harness construction.

---

## Four Levels of Validation

### Level 1 — Session
- Total damage (Custom Slice)
- Total healing
- Session DPS / HPS

### Level 2 — Per Encounter
- Boss name, difficulty, kill/wipe
- Exact duration (seconds, 3 decimal places)
- Total useful damage + DPS
- Total healing + HPS
- Damage taken

### Level 3 — Per Player per Encounter
- Total damage, DPS, DPS%
- Total healing, HPS
- Damage taken
- Rank within encounter

### Level 4 — Per Spell per Player per Encounter
- Spell name
- Total damage / healing
- Hit count, crit count, crit %
- Average hit, min hit, max hit

---

## Approach: Validation Harness + TDD Fixes

### Validation Harness (`parser/tests/validate_uwu.py`)

A standalone Python script and pytest integration that:

1. Calls `parse_file()` against the real `WoWCombatLog.txt` (no mocks).
2. Compares all four levels of output against hardcoded UWU reference values with source annotations.
3. Prints a human-readable table:
   ```
   Metric                       UWU Expected    App Output    Delta     Status
   ------                       ------------    ----------    -----     ------
   S1 Lord Marrowgar damage     51,485,997      ???           ???       ✗
   S1 Lord Marrowgar DPS        219,315.1       ???           ???       ✗
   ...
   ```
4. Exits non-zero on any mismatch — CI fails if parity breaks.

The harness is run once before fixes to populate the "before" column, then becomes the pass/fail gate for all subsequent work.

### TDD Discipline

Every fix follows strict RED → GREEN → REFACTOR:

1. Write a failing test against the harness reference value.
2. Run it, confirm it fails for the right reason (wrong number, not a crash).
3. Write minimal parser code to make it pass.
4. Confirm all existing tests still pass.
5. Refactor only after green.

No production code is written without a failing test observed first. This is non-negotiable.

---

## Expected Fix Areas (in TDD order)

### Fix 1 — Encounter Boundary Detection
**Hypothesis:** The 30-second gap heuristic (`ENCOUNTER_GAP_SECONDS = 30`) draws incorrect start/end windows for some bosses, causing per-encounter totals to include trash damage or miss tail events.

**Validation method:** Compare our encounter `start_ts` and `end_ts` against UWU's `&s=` and `&f=` URL parameters (event line offsets). If they diverge, tune the heuristic or improve boss-event anchoring.

**Test:** `test_marrowgar_25h_encounter_duration_matches_uwu` — asserts duration within 1 second of UWU reference.

### Fix 2 — Per-Encounter Damage Formula
**Hypothesis:** UWU's "Useful Damage" = `amount - overkill`. Our parser already does this for encounters (`eff_amount = amount - overkill`). If totals still differ after boundary fix, check whether absorbed damage is included or excluded by UWU.

**Validation method:** Derive from math: if `total_damage / duration ≈ DPS` (UWU's values), formula is correct.

**Test:** `test_marrowgar_25h_total_damage_matches_uwu`

### Fix 3 — Healing Formula
**Hypothesis:** UWU healing = effective healing only (overhealing excluded). Our parser uses the same `eff_amount` path but the overkill field for heals = overhealing. Need to confirm the heal event field index used is correct.

**Warmane SPELL_HEAL fields (14 total):**
`timestamp, event, src_guid, src_name, src_flags, dst_guid, dst_name, dst_flags, spell_id, spell_name, spell_school, amount, overhealing, crit`

Effective heal = `amount` (index 11), NOT `amount - overhealing`. Overhealing does not reduce the total — it's excess. UWU shows effective healing = `amount` (what actually landed on the target).

**Test:** `test_marrowgar_25h_total_healing_matches_uwu`

### Fix 4 — Class-Aware Healing Display
**Definition:**

```python
HEALER_SPECS = {
    "Holy Priest", "Discipline Priest",
    "Holy Paladin",
    "Restoration Shaman",
    "Restoration Druid",
}
```

Detection method: scan for spec-identifying spells in the encounter (e.g., Flash of Light → Holy/Prot Paladin, Chain Heal → Resto Shaman, Rejuvenation → Resto Druid). Fall back to class from unit flags.

**Rules:**
- Healing stats shown in UI only for confirmed healer specs.
- Healing milestones only awarded to healer specs.
- Non-healer healing is still parsed and stored (for damage-taken cross-checking) but not surfaced.

**Test:** `test_non_healer_healing_not_surfaced_in_display`

### Fix 5 — Add Total Healing Column
Parser already accumulates `total_healing`. Frontend needs to expose it alongside HPS in the encounter table and session summary. This is a display-only change once parser is correct.

### Fix 6 — Per-Spell Accuracy Verification
`SpellStats` already tracks hits, crits, min/max, avg. The harness validates these against UWU's POWERS tab for at least two spells per encounter (highest-damage spell + a periodic). No parser changes expected — this is a verification pass only.

---

## Regression Test Structure

```
parser/tests/
  test_parser_core.py          # existing unit tests (52 passing)
  validate_uwu.py              # new: harness + comparison table
  test_uwu_parity_session.py   # new: Level 1 — session totals
  test_uwu_parity_encounter.py # new: Level 2 — per-boss totals
  test_uwu_parity_player.py    # new: Level 3 — per-player per-boss
  test_uwu_parity_spells.py    # new: Level 4 — per-spell breakdown
```

All new test files use the real `WoWCombatLog.txt` (path passed via env var `PIZZA_LOG_PATH`). If the file is absent, tests are skipped (not failed) so CI passes in environments without the private log.

---

## Acceptance Criteria

The work is complete when:

- [ ] `validate_uwu.py` prints all green for S0 and S1 session totals
- [ ] All Level 2 per-encounter rows pass for all bosses in both sessions
- [ ] Level 3 per-player rows pass for at least the top 5 players per encounter
- [ ] Level 4 per-spell rows pass for the top damage spell per player per encounter
- [ ] Healing stats absent from non-healer class rows in UI
- [ ] Total healing column visible in encounter table
- [ ] All 52 existing tests still pass
- [ ] TypeScript build clean

---

## Out of Scope

- UI visual polish or layout changes beyond adding the total healing column
- Heroic detection improvements (separate task)
- Gunship Battle accuracy (undetectable per CLAUDE.md)
- Damage taken breakdown (future feature)
- Absorbs tracking via `SPELL_ABSORBED` (listed in Next Features, separate task)
