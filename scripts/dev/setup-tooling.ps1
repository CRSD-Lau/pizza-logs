param(
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-Tool {
  param([string]$Name)
  Get-Command $Name -ErrorAction SilentlyContinue
}

function Refresh-SessionPath {
  $machine = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $user = [Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = @($machine, $user) -join ";"
}

function Add-UserPathIfExists {
  param(
    [string]$PathToAdd,
    [switch]$Prepend
  )

  if (-not $PathToAdd -or -not (Test-Path -LiteralPath $PathToAdd)) {
    return
  }

  $resolved = (Resolve-Path -LiteralPath $PathToAdd).Path.TrimEnd("\")
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $parts = @()
  if ($userPath) {
    $parts = $userPath -split ";" | Where-Object { $_ -and $_.Trim() }
  }

  $filtered = @($parts | Where-Object { $_.TrimEnd("\") -ine $resolved })
  if ($Prepend) {
    $newPath = (@($resolved) + $filtered) -join ";"
  } else {
    if ($filtered.Count -ne $parts.Count) {
      return
    }
    $newPath = (@($filtered) + $resolved) -join ";"
  }
  [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
  if ($Prepend) {
    Write-Host "Prioritized in User PATH: $resolved"
  } else {
    Write-Host "Added to User PATH: $resolved"
  }
}

function Install-WingetPackage {
  param(
    [string]$Id,
    [string]$Name
  )

  if ($SkipInstall) {
    Write-Host "Skipping install for $Name [$Id] because -SkipInstall was supplied."
    return
  }

  if (-not (Get-Tool "winget")) {
    Write-Warning "winget is not available; cannot install $Name [$Id]."
    return
  }

  Write-Host "Installing/checking $Name [$Id]..."
  winget install --id $Id --exact --accept-package-agreements --accept-source-agreements --silent
}

function Install-NpmGlobalPackage {
  param(
    [string]$Package,
    [string]$Name
  )

  if ($SkipInstall) {
    Write-Host "Skipping install for $Name [$Package] because -SkipInstall was supplied."
    return
  }

  if (-not (Get-Tool "npm")) {
    Write-Warning "npm is not available; cannot install $Name [$Package]."
    return
  }

  Write-Host "Installing/checking $Name [$Package] with npm..."
  npm install -g $Package
}

Write-Step "Refreshing PATH"
Refresh-SessionPath

Write-Step "PowerShell"
Write-Host "Current Windows PowerShell: $($PSVersionTable.PSVersion)"
if (-not (Get-Tool "pwsh")) {
  Install-WingetPackage -Id "Microsoft.PowerShell" -Name "PowerShell 7"
}

Write-Step "Package Managers"
if (Get-Tool "winget") {
  winget --version
} else {
  Write-Warning "winget is missing. Install App Installer from Microsoft Store before rerunning this script."
}

if (Get-Tool "choco") {
  choco --version
} else {
  Write-Host "Chocolatey is not installed; leaving it absent."
}

if (Get-Tool "scoop") {
  scoop --version
} else {
  Write-Host "Scoop is not installed; leaving it absent."
}

Write-Step "Required native tools"
$wingetTools = @(
  @{ Command = "git"; Id = "Git.Git"; Name = "Git for Windows" },
  @{ Command = "gh"; Id = "GitHub.cli"; Name = "GitHub CLI" },
  @{ Command = "node"; Id = "OpenJS.NodeJS.LTS"; Name = "Node.js LTS" },
  @{ Command = "python"; Id = "Python.Python.3.13"; Name = "Python 3" },
  @{ Command = "rg"; Id = "BurntSushi.ripgrep.MSVC"; Name = "ripgrep" },
  @{ Command = "fd"; Id = "sharkdp.fd"; Name = "fd" },
  @{ Command = "jq"; Id = "jqlang.jq"; Name = "jq" },
  @{ Command = "wt"; Id = "Microsoft.WindowsTerminal"; Name = "Windows Terminal" }
)

foreach ($tool in $wingetTools) {
  if (-not (Get-Tool $tool.Command)) {
    Install-WingetPackage -Id $tool.Id -Name $tool.Name
    Refresh-SessionPath
  } else {
    Write-Host "$($tool.Command) found at $((Get-Tool $tool.Command).Source)"
  }
}

Write-Step "Node package-manager helpers"
if (Get-Tool "node") {
  try {
    corepack enable | Out-Null
    Write-Host "Corepack enabled when available."
  } catch {
    Write-Warning "Corepack enable failed: $($_.Exception.Message)"
  }
}

if (-not (Get-Tool "pnpm")) {
  if (Get-Tool "corepack") {
    corepack prepare pnpm@latest --activate
  } else {
    Install-NpmGlobalPackage -Package "pnpm" -Name "pnpm"
  }
}

if (-not (Get-Tool "railway")) {
  Install-NpmGlobalPackage -Package "@railway/cli" -Name "Railway CLI"
}

Write-Step "Common User PATH entries"
$wingetPackageRoot = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
if (Test-Path -LiteralPath $wingetPackageRoot) {
  foreach ($exeName in "rg.exe","fd.exe","jq.exe") {
    $exe = Get-ChildItem -LiteralPath $wingetPackageRoot -Recurse -File -Filter $exeName -ErrorAction SilentlyContinue |
      Select-Object -First 1
    if ($exe) {
      Add-UserPathIfExists -PathToAdd $exe.DirectoryName -Prepend
    }
  }
}

$commonPaths = @(
  "C:\Program Files\Git\cmd",
  "C:\Program Files\GitHub CLI",
  "C:\Program Files\nodejs",
  "$env:APPDATA\npm",
  "$env:LOCALAPPDATA\Microsoft\WindowsApps",
  "$env:LOCALAPPDATA\Programs\Python\Python313",
  "$env:LOCALAPPDATA\Programs\Python\Python313\Scripts",
  "$env:LOCALAPPDATA\Programs\Python\Launcher",
  "C:\Program Files\Microsoft VS Code\bin",
  "C:\Program Files\Docker\Docker\resources\bin",
  "C:\Program Files\PostgreSQL\16\bin"
)

foreach ($path in $commonPaths) {
  Add-UserPathIfExists -PathToAdd $path
}

Refresh-SessionPath

Write-Step "Summary"
$checkTools = "pwsh","winget","git","gh","node","npm","npx","pnpm","python","pip","rg","fd","jq","curl","tar","ssh","railway","code","wt"
foreach ($name in $checkTools) {
  $lookupName = if ($name -eq "curl") { "curl.exe" } else { $name }
  $cmd = Get-Tool $lookupName
  if ($cmd) {
    Write-Host ("{0,-8} {1}" -f $name, $cmd.Source)
  } else {
    Write-Warning "$name is still missing."
  }
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Open a fresh PowerShell 7 terminal: pwsh"
Write-Host "  2. Run: .\scripts\dev\verify-tooling.ps1"
Write-Host "  3. Railway is checked but never deployed by these scripts."
