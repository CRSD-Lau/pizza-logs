# Now

## Status

Admin page cleanup is complete and validated. TypeScript was clean in the previous verification (`tsc --noEmit` zero errors). All bookmarklet/copy-paste/GuildRosterSyncButton references were removed. `clearDatabase` only deletes volatile upload-derived data (weeklySummaries + uploads via cascade).

Current active focus is **Warmane roster/gear automation**. The approved direction is laptop-primary automation: a local sync agent will fetch Warmane Armory roster and character gear from Neil's laptop, validate snapshots, and POST imports into the hosted Pizza Logs app. Railway should serve cached snapshots and should not depend on live Warmane/Wowhead requests during page render.

`CLAUDE.md` now contains a dedicated handoff section for this work so Claude sessions on the laptop/desktop should pick up the sync-agent context quickly.

Design spec: `docs/superpowers/specs/2026-05-01-warmane-sync-agent-design.md`.

Note: Jest test suites fail with a pre-existing ESM/Babel config issue (no `jest.config.*` in repo, no transform for `import` syntax). This is not caused by the admin cleanup.

---

## Next Up

| Task | Type | Notes |
|------|------|-------|
| Move context to desktop/Claude | HANDOFF | Ensure desktop checkout includes the sync-agent design spec and updated `CLAUDE.md` |
| Review Warmane sync agent design | PLAN | Approve or revise `docs/superpowers/specs/2026-05-01-warmane-sync-agent-design.md` before implementation |
| Write Warmane sync implementation plan | PLAN | Use the design to plan backend hardening, sync CLI, admin health UI, and laptop scheduling |
| Build laptop-primary Warmane sync agent | FEATURE | First command should be `npm run sync:warmane`; runs from laptop, not Railway |
| Harden roster/gear import snapshots | BUG/TECH DEBT | Reject invalid/empty/HTML challenge payloads and preserve last known good data |
| Fix HC/Normal difficulty detection | BUG | Regression/open task |
| Push and deploy current scoped changes | DEPLOY | Push to `origin/main`; Railway auto-deploys; update Tampermonkey if userscript versions are bumped |
| Spot-check gear slot/GearScore fix | VERIFY | After deploy, confirm `/players/Lausudo` shows the libram as `Ranged/Relic` and full 2H+relic GearScore; confirm `/players/Aalaska` shows staff/wand in the weapon row |
| Spot-check Titan Grip GS fix | VERIFY | After deploy, confirm `/players/Contents` no longer double-counts both two-handed weapons |
| Refresh gear metadata | VERIFY | Temporary manual path remains the hosted Warmane userscript; target replacement is automated laptop sync agent |
| Stats / Analytics page | FEATURE | Brainstorm first, then design, then build |
| Populate Guild Roster | VERIFY | Temporary manual path remains roster userscript v1.0.4; target replacement is automated laptop sync agent |
| Spot-check Warmane panels | VERIFY | Confirm Gear Sync appears on character pages and Roster Sync appears on guild pages |
| Verify Skada numbers in-game | VERIFY | Neil to do manually next week |
| Absorbs (PW:S) | FEATURE | Combined column. Do after verification. |

---

## Reference
- Skada source: https://github.com/bkader/Skada-WoTLK
- Log file: `C:/Users/neil_/OneDrive/Desktop/PizzaLogs/WoWCombatLog/WoWCombatLog.txt`
- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Wiki: https://github.com/CRSD-Lau/Pizza-Logs/wiki
- Warmane gear source pattern: `https://armory.warmane.com/api/character/<name>/Lordaeron/summary`
- Warmane guild roster source patterns: prefer HTML `https://armory.warmane.com/guild/Pizza+Warriors/Lordaeron/summary` for Rank/Professions, fallback to JSON `https://armory.warmane.com/api/guild/Pizza+Warriors/Lordaeron/summary` and `/members`
- Wowhead item enrichment pattern: `https://www.wowhead.com/wotlk/tooltip/item/<id>`
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- Admin browser import: `/admin` -> Warmane Gear Cache -> install/update hosted userscript (`/api/admin/armory-gear/userscript.user.js`), then use the Pizza Logs panel on Warmane Armory
