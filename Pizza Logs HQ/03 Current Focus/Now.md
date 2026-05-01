# Now

## Status

Admin page cleanup is **complete and validated**. TypeScript is clean (`tsc --noEmit` zero errors). All bookmarklet/copy-paste/GuildRosterSyncButton references removed. `clearDatabase` now only deletes volatile upload-derived data (weeklySummaries + uploads via cascade). Branch is ready to push and deploy.

Note: Jest test suites fail with a pre-existing ESM/Babel config issue (no `jest.config.*` in repo, no transform for `import` syntax). This is not caused by the admin cleanup and existed before this branch.

---

## Next Up

| Task | Type | Notes |
|------|------|-------|
| Fix HC/Normal difficulty detection | BUG | Regression - issue open on GitHub |
| Push and deploy this branch | DEPLOY | Push to `origin/main`; Railway auto-deploys; update Tampermonkey if userscript versions bumped |
| Spot-check gear slot/GearScore fix | VERIFY | After deploy, confirm `/players/Lausudo` shows the libram as `Ranged/Relic` and full 2H+relic GearScore; confirm `/players/Aalaska` shows staff/wand in the weapon row |
| Spot-check Titan Grip GS fix | VERIFY | After deploy, confirm `/players/Contents` no longer double-counts both two-handed weapons |
| Refresh gear metadata | VERIFY | Rerun the hosted Warmane userscript so cached rows missing Wowhead `equipLoc` metadata get re-enriched for exact weapon scoring |
| Stats / Analytics page | FEATURE | Brainstorm first, then design, then build |
| Populate Guild Roster | VERIFY | Apply migrations, deploy, install/update roster userscript v1.0.4 from `/admin`, sync from Warmane guild page, then run Warmane Gear Sync from a character page so roster-only players get gear/GS |
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
- Wowhead item enrichment pattern: `https://www.wowhead.com/wotlk/item=<id>/<slug>`
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- Admin browser import: `/admin` -> Warmane Gear Cache -> install/update hosted userscript (`/api/admin/armory-gear/userscript.user.js`), then use the Pizza Logs panel on Warmane Armory
