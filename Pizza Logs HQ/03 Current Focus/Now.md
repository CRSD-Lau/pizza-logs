# Now

## Active
- Session ended — vault updated, DB empty, ready for next session

## Immediate Next Steps
1. Set `ADMIN_SECRET` in Railway → Web Service → Variables
2. Test upload: enter character name → confirm drop zone unlocks → upload completes cleanly (no false "network error")
3. Pick next feature from [[Backlog]] — absorbs tracking is highest value

## Bugs
See [[Known Issues]] for full list. No new bugs this session.

## Recently Shipped (2026-04-20)
- Footer text corrected (server-side, not client-side)
- Admin auth: `/admin/login` branded page + middleware + ADMIN_SECRET env var
- Upload form: mandatory Character field, Realm dropdown (Lordaeron/Icecrown/Onyxia/Blackrock), locked drop zone UX
- False "network error" after successful upload — fixed (succeeded flag)
- Drop zone browser-native file open when locked — fixed (explicit preventDefault handlers)
- Vault audit: archived superseded files, cross-linked orphaned notes

## Not Working On
- Heroic detection (impossible without ENCOUNTER_START)
- Gunship Battle detection (impossible)
- Major redesigns

## Reminder
One working feature at a time.
