# Latest Handoff

## Date
2026-04-21

## Git
**Latest:** `TBD after commit` — main branch

---

## Completed This Session

### Forensic Code Review + Two Root-Cause Fixes

**Problem**: Session total damage 289.38M vs UWU 276.04M (+13.33M); Gunship Battle showing as WIPE.

#### Fix 1 — DAMAGE_SHIELD removed from DMG_EVENTS (`parser/parser_core.py`)
- `DAMAGE_SHIELD` events = Retribution Aura / Thorns reflect damage, triggered by boss attacks on players
- NOT player-initiated output — UWU and Warcraft Logs both exclude this event type
- Was accumulating 10–15M across a full ICC clear in a 25-player raid with Paladin/Druid tanks
- One-line deletion from the `DMG_EVENTS` set

#### Fix 2 — Gunship kill detection special case (`parser/parser_core.py`, `_infer_outcome`)
- Gunship Battle ends via scripted ship destruction, not a named boss UNIT_DIED
- High Captain Justin Bartlett does NOT produce UNIT_DIED at fight end on Warmane 3.3.5a
- General loop found no matching event → fell through to `return "WIPE"`
- Fix: added Gunship-specific block (mirroring existing Valithria pattern) — any Skybreaker crew UNIT_DIED within the segment = KILL

---

## Files Changed

| File | Change |
|---|---|
| `parser/parser_core.py` | Removed `DAMAGE_SHIELD` from `DMG_EVENTS`; added Gunship kill detection block in `_infer_outcome` |
| `Pizza Logs HQ/09 Bugs and Blockers/Known Issues.md` | Closed Gunship/damage bugs, downgraded Marrowgar to yellow |

---

## Architecture Notes
- `DAMAGE_SHIELD` was also used as an encounter window extension event — removing it is correct, encounter detection should not be driven by thorns procs
- Gunship special case placed after the Valithria block, before the general UNIT_DIED loop
- `"gunship" in bn` check is safe — `bn` is already lowercase at that point

---

## Exact Next Steps
1. **Deploy**: push to Railway, wait for parser-py to redeploy
2. **Re-upload**: clear DB at `/admin` → upload same log
3. **Verify**:
   - Session total should drop from 289.38M toward ~276M
   - Gunship Battle should show as **KILL**
   - Marrowgar Lausudo DPS should drop from ~9.45k toward 9.3k
4. If Gunship still WIPE: run `diagnose.py` locally to confirm crew UNIT_DIED events fall within segment window
5. If total still significantly over UWU: check `diagnose.py` orphan pets section (Hunter beast, Warlock demon)

## Pending Features
- **Absorbs tracking**: parse `SPELL_ABSORBED` events — parser + schema + UI work (L effort)
- **Persistent pet attribution**: Hunter beasts / Warlock demons summoned before log starts — no SPELL_SUMMON to key off
- **Damage mitigation stats**: `SPELL_MISSED` subtypes (ABSORB, BLOCK, PARRY, DODGE)
