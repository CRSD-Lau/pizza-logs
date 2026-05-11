[CmdletBinding()]
param(
  [string]$TargetUrl = "https://armory.warmane.com/character/Lausudo/Lordaeron/summary",
  [string]$BrowserPath = "",
  [switch]$UseDefaultBrowser
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
$logDir = Join-Path $repoRoot ".sync-agent-logs"
$logFile = Join-Path $logDir "gear-sync-launcher.log"

function Write-GearSyncLog {
  param([string]$Message)
  if (-not (Test-Path -LiteralPath $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  }
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $logFile -Value "[$stamp] $Message"
}

function Add-BrowserCandidate {
  param(
    [System.Collections.Generic.List[string]]$Candidates,
    [string]$BasePath,
    [string]$RelativePath
  )

  if ([string]::IsNullOrWhiteSpace($BasePath)) {
    return
  }

  $Candidates.Add((Join-Path $BasePath $RelativePath))
}

function Resolve-BrowserPath {
  if (-not [string]::IsNullOrWhiteSpace($BrowserPath)) {
    if (-not (Test-Path -LiteralPath $BrowserPath)) {
      throw "BrowserPath does not exist: $BrowserPath"
    }
    return (Resolve-Path -LiteralPath $BrowserPath).Path
  }

  if ($UseDefaultBrowser) {
    return $null
  }

  $candidates = [System.Collections.Generic.List[string]]::new()
  Add-BrowserCandidate $candidates $env:LOCALAPPDATA "Google\Chrome\Application\chrome.exe"
  Add-BrowserCandidate $candidates $env:ProgramFiles "Google\Chrome\Application\chrome.exe"
  Add-BrowserCandidate $candidates ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"
  Add-BrowserCandidate $candidates $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"
  Add-BrowserCandidate $candidates ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"
  Add-BrowserCandidate $candidates $env:LOCALAPPDATA "Microsoft\Edge\Application\msedge.exe"

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  return $null
}

try {
  if ($TargetUrl -notmatch "^https://armory\.warmane\.com/character/[^/]+/[^/]+/(summary|profile)([/?#].*)?$") {
    throw "TargetUrl must be a Warmane character summary or profile URL."
  }

  $browser = Resolve-BrowserPath

  if ($null -eq $browser) {
    Write-GearSyncLog "Opening $TargetUrl with the Windows default browser. Warmane Gear Sync userscript must be installed in that browser."
    Start-Process -FilePath $TargetUrl
  } else {
    Write-GearSyncLog "Opening $TargetUrl with $browser. Warmane Gear Sync userscript must be installed in that browser."
    Start-Process -FilePath $browser -ArgumentList @($TargetUrl)
  }
} catch {
  Write-GearSyncLog "Launch failed: $($_.Exception.Message)"
  throw
}
