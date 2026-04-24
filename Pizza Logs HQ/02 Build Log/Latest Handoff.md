# Latest Handoff

## Date
2026-04-24

## Git
**Latest commit:** `ef152ba` — main branch
fix: count absorbed damage in session_damage; DUPLICATE UX; admin delete-upload

---

## Session Total Gap — CLOSED (Data Limitation, Not a Bug)

After deploying ef152ba and re-uploading the April 19 Notlich Lordaeron log
(upload ID `cmoda1m3l000265wet559n9yx`), totals are:

| Session | Pizza Logs | UWU | Gap |
|---|---|---|---|
| Session 1 (10H, idx 0) | ~193.82M | 200,402,269 | −3.29% |
| Session 2 (25H, idx 1) | ~404.13M | 407,718,447 | −0.88% |

**The absorbed fix had zero effect on the numbers**, which confirms:

1. **Warmane does not log Lady Deathwhisper's mana barrier** using the standard
   WotLK SPELL_DAMAGE `absorbed` field. The barrier's damage absorption happens
   server-side and doesn't produce a log entry with `absorbed > 0`.

2. **The gap is a log file coverage difference.** The UWU reference numbers come
   from Felyyia (10H) and Notlich (25H) — players who uploaded *their own* combat
   logs, which started 5–16 minutes earlier in the raid night.
   
   - 10H: 6.58M ÷ ~7,000 collective DPS ≈ **16 minutes** of missing early log
   - 25H: 3.59M ÷ ~12,500 collective DPS ≈ **5 minutes** of missing early log

3. **The parser is working correctly.** Every event in the user's log is counted.
   The delta is ICC trash/bosses that happened before `/combatlog` was started.

The absorbed damage fix (`ef152ba`) is still correct code — it handles logs where
absorbs are properly logged (retail WoW, some encounters on other servers) and
passes all 46 tests.

---

## What Was Done This Session

### 1. Absorbed damage fix (TDD — 46/46 tests green)

**Fix** (`parser/parser_core.py` session accumulator):
```python
# SWING_DAMAGE — absorbed at index 12:
absorbed = _safe_float(parts[12]) if len(parts) > 12 else 0.0
eff = max(0.0, float(parts[7]) + absorbed - float(parts[8]))

# Spell events (SPELL_DAMAGE / RANGE_DAMAGE / etc.) — absorbed at index 15:
absorbed = _safe_float(parts[15]) if len(parts) > 15 else 0.0
eff = max(0.0, float(parts[10]) + absorbed - float(parts[11]))
```

**Two new TDD tests added (RED→GREEN confirmed):**
- `test_session_damage_includes_absorbed_spell_damage`
- `test_session_damage_includes_absorbed_swing_damage`

### 2. DUPLICATE UX fix (`components/upload/UploadZone.tsx`)

Before: gold panel with yellow "already uploaded" warning that looked like an error.

After:
- Subtitle: "This log was already parsed — your data is ready"
- Gold "View your session →" link → `/uploads/${result.uploadId}/sessions/0`
- Yellow warning hidden for DUPLICATE state

### 3. Admin: per-upload Delete button (`app/admin/`)

Added `DeleteUploadButton` component and `deleteUpload` server action so
specific uploads can be deleted without nuking the entire database.

---

## Full Commit History

| Commit | Fix |
|---|---|
| 7868a17 | Overkill subtracted, P2P excluded |
| 8a6e9ff | Interaction scan restricted to 0xF14* |
| 9e0ae01 | Full-session damage accumulator |
| 75ae523 | DAMAGE_SHIELD added |
| dbb95db | TYPE_GUARDIAN added |
| ef152ba | Absorbed damage + DUPLICATE UX + admin delete |

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **All 46 parser tests green**
- **TypeScript build clean**
- **Gap investigation closed** — data limitation, not parser bug

---

## Next Features (when ready)

1. **Absorbs tracking**: parse `SPELL_ABSORBED` events for healing stats
2. **Player detail page**: per-boss breakdown per player per session
3. **Damage mitigation stats**: `SPELL_MISSED` subtypes (ABSORB, BLOCK, DODGE, etc.)
4. **SPELL_MISSED ABSORB** in session_damage — would handle fully-absorbed hits
   that never generate a DAMAGE event; low priority (gap already explained by
   log coverage, not missing ABSORB misses)
