# Known Issues

## Active Bugs

### 🔴 Marrowgar DPS Over-Count
- **Symptom**: App shows ~9.45k for Lausudo on Marrowgar; uwu-logs reference shows 9.3k
- **Direction**: App is OVER (was under before boss-death duration fix, now slightly over)
- **Hypothesis**: Parser may be including events slightly before the pull, or the reference site excludes certain event types we include
- **Status**: Under investigation — not yet root-caused
- **Reference**: https://uwu-logs.xyz/reports/26-04-17--18-47--Rimeclaw--Lordaeron/player/Lausudo/?boss=lord-marrowgar&mode=25H&attempt=1&s=3297&f=3633

### 🟡 Gunship Battle — Not Detected
- **Symptom**: Gunship Battle never appears in results
- **Cause**: Fight is entirely NPC-vs-NPC (troops, ships); players deal damage to Kor'kron/Alliance soldiers who aren't in ALL_BOSS_NAMES. No player events touch the boss aliases. Heuristic can't detect it.
- **Status**: Accepted known limitation. Cannot fix without ENCOUNTER_START.

---

## Resolved (for reference)

| Bug | Fix | Commit |
|---|---|---|
| HPS = 0 on all encounters | SPELL_HEAL length check was `< 15`, fixed to `< 11`; crit was `parts[14]`, fixed to `parts[13]` | c630c12 |
| Valithria both WIPEs | Added "Green Dragon Combat Trigger" death detection | c630c12 |
| False positive Sindragosa 10N | Added `total_damage == 0 and duration < 60` filter | c630c12 |
| Gunship adds triggering Saurfang KILL | Removed add NPC aliases from Gunship def | c630c12 |
| False Deathbringer Saurfang WIPE (230s) | Gunship wow_boss_id=37813 conflicted with Saurfang; removed Gunship aliases | 5340523 |
| Blood Prince Council kill duration wrong | boss_died_ts now checks aliases (Prince Valanar → BPC) | 5340523 |
| TypeScript build error (UploadZone reset) | Missing `elapsed: 0` in reset state | 9e70a1e |
| DPS too low (post-fight tail) | Use boss death timestamp for KILL duration | 975756d |
| Class colors not showing | Parser never set `wow_class` — fixed with SPELL_CLASS_MAP | 975756d |
| UploadFile "read of closed file" | Write file to disk before returning StreamingResponse | c131a97 |

---

## Known Limitations (not bugs, won't fix)

| Limitation | Reason |
|---|---|
| Heroic difficulty undetectable | Warmane uses same NPC/spell IDs for 25N and 25H; no ENCOUNTER_START difficulty flag |
| Gunship Battle undetectable | See above |
| DPS accuracy ±1-2% vs uwu-logs | Different event inclusion rules; fingerprint-level accuracy probably not achievable |
| Progress bar fake before file received | File write to parser happens before SSE can start; first event is at 28% |
