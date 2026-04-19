# Latest Handoff

## Date
2026-04-19

## Last Completed
- Fixed SPELL_HEAL parsing (len < 15 → < 11, crit index 14 → 13)
- Fixed Valithria KILL detection
- Added false positive filter
- Added Gunship Battle aliases
- Fixed TypeScript build error in UploadZone
- Added SPELL_CLASS_MAP — all 10 WoW classes detected from spell names
- Fixed KILL duration: use boss death timestamp
- Class colors wired in UI — working after re-upload
- Reordered bosses: ICC first, Naxx last
- Added browser notification on upload success/failure
- Vault + CLAUDE.md established

## Current State
- App live: https://pizza-logs-production.up.railway.app
- DB has data — log was re-uploaded after class color fix
- Latest git: main branch
- Temporary reset-db endpoint still exists — DELETE when done testing

## Known Issues / Investigating
- Marrowgar: app shows 9.45k, reference shows 9.3k — app is OVER not under
- Deathbringer Saurfang accuracy TBD
- Progress bar is fake (time-estimate only, not real parser progress)

## Known Limitations
- Heroic difficulty undetectable (no ENCOUNTER_START on Warmane)
- Gunship Battle undetectable (timing overlap with Saurfang)

## Exact Next Step
1. Investigate Marrowgar DPS over-count vs uwu-logs reference
2. Delete app/api/admin/reset-db/route.ts
3. Consider real progress via SSE (bigger change)

## Key Files
- parser/parser_core.py — core parsing logic
- parser/bosses.py — boss definitions
- app/api/upload/route.ts — upload handler
- components/upload/UploadZone.tsx — upload UI + notifications
- lib/constants/bosses.ts — boss order + definitions
- lib/constants/classes.ts — class colors
