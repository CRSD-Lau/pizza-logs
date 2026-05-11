# Windows Gear Sync Automation

Pizza Logs can run Warmane gear refreshes from Neil's Windows PC without putting
anything on Railway. Warmane blocks plain server-side and CLI requests with 403,
so the local automation opens a real Warmane character page and lets the
Tampermonkey Gear Sync userscript do the refresh from the browser.

This setup persists through restarts by combining one hourly Task Scheduler task
with one Startup folder launcher. Both run when the Windows user is logged in.

## What It Does

- Opens a Warmane character page once per hour.
- Opens the same page at Windows logon from the Startup folder.
- Relies on the installed Pizza Logs Gear Sync userscript to refresh all known
  Pizza Logs characters.
- Writes launcher logs to `.sync-agent-logs/gear-sync-launcher.log`.

The scheduled task does not store the Pizza Logs admin secret, `DATABASE_URL`,
Railway tokens, or other production secrets. The admin secret remains wherever
the browser userscript stores it for `armory.warmane.com`.

## Prerequisites

1. Install or update the production Gear Sync userscript from `/admin`.
2. Open a Warmane character page.
3. Click `Sync now` once and enter the production admin secret.
4. Confirm Gear Sync shows the production target.

## Install The Task

From the repo root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\gear-sync\install-windows-task.ps1
```

Or through npm:

```powershell
npm run gear-sync:install-task
```

By default the task opens:

```text
https://armory.warmane.com/character/Lausudo/Lordaeron/summary
```

To use a different Warmane character page:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\gear-sync\install-windows-task.ps1 -TargetUrl "https://armory.warmane.com/character/CharacterName/Lordaeron/summary"
```

To use the Windows default browser instead of auto-detecting Chrome or Edge:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\gear-sync\install-windows-task.ps1 -UseDefaultBrowser
```

## Run Or Inspect

```powershell
Start-ScheduledTask -TaskName PizzaLogsGearSync
Get-ScheduledTask -TaskName PizzaLogsGearSync
Get-ChildItem "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\PizzaLogsGearSyncAtLogon.cmd"
Get-Content .\.sync-agent-logs\gear-sync-launcher.log -Tail 20
```

## Uninstall

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\gear-sync\uninstall-windows-task.ps1
```

Or through npm:

```powershell
npm run gear-sync:uninstall-task
```

## Limits

- This is browser-assisted automation, not a Railway-side worker.
- It cannot run before the Windows user logs in, because the browser and
  Tampermonkey need an interactive user profile.
- If the PC is asleep or offline, the Startup folder launcher catches the next
  restart or login, and the hourly task resumes after Windows is active.
- If the browser opens many Warmane tabs, close old ones periodically or change
  the target browser/profile setup.
