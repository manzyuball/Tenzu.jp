param(
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Push-Location $root
try {
  node scripts/tenzu-quality-check.mjs
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
  if ($Strict) {
    Write-Host "Strict mode currently uses the same standalone checks as default mode."
  }
} finally {
  Pop-Location
}
