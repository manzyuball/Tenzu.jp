param(
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$failures = New-Object System.Collections.Generic.List[string]
$htmlFiles = Get-ChildItem -Path $root -File -Filter '*.html'
$articleSectionsPath = Join-Path $root '_data/article_sections.yml'
$articleSectionTypes = New-Object System.Collections.Generic.HashSet[string]

if (Test-Path -LiteralPath $articleSectionsPath) {
  $sectionText = [System.IO.File]::ReadAllText($articleSectionsPath, [System.Text.Encoding]::UTF8)
  foreach ($match in [regex]::Matches($sectionText, '(?m)^([a-z_]+):\s*$')) {
    [void]$articleSectionTypes.Add($match.Groups[1].Value)
  }
}

function Add-Failure {
  param([string]$Message)
  $failures.Add($Message) | Out-Null
}

function Get-FrontMatter {
  param([string]$Text)

  $result = @{}
  if ($Text -notmatch '(?s)^---\s*\r?\n(.*?)\r?\n---') {
    return $result
  }

  $currentKey = $null
  foreach ($line in ($Matches[1] -split "`r?`n")) {
    if ($line -match '^([A-Za-z0-9_]+):\s*(.*)$') {
      $currentKey = $Matches[1]
      $value = $Matches[2].Trim()
      if ($value -eq '') {
        $result[$currentKey] = @()
      } else {
        $result[$currentKey] = $value.Trim('"')
      }
    } elseif ($line -match '^\s*-\s+(.+)$' -and $currentKey) {
      if (-not ($result[$currentKey] -is [System.Collections.IList])) {
        $result[$currentKey] = @()
      }
      $result[$currentKey] = @($result[$currentKey]) + $Matches[1].Trim().Trim('"')
    }
  }

  return $result
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
  $frontMatter = Get-FrontMatter -Text $text

  if ($text -match '(繝|縺|譛|蜊|蝓|髢|螟|謾|隕|邨|荳|逕|譁|豁ｴ|莠){3,}') {
    Add-Failure "$relative contains likely mojibake text."
  }

  if ($file.Name -ne 'archive-wikipedia-style-guide.html' -and $text -match '(?m)(\{\{(?:Infobox|Main|Reflist)|\[\[[^\]]+\]\]|^==[^=].*==\s*$)') {
    Add-Failure "$relative contains unconverted MediaWiki syntax."
  }

  if ($file.Name -ne '404.html') {
    foreach ($requiredKey in @('layout', 'title', 'description', 'nav_section')) {
      if (-not $frontMatter.ContainsKey($requiredKey) -or [string]::IsNullOrWhiteSpace([string]$frontMatter[$requiredKey])) {
        Add-Failure "$relative is missing front matter key: $requiredKey"
      }
    }
  }

  if ($frontMatter.ContainsKey('article_type') -and -not $articleSectionTypes.Contains([string]$frontMatter['article_type'])) {
    Add-Failure "$relative has unknown article_type: $($frontMatter['article_type'])"
  }

  $ids = @{}
  foreach ($match in [regex]::Matches($text, 'id="(cite_note[^"]+)"')) {
    $id = $match.Groups[1].Value
    if ($ids.ContainsKey($id)) {
      Add-Failure "$relative contains duplicate citation id: $id"
    } else {
      $ids[$id] = $true
    }
  }
}

$hrefRegex = [regex]'href\s*=\s*"([^"#?]+?\.html)(?:[?#][^"]*)?"'
$publicForbiddenPatterns = @(
  'timeline-present-day\.html',
  '72時間',
  '沙苗失脚',
  '官邸拘束',
  '拘束下',
  '新膠着',
  '現代局面',
  '本編',
  '本作',
  '物語',
  '設定資料',
  '世界観',
  '入口ページ',
  '母艦記事',
  '読む順番',
  '主役記事',
  'カテゴリ',
  '現実の'
)
foreach ($file in $htmlFiles) {
  $relative = Resolve-Path -Path $file.FullName -Relative
  $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  foreach ($pattern in $publicForbiddenPatterns) {
    if ($text -match $pattern) {
      Add-Failure "$relative contains forbidden public-facing term or future reference: $pattern"
    }
  }
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

  foreach ($item in $searchIndex) {
    foreach ($requiredKey in @('title', 'url', 'summary', 'tags', 'article_type', 'nav_section', 'aliases', 'related')) {
      if (-not $item.PSObject.Properties.Name.Contains($requiredKey)) {
        Add-Failure "assets/search-index.json item '$($item.title)' is missing key: $requiredKey"
      }
    }
    $searchText = ($item | ConvertTo-Json -Depth 8)
    foreach ($pattern in $publicForbiddenPatterns) {
      if ($searchText -match $pattern) {
        Add-Failure "assets/search-index.json item '$($item.title)' contains forbidden public-facing term or future reference: $pattern"
      }
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
