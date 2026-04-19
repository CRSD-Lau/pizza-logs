# Latest Handoff

## Date
2026-04-19

## Last Completed
- SSE real progress streaming (parser → Next.js → browser)
- Fixed UploadFile "read of closed file" bug (write to disk before StreamingResponse)
- Deleted temporary reset-db endpoint
- Added Python __pycache__ to .gitignore
- Built out Obsidian vault (START HERE, Architecture, Parser Deep Dive, Feature Status, Railway Guide, Known Issues)
- Updated CLAUDE.md to enforce vault reads at session start

## Current State
- App: https://pizza-logs-production.up.railway.app
- DB: **EMPTY** — was cleared for SSE test, needs re-upload
- Git: main branch, all changes pushed
- SSE streaming: shipped but **not yet tested** — needs upload after Railway deploy

## Exact Next Step
1. Wait for Railway deploy (~2-3 min after last push)
2. Re-upload WoWCombatLog.txt — verify:
   - SSE progress bar shows real % (not fake time curve)
   - Encounters appear correctly
   - Class colors visible
3. Investigate Marrowgar DPS over-count (app 9.45k vs reference 9.3k)

## Known Issues
See [[Known Issues]] for full list.
- Marrowgar DPS slightly over reference
- SSE needs E2E test

## Notes
- reset-db endpoint is DELETED — to clear DB again, see Railway Guide
