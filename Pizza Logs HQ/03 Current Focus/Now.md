# Now

## Active
- Upload a fresh log → verify Raids tab shows session cards with correct dates
- Click a player in the session roster → verify session-scoped player page + line chart

## Next
- Absorbs, damage mitigations, parry/dodge/block (parser work required — separate session)
- Consumable tracking (very complex parser work)
- Gunship + Saurfang detection fix (investigate actual log events)
- Marrowgar DPS over-count vs uwu-logs (~9.45k vs 9.3k)
- Footer text fix ("client-side" is wrong — parsing is server-side)
- Admin page auth (simple secret middleware — medium priority)

## Recently Shipped (2026-04-20)
- Raids tab: `/raids` page listing sessions by calendar day (kills/wipes/pulls cards)
- Session-scoped player pages: `/uploads/[id]/sessions/[idx]/players/[name]`
- DPS/HPS line chart: recharts, compares same-class players per encounter in a session
- Roster links in session page → session-scoped player (not global profile)
- UploadZone stalled: false bug fixes (3 setState calls)

## Not Working On
- Heroic detection (impossible without ENCOUNTER_START)
- Gunship Battle detection (impossible)
- Monetization
- Major redesigns

## Reminder
One working feature at a time.
