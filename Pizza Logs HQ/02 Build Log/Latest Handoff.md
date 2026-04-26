# Latest Handoff

## Date
2026-04-26

## Git
**Latest commit:** `d7ae46f` — fix: use parts[11] (effective heal) for SPELL_HEAL, add overheal TDD tests

---

## Damage Regression Fix — DONE

### What was fixed

Two-session bug introduced and then fixed:

**Previous session added** a universal boss-GUID filter (`if not boss_guids or dst_guid in boss_guids`) to every boss fight, which correctly improved LDW and BPC but incorrectly excluded boss-mechanic unit damage on Marrowgar (Bone Spikes) and Saurfang (Blood Beasts), causing 8.59% and 6.89% regressions.

**This session fixed** the filter by adding `filter_add_damage: bool = False` to `BossDef` in `bosses.py`, setting it `True` only on Lady Deathwhisper and Blood Prince Council. The boss_guids filter now only applies when `boss_def.filter_add_damage=True`.

**Also added** `boss_mechanic_healing` accumulator (from previous session) to capture vampiric bite heals from Blood-Queen (non-player src → player dst).

### Current UWU validation: 14/26 passing

```
S1 session damage           407,718,447   408,071,007   0.09%     OK
S1 Lord Marrowgar damage     51,485,997    51,487,394   0.00%     OK
S1 Lord Marrowgar DPS           219,315       219,321   0.00%     OK
S1 Lord Marrowgar duration        234.8         234.8   0.00%     OK
S1 Lady Deathwhisper damage  35,747,394    33,185,089   7.17%   FAIL
S1 Lady Deathwhisper duration    179.0           179.0   0.01%     OK
S1 Deathbringer Saurfang     47,742,135    47,712,545   0.06%     OK
S1 Deathbringer Saurfang DPS    232,262       232,118   0.06%     OK
S1 Deathbringer Saurfang dur    205.6           205.6   0.00%     OK
S1 Blood Prince Council      41,175,251    41,163,300   0.03%     OK
S1 Blood Prince Council DPS     133,491       133,764   0.20%     OK
S1 Blood Prince Council dur     308.4           307.7   0.23%     OK
S1 Blood-Queen damage        71,300,593    71,329,512   0.04%     OK
S1 Blood-Queen DPS              240,473       240,994   0.22%     OK
S1 Blood-Queen duration         296.5           296.0   0.18%     OK
--- ALL HEALING FAILING ---
S1 Marrowgar healing         8,656,055    13,493,793   55.89%  FAIL
S1 Saurfang healing          4,191,806    15,268,970  264.26%  FAIL
S1 BQ healing               58,780,938    38,944,850   33.75%  FAIL
--- S0 MISSING ---
  [MISSING] Sindragosa (10N session 0)
  [MISSING] Blood Prince Council (10N session 0)
```

### What was NOT fixed (open issues)

#### 1. LDW damage undercounted (7.17% under UWU)
Was 34.92% over before boss_guids filter, now 7.17% under. The filter over-corrects slightly — unclear exactly which 2.5M difference UWU counts. Possible: LDW phase 1 absorbed damage counted by UWU but not us. Low priority to investigate.

#### 2. Healing overcounting (55-265% over UWU on most bosses)
All healing metrics failing. Root cause unknown. Possible causes:
- UWU excludes passive proc heals (Vampiric Embrace, Judgement of Light, ILotP, Beacon of Light)
- UWU may only count "active healer" role healing
- Different event set for SPELL_PERIODIC_HEAL

#### 3. Blood-Queen healing undercounted (33.75% under UWU)
Boss-mechanic heal accumulator partially helps but still 33.75% under. The boss-sourced Essence of the Blood Queen vampiric bite heals may not be fully captured.

#### 4. S0 missing encounters (Sindragosa, BPC 10N)
KILLs not found at session_index=0. Session assignment bug — the S0 encounters from a different night are being assigned to a different index.

### Tests
64/64 tests passing. New test added this session:
- `test_encounter_damage_includes_mechanic_unit_damage` — verifies filter_add_damage=False counts Bone Spike damage
- Updated `test_encounter_damage_excludes_add_damage` docstring to note LDW has filter_add_damage=True

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **All parser tests green** (64/64)
- **Validation**: 14/26 UWU checks passing
- **Log file for validation**: `C:/Users/neil_/Downloads/WoWCombatLog/WoWCombatLog.txt`
- **Branch:** `claude/elated-sutherland-11ac4b`

---

## Next Steps

1. **Investigate healing overcounting**: which passive proc heals (VE, JoL, ILotP) should be filtered? Compare UWU methodology.
2. **Fix BQ healing undercount**: still 33.75% under — boss-mechanic accumulator not capturing all vampiric bites
3. **Fix S0 missing sessions**: check session index assignment — Sindragosa and BPC 10N KILLs missing
4. **LDW damage**: 7.17% under (hard to fix without knowing UWU's exact filter) — low priority
5. After parser fixes: merge branch, push to Railway, re-upload log to verify
