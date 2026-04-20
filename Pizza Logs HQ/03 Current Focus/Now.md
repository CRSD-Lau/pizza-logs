# Now

## Active
- Session ended — parser accuracy fixes complete, pushed to Railway, DB needs wipe via admin page

## Immediate Next Steps
1. Wipe DB via admin page: `/admin` → Clear Database
2. Upload the WoWCombatLog.txt to verify clean parser output in production
3. Pick next feature from [[Backlog]] — absorbs tracking is highest value

## Bugs
See [[Known Issues]] for full list. Marrowgar over-count still open.

## Recently Shipped (2026-04-20 session 2)
- False Deathbringer Saurfang WIPE eliminated (root: duplicate wow_boss_id=37813 between Gunship + Saurfang)
- Gunship Battle aliases removed (Skybreaker/Orgrim's Hammer/Muradin — all NPC-vs-NPC, no player damage, always false positive)
- Blood Prince Council kill duration fixed — aliases now checked in boss_died_ts (Prince Valanar = alias of BPC)
- Assembly of Iron duplicate wow_boss_id=33271 (was same as General Vezax) — set to None

## Recently Shipped (2026-04-20 session 1)
- Footer text corrected (server-side, not client-side)
- Admin auth: `/admin/login` branded page + middleware + ADMIN_SECRET env var
- Upload form: mandatory Character field, Realm dropdown (Lordaeron/Icecrown/Onyxia/Blackrock), locked drop zone UX
- False "network error" after successful upload — fixed (succeeded flag)
- Drop zone browser-native file open when locked — fixed (explicit preventDefault handlers)

## Not Working On
- Heroic detection (impossible without ENCOUNTER_START)
- Gunship Battle detection (impossible)
- Major redesigns

## Reminder
One working feature at a time.
