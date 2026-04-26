# Now

## Status
Damage regression fix **DONE** — 64/64 tests green, 14/26 UWU checks passing.

---

## What Was Shipped This Session

| Change | File | Status |
|--------|------|--------|
| Add `filter_add_damage: bool = False` to BossDef | `parser/bosses.py` | ✅ |
| Set `filter_add_damage=True` on LDW and BPC only | `parser/bosses.py` | ✅ |
| Apply boss_guids filter only when `boss_def.filter_add_damage=True` | `parser/parser_core.py` | ✅ |
| TDD test: mechanic-unit damage included when filter_add_damage=False | `parser/tests/test_parser_core.py` | ✅ |
| Boss-mechanic healing accumulator for BQ vampiric bites (prev session) | `parser/parser_core.py` | ✅ |

---

## Open Parser Issues (not yet fixed)

### Healing overcounting (55-265% over UWU on all non-BQ bosses)
- Parts[11] (effective heal) is being used — that's correct
- Still massively over for Marrowgar (+55%), Saurfang (+264%), BPC (+127%)
- Root cause: UWU likely excludes passive proc heals (Vampiric Embrace, JoL, ILotP)
- Need to identify which SPELL_PERIODIC_HEAL events UWU excludes

### Blood-Queen healing undercounted (33.75% under UWU)
- Boss-mechanic accumulator added but BQ still 33.75% short
- Essence of the Blood Queen vampiric bites from S1 25H kill window may use different GUIDs
- Need to inspect actual log events around BQ segment to see what heals are logged

### Lady Deathwhisper damage undercounted (7.17% under UWU)
- Was 34.92% over (add damage), now 7.17% under (adds correctly filtered)
- Diff = ~2.5M — could be LDW phase 1 absorbed damage, or some LDW GUID not in boss_guids
- Lower priority

### S0 encounters missing (Sindragosa, BPC 10N)
- Not found at session_index=0
- Both are from a 10N session (different night from the 25H session)
- Session indexing bug — investigate _assign_session_indices

---

## Next Action

Priority order:
1. Investigate healing overcounting — what does UWU exclude from SPELL_PERIODIC_HEAL?
2. Fix BQ healing — inspect log events around BQ encounter for boss-sourced heals
3. Fix S0 missing sessions — check session gap detection

**Log file**: `C:/Users/neil_/Downloads/WoWCombatLog/WoWCombatLog.txt`
