# Pizza Logs — Warmane Sync Bridge Task Scheduler Setup
#
# Run from the Pizza Logs repo root directory:
#   powershell -ExecutionPolicy Bypass -File scripts\setup-sync-scheduler.ps1
#
# The task starts on login and runs the bridge continuously in the background.
# Logs go to .sync-agent-logs\sync.log in the repo directory.

param(
    [string]$TaskName = "PizzaLogs-WarmaneSync"
)

$RepoDir = (Get-Location).Path
$NodeExe  = (Get-Command node -ErrorAction Stop).Source
$TsNode   = Join-Path $RepoDir "node_modules\.bin\ts-node.cmd"
$LogDir   = Join-Path $RepoDir ".sync-agent-logs"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

if (-not (Test-Path $TsNode)) {
    Write-Error "ts-node not found at $TsNode — run npm install first."
    exit 1
}

$Action = New-ScheduledTaskAction `
    -Execute "cmd.exe" `
    -Argument "/c `"$TsNode`" --project tsconfig.sync.json sync-agent/index.ts >> `"$LogDir\sync.log`" 2>&1" `
    -WorkingDirectory $RepoDir

$Trigger = New-ScheduledTaskTrigger -AtLogon

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -MultipleInstances IgnoreNew `
    -RestartCount 5 `
    -RestartInterval (New-TimeSpan -Minutes 2) `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Pizza Logs Warmane sync bridge — polls Railway for sync jobs every 5s" `
    -Force

Write-Host ""
Write-Host "Task '$TaskName' registered successfully."
Write-Host ""
Write-Host "Commands:"
Write-Host "  Start now:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "  Stop:       Stop-ScheduledTask  -TaskName '$TaskName'"
Write-Host "  Remove:     Unregister-ScheduledTask -TaskName '$TaskName'"
Write-Host "  View log:   Get-Content '$LogDir\sync.log' -Tail 50 -Wait"
