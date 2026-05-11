[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$TaskName = "PizzaLogsGearSync"
)

$ErrorActionPreference = "Stop"

$schtasks = "schtasks.exe"
$startupScriptPath = Join-Path ([Environment]::GetFolderPath("Startup")) "PizzaLogsGearSyncAtLogon.vbs"
$legacyStartupCommandPath = Join-Path ([Environment]::GetFolderPath("Startup")) "PizzaLogsGearSyncAtLogon.cmd"
$removed = 0
$found = 0

$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
try {
  & $schtasks /Query /TN $TaskName > $null 2>&1
  $queryExitCode = $LASTEXITCODE
} finally {
  $ErrorActionPreference = $previousErrorActionPreference
}

if ($queryExitCode -eq 0) {
  $found++
  if ($PSCmdlet.ShouldProcess($TaskName, "Delete Pizza Logs Gear Sync scheduled task")) {
    & $schtasks /Delete /TN $TaskName /F
    if ($LASTEXITCODE -ne 0) {
      throw "schtasks.exe delete failed with exit code $LASTEXITCODE."
    }
    $removed++
  }
}

foreach ($startupPath in @($startupScriptPath, $legacyStartupCommandPath)) {
  if (Test-Path -LiteralPath $startupPath) {
    $found++
    if ($PSCmdlet.ShouldProcess($startupPath, "Remove Pizza Logs Gear Sync startup launcher")) {
      Remove-Item -LiteralPath $startupPath -Force
      Write-Host "Removed startup launcher '$startupPath'."
      $removed++
    }
  }
}

if ($found -eq 0) {
  Write-Host "No scheduled task named '$TaskName' or startup launcher exists."
}
