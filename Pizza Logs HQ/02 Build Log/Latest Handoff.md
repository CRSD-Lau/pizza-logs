# Latest Handoff

## Date
2026-04-26

## Git
**Branch:** `main` (clean — only branch)
**Latest commit:** `219cb9a` docs: rewrite README to reflect current state

---

## What Was Done This Session

### 1. Cleanup commit pushed to main
- Staged vault changes from previous session committed (`f4764db`)
- Deleted stale UWU parity docs, validate_uwu.py
- Added parser/tests/__init__.py
- Updated all vault files (Decision Log, Latest Handoff, Now.md, Parser Deep Dive, Feature Status, Technical Debt, What Claude Forgets, Known Issues, START HERE, Obsidian plugins/themes)

### 2. .gitignore hardened
- `tsconfig.tsbuildinfo` — build artifact, untracked and ignored
- `WoWCombatLog/` — 158MB log file, never track
- `parser/diag_*.py` — throwaway debug scripts
- `.claude/worktrees/` — Claude worktree directories

### 3. README rewritten
Old README had stale/wrong info. New README reflects:
- Deployment: Railway (not Docker Compose)
- Architecture: Warmane has no ENCOUNTER_START/END; heuristic detection
- Parser: Skada-WoTLK as source of truth, DMG_EVENTS, heal formula, absorbs TBD
- Pages: all current routes (raids, sessions, leaderboards, players)
- Prisma CLI: correct `node ./node_modules/prisma/build/index.js` command
- Project structure: AccordionSection, tests/, Obsidian vault

### 4. Branch cleanup
- Deleted `claude/elated-sutherland-11ac4b` (local + remote)
- Deleted `claude/parser-rework-skada-logic` (remote)
- GitHub now has only `main`

---

## Current State

- **Live app**: https://pizza-logs-production.up.railway.app
- **Tests**: 71/71 passing
- **Git**: main only, clean
- **HPS gap**: ~21-28% under Skada — expected (PW:S absorbs not implemented)
- **DPS**: <1% residual from orphaned pets — accepted

---

## Open Items

### HPS gap — Power Word: Shield absorbs
Skada tracks absorbs in `Absorbs.lua` as `actor.absorb` (separate from `actor.heal`).
To close the ~25% gap:
1. Parse `SPELL_AURA_APPLIED` for PW:S spell IDs — store shield capacity per caster
2. Parse `absorbed` field on incoming damage events — attribute consumed absorb to Disc priest

Decision needed: heal-only column (Skada Healing module) or heal+absorbs column (combined view)?

### Footer text bug
Footer says "All parsing done client-side" — wrong, it's server-side. Fix: update footer component.

### Admin page has no auth
`/admin` is publicly accessible. Fix: env-var cookie check in middleware.

---

## Next Steps (priority order)

1. Upload a log and verify numbers match Skada in-game
2. Fix footer text (5 min)
3. Add admin auth (30 min)
4. Decide absorbs strategy — heal-only or heal+absorbs column?
5. If absorbs: implement Absorbs.lua-style tracking
