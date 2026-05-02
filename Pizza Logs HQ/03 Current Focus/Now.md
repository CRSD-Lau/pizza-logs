# Now

## Status

**Parser fixture harness added.** Three synthetic fixtures cover: 25N kill (ENCOUNTER_START/END path), 25H kill (heroic detection via spell marker even with wrong difficultyID), and Gunship kill (ENCOUNTER_END success=0 → crew death override).

Worktree branch `claude/musing-curie-718edb` has the fixture harness.
Prior worktree branch `claude/sharp-ramanujan-489f4d` (WowItem DB cache) still needs merging to main.

---

## Next Up

| Task | Type | Notes |
|------|------|-------|
| Implement `test_fixtures.py` | CODE | Pytest parametrize over fixture dirs; assert boss_name, difficulty, outcome, damage ranges |
| Merge worktrees to main and push | DEPLOY | `claude/sharp-ramanujan-489f4d` first, then `claude/musing-curie-718edb`; Railway auto-deploys |
| Seed item DB | SETUP | After deploy: `npm run db:seed-items` — one-time bulk Wowhead fetch |
| Verify gear pages | VERIFY | Check Writman, Yanna, Lausudo for correct ilvl, GS, slot labels |
| Add real log fixtures | TEST | Trim real WoWCombatLog.txt pulls; follow README in fixtures/ |
| Fix HC/Normal difficulty detection | BUG | Regression/open task |
| Stats / Analytics page | FEATURE | Brainstorm first, then design, then build |
| Verify Skada numbers in-game | VERIFY | Neil to do manually |
| Absorbs (PW:S) | FEATURE | Combined column. Do after verification. |

---

## Reference
- Skada source: https://github.com/bkader/Skada-WoTLK
- Log file: `C:/Users/neil_/OneDrive/Desktop/PizzaLogs/WoWCombatLog/WoWCombatLog.txt`
- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Fixture harness: `parser/tests/fixtures/` — README has schema and how to add real log fixtures
- Admin browser import: `/admin` → Warmane Gear Cache → install/update hosted userscript (`/api/admin/armory-gear/userscript.user.js`), then use the Pizza Logs panel on Warmane Armory
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- WowItem cache table: `wow_items`
