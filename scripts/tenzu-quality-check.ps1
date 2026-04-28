param(
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$failures = New-Object System.Collections.Generic.List[string]
$htmlFiles = Get-ChildItem -Path $root -File -Filter '*.html'

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message) | Out-Null
}

foreach ($file in $htmlFiles) {
  $relative = Resolve-Path -Path $file.FullName -Relative
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)

  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Add-Failure "$relative has a UTF-8 BOM; Jekyll front matter may be exposed."
  }

  if ($bytes.Length -ge 3 -and -not ($bytes[0] -eq 0x2D -and $bytes[1] -eq 0x2D -and $bytes[2] -eq 0x2D)) {
    Add-Failure "$relative does not begin with front matter delimiter ---."
  }

  $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

  if ($text -match '(繝|縺|譛|蜊|蝓|髢|螟|謾|隕|邨|荳|逕|譁|豁ｴ|莠){3,}') {
    Add-Failure "$relative contains likely mojibake text."
  }

  if ($file.Name -ne 'archive-wikipedia-style-guide.html' -and $text -match '(?m)(\{\{(?:Infobox|Main|Reflist)|\[\[[^\]]+\]\]|^==[^=].*==\s*$)') {
    Add-Failure "$relative contains unconverted MediaWiki syntax."
  }
}

$hrefRegex = [regex]'href\s*=\s*"([^"#?]+?\.html)(?:[?#][^"]*)?"'
foreach ($file in $htmlFiles) {
  $relative = Resolve-Path -Path $file.FullName -Relative
  $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  foreach ($match in $hrefRegex.Matches($text)) {
    $href = $match.Groups[1].Value
    if ($href -match '^(https?:|mailto:|javascript:)') {
      continue
    }

    $localHref = $href
    if ($localHref.StartsWith('/Tenzu.jp/')) {
      $localHref = $localHref.Substring('/Tenzu.jp/'.Length)
    } elseif ($localHref.StartsWith('/')) {
      continue
    }

    $target = Join-Path $root $localHref
    if (-not (Test-Path -LiteralPath $target)) {
      Add-Failure "$relative links to missing page: $href"
    }
  }
}

$searchIndexPath = Join-Path $root 'assets/search-index.json'
try {
  $searchIndex = Get-Content -Raw -Encoding UTF8 $searchIndexPath | ConvertFrom-Json
  $indexedUrls = @{}
  foreach ($item in $searchIndex) {
    if ($item.url) {
      $indexedUrls[[string]$item.url] = $true
    }
  }

  foreach ($file in $htmlFiles) {
    if ($file.Name -eq '404.html') {
      continue
    }
    if (-not $indexedUrls.ContainsKey($file.Name)) {
      Add-Failure "$($file.Name) is missing from assets/search-index.json."
    }
  }
} catch {
  Add-Failure "assets/search-index.json is not valid JSON: $($_.Exception.Message)"
}

if ($failures.Count -gt 0) {
  Write-Host "Tenzu quality check failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Tenzu quality check passed." -ForegroundColor Green

if ($Strict) {
  Write-Host "Strict mode currently uses the same checks as default mode."
}
