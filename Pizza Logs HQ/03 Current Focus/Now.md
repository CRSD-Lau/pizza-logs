# Now

## Active
All 39 tests green. Interaction scan fix ready to commit + push → Railway redeploy.

---

## Completed This Session

### Interaction scan fix (pre-summoned pet / Gunship cannon)

- **Root cause**: global scan ran on ALL events → Gunship Cannons (`0xF150`) were mapped as player pets → 4.46M fake DPS
- **Fix**: restrict to `SPELL_HEAL`/`SPELL_PERIODIC_HEAL` + `0xF14*` GUID prefix only
- **Tests**: 4 new TDD tests (vehicle, NPC, hunter pet mapped, pet damage attributed); 39/39 passing
- **Expected improvement**: session 2 drops from ~284M → ~279.8M vs UWU 276.045M

### Delta fix: overkill subtraction + P2P filter (previous commit 7868a17)
- Overkill: `eff_amount = max(0, amount - overkill)` — BPC had 7.8M overkill alone
- P2P: skip damage where `_is_player(dst_guid)` — Blood-Queen vampires were adding 3.8M
- Combined: 289.26M → ~284M

---

## Immediate Next Steps

1. Commit + push interaction scan fix
2. Wait for Railway deploy
3. Clear DB → re-upload same log
4. Verify: session total ~279–280M, Gunship = 25H KILL, no bogus Gunship pet entries

---

## Known Remaining Limitation

~3.7M under UWU still expected = pre-summoned pets (Hunter beasts, Warlock demons whose
SPELL_SUMMON isn't in the log) + minor methodology differences. Phase 2 would need
NPC entry ID → class lookup table.

---

## Not Working On
- UI redesigns
- Non-ICC content
- Absorbs tracking (backlog)
