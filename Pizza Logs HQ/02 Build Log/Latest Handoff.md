# Latest Handoff

## Date
2026-04-30

## Git
**Branch:** `main`
**Latest commit before this handoff commit:** unknown locally - `git` unavailable on PATH in this Codex shell
**Release:** `v0.1.0` - tagged and published on GitHub

---

## What Was Done This Session

### 1. Native Warmane Armory gear section added to player profiles
- Added `lib/warmane-armory.ts` as the isolated server-side Warmane reader
- Uses the Warmane character summary API endpoint for Lordaeron by default:
  `https://armory.warmane.com/api/character/<name>/<realm>/summary`
- Sanitizes character names before URL construction
- Adds timeout handling, user-agent headers, server-side logging, and graceful public error messages
- Uses Next `unstable_cache` with 12-hour revalidation
- Maps Warmane API equipment order to native slot labels

### 2. Player profile UI integration
- Added `components/players/PlayerGearSection.tsx`
- `/players/[playerName]` now renders a native "Gear" `AccordionSection`
- Gear is streamed behind `Suspense` with a skeleton loading state
- Empty/error states are non-blocking and still render the rest of the player page
- The Warmane page is linked as the source, not embedded as an iframe

### 3. Warmane access note
- Direct local requests to Warmane HTML and API returned Cloudflare/403 from this environment
- The feature is built to fail gracefully when Warmane blocks, is down, or changes behavior
- Railway behavior still needs verification after deploy because Warmane may treat Railway egress differently

### 4. Verification
- `tsc --noEmit` passed via bundled Node runtime
- `next build` passed via bundled Node runtime
- `next lint` could not run non-interactively because this Next.js 15 project has no ESLint config yet and Next prompts for setup

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **Release**: `v0.1.0`
- **Player profiles**: include a native Warmane Armory Gear section wired to server-side fetch/cache
- **Warmane local access**: blocked by Cloudflare/403 from this Codex shell, handled gracefully by UI
- **Checks run**: `tsc --noEmit` passed; `next build` passed
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

### 5. Gear follow-ups
- Verify Warmane API access from Railway production
- Add item quality/item level/icon/gem/enchant enrichment if a reliable source is chosen
- Consider historical gear snapshots per raid date

---

## Next Step

Run type/build verification for the gear section, then verify `/players/Ashien` after deployment. Parser priority remains fixing HC/Normal detection in `parser/parser_core.py`.
