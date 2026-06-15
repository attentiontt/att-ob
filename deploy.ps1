param([string]$CommitMessage = "publish: 2026-06-15 10:29")

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "   test-ob Deploy Tool" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    $fallbackNode = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    if (Test-Path $fallbackNode) {
        $env:PATH = "$(Split-Path $fallbackNode -Parent);$env:PATH"
        Write-Host "  [OK] Node.js: $fallbackNode" -ForegroundColor Gray
    } else {
        Write-Host "  [ERROR] Node.js not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  [OK] Node.js: $($nodePath.Source)" -ForegroundColor Gray
}

$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "  [ERROR] Git not found" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Git: $($gitPath.Source)" -ForegroundColor Gray

$zDrive = Get-PSDrive Z -ErrorAction SilentlyContinue
if (-not $zDrive) {
    Write-Host "  [WARN] Z: drive not mounted, connecting..." -ForegroundColor Yellow
    net use Z: \\192.168.100.253\10技术部\临时 2>$null
    $zDrive = Get-PSDrive Z -ErrorAction SilentlyContinue
    if (-not $zDrive) {
        Write-Host "  [ERROR] Cannot connect Z: drive" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  [OK] Z: drive ready" -ForegroundColor Gray

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host ""
Write-Host "Step 1/4: Syncing notes from Z:\test-ob to content/..." -ForegroundColor Yellow
$contentDir = Join-Path $root "content"
if (Test-Path $contentDir) {
    Remove-Item "$contentDir\*" -Recurse -Force -Exclude ".trash",".obsidian","index.md" -ErrorAction SilentlyContinue
}
Copy-Item "Z:\test-ob\*" "$contentDir\" -Recurse -Force -Exclude ".trash",".obsidian"
$mdCount = (Get-ChildItem $contentDir -Recurse -Include "*.md" -Name -Force).Count
Write-Host "  Done: $mdCount notes" -ForegroundColor Green

Write-Host "Step 2/4: Updating FLEXPLORER sort order..." -ForegroundColor Yellow
try {
    $output = node update-flex-order.cjs 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Sort update failed" }
} catch {
    Write-Host "  [ERROR] $_" -ForegroundColor Red
    exit 1
}
Write-Host "  Sort data updated" -ForegroundColor Green

Write-Host "Step 3/4: Building site..." -ForegroundColor Yellow
try {
    $buildOutput = node ./quartz/bootstrap-cli.mjs build 2>&1
    $emitted = $buildOutput | Select-String -Pattern "Emitted"
    $done = $buildOutput | Select-String -Pattern "Done processing"
    Write-Host "  $($emitted.Line.Trim())" -ForegroundColor Gray
    Write-Host "  $($done.Line.Trim())" -ForegroundColor Gray
} catch {
    Write-Host "  [ERROR] Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "  Build OK" -ForegroundColor Green

Write-Host "Step 4/4: Committing and pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "$CommitMessage"
git -c http.sslbackend=openssl -c http.proxy="" push

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "  Deployment complete!" -ForegroundColor Cyan
Write-Host "  Actions: https://github.com/attentiontt/att-ob/actions" -ForegroundColor Cyan
Write-Host "  Pages:   https://attentiontt.github.io/att-ob/" -ForegroundColor Cyan
Write-Host "  Wait ~2 min for GitHub Actions build" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
