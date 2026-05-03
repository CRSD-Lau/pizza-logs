# Now

## Status

**Codex modernization branch implemented and branch gates passed.** The repo is now Codex-first, tracked Claude-specific artifacts were removed, stale Wowhead runtime code was deleted, admin auth is safer in production, compose admin remains usable with local-only overrides, and parser/web validation passed on the branch.

---

## Next Up

| Task | Type | Notes |
|------|------|-------|
| Commit modernization branch | RELEASE | Stage safe files and commit `chore: migrate Pizza Logs workflow to Codex and clean stale code` |
| Commit modernization branch | RELEASE | Commit message: `chore: migrate Pizza Logs workflow to Codex and clean stale code` |
| Merge to main | RELEASE | Use the existing main worktree if needed because `main` is checked out separately |
| Re-run gates on main | VERIFY | Parser tests, TS tests, type-check, lint, build, secret scan |
| Push main to origin | DEPLOY | Railway auto-deploys after `git push origin main` |
| Verify production admin config | DEPLOY | Confirm Railway Web Service has `ADMIN_SECRET`; production fails closed without it |
| Deploy icon DOM fallback fix | DEPLOY | Included in current main base; push main to origin for Railway deploy |
| Install/update Gear Sync `1.7.0` | VERIFY | Open `/admin` and install/update hosted Warmane Gear Sync userscript |
| Run Warmane Gear Sync once | VERIFY | Script fetches queued players' Warmane pages and writes missing `iconName` values |
| Verify Lausudo icons | VERIFY | Check item IDs `50024`, `49964`, `49985` |
| Stats / Analytics page | FEATURE | Brainstorm first, then design, then build |
| Verify Skada numbers in-game | VERIFY | Neil to do manually |
| Absorbs (PW:S) | FEATURE | Combined column. Do after verification. |

---

## Reference

- Skada source: https://github.com/bkader/Skada-WoTLK
- Log file: `C:/Users/neil_/OneDrive/Desktop/PizzaLogs/WoWCombatLog/WoWCombatLog.txt`
- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Admin browser import: `/admin` -> Warmane Gear Cache -> install/update hosted Warmane Gear Sync userscript, then use the Pizza Logs panel on Warmane Armory
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- WowItem cache table: `wow_items`
- Item template import: `npm run db:import-items` (AzerothCore -> wow_items)
