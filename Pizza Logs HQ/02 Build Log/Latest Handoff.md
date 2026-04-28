# Latest Handoff

## Date
2026-04-27

## Git
**Branch:** `main`
**Latest commit before this handoff commit:** `1c26cb4` docs: end of session handoff - v0.1.0 shipped
**Release:** `v0.1.0` - tagged and published on GitHub

---

## What Was Done This Session

### 1. Codex repo instructions added
- Added `AGENTS.md` as the Codex equivalent of `CLAUDE.md`
- Codex now has the same mandatory vault-read and vault-update rules as Claude
- This was a docs/workflow change only; no app or parser code changed

### 2. Working tree state checked
- Confirmed the repo is not git-clean because of local Obsidian workspace files
- Left `Pizza Logs HQ/.obsidian/graph.json` and `Pizza Logs HQ/.obsidian/workspace.json` untouched
- Kept the session focused on shared agent workflow docs, not personal editor state

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **Release**: `v0.1.0`
- **Tests**: 71/71 passing from the previous handoff; not rerun in this docs-only session
- **Git**: `main` only; `AGENTS.md` now belongs in the repo alongside `CLAUDE.md`
- **HPS gap**: ~21-28% under Skada for Disc priests - expected until absorbs are implemented
- **DPS**: <1% residual from orphaned pets - accepted

---

## Open Items (priority order)

### 1. BUG: Hardcore vs Normal difficulty detection regression
Tracked in: https://github.com/CRSD-Lau/Pizza-Logs/issues
- Identify what signal in the Warmane log distinguishes Normal from Hardcore
- Fix difficulty assignment in `parser/parser_core.py`
- Add regression tests

### 2. Stats / Analytics page
New `/stats` page - brainstorm session needed before any code.
Confirmed scope:
- Class performance comparisons (avg DPS/HPS by class)
- Raid comparisons (instance vs instance, week over week)
- All-time records and progression trends
- Multiple graph types using Recharts

### 3. Verify Skada numbers in-game
Neil to upload a log and compare DPS/HPS to in-game Skada for the same fight.
Deferred to next week.

### 4. Absorbs - Power Word: Shield
Decision: **combined Healing+Absorbs column** (not separate).
Do after Skada verification.
1. Parse `SPELL_AURA_APPLIED` for PW:S - store capacity + caster
2. Parse `absorbed` field on damage events - attribute to Disc priest
3. Merge into HPS column in API + UI

---

## Next Step

Fix the HC/Normal detection regression in `parser/parser_core.py`, then add regression tests before moving on to `/stats`.
