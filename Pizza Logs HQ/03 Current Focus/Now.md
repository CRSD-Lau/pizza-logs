# Now

## Status
Gap investigation complete. Parser is correct — remaining delta is a data limitation.

---

## Conclusion: Session Total Gap vs UWU

| Session | Pizza Logs | UWU | Gap | Verdict |
|---|---|---|---|---|
| Session 1 (10H) | ~193.82M | 200,402,269 | −3.29% (6.58M) | Log starts ~16 min late |
| Session 2 (25H) | ~404.13M | 407,718,447 | −0.88% (3.59M) | Log starts ~5 min late |

**Root cause**: UWU reference logs (Felyyia 10H, Notlich 25H) were uploaded by different players whose `/combatlog` started 5–16 minutes earlier in the raid night, capturing ICC trash damage the user's log doesn't contain.

**Math**: 10H: 6.58M ÷ ~7k collective DPS ≈ 16 min missing. 25H: 3.59M ÷ ~12.5k collective DPS ≈ 5 min missing.

**Not a bug**. The parser counts every event in the log correctly.

---

## What Was Completed

| Fix | Commit | Impact |
|---|---|---|
| Overkill + P2P | 7868a17 | −13M |
| Gunship Cannons | 8a6e9ff | −4.46M |
| Full-session (boss+trash) | 9e0ae01 | +128M |
| DAMAGE_SHIELD | 75ae523 | ~0.2M |
| TYPE_GUARDIAN | dbb95db | ~0 |
| Absorbed damage | ef152ba | 0 effect (Warmane doesn't log Lady DW mana barrier as absorbed) |
| DUPLICATE UX | ef152ba | View Session link shown |
| Admin delete-upload | ef152ba | Can re-upload same file |

---

## Next Features
- Absorbs tracking (`SPELL_ABSORBED`)
- Player detail page (per-boss per-session for one player)
- Damage mitigation stats
- SPELL_MISSED ABSORB (fully-absorbed hits) — may close a tiny residual gap
