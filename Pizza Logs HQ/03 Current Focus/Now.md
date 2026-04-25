# Now

## Status
Per-encounter HPS over-count bug **FIXED** — 2 root causes eliminated, 56/56 tests green.

---

## Healing Over-Count (FIXED this session)

| Bug | Cause | Fix |
|---|---|---|
| SPELL_HEAL_ABSORBED in HEAL_EVENTS | Wrong field structure — parts[10] is absorb amount, not heal | Removed from HEAL_EVENTS |
| Heals to non-player targets counted | Pets, totems, ghouls inflated HPS | Added `if is_heal and not _is_player(dst_guid): continue` |

---

## Session Total Accuracy vs UWU (still valid from previous session)

| Session | Pizza Logs | UWU | Gap |
|---|---|---|---|
| Session 0 (10H) | ~200,596,766 | 200,402,269 | +0.097% |
| Session 1 (25H) | ~408,078,631 | 407,718,447 | +0.088% |

---

## Immediate Next Action

1. Delete upload `cmoda1m3l000265wet559n9yx` via admin panel
2. Re-upload `WoWCombatLog.txt` — verify HPS totals now match UWU per encounter

---

## Next Features
- Absorbs tracking (`SPELL_ABSORBED`) — shield absorption stats
- Player detail page (per-boss per-session for one player)
- Damage mitigation stats (`SPELL_MISSED` subtypes)
