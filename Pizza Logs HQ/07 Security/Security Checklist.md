# Security Checklist

---

## Current Status

| Item | Status | Notes |
|---|---|---|
| Admin page auth | Done | `middleware.ts` + shared `lib/admin-auth.ts`; production fails closed without `ADMIN_SECRET` |
| Admin login cookie | Done | `/admin/login` sets `x-admin-secret` server-side as `HttpOnly`; secure by default in production |
| Admin cleanup actions | Done | `/admin` cleanup actions re-check admin auth and retain persistent roster/gear/item-template data |
| File upload validation | Partial | Accepts only `.txt`/`.log` in UI; server-side content validation is still limited |
| SQL injection | Safe | Prisma parameterizes queries |
| XSS | Safe | React escapes by default; no `dangerouslySetInnerHTML` in app code |
| Secrets in repo | Safe | `.env.local`, `.env.sync-agent`, logs, caches, and build outputs are ignored |
| CORS | N/A | Not an API consumed by third parties |
| Rate limiting | Open | Upload endpoint has no rate limit |
| File size limit | Open | UI documents 1GB; server route should enforce `MAX_FILE_SIZE_BYTES` while streaming |

---

## Production Checks

- Railway Web Service must define `ADMIN_SECRET`.
- Railway Web Service must not set `ADMIN_COOKIE_SECURE=false`; that override is only for local HTTP compose.
- `.env.local`, `.env.sync-agent`, Railway tokens, database URLs, API keys, and private keys must never be staged.

---

## Priority Fixes

### 1. Server-side file type and size validation

Validate upload content and enforce `MAX_FILE_SIZE_BYTES` before or while forwarding to the parser. If validation fails, return a structured SSE error event.

### 2. Upload rate limiting

Consider Railway-level protection first. If app-level limiting is needed, keep it simple and avoid in-memory-only assumptions for multi-instance deployments.

---

## Threat Model

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Someone uploads a huge file to waste resources | Medium | Parser/web resource exhaustion | Add hard server-side size enforcement and rate limiting |
| Admin page scraped for internal info | Low | Minor | Admin auth is live; verify Railway has `ADMIN_SECRET` |
| Malicious log file with injected data | Low | None | Parser treats logs as strings and does not execute content |
| DB connection string exposed | Low | Critical | Keep secrets in Railway/local env only; never commit them |
