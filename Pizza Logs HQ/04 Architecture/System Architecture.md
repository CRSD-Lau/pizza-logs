# System Architecture

## Request Flow

```
Browser
  │
  │  POST /api/upload?filename=...&realmName=...
  │  (multipart/form-data, streams body)
  ▼
Next.js App (Railway: Web Service)
  │
  │  POST /parse-stream
  │  (streams body via duplex:"half", no buffering in Next.js)
  ▼
Python Parser (Railway: parser-py)
  │
  │  1. Write file to temp disk (chunks of 8MB)
  │  2. Count lines (fast pass)
  │  3. Parse in thread executor (progress_cb every 50k lines)
  │  4. Stream SSE events back → Next.js forwards to browser
  │  5. Final "done" event contains full ParseResult JSON
  ▼
Next.js (on "done" event)
  │
  │  Batch DB writes:
  │  - Pre-fetch bosses + existing fingerprints (2 queries)
  │  - Upsert players in parallel batches of 20
  │  - Create encounters + participants (Promise.all)
  │  - Compute milestones
  ▼
PostgreSQL (Railway: Postgres)
  │
  ▼
Browser receives "complete" SSE event → shows result card + OS notification
```

## SSE Progress Event Shape
```json
{ "type": "progress", "pct": 45, "msg": "Aggregating DPS and HPS…" }
{ "type": "done",     "data": { ...ParseResult... } }
{ "type": "complete", "result": { ...UploadResponse... } }
{ "type": "error",    "msg": "..." }
```

## Parser Internals

```
CombatLogParser.parse_file(fh, total_lines, progress_cb)
  │
  ├── _iter_lines()          ← yields (ts_str, parts, ts_float) per line
  │     csv_split() uses Python C csv module (~20x vs hand-rolled loop)
  │     progress_cb fires every 50k lines
  │
  ├── _segment_encounters()  ← groups lines into boss fight windows
  │     Path A: ENCOUNTER_START/END (not present on Warmane — future use)
  │     Path B: heuristic — anchor on boss name events, 30s gap = end
  │
  └── _aggregate_segment()   ← per segment:
        - detect boss (ENCOUNTER_START or name frequency count)
        - detect difficulty (player GUID count: ≤12 = 10N, >12 = 25N)
        - detect outcome (UNIT_DIED on boss = KILL, else WIPE)
        - aggregate DPS/HPS/damage taken per actor
        - detect class from SPELL_CLASS_MAP
        - track boss death timestamp for accurate KILL duration
        - generate SHA-256 fingerprint for dedup
```

## Database Schema (key tables)

```
Realm       — name, host (warmane/blizzard/etc), expansion
Guild       — name, realmId
Upload      — filename, fileHash (dedup), status, rawLineCount, parsedAt
Boss        — name, slug, raid, sortOrder (seeded from bosses.ts)
Player      — name, class, realmId
Encounter   — bossId, uploadId, fingerprint, outcome, difficulty, durationSeconds,
              totalDamage, totalHealing, startedAt
Participant — encounterId, playerId, role, dps, hps, totalDamage, totalHealing,
              deaths, critPct, spellBreakdown (JSON)
Milestone   — playerId, encounterId, metric (DPS/HPS), value, rank, supersededAt
```

## Deduplication

Two layers:
1. **File level**: SHA-256 of entire file → `Upload.fileHash` unique constraint
2. **Encounter level**: SHA-256 of `boss+difficulty+timeblock(5min)+sorted_player_names` → `Encounter.fingerprint`

## Class Colors

`lib/constants/classes.ts` → `getClassColor(classOrName: string): string`
- Returns hex color for WoW class (e.g. Warrior = `#c89040`)
- Falls back to stable hash-based color for unknown class
- Used in: `DamageMeter.tsx`, `LeaderboardBar.tsx`, `weekly/page.tsx`

## Boss Sort Order

`lib/constants/bosses.ts` → `WOTLK_BOSSES` array with `sortOrder` field
- ICC: 10-40 (shown first)
- Ruby Sanctum: 100
- Trial of the Crusader: 200-204
- Ulduar: 300-332
- Vault of Archavon: 400-403
- Eye of Eternity: 500
- Obsidian Sanctum: 600
- Naxxramas: 700-741 (shown last)
