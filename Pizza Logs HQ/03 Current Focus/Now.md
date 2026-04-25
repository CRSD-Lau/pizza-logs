# Now

## Status
Task 1: **Cap Milestone Awards to Top 3** — DONE

Changed `MILESTONE_RANKS` from `[1, 3, 5, 10, 25, 50, 100]` to `[1, 2, 3]` in `lib/actions/milestones.ts`.

---

## What Changed
- Only new milestones will use top-3 ranks
- Past milestones at ranks 4+ remain unchanged (no retroactive removal)
- Type-check: 0 errors
- Commit: `a31cb59`

---

## Next Actions

1. Verify milestone system in live app (manual test)
2. Monitor new uploads for correct award capping
3. Plan next feature from backlog
