# Parser Deep Dive

## WoW Combat Log Format (WotLK / Warmane 3.3.5a)

### Line Structure
```
M/D HH:MM:SS.mmm  EVENT,field1,field2,...fieldN
```
Double-space separates timestamp from CSV payload. No year in timestamp — inferred from file mtime or current year.

### Common Events and Field Layouts

**SPELL_DAMAGE** (17+ fields)
```
[0]  event
[1]  srcGUID   [2]  srcName   [3]  srcFlags
[4]  dstGUID   [5]  dstName   [6]  dstFlags
[7]  spellID   [8]  spellName [9]  spellSchool
[10] amount    [11] overkill  [12] school
[13] resisted  [14] blocked   [15] absorbed
[16] critical  [17] glancing  ...
crit at index 17 → parts[17] == "1"
```

**SWING_DAMAGE** (14+ fields — NO spell fields)
```
[0]  event
[1]  srcGUID   [2]  srcName   [3]  srcFlags
[4]  dstGUID   [5]  dstName   [6]  dstFlags
[7]  amount    [8]  overkill  [9]  school
[10] resisted  [11] blocked   [12] absorbed
[13] critical
crit at index 13 → parts[13] == "1"
spell_name hardcoded to "Auto Attack"
```

**SPELL_HEAL** (14 fields — CRITICAL: only 14, not 15+)
```
[0]  event
[1]  srcGUID   [2]  srcName   [3]  srcFlags
[4]  dstGUID   [5]  dstName   [6]  dstFlags
[7]  spellID   [8]  spellName [9]  spellSchool
[10] amount    [11] overhealing [12] absorbed
[13] critical
min length check: >= 11
crit at index 13 → len(parts) > 13 and parts[13] == "1"
```

**UNIT_DIED** (6+ fields)
```
[0] event
[1] srcGUID  [2] srcName  [3] srcFlags
[4] dstGUID  [5] dstName  [6] dstFlags
```

**ENCOUNTER_START** (5 fields — NOT present on Warmane)
```
[0] event  [1] bossId  [2] bossName  [3] difficultyId  [4] groupSize
```

### GUID Formats
- **Player (Warmane)**: `0x0600000000XXXXXX` — high byte `0x06`
- **Player (retail/modern)**: `Player-NNNN-XXXXXXXX`
- **NPC/Boss**: `0x0300000000XXXXXX` — high byte `0x03`
- **Null**: `0x0000000000000000` or `0xNil` or `Nil`

### Difficulty IDs (ENCOUNTER_START only)
```
3 = 10N,  4 = 25N,  5 = 10H,  6 = 25H
```
Without ENCOUNTER_START: estimate from unique player GUID count (≤12 = 10N, >12 = 25N).
**Heroic detection is impossible** without ENCOUNTER_START on Warmane.

---

## Segmentation Logic (heuristic path)

```python
ENCOUNTER_GAP_SECONDS = 30   # gap with no boss events = fight over
MIN_ENCOUNTER_EVENTS  = 10   # below this = discard (noise)
```

For each line in the log:
1. If event not in DMG/HEAL/UNIT_DIED → skip
2. Check if src or dst name is in `ALL_BOSS_NAMES` (set lookup, cached at init)
3. If boss event and not currently in fight → start new segment
4. If in fight: any event within 30s of last boss event → append to segment
5. If >30s gap → close segment, check min size, start new if this line is boss

Post-fight tail: up to 30s of heals/buffs/deaths get included. For WIPEs this is fine. For KILLs it would inflate duration → fixed by tracking boss death timestamp.

---

## Aggregation Logic

For each segment:

### Boss Detection
Count occurrences of known boss names in src/dst fields → most frequent = boss.

### Outcome Detection
- Scan UNIT_DIED events
- If `dst_name.lower() == boss_name.lower()` → KILL
- Valithria special case: KILL if "Green Dragon Combat Trigger" or "combat trigger" dies
- No UNIT_DIED on boss → WIPE
- Valithria: if no trigger death found → WIPE (she died = wipe on that encounter)

### Duration
```python
start_ts = parse_ts(first event)
end_ts   = parse_ts(last event)
# For KILL: use boss_died_ts instead of end_ts
# (avoids post-fight tail inflation)
duration = max(1, int(end_ts - start_ts))
```

### Fingerprint
```python
SHA-256(f"{boss_name}|{difficulty}|{week}-{day}-{5min_block}|{sorted_player_names}")
```
5-minute block tolerates small clock differences between uploads.

---

## Known Edge Cases

| Boss | Issue | Fix |
|---|---|---|
| Valithria Dreamwalker | Never UNIT_DIED on kill | Detect "Green Dragon Combat Trigger" death |
| Gunship Battle | High Overlord Saurfang events overlap with Deathbringer Saurfang pull | Cannot isolate without ENCOUNTER_START — accepted |
| Deathbringer Saurfang | Gunship adds' deaths near pull time | Removed add NPC aliases from Gunship boss def |
| Four Horsemen | 4 boss entities | All 4 names in aliases list |
| Assembly of Iron | 3 boss entities (Steelbreaker/Molgeim/Brundir) | All in aliases |
| Blood Prince Council | 3 boss entities | All in aliases |
| Northrend Beasts | 4 entities (Gormok/Icehowl/Acidmaw/Dreadscale) | All in aliases |
| Pre-pull noise | 0 damage, very short | Filter: `total_damage == 0 and duration < 60` |

---

## Performance Notes

| Optimization | What changed | Impact |
|---|---|---|
| `csv_split` | Python char loop → C csv module | ~20x faster line parsing |
| `_boss_names` | Property re-import → cached instance var | Eliminates millions of redundant calls |
| DB writes | 950 sequential queries → ~15 batched/parallel | Major DB write speedup |
| SSE progress | Reports every 50k lines during parse | Real progress bar in browser |
| KILL duration | Boss death timestamp vs last event | Eliminates 30s post-fight DPS penalty |
