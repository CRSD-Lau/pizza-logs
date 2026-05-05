# Now

## Active Focus

Shipping the Warmane portrait userscript fixes through draft PR #8.

## Current Branch Rule

Codex works on `codex-dev`, pushes `origin/codex-dev`, and opens PRs into `main`. Codex does not push or merge `main` directly.

## This Session

- Fixed the portrait userscript modelviewer handoff race that caused rendered portrait capture to be skipped when the iframe loaded before the Warmane parent page wrote the character target.
- Fixed the `/guild-roster` hydration mismatch caused by the userscript writing `data-pizza-portrait-queued` onto SSR avatar nodes before React hydration.
- Replaced that DOM queue marker with an in-memory `WeakSet`.
- Bumped the portrait userscript to `0.5.2`.
- Added local userscript builders and install endpoints for gear, guild roster, and player portraits.
- Added local install links and URL fields on `/admin` for browser-assisted local imports.
- Kept production userscript URLs unchanged for Railway production.
- Verified the three local endpoints on `http://127.0.0.1:3001`.
- Validation passed locally with bundled runtimes: focused userscript/admin tests, lint, type-check, and production build.
- Recovered the local `3001` dev server after a stale `.next` cache caused `Cannot find module './5611.js'`.

## Next Actions

| Task | Status | Notes |
|---|---|---|
| Add local gear userscript | DONE | `http://127.0.0.1:3001/api/admin/armory-gear/userscript.local.user.js` |
| Add local roster userscript | DONE | `http://127.0.0.1:3001/api/admin/guild-roster/userscript.local.user.js` |
| Add local portrait userscript | DONE | `http://127.0.0.1:3001/api/player-portraits/userscript.local.user.js` |
| Fix portrait capture race | DONE | Modelviewer frames now retry until Warmane target handoff is available |
| Fix portrait hydration mismatch | DONE | Userscript no longer writes `data-pizza-portrait-queued` before hydration |
| Run validation | DONE | Focused tests, lint, type-check, build, and live local endpoint checks passed |
| Recover local 3001 server | DONE | Cleared generated `.next`, restarted `PizzaLogsLocalTestServer`, verified `/` and local portrait endpoint return 200 |
| Branch publication | DONE | Commit and push `codex-dev` for draft PR #8 |
| PR creation | DONE | Draft PR #8 is open; connector still lacks PR write permission |
| Human review | NEXT | Neil updates portrait userscript from `/admin` after merge and tests by visiting Warmane character pages |

## Open Follow-Ups

- Add hard server-side upload size enforcement.
- Decide whether app-level upload rate limiting is needed or Railway-level controls are enough.
- Continue using browser-assisted Warmane imports until a local automated sync agent is built.
- Absorbs remain future parser work.
- If the laptop port changes from `3001`, add matching local userscript variants or update the local constants.

## Reference

- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Parser contract: `docs/parser-contract.md`
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- Item metadata table: `wow_items`
