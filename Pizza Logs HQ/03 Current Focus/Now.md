# Now

## Status
`v0.1.0` shipped. Wiki live. Railway deployed.
Public upload analytics have been moved into admin-only routes, and the mobile nav/raids/leaderboards pass is done.
Native Warmane Armory gear UI has been added to player profiles and awaits verification.

---

## Next Up

| Task | Type | Notes |
|------|------|-------|
| Fix HC/Normal difficulty detection | BUG | Regression - issue open on GitHub |
| Verify Warmane gear on Railway | VERIFY | Local direct requests to Warmane were Cloudflare/403 blocked; UI fails gracefully |
| Stats / Analytics page | FEATURE | Brainstorm first, then design, then build |
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
