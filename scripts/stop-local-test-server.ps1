param(
  [int[]]$Ports = @(3001, 8000),
  [switch]$StopPostgres,
  [switch]$DisableScheduledTask
)

$ErrorActionPreference = "Stop"
$hadStopError = $false

if ($DisableScheduledTask) {
  $task = Get-ScheduledTask -TaskName "PizzaLogsLocalTestServer" -ErrorAction SilentlyContinue
  if ($task -and $task.State -ne "Disabled") {
    Disable-ScheduledTask -TaskName "PizzaLogsLocalTestServer" | Out-Null
    Write-Output "Disabled scheduled task PizzaLogsLocalTestServer."
  } elseif ($task) {
    Write-Output "Scheduled task PizzaLogsLocalTestServer is already disabled."
  }
}

$connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object {
  $_.LocalPort -in $Ports
}

$processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  $process = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction SilentlyContinue
  if (-not $process) {
    continue
  }

  $isPizzaLogsServer = $process.CommandLine -match "PizzaLogs" -or
    $process.CommandLine -match "node_modules\\next\\dist" -or
    $process.CommandLine -match "uvicorn"

  if ($isPizzaLogsServer) {
    Stop-Process -Id $processId -Force
    Write-Output "Stopped $($process.Name) pid=$processId"
  } else {
    Write-Output "Skipped pid=$processId because it does not look like a Pizza Logs server"
  }
}

if ($StopPostgres) {
  $postgres = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $postgres) {
    Write-Output "No PostgreSQL service named postgresql* was found."
  } elseif ($postgres.Status -eq "Running") {
    try {
      Stop-Service -Name $postgres.Name -ErrorAction Stop
      Write-Output "Stopped PostgreSQL service $($postgres.Name)"
    } catch {
      Write-Warning "Could not stop PostgreSQL service $($postgres.Name): $($_.Exception.Message)"
      Write-Warning "Right-click the desktop stop script and choose Run as administrator if Windows blocks service control."
      $hadStopError = $true
    }
  } else {
    Write-Output "PostgreSQL service $($postgres.Name) is already $($postgres.Status)."
  }
}

if ($hadStopError) {
  exit 1
}
