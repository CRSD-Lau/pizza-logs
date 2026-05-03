# Feature Backlog

> Prioritized. The top of this list is what gets built next.

---

## Priority Stack (do in order)

| # | Feature | Why | Effort |
|---|---|---|---|
| 1 | Absorbs tracking | Parser: Skada `Absorbs.lua` tracks `actor.absorb` separately from healing | L |
| 2 | Damage mitigation stats | Parser: `SPELL_MISSED` subtypes (ABSORB, BLOCK, PARRY, DODGE) | L |
| 3 | Consumable tracking | Buff applications from known consumable spell IDs | XL |
| 4 | Gunship + Saurfang follow-up audit | Verify latest Skada-aligned Gunship/Saurfang behavior against fresh Warmane logs | M |
| 5 | Marrowgar DPS over-count | ~9.45k vs uwu-logs 9.3k - root cause not found | M |
| 6 | Local automated Warmane sync agent | Replace manual userscript runs for roster/gear refreshes | L |

---

## Backlog (not prioritized yet)

| Feature | Notes |
|---|---|
| Discord milestone bot | Post #1 records to Discord channel |
| Fastest kill records | Per boss, per difficulty - shortest duration kills |
| Attendance tracking | Who was in each raid, % attendance over time |
| Hall of Fame | All-time #1s in a dedicated page |
| Public guild pages | Share leaderboards without login |
| Multiple realm support | Already in schema, just needs UI |
| Real-time parse speed display | Show MB/s or lines/s during upload |
| Death recap | Who died and when in each encounter |
| Wipe analysis | Why did the raid wipe? (% boss HP, deaths, etc.) |
| Export to CSV | Download encounter data |

---

## Shipped

See [[Feature Status]] for the full shipped feature list.

Recently shipped and removed from this backlog:
- Footer text now correctly says parsing is handled server-side on Railway.
- Admin auth is live via `ADMIN_SECRET`, `middleware.ts`, server-side login action, and `HttpOnly` cookie.
- Admin cleanup actions are built into `/admin` and re-check admin auth.
- Gear Sync `1.7.0` is shipped for queued DOM icon backfill.

---

## Related

- [[Technical Debt]] - known shortcuts that will need fixing
- [[Feature Status]] - what's already built

---

## Deprioritized / Won't Do

| Feature | Reason |
|---|---|
| Heroic detection | Impossible without ENCOUNTER_START on Warmane |
| Gunship Battle detection | Impossible as a separate encounter marker on Warmane |
| Sprint / agile tooling | One person, no need |

### AI Control Center

- [[Codex Resume Prompt]] - paste this to start a session
- [[Prompt Library]] - reusable prompts for common ops
- [[Repeated Fixes & Gotchas]] - don't solve the same bug twice
- [[Codex Gotchas]] - things to remind Codex every session
- [[AI Operating System]]
- [[Codex Skills Index]]
