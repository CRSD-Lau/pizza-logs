# Feature Status

## Shipped

| Feature | Notes |
|---|---|
| File upload (drag + drop) | `UploadZone.tsx`, accepts `.txt`/`.log` uploads |
| Streaming upload to parser | `duplex: "half"` - no buffering in Next.js |
| SSE parser progress | Parser emits progress; browser reads event stream |
| Browser notification on complete | Native Notification API, fires even if tab is backgrounded |
| Boss encounter detection | Heuristic segmentation for Warmane logs without reliable encounter markers |
| DPS / HPS aggregation | Per player per encounter |
| Spell breakdown | Per spell: damage, healing, hits, crits, school |
| Class detection | `SPELL_CLASS_MAP` maps common WotLK spells to classes |
| WoW class colors | In meter, leaderboard, and weekly surfaces |
| Weekly leaderboard (`/weekly`) | Top DPS/HPS per boss this week |
| Boss leaderboards (`/bosses`) | All-time top per boss and difficulty |
| Upload history | Public upload pages redirect to admin; upload telemetry lives under `/admin/uploads` |
| Admin dashboard (`/admin`) | DB stats, service health, upload timings, errors, item import, gear/roster sync helpers |
| Admin auth | `/admin` and admin APIs require `ADMIN_SECRET`; production fails closed if missing |
| Admin login cookie | Server action sets `x-admin-secret` as `HttpOnly`; secure by default in production |
| Admin cleanup actions | Built into `/admin`; cleanup re-checks admin auth and retains persistent roster/gear/item-template data |
| Deduplication | File-level SHA-256 plus encounter-level fingerprint |
| Milestone tracking | New top records detected and shown after upload |
| Valithria Dreamwalker KILL detection | Green Dragon Combat Trigger death |
| KILL duration accuracy | Uses boss death timestamp, not post-fight tail |
| Boss sort order | ICC first via `sortOrder` |
| Obsidian vault | `Pizza Logs HQ/` is committed and read at session start |
| Codex-first workflow | Claude docs removed; `AGENTS.md`, review guide, and vault prompts are current |
| Parser Skada-WoTLK alignment | DMG_EVENTS, HEAL_EVENTS, and heal formula match Skada source |
| Heal formula fix | Effective healing = `max(0, gross - overheal)` |
| Heroic difficulty normalization | 25N encounters in confirmed 25H sessions promoted by session normalization |
| Footer text | Footer now correctly says parsing is handled server-side on Railway |
| AzerothCore item template enrichment | `wow_items` is backed by imported `item_template` data; no runtime Wowhead dependency |
| Warmane Gear Sync icon backfill | Gear Sync `1.7.0` scrapes queued player DOM icons and posts them to Pizza Logs |
| Full-player gear queue scan | Missing-gear endpoint filters all candidates before applying the 100-player response cap |

---

## In Progress

| Feature | Status |
|---|---|
| Warmane Gear Sync production backfill | Code is pushed to `origin/main`; production still needs one Gear Sync `1.7.0` run to backfill missing icon slugs for queued players such as Maxximusboom and Lausudo |
| HPS accuracy vs Skada | Parser aligns with Skada-WoTLK heal rules. Remaining gap is likely PW:S absorbs, which Skada tracks separately |
| Absorbs tracking (PW:S) | Future parser enhancement based on Skada `Absorbs.lua` |

---

## Planned / Backlog

| Feature | Priority | Notes |
|---|---|---|
| Absorbs tracking | High | Add separate absorb metrics without mixing absorbs into healing |
| Damage mitigation stats | Medium | `SPELL_MISSED` subtypes: ABSORB, BLOCK, PARRY, DODGE |
| Consumable tracking | Medium | Known consumable buff applications |
| Local Warmane sync agent | Medium | Reduce manual userscript dependency |
| Guild comparison | Low | Compare guild members side-by-side |
| Public guild pages | Low | Share leaderboards publicly |
| Multiple guild support | Low | Already in schema (`Guild` table), needs UI |
| Real-time parse speed display | Low | Show MB/s or lines/s during upload |

---

## Won't Do

| Feature | Reason |
|---|---|
| Heroic detection from Warmane logs alone | Warmane lacks reliable heroic-only IDs/markers in the target logs |
| Gunship Battle as a separately detectable encounter marker | Warmane does not expose reliable encounter markers for it |
