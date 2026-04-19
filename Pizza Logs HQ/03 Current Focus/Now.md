# Now

## Active
- Clear DB and re-upload a log to test: target breakdown + raid detail page

## Next
- Investigate Marrowgar DPS over-count vs uwu-logs reference
- Fix footer text ("client-side" is wrong — parsing is server-side)
- Admin page auth (simple secret middleware — medium priority)
- Boss HP threshold heroic detection (25N vs 25H total damage ratio ~1.45x)

## Recently Shipped (2026-04-19)
- feat: per-mob target breakdown + raid detail page
  - parser: TargetStats per actor, serialized to targetBreakdown JSON
  - Participant model: targetBreakdown Json? field
  - /encounters/[id]: Target Breakdown section (interactive mob table)
  - /uploads/[id]: NEW raid detail page — encounter list + full raid mob damage aggregation
  - /uploads: filename links to raid page, "View raid detail →" per upload
  - Dockerfile: prisma db push runs at container startup so schema migrations auto-apply

## Not Working On
- Heroic detection (impossible)
- Gunship Battle detection (impossible)
- Monetization
- Major redesigns

## Reminder
One working feature at a time.
