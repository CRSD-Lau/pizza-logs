# Technical Debt

> Real debt that will bite us. Not a wish list.

---

## High

### Manual Warmane sync is fragile
- **Debt:** Gear and roster freshness depend on the admin remembering to run browser userscripts.
- **Impact:** Production gear icons, roster rows, or cached snapshots can go stale.
- **Fix:** Build the local automated Warmane sync agent with snapshot validation and last-known-good preservation.
- **Effort:** L

### Upload endpoint lacks hard server-side limits
- **Debt:** UI documents a 1GB limit, but `/api/upload` streams request bodies through to the parser without a hard server-side byte cap.
- **Impact:** Large or abusive uploads could waste parser/web resources.
- **Fix:** Enforce `MAX_FILE_SIZE_BYTES` before or while streaming and return an SSE error before forwarding oversized logs.
- **Effort:** M

---

## Medium

### Player page links from encounter detail go to global profile
- **Debt:** Encounter detail page links players to `/players/[name]` (all-time), not to the session-scoped page.
- **Impact:** Session pages and encounter detail pages navigate differently.
- **Fix:** Pass `uploadId` and `sessionIndex` through encounter detail so roster links can go to the session page.
- **Effort:** 45 min

### `inferRole` in upload route is a rough heuristic
- **Debt:** Role is inferred from healing/damage ratio; hybrids and self-healing classes can be mislabeled.
- **Impact:** Role badges are unreliable and `TANK` is never inferred.
- **Fix:** Infer role from class/spec evidence rather than only healing ratio.
- **Effort:** 2-3 hours

---

## Low

### Weekly page (`/weekly`) not in nav
- **Debt:** Nav has "This Week" language, but the page has not been recently audited for accuracy.
- **Effort:** Audit needed

### Branded 404 page
- **Debt:** Default Next.js 404.
- **Effort:** 20 min

---

## Fixed / Retired Debt

| Item | Status |
|---|---|
| Footer text was wrong | Fixed. Footer now says parsing is handled server-side on Railway |
| Admin page had no auth | Fixed. Admin routes/actions require `ADMIN_SECRET`; production fails closed if missing |
| Reset-DB endpoint pattern was manual | Fixed. `/admin` has built-in cleanup actions behind admin auth |
| `stalled` field in `UploadState` was missing from reset calls | Fixed 2026-04-20 |

---

## Won't Fix

| Item | Reason |
|---|---|
| Heroic detection from Warmane logs alone | Impossible without reliable encounter markers or heroic-only IDs |
| DPS accuracy to 0.01% | Parser matches Skada event rules; residual gaps come from orphaned pets/log boundaries |
| Gunship Battle as a separate reliable marker | Warmane does not expose reliable encounter markers for it |
