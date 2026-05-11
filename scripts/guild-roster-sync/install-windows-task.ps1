[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$TaskName = "PizzaLogsGuildRosterSync",
  [string]$TargetUrl = "https://armory.warmane.com/guild/Pizza+Warriors/Lordaeron/summary",
  [int]$IntervalMinutes = 60,
  [int]$StartDelayMinutes = 8,
  [string]$BrowserPath = "",
  [switch]$UseDefaultBrowser,
  [switch]$RunNow
)

$ErrorActionPreference = "Stop"

if ($IntervalMinutes -lt 15) {
  throw "IntervalMinutes must be at least 15."
}

$launcherPath = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "open-warmane-guild-roster-sync.ps1")).Path
$startAt = (Get-Date).AddMinutes($StartDelayMinutes).ToString("HH:mm")
$startupFolder = [Environment]::GetFolderPath("Startup")
$startupCommandPath = Join-Path $startupFolder "PizzaLogsGuildRosterSyncAtLogon.cmd"

$taskArguments = @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-File",
  "`"$launcherPath`"",
  "-TargetUrl",
  "`"$TargetUrl`""
)

if (-not [string]::IsNullOrWhiteSpace($BrowserPath)) {
  $taskArguments += @("-BrowserPath", "`"$BrowserPath`"")
}

if ($UseDefaultBrowser) {
  $taskArguments += "-UseDefaultBrowser"
}

$taskCommand = "powershell.exe $($taskArguments -join ' ')"
$schtasks = "schtasks.exe"

function Invoke-Schtasks {
  param([string[]]$Arguments)

  & $schtasks @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "schtasks.exe failed with exit code $LASTEXITCODE."
  }
}

if ($PSCmdlet.ShouldProcess($TaskName, "Register hourly Pizza Logs Guild Roster Sync scheduled task")) {
  Invoke-Schtasks @(
    "/Create",
    "/TN", $TaskName,
    "/SC", "MINUTE",
    "/MO", "$IntervalMinutes",
    "/ST", $startAt,
    "/TR", $taskCommand,
    "/F"
  )

  Set-Content -LiteralPath $startupCommandPath -Value @(
    "@echo off",
    $taskCommand
  ) -Encoding ascii

  if ($RunNow) {
    Invoke-Schtasks @("/Run", "/TN", $TaskName)
  }

  Write-Host "Registered scheduled task '$TaskName'."
  Write-Host "Created startup launcher '$startupCommandPath'."
  Write-Host "Target URL: $TargetUrl"
  Write-Host "Interval: every $IntervalMinutes minutes, plus at logon."
}
