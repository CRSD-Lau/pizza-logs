# Latest Handoff

## Date
2026-04-27

## Git
**Branch:** `main`
**Latest commit before this handoff commit:** `2c85850` docs: add Codex repo instructions
**Release:** `v0.1.0` - tagged and published on GitHub

---

## What Was Done This Session

### 1. Issue #2 fixed: upload analytics moved out of the player-facing UI
- Removed upload-history/telemetry surfaces from the public nav and homepage
- Removed weekly upload counts from the player-facing weekly summary
- Moved file-level upload history/detail pages behind admin-only routes: `/admin/uploads` and `/admin/uploads/[id]`
- Public `/uploads` and `/uploads/[id]` now redirect into the admin experience
- Upload success/error flow now links back into raids instead of upload history and no longer surfaces filenames to players

### 2. Issue #3 fixed: mobile responsiveness pass on data-dense views
- Rebuilt the mobile nav into a menu button + grid panel instead of a cramped inline link strip
- Reworked `/raids` session cards to stack cleanly on narrow screens
- Reworked leaderboard rows so rank, player, boss, difficulty, value, date, and CTA fit without horizontal overflow
- Updated encounter/session/player breadcrumbs and links to favor raid/session navigation instead of upload-history framing

### 3. Verification
- `tsc --noEmit` passes
- Mobile screenshots were checked at 390px and 1280px using a temporary mock route with the real nav/card/leaderboard components
- No horizontal overflow was detected on the verified responsive layouts
- Full local browser verification against DB-backed pages was blocked because local PostgreSQL was not running on `localhost:5432`

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **Release**: `v0.1.0`
- **Public UI**: upload analytics/file-history surfaces moved to admin-only routes
- **Admin UI**: upload history now lives under `/admin/uploads`
- **Responsive status**: nav, raids cards, and leaderboard rows updated for mobile
- **Checks run**: `tsc --noEmit` passed
- **Local env blocker**: DB-backed pages cannot render locally until PostgreSQL is running on `localhost:5432`
- **HPS gap**: ~21-28% under Skada for Disc priests - expected until absorbs are implemented
- **DPS**: <1% residual from orphaned pets - accepted

---

## Open Items (priority order)

### 1. BUG: Hardcore vs Normal difficulty detection regression
Tracked in: https://github.com/CRSD-Lau/Pizza-Logs/issues
- Identify what signal in the Warmane log distinguishes Normal from Hardcore
- Fix difficulty assignment in `parser/parser_core.py`
- Add regression tests

### 2. Stats / Analytics page
New `/stats` page - brainstorm session needed before any code.
Confirmed scope:
- Class performance comparisons (avg DPS/HPS by class)
- Raid comparisons (instance vs instance, week over week)
- All-time records and progression trends
- Multiple graph types using Recharts

### 3. Verify Skada numbers in-game
Neil to upload a log and compare DPS/HPS to in-game Skada for the same fight.
Deferred to next week.

### 4. Absorbs - Power Word: Shield
Decision: **combined Healing+Absorbs column** (not separate).
Do after Skada verification.
1. Parse `SPELL_AURA_APPLIED` for PW:S - store capacity + caster
2. Parse `absorbed` field on damage events - attribute to Disc priest
3. Merge into HPS column in API + UI

---

## Next Step

Fix the HC/Normal detection regression in `parser/parser_core.py`, then add regression tests before moving on to `/stats`.
