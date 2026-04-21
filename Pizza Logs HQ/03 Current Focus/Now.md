# Now

## Active
Two parser fixes shipped — awaiting re-upload to validate.

---

## Work Completed This Session

### Forensic Parser Review — Two Root Causes Fixed

#### DAMAGE_SHIELD removed from DMG_EVENTS
- `DAMAGE_SHIELD` = Retribution Aura / Thorns reflect — not player DPS
- UWU and Warcraft Logs both exclude it
- Was causing ~13M excess across full ICC session
- Fix: removed from `DMG_EVENTS` set in `parser/parser_core.py`

#### Gunship Battle kill detection
- Gunship ends via scripted ship destruction, not UNIT_DIED
- `High Captain Justin Bartlett` does NOT produce UNIT_DIED at fight end on Warmane
- Fix: added Gunship-specific block in `_infer_outcome` — crew UNIT_DIED within segment = KILL
- Mirrors existing Valithria special case

---

## Files Changed

| File | Change |
|---|---|
| `parser/parser_core.py` | DAMAGE_SHIELD removed; Gunship kill detection added |
| `Pizza Logs HQ/09 Bugs and Blockers/Known Issues.md` | Updated |
| `Pizza Logs HQ/02 Build Log/Latest Handoff.md` | Updated |

---

## Immediate Next Steps

1. Push to Railway / wait for deploy
2. Clear DB → re-upload same log
3. Verify: Gunship = KILL, total drops to ~276M, Marrowgar DPS closes gap
4. If Gunship still WIPE: run `diagnose.py` to check crew UNIT_DIED in segment window

---

## Blockers

### 🟡 Marrowgar DPS Over-Count (residual)
- Was ~9.45k vs UWU 9.3k
- DAMAGE_SHIELD removal should close most of this — re-upload needed to confirm

### 🟡 Persistent Pets
- Hunter beasts / Warlock demons pre-summoned before log = no SPELL_SUMMON → orphaned
- May explain any residual damage delta after today's fixes

---

## Not Working On
- Heroic detection improvements
- UI redesigns
- Non-ICC content
