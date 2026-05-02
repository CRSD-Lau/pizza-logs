# Gunship Battle — KILL via crew death (Warmane pattern)

Warmane always emits ENCOUNTER_END success=0 for Gunship, even on kills.
The parser overrides WIPE→KILL when any crew member (Muradin Bronzebeard here) dies.

Total damage = 138000 (8x SPELL_BUILDING_DAMAGE events: Phyre 75000 + Lausudo 63000).
SPELL_BUILDING_DAMAGE counts per Skada (Skada/Modules/Damage.lua RegisterForCL).

MIN_ENCOUNTER_EVENTS=10 requires at least 10 lines in the segment; this fixture uses
8 damage events + ENCOUNTER_START + UNIT_DIED + ENCOUNTER_END = 11 total.
