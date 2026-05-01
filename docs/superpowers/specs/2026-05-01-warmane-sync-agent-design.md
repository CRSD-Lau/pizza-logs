# Warmane Sync Agent Design

## Context

Pizza Logs needs guild roster and player gear data from Warmane Armory for WotLK 3.3.5a. The live Railway deployment is a poor place to fetch that data directly because Warmane and Wowhead can challenge or block datacenter traffic. The current browser userscripts prove that fetching from a normal user network works better, but they still require manual page visits and leave the app dependent on whether the admin remembered to run a sync.

The next step is a laptop-primary sync agent. Neil's laptop will be the first automated collector. It will fetch Warmane Armory data from a normal residential connection, validate it locally, and post clean snapshots to the hosted Pizza Logs app. Railway remains the receiver, database, and UI.

This design does not use a residential proxy from Railway or attempt to bypass Cloudflare protections. It moves collection to a user-controlled machine that already has ordinary access to the public Armory pages.

## Goals

- Fully automate guild roster refreshes from Warmane Armory.
- Fully automate gear refreshes for roster members and known Pizza Logs players.
- Keep public player and guild pages usable when Warmane, Wowhead, or the laptop sync fails.
- Store only validated roster and gear snapshots.
- Make sync health visible from the admin page.
- Keep the first implementation laptop-only, with room for a desktop backup later.

## Non-Goals

- No Railway-side Cloudflare bypass or residential proxy integration.
- No attempt to infer unavailable Warmane data such as heroic difficulty.
- No in-game addon in the first implementation.
- No immediate deletion of roster members just because one roster sync no longer sees them.

## Architecture

The system will have three pieces:

1. A repo-local Node/TypeScript CLI sync agent.
2. Existing and hardened admin import APIs on the Railway app.
3. Snapshot-first database reads for roster and gear UI.

The initial command will be:

```bash
npm run sync:warmane
```

The laptop can run this command manually at first, then through Windows Task Scheduler once verified.

## Data Flow

```text
Laptop sync agent
  -> fetch Warmane guild HTML/API
  -> normalize and validate roster
  -> POST /api/admin/guild-roster/import
  -> POST /api/admin/armory-gear/missing
  -> fetch Warmane character summary for each queued player
  -> enrich static item metadata
  -> validate complete gear snapshot
  -> POST /api/admin/armory-gear/import
  -> write local run log and queue state
```

The web app should never fetch Warmane during normal page render. It should read the latest valid database snapshots and show stale data with last-sync timestamps when needed.

## Sync Agent Responsibilities

The agent will:

- Load configuration from environment variables or a local ignored config file.
- Use the live Pizza Logs origin by default: `https://pizza-logs-production.up.railway.app`.
- Use the configured admin secret to call protected import endpoints.
- Fetch the PizzaWarriors roster on Lordaeron from Warmane guild HTML first, then JSON as fallback.
- Ask Pizza Logs for missing or stale gear queue entries.
- Fetch each queued character from Warmane's character summary API.
- Enrich item metadata using the same normalization rules as the backend.
- Retry transient failures with backoff.
- Rate-limit Warmane requests to avoid hammering the Armory.
- Write a local log file with counts, failures, and next suggested action.

Suggested first schedule:

- Roster: every 6 hours.
- Gear queue: every 12 hours.
- Per-character delay: 2-3 seconds.
- Failed-character retry: no more than 3 attempts in one run.

## Backend Responsibilities

The backend import paths will become stricter:

- Reject HTML challenge pages, empty payloads, and Warmane error JSON.
- Reject roster imports with zero usable members.
- Reject gear imports with zero usable equipped items.
- Never overwrite a good gear snapshot with a failed, empty, or partial snapshot.
- Preserve previous item metadata when an enrichment source misses optional fields.
- Store sync status fields for visibility.

Desired status fields:

- `lastAttemptAt`
- `lastSuccessAt`
- `lastError`
- `sourceAgent`
- `sourceUrl`
- `snapshotVersion`

The first pass can reuse existing `lastAttemptAt`, `lastError`, and cache fields where available, then add fields only where the current schema cannot represent sync health cleanly.

## Roster Rules

Roster sync should be conservative:

- New valid members are inserted.
- Existing members are updated when seen again.
- Missing members are not deleted immediately.
- A member can be marked inactive only after repeated successful roster syncs where they are absent, or after a later explicit admin cleanup feature.

This prevents one bad Warmane response from wiping the guild roster.

## Gear Rules

Gear sync should be atomic per character:

- A character import updates the cache only after the payload validates.
- Empty equipment does not replace previous gear.
- Partial static metadata enrichment does not block import if the core Warmane equipment list is valid.
- Previous static metadata will be merged forward for the same item ID when the new source lacks `itemLevel`, `equipLoc`, or `iconUrl`.

The Warmane character summary remains the authority for which items are equipped. External item metadata sources only fill static fields needed for display and GearScore.

## Item Metadata

The first version will keep using the current Wowhead tooltip JSON enrichment where it works from the laptop. The more reliable follow-up is a local WotLK item metadata table keyed by item ID.

Preferred long-term metadata order:

1. Local WotLK item metadata table.
2. Previously cached metadata for the same item ID.
3. Wowhead WotLK tooltip JSON.
4. Cavern of Time or another static WotLK item source as fallback.

This reduces live dependency on Wowhead and makes GearScore stable.

## Admin Visibility

The admin page should show:

- Last roster sync success time.
- Last gear sync success time.
- Number of queued gear refreshes.
- Recent sync errors.
- Characters that repeatedly fail gear sync.
- Whether displayed data is fresh or stale.

This should make source breakage obvious without breaking public pages.

## Automation on Laptop

After the command works manually, add a Windows Task Scheduler PowerShell setup script that:

- Runs from the Pizza Logs repo directory.
- Uses the local Node runtime.
- Executes `npm run sync:warmane`.
- Writes logs to a local ignored `logs/` or `.sync/` directory.
- Runs every 6 or 12 hours while the laptop is awake.

Laptop is the only active sync agent in v1. Desktop backup can be added later using a backend lease/lock if needed.

## Error Handling

The agent should classify errors:

- `warmane_unavailable`
- `warmane_rate_limited`
- `warmane_invalid_payload`
- `pizza_logs_unauthorized`
- `pizza_logs_import_failed`
- `metadata_enrichment_failed`
- `network_timeout`

Unauthorized errors should stop the run immediately. Character-specific Warmane failures should be recorded and skipped so the rest of the queue can continue.

## Testing

Unit tests should cover:

- Warmane roster HTML normalization.
- Warmane roster JSON normalization.
- Gear payload validation.
- Rejection of HTML challenge/error responses.
- No overwrite of previous valid gear with empty gear.
- Queue selection for stale and missing players.

Integration or script-level tests should cover:

- Dry-run mode that fetches/parses but does not import.
- Import mode against local/dev origin.
- Failed character does not stop the whole queue.

## Rollout

1. Harden backend import validation and snapshot writes.
2. Add the local sync agent command with dry-run support.
3. Verify manually from the laptop.
4. Add admin sync health display.
5. Add Windows Task Scheduler setup docs/script.
6. Optional: add local item metadata table.
7. Optional: add desktop backup with backend lease.

## Decisions For V1

- Gear is stale after 24 hours for cached players and roster members.
- Roster inactive marking is not included in v1; missing members remain visible until a later admin cleanup feature exists.
- The first scheduler helper will be a PowerShell script, not documentation only.
