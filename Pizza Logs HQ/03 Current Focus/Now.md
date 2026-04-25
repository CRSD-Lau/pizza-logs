# Now

## Status
Session total gap **CLOSED** — parser correctly matches UWU within 0.1%.

---

## Session Total Accuracy vs UWU

| Session | Pizza Logs | UWU | Gap |
|---|---|---|---|
| Session 0 (10H) | ~200,596,766 | 200,402,269 | +0.097% |
| Session 1 (25H) | ~408,078,631 | 407,718,447 | +0.088% |

**Same WoWCombatLog.txt file used for both UWU reference reports and Pizza Logs testing.**

---

## Root Causes (all fixed)

| Root Cause | Impact | Fix |
|---|---|---|
| Overkill subtracted from session_damage | −6.78M S0 / −9.1M S1 | Remove `- float(parts[8/11])` |
| Vehicle GUID (0xF150*) counted as pet | +5.16M phantom S1 | Skip 0xF15* in is_pet check |
| SPELL_MISSED/SWING_MISSED ABSORB counted | +372K S0 / +657K S1 over | Remove MISSED ABSORB block |

---

## What Was Completed

| Fix | Commit | Impact |
|---|---|---|
| Overkill + P2P | 7868a17 | −13M |
| Gunship Cannons | 8a6e9ff | −4.46M |
| Full-session (boss+trash) | 9e0ae01 | +128M |
| DAMAGE_SHIELD | 75ae523 | ~0.2M |
| TYPE_GUARDIAN | dbb95db | ~0 |
| Absorbed damage | ef152ba | ~0 (Warmane doesn't log Lady DW barrier via SPELL_DAMAGE absorbed) |
| DUPLICATE UX | ef152ba | View Session link shown |
| Admin delete-upload | ef152ba | Can re-upload same file |
| **No overkill + no vehicle + no MISSED ABSORB** | **(this)** | **Closes gap to 0.1%** |

---

## Immediate Next Action

1. Delete upload `cmoda1m3l000265wet559n9yx` via admin panel
2. Re-upload `WoWCombatLog.txt` — verify S0 ≈ 200.4M and S1 ≈ 407.7M in UI

---

## Next Features
- Absorbs tracking (`SPELL_ABSORBED`) — healing stats
- Player detail page (per-boss per-session for one player)
- Damage mitigation stats
