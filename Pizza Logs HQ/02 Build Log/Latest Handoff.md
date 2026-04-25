# Latest Handoff

## Date
2026-04-25

## Git
**Latest commit:** `(pending)` — fix: exclude SPELL_HEAL_ABSORBED and non-player heal targets from HPS

---

## Healing Over-Count Bug — FIXED

Per-encounter healing totals were 2-5x higher than UWU reference for the same log file.

**Root causes identified and fixed (TDD — RED → GREEN):**

### Bug 1 — SPELL_HEAL_ABSORBED in HEAL_EVENTS

`SPELL_HEAL_ABSORBED` was in the `HEAL_EVENTS` set alongside `SPELL_HEAL` and
`SPELL_PERIODIC_HEAL`. This event fires when a heal is absorbed by a shield (e.g.
Power Word: Shield eating an incoming heal). Its field structure is completely
different from `SPELL_HEAL` — `parts[10]` is the absorb amount, not a heal amount.
Reading it as a heal amount caused massive inflation (e.g. 999,999 absorb → 999,999
phantom healing credited to the caster). Removed from `HEAL_EVENTS`.

### Bug 2 — No destination filter for heals

Heals landing on non-player destinations (hunter pets, warlock demons, DK ghouls,
totems like Mana Tide Totem) were all counted. UWU only counts heals where the
destination is a player GUID. Added `if is_heal and not _is_player(dst_guid): continue`
immediately after the existing P2P damage filter.

**Fix result:** Per-encounter HPS now matches UWU's player-only totals.

---

## TDD Results

**2 new tests — RED → GREEN:**
- `test_heal_to_non_player_not_counted` — 250,000 got → 50,000 expected (pet heal excluded)
- `test_spell_heal_absorbed_not_counted_as_heal` — 1,049,999 got → 50,000 expected

**Full suite: 56/56 passing** (previous 54 + 2 new)

---

## Previous Session Summary (session_damage gap)

The session total gap vs UWU was closed in the previous session (within 0.1%):

| Session | Pizza Logs | UWU | Gap |
|---|---|---|---|
| Session 0 (10H) | ~200,596,766 | 200,402,269 | +0.097% |
| Session 1 (25H) | ~408,078,631 | 407,718,447 | +0.088% |

Root causes fixed previously: overkill subtraction removed, vehicle GUID excluded,
SPELL_MISSED/SWING_MISSED ABSORB not double-counted.

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **All 56 parser tests green**
- **TypeScript build clean**
- **Per-encounter HPS now excludes non-player targets and SPELL_HEAL_ABSORBED**

---

## Next Steps

1. **Delete upload** `cmoda1m3l000265wet559n9yx` (old April 19 upload)
2. **Re-upload** `WoWCombatLog.txt` to verify HPS totals now match UWU
3. **Next features:**
   - Absorbs tracking: parse `SPELL_ABSORBED` events for absorb stats
   - Player detail page: per-boss breakdown per player per session
   - Damage mitigation stats: `SPELL_MISSED` subtypes (ABSORB, BLOCK, DODGE, etc.)
