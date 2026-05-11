[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$TaskName = "PizzaLogsGearSync"
)

$ErrorActionPreference = "Stop"

$schtasks = "schtasks.exe"
$startupCommandPath = Join-Path ([Environment]::GetFolderPath("Startup")) "PizzaLogsGearSyncAtLogon.cmd"
$removed = 0
$found = 0

& $schtasks /Query /TN $TaskName *> $null
if ($LASTEXITCODE -eq 0) {
  $found++
  if ($PSCmdlet.ShouldProcess($TaskName, "Delete Pizza Logs Gear Sync scheduled task")) {
    & $schtasks /Delete /TN $TaskName /F
    if ($LASTEXITCODE -ne 0) {
      throw "schtasks.exe delete failed with exit code $LASTEXITCODE."
    }
    $removed++
  }
}

if (Test-Path -LiteralPath $startupCommandPath) {
  $found++
  if ($PSCmdlet.ShouldProcess($startupCommandPath, "Remove Pizza Logs Gear Sync startup launcher")) {
    Remove-Item -LiteralPath $startupCommandPath -Force
    Write-Host "Removed startup launcher '$startupCommandPath'."
    $removed++
  }
}

if ($found -eq 0) {
  Write-Host "No scheduled task named '$TaskName' or startup launcher '$startupCommandPath' exists."
}
