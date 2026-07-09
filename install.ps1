# pordee — installer shim (Windows / PowerShell).
#
# Thin wrapper around bin/install.js (the unified Node installer). Every flag
# you'd pass to bin/install.js can be passed here; we just forward them.
#
# One-line install:
#   irm https://raw.githubusercontent.com/kerlos/pordee/main/install.ps1 | iex
#
# Local clone:
#   pwsh install.ps1 [flags]

function Install-Pordee {
  param(
    [string[]]$InstallerArgs = @()
  )

  $ErrorActionPreference = "Stop"
  $Repo = "kerlos/pordee"

  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    Write-Error @"
pordee: Node.js (>=18) required. Install:
  - winget install OpenJS.NodeJS.LTS
  - or download from https://nodejs.org
"@
    exit 1
  }

  $nodeMajor = [int](& node -p "process.versions.node.split('.')[0]")
  if ($nodeMajor -lt 18) {
    Write-Error "pordee: Node $nodeMajor too old. Need Node >=18."
    exit 1
  }

  if ($PSCommandPath) {
    $here = Split-Path -Parent $PSCommandPath
    $local = Join-Path $here "bin/install.js"
    if (Test-Path $local) {
      & node $local @InstallerArgs
      exit $LASTEXITCODE
    }
  }

  $npx = Get-Command npx -ErrorAction SilentlyContinue
  if (-not $npx) {
    Write-Error "pordee: npx required (ships with Node >=18)."
    exit 1
  }

  & npx -y "github:$Repo" @InstallerArgs
  exit $LASTEXITCODE
}

Install-Pordee -InstallerArgs $args
