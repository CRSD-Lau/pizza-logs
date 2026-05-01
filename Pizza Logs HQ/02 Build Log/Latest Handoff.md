# Latest Handoff

## Date
2026-05-01

## Git
**Branch:** `main`
**Latest commit:** `613744b docs: design Warmane sync agent`
**Release:** `v0.1.0` - tagged and published on GitHub

---

## What Was Done This Session

### Warmane Sync Agent planning (in progress)
- Discussed replacing manual Warmane roster/gear userscript runs with an automated laptop-primary sync agent.
- Agreed the source of truth remains Warmane Armory.
- Rejected Railway residential proxy / Cloudflare-bypass architecture as the foundation.
- Wrote design spec: `docs/superpowers/specs/2026-05-01-warmane-sync-agent-design.md`.
- Target architecture: laptop runs `npm run sync:warmane`, fetches Warmane roster/gear from the local network, validates snapshots, and posts imports to the hosted Pizza Logs app.
- Backend direction: snapshot-first reads, strict import validation, preserve last good data, admin sync health visibility.

### Claude desktop handoff update (complete)
- Updated `CLAUDE.md` so Claude sessions on the laptop/desktop know the current Warmane sync-agent direction.
- Added explicit instruction to read the sync-agent design spec before planning or implementing roster/gear automation.
- Added the no-Railway-proxy boundary and v1 implementation priorities.

### Previous completed work still relevant
- Admin page cleanup is complete: clear upload data now retains players, gear cache, and roster.
- Nav label was renamed from "Roster" to "Guild".
- Wowhead gear enrichment moved to tooltip JSON and browser-side userscript enrichment because Railway IPs are blocked/challenged by Warmane/Wowhead.
- Current hosted gear userscript is v1.1.0 and enriches browser-side with `itemLevel`, `equipLoc`, and `iconUrl`.

---

## Current State

- **Live app:** https://pizza-logs-production.up.railway.app
- **Release:** `v0.1.0`
- **Admin page:** cleaned up; bookmarklet/copy-paste fallbacks removed.
- **Warmane sync automation:** design spec written and Claude handoff updated; implementation not started yet.
- **TypeScript:** previously clean (`tsc --noEmit` zero errors).
- **Git/deploy:** canonical remote is `origin` -> `https://github.com/CRSD-Lau/Pizza-Logs.git`; push live changes with `git push origin main`.

---

## Next Steps

1. **Move context to desktop if needed** - ensure desktop repo has commit `613744b` plus this Claude handoff update.
2. **Review Warmane sync agent design** - `docs/superpowers/specs/2026-05-01-warmane-sync-agent-design.md`.
3. **Write implementation plan** - after design approval, break into backend hardening, sync CLI, admin health UI, and Task Scheduler setup.
4. **Build laptop-primary sync agent** - first target command: `npm run sync:warmane`.
5. **Verify gear pages** - check Writman, Yanna, and other players after automated re-sync to confirm ilvl, GS, and slot labels are correct.
6. **Fix HC/Normal difficulty detection** - regression bug/open task.
7. **Stats/Analytics page** - brainstorm first.
8. **Verify Skada numbers in-game** - Neil to do manually.
9. **Absorbs (PW:S)** tracking - future enhancement.
