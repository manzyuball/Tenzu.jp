param(
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Push-Location $root
try {
  $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
  if (Test-Path $bundledNode) {
    & $bundledNode scripts/tenzu-quality-check.mjs
  } else {
    node scripts/tenzu-quality-check.mjs
  }
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
  if ($Strict) {
    Write-Host "Strict mode currently uses the same standalone checks as default mode."
  }
} finally {
  Pop-Location
}
