param([string]$CommitMessage = "publish: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")

$ErrorActionPreference = "Stop"
# Keep the UNC path ASCII-only because Windows PowerShell 5 reads UTF-8 files
# without a BOM using the system code page. Literal Chinese path segments would
# otherwise become mojibake and point to a non-existent share.
$departmentFolder = -join [char[]]@(0x6280, 0x672F, 0x90E8)
$temporaryFolder = -join [char[]]@(0x4E34, 0x65F6)
$vaultShare = "\\192.168.100.253\10$departmentFolder\$temporaryFolder"
$vaultPath = "\test-ob"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$contentPath = Join-Path $root "content"
$checkOutput = [System.IO.Path]::GetFullPath((Join-Path $root ".quartz-deploy-check"))
$expectedCheckOutput = [System.IO.Path]::GetFullPath($root).TrimEnd("\") + "\.quartz-deploy-check"

if ($checkOutput -ne $expectedCheckOutput) {
  throw "Unexpected build-check path: $checkOutput"
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   test-ob One-Click Deploy" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# ---- CHECK DEPENDENCIES ----
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
  $fallbackNode = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  if (Test-Path $fallbackNode) {
    $env:PATH = "$(Split-Path $fallbackNode -Parent);$env:PATH"
  } else {
    throw "Node.js not found"
  }
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git not found"
}

# ---- MOUNT Z: DRIVE ----
Write-Host "Mounting the Obsidian vault..." -ForegroundColor Gray
# Removing a drive that is not currently mapped writes to stderr. PowerShell 5
# turns that harmless message into a terminating error when Stop is enabled, so
# suppress native errors only while refreshing the mapping.
$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
net use Z: /delete /y 2>$null | Out-Null
net use Z: $vaultShare 2>$null | Out-Null
$mapExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorActionPreference
if ($mapExitCode -ne 0) {
  throw "Cannot mount Z: to $vaultShare"
}

Set-Location $root
$vaultContent = "Z:$vaultPath"

# ---- STEP 1: INCREMENTAL SYNC ----
Write-Host "Step 1/4: Syncing changed notes..." -ForegroundColor Yellow
$rootIndexPath = Join-Path $contentPath "index.md"
$rootIndexBackup = if ((Test-Path $rootIndexPath) -and -not (Test-Path (Join-Path $vaultContent "index.md"))) {
  [System.IO.File]::ReadAllBytes($rootIndexPath)
} else {
  $null
}

# Robocopy compares size and modification time, so unchanged notes and images are
# no longer deleted and copied again on every publish. Exit codes below 8 are OK.
& robocopy $vaultContent $contentPath /MIR /FFT /COPY:DAT /DCOPY:DAT /R:2 /W:1 /XD ".obsidian" ".trash" /NFL /NDL /NP /NJH /NJS | Out-Null
$syncExit = $LASTEXITCODE
if ($syncExit -ge 8) {
  throw "Content sync failed (robocopy exit code $syncExit)"
}
if ($null -ne $rootIndexBackup -and -not (Test-Path $rootIndexPath)) {
  [System.IO.File]::WriteAllBytes($rootIndexPath, $rootIndexBackup)
}
$noteCount = (Get-ChildItem $contentPath -Recurse -Filter "*.md" -File -Force).Count
Write-Host "  Done: $noteCount notes available" -ForegroundColor Green

# ---- STEP 2: UPDATE NAVIGATION ORDER ----
Write-Host "Step 2/4: Updating navigation order..." -ForegroundColor Yellow
node update-flex-order.cjs
if ($LASTEXITCODE -ne 0) {
  throw "Navigation order update failed"
}

# ---- STEP 3: FAST LOCAL VALIDATION ----
# Build into a disposable folder. GitHub Actions performs the only production
# build, so generated public/ files are not committed and uploaded unnecessarily.
Write-Host "Step 3/4: Validating the site..." -ForegroundColor Yellow
try {
  if (Test-Path -LiteralPath $checkOutput) {
    Remove-Item -LiteralPath $checkOutput -Recurse -Force
  }
  node ./quartz/bootstrap-cli.mjs build --output $checkOutput
  if ($LASTEXITCODE -ne 0) {
    throw "Site validation build failed"
  }
  Write-Host "  Build OK" -ForegroundColor Green
} finally {
  if (Test-Path -LiteralPath $checkOutput) {
    Remove-Item -LiteralPath $checkOutput -Recurse -Force
  }
}

# ---- STEP 4: COMMIT SOURCE AND PUSH ----
Write-Host "Step 4/4: Publishing source changes..." -ForegroundColor Yellow
git add -A -- . ":(exclude)public/**"
if ($LASTEXITCODE -ne 0) {
  throw "Failed to stage changes"
}

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "  No source changes to publish" -ForegroundColor Gray
} else {
  git commit -m $CommitMessage
  if ($LASTEXITCODE -ne 0) {
    throw "Git commit failed"
  }
}

git -c http.sslbackend=openssl -c http.proxy="" push
if ($LASTEXITCODE -ne 0) {
  throw "Git push failed"
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Done! GitHub Pages is updating." -ForegroundColor Cyan
Write-Host "  https://attentiontt.github.io/att-ob/" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
