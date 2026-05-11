# Windows Guild Roster Sync Automation

Pizza Logs can refresh the PizzaWarriors/Lordaeron roster from Neil's Windows
PC without putting anything on Railway. Warmane blocks plain server-side and CLI
requests with 403, so this automation opens the real Warmane guild page at
logon and lets the Tampermonkey Guild Roster Sync userscript do the import from
the browser.

This setup persists through restarts with a quiet Startup folder launcher. The
userscript keeps refreshing hourly inside the existing Warmane tab, so Windows
does not create a new browser tab every hour.

## What It Does

- Opens the Warmane Pizza Warriors guild page at Windows logon from the Startup folder.
- Reuses the existing Warmane tab after that by letting the userscript schedule
  the hourly refresh in-page.
- Relies on the installed Pizza Logs Guild Roster Sync userscript to import the
  full roster.
- Writes launcher logs to `.sync-agent-logs/guild-roster-sync-launcher.log`.

The launcher does not store the Pizza Logs admin secret, `DATABASE_URL`, Railway
tokens, or other production secrets. The admin secret remains wherever the
browser userscript stores it for `armory.warmane.com`.

## Prerequisites

1. Install or update the production Guild Roster Sync userscript from `/admin`.
2. Open the Warmane guild page.
3. Click `Sync roster` once and enter the production admin secret.
4. Confirm Roster Sync shows the production target.

## Install The Quiet Launcher

From the repo root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\guild-roster-sync\install-windows-task.ps1
```

Or through npm:

```powershell
npm run guild-roster-sync:install-task
```

By default the launcher opens:

```text
https://armory.warmane.com/guild/Pizza+Warriors/Lordaeron/summary
```

To use the Windows default browser instead of auto-detecting Chrome or Edge:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\guild-roster-sync\install-windows-task.ps1 -UseDefaultBrowser
```

## Run Or Inspect

```powershell
Get-ChildItem "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\PizzaLogsGuildRosterSyncAtLogon.vbs"
Get-Content .\.sync-agent-logs\guild-roster-sync-launcher.log -Tail 20
```

## Uninstall

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\guild-roster-sync\uninstall-windows-task.ps1
```

Or through npm:

```powershell
npm run guild-roster-sync:uninstall-task
```

## Limits

- This is browser-assisted automation, not a Railway-side worker.
- It cannot run before the Windows user logs in, because the browser and
  Tampermonkey need an interactive user profile.
- If the PC is asleep or offline, the Startup folder launcher catches the next
  restart or login. If the Warmane tab is closed later, open it again manually
  or rerun the installer with `-RunNow`.
- Background tab timers are owned by the browser; if Windows or the browser
  suspends the tab, the next sync can be delayed until the tab wakes.
- The roster userscript must have the correct production admin secret saved once
  before automatic runs can post to Pizza Logs.
