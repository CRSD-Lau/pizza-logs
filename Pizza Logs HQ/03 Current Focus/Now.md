# Now

## Mission
**Make parser_core.py a 1:1 replication of Skada-WoTLK.**
Skada is what the raid uses in-game. The website must show the same numbers.
Source: https://github.com/bkader/Skada-WoTLK

---

## Active Task: Full Skada Audit

### Healing audit checklist
- [ ] Full ignored_spells.heal from Tables.lua → update PASSIVE_HEAL_EXCLUSIONS
- [ ] Verify HEAL_EVENTS matches Skada event listeners
- [ ] Verify effective heal formula matches Skada (currently: gross - overheal ✅)
- [ ] Determine if PW:S absorbs are in Skada's "healing done" or separate
- [ ] Boss-mechanic heals (non-player src → player dst) — how does Skada handle?

### Damage audit checklist
- [ ] Full ignored_spells.damage from Tables.lua (if it exists)
- [ ] Verify DMG_EVENTS matches Skada event listeners
- [ ] Verify DAMAGE_SHIELD exclusion is per Skada (not a guess)
- [ ] SWING_DAMAGE / SPELL_DAMAGE field layout — verify against Skada suffix defs
- [ ] Absorbed damage handling (LDW mana barrier) — verify vs Skada

### General
- [ ] Player vs NPC detection — verify vs Skada unit flag logic
- [ ] Fight window (post-death trimming) — does Skada trim? Do we?

---

## Status
- 70/70 tests passing
- Branch: `claude/elated-sutherland-11ac4b`
- Healing formula fixed (gross - overheal per Skada)
- JoL excluded per Skada Tables.lua
- VE and ILotP included per Skada
- CLAUDE.md updated with Skada-first philosophy

## Log file for validation
`C:/Users/neil_/OneDrive/Desktop/PizzaLogs/WoWCombatLog/WoWCombatLog.txt`
