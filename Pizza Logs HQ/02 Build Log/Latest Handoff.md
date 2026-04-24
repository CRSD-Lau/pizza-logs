# Latest Handoff

## Date
2026-04-24

## Git
**Latest:** pending commit — main branch
fix: restrict interaction scan to 0xF140 SPELL_PERIODIC_HEAL; 39 tests green

---

## Completed This Session

### Phase 1: Pre-summoned pet fix — interaction scan

Root cause: `_segment_encounters` global scan ran on ALL events, so Alliance Gunship Cannons
(`0xF150` vehicle GUIDs with `CONTROL_PLAYER` flags) were mapped as player pets → 4.46M
fake DPS attributed to whoever last buffed/hit them.

Fix in `parser_core.py` — `_segment_encounters`, global interaction scan:
```python
# Restricted to SPELL_HEAL / SPELL_PERIODIC_HEAL + 0xF14* GUID prefix
if (event in ("SPELL_HEAL", "SPELL_PERIODIC_HEAL")
    and len(parts) >= 7
    and _is_player(parts[1])
    and not _is_player(parts[4])
    and parts[4].upper().startswith("0XF14")
    and parts[4] not in pet_owner
):
    try:
        if (int(parts[6], 16) & 0x1100) == 0x1100:
            pet_owner[parts[4]] = (parts[1], parts[2].strip('"').strip())
    except (ValueError, IndexError):
        pass
```

- `0xF150` (vehicles) and `0xF130` (generic NPCs) no longer enter `pet_owner`
- Hunter/Warlock pre-summoned pets (`0xF140` prefix) still mapped via Mend Pet

### Test suite cleanup
- Renamed conflicting `PET_GUID` module-level constant to `TRUE_PET_GUID` to avoid
  shadowing by the existing `PET_GUID = "0xF1300007AC000042"` at line 644
- Removed duplicate `_mend_pet_parts` helper (kept existing one at line 651)
- All 39 tests passing

### Expected session 2 delta improvement
- Before: ~284M (overkill+P2P fix applied, Gunship cannon still mis-attributed)
- After: ~279.8M (cannon entries removed from pet_owner → ~4.46M drop)
- UWU: 276.045M — residual ~3.7M = pre-summoned pets + methodology differences

---

## Files Changed

| File | Change |
|---|---|
| `parser/parser_core.py` | `_segment_encounters`: interaction scan restricted to SPELL_HEAL/SPELL_PERIODIC_HEAL + 0xF14* prefix |
| `parser/tests/test_parser_core.py` | 4 new TDD tests; renamed `PET_GUID` → `TRUE_PET_GUID`; removed duplicate helper; 39 tests passing |

---

## Exact Next Steps
1. **Deploy**: push to Railway, wait for parser-py redeploy (~2 min)
2. **Re-upload**: clear DB at `/admin` → upload same log (2026-04-19 Notlich Lordaeron)
3. **Verify**:
   - Session 2 total should be ~279–280M (down from ~284M)
   - Gunship = 25H KILL
   - No extra fake DPS entries in Gunship participant list
4. If still delta remains: investigate remaining 0xF130 entries via diagnose.py
   - `python diagnose.py --encounter "Gunship Battle"` to see any other spurious pets

## Pending Features
- **Absorbs tracking**: parse `SPELL_ABSORBED` events
- **Persistent pet attribution Phase 2**: NPC entry ID → class lookup for remaining unknowns
- **Damage mitigation stats**: `SPELL_MISSED` subtypes
