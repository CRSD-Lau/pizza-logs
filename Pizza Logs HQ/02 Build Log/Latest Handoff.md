# Latest Handoff

## Date
2026-04-20

## Git
**Latest:** `c2276a1` — main branch, pushed, Railway deploying

## DB
EMPTY — cleared after each feature this session

---

## Completed This Session

### Technical Debt ✅
- **Footer fix**: "client-side, no data leaves your browser" → "All parsing handled server-side on Railway" (`app/layout.tsx`)
- **Admin auth middleware** (`middleware.ts`): protects `/admin/*` — checks `x-admin-secret` cookie or header against `ADMIN_SECRET` env var; redirects to `/admin/login` if missing/wrong
- **Admin login page** (`app/admin/login/page.tsx` + `actions.ts`): branded Pizza Logs UI, server action verifies secret, sets cookie, hard-redirects to `/admin` on success; shows error on wrong secret

### Upload Form ✅
- **Character field** (new, mandatory): uploader's character name — stored as `uploaderName String?` on Upload model; drop zone locked until filled
- **Realm** → dropdown: Lordaeron (default) / Icecrown / Onyxia / Blackrock
- **Server** → locked to Warmane (single option, label preserved)
- **Guild** → unchanged, optional

### Upload Bug Fixes ✅
- **False "network error" after success**: `succeeded` flag set on `complete` event — stream-close errors after that are silently ignored
- **File opening in browser tab**: when locked (no character name), explicit `onDragOver` / `onDragEnter` / `onDrop` / `onClick` handlers call `preventDefault()` — browser never gets the file; hidden file input not rendered

### Vault Audit ✅
- Archived 5 superseded files → `99 Archive/`
- Cross-linked all orphaned notes (Technical Debt, Security Checklist, Growth & Business, Prompt Library)
- Now.md refactored to link → `[[Known Issues]]`

---

## Files Changed

| File | Change |
|---|---|
| `app/layout.tsx` | Footer copy fixed |
| `middleware.ts` | NEW — admin route guard |
| `app/admin/login/page.tsx` | NEW — branded login form |
| `app/admin/login/actions.ts` | NEW — server action to verify ADMIN_SECRET |
| `prisma/schema.prisma` | `Upload.uploaderName String?` added |
| `lib/schema.ts` | `UploadRequestSchema` — uploaderName required |
| `app/api/upload/route.ts` | reads + stores uploaderName |
| `components/upload/UploadZone.tsx` | Character field, realm dropdown, lock UX, succeeded flag |
| `Pizza Logs HQ/*` | Vault audit — archive, cross-links, Now.md refactor |

---

## Architecture Notes (new this session)
- `ADMIN_SECRET` env var must be set in Railway → Web Service → Variables
- Login via: `document.cookie = "x-admin-secret=SECRET; path=/; SameSite=Strict"` or the `/admin/login` page
- `uploaderName` is nullable in DB — old uploads unaffected; new uploads require it in the form
- Drop zone: when `isLocked`, `lockedProps` replaces `getRootProps()` entirely (not just `disabled`)
- Server action (`"use server"`) used for secret verification — avoids fetch/redirect detection race

---

## Exact Next Steps
1. Set `ADMIN_SECRET` in Railway → Web Service → Variables (if not done)
2. Upload a log via `/` — enter character name, confirm drop zone unlocks, upload completes with success (not "network error")
3. Next feature: pick from Backlog — absorbs tracking is next highest-value item

## Pending Features
- **Absorbs tracking**: parse `SPELL_ABSORBED` events — parser + schema + UI work (L effort)
- **Damage mitigation stats**: `SPELL_MISSED` subtypes (ABSORB, BLOCK, PARRY, DODGE)
- **Consumable tracking**: buff applications from consumable spells (XL effort)
- **Gunship + Saurfang fix**: known limitation — investigate if fixable
- **Marrowgar DPS over-count**: ~9.45k vs uwu-logs 9.3k — not root-caused

## Not Working On
- Heroic detection (impossible without ENCOUNTER_START)
- Major redesigns
- Monetization
