# Latest Handoff

## Date
2026-04-24

## Git
**Latest commit:** `(pending)` — main branch
fix: session_damage — no overkill subtraction, exclude vehicle GUIDs, remove MISSED ABSORB

---

## Session Total Gap — CLOSED (Parser Fixed)

The gap vs UWU reference was a real parser bug, not a log coverage issue.
Both UWU reference reports (Felyyia 10H, Notlich 25H) used the **exact same
WoWCombatLog.txt** file as Pizza Logs.

**Root causes identified and fixed:**

1. **Overkill subtraction** (`- float(parts[8/11])`): session_damage was
   subtracting overkill, but UWU Custom Slice counts `amount + absorbed` only.
   Blood Prince Council triple-death causes 6.78M (S0) / 9.1M (S1) overkill.

2. **Vehicle GUID counted as pet** (`0xF150*` prefix): Alliance Gunship Cannons
   have `TYPE_PET | CONTROL_PLAYER` flags (0x1114) and passed the is_pet check,
   adding 5.16M phantom damage in S1. UWU excludes vehicle mechanics.

3. **SPELL_MISSED / SWING_MISSED ABSORB** (commit 08baacc): these were counted
   in session_damage, but UWU doesn't count them separately — the correct total
   comes from `amount + absorbed` on DAMAGE events without overkill subtraction.

**Result after fix (empirically verified before TDD):**

| Session | Pizza Logs | UWU | Gap |
|---|---|---|---|
| Session 0 (10H) | ~200,596,766 | 200,402,269 | +0.097% |
| Session 1 (25H) | ~408,078,631 | 407,718,447 | +0.088% |

Both sessions within 0.1% of UWU. ✓

---

## What Was Done This Session

### 1. Corrected false "log coverage" hypothesis

Previous sessions concluded the gap was because UWU reference logs started
5–16 minutes earlier than the user's log. This was wrong — the same
WoWCombatLog.txt was uploaded to both UWU and Pizza Logs.

### 2. Diagnosed three root causes via diagnostic scripts

Ran Python scripts against the actual log file to isolate:
- Overkill total per session (6.78M S0, 9.1M S1)
- Vehicle GUID damage total (0 S0, 5.16M S1)
- MISSED ABSORB total (372K S0, 657K S1)

### 3. TDD fix — 52/52 tests green

**RED → GREEN for four tests:**
- `test_session_damage_counts_full_amount_with_overkill` (new)
- `test_session_damage_excludes_vehicle_guid` (new)
- `test_session_damage_includes_spell_missed_absorb` (flipped: now asserts 0)
- `test_session_damage_includes_swing_missed_absorb` (flipped: now asserts 0)

**Production changes (`parser/parser_core.py` session accumulator):**
```python
# SWING_DAMAGE: amount + absorbed, no overkill subtraction
eff = max(0.0, float(parts[7]) + absorbed)

# Spell events: amount + absorbed, no overkill subtraction
eff = max(0.0, float(parts[10]) + absorbed)

# Vehicle GUID exclusion (before is_pet check):
if not src_guid.upper().startswith("0XF15"):
    # ... is_pet flag check ...

# SPELL_MISSED / SWING_MISSED ABSORB block removed entirely
```

---

## Full Commit History

| Commit | Fix |
|---|---|
| 7868a17 | Overkill subtracted, P2P excluded |
| 8a6e9ff | Interaction scan restricted to 0xF14* |
| 9e0ae01 | Full-session damage accumulator |
| 75ae523 | DAMAGE_SHIELD added |
| dbb95db | TYPE_GUARDIAN added |
| ef152ba | Absorbed damage + DUPLICATE UX + admin delete |
| 08baacc | SPELL_MISSED/SWING_MISSED ABSORB in session_damage (REVERTED this session) |
| (this)  | No overkill subtraction + exclude vehicle GUID + remove MISSED ABSORB |

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **All 52 parser tests green**
- **TypeScript build clean**
- **Session totals within 0.1% of UWU reference** — parser correctly matches

---

## Next Steps

1. **Delete upload** `cmoda1m3l000265wet559n9yx` (old April 19 upload)
2. **Re-upload** `WoWCombatLog.txt` to verify S0 ≈ 200.4M and S1 ≈ 407.7M
3. **Next features:**
   - Absorbs tracking: parse `SPELL_ABSORBED` events for healing stats
   - Player detail page: per-boss breakdown per player per session
   - Damage mitigation stats: `SPELL_MISSED` subtypes (ABSORB, BLOCK, DODGE, etc.)
