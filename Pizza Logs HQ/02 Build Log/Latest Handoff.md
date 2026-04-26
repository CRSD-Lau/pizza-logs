# Latest Handoff

## Date
2026-04-26

## Git
**Branch:** `claude/elated-sutherland-11ac4b`
**Latest commit:** refactor: switch parser philosophy to Skada-WoTLK as source of truth

---

## Strategic Direction Change

**Old approach:** Try to match UWU addon output. UWU source code unavailable. Guessing at exclusions.

**New approach:** Replicate Skada-WoTLK exactly. Skada is what the raid uses in-game. Website should show the same numbers. Skada source is fully available at https://github.com/bkader/Skada-WoTLK.

**Every parser decision must now be grounded in Skada Lua source with a file/line citation.**

---

## Current Goal: Full Skada Audit of parser_core.py

Go through every aspect of parser_core.py and verify it against Skada source:

### Healing (Skada/Modules/Healing.lua + Core/Tables.lua)
- [ ] Verify SPELL_HEAL field indices match Skada's suffix definitions
- [ ] Verify HEAL_EVENTS set matches what Skada listens to
- [ ] Verify PASSIVE_HEAL_EXCLUSIONS is the complete ignored_spells.heal from Tables.lua
- [ ] Verify effective heal formula = max(0, amount - overheal) matches Skada
- [ ] Verify whether absorbs (PW:S) roll into "healing done" or are separate in Skada
- [ ] Check how Skada handles boss-mechanic heals (non-player src → player dst)

### Damage (Skada/Modules/Damage.lua + Core/Tables.lua)
- [ ] Verify DMG_EVENTS set matches what Skada listens to
- [ ] Verify SWING_DAMAGE field layout matches Skada
- [ ] Verify SPELL_DAMAGE field layout (amount, overkill, school, resisted, blocked, absorbed, critical)
- [ ] Verify DAMAGE_SHIELD exclusion is correct per Skada
- [ ] Check if Skada has an ignored_spells.damage list
- [ ] Check how Skada handles absorbed damage (Lady Deathwhisper mana barrier)

### General
- [ ] Verify player GUID detection logic matches Skada's unit flag checks
- [ ] Check if Skada has any fight-window trimming (post-death event exclusion)

---

## What Was Done This Session

### 1. Healing formula fix (parts[10] - parts[11])
- **Old (wrong):** `amount = parts[11]` (this is overheal, not effective)
- **New (correct):** `amount = max(0.0, parts[10] - parts[11])` (gross - overheal)
- Confirmed via Skada suffix: `HEAL = "amount, overheal, absorbed, critical"`
- Confirmed via Skada Healing.lua: `local amount = max(0, heal.amount - heal.overheal)`
- Result: was 14-228% OVER, now ~21-28% UNDER (consistent gap, likely absorbs)

### 2. PASSIVE_HEAL_EXCLUSIONS — Skada-sourced
- **Judgement of Light**: EXCLUDED (Skada Tables.lua ignored_spells.heal, spell ID 20267)
- **Vampiric Embrace**: INCLUDED (not in Skada exclusions)
- **Improved Leader of the Pack**: INCLUDED (not in Skada exclusions)

### 3. CLAUDE.md updated
- New "Parser Philosophy — Skada-First" section
- Skada source URLs and key files documented
- Correct SPELL_HEAL field layout documented with Skada citation

### 4. Tests: 70/70 passing

---

## Open Questions (need Skada source to answer)

1. **Are there more spells in ignored_spells.heal?** We only found JoL so far. Need full Tables.lua.
2. **Is ignored_spells.damage a thing?** DAMAGE_SHIELD currently excluded — is that from Skada?
3. **Do absorbs (PW:S) roll into Skada's healing done, or are they separate?** This determines whether the ~21-28% gap is expected or a bug.
4. **How does Skada handle the `absorbed` field on damage events?** (Lady Deathwhisper mana barrier)

---

## Known Remaining Gaps vs Skada (to investigate)

| Issue | Delta | Hypothesis |
|-------|-------|------------|
| Healing ~21-28% under | all bosses | PW:S absorbs counted in Skada healing total? |
| Blood-Queen healing 40% under | BQ only | Vampiric bite heals (boss mechanic NPC src) |
| S0 BPC damage 21.29% under | S0 BPC | boss_guids missing some prince GUID variants |
| LDW damage 7.17% under | LDW | add filter methodology differs |

---

## Next Steps

1. Read full Skada Tables.lua, Healing.lua, Damage.lua source (fetch from GitHub)
2. Audit parser_core.py against Skada line by line
3. Fix any discrepancies found
4. Commit + push to Railway
